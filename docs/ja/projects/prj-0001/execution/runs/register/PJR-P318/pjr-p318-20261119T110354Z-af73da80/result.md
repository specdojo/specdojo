---
specdojo:
  id: prj-0001:xer-pjr-p318-20261119t110354z-af73da80
  type: exec-result
  task_id: PJR-P318
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-P318/pjr-p318-20261119T110354Z-af73da80/plan.md
  started_at: "2026-11-19T11:07:04.816Z"
  completed_at: "2026-11-19T11:16:48.119Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- `.github/dependabot.yml` を作り、運用メモへ検査の運用・例外手順・GitHub 設定・provenance の手順を足した。保護された `.github/workflows/` の audit 関門と CodeQL は案として個票に書いた。routine の調べの結論も個票に書いた。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/030-project-management/pm-orchestrator-playbook.md`: 変更、+43 / -1 行
- `.github/dependabot.yml`: 追加、+45 / -0 行

## 3. 申し送り

- 保護された設定の変更案（利用者承認のもと orchestrator が feature ブランチで反映）: 案 1 `.github/workflows/security-audit.yml` 新規（`pull_request`・`workflow_dispatch`・`workflow_call`。ルートの `npm audit --omit=dev --audit-level=high --json` を Node 標準のスクリプトで判定し、high 以上で止める。`AUDIT_EXCEPTIONS` は「GHSA-id 期限 PJR-ID」の行で期限付きの例外。全体と packages/docs-lint・docs-site の audit は報告だけ）。案 2 `publish-specdojo.yml` に `audit` ジョブ（`uses: ./.github/workflows/security-audit.yml`）を足し、`publish` に `needs: audit`。案 3 `.github/workflows/codeql.yml` 新規（`javascript-typescript`、`build-mode: none`、PR・main への push・毎週月曜）。全文は個票の対応結果「保護された設定の変更案」にある。
- 案 1 の判定スクリプトは sandbox で node を起動できず未実行。反映前に、試しの入力（high・例外の期限内・期限切れ・書式誤り・該当なし）と実際の `npm audit --omit=dev --json` 出力で確かめること。`github/codeql-action` の主版（v4）も反映時に確認すること。
- 決めた事項: 関門はルートの specdojo だけ。docs-lint の markdown-it の high（PJR-5CTM で範囲外）が残るため `packages/*` は報告だけにし、その項目が閉じたら関門へ移す。Dependabot の PR は `main` 宛て（security updates が既定ブランチにしか向かないため）で、merge せず feature ブランチで取り込む運用を運用メモに書いた。
- GitHub の設定は利用者が行う: Dependabot alerts と security updates（grouped security updates は無効）、secret scanning と push protection、private vulnerability reporting。CodeQL の default setup は advanced setup と並べて使えないため有効にしない。
- provenance: Trusted Publishing では自動で付くが、`npm stage publish` で付くかは未確認。次の公開で npm のページを確かめ、無ければ `--provenance` を足す案を起票する。
- routine の調べ: routine から直接は任意コマンドを流せないが、`kind: job` で呼ぶ `mode: command` の job から `npm audit` と `register add` を流せるので実現できる。同じ advisory の重複起票を防ぐ仕組みが無いため、必要なら `register add --dedupe-key` を足す項目を起票する。今回は routine を作らない。
- CHANGELOG の文案（区分: 変更）: 依存の更新を Dependabot で週 1 回 PR にし、配る依存の `npm audit`（high 以上）を PR と npm 公開の前の関門にし、CodeQL の解析を PR ごとと週 1 回流すようにした（PJR-P318）。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
