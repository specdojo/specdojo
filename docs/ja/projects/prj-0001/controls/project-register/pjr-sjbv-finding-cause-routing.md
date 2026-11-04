---
specdojo:
  id: prj-0001:pjr-sjbv-finding-cause-routing
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: hard
  owner: ARC
  registered_at: "2026-11-04T11:48:08Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-04T13:55:23Z"
  conclusion: grade の指摘に原因（document または kata と Kata の箇所）を持たせ、Kata が原因の指摘を Kata の手入れの plan へ振り分け、磨き込みの plan には原因を添えて全件を載せるようにした
  derived_from:
    - PJR-CYG0
  depends_on:
    - PJR-CYG0
  commit_type: feat
  commit_scope: grade
---

# PJR-SJBV grade の指摘に原因を持たせて Kata の手入れへ振り分ける

## 1. 概要

PJR-CYG0 の決定に沿って、grade の指摘に原因（document または kata:`<kind>`）と Kata の箇所の根拠を持たせ、plan の生成時に Kata が原因の指摘をその Kata の手入れの段へ振り分ける

## 2. 入力

- PJR-CYG0 の決定内容（原因の振り分けの層）を実装の正本とする。冗長さに限らず、どの観点の指摘にも効かせる。Kata の箇所を示せない指摘は document とする（2026-11-04）
- 今は Kata の手入れの plan が読むのは Kata そのものの grade の指摘だけで、成果物の指摘のうち Kata が原因のものが届く道がない（2026-11-04）

## 3. 完了条件

- grade の結果の schema で、指摘に任意の項目として原因を足す。種類は `document` か `kata` とし、`kata` の場合は Kata の種類（rulebook・recipe・sample・template）と Kata の中の箇所を持たせる。原因のない今の結果は `document` として扱う。
- 成果物の grade の plan で、評価する agent に原因を付けさせる。Kata が原因とするのは Kata の箇所を根拠として示せる場合に限る。Kata そのものの grade では原因を付けない。
- 原因は、点数・判定・前の指摘の引き継ぎ・日本語訳に影響させない。
- Kata の手入れの plan（`*-maintenance`）に、その rulebook を宣言している成果物の指摘のうち、原因がその種類の Kata であるものを載せる。成果物が変わっていない最新の grade だけを載せ、1 件ずつ成果物・行・観点・内容・Kata の箇所を示す。
- 磨き込み（`fully-guided`）の plan では、今までどおりその成果物の指摘をすべて載せ、原因を添える。Kata が原因でも成果物の側も直す必要があるため（PJR-CYG0 の決定から利用者と確かめて変えた点）。
- 原因の形（型）は 1 か所に定め、PJR-1BRQ の `condense` の記録が同じ形を使えるようにする。
- [[specdojo:ryu-guide]] の「実践の型メンテナンスの進め方」と grade の結果の説明に、原因と振り分けを書く。
- 単体テストで、原因のある結果とない結果がどちらも schema の検査を通ること、Kata が原因の指摘が手入れの plan に載り `document` の指摘は載らないこと、古い grade の指摘は載らないこと、原因があっても点数が変わらないことを確かめる。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md`・`npm run validate:schema` を通す。親の検証として `test-integration` を通す。
- CHANGELOG の未公開の版の節（Unreleased）に書き、公開済みの版の節は変えない。
- 範囲の外: 既にある grade の結果の評価のし直し、`condense` の段（PJR-1BRQ）、予防の規則（PJR-0MR5）。
- 項目の名前と、plan の中で指摘を載せる節の名前は executor が決め、理由を個票の対応結果に書く。

## 4. 作業内容

| No  | 作業                                                            | 担当 | 状態 | メモ                                                                                 |
| --- | --------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------------------ |
| 1   | grade の結果の schema と型に原因を足す                          | ARC  | done | 共通の `FindingCause` と参照 schema を追加                                           |
| 2   | 成果物の grade の plan で原因を付けさせる                       | ARC  | done | `CAUSE` 申告を parse・保存し、reporter の改変も検査                                  |
| 3   | Kata の手入れの plan へ振り分け、磨き込みの plan に原因を添える | ARC  | done | 4 種の maintenance と fully-guided に反映                                            |
| 4   | ガイドを直し、テストを足して検査を通す                          | ARC  | done | ガイド・回帰テストを追加。型・lint・単体／統合テストなどの指定検査は親 runner が実施 |
| 5   | CHANGELOG と対応結果を書く                                      | ARC  | done | Unreleased に記載                                                                    |

## 5. 対応結果

- 原因の項目名は `cause` とした。`type: document` と、`type: kata`・`kind`・`location` の組を共通の `FindingCause`（`src/shared/finding-cause.ts`）と `finding-cause.schema.yaml` に定義した。原因と Kata の種類を分けることで、`condense` の記録でも同じ形を再利用できる。旧結果に原因を書き足さず、省略時は `document` として扱う。
- 成果物の grade plan は各 `FINDING` の後に `CAUSE: <JSON>` を申告させる。Kata の箇所を実際に読んで示せる場合だけ `kata` とし、Kata そのものの grade は原因を申告しない。parse・submission 検査・reporter の忠実性照合・サイドカー保存に対応した。原因を点数・判定・severity 上限・前回指摘の message 照合・日本語訳の入力には使わない。
- 手入れの追加節名は「成果物から届いた Kata が原因の finding」とした。Kata 自身の grade の指摘と出所を区別するためであり、どちらも同じ解消手順で扱う。最新の正規サイドカーから、現在の成果物全体のハッシュ、文書 ID、rulebook 宣言から辿る対象 Kata、原因の種類を照合し、成果物・行・viewpoint・内容・Kata の箇所を展開する。非カタログ成果物と宣言済み別リポジトリのサイドカーも同じ配置規則で扱う。
- `fully-guided` は全指摘を保持して原因を添える。原因が Kata の場合も成果物側を修正する。既存結果の再評価、`condense` の段、予防の規則は本項目の範囲に含めていない。
- [[specdojo:ryu-guide|Ryu ガイド]] と [[specdojo:command-reference|コマンドリファレンス]]、5 種の edit plan テンプレート、CHANGELOG を更新した。原因の有無と不正な形の schema 検査、保存、reporter 改変検知、点数・severity 引き継ぎ・訳文への非干渉、4 種の手入れ plan、古い結果・別の種類・無関係な宣言の除外、磨き込み plan の回帰テストを追加した。
- 再開時に、前回の親単体テストで失敗した 2 点を修正した。既存の指摘表示テストは `grade-result` の部分 mock で未置換の関数を保持し、追加された依存先でも `gradeContentHash` を使えるようにした。磨き込みのテストデータは、別の指摘から複製した `message_ja` も更新して表示内容と揃えた。grade plan の JSON 出力に関する指示も、`CAUSE` 行の値を例外として明示した。単体テストの再実行は親 runner が担当する。
- 変更対象の整形、原因なし・document・4 種の kata を含むデータの schema ファイル検証、catalog 検証、履歴リンク検証、実行時 import の依存宣言検査は成功した。catalog はプロダクト文書不在の警告を伴うが終了コードは 0。型・TypeScript／Markdown／frontmatter lint・図 lint・単体／統合テスト・全体 schema 検証は pipeline の指定に従い親 runner に委ねる。結果の詳細は executor evidence と親 runner の検証記録を正本とする。
- 申し送り: result は reporter／runner が記入する。統合後は運用メモに従い PJR-JSEY で exec の動作確認を行う。実 agent の起動を伴うため executor sandbox では実施しない。残る実装上の未決事項はない。

## 6. 関連ドキュメント

- [[specdojo:ryu-guide]]: 実践の型メンテナンスの進め方
- [[specdojo:review-guide]]: grade と review の分担
- PJR-1BRQ: 同じ原因の形を使う `condense` の段
- PJR-CYG0: 冗長さを 3 層で直す決定
