export interface Role {
  designation: string;
  duration: string;
  description: string[];
}

export interface CardItem {
  title: string;
  roles: Role[];
}

export interface SkillGroup {
  label: string;
  skills: string[];
}

export const about: string[] = [
  "I'm an AI Software Engineer working at the intersection of Generative AI and production software. My day-to-day spans RAG pipelines, agentic workflows with LangGraph, and benchmarking LLM inference under real GPU constraints.",
  "Before AI took over my calendar, I built large-scale data platforms — ingestion pipelines over a billion records, Elasticsearch at scale, and the unglamorous work of keeping production systems alive. That grounding shapes how I build AI systems: evaluated, observable, and shippable.",
];

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    skills: ["Python", "TypeScript", "SQL", "Bash"],
  },
  {
    label: "AI / ML",
    skills: ["LangGraph", "LangChain", "RAG", "PyTorch", "Hugging Face", "vLLM", "FAISS", "ChromaDB"],
  },
  {
    label: "Backend",
    skills: ["FastAPI", "Django", "React", "Celery", "RabbitMQ", "PostgreSQL"],
  },
  {
    label: "Data & Infra",
    skills: ["Elasticsearch", "AWS", "Docker", "Selenium", "Playwright", "Prometheus", "Grafana"],
  },
];

export const projects: CardItem[] = [
  {
    title: "Political Contributions Compliance Platform",
    roles: [
      {
        designation:
          "Python, Django, FastAPI, Elasticsearch, Celery, RabbitMQ, LangGraph, PostgreSQL, AWS",
        duration: "Feb 2025 – Present",
        description: [
          "Built scalable ingestion pipelines processing and indexing 1B+ records from 250–300+ U.S. government sources through APIs, Selenium, and CSV workflows.",
          "Modernized custom Python packages and migrated application components across 10–11 repositories, validating dependencies and behavior through systematic testing.",
          "Optimized bulk processing by reducing concurrent processes from 16 to 8; added GZIP-compressed CSV exports for 2GB+ files, reducing CPU/memory consumption and memory-exhaustion failures.",
          "Designed the HLD/LLD for the client's initial Generative AI initiative and developed a configuration-driven LangGraph pipeline with 9 reusable tools and database-managed prompts, extended across ~50 sources with 70–75% reusable coverage.",
          "Used Claude Code and Cursor to accelerate implementation, refactoring, debugging, and documentation while following existing engineering patterns.",
          "Automated ingestion error notifications and alerting, reducing manual monitoring effort by 70%.",
        ],
      },
    ],
  },
  {
    title: "Multimodal Property Damage Detection Pipeline",
    roles: [
      {
        designation:
          "Python, FastAPI, React, Pixtral, Llama, LangChain, Hugging Face Transformers",
        duration: "Oct 2024 – Jan 2025",
        description: [
          "Architected a multimodal AI pipeline with LangChain, Pixtral, and Llama for automated hail damage detection, achieving 89–90% accuracy across training and test datasets ranging from 1K–10K images.",
          "Implemented image classification and damage severity scoring with GPU-accelerated Hugging Face Transformers (BF16 models on NVIDIA A6000 GPUs), automating first-level damage screening.",
        ],
      },
    ],
  },
];

export const experiences: CardItem[] = [
  {
    title: "Paltech Consulting Private Limited",
    roles: [
      {
        designation: "Software Engineer – Python Full Stack & AI",
        duration: "Jul 2024 – Present",
        description: [
          "Built enterprise backend and data-processing workflows using Python, Django, FastAPI, Elasticsearch, Celery, RabbitMQ, AWS, and Docker for client-facing products and large-scale ingestion systems.",
          "Modernized the codebase from Python 3.6 to 3.11, reducing security vulnerabilities by over 80%. Resolved a critical Elasticsearch rate-limiting issue and restored production stability.",
          "Delivered client POCs using NVIDIA NIM and NVIDIA NeMo, deploying models on NVIDIA GPUs and evaluating configurations for efficient LLM model serving.",
          "Designed a RAG POC using FAISS and ChromaDB with metadata filtering to improve retrieval relevance and grounding. Benchmarked vLLM and SGLang under constrained GPU and RAM environments for LLM inference.",
          "Led a team of 5 engineers in building a Playwright-based scraping pipeline from the ground up, onboarding 150+ JavaScript-rendered international tender sources.",
        ],
      },
    ],
  },
  {
    title: "Ericsson",
    roles: [
      {
        designation: "AI Engineer Intern – GAIA Team",
        duration: "Jan 2024 – Jul 2024",
        description: [
          "Implemented an LLM observability pipeline using Prometheus, Jaeger, and Grafana for monitoring and troubleshooting. Evaluated Arize Phoenix, Traceloop (OpenLLMetry), OpenLIT, and IBM AIF360, reducing issue identification and troubleshooting time by 70%.",
        ],
      },
    ],
  },
];
