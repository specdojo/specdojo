import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import {
  archivePlan,
  generateDeliverablePlan,
  resolveDeliverableTarget,
} from '../../src/exec-plans.js'
import { validateCatalogDomains, validateCatalogLocalIds } from '../../src/catalog-build.js'

let root: string

afterEach(() => {
  if (root) rmSync(root, { recursive: true, force: true })
})

function dctYaml(domain: string, localIds: string[]): string {
  const deliverables = localIds
    .map(id =>
      [
        `      - local_id: ${id}`,
        `        name: Name ${id}`,
        `        kind: work`,
        `        overview: overview ${id}`,
        `        path: ${id}.md`,
        `        done_criteria:`,
        `          - text: criterion for ${id}`,
        `            roles: [DEV]`,
        `            viewpoint: vp-dev-quality`,
      ].join('\n')
    )
    .join('\n')
  return [
    `id: prj-test:dct-${domain}`,
    'type: project',
    'status: draft',
    'project_id: prj-test',
    `domain: ${domain}`,
    `base_path: /docs/${domain}`,
    'groups:',
    '  - deliverables:',
    deliverables,
    '',
  ].join('\n')
}

function setupCatalog(): string {
  root = mkdtempSync(join(tmpdir(), 'specdojo-deliverable-'))
  const catalogPath = join(root, 'catalog')
  mkdirSync(catalogPath, { recursive: true })
  writeFileSync(join(catalogPath, 'dct-alpha.yaml'), dctYaml('alpha', ['shared', 'only-a']), 'utf8')
  writeFileSync(join(catalogPath, 'dct-beta.yaml'), dctYaml('beta', ['shared', 'only-b']), 'utf8')
  return catalogPath
}

describe('resolveDeliverableTarget', () => {
  it('resolves a bare local_id that is unique across catalogs', () => {
    const catalogPath = setupCatalog()

    const result = resolveDeliverableTarget(catalogPath, 'only-a')

    expect(result.domain).toBe('alpha')
    expect(result.localId).toBe('only-a')
    expect(result.slug).toBe('only-a')
    expect(result.info.deliverable.name).toBe('Name only-a')
  })

  it('errors on a bare local_id that is ambiguous across catalogs', () => {
    const catalogPath = setupCatalog()

    expect(() => resolveDeliverableTarget(catalogPath, 'shared')).toThrow(
      /ambiguous deliverable: shared .*alpha, beta/
    )
  })

  it('errors when the local_id is not found', () => {
    const catalogPath = setupCatalog()

    expect(() => resolveDeliverableTarget(catalogPath, 'nope')).toThrow(
      /deliverable not found: nope/
    )
  })
})

describe('generateDeliverablePlan', () => {
  it('writes <local_id>-plan.md from a catalog deliverable', async () => {
    const catalogPath = setupCatalog()
    const executionPath = join(root, 'execution')

    const target = resolveDeliverableTarget(catalogPath, 'only-a')
    const outPath = await generateDeliverablePlan({
      executionPath,
      projectId: 'prj-test',
      catalogPath,
      target,
    })

    expect(outPath).toBe(join(executionPath, 'exec', 'plans', 'only-a-plan.md'))
    const plan = readFileSync(outPath, 'utf8')
    expect(plan).toContain('task_id: only-a')
    expect(plan).toContain('criterion for only-a')
  })

  it('renders depends_on as project-qualified [[id]] refs for path expansion', async () => {
    root = mkdtempSync(join(tmpdir(), 'specdojo-deliverable-deps-'))
    const catalogPath = join(root, 'catalog')
    mkdirSync(catalogPath, { recursive: true })
    const yaml = [
      'id: prj-test:dct-gamma',
      'type: project',
      'status: draft',
      'project_id: prj-test',
      'domain: gamma',
      'base_path: /docs/gamma',
      'groups:',
      '  - deliverables:',
      '      - local_id: base-doc',
      '        name: Name base-doc',
      '        kind: work',
      '        overview: overview base-doc',
      '        path: base-doc.md',
      '      - local_id: dependent',
      '        name: Name dependent',
      '        kind: work',
      '        overview: overview dependent',
      '        path: dependent.md',
      '        depends_on: [base-doc]',
      '        done_criteria:',
      '          - text: criterion for dependent',
      '            roles: [DEV]',
      '            viewpoint: vp-dev-quality',
      '',
    ].join('\n')
    writeFileSync(join(catalogPath, 'dct-gamma.yaml'), yaml, 'utf8')
    const executionPath = join(root, 'execution')

    const target = resolveDeliverableTarget(catalogPath, 'dependent')
    const outPath = await generateDeliverablePlan({
      executionPath,
      projectId: 'prj-test',
      catalogPath,
      target,
    })

    const plan = readFileSync(outPath, 'utf8')
    expect(plan).toContain('- `depends_on`:\n  - [[prj-test:base-doc]]')
  })
})

describe('archivePlan', () => {
  function writePlan(executionPath: string, slug: string): string {
    const plansDir = join(executionPath, 'exec', 'plans')
    mkdirSync(plansDir, { recursive: true })
    const planPath = join(plansDir, `${slug}-plan.md`)
    writeFileSync(planPath, `# plan ${slug}\n`, 'utf8')
    return planPath
  }

  it('moves the plan to done/ with a UTC + random suffix', () => {
    root = mkdtempSync(join(tmpdir(), 'specdojo-archive-'))
    const executionPath = join(root, 'execution')
    const from = writePlan(executionPath, 'alpha-only-a')

    const result = archivePlan({ executionPath, slug: 'alpha-only-a' })

    expect(result.deleted).toBe(false)
    expect(existsSync(from)).toBe(false)
    expect(result.to).toBeDefined()
    expect(existsSync(result.to as string)).toBe(true)
    const doneFiles = readdirSync(join(executionPath, 'exec', 'plans', 'done'))
    expect(doneFiles).toHaveLength(1)
    expect(doneFiles[0]).toMatch(/^alpha-only-a-\d{8}T\d{6}Z-[0-9a-f]{4}-plan\.md$/)
  })

  it('deletes the plan when delete is set', () => {
    root = mkdtempSync(join(tmpdir(), 'specdojo-archive-'))
    const executionPath = join(root, 'execution')
    const from = writePlan(executionPath, 'alpha-only-a')

    const result = archivePlan({ executionPath, slug: 'alpha-only-a', delete: true })

    expect(result.deleted).toBe(true)
    expect(existsSync(from)).toBe(false)
    expect(existsSync(join(executionPath, 'exec', 'plans', 'done'))).toBe(false)
  })

  it('errors when the plan does not exist', () => {
    root = mkdtempSync(join(tmpdir(), 'specdojo-archive-'))
    const executionPath = join(root, 'execution')

    expect(() => archivePlan({ executionPath, slug: 'missing' })).toThrow(/plan not found/)
  })
})

describe('validateCatalogDomains', () => {
  it('reports duplicate domains across catalog files', () => {
    root = mkdtempSync(join(tmpdir(), 'specdojo-domains-'))
    const catalogPath = join(root, 'catalog')
    mkdirSync(catalogPath, { recursive: true })
    writeFileSync(join(catalogPath, 'dct-one.yaml'), dctYaml('dup', ['a']), 'utf8')
    writeFileSync(join(catalogPath, 'dct-two.yaml'), dctYaml('dup', ['b']), 'utf8')

    const result = validateCatalogDomains(catalogPath)

    expect(result.ok).toBe(false)
    expect(result.errors[0]).toMatch(/duplicate domain 'dup'/)
  })

  it('passes when every domain is unique', () => {
    const catalogPath = setupCatalog()

    expect(validateCatalogDomains(catalogPath)).toEqual({ ok: true, errors: [], warnings: [] })
  })
})

describe('validateCatalogLocalIds', () => {
  it('warns when a local_id is defined in multiple catalogs', () => {
    // setupCatalog defines `shared` in both alpha and beta catalogs.
    const catalogPath = setupCatalog()

    const result = validateCatalogLocalIds(catalogPath)

    expect(result.ok).toBe(true)
    expect(
      result.warnings.some(w => /local_id 'shared' is defined in multiple catalogs/.test(w))
    ).toBe(true)
  })

  it('passes with no warnings when every local_id is project-wide unique', () => {
    root = mkdtempSync(join(tmpdir(), 'specdojo-localid-'))
    const catalogPath = join(root, 'catalog')
    mkdirSync(catalogPath, { recursive: true })
    writeFileSync(join(catalogPath, 'dct-alpha.yaml'), dctYaml('alpha', ['a', 'b']), 'utf8')
    writeFileSync(join(catalogPath, 'dct-beta.yaml'), dctYaml('beta', ['c', 'd']), 'utf8')

    expect(validateCatalogLocalIds(catalogPath).warnings).toEqual([])
  })
})
