export interface RuntimeImportViolation {
  filePath: string;
  line: number;
  packageName: string;
  specifier: string;
}

export interface CheckSrcImportsOptions {
  repositoryRoot?: string;
  sourceRoot?: string;
  packageJsonPath?: string;
}

export function findRuntimeImportViolations(
  sourceText: string,
  filePath: string,
  allowedPackages: ReadonlySet<string>,
): RuntimeImportViolation[];

export function checkSrcImportsInDependencies(
  options?: CheckSrcImportsOptions,
): RuntimeImportViolation[];

export function formatRuntimeImportViolation(violation: RuntimeImportViolation): string;
