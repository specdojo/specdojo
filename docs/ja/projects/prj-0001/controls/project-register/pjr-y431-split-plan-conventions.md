---
specdojo:
  id: prj-0001:pjr-y431-split-plan-conventions
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-04T12:10:55Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-0MR5
  commit_type: refactor
  commit_scope: exec
---

# PJR-Y431 exec plan の共通の規約を共通・edit・review の 3 つのファイルに分ける

## 1. 概要

edit と review の plan に入る共通の規約（xep-common-conventions-template.md）を、両方に共通、edit だけ、review だけの 3 つに分け、plan の生成時に共通のファイルと mode に合うほうを組み合わせる

## 2. 入力

- xep-common-conventions-template.md は 2026-09-01 に edit plan の共通の規約として作られた。2026-09-28（PJR-N22N）に review-only の印つきで review の判断の手順が足され、review plan にも入るようになった。今は edit の plan テンプレート 21 個と review の plan テンプレート 10 個が使い、grade の plan は使わない（2026-11-04）
- 利用者の判断: 名前と中身がずれているため、edit だけの印を足す案ではなく、共通・edit・review の 3 つのファイルに分ける。分ける作業と冗長さの規則を足す作業（PJR-0MR5）は別の項目にし、分ける前後で plan の本文が一致することを確かめられるようにする（2026-11-04）

## 3. 完了条件

- 規約を 3 つのファイルに分ける。両方に共通のファイル（新しく作る）、edit だけのファイル（`xep-common-conventions-template.md`）、review だけのファイル（`xrp-common-conventions-template.md`。今の `review-only` の部分を移す）。
- 共通のファイルの名前は、既にある接頭辞の決まり（`xep`・`xrp`・`xer`・`xrr`）に合わせて executor が決め、理由を個票の対応結果に書く。
- 今ある規則を 1 つずつ振り分け、規則・振り分け先・理由の一覧を個票の対応結果に書く。edit だけか迷うものは、今の動きを変えないため共通に置く。
- plan の生成時に、共通のファイルと mode に合うほうを組み合わせる。`review-only` の印はなくす。本文へ写す要点（`plan-essentials`）はファイルごとに持てるようにし、規約の詳細を読む案内には読むべきファイルをすべて示す。
- 分ける前と後で生成される plan を比べ、結果の要約を個票の対応結果に書く。edit の plan（`draft`・`fully-guided`・`retrofit`・`rulebook-maintenance`・`job`・`register`）は本文が一致する。review の plan は、edit だけへ移した規則が消える以外は一致する。
- 単体テストで、edit の plan に review の手順が入らないこと、review の plan に edit だけの規則が入らないこと、両方に共通の規則が入ることを確かめる。
- 古いファイル名を指す箇所（`src/exec/reporter.ts` のコメント、テスト、[[specdojo:plan-result-lifecycle-guide]] の説明）を直す。過去の記録（個票・evidence・過去の版の移行ガイド）は変えない。
- `npm pack --dry-run` で、新しいファイルが npm の配布物に含まれることを確かめる。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通す。親の検証として `test-integration` を通す。
- CHANGELOG の未公開の版の節（Unreleased）に書き、公開済みの版の節は変えない。
- 規則の文言を変えたり、新しい規則を足したりしない。冗長さの規則は PJR-0MR5 で足す。

## 4. 作業内容

| No  | 作業                                                                 | 担当 | 状態 | メモ     |
| --- | -------------------------------------------------------------------- | ---- | ---- | -------- |
| 1   | 今ある規則を共通・edit・review に振り分け、一覧を対応結果に書く      | ARC  | done | 実施済み |
| 2   | 3 つのファイルに分け、共通のファイルの名前を決める                   | ARC  | done | 実施済み |
| 3   | plan の生成で 2 つのファイルを組み合わせ、`review-only` の印をなくす | ARC  | done | 実施済み |
| 4   | 分ける前後の plan を比べ、テストを足す                               | ARC  | done | 実施済み |
| 5   | 古いファイル名の参照、ガイド、CHANGELOG を直し、検査を通す           | ARC  | done | 実施済み |

## 5. 対応結果

### 実施内容と命名

共通は `xp-common-conventions-template.md`、edit 専用は既存の `xep-common-conventions-template.md`、review 専用は `xrp-common-conventions-template.md` とした。`xep` / `xrp` / `xer` / `xrr` の `x`（exec）、`e` / `r`（edit / review）、`p` / `r`（plan / result）に合わせ、mode を限定しない plan を `xp` と表した。

生成時は共通、mode 別の順で読み、各ファイルの `plan-essentials` を同じ規約見出しの下へ展開する。要点のないローカル断片は全文を展開する従来の扱いを維持した。参照案内は読むべき2ファイルを示す。箇条書きの連続部分は空行を挟まず結合し、edit の既存本文の並びを保った。`review-only` の選別処理とマーカーは廃止した。

`src/exec/reporter.ts` のコメント、単体・統合テストの fixture と期待値、[[specdojo:plan-result-lifecycle-guide]]、CHANGELOG の Unreleased を更新した。過去の記録、公開済み CHANGELOG、登録簿の一覧、個票のステータス、result は変更していない。

### 規則の振り分け

以下は分割前の本文順の一覧である。「共通」は `xp-common-conventions-template.md`、「edit」は `xep-common-conventions-template.md`、「review」は `xrp-common-conventions-template.md` を指す。規則の文言は変えず、箇条書き40件、検査表10行、verdict 表6行をそれぞれ1か所へ移した。見出し・マーカー・要点の配置説明は本文規則とは区別した。

| 規則                                                          | 振り分け先 | 理由                                              |
| ------------------------------------------------------------- | ---------- | ------------------------------------------------- |
| result への記入を完了に必須とする                             | 共通       | 両 mode が result を記録する                      |
| 正常終了前に必須セクションを実内容で埋める                    | 共通       | 両 mode の完了記録に必要                          |
| 既存文書のリンク記法                                          | 共通       | 両 mode の記述に適用                              |
| 表内のリンク区切りをエスケープする                            | 共通       | 両 mode の記述に適用                              |
| 未作成文書はコード記法で仮置きする                            | 共通       | 両 mode の記述に適用                              |
| アンダースコア入り識別子をインラインコードにする              | 共通       | 両 mode の result と evidence に適用              |
| 成果物を `ready` へ昇格しない                                 | 共通       | review 中の書き換えにも関係し得るため保守的に維持 |
| ファイル操作に相対パスを使う                                  | 共通       | 読み取りも含む両 mode の操作に適用                |
| 検査前に package・SpecDojo・hook の設定を読む                 | 共通       | 検証の適用判断は両 mode に関係し得る              |
| 非適用検査を `not_applicable` と理由で記録する                | 共通       | 両 mode の検証報告の規則                          |
| `not_run` の意味と runner の扱い                              | 共通       | 両 mode の検証報告の規則                          |
| `pipeline.parent_validations` の記録と親の優先                | 共通       | pipeline の共通契約                               |
| YAML 編集時の schema 準拠と検査                               | edit       | 成果物の編集を指示する                            |
| 変更不要でも result の理由・根拠を記入する                    | 共通       | review を含む変更のない完了にも適用               |
| result の変更ファイル欄に実施内容を記入する                   | 共通       | 両 mode の実行記録に適用                          |
| 未記入 result は block となるため完了前に確認する             | 共通       | 両 mode の完了記録に適用                          |
| result の scaffold・frontmatter・見出し・lifecycle を維持する | 共通       | review result の構造にも適用                      |
| プロジェクトコンテキストを成果物の `based_on` へ転記しない    | edit       | 成果物の編集時の参照宣言を制約する                |
| `based_on` を `depends_on` の推移閉包へ限定する               | edit       | 成果物の編集時の参照宣言を制約する                |
| `external_directory` 拒否時は相対パスで同じツールを再実行する | 共通       | result の編集にも関係し得る                       |
| 一時ファイルをリポジトリ外か `tmp/` に置き終了前に削除する    | 共通       | 両 mode の作業で一時データを扱う                  |
| 検査コマンドの限定・test 回数制限・結果の記録                 | 共通       | 両 mode の検証に関係し得る                        |
| 親の検証コマンドを sandbox で重複実行しない                   | 共通       | pipeline の共通契約                               |
| 適用判定と検証 status の使い分け・runner の救済               | 共通       | 両 mode の検証報告の規則                          |
| 依存 package と設定に基づく適用判定                           | 共通       | 両 mode の検証に関係し得る                        |
| `npm init` の仮 test を非適用とする                           | 共通       | 両 mode の検証に関係し得る                        |
| Markdown 編集時の整形・markdownlint                           | edit       | 成果物の編集時の処理を指示する                    |
| 終了前に適用される pre-commit 検査を実行する                  | 共通       | result の記録にもコミット検査が関係し得る         |
| 自身の変更種別による検査選択と runner 管理ファイルの除外      | 共通       | 両 mode の検証に関係し得る                        |
| hook を検査コマンドの正本とし IPC エラー時は代替起動する      | 共通       | 両 mode の検証に関係し得る                        |
| 検査表: Markdown の整形と lint                                | 共通       | 表は変更種別で適用を限定するため従来どおり残す    |
| 検査表: TypeScript・JavaScript・JSON・YAML の整形             | 共通       | 表は変更種別で適用を限定するため従来どおり残す    |
| 検査表: ソース等の型検査                                      | 共通       | 表は変更種別で適用を限定するため従来どおり残す    |
| 検査表: ソース・テンプレート等の test                         | 共通       | 表は変更種別で適用を限定するため従来どおり残す    |
| 検査表: プロジェクト文書の catalog 検証                       | 共通       | 表は変更種別で適用を限定するため従来どおり残す    |
| 検査表: 履歴ファイルのリンク検査                              | 共通       | review result を含む履歴の検査にも関係する        |
| 検査表: DCT の catalog build                                  | 共通       | 表は変更種別で適用を限定するため従来どおり残す    |
| 検査表: 登録簿一覧の register build                           | 共通       | 表は変更種別で適用を限定するため従来どおり残す    |
| 検査表: schedule の exec refresh                              | 共通       | 表は変更種別で適用を限定するため従来どおり残す    |
| 検査表: docs の index build                                   | 共通       | 表は変更種別で適用を限定するため従来どおり残す    |
| review の責務と grade の評価を事実として受け取る前提          | review     | review 専用節の導入をそのまま移す                 |
| 成果物の再評価禁止と疑義の記録                                | review     | review の判断手順                                 |
| 開始時の鮮度確認（`E-01`）                                    | review     | review の判断手順                                 |
| 評価結果が確定できない場合の判断（`E-02`）                    | review     | review の判断手順                                 |
| 最新サイドカーの値と完了条件を読む                            | review     | review の判断手順                                 |
| 変更・plan・記録・完了条件・finding の照合（`S-02`）          | review     | review の判断手順                                 |
| finding が残る場合の完了判断と改善指示                        | review     | review の判断手順                                 |
| 判断根拠を実際に読んだ事実に限定する                          | review     | review の判断手順                                 |
| verdict 直前の鮮度再確認                                      | review     | review の判断手順                                 |
| verdict 表: `complete` の選択条件と記録                       | review     | review の判定契約                                 |
| verdict 表: `complete-with-findings` の選択条件と記録         | review     | review の判定契約                                 |
| verdict 表: `incomplete` の選択条件と記録                     | review     | review の判定契約                                 |
| verdict 表: `grade-stale` の選択条件と記録                    | review     | review の判定契約                                 |
| verdict 表: `grade-unavailable` の選択条件と記録              | review     | review の判定契約                                 |
| verdict 表: `changed-during-review` の選択条件と記録          | review     | review の判定契約                                 |
| 正常終了を verdict でなく review result の記録で判定する      | review     | review の終了契約                                 |
| review result の章立てと verdict 記入                         | review     | review の記録契約                                 |

edit 専用と断定しにくい検査・パス・状態の規則は共通側に残し、今回の分割で適用範囲を狭めないようにした。PJR-0MR5 の冗長さに関する新しい規則は追加していない。

### 本文比較と検証

変更前の生成処理と規約を一時保存し、全 plan テンプレート32件（edit 21件、review 11件）について schema 有無の2通り、計64通りを比較した。`draft`・`fully-guided`・`retrofit`・`rulebook-maintenance`・`job`・`register` を含む。比較は生の注入結果と Prettier 整形後の両方で行った。読むべき2ファイルを示す参照案内の1行のみを正規化すると edit 本文は完全一致した。review は参照案内の変更と YAML 編集時の schema 指示の削除以外が完全一致した。他の edit 専用規則は従来から要点の範囲外で本文に展開されていない。元の40箇条書きと表20行（見出し・区切り各2行を含む）の集合を照合し、欠落・重複・文言変更がないことも確認した。

実際の plan 生成 API でも、edit の `draft`・`fully-guided`・`retrofit`・`rulebook-maintenance`・`job`・`register` の6種類と、review の前4種類・`job` の5種類、計11件を変更前後の処理で生成した。schema のないケースで、参照案内の1行以外の生成済み本文が完全一致した。生成物と比較用コードは `tmp/` に置き、検証後に削除した。

単体テストには mode 間の規則の混入防止、共通規則の注入、ファイルごとの要点抽出、schema の置換・省略、マーカーのないローカル断片との組み合わせを追加した。単体・統合テスト、型検査、TypeScript・Markdown・frontmatter・図の lint、schema 検査は指定どおり親 runner が実行する。

executor では対象14ファイルの Prettier 整形、前記の本文比較、`npm pack --dry-run --json`（prepack の build を含む）、`npm run validate:history-links`、`node --import tsx src/specdojo.ts catalog validate --project prj-0001`、`node --import tsx src/specdojo.ts register build --project prj-0001`、差分の空白検査が成功した。pack の一覧に規約の3ファイルすべてが含まれることを確認した。catalog 検証は成功し、既存カタログが参照する未作成文書について警告が出た。register build は hook の適用条件に従って生成物だけを更新した。executor 自身は YAML を変更していないため個別 schema 検査は非適用とした。

検証の実行結果は executor evidence にも記録する。残課題・保護された設定の変更提案はない。

## 6. 関連ドキュメント

- [[specdojo:plan-result-lifecycle-guide]]: exec のテンプレートの置き場所と選び方
- PJR-0MR5: 分けたあとに edit だけのファイルへ冗長さの規則を足す
- PJR-CYG0: 冗長さを 3 層で直す決定
