export type DctKind = "work" | "control" | "generated";
export type DctStatus = "draft" | "ready" | "deprecated";

export type CriteriaItem = {
  text: string;
  roles: string[];
  viewpoint: string;
};

export type DctDeliverableItem = {
  local_id: string;
  instance_id_pattern?: string;
  name: string;
  kind: DctKind;
  depends_on?: string[];
  overview: string;
  path?: string;
  rulebook?: string;
  done_criteria?: CriteriaItem[];
  note?: string;
  min_size?: string; // template-only: 'small' | 'medium' | 'large'
};

export type DctSection = {
  name?: string;
  base_path?: string;
  note?: string;
  min_size?: string; // template-only: 'small' | 'medium' | 'large'
  groups?: DctSection[];
  deliverables?: DctDeliverableItem[];
};

export type DctDoc = {
  id: string;
  type: "project";
  status: DctStatus;
  part_of?: string[];
  project_id: string;
  domain: string;
  base_path?: string;
  groups: DctSection[];
};

export type DctTemplateDoc = {
  id: string;
  type: "template";
  status: DctStatus;
  part_of?: string[];
  domain: string;
  base_path?: string;
  groups: DctSection[];
};

export type DctValidationResult = {
  ok: boolean;
  errors: string[];
  warnings: string[];
};
