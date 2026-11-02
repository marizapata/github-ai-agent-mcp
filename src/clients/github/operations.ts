
import { createOctokit } from "./octokit.js";

// Importamos la función para controlar los reintentos
import { withRetry } from "../../utils/retry.js";

// Listamos los repositorios del usuario autenticado en GitHub
export async function listRepositories() {
  // Creamos el cliente autenticado de GitHub
  const octokit = createOctokit();

  // Consultamos todos los repositorios a los que tiene acceso el usuario
  const repositories = await withRetry(() =>
  octokit.paginate(
    octokit.rest.repos.listForAuthenticatedUser,
    {
      per_page: 100,
      sort: "updated",
    }
  )
);

  // Seleccionamos la información que necesitamos de cada repositorio
  return repositories.map((repository) => ({
    full_name: repository.full_name,
    owner: repository.owner.login,
    name: repository.name,
    private: repository.private,
    description: repository.description,
    html_url: repository.html_url,
  }));
}

 // Listamos las incidencias abiertas de un repositorio de GitHub
export async function listIssues(owner: string, repo: string) {
  // Creamos el cliente autenticado de GitHub
  const octokit = createOctokit();

  // Consultamos las incidencias abiertas del repositorio
  const issues = await withRetry(() =>
  octokit.paginate(
    octokit.rest.issues.listForRepo,
    {
      owner,
      repo,
      state: "open",
      per_page: 100,
    }
  )
);

  // Excluimos los pull requests, porque GitHub los incluye
  // en la respuesta de este endpoint
  const repositoryIssues = issues.filter(
    (issue) => !issue.pull_request
  );

  // Seleccionamos la información que necesitamos de cada incidencia
  return repositoryIssues.map((issue) => ({
    number: issue.number,
    title: issue.title,
    state: issue.state,
    html_url: issue.html_url,
    labels: issue.labels.map((label) =>
  typeof label === "string" ? label : label.name ?? ""
),
  }));
}


 // Creamos un nuevo repositorio en la cuenta autenticada de GitHub
export async function createRepository(
  name: string,
  description?: string
) {
  // Creamos el cliente autenticado de GitHub
  const octokit = createOctokit();

  // Enviamos la solicitud para crear el repositorio
  const { data: repository } =
    await octokit.rest.repos.createForAuthenticatedUser({
      name,
      description,
    });

  // Devolvemos la información principal del repositorio creado
  return {
    full_name: repository.full_name,
    owner: repository.owner.login,
    name: repository.name,
    private: repository.private,
    description: repository.description,
    html_url: repository.html_url,
  };
}


 // Creamos una incidencia en un repositorio de GitHub
export async function createIssue(
  owner: string,
  repo: string,
  title: string,
  body?: string
) {
  // Creamos el cliente autenticado de GitHub
  const octokit = createOctokit();

  // Enviamos la solicitud para crear la incidencia
 const { data: issue } = await octokit.rest.issues.create({
  owner,
  repo,
  title,
  body,
  headers: {
    "X-GitHub-Api-Version": "2026-03-10",
  },
});

  // Devolvemos la información principal de la incidencia creada
  return {
    number: issue.number,
    title: issue.title,
    state: issue.state,
    html_url: issue.html_url,
  };
}


 // Creamos un commit para agregar o modificar un archivo en GitHub
export async function createCommit(
  owner: string,
  repo: string,
  message: string,
  path: string,
  content: string
) {
  // Creamos el cliente autenticado de GitHub
  const octokit = createOctokit();

  // Verificamos si el archivo ya existe en el repositorio
  let sha: string | undefined;

  try {
    const { data: existingFile } =
      await octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        headers: {
          "X-GitHub-Api-Version": "2026-03-10",
        },
      });

    // Comprobamos que la ruta corresponda a un archivo
    if (Array.isArray(existingFile) || existingFile.type !== "file") {
      throw new Error("La ruta indicada no corresponde a un archivo.");
    }

    // Obtenemos el SHA necesario para actualizar el archivo
    sha = existingFile.sha;

  } catch (error: unknown) {
    // Si el archivo no existe, continuamos con su creación
    const status =
      typeof error === "object" &&
      error !== null &&
      "status" in error
        ? error.status
        : undefined;

    if (status !== 404) {
      throw error;
    }
  }

  // Creamos o actualizamos el archivo mediante un commit
  const { data: result } =
    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: Buffer.from(content, "utf-8").toString("base64"),
      ...(sha ? { sha } : {}),
      headers: {
        "X-GitHub-Api-Version": "2026-03-10",
      },
    });

  // Devolvemos la información principal del commit
  return {
    path: result.content?.path ?? path,
    sha: result.commit.sha,
    url: result.commit.html_url,
  };
}