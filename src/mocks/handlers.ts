import { http, HttpResponse } from "msw";

const mockProjects = [
  {
    id: "project-1",
    group: "E-commerce",
    title: "Foodstore",
    description: "Proyecto demo para dashboard y gestión de diseños.",
    link: "https://example.com/foodstore",
    html: "/designs/sdc/foodstore-sdc.html",
    yaml: "/designs/sdc/foodstore-sdc.yaml",
    tags: ["demo", "backend"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let projectStore = [...mockProjects];

export const handlers = [
  http.get("/projects", () => {
    return HttpResponse.json({
      projects: projectStore,
      statusCode: 200,
      message: "OK",
    });
  }),

  http.get<{ id: string }>("/projects/:id", ({ params }) => {
    const project = projectStore.find((item) => item.id === params.id);
    if (!project)
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json({ project, statusCode: 200, message: "OK" });
  }),

  http.post("/projects", async ({ request }) => {
    const body = (await request.json()) as {
      group: string;
      title: string;
      description: string;
      link: string;
      html: File | string;
      yaml: File | string;
      tags: string[];
    };
    const project = {
      id: crypto.randomUUID(),
      ...body,
      html: body.html instanceof File ? body.html.name : body.html,
      yaml: body.yaml instanceof File ? body.yaml.name : body.yaml,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    projectStore = [project, ...projectStore];
    return HttpResponse.json(
      {
        project: { projectId: project.id },
        statusCode: 201,
        message: "Created",
      },
      { status: 201 }
    );
  }),

  http.patch<{ id: string }>("/projects/:id", async ({ params, request }) => {
    const body = (await request.json()) as Partial<{
      group: string;
      title: string;
      description: string;
      link: string;
      html: File | string;
      yaml: File | string;
      tags: string[];
    }>;
    const index = projectStore.findIndex((item) => item.id === params.id);
    if (index === -1)
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    const updated = {
      ...projectStore[index],
      ...body,
      html:
        body.html instanceof File
          ? body.html.name
          : (body.html ?? projectStore[index].html),
      yaml:
        body.yaml instanceof File
          ? body.yaml.name
          : (body.yaml ?? projectStore[index].yaml),
      updatedAt: new Date().toISOString(),
    };
    projectStore[index] = updated;
    return HttpResponse.json({
      project: updated,
      statusCode: 200,
      message: "OK",
    });
  }),

  http.delete<{ id: string }>("/projects/:id", ({ params }) => {
    projectStore = projectStore.filter((item) => item.id !== params.id);
    return HttpResponse.json({
      project: { projectId: params.id },
      statusCode: 200,
      message: "Deleted",
    });
  }),
];
