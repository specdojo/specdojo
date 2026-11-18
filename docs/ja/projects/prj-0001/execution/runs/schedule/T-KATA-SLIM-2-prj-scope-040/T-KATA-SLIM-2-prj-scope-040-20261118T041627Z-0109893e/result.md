---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-prj-scope-040-20261118t041627z-0109893e
  type: exec-result
  task_id: T-KATA-SLIM-2-prj-scope-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-prj-scope-040/T-KATA-SLIM-2-prj-scope-040-20261118T041627Z-0109893e/plan.md
  started_at: "2026-11-18T04:16:32.071Z"
  completed_at: "2026-11-18T04:32:33.855Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - prj-0001:prj-scope
    - specdojo:prj-scope-rulebook
---

# Edit Result

## 1. 実施内容

- `prj-scope-rulebook` から、どの成果物にも共通する文書運用の記述を外し、共通の正本への参照に置き換えました。
- 全体方針に「共通の運用」を1項目追加しました。
- 空白と改行を除く文字数は4,816字から3,810字（79.11%）になり、目安の8割以下に収まりました。
- 変更したのは rulebook のみです。成果物本体、recipe、template、sample、result、grade サイドカーは変更していません。
- executor が実行した `prettier` と `git diff --check` は成功しました。runner の `lint:fm`・`lint:md`・`lint:mermaid`・`lint:d2`・`test:integration`・`validate:schema`・`test:unit` も成功しています。`lint:ts` と `typecheck` は変更種別により対象外です。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/prj-scope-rulebook.md`: 共通運用の記述を外し、全体方針に「共通の運用」を1項目追加しました。本文要件を言い直す用語表、共通の Frontmatter 項目表、未確定ラベルの説明、共通の禁止事項、重複する説明を整理しました。章「位置づけと用語定義」は、重複する用語表と不要な小見出しを削除して「位置づけ」に改名しました。成果物の6章と必須・任意の区分、Frontmatter は変更していません。対象システムの正本・生成物・外部サービスとの責務境界、対象期間、対象外の理由と再検討条件、境界判断、スコープ変更の入口・影響評価・承認者・記録先は、型固有の判断要件として維持しました。

## 3. 申し送り

- 共通標準への変更案です。外した「個人名・連絡先等の公開不適切情報」の禁止は、executor が確認した共通標準に明文がありませんでした。`document-metadata-standard` に、公開文書へ載せる情報の適否を確認する共通規定を追加する案です。recipe の公開適性チェックも、この規定を整備するときに参照へ揃える候補です。本タスクでは標準を編集していません。
- executor の計測では、表の区切り行も除く場合は4,455字から3,592字（80.63%）です。
- 変更ファイルは docs/ja/specdojo/rulebooks/prj-scope-rulebook.md のみ。成果物本体、recipe・template・sample、result、grade サイドカーは変更していない。includes の宣言はなく、記法 rulebook の追加編集は不要。
- 判断根拠: pjr-8s4t-sld-kata-slim-pilot の「他の型へ広げるときの一覧」、改訂済み sld-rulebook、rulebook-authoring-standard、document-metadata-standard、pm-review-viewpoints の vp-arc-conciseness を確認。prj-overview、prj-scope、対応する recipe・template・sample、既存の grade 結果と T-LAUNCH-prj-scope-090 の review result も確認した。
- 全体方針に「共通の運用」を1項目追加。本文要件を言い直す用語表、共通の Frontmatter 項目表、未確定ラベルの説明、共通の禁止事項、重複する説明を整理した。対象システムの正本・生成物・外部サービスとの責務境界、対象期間、対象外の理由・再検討条件、境界判断、スコープ変更の入口・影響評価・承認者・記録先は型固有の判断要件として維持した。
- 章名変更の理由: rulebook の「位置づけと用語定義」を「位置づけ」に変更し、重複する用語表と不要になった小見出しを削除した。rulebook 記述標準の用語定義省略規定に従う。成果物の6章と必須・任意の区分は変更していない。Frontmatter も維持した。
- 文字数は文書全体から空白・改行を除いて計測し、4,816字→3,810字（79.11%、20.89%削減）。参考として表の区切り行も除く場合は4,455字→3,592字（80.63%）。
- 共通標準への変更案: 外した「個人名・連絡先等の公開不適切情報」の禁止は、確認した共通標準に明文がない。document-metadata-standard に、公開文書へ載せる情報の適否を確認する共通規定を追加することを提案する。本タスクでは標準を編集していない。recipe の公開適性チェックも、この規定を整備する際に参照へ揃える候補となる。template・sample は構造上の追従変更不要。
- 適用外の検証: `npm run validate:schema:file`（変更したのは Markdown rulebook のみで、変更した YAML ファイルがない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下への変更がない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票および既存の plan・result を変更していない。）
- 適用外の検証: `node tools/check-evidence-secrets.mjs --staged`（executor は検査対象となる execution 配下の実行記録を変更していない。）

## 4. 進め方と実践の型の適用

rulebook-maintenance の手順で、pjr-8s4t の「他の型へ広げるときの一覧」と改訂済み `sld-rulebook` を手本にしました。根拠には `rulebook-authoring-standard`、`document-metadata-standard`、`pm-review-viewpoints` の `vp-arc-conciseness` を使っています。冗長な記述は削除または参照へ置き換え、判断に要る型固有の基準は残しました。章名は「位置づけと用語定義」を「位置づけ」に変更しています。これは、用語表の重複を削除したことに合わせた変更です。plan に展開された grade と condense の finding はありません。frontmatter に `includes` の宣言もなく、記法 rulebook の追加編集は不要でした。
