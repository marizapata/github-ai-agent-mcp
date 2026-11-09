
import { createOctokit } from "./octokit.js";
import { withRetry } from "../../utils/retry.js";

import type {
  RepositoryDTO,
  IssueDTO,
  CreatedIssueDTO,
  CommitDTO,
} from "../../types.js";

// Listamos los repositorios del usuario autenticado en GitHub
export async function listRepositories(): Promise<RepositoryDTO[]> {
  const octokit = createOctokit();

  const repositories = await withRetry(() =>
    octokit.paginate(
      octokit.rest.repos.listForAuthenticatedUser,
      {
        per_page: 100,
        sort: "updated",
      }
    )
  );

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
export async function listIssues(
  owner: string,
  repo: string
): Promise<IssueDTO[]> {
  const octokit = createOctokit();

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

  // Excluimos los pull requests
  const repositoryIssues = issues.filter(
    (issue) => !issue.pull_request
  );

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
): Promise<RepositoryDTO> {
  const octokit = createOctokit();

  const { data: repository } =
    await octokit.rest.repos.createForAuthenticatedUser({
      name,
      description,
    });

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
): Promise<CreatedIssueDTO> {
  const octokit = createOctokit();

  const { data: issue } = await octokit.rest.issues.create({
    owner,
    repo,
    title,
    body,
    headers: {
      "X-GitHub-Api-Version": "2026-03-10",
    },
  });

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
): Promise<CommitDTO> {
  const octokit = createOctokit();

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

    if (Array.isArray(existingFile) || existingFile.type !== "file") {
      throw new Error("La ruta indicada no corresponde a un archivo.");
    }

    sha = existingFile.sha;
  } catch (error: unknown) {
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

  return {
    path: result.content?.path ?? path,
    sha: result.commit.sha,
    url: result.commit.html_url,
  };
}