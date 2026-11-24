---
specdojo:
  id: prj-0001:pjr-7tva-commit-header-length
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: easy
  owner: DEV
  registered_at: "2026-11-24T02:35:38Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-6690
  commit_type: fix
  commit_scope: commitlint
---

# PJR-7TVA 長い task ID の run で、commit の見出しが commitlint の上限を超えて準備に失敗する

## 1. 課題内容

- `T-KATA-WAVE-6-PROJECT-prj-success-criteria-and-acceptance-criteria-sample-040` の準備の commit の見出し「exec(T-KATA-WAVE-6-PROJECT-prj-success-criteria-and-acceptance-criteria-sample-040): prepare execution」が 102 文字になり、commitlint の `header-max-length`（`@commitlint/config-conventional` の既定 100）を超えて、checkpoint の commit が失敗した（「Checkpoint commit failed: commitlint」「Claim rolled back (checkpoint failed)」）。
- 2026-11-23 の一括実行と 2026-11-24 の loop の両方で同じ失敗になり、タスクは todo に戻ったまま、変更範囲の予約だけが残って、範囲の重なる register の run（JA3M・C11R・F4TG）も止まった。

## 2. 入力

- v0.10.0 に入れる（2026-11-24、kata の一括実行で見つけた詰まり。利用者の方針: 今回の実行で詰まったところを issue として起票して直す）

## 3. 影響範囲

- task ID の長い型（local_id が長い sample）の run が、準備の段で必ず失敗する。
- 失敗が「likely a failing git hook」としか出ず、原因（見出しの長さ）が分かりにくい。

## 4. 対応方針

- `commitlint.config.cjs` の `header-max-length` を 120 にし、runner の commit の見出しが task ID の長さで落ちないようにする（オーケストレーターが会話の中で直す）。
- 120 を超える task ID がほかにないことを、今の schedule の task ID から確かめる。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。

## 5. 対応結果

- `commitlint.config.cjs` に `header-max-length: 120` を足した（2026-11-24、feature/prj-0001/commitlint-header-length を develop へ `--no-ff` で統合）。
- 今の schedule の task ID で、runner の準備の commit の見出し（`exec(<task-id>): prepare execution`）が 100 文字を超えるのは prj-success-criteria-and-acceptance-criteria-sample の 6 件で、最長は 102 文字だった。120 以内に収まる。
- 確認: 問題の見出しを `npx commitlint` に通し、エラーがないことを確かめた。統合の後、止まっていた `T-KATA-WAVE-6-PROJECT-prj-success-criteria-and-acceptance-criteria-sample-040` を流し直す。

CHANGELOG に書く事項:

- 区分: Fixed
- 文案: commitlint の見出しの上限を 120 文字にし、長い task ID の run の commit が準備の段で落ちないようにした（PJR-7TVA）。

## 6. 関連ドキュメント

- 関連: PJR-6690（一括実行の詰まりの issue）。
