import { projects } from "@/data/portfolio";
import { FadeIn } from "@/components/FadeIn";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectCard } from "@/components/ProjectCard";
import { cn } from "@/lib/utils";

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-20 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <SectionHeading
            eyebrow="Selected work"
            title="Projects"
            subtitle="Generative AI, multimodal pipelines, and large-scale data platforms."
          />
        </FadeIn>
        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((project, index) => (
            <FadeIn
              key={project.title}
              delay={index * 0.1}
              className={cn(index === 0 && "lg:col-span-2")}
            >
              <ProjectCard
                title={project.title}
                role={project.roles[0]}
                featured={index === 0}
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
