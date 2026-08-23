export type DctKind = "work" | "control" | "generated";
export type DctStatus = "draft" | "ready" | "deprecated";

export type CriteriaItem = {
  text: string;
  roles: string[];
  viewpoint: string;
};

export type EvidenceRef = {
  kind: "implementation";
  path: string;
  purpose: string;
};

export type KataDeclaration = string | "undecided" | "not-needed";

export type DctDeliverableItem = {
  local_id: string;
  instance_id_pattern?: string;
  name: string;
  kind: DctKind;
  depends_on?: string[];
  overview: string;
  path?: string;
  rulebook?: KataDeclaration;
  recipe?: KataDeclaration;
  sample?: KataDeclaration;
  template?: KataDeclaration;
  evidence_refs?: EvidenceRef[];
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
  title?: string;
  rulebook?: string;
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
  title?: string;
  rulebook?: string;
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

export type DctIndexDomain = {
  domain: string;
  name: string;
  overview: string;
};

export type DctIndexDomainGroup = {
  name: string;
  domains: DctIndexDomain[];
};

export type DctIndexGroup =
  | DctIndexDomainGroup
  | {
      name: string;
      groups: DctIndexDomainGroup[];
    };

export type DctIndexDoc = {
  id: string;
  type: "project";
  status: DctStatus;
  title: string;
  rulebook: string;
  project_id: string;
  size: "small" | "medium" | "large";
  groups: DctIndexGroup[];
};

// dct-index.yaml is the declaration that orders domain catalogs, not a domain catalog itself.
export function isDctCatalogFileName(fileName: string): boolean {
  return /^dct-.+\.yaml$/.test(fileName) && fileName !== "dct-index.yaml";
}
