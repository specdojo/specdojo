---
specdojo:
  id: prj-0001:pjr-8bsv-kata-sample-rule-mismatches
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: low
  difficulty: medium
  owner: sol-executor
  registered_at: "2026-11-10T12:27:37Z"
  derived_from:
    - PJR-T88P
  autopilot: approved
---

# PJR-8BSV ifx-cmd・bes の sample と規則の小さな食い違いを直す

## 1. 概要

grade（2026-11-10）が、ifx-cmd-sample の files の約束が規則の必須の項目を一部満たさないこと、bes-sample の仮の bes-index の参照に確認の手と担当・時期がないこと、売上の規則や記録のモデルを説明の文だけで書いていることなどを指摘した。sample と規則をそろえる。sf・cdt・ccd・bdd の残りの軽い指摘もここで扱う

## 2. 入力

- grade の run id kata-bsk-20261110 の minor の指摘から。軽い指摘は型を確定したうえで後で直す（indie が決定）。
- 2026-11-10 の型一式の確定で、ifx-cmd-rulebook を ready にすると validate:schema の enum の網羅の検査が落ちた（arguments の kind・`value_source`、type の template、status の ready・deprecated などの値の説明がない）。引数の表を持たない方針（PJR-4N3R）と、ready の rulebook に求める enum の網羅をどう両立するかを決めて直す。それまで ifx-cmd-rulebook は draft のまま。

## 3. 完了条件

1. `ifx-cmd-rulebook.md`:
   - `docs/specdojo/schemas/v1/ifx-cmd.schema.yaml` に定義されたすべての string enum（`type` の `template`、`status` の `ready`・`deprecated`、`arguments` の `kind`・`value_source` 含む）の説明が本文に含まれ、enum 網羅検査を満たす状態になっていること。
   - 引数表を持たない方針（PJR-4N3R）を維持し、過去の互換性定義であることを明記していること。
   - `files` の記述指針に、CLI が出力ファイルを作成しない場合（`outputs: []`）などの例外と責務境界の扱いが明記されていること。
2. `ifx-cmd-sample.yaml`:
   - `files.inputs` に作成主体（呼び出し元の販売管理 CLI）、パス可変部（日付・連番）の解決元、印字フォーマット仕様の参照先が明記され、`outputs: []` の責務境界と揃っていること。
   - `yaml-pages build` により表示用ページが同期されていること。
3. `bes-sample.md`:
   - 仮置きの `bes-index` 参照に対して、照合担当（BA）、確認アクション、および確定時期（BEL 作成時・引き渡し前）が明記され、承認基準にも未解決参照の扱いが反映されていること。
   - 販売金額ルール（`br-sales-amount`）、販売プロセス（`bps-sales-order-flow`）、販売記録データモデル（`bdd-sales-record`）、未確定状態（`payment_status` の `unconfirmed`）の識別子が明記されていること。
4. `sf-sample.md`:
   - 上位一覧 `sf-index`（仮置き）および対応エントリ `SF-POS-01`「店頭商品販売」、照合担当（BA）・時期が明記され、未決事項 `Q-01` にも反映されていること。
5. `cdt-sample.md`:
   - 取扱区分変更時の店頭棚札表示（`★定番` / `季節限定` / `お試し`）の貼り替え責務が店番担当に割り当てられていること。
6. `ccd-sample.md`:
   - 本文で照合根拠としている `specdojo:bdd-sample` が Frontmatter の `based_on` に記載されていること。
7. `CHANGELOG.md` は変更せず、対応結果および報告の `handoff` に記載すること。

## 4. 作業内容

| No  | 作業                                                                                                             | 担当         | 状態 | メモ                                             |
| --- | ---------------------------------------------------------------------------------------------------------------- | ------------ | ---- | ------------------------------------------------ |
| 1   | `ifx-cmd-rulebook.md` の enum 網羅（`template`、`ready`、`deprecated`、`arguments` 互換値）と `files` 指針を追加 | sol-executor | done | enum 網羅検査通過・引数表排除方針を両立          |
| 2   | `ifx-cmd-sample.yaml` の `files.inputs`（作成主体・可変部解決元・内容仕様）を補正し表示ページを再生成            | sol-executor | done | 規則の要求項目と整合                             |
| 3   | `bes-sample.md` の `bes-index` 照合担当・時期、承認基準、委譲先文書識別子を記載                                  | sol-executor | done | `br-sales-amount`・`bps-sales-order-flow` 等記載 |
| 4   | `sf-sample.md` に上位一覧 `sf-index`・機能 ID `SF-POS-01`・照合担当を記載                                        | sol-executor | done | 本文および未決事項 `Q-01` を更新                 |
| 5   | `cdt-sample.md` に取扱区分変更時の棚札表示貼り替え責務を記載                                                     | sol-executor | done | 店番担当の責務を明記                             |
| 6   | `ccd-sample.md` の Frontmatter に `based_on: [specdojo:bdd-sample]` を追加                                       | sol-executor | done | 本文の照合根拠と Frontmatter を整合              |

## 5. 対応結果

### 5.1. 実施内容

1. **`ifx-cmd-rulebook.md` の enum 網羅と `files` 記述指針整備**:
   - `docs/specdojo/schemas/v1/ifx-cmd.schema.yaml` の string enum のうち、rulebook 未記載だった `type: template`、`status`（`draft` / `ready` / `deprecated`）、および `arguments` の `kind`（`argument`, `option`, `positional`）と `value_source`（`literal`, `generated`, `config`, `secret`, `user_input`）を第 4 節および第 5 節に追記しました。
   - `arguments` の各 enum 値については、過去形式の資産に対する互換性定義であることを明記し、PJR-4N3R の引数表を持たない方針（正本参照 `command.reference` および入出力の約束への一本化）を維持・徹底する記述としました。
   - 第 6.4 節に CLI が出力ファイルを生成しない場合（`outputs: []`）の例外規定と、呼び出し元ログ保存責務との境界分離に関する指針を追加しました。
2. **`ifx-cmd-sample.yaml` の `files` 約束補正**:
   - `files.inputs` の説明に、作成主体が呼び出し元の販売管理 CLI（[[specdojo:clis-sample|販売管理 CLI 仕様サンプル]]）であること、パス可変部の日付 `YYYYMMDD` と連番 `NNNN` の解決元、および内容仕様が `kinuya-receipt-format-schema` であることを明記しました。
   - `yaml-pages build` を実行し、表示用ページを同期しました。
3. **`bes-sample.md` の未解決参照・委譲先識別子の補正**:
   - 上位一覧 `bes-index`（仮置き）の照合担当（BA）、確認アクション、および確定時期（BEL 作成時・引き渡し前）を明記し、承認基準にも未解決参照の引き渡し条件（BA による照合原則、未解決時は PO 承認による制限事項記録）を反映しました。
   - 販売金額計算の業務ルール（`br-sales-amount` / [[specdojo:br-sample|販売金額計算の業務ルールサンプル]]）、販売プロセス（仮置き ID `bps-sales-order-flow`）、販売記録データモデル（仮置き ID `bdd-sales-record` / `schema:sales-record`）、および未確定状態定義（`payment_status: unconfirmed`、`cdsd-order-status`）の各識別子を明記しました。
4. **`sf-sample.md` の上位一覧および対応機能の補正**:
   - 第 1 節に上位のシステム化機能一覧 `sf-index`（仮置き）、対応機能 ID `SF-POS-01`、機能名「店頭商品販売」、および照合担当（BA）と時期を明記しました。
   - 第 8 節の未決事項 `Q-01` にも上位一覧 `sf-index` の `SF-POS-01` の照合アクションを反映しました。
5. **`cdt-sample.md` の棚札表示同期責務の追記**:
   - 第 3.2.2 節（区分を変更する場合）に、取扱区分（`staple` / `seasonal` / `experimental`）の変更適用日までに店番担当（店主代表または家族利用者代表）が店頭の棚札表示（表示名: `★定番` / `季節限定` / `お試し`）を新しい取扱区分に合わせて貼り替える責務を明記しました。
6. **`ccd-sample.md` の Frontmatter `based_on` 追記**:
   - Frontmatter に `based_on: [specdojo:bdd-sample]` を追加し、第 4 節で照合済みの既存辞書との根拠関係を CCD 規則に従って明示しました。

### 5.2. 成果物

- `docs/ja/specdojo/rulebooks/ifx-cmd-rulebook.md`
- `docs/ja/specdojo/samples/ifx-cmd-sample.yaml`
- `docs/ja/specdojo/samples/bes-sample.md`
- `docs/ja/specdojo/samples/sf-sample.md`
- `docs/ja/specdojo/samples/cdt-sample.md`
- `docs/ja/specdojo/samples/ccd-sample.md`
- `docs/ja/projects/prj-0001/controls/project-register/pjr-8bsv-kata-sample-rule-mismatches.md`

### 5.3. 残課題・申し送り

- `docs/ja/specdojo/rulebooks/ifx-cmd-rulebook.md` の Frontmatter `status` は規約に基づき `draft` のまま維持しています。enum 網羅検査（`validate:schema:rulebook-enums`）がすべて通過することを確認済みのため、人間による確認・承認時に安全に `ready` へ昇格可能です。

### 5.4. CHANGELOG に書く事項

- 区分: 変更
- 文案: 業務仕様および外部 I/F 仕様の型・サンプル（`ifx-cmd`, `bes`, `sf`, `cdt`, `ccd`）における記述の軽微な不整合を解消し、スキーマ enum 網羅・正本参照および棚札同期責務を明確化

## 6. 関連ドキュメント

- 根拠: [[prj-0001:pjr-t88p-business-specs-kata|PJR-T88P 業務仕様の型の手入れ]]
- 対象:
  - [[specdojo:ifx-cmd-rulebook|外部コマンド連携仕様作成ルール]]
  - [[specdojo:ifx-cmd-sample|外部コマンド連携仕様サンプル]]
  - [[specdojo:bes-sample|業務イベント仕様サンプル]]
  - [[specdojo:sf-sample|システム化機能仕様サンプル]]
  - [[specdojo:cdt-sample|コード・区分定義サンプル]]
  - [[specdojo:ccd-sample|概念クラス図サンプル]]
- 関連:
  - [[prj-0001:pjr-8e7z-kata-revision-deprecation-rules|PJR-8E7Z 業務仕様の型に、文書の改訂と廃止のときに関係する文書を追って直す決まりを足す]]
  - [[prj-0001:pjr-1vf0-kata-validation-commands|PJR-1VF0 ccd と ifx-cmd の型に、規則の検査を流すコマンドを書く]]
