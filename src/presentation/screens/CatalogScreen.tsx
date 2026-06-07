import { ArrowUpRight, Boxes, ExternalLink } from "lucide-react";
import { useProjects } from "@application/hooks/use-projects";
import type { Project } from "@domain/entities/project.entity";
import { Badge } from "@presentation/components/core/Badge";
import { Button } from "@presentation/components/core/Button";
import { Card, CardContent } from "@presentation/components/core/Card";
import { Skeleton } from "@presentation/components/core/Skeleton";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="rounded-[1.5rem] border-[color:var(--color-border)] bg-white/80">
      <CardContent className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          {label}
        </p>
        <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
      </CardContent>
    </Card>
  );
}

function resolveAssetHref(value: string | File | undefined): string | null {
  if (value instanceof File) {
    return `/designs/sdc/${value.name}`;
  }

  if (typeof value !== "string" || !value.trim()) return null;

  if (/^(\/|https?:)/.test(value)) return value;

  return `/designs/sdc/${value.replace(/^\.\//, "")}`;
}

function ProjectCard({ project }: { project: Project }) {
  const designHref = resolveAssetHref(project.html);
  const designLabel = designHref
    ? designHref.replace(/^\/designs\/sdc\//, "")
    : typeof project.html === "string"
      ? project.html
      : project.html.name;

  return (
    <Card className="overflow-hidden border-[color:var(--color-border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,250,252,0.92))]">
      <CardContent className="flex h-full flex-col gap-5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent-ink)]">
                {project.group}
              </Badge>
              <Badge>{project.id}</Badge>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">
                {project.title}
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {project.description ||
                  "Proyecto gestionado desde el backend provisional."}
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-3 text-[color:var(--color-accent)]">
            <Boxes className="h-5 w-5" />
          </div>
        </div>

        <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Diseño
            </p>
            <p className="mt-1 font-medium text-slate-900">{designLabel}</p>
          </div>
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Web
            </p>
            <p className="mt-1 font-medium text-slate-900">{project.link}</p>
          </div>
        </div>

        {!!project.tags.length && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge
                key={tag}
                className="bg-white text-slate-600 ring-1 ring-inset ring-slate-200"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-auto flex flex-wrap gap-3">
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex"
          >
            <Button className="rounded-full px-5">
              <ExternalLink className="h-4 w-4" />
              Ver web
            </Button>
          </a>
          {designHref ? (
            <a
              href={designHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex"
            >
              <Button variant="secondary" className="rounded-full px-5">
                <ArrowUpRight className="h-4 w-4" />
                Ver diseño
              </Button>
            </a>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="flex flex-col gap-5 p-5">
            <div className="space-y-3">
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-7 w-2/3" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-11 w-44 rounded-full" />
              <Skeleton className="h-11 w-32 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function CatalogScreen() {
  const { data = [], isLoading, isError } = useProjects();

  return (
    <div className="flex flex-col gap-8 pb-10">
      <section className="relative overflow-hidden rounded-[2rem] border border-[color:var(--color-border-strong)] bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_28%),linear-gradient(145deg,_#fffef8_0%,_#f8fbff_52%,_#eef7f2_100%)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] lg:p-8">
        <div className="relative grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <Badge className="bg-slate-950 text-white">Project Hub</Badge>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                Dashboard de proyectos
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                Esta vista muestra únicamente el recurso Project: cantidad de
                proyectos, enlaces web y archivos de diseño asociados.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard label="Proyectos" value={data.length} />
              <StatCard
                label="Con web"
                value={data.filter((project) => project.link).length}
              />
              <StatCard
                label="Con diseño"
                value={data.filter((project) => project.html).length}
              />
            </div>
          </div>

          <Card className="rounded-[1.75rem] border-[color:var(--color-border-strong)] bg-slate-950 text-white shadow-none">
            <CardContent className="flex h-full flex-col gap-5 p-6">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                  Estado
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {isLoading
                    ? "Cargando proyectos"
                    : data.length
                      ? "Proyectos disponibles"
                      : "Sin proyectos aún"}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm text-white/90">
                Aquí se muestra el listado principal del recurso Project, sin
                manifest ni diseños de catálogo.
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {isError && (
        <div
          role="alert"
          className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
        >
          No se pudo cargar la lista de proyectos desde el backend provisional.
        </div>
      )}

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              Proyectos publicados
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Vista ejecutiva del recurso Project: web, diseño y tags asociados.
            </p>
          </div>
          <Badge className="bg-white text-slate-600 ring-1 ring-inset ring-slate-200">
            {data.length} proyecto(s)
          </Badge>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : data.length === 0 ? (
          <Card className="rounded-[1.75rem] border-dashed border-[color:var(--color-border-strong)] bg-white/70">
            <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
              <Boxes className="h-10 w-10 text-slate-300" />
              <h3 className="text-xl font-semibold text-slate-900">
                No hay proyectos para mostrar
              </h3>
              <p className="max-w-xl text-sm leading-6 text-slate-500">
                Crea tu primer proyecto desde la sección de administración para
                que aparezca aquí.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {data.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
