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

| No  | 作業                                                                               | 担当 | 状態 | メモ                           |
| --- | ---------------------------------------------------------------------------------- | ---- | ---- | ------------------------------ |
| 1   | rulebook frontmatter の型宣言と実ファイルを突き合わせ、未宣言55本を宣言する        | BA   | open | 所在の正本を完成させる         |
| 2   | 成果物カタログで rulebook 未宣言の散文成果物10件を調査し、宣言または理由を記録する | BA   | open | 実在する rulebook の有無を確認 |
| 3   | 宣言と実ファイルの食い違いを検知する検証を追加する                                 | BA   | open | 双方向の欠落を対象にする       |
| 4   | `src/kata.ts` の解決順序のコメントを実装に合わせて修正する                         | BA   | open | 実装は変更しない               |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- 要否判断の基準: [[specdojo:kata-guide|実践の型ガイド]]
- 種別ごとの作成方針: [[prj-0001:pjr-vv3m-kata-creation-policy-by-type|PJR-VV3M 実践の型は種別ごとに作成方針を変える]]
- 宣言を導入した項目: [[prj-0001:pjr-k4ta-kata-not-needed-declaration|PJR-K4TA 実践の型の要否宣言]]
- 要否の状態を整理した項目: [[prj-0001:pjr-jt1y-kata-undecided-state|PJR-JT1Y 実践の型の要否に未判断の状態を追加]]
