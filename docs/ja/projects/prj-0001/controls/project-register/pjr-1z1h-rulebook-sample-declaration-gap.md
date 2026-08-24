---
specdojo:
  id: prj-0001:pjr-1z1h-rulebook-sample-declaration-gap
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: BA
  registered_at: "2026-08-23T11:48:52Z"
  due_on: "2026-08-31"
  conclusion: "agent exited with non-zero code: 親runnerのvalidation（id: test-integration, source: runner, command: npm run test:integration）がstatus: failed（exit 1）である。runner validationは権威あるものとして上書きできないため、成果物編集自体（rule…"
---

# PJR-1Z1H rulebookのsample未宣言55本と成果物のrulebook未宣言10件を突き合わせる

## 1. 概要

sample の実ファイルは107本あり rulebook 106本とほぼ1対1だが、rulebook frontmatter で sample を宣言しているのは51本のみで、bps や bac など55本は実ファイルがあるのに未宣言である。実践の型の宣言箇所が rulebook frontmatter と成果物カタログの2か所にあり、片方が更新されていない。あわせてカタログ側で rulebook を宣言していない散文成果物10件も調査して宣言する。

現状の実害は限定的である。`src/kata.ts` はカタログに宣言があればそちらを優先するため、rulebook frontmatter の未宣言は解決結果を変えていない。ただし所在の情報が欠けたままでは、要否と所在を分離する際の前提が揃わない。分離そのものは別の決定として扱い、本項目は宣言の欠落を埋めることに限定する。

## 2. 完了条件

- rulebook frontmatter の recipe / sample / template 宣言が実ファイルの有無と一致している。実ファイルがあるのに未宣言の55本が解消されている。
- 宣言と実ファイルが食い違う場合（宣言があるのに実ファイルがない、実ファイルがあるのに未宣言）を検証で検知できる。
- 成果物カタログで rulebook を宣言していない散文成果物10件について、対応する rulebook の有無を調査し、あれば宣言し、なければ宣言しない理由を記録している。
- `src/kata.ts` の解決順序に関するコメントが実装と一致している。現状はコメントが「rulebook frontmatter の宣言を正とする」と述べているが、実装はカタログに宣言があればそちらを優先する。
- 要否（必要か不要か）と所在（実体がどの文書か）の分離は本項目では行わない。宣言の欠落を埋めることに範囲を限定する。
- `npm run validate:schema`、`catalog validate`、`catalog build`、`npm run test:unit` が成功する。

## 3. 作業内容

| No  | 作業                                                                               | 担当 | 状態 | メモ                         |
| --- | ---------------------------------------------------------------------------------- | ---- | ---- | ---------------------------- |
| 1   | rulebook frontmatter の型宣言と実ファイルを突き合わせ、未宣言55本を宣言する        | BA   | done | 所在の正本を完成させた       |
| 2   | 成果物カタログで rulebook 未宣言の散文成果物10件を調査し、宣言または理由を記録する | BA   | done | 8件を宣言し、2件は理由を記録 |
| 3   | 宣言と実ファイルの食い違いを検知する検証を追加する                                 | BA   | done | 双方向の欠落を対象にした     |
| 4   | `src/kata.ts` の解決順序のコメントを実装に合わせて修正する                         | BA   | done | 実装の優先順を正確に記載した |

## 4. 対応結果

- rulebook frontmatter が参照していた sample 51件に対し、実在するが未参照だった55件を追加し、sample 106件すべてを rulebook から宣言した。同一系統に複数の完成例がある OPD / OPR は `sample` を配列で宣言し、先頭を既定例として解決するよう schema・標準・実装を揃えた。あわせて、実在する同名 template が未宣言だった管理ログ3系統も宣言した。
- rulebook 未宣言の Markdown 成果物10件を調査した。`pjr-open-items` / `pjr-by-owner` / `pjr-by-priority` / `pjr-by-status` / `pm-decision-log` は、登録個票から生成する派生ビューまで適用範囲に含む `specdojo:pjr-rulebook` を宣言した。`pm-risk-register` / `pm-issue-log` / `pm-change-request-log` は各専用 rulebook を宣言した。
- `uis-index` / `bds-index` は Hub 専用 rulebook が存在せず、[[prj-0001:pjr-mwxs-uis-index-rulebook-bds-index-rulebook|PJR-MWXS uis-index / bds-index の実践の型（kata）一式の新設]] が bootstrap まで deferred のため、推測で個別成果物用 rulebook を流用せず未宣言を維持した。
- `catalog validate` から rulebook 宣言の双方向検査を実行するようにした。宣言済みファイルの不存在、既存 sample の未宣言、同名 recipe / template の未宣言を警告として検知する。複数 sample の解決・列挙と未宣言検知の単体テストを追加した。
- `src/kata.ts` のコメントを、カタログに recipe / sample / template のいずれかがあればカタログの宣言セットを優先し、未宣言種別は rulebook frontmatter へ戻らず慣例ファイルを探索する実装順序に合わせた。要否と所在の分離は [[prj-0001:pjr-3n21-kata-declaration-ssot-split|PJR-3N21 実践の型の要否と所在の正本を分ける]] の判断対象として残し、本項目では変更していない。
- schema・型検査・lint・catalog validate / build・register build・index build は成功した。`npm run test:unit` は単独で1回だけ実行したが、既知の [[prj-0001:pjr-17s7-unit-test-double-run-hang|PJR-17S7 executor が unit test を二度実行し、Vitest の終了待ちが収束しない]] と同じく開始後5分超結果が出ず、重複実行せず中断した。

## 5. 関連ドキュメント

- 要否判断の基準: [[specdojo:kata-guide|実践の型ガイド]]
- 種別ごとの作成方針: [[prj-0001:pjr-vv3m-kata-creation-policy-by-type|PJR-VV3M 実践の型は種別ごとに作成方針を変える]]
- 宣言を導入した項目: [[prj-0001:pjr-k4ta-kata-not-needed-declaration|PJR-K4TA 実践の型の要否宣言]]
- 要否の状態を整理した項目: [[prj-0001:pjr-jt1y-kata-undecided-state|PJR-JT1Y 実践の型の要否に未判断の状態を追加]]
