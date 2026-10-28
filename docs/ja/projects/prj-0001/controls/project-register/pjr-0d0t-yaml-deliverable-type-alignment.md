---
specdojo:
  id: prj-0001:pjr-0d0t-yaml-deliverable-type-alignment
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: low
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-27T12:32:57Z"
  block_reason: "parent validation failed: test-unit"
  derived_from:
    - PJR-XSM8
  depends_on:
    - PJR-484B
---

# PJR-0D0T YAML の成果物の type を原則に沿った値にそろえる

## 1. 概要

bdd の domain を data、ifx-cmd・ifx-msg の command・message を api にするなど、YAML の type を成果物の type の値にそろえ、schema・rulebook・テンプレート・sample を直す。古い値はエラーにし、置き換え先を示す。YAML の表示用ページは YAML の type を引き継ぐ

- PJR-RYK8 の決定と PJR-484B の宣言・照合に合わせて、YAML の成果物の type をそろえる。

## 2. 完了条件

- bdd の `domain` を `data`、ifx-cmd・ifx-msg の `command`・`message` を `api` にし、gl に `glossary` を書く。YAML の schema・rulebook・テンプレート・sample を rulebook の宣言に合わせて直す。ifx-cmd のテンプレートの `template` は残す。
- `domain`・`command`・`message` は検証でエラーにし、文面で置き換え先を示す。
- `bdd-rulebook` の「`type: data` の成果物に適用する」と「`type` は `domain` 固定」の矛盾を、宣言に合わせて解消する。
- PJR-484B の照合を、YAML の成果物と sample にも広げる。
- `src/docs/yaml-pages.ts` が YAML の type をそのまま引き継ぎ、配置パスで決める処理と非推奨の `sample` を出す処理をなくす。YAML の sample 11 件すべての生成結果をテストで確かめる。
- CHANGELOG の `## [Unreleased]` に移行の手順を書く。公開済みの版の節は変えない。
- 作業の中で `npm run typecheck`・`npm run lint:ts`・`npm run lint:md`・`npm run lint:fm`・`npm run test:unit` が通り、親の検証 7 件が通る。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。

## 3. 作業内容

| No  | 作業                                                  | 担当     | 状態 | メモ                                                        |
| --- | ----------------------------------------------------- | -------- | ---- | ----------------------------------------------------------- |
| 1   | YAML の schema・rulebook・テンプレート・sample を直す | executor | done | bdd を data、ifx-cmd・ifx-msg を api、gl を glossary に統一 |
| 2   | 古い値のエラーと照合の拡張を実装する                  | executor | done | YAML schema 検証に主 rulebook との照合を追加                |
| 3   | yaml-pages が YAML の type を引き継ぐようにする       | executor | done | 配置パスからの分類を削除                                    |
| 4   | CHANGELOG を更新し、テストを足す                      | executor | done | 移行手順と全11件の表示ページ・検証の回帰テストを追加        |

## 4. 対応結果

- bdd・ifx-cmd の schema、4系統の sample、ifx-cmd の生成物メタ情報を宣言値に統一した。gl schema では `type: glossary` と `rulebook` を必須にし、sample と既存成果物 `gl-common.yaml` に追加した。ifx-cmd テンプレート自身の `type: template` は維持した。
- YAML 検証に既存の宣言照合を共用し、トップレベル、`x-spec-meta`、`metadata_template` を対象とした。旧値 `domain` / `command` / `message` は `rulebook: none` でも置き換え先を示して拒否する。参照解決・ローカル優先・曖昧さの判定は Markdown と共通である。
- 設計判断: 外部形式とテンプレートも同じ分類原則に従うため、`specdojo-schema: none` / `validate=false` では構造検証のみを省略し、メタ情報の照合は行う。照合先を明示するため OpenAPI / AsyncAPI と IF 一覧の sample・rulebook に `rulebook` を追加した。平坦な dct テンプレートは生成物の雛形を持たず、自身の `template` は照合対象外とする。
- 設計判断: 表示ページは元 YAML の `type` をそのまま継承し、未記載の分類は補わない。元データの不備を配置パスによる補完で隠さないためである。表示ページの宣言照合除外も撤去し、生成後の Markdown も検査する。本文内のデータ型・CloudEvents のイベント種別は変更しない。
- CHANGELOG の Unreleased に置き換え・メタ情報追加・検証・表示ページ再生成の移行手順を記載した。YAML sample 全11件の表示ページの型と Frontmatter schema 適合、配置先に依存しない継承、テンプレート、旧値・照合不一致・省略指示の回帰テストを追加した。
- 親 runner が typecheck・lint-ts・lint-md・lint-fm・test-unit・test-integration・validate-schema の7件を実行する。executor は同じ検査を重ねて実行せず、個別 schema 検証・整形・hook の補足検証を担当する。
- executor 検証結果: YAML sample 全11件・ifx-cmd テンプレート・既存 gl の modeline 検証は成功した。外部形式の3件とテンプレートもメタ情報の照合を実行している。ifx-cmd の schema には `metadata_template.type: api` も定義し、テンプレートと sample の直接 schema 検証も成功した。
- executor 検証結果: Prettier 整形、変更 Markdown の markdownlint、YAML 表示ページの再生成（91件更新・50件変更なし・他生成器の19件を保持）、登録簿ビュー生成、prj-0001 のカタログ検証が成功した。CLI の補足検証は `.env` を読み込まないよう dotenv の読み込み処理を無効にして実施した。カタログ検証には未作成文書への参照警告があるが、エラーはない。result の編集と親7検査の結果記録は後続 reporter・runner に引き継ぐ。

## 5. 関連ドキュメント

- [[specdojo:document-metadata-standard]]
- [[specdojo:bdd-rulebook]]
- [[specdojo:gl-rulebook]]
