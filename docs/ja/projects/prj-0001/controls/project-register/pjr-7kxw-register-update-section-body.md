---
specdojo:
  id: prj-0001:pjr-7kxw-register-update-section-body
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: medium
  registered_at: "2026-11-13T14:08:21Z"
  block_reason: "parent validation failed: lint-ts, lint-md"
  commit_type: feat
  commit_scope: register
---

# PJR-7KXW register update で、個票の章の本文をファイルから入れられるようにする

## 1. 概要

完了条件・作業内容・範囲などの章の本文を、CLI で差し替えられるようにする（orchestrator の Python での書き換えの置き換え）

## 2. 入力

- 2026-11-12〜13 の型の整備と夜間の実行で、orchestrator が手作業やシェルスクリプトで補った

## 3. 完了条件

- `register update` に、個票の 1 つの章の本文を差し替えるオプションを足す（例: `--section <章の名前> --section-file <path>`。名前は executor が決める）。章は見出しの番号を除いた名前（`完了条件` など）で指定する。
- 指定した章の見出しの行は残し、次の同じ深さの見出しまでの本文だけを、ファイルの中身で置き換える。ほかの章と frontmatter は変えない。
- 個票に無い章の名前、読めないファイル、見出しを含むファイルはエラーにし、個票を変えない。
- `--commit` と一緒に使える。変えた個票とイベントだけが commit される。イベントに章を差し替えたことが残る。
- 単体テストで、章の差し替え、ほかの章が変わらないこと、エラーの 3 つを確かめる。
- コマンドリファレンスの `register update` の節に、オプションと例を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。利用者に影響が無い場合はそう書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` が通り、親の検証が通る。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
