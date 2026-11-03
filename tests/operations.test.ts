
import { describe, it, expect, vi, beforeEach } from "vitest";

import {
  listRepositories,
  listIssues,
  createRepository,
  createIssue,
  createCommit,
} from "../src/clients/github/operations.js";

// Simulamos las funciones de Octokit.
const mocks = vi.hoisted(() => ({
  createOctokit: vi.fn(),
  paginate: vi.fn(),
  listForAuthenticatedUser: vi.fn(),
  listForRepo: vi.fn(),
  createForAuthenticatedUser: vi.fn(),
  createIssue: vi.fn(),
  getContent: vi.fn(),
  createOrUpdateFileContents: vi.fn(),
}));

// Sustituimos el cliente real por nuestro cliente simulado.
vi.mock("../src/clients/github/octokit.js", () => ({
  createOctokit: mocks.createOctokit,
}));

describe("GitHub operations", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    mocks.createOctokit.mockReturnValue({
      paginate: mocks.paginate,
      rest: {
        repos: {
          listForAuthenticatedUser: mocks.listForAuthenticatedUser,
          createForAuthenticatedUser: mocks.createForAuthenticatedUser,
          getContent: mocks.getContent,
          createOrUpdateFileContents: mocks.createOrUpdateFileContents,
        },
        issues: {
          listForRepo: mocks.listForRepo,
          create: mocks.createIssue,
        },
      },
    });
  });

  it("debe listar los repositorios correctamente", async () => {
    mocks.paginate.mockResolvedValue([
      {
        full_name: "marizapata/mi-repositorio",
        owner: { login: "marizapata" },
        name: "mi-repositorio",
        private: false,
        description: "Repositorio de prueba",
        html_url: "https://github.com/marizapata/mi-repositorio",
      },
    ]);

    const result = await listRepositories();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("mi-repositorio");
    expect(mocks.paginate).toHaveBeenCalled();
  });

  it("debe listar incidencias excluyendo los Pull Requests", async () => {
    mocks.paginate.mockResolvedValue([
      {
        number: 1,
        title: "Error de prueba",
        state: "open",
        html_url: "https://github.com/marizapata/repo/issues/1",
        labels: [{ name: "bug" }],
      },
      {
        number: 2,
        title: "Pull Request",
        state: "open",
        html_url: "https://github.com/marizapata/repo/pull/2",
        labels: [],
        pull_request: { url: "https://api.github.com/pulls/2" },
      },
    ]);

    const result = await listIssues("marizapata", "mi-repositorio");

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Error de prueba");
    expect(result[0].labels).toEqual(["bug"]);
  });

  it("debe crear un repositorio correctamente", async () => {
    mocks.createForAuthenticatedUser.mockResolvedValue({
      data: {
        full_name: "marizapata/nuevo-repo",
        owner: { login: "marizapata" },
        name: "nuevo-repo",
        private: false,
        description: "Repositorio nuevo",
        html_url: "https://github.com/marizapata/nuevo-repo",
      },
    });

    const result = await createRepository(
      "nuevo-repo",
      "Repositorio nuevo"
    );

    expect(result.name).toBe("nuevo-repo");
    expect(result.owner).toBe("marizapata");
  });

  it("debe crear una incidencia correctamente", async () => {
    mocks.createIssue.mockResolvedValue({
      data: {
        number: 10,
        title: "Incidencia de prueba",
        state: "open",
        html_url: "https://github.com/marizapata/repo/issues/10",
      },
    });

    const result = await createIssue(
      "marizapata",
      "mi-repositorio",
      "Incidencia de prueba",
      "Descripción de prueba"
    );

    expect(result.number).toBe(10);
    expect(result.title).toBe("Incidencia de prueba");
  });

  it("debe crear un archivo nuevo y actualizar uno existente", async () => {
    // Primer caso: el archivo no existe (404).
    mocks.getContent
      .mockRejectedValueOnce(
        Object.assign(new Error("Not Found"), { status: 404 })
      )
      // Segundo caso: el archivo ya existe.
      .mockResolvedValueOnce({
        data: {
          type: "file",
          sha: "sha-anterior",
        },
      });

    mocks.createOrUpdateFileContents
      .mockResolvedValueOnce({
        data: {
          content: { path: "prueba.txt" },
          commit: {
            sha: "sha-nuevo",
            html_url: "https://github.com/repo/commit/sha-nuevo",
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          content: { path: "prueba.txt" },
          commit: {
            sha: "sha-actualizado",
            html_url: "https://github.com/repo/commit/sha-actualizado",
          },
        },
      });

    // Creamos el archivo.
    const created = await createCommit(
      "marizapata",
      "mi-repositorio",
      "Crear archivo",
      "prueba.txt",
      "Hola GitHub"
    );

    // Actualizamos el mismo archivo.
    const updated = await createCommit(
      "marizapata",
      "mi-repositorio",
      "Actualizar archivo",
      "prueba.txt",
      "Contenido actualizado"
    );

    expect(created.sha).toBe("sha-nuevo");
    expect(updated.sha).toBe("sha-actualizado");

    // Comprobamos que la actualización utilice el SHA anterior.
    expect(mocks.createOrUpdateFileContents)
      .toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ sha: "sha-anterior" })
      );
  });
});