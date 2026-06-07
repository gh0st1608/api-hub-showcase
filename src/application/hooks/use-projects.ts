import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { container } from "@application/ports-impl/container";
import { projectQueryKeys } from "@application/hooks/query-keys";
import type {
  CreateProjectDto,
  UpdateProjectDto,
} from "@application/dto/project-dto";

export function useProjects() {
  return useQuery({
    queryKey: projectQueryKeys.all,
    queryFn: () => container.projects.list.execute(),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateProjectDto) =>
      container.projects.create.execute(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectQueryKeys.all });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateProjectDto }) =>
      container.projects.update.execute(id, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectQueryKeys.all });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => container.projects.delete.execute(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectQueryKeys.all });
    },
  });
}
