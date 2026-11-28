---
specdojo:
  id: prj-0001:pjr-vdhc-release-v0-10-0
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: PO
  registered_at: "2026-11-28T11:19:22Z"
  due_on: "2026-11-30"
---

# PJR-VDHC v0.10.0 をリリースする

## 1. 概要

0.9.2 の公開の後に close した項目を CHANGELOG に集め、release ブランチで版を 0.10.0 に上げて検査し、利用者が PR の merge・タグ・npm の公開を行う

## 2. 入力

- 範囲（indie、2026-11-28）: v0.10.0 に入れると決めた項目（GDMB・HPAW・AVCB・CA6G・MACP・AG0C・DV1R・ZF6Q・QCJ5・D5RS・VKY2・VM2S など）が close 済みで、リリースの作業に入る
- v0.10.0 に入れないもの: PXNQ（リリース後に main の Dependabot を確かめる）、3R7V（`kata_locale`）、6XYD（普及の計画）、0BGE（全 sample のレビュー）、期限を 2026-12-31 に延ばした BA の項目（DJZD・MNM5・WYTX・T1D1・3APD・0T83・3R8F）
- CHANGELOG を集める範囲は、0.9.2 の公開（PJR-1FMG の close、2026-11-21T01:58:41Z）の後に close した項目
- 手順は pm-orchestrator-playbook の「リリースの手順」に従う。push・PR の merge・タグ・npm の公開の承認と、WSL の導入確認は利用者が行う。codex は 2026-12-01 1:00 まで使わない
- 担当 PO・期限 2026-11-30 は indie の指示（2026-11-28）

## 3. 完了条件

- 範囲の項目が close されていることを確かめている。利用者の確認が残る項目があれば、確認の結果で close するか、既知の制限として CHANGELOG に書いて次の版に回すかが決まっている。
- 版を変更内容から決め、利用者の確認を得ている。本体は `0.10.0`。`packages/docs-lint`・`packages/docs-site`・`packages/vscode-specdojo` は、前の公開の後に変更があるかを確かめ、版を上げるかを決める。
- `feature/prj-0001/release-v0.10.0` で `package.json` と `package-lock.json` の版を上げ、`CHANGELOG.md` に `## [0.10.0] - <日付>` の節を作っている。0.9.2 の公開（PJR-1FMG の close、2026-11-21T01:58:41Z）の後に close した項目の個票の「CHANGELOG に書く事項」を集め、register event の close の件数と、集めた個票の件数を照合している。
- ルートと `packages/*` の `npm ci` が通り、クリーンな作業ツリーで `npm run check:release` と `npm audit --omit=dev --audit-level=high` が通る。`npm run docs:build` が通る。
- `npm pack` の配布物を空の Git リポジトリへ入れ、`init`・`register add`・`exec run --register`（start から review まで）と、この版で変えた機能（`guarded-push --dry-run`・note の `register close`・`sync` の設定）を確かめている。
- 利用者が WSL で導入を確かめ（運用メモの「WSL の導入確認」）、WSL の版・package の版・実施日と結果を個票に記録している。
- release ブランチを develop へ `--no-ff` で取り込み、PR の本文と、push・PR 作成のコマンドを利用者に渡している。PR の merge・タグ・npm の公開（`npm stage` の承認を含む）は利用者が行う。
- 公開後に npm の `latest`、タグで起動した workflow の結果、npm から入れた版の動作を確かめている。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
