import { useMemo, useState } from "react";
import { ExternalLink, FolderKanban, Pencil, Plus, Trash2 } from "lucide-react";
import {
  useCreateProject,
  useDeleteProject,
  useProjects,
  useUpdateProject,
} from "@application/hooks/use-projects";
import { Badge } from "@presentation/components/core/Badge";
import { Button } from "@presentation/components/core/Button";
import { Card, CardContent } from "@presentation/components/core/Card";
import { DataTable } from "@presentation/components/composite/DataTable";
import {
  ProjectForm,
  type ProjectFormValues,
} from "@presentation/components/composite/ProjectForm";
import { useToast } from "@presentation/components/core/Toast";

export function ProjectsScreen() {
  const { data = [], isLoading } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingProject = useMemo(
    () => data.find((item) => item.id === editingId) ?? null,
    [data, editingId]
  );

  const handleSubmit = (values: ProjectFormValues) => {
    const payload = {
      group: values.group,
      title: values.title,
      description: values.description,
      link: values.link,
      html: values.html,
      yaml: values.yaml,
      tags: values.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    if (editingProject) {
      updateProject.mutate(
        { id: editingProject.id, dto: payload },
        {
          onSuccess: () => {
            toast("Proyecto actualizado", "success");
            setEditingId(null);
          },
          onError: () => toast("No se pudo actualizar el proyecto", "error"),
        }
      );
      return;
    }

    createProject.mutate(payload, {
      onSuccess: () => toast("Proyecto creado", "success"),
      onError: () => toast("No se pudo crear el proyecto", "error"),
    });
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[1.75rem] border-[color:var(--color-border)] bg-white/90 p-6 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Administración
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-950">
                Proyectos
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Gestiona el inventario de proyectos desde un CRUD simple y
                mantén el dashboard sincronizado.
              </p>
            </div>
            <Badge className="bg-slate-950 text-white">
              {data.length} proyectos
            </Badge>
          </div>
        </Card>

        <ProjectForm
          defaultValues={
            editingProject
              ? {
                  group: editingProject.group,
                  title: editingProject.title,
                  description: editingProject.description,
                  link: editingProject.link,
                  html: editingProject.html,
                  yaml: editingProject.yaml,
                  tags: editingProject.tags.join(", "),
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={() => setEditingId(null)}
          isLoading={createProject.isPending || updateProject.isPending}
          submitLabel={
            editingProject ? "Actualizar proyecto" : "Crear proyecto"
          }
        />
      </section>

      <Card className="rounded-[1.75rem] border-[color:var(--color-border)] bg-white/90 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">
                Listado de proyectos
              </h2>
              <p className="text-sm text-slate-500">
                Accede a la web y al diseño asociado desde una sola vista.
              </p>
            </div>
            <Button variant="secondary" onClick={() => setEditingId(null)}>
              <Plus className="h-4 w-4" />
              Nuevo proyecto
            </Button>
          </div>
          <div className="mt-6">
            <DataTable
              data={data}
              loading={isLoading}
              getRowKey={(project) => project.id}
              emptyMessage="Aún no hay proyectos en el backend provisional."
              columns={[
                {
                  key: "title",
                  header: "Proyecto",
                  render: (project) => (
                    <span className="font-medium text-slate-950">
                      {project.title}
                    </span>
                  ),
                },
                {
                  key: "group",
                  header: "Grupo",
                  render: (project) => <Badge>{project.group}</Badge>,
                },
                {
                  key: "link",
                  header: "Web",
                  render: (project) => (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" /> {project.link}
                    </a>
                  ),
                },
                {
                  key: "html",
                  header: "Diseño",
                  render: (project) => (
                    <span className="text-slate-600">
                      {typeof project.html === "string"
                        ? project.html
                        : project.html?.name || "—"}
                    </span>
                  ),
                },
              ]}
              actions={(project) => (
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingId(project.id)}
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    variant="danger-ghost"
                    size="sm"
                    onClick={() =>
                      deleteProject.mutate(project.id, {
                        onSuccess: () => toast("Proyecto eliminado", "success"),
                        onError: () => toast("No se pudo eliminar", "error"),
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </Button>
                </div>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[1.75rem] border-dashed border-[color:var(--color-border-strong)] bg-white/80 shadow-sm">
        <CardContent className="p-6 text-sm text-slate-500">
          <div className="flex items-center gap-2 text-slate-700">
            <FolderKanban className="h-4 w-4" /> El CRUD de Project queda
            disponible aquí y el dashboard refleja únicamente los proyectos
            publicados.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
