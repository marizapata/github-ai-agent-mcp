// DTO con la información principal de un repositorio de GitHub
export interface RepositoryDTO {
  full_name: string;
  owner: string;
  name: string;
  private: boolean;
  description: string | null;
  html_url: string;
}

// DTO con la información de una incidencia consultada
export interface IssueDTO {
  number: number;
  title: string;
  state: string;
  html_url: string;
  labels: string[];
}

// DTO con la información de una incidencia recién creada
export interface CreatedIssueDTO {
  number: number;
  title: string;
  state: string;
  html_url: string;
}

// DTO con la información del commit creado o actualizado
export interface CommitDTO {
  path: string;
  sha: string | undefined;
  url: string | undefined;
}

// DTO con la estructura común de respuesta de las herramientas MCP
export interface ToolResponseDTO {
  message: string;
}