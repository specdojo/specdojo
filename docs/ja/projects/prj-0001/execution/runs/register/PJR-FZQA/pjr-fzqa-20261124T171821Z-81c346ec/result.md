---
specdojo:
  id: prj-0001:xer-pjr-fzqa-20261124t171821z-81c346ec
  type: exec-result
  task_id: PJR-FZQA
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-FZQA/pjr-fzqa-20261124T171821Z-81c346ec/plan.md
  started_at: "2026-11-24T17:18:21.969Z"
  completed_at: "2026-11-24T17:32:33.923Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- Docs-site now copies each declared repository's `docs/ja/product/` to `/ja/product/&lt;name&gt;/`, applying the local config's `repos` overrides. It adds one sidebar section per repository, and wikilinks from project docs resolve by reading ids from frontmatter at build time (also as `&lt;name&gt;:&lt;id&gt;`). A missing repository is skipped with a warning and the build continues. Output is unchanged when no project declares `repos`. Unit tests, the guide, the config reference and the README are updated; the ticket records the work, decisions and CHANGELOG draft. The real site build was not run; the trial build after integration is left open for the orchestrator.

## 2. 変更ファイル

- `docs/ja/specdojo/guides/docs-editing-guide.md`: 変更、+40 / -0 行
- `docs/ja/specdojo/references/specdojo-config-reference.md`: 変更、+17 / -0 行
- `packages/docs-site/.vitepress/config.mts`: 変更、+65 / -7 行
- `packages/docs-site/.vitepress/kata-staging.ts`: 変更、+23 / -2 行
- `packages/docs-site/README.md`: 変更、+7 / -0 行
- `packages/docs-site/.vitepress/product-repos.ts`: 追加、+342 / -0 行
- `tests/packages/docs-site/product-repos.test.ts`: 追加、+318 / -0 行

## 3. 申し送り

- Doc index decision: ids of imported product docs are not added to `.specdojo/doc-index.json`. Docs-site reads them from frontmatter (`specdojo.id`, or else a top-level `id`) at build time and adds them only to the site's index. Reason: `specdojo index build` is shared with agents and plans, so mixing in site-only product paths has wide impact, and repositories that are not checked out then affect only the site, with no index rebuild.
- On an id collision the project's doc index wins, with a warning; between repositories the first one wins. Ids without `:` also resolve as `&lt;repo-name&gt;:&lt;id&gt;`. YAML docs resolve only when their yaml-pages generated page (`generated/&lt;name&gt;.md`, which is git-untracked) is present in the product repository.
- Other decisions: when several projects declare the same `name`, the first in project-id order wins. If the project repository itself has `docs/ja/product/&lt;name&gt;/`, the project's docs win and that repository's import is skipped with a warning. `dev` does not sync product-side edits; restart the server to pick them up.
- Remaining risk: an imported doc that links relatively outside `docs/ja/product/` (for example `../../projects/...`) sits one level deeper in the staging tree, becomes a dead link and fails the build. VitePress `ignoreDeadLinks` cannot filter by source page, so this is not handled. Check it in the orchestrator's trial build and open a separate item if needed.
- Left for the orchestrator after integration: build the site with a trial repository that declares `repos` and confirm the `/ja/product/&lt;name&gt;/` pages and sidebar section appear before close (ticket work item 5 is left `open`).
- No protected-configuration change is needed. `packages/docs-site/package.json` version and `CHANGELOG.md` are unchanged. The CHANGELOG category (Added, @specdojo/docs-site) and line draft are in the ticket's 'CHANGELOG に書く事項' subsection.

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
