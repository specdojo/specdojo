---
specdojo:
  id: prj-0001:pjr-g5ab-init-without-catalog-prompt
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-18T06:20:11Z"
---

# PJR-G5AB init の対話からカタログの質問をなくす

## 1. 概要

対話式の init で成果物カタログの size（small など）を選ぶと、全ドメインの dct-*.yaml が一度に展開され、導入直後の利用者には何を残すかが分からない。導入直後に必要なのは register だけのため、対話からカタログの質問をなくし、--catalog の指定でだけ作る。成果物が定まったら catalog scaffold で足すよう案内する（2026-10-18、利用者が案 B を選んだ）

## 2. 完了条件

- 対話式の `specdojo init` で、成果物カタログの質問（`Deliverables catalog (none|small|medium|large)`）を出さない。対話の答えではカタログを作らない。
- `--catalog <size>` を指定した場合は、対話の有無にかかわらず今と同じくカタログを作る（`--yes` との組み合わせを含む）。
- `init` の最後の案内に、成果物が定まったら `catalog scaffold` で足せることと、そのとき `catalog_path` の設定が要ることを、参照先とあわせて 1〜2 行で示す。
- [[specdojo:quick-start-guide]] の対話の例からカタログの質問の行を除き、対話を省く例から `--catalog small` を外す。後から足す手順への案内を置く。
- [[specdojo:command-reference]] の `--catalog` の説明を、対話では聞かないことに合わせる。
- LP（`../specdojo-lp` の「初期設定する」）の説明と矛盾しないことを確かめ、result に書く。LP は変更しない。
- 単体テストで、対話でカタログを聞かないことと、`--catalog small` で今と同じファイルが作られることを確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [0.4.0] - 未定` の節に書く。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                                                | 担当 | 状態 | メモ |
| --- | --------------------------------------------------- | ---- | ---- | ---- |
| 1   | init の対話からカタログの質問をなくし、案内を改める | DEV  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[specdojo:quick-start-guide]]（影響先）
- [[prj-0001:pjr-hzw3-release-v0-4-0]]（0.4.0 の範囲）
