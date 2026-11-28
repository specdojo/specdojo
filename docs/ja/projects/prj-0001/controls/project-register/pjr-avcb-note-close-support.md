---
specdojo:
  id: prj-0001:pjr-avcb-note-close-support
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  owner: DEV
  registered_at: "2026-11-28T07:20:46Z"
  due_on: "2026-11-30"
  block_reason: "parent validation failed: test-unit"
  derived_from:
    - PJR-CA6G
---

# PJR-AVCB note を done で close できるように rulebook と CLI を直す

## 1. 概要

PJR-CA6G の決定に沿って、register close で note を done にできるようにし、pjr-rulebook と登録簿運用ガイドとオーケストレーター本文の note の扱いを直す

## 2. 入力

- PJR-CA6G で note を done で close できるようにすると決めた（indie、2026-11-28）。rejected・deferred は note に使わない
- 今は src/register/update.ts が note の close を拒んでいる
- v0.10.0 に入れる。担当 DEV・期限 2026-11-30 は indie の指示（2026-11-28）

## 3. 完了条件

- PJR-CA6G の決定に沿って、`register close` で `item_type: note` を `done` にできるようにする。`--status` を省いたときの終端は `done` とし、`decided` など他の状態は拒む。
- `register reject` と `register defer` は、今と同じく note を終了コード 1 で拒む。案内の文言は「使い終わった note は `register close` で `done` にする」ことを示す形に直す。
- close した note は `register reopen` で `open` に戻せる。
- `register close` の note で `--conclusion` を必須にし、省くと終了コード 1 で拒む。conclusion には移した先または古くなった理由を書く旨を、エラーの文言に含める。
- `register build` の生成物で、done の note が `open` の一覧から外れ、ほかの type の done と同じ扱いになることを確かめる。
- 単体テストで、note の close（done）、`--status decided` の拒否、conclusion なしの拒否、reject・defer の拒否、reopen を確かめる。既存の「note は close できない」テストは新しい振る舞いに置き換える。
- 規範の文書を直す。対象は次の 3 つ（名前で書く）。
  - プロジェクト登録簿 作成ルール（pjr-rulebook）の item_type 別の終端基準の表と note の注記、例外的な追跡終了の前書き（note は close できるが rejected・deferred は使わない）。
  - 登録簿運用ガイドの、完了の表と、動いていない項目の整理の段落。
  - CLI コマンドリファレンスの register の note の段落。
- オーケストレーターの本文など保護された設定（`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`templates/` の配下のオーケストレーター本文を含む）は変えない。本文の type の表の note の終端状態と、note の扱いの段落の変更案を、個票の対応結果と報告の `handoff` に書く。
- 英語版の文書（`docs/en/`）に対応する文書があれば、同じ内容に直す。なければ何もしない。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run -s lint:md` を通し、親の検証を通す。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

1. `src/register/update.ts` の終端の共通ガードと、close の状態の決め方を読み、note の close だけを通す。
2. 単体テストを直して足す。
3. 規範の文書 3 つ（と英語版があればそれ）を直す。
4. オーケストレーター本文の変更案を対応結果に書く。
5. 検査を流し、対応結果に結果と「CHANGELOG に書く事項」を書く。

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
