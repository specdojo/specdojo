---
specdojo:
  id: prj-0001:pjr-xgjk-kata-declaration-migrate-to-rulebook
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: ARC
  registered_at: "2026-08-24T11:34:30Z"
  due_on: "2026-08-31"
---

# PJR-XGJK 実践の型の宣言をrulebook frontmatterへ移行する

## 1. 概要

PJR-3N21 の決定に従い、実践の型の要否と所在の正本を rulebook frontmatter へ一本化する。成果物カタログ208件から型宣言を削除して rulebook の宣言のみを残し、要否を rulebook 側へ移す。src/kata.ts の解決をカタログ優先から rulebook 正本へ変更し、kind が generated の成果物には型を適用しない導出を実装する。schema と検証も決定内容に合わせる。PJR-K4TA と PJR-JT1Y で導入した要否の4状態と判断基準は意味を変えず、置き場所のみを移す。

## 2. 完了条件

- 成果物カタログで型を宣言している234件から `recipe` / `sample` / `template` の宣言が削除され、`rulebook` の宣言のみが残っている。
- 削除前にカタログ側にあった要否の判断が、rulebook frontmatter 側へ漏れなく移されている。特に `not-needed` と `undecided` を失わない。移行前後の対応が確認できる形で記録されている。
- `src/kata.ts` の解決が rulebook frontmatter を正本とし、カタログを参照しない。
- `kind: generated` の成果物には型を適用しない。成果物ごとの宣言ではなく `kind` から導出する。
- schema が成果物カタログ側の型宣言を受け付けなくなっている。
- PJR-1Z1H で追加した宣言と実ファイルの双方向検証が、移行後の構造でも機能する。
- 検証を追加・変更する場合は、テスト用の最小構成リポジトリでも動作することを確認する。実リポジトリの構成を前提にしたファイルシステム走査は、ディレクトリ不在で失敗する。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run test:integration`、`catalog validate`、`catalog build` が成功する。

## 3. 作業内容

| No  | 作業                                                           | 担当 | 状態 | メモ                                    |
| --- | -------------------------------------------------------------- | ---- | ---- | --------------------------------------- |
| 1   | カタログ側の要否判断を rulebook frontmatter へ移す             | ARC  | done | 89系統へ移行し、競合6系統は未判断へ集約 |
| 2   | 成果物カタログ234件から型宣言を削除する                        | ARC  | done | template/sample を含む972宣言も削除     |
| 3   | `src/kata.ts` の解決を rulebook 正本へ変更する                 | ARC  | done | カタログの3種を参照しない               |
| 4   | `kind: generated` への非適用を `kind` からの導出として実装する | ARC  | done | 4種すべてを `_MISSING_` へ導出          |
| 5   | schema と双方向検証を移行後の構造へ合わせる                    | ARC  | done | DCTで3種を禁止し、rulebook側4状態を検証 |

## 4. 対応結果

- プロジェクト DCT 27ファイル・244成果物のうち3種を宣言していた234成果物から、`recipe` / `sample` / `template` を削除した。共通 DCT template/sample も同じ schema に従うため、全55ファイル・345成果物の324宣言行（3種合計972行）を削除し、成果物カタログには `rulebook` だけを残した。
- `kind: generated` 25件は移行元の要否集計から除外した。実行時は `kind` から4種すべてを非適用として導出し、成果物ごとの代替宣言は追加していない。
- 非生成成果物が参照する89本の rulebook へ要否を移した。移行後は、recipe が文書ID 17系統・`not-needed` 13系統・`undecided` 59系統、sample が文書ID 82系統・`not-needed` 7系統、template が文書ID 18系統・`not-needed` 12系統・`undecided` 59系統となった。既存の複数 sample 配列は所在情報として保持した。旧 `none` 20宣言は4状態の `not-needed` へ正規化した。
- 移行元で `not-needed` と `undecided` が混在した `gl-rulebook`、`opr-rulebook`、`sysd-index-rulebook`、`sysd-critical-flows-rulebook`、`sysd-cross-cutting-policy-rulebook`、`tsd-rulebook` は、recipe / template とも系統全体を確定扱いしない `undecided` へ集約した。旧 `not-needed` の存在と対象系統を本項へ記録し、PJR-K9KG での要否確定時に追跡できるようにした。
- `src/kata.ts` は rulebook frontmatter の明示宣言だけを解決し、未宣言時の慣例ファイル探索とカタログ優先経路を廃止した。`catalog validate` の成果物側実在検証は rulebook のみに限定し、rulebook frontmatter と実ファイルの双方向検証は最小構成リポジトリでディレクトリ不在を許容したまま維持した。
- `dct.schema.yaml` は成果物の3種宣言を追加プロパティとして拒否し、`rulebook-frontmatter.schema.yaml` は `undecided`・項目省略・文書ID・`not-needed` の4状態を受理する。関連する authoring standard、guide、DCT rulebook、exec plan template、unit test も新しい正本へ揃えた。
- 双方向検証により、`sample: not-needed` へ移した `ccd-mermaid-rulebook` / `ifd-mermaid-rulebook` に対して既存の `ccd-sample.md` / `ifd-sample.md` が未宣言となる警告を確認した。移行元の要否を変更したり既存 sample を削除したりせず、混在6系統の最終判断とともに [[prj-0001:pjr-k9kg-kata-requirement-existing-deliverables|PJR-K9KG 実在する成果物の要否確定]] で扱う。

## 5. 関連ドキュメント

- 根拠となる決定: [[prj-0001:pjr-3n21-kata-declaration-ssot-split|PJR-3N21 実践の型の要否と所在の正本を分ける]]
- 種別ごとの作成方針: [[prj-0001:pjr-vv3m-kata-creation-policy-by-type|PJR-VV3M 実践の型は種別ごとに作成方針を変える]]
- 要否判断の基準: [[specdojo:kata-guide|実践の型ガイド]]
- 移行対象を導入した項目: [[prj-0001:pjr-k4ta-kata-not-needed-declaration|PJR-K4TA 実践の型の要否宣言]]
- 要否の状態を整理した項目: [[prj-0001:pjr-jt1y-kata-undecided-state|PJR-JT1Y 実践の型の要否に未判断の状態を追加]]
- 所在の宣言を揃えた項目: [[prj-0001:pjr-1z1h-rulebook-sample-declaration-gap|PJR-1Z1H 実践の型の宣言の欠落を埋める]]
- 完了を待つ項目: [[prj-0001:pjr-k9kg-kata-requirement-existing-deliverables|PJR-K9KG 実在する成果物の要否確定]]
