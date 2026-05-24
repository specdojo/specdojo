import { type Command } from 'commander'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { loadConfig, loadEnv, specdojoRootDir } from './specdojo-config.js'
import {
  generateReviewPlan,
  generateReviewResult,
  scaffoldViewpoints,
  writeReviewPlan,
  writeReviewResult,
} from './review-plan.js'
import type { ReviewStage } from './review-types.js'

const VALID_STAGES: ReviewStage[] = ['draft', 'first', 'final', 'ready-candidate']

type ReviewPaths = {
  projectId: string
  catalogPath: string
  reviewsPath: string
  viewpointsPath: string
  baseDir: string
}

function resolveReviewPaths(opts: { project?: string }): ReviewPaths {
  loadEnv()
  const { config, configPath } = loadConfig()
  const baseDir = dirname(configPath)

  const projectId =
    opts.project?.trim() ||
    process.env.SPECDOJO_PROJECT?.trim() ||
    (config ? Object.keys(config.projects)[0] : '')

  if (!config) {
    throw new Error(`review commands require specdojo.config.json.\nRun: specdojo config init`)
  }
  if (!projectId) {
    throw new Error(`No project specified. Use --project <id> or SPECDOJO_PROJECT.`)
  }

  const project = config.projects[projectId]
  if (!project) {
    throw new Error(`Unknown project: ${projectId} (check ${configPath})`)
  }

  const catalogPath = project.catalog_path?.trim()
  if (!catalogPath) {
    throw new Error(
      `catalog_path not set for project '${projectId}' in ${configPath}.`
    )
  }

  const reviewsPath = project.reviews_path?.trim()
  if (!reviewsPath) {
    throw new Error(
      `reviews_path not set for project '${projectId}' in ${configPath}.\n` +
        `Add "reviews_path": "<path>" to the project config.`
    )
  }

  const viewpointsPath = project.viewpoints_path?.trim()
  if (!viewpointsPath) {
    throw new Error(
      `viewpoints_path not set for project '${projectId}' in ${configPath}.\n` +
        `Add "viewpoints_path": "<path>" to the project config.`
    )
  }

  return {
    projectId,
    catalogPath: resolve(baseDir, catalogPath),
    reviewsPath: resolve(baseDir, reviewsPath),
    viewpointsPath: resolve(baseDir, viewpointsPath),
    baseDir,
  }
}

function printCommandError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error)
  process.stdout.write(message + '\n')
  process.exitCode = 1
}

function addProjectOption(cmd: Command): Command {
  return cmd.option('--project <projectId>', 'Project id in specdojo.config.json')
}

export function registerReviewCommands(program: Command): void {
  const rev = program.command('review').description('Review plan generation commands')

  // --- where ---
  const wcmd = rev.command('where').description('Print resolved review paths')
  addProjectOption(wcmd)
  wcmd.action(opts => {
    try {
      const { reviewsPath, viewpointsPath } = resolveReviewPaths(opts)
      process.stdout.write(`reviews-path: ${reviewsPath}\n`)
      process.stdout.write(`plans       : ${join(reviewsPath, 'plans')}\n`)
      process.stdout.write(`results     : ${join(reviewsPath, 'results')}\n`)
      process.stdout.write(`viewpoints  : ${viewpointsPath}\n`)
    } catch (error) {
      printCommandError(error)
    }
  })

  // --- scaffold ---
  const scmd = rev
    .command('scaffold')
    .description('Generate pm-review-viewpoints.yaml from template')
  addProjectOption(scmd)
  scmd.option('--force', 'Overwrite existing pm-review-viewpoints.yaml', false)
  scmd.action(opts => {
    try {
      const { projectId, viewpointsPath } = resolveReviewPaths(opts)
      const templatePath = resolve(
        specdojoRootDir(),
        'docs/ja/specdojo/templates/pm-review-viewpoints-template.yaml'
      )

      if (!existsSync(templatePath)) {
        throw new Error(`Template not found: ${templatePath}`)
      }

      const { written, skipped } = scaffoldViewpoints({
        templatePath,
        projectId,
        outputPath: viewpointsPath,
        force: !!opts.force,
      })

      if (skipped) {
        process.stdout.write(
          `Skipped (already exists; use --force to overwrite): ${viewpointsPath}\n`
        )
      } else if (written) {
        process.stdout.write(`Created: ${viewpointsPath}\n`)
      }
    } catch (error) {
      printCommandError(error)
    }
  })

  // --- plan ---
  const pcmd = rev
    .command('plan')
    .description('Generate rvp-<local_id>-<stage>.yaml from catalog done_criteria')
  addProjectOption(pcmd)
  pcmd.requiredOption('--local-id <localId>', 'Deliverable local_id')
  pcmd.requiredOption(
    '--stage <stage>',
    `Review stage: ${VALID_STAGES.join(' | ')}`
  )
  pcmd.option('--role <roleCode>', 'Filter done_criteria by role code')
  pcmd.option('--force', 'Overwrite existing rvp-*.yaml', false)
  pcmd.option('--dry-run', 'Print generated YAML to stdout without writing', false)
  pcmd.action(opts => {
    try {
      const { projectId, catalogPath, reviewsPath, viewpointsPath } = resolveReviewPaths(opts)

      const stage = opts.stage as ReviewStage
      if (!VALID_STAGES.includes(stage)) {
        throw new Error(
          `Invalid --stage: "${stage}". Must be one of: ${VALID_STAGES.join(', ')}`
        )
      }

      const plan = generateReviewPlan({
        catalogPath,
        viewpointsPath,
        localId: opts.localId,
        stage,
        roleFilter: opts.role,
        projectId,
      })

      const { outputPath, skipped } = writeReviewPlan({
        reviewsPath,
        plan,
        force: !!opts.force,
        dryRun: !!opts.dryRun,
      })

      if (skipped) {
        process.stdout.write(
          `Skipped (already exists; use --force to overwrite): ${outputPath}\n`
        )
      } else if (!opts.dryRun) {
        process.stdout.write(
          `Generated: ${outputPath} (${plan.review_items.length} items)\n`
        )
      }
    } catch (error) {
      printCommandError(error)
    }
  })

  // --- result ---
  const rescmd = rev
    .command('result')
    .description('Scaffold rvr-<local_id>-<stage>-<role>.yaml from review plan')
  addProjectOption(rescmd)
  rescmd.requiredOption('--local-id <localId>', 'Deliverable local_id')
  rescmd.requiredOption('--stage <stage>', `Review stage: ${VALID_STAGES.join(' | ')}`)
  rescmd.requiredOption('--role <roleCode>', 'Role code (e.g. BA, QE, PO)')
  rescmd.option('--reviewer <nickname>', 'Reviewer nickname', '_TODO_')
  rescmd.option('--force', 'Overwrite existing rvr-*.yaml', false)
  rescmd.option('--dry-run', 'Print generated YAML to stdout without writing', false)
  rescmd.action(opts => {
    try {
      const { reviewsPath } = resolveReviewPaths(opts)

      const stage = opts.stage as ReviewStage
      if (!VALID_STAGES.includes(stage)) {
        throw new Error(
          `Invalid --stage: "${stage}". Must be one of: ${VALID_STAGES.join(', ')}`
        )
      }

      const result = generateReviewResult({
        reviewsPath,
        localId: opts.localId,
        stage,
        role: opts.role,
        reviewer: opts.reviewer as string,
      })

      const { outputPath, skipped } = writeReviewResult({
        reviewsPath,
        result,
        force: !!opts.force,
        dryRun: !!opts.dryRun,
      })

      if (skipped) {
        process.stdout.write(
          `Skipped (already exists; use --force to overwrite): ${outputPath}\n`
        )
      } else if (!opts.dryRun) {
        process.stdout.write(
          `Generated: ${outputPath} (${result.review_results.length} items)\n`
        )
      }
    } catch (error) {
      printCommandError(error)
    }
  })
}
