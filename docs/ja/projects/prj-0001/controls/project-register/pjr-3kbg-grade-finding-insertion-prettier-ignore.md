---
specdojo:
  id: prj-0001:pjr-3kbg-grade-finding-insertion-prettier-ignore
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-09-13T01:43:13Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-13T02:51:27Z"
  conclusion: insertFindings が finding コメントを対象ブロック直前のディレクティブコメント（prettier-ignore など）より前へ挿入するよう修正し、ディレクティブと表が分断されなくなった。分断していた cdfd 3 件と cdfd-template を整えて content_hash を再計算し、grade validate のずれ 0 件、prettier check 通過を確認した。
---

# PJR-3KBG grade apply の finding 挿入が prettier-ignore と表を分断し content_hash がずれる

## 1. 概要

grade apply は finding コメントを指摘行を含む最上位ブロックの直前へ挿入するが、ブロックの直前に `<!-- prettier-ignore -->` があると、その後ろ（ディレクティブと表の間）に入る。ディレクティブが効かなくなった表は commit 時の lefthook（prettier --write）で整形され、本文が content_hash と食い違って --changed-only で再選択される。成果物評価の 2 回目で評価済みの cdfd-agent-config-operation と cdfd-catalog-planning が再選択されたのはこれが原因で、grade validate でも content changed after the last grade として検出される。finding コメントは直前のディレクティブコメントより前に挿入し、既存の挿入済み文書も整える。

### 1.1. 再現

2026-09-12 の成果物評価（`JBR-grade-deliverable-9eff580278d3`）で `cdfd-agent-config-operation` と
`cdfd-catalog-planning` が評価され、結果を `7751f9a5` で commit した。翌 9/13 6 時枠の
`rtn-grade-deliverable-recheck` は両文書を `--changed-only` で再選択したが、その間に文書を変更した
commit はない。

```text
<!-- prettier-ignore -->
<!-- specdojo:finding id=F002 severity=major rule=vp-arc-cross-document-consistency line=24 ... -->
<!-- specdojo:finding id=F010 severity=minor rule=vp-ux-language-consistency line=24 ... -->

| プロセス ID | プロセス           | 業務目的 ...
```

`7751f9a5` の差分には、表のセル幅を揃える整形だけの行が含まれる。finding コメントがディレクティブと表を
分断したため、commit 時の lefthook `markdown` hook（`prettier --write`）が表を整形した結果である。

```text
$ specdojo grade validate --target deliverable
ERROR: .../cdfd-agent-config-operation.md: content changed after the last grade
ERROR: .../cdfd-catalog-planning.md: content changed after the last grade
```

同じ run で評価した `cdfd-init`、`cdfd-deprecation`、`cdfd-derived-content` は指摘行が
`prettier-ignore` 付きの表に当たらなかったため再選択されていない。

### 1.2. 影響

- 評価済み文書が変更なしで再評価され、1 文書あたり約 35 分の agent 実行と記録が無駄になる。
- 再評価のたびに同じ位置へ挿入され、commit のたびに整形されるため、評価と commit を繰り返す限り再発する。
- `content_hash` は finding コメントを除いて計算するため、挿入位置を直せば整形は起きず、ずれも解消する。

### 1.3. 対処の方向

`insertFindings`（`src/grade.ts`）は `markdownBlockRanges` で求めた最上位ブロックの直前へ挿入する。
ブロックの直前にディレクティブコメント（`<!-- prettier-ignore -->` など `specdojo:finding` 以外の
HTML コメント）が隣接している場合は、そのコメントのさらに前へ挿入する。既存文書で分断されている箇所は
次回の `grade apply` で並びを直すか、一括で整える。

### 1.4. 補足（2026-09-13 の 2 回目の run で確認）

- 9/13 の run で再評価した `cdfd-agent-config-operation` と `cdfd-catalog-planning` は、同じ位置へ
  finding が再挿入され、commit 時の整形で再びずれた。`cdfd-overview` も初回評価で同じ状態になり、
  ずれは 3 件に増えた。修正しない限り、評価と commit のたびに再発する。
- `insertFindings` は挿入時にブロックの前へ空行を 1 行足し、その空行を含む本文で `content_hash` を
  計算している（`withoutFindingComments` はコメント行だけを除く）。そのため、コメントをディレクティブの
  前へ手で移して空行を消しても hash 側と食い違う。修正では、挿入位置をディレクティブの前へ移すことと、
  ディレクティブとブロックの間に空行を残さないことの両方が要る。
- 再評価では、前回の finding を引き継いだ gemma の 2 段が閾値未満となり、codex の 3 段目が
  `skipped_condition` で走らない。不要な再選択を止めることが、判定精度の面でも重要である。

## 2. 完了条件

- `grade apply` が finding コメントを、対象ブロックの直前にあるディレクティブコメントより前へ挿入する。
  `<!-- prettier-ignore -->` と表の間に finding が入らない。
- 上記の 2 文書を含め、`grade validate --target deliverable` と `--target kata` で
  `content changed after the last grade` が残っていない（再評価または並び替えで解消する）。
- `npx prettier --check` を評価済み文書に対して実行しても差分が出ない。
- `insertFindings` の単体テストに、ディレクティブコメント直後のブロックへ挿入するケースを追加している。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit` が成功する。

## 3. 作業内容

| No  | 作業                                                    | 担当 | 状態 | メモ                                                       |
| --- | ------------------------------------------------------- | ---- | ---- | ---------------------------------------------------------- |
| 1   | `insertFindings` をディレクティブコメントの前へ挿入する | ARC  | done | 空白だけを挟む連続 HTML コメントも含めて前方へ補正した     |
| 2   | 単体テストを追加する                                    | ARC  | done | prettier-ignore 付き表、再適用、Prettier 後の安定性を固定  |
| 3   | 既存文書の分断箇所を整え、grade validate で確認する     | ARC  | done | 分断 3 箇所を修正し、対象 3 成果物の hash 不一致を解消した |

## 4. 対応結果

- `src/grade.ts` の finding 挿入位置を、対象 Markdown ブロックに付随する HTML コメント群の前まで
  戻すよう変更した。finding 除去後に空行が残る既存文書も次回適用時に正しい順序へ戻る。
- `tests/src/grade.test.ts` に `prettier-ignore` 付き表への挿入、旧順序からの再適用、Prettier 後の
  `content_hash` 安定性を確認する回帰テストを追加した。
- `cdfd-overview.md` の 2 箇所と `cdfd-template.md` の 1 箇所で finding を
  `prettier-ignore` より前へ移した。過去の自動整形で hash がずれた
  `cdfd-agent-config-operation.md`、`cdfd-catalog-planning.md`、`cdfd-overview.md` と、並び替えた
  `cdfd-template.md` の `content_hash` を現在本文へ同期した。
- `grade validate` の deliverable / kata 全件確認では `content changed after the last grade` が 0 件に
  なった。タスク対象外の未評価文書と、finding 集計が既存コメント数と一致しないテンプレートは引き続き
  全件検証エラーとして報告される。
- 本項目の残課題はない。

## 5. 関連ドキュメント

- `content_hash` の正規化: [[prj-0001:pjr-20dv-grade-content-hash-normalization]]
- 定期再評価の設計: [[prj-0001:pjr-t2kk-grade-recheck-routine]]
- 成果物評価の統合: [[prj-0001:pjr-08k1-deliverable-grade-done-criteria]]
