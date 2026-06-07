import { useMemo } from "react";
import { Button } from "@presentation/components/core/Button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@presentation/components/core/Card";
import { Input } from "@presentation/components/core/Input";
import { useForm } from "@presentation/hooks/use-form";

export type ProjectFormValues = {
  group: string;
  title: string;
  description: string;
  link: string;
  html: File | string;
  yaml: File | string;
  tags: string;
};

interface ProjectFormProps {
  defaultValues?: Partial<ProjectFormValues>;
  onSubmit: (values: ProjectFormValues) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

function validate(values: ProjectFormValues) {
  const errors: Partial<Record<keyof ProjectFormValues, string>> = {};
  if (!String(values.title ?? "").trim())
    errors.title = "El título es obligatorio";
  if (!String(values.group ?? "").trim())
    errors.group = "El grupo es obligatorio";
  if (!String(values.link ?? "").trim())
    errors.link = "La URL del proyecto es obligatoria";
  return errors;
}

export function ProjectForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Guardar proyecto",
}: ProjectFormProps) {
  const initialValues = useMemo<ProjectFormValues>(
    () => ({
      group: defaultValues?.group ?? "",
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      link: defaultValues?.link ?? "",
      html: defaultValues?.html ?? "",
      yaml: defaultValues?.yaml ?? "",
      tags: defaultValues?.tags ?? "",
    }),
    [defaultValues]
  );

  const { values, errors, handleChange, handleSubmit, reset } =
    useForm<ProjectFormValues>(initialValues, validate);

  return (
    <Card className="rounded-[1.5rem] border-[color:var(--color-border)] bg-white/90 shadow-sm">
      <CardHeader className="px-6 py-5">
        <h3 className="text-lg font-semibold text-slate-950">
          Formulario de proyecto
        </h3>
        <p className="text-sm text-slate-500">
          Crea o edita el recurso de proyecto con un diseño y una URL web.
        </p>
      </CardHeader>
      <CardContent className="px-6 py-5">
        <form
          className="grid gap-4"
          onSubmit={handleSubmit((vals) => onSubmit(vals))}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Título"
              name="title"
              value={String(values.title ?? "")}
              onChange={handleChange}
              error={errors.title}
              placeholder="Ej. Foodstore"
            />
            <Input
              label="Grupo"
              name="group"
              value={String(values.group ?? "")}
              onChange={handleChange}
              error={errors.group}
              placeholder="Ej. E-commerce"
            />
          </div>
          <Input
            label="Descripción"
            name="description"
            value={String(values.description ?? "")}
            onChange={handleChange}
            placeholder="Describe el proyecto"
          />
          <Input
            label="URL del sitio"
            name="link"
            value={String(values.link ?? "")}
            onChange={handleChange}
            error={errors.link}
            placeholder="https://example.com"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="HTML"
              name="html"
              type="file"
              accept=".html"
              onChange={handleChange}
            />
            <Input
              label="YAML"
              name="yaml"
              type="file"
              accept=".yaml,.yml"
              onChange={handleChange}
            />
          </div>
          <Input
            label="Tags"
            name="tags"
            value={String(values.tags ?? "")}
            onChange={handleChange}
            placeholder="ui, backend, demo"
          />
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                reset();
                onCancel?.();
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={isLoading}>
              {submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
