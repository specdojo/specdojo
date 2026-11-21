---
specdojo:
  id: prj-0001:pjr-n6fq-remove-antigravity-0-10
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-21T00:33:00Z"
  derived_from:
    - PJR-5V0T
---

# PJR-N6FQ 0.10.0 で Antigravity（agy）の対応を外す

## 1. 概要

provider の実装、配布テンプレート（templates/antigravity/ など）、init の選択肢、orchestrator launch、文書、テストから agy 対応を外す

## 2. 入力

- PJR-5V0T の決定（2026-11-21、indie）: 0.10.0 では agy の対応を外す
- 0.9.2 で agy の起動を止める作業は別の todo（PJR-5V0T を由来とする 0.9.2 の項目）で行う

## 3. 完了条件

- 対象の範囲を `grep -rliE 'antigravity|\bagy\b'` で `src`・`tests`・`templates`・`tools`・`scripts`・`docs/ja/specdojo`・`.agents`・`.github` から洗い出し、消したもの・残したもの（残した理由）を個票の対応結果に書く。
- antigravity の provider の実装（`src/exec`・`src/shared`・`src/commands`・`src/devcontainer`）と、0.9.2 で足した起動を止める処理を消す。0.9.2 の止める処理の代わりに、`agent-members.yaml` に provider が `antigravity` の member があると、理由と直し方を示すエラーになるようにする。
- 配布テンプレート（`templates/antigravity/`、`templates/init-agent-members.yaml`・`templates/init-exec-defaults.yaml`・`templates/devcontainer` の agy の部分）と、`init`・`config scaffold`・`devcontainer scaffold` の antigravity の選択肢を消す。
- オーケストレーターの agy 向けのラッパー（`.agents/rules` 側）を `orchestrator:sync` と `tools/validate-orchestrator-sync.mjs` の対象から外し、ラッパーのファイルを消す。`tools/update-agent-clis.mjs` などの道具からも agy を外す。
- テスト（`tests/src`・`tests/tools`）から agy の場合を消し、上のエラーのテストを足す。
- 文書（`docs/ja/specdojo` のガイド・リファレンス）から agy の説明を消す。過去の版の移行ガイドと CHANGELOG の過去の節は変えない。
- 保護された設定（`package.json` の `orch:argon`・`orch:flash` などのスクリプト、`.specdojo/agent-members.yaml`、`.specdojo/exec-defaults.yaml`）は変えない。変える案を個票の対応結果と報告の `handoff` に書く。反映は利用者の承認のもと feature ブランチで行う。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に、区分（削除）と行の文案を書く。0.9.x で agy の member を残している利用者向けの移行の手順（member を消す、routing を替える、スクリプトを消す）も文案に含める。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
