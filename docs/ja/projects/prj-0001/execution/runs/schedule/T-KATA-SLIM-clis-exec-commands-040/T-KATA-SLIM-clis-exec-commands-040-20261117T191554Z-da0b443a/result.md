---
specdojo:
  id: prj-0001:xer-t-kata-slim-clis-exec-commands-040-20261117t191554z-da0b443a
  type: exec-result
  task_id: T-KATA-SLIM-clis-exec-commands-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-clis-exec-commands-040/T-KATA-SLIM-clis-exec-commands-040-20261117T191554Z-da0b443a/plan.md
  started_at: "2026-11-17T19:16:01.678Z"
  completed_at: "2026-11-17T19:43:39.923Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - clis-exec-commands
    - specdojo:clis-rulebook
---

# Edit Result

## 1. 実施内容

- `clis-rulebook.md` から、どの成果物にも共通する運用の記述を外し、共通の正本への参照に置き換えた。外した記述は、役割の表、共通の承認・改訂・廃止の手順、課題追跡の手順、重複する用語表、共通規約と重複する禁止事項である。
- CLI 固有の判断基準、必須情報、良い例・悪い例、回復条件、業務の受入確認手順と合格条件は維持した。
- 大きさは、改行を含む空白を除いた文字数で 7,531 字から 5,860 字（77.81%）になった。表の区切り行も除くと 6,707 字から 5,350 字（79.77%）で、どちらの方式でも 8 割以下である。
- finding F001 と F003 は解消した。F002 は分類理由を明確にしたが、共通標準との定義の不一致は未解消である。
- 整形検査（`prettier --check`）と `git diff --check` は executor 側で通過した。runner 側の `lint:fm`、`lint:md`、`lint:mermaid`、`lint:d2`、`test:integration`、`validate:schema`、`test:unit` も通過した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/clis-rulebook.md`: 全体方針に「共通の運用」を 1 項目だけ置き、役割は適用先のメンバー定義、status・承認・改訂と廃止・未決事項の引き継ぎは `document-metadata-standard` への参照にした。役割の表と段落、未決事項の管理列と台帳登録の段落、本文要件の言い直しだけの用語表、共通規約と重複する禁止事項を削除した。F001 として ifx-cmd の責務境界の重複定義を 1 か所にまとめた。F003 として共通の sample リンク禁止行を削除し、成果物本文で別の型の sample を契約例として参照できる条件を明記した。第 2 章の名称は「位置づけと用語定義」から「位置づけ」に変更した。用語表を外し、入力・出力の定義を該当ガイドへ統合したためである。そのほかの章名、必須・任意の区分、frontmatter は変更していない。

## 3. 申し送り

- F002 の共通正本への変更案: `document-metadata-standard.md` の `ui` を「画面・帳票・利用者向け CLI 操作の仕様」、`api` を外部 I/F 契約（外部コマンド呼出契約を含む）として境界を明記する。本タスクは rulebook のみの変更を指定しているため、後続タスクへ送る。
- sample の追従案: `clis-sample.md` の「メモ / 将来課題」から担当・解消条件・引き継ぎ先の管理列と公開判断を外し、論点・影響・当面の扱いを残す。recipe・template は変更不要（`not-needed`）である。
- 共通標準の追記案: `rulebook-authoring-standard.md` に、sample へのリンク禁止は本型の companion 対応宣言を対象とし、成果物間の目的・契約参照を妨げないことを明記する。
- 変更ファイルは docs/ja/specdojo/rulebooks/clis-rulebook.md のみ。役割表、共通の承認・改廃・課題追跡手順、重複する用語表・禁止事項を整理した。CLI 固有の必須情報、判断基準、良い例・悪い例、回復条件を維持し、業務の受入確認手順と合格条件を明確にした。result は reporter の担当として編集していない。
- 判断根拠: [[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]、[[specdojo:document-metadata-standard|ドキュメントメタ情報標準]]、[[specdojo:pm-review-viewpoints|共通レビュー観点一覧]] の `vp-arc-conciseness`・`vp-qe-kata-conformance`、[[prj-0001:pjr-8s4t-sld-kata-slim-pilot|sld 試行]]、[[specdojo:sld-rulebook|SLD 作成ルール]]、[[specdojo:clis-sample|CLIS 完成例]]、[[clis-exec-commands|CLI仕様（exec コマンド群）]]、CLIS 関連の grade result、[[prj-0001:pjr-8j47-catalog-uis-to-clis|CLIS へのカタログ変更記録]]、[[specdojo:ifx-cmd-rulebook|外部コマンド連携仕様作成ルール]] を確認した。
- 大きさ: 改行を含む空白を除外して7,531字→5,860字（77.81%）。sld 試行と同じく表の区切り行も除外すると6,707字→5,350字（79.77%）。成果物に求める章名・必須／任意区分と frontmatter は変更なし。rulebook 第2章だけ「位置づけと用語定義」から「位置づけ」に変更した。用語表を外し、入力・出力の定義を該当ガイドへ統合したため。
- F001 は責務境界の重複定義を削除して解消。F003 は共通の sample リンク禁止行を削除し、成果物本文で別の型の sample を契約例として参照できる条件を明記して解消した。学習例と実案件を区別し、対象操作と用途を示す。本型の companion 宣言とは区別する。
- F002 は分類理由を明確にしたが、共通標準との定義の不一致は未解消。既存成果物・sample と一致する `deliverable_type: ui` を維持した。共通正本への変更案: document-metadata-standard.md の `ui` を「画面・帳票・利用者向け CLI 操作の仕様」、`api` を外部 I/F 契約（外部コマンド呼出契約を含む）として境界を明記する。本タスクは rulebook のみを変更する指定のため、標準の追記は後続タスクへ申し送る。
- sample の追従案: clis-sample.md の「メモ / 将来課題」から担当・解消条件・引き継ぎ先の管理列と公開判断を外し、論点・影響・当面の扱いを残す。業務の確認者・回復担当は維持する。recipe・template は `not-needed` で変更不要。rulebook-authoring-standard.md には、リンク禁止が本型の companion 対応宣言を対象とし、成果物間の目的・契約参照を妨げないことを明記する案を申し送る。
- 検証では変更範囲、frontmatter の同一性、本文要件の章名・必須区分、「共通の運用」が1項目であること、両方式の文字数が8割以下であることを確認した。親 runner 担当の lint・schema・型検査・テストは重複実行していない。
- 適用外の検証: `npm run validate:schema:file`（変更対象は Markdown rulebook のみで、YAML ファイルの変更がない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票・plan・result などの履歴ファイルを変更していない。）
- 適用外の検証: `npm run validate:catalog`（成果物の変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下には及ばない。）

## 4. 進め方と実践の型の適用

根拠として確認した資料は、`rulebook-authoring-standard`、`document-metadata-standard`、`pm-review-viewpoints`（`vp-arc-conciseness`、`vp-qe-kata-conformance`）、sld 試行（`pjr-8s4t`）、改訂済みの `sld-rulebook`、`clis-sample`、`clis-exec-commands`、CLIS 関連の grade result、`pjr-8j47`、`ifx-cmd-rulebook` である。sld 試行の一覧に従って共通運用の記述を参照へ置き換え、CLI 固有の判断基準、良い例・悪い例、回復条件、業務の受入確認の手順と合格条件は残した。F001 は重複定義の削除で解消した。F003 は共通の sample リンク禁止行を削除し、別の型の sample を契約例として参照できる条件を成果物本文側に明記して解消した。その際、学習例と実案件を区別し、対象操作と用途を示すことを条件とし、本型の companion 宣言とは区別した。F002 は既存の成果物・sample と一致する `deliverable_type: ui` を維持して分類理由を明確にしたが、共通標準との定義の不一致は未解消である。共通標準の変更は本タスクの範囲外のため、上記の変更案として申し送る。
