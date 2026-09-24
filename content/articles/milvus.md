---
title: "What is Milvus? How does it work?"
date: "2026-09-22"
summary: "Milvus is an open-source vector database for similarity search — here's how vectors vs. embeddings, dense vs. sparse indexes, and its storage-separated architecture actually fit together."
tags: [ai, milvus, vector-db]
---

> **TL;DR** — Milvus is an open-source vector database built for similarity search over dense embeddings and sparse vectors. It separates compute from storage: indexes and logs live in object storage (MinIO/S3) and metadata in etcd, while stateless Proxy, Coordinator, Streaming, Query, and Data nodes handle reads and writes. Dense vectors are stored per-chunk and indexed with vector indexes (FLAT, IVF, HNSW); sparse vectors use an inverted index. Same embeddings are portable to other vector DBs with a migration script.

---

## What is Milvus?

Milvus is an open-source vector database for storing, indexing, and searching vectors at scale — the piece that sits behind most RAG pipelines, semantic search, and recommendation features.

The mental model I use: your object storage (MinIO locally, S3 in production) holds the actual data, etcd holds the cluster state and metadata, and Milvus itself is the stateless compute layer that indexes that data and serves queries. That separation is why Milvus can scale reads and writes independently.

## Vectors vs. embeddings: a quick distinction

A **vector** is just an array of numbers — `[0.12, -0.03, 0.88, ...]`. By itself it carries no meaning.

An **embedding** is a vector *with* meaning: produced by an embedding model so that semantically similar texts end up close together in vector space.

Two follow-ups worth knowing:

- Classical sparse vectors like BM25 are lexical, not semantic — they record token weights, not meaning.
- Modern learned sparse models (e.g. SPLADE) *do* carry semantics in sparse form. So "sparse = no semantics" is no longer true — it depends on how the vector was produced.

## Dense vs. sparse: how Milvus stores each

Milvus supports both types side by side, but it stores and indexes them differently because their shapes are different.

**Dense embeddings** are fixed-dimension arrays — one per document chunk, e.g. 768 or 1536 floats from your embedding model. The simplest index is `FLAT` (brute-force exact search), with approximate indexes (`IVF_FLAT`, `HNSW`, etc.) for scale:

```python
# dense: one fixed-length vector per chunk
chunk_vector = [0.12, -0.03, 0.88, ..., 0.41]  # len == 768
```

Think of it as a table:

| chunk_id | dense_vector |
| -------- | ------------ |
| chunk_001 | `[0.12, -0.03, 0.88, ...]` |
| chunk_002 | `[0.09, 0.44, -0.21, ...]` |

**Sparse vectors** are variable-length `(token_id, weight)` pairs — mostly zeros, so you only store the non-zero entries. Milvus indexes these with an **inverted index**: token → list of documents containing it, plus weights:

```python
# sparse: only non-zero entries stored
sparse_vector = {15: 0.9, 2041: 0.42, 99102: 1.1}
```

| token_id | postings |
| -------- | -------- |
| 15 | `[(chunk_001, 0.9), (chunk_014, 0.3)]` |
| 2041 | `[(chunk_001, 0.42)]` |

At query time Milvus scores candidates from the inverted lists instead of scanning every dense dimension. That is also why hybrid search (dense + sparse) works well: you get semantic recall from dense and lexical precision from sparse, then fuse the scores.

## Can you migrate to another vector DB?

Yes — with a caveat. If two systems use the same embedding model and dimension (e.g. Milvus → Qdrant), migration is mostly a script: read vectors + payloads out of one, bulk-insert into the other, recreate the index config.

Where it gets annoying is across paradigms. Moving to something like `pgvector` often means rethinking indexing (HNSW/IVFFlat parameters differ), metadata schema, filtering syntax, and scaling assumptions. Portable in principle, not free in practice.

## What actually runs when you self-host Milvus?

With `docker compose` locally you get three containers:

1. **Milvus** (the database engine / API)
2. **etcd** — distributed key-value store for cluster metadata: collections, segments, node membership, timestamps. Persistent (Raft-backed), not just an in-memory cache.
3. **MinIO** — S3-compatible object storage for segments, logs, and built indexes.

In Milvus 2.6 terms the Milvus container itself fans out into roles:

![Milvus 2.6 system architecture showing proxy, coordinators, streaming, query, and data nodes backed by meta storage, WAL, and object storage](https://milvus-docs.s3.us-west-2.amazonaws.com/assets/milvus_architecture_2_6.png)

*Source: [Milvus docs](https://milvus.io/docs/architecture_overview.md) — proxy, coordinators, streaming/query/data nodes, with meta storage, WAL, and object storage underneath.*

- **Proxy** — stateless entry point. Validates requests, routes them.
- **Coordinator** — control plane. Knows which nodes own which segments/shards (often cached for routing).
- **Streaming Node** — ingests writes, appends to the WAL, holds "growing" (un-sealed) segments in memory.
- **Query Node** — serves reads over sealed segments + indexes loaded from object storage, plus growing data forwarded from streaming nodes. Search fans out, each level reduces TopK before returning upward.
- **Data Node** — background work: seals full segments, compacts small ones, builds indexes, writes results back to object storage. Query Nodes then load the fresh indexes.

Simplified flows:

**Write:** proxy → streaming node (append to WAL) → fills a growing segment → segment seals at capacity → data node compacts/indexes it → sealed segment + index land in object storage.

**Read:** proxy → coordinator (route to owners) → streaming node (fresh growing data) + query nodes (sealed data/indexes from object storage) → merge, reduce TopK at each level → return to client.

That is the whole trick: writes stream through the WAL for freshness, reads mostly hit pre-built indexes in object storage for scale, and no single node holds irreplaceable state.

## Closing note

If you only remember three things: embeddings are meaningful vectors, dense and sparse need different indexes (vector index vs. inverted index), and Milvus scales by keeping compute stateless and pushing durability to object storage + etcd. Once that clicks, the architecture diagram stops looking intimidating.
