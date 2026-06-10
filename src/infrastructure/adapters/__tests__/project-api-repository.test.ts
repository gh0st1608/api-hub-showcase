import { ProjectApiRepository } from "../project-api-repository";
import type { HttpClientPort } from "@domain/ports/http-client-port";

describe("ProjectApiRepository", () => {
  it("maps the backend paginated response into Project entities", async () => {
    const httpClient: HttpClientPort = {
      get: jest.fn().mockResolvedValue({
        items: [
          {
            id: "project-1",
            group: "frontend",
            title: "Demo",
            description: "Backend response",
            link: "https://example.com",
            html: "<html></html>",
            yaml: "name: demo",
            tags: ["test"],
            createdAt: "2026-06-07T00:00:00.000Z",
            updatedAt: "2026-06-07T00:00:00.000Z",
          },
        ],
        count: 1,
        nextPage: null,
      }),
      post: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
    };

    const repository = new ProjectApiRepository(httpClient);

    const result = await repository.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("project-1");
    expect(result[0].title).toBe("Demo");
    expect(httpClient.get).toHaveBeenCalledWith("/projects");
  });
});
