export type {
  DctKind,
  DctStatus,
  CriteriaItem,
  EvidenceRef,
  DctDeliverableItem,
  DctSection,
  DctTemplateDoc,
} from "../shared/catalog-render.js";
import type { DctSection, DctStatus } from "../shared/catalog-render.js";

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
