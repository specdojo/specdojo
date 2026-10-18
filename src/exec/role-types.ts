export type RoleDefinition = {
  code: string;
  name: string;
  project_note?: string;
};

export type RolesDoc = {
  id: string;
  type: string;
  status: string;
  project_id: string;
  roles: RoleDefinition[];
  [key: string]: unknown;
};
