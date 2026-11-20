---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-etc-index-040-20261118t091559z-fb5be65c
  type: exec-result
  task_id: T-KATA-SLIM-2-etc-index-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-etc-index-040/T-KATA-SLIM-2-etc-index-040-20261118T091559Z-fb5be65c/plan.md
  started_at: "2026-11-18T09:16:09.959Z"
  completed_at: "2026-11-18T09:44:59.161Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - etc-index
    - specdojo:etc-index-rulebook
---

# Edit Result

## 1. 実施内容

- `etc-index-rulebook` から、どの成果物にも共通する運用の記述を外し、共通の正本への参照に置き換えた。全体方針に「共通の運用」を 1 項目だけ置き、役割は適用先のメンバー定義、状態・承認・改訂と廃止・未決事項の引き継ぎは `document-metadata-standard` を参照する形にした。
- 型固有の判断基準と区分、標準の列と章の受入条件、必須 8 章・任意 1 章、記述ガイドの見出し、ケース表の列と区分は維持した。章名と必須・条件付きの区分は変更していない。
- 空白・改行を除いた文字数は 9,442 字から 7,210 字（76.36%）になり、目安の 8 割以下を満たした。試行と同じく表の区切り行も除くと 8,889 字から 6,795 字（76.44%）である。
- F001（8 章のサンプルが一般論の反復）は、決済連携の具体的な環境・再送・証跡を示す短いコード例へ置換して対応した。旧サンプル固有の除外理由・代替手段・例外条件は記述ガイドへ移し、判断情報を保持した。
- F002（指定 sample と必須章の不整合）は未解消である。sample は今回の変更対象外で、sample 側の不備と判断し、rulebook の構成要件は正として維持した。
- 検証は、executor の `prettier` 整形・チェックと `git diff --check` が合格した。runner の `lint:fm`・`lint:md`・`lint:mermaid`・`lint:d2`・`validate:schema`・`test:unit`・`test:integration` も合格した。`lint:ts` と `typecheck` は変更種別により適用外である。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/etc-index-rulebook.md`: 共通運用の記述（役割の表と段落、状態・承認・改訂と廃止、品質検査を受入条件に入れる記述、未決事項の管理台帳の列、本文の言い直しだけの用語、共通規約と同じ禁止事項）を外し、全体方針の「共通の運用」1 項目から正本を参照する形にした。Frontmatter の共通項目表は正本参照に置き換えた。名前空間・種別・準拠 rulebook の指定と H1 の文書名を明確にした。8 章のサンプルは決済連携の具体例に置換し、旧サンプル固有の判断情報は記述ガイドへ移した。全体で 131 行削除・31 行追加。

## 3. 申し送り

- F002 は未解消である。sample が必須 8 章を満たす具体的な完成例になるよう、後続のタスクで改訂し、統合後に再評価する。なお、現在の sample は既に `type: test` であり、過去評価の内容ハッシュも現在と一致しないため、`type: project` の指摘は現状に当てはまらない。
- 対象成果物 `etc-index.md` は未作成だった。カタログの対象・完了条件と関連する型（`etc-rulebook`・`tsp-index-rulebook`）を根拠に改訂した。成果物ができた段階で、実態との整合を見直す余地がある。
- 変更ファイルは docs/ja/specdojo/rulebooks/etc-index-rulebook.md のみ。全体方針に「共通の運用」を1項目置き、役割は適用先のメンバー定義、状態・承認・改訂廃止・未決事項の引き継ぎはドキュメントメタ情報標準へ参照をまとめた。Frontmatter の共通項目表を正本参照へ置き換え、名前空間・種別・準拠 rulebook の指定とH1の文書名を明確にした。
- 判断根拠は PJR-8S4T の展開一覧、sld-rulebook、rulebook-authoring-standard、document-metadata-standard、pm-review-viewpoints.yaml の vp-arc-conciseness・vp-qe-kata-conformance、成果物カタログ dct-test-specs.yaml、etc-rulebook・tsp-index-rulebook、etc-index-sample と両 grade サイドカー。対象成果物 etc-index.md は未作成だったため、カタログの対象・完了条件と関連する型を根拠に改訂した。
- 文字数は空白・改行除外で9,442字→7,210字（76.36%）。試行と同じく表の区切り行も除くと8,889字→6,795字（76.44%）。成果物の必須8章・任意1章、記述ガイドの見出し、ケース表の列と区分、rulebook の Frontmatter が維持されたことを確認した。
- F001 は一般論を反復するサンプルを決済連携の具体的な環境・再送・証跡の短いコード例へ置換して対応。旧サンプル固有の除外理由・代替手段・例外条件は記述ガイドへ移し、判断情報を保持した。サンプル章内の旧8.1～8.9節は反復解消のため置換したが、成果物に要求する章名・必須区分は変更していない。
- F002 は指定 sample の必須章との不整合が未解消。sample は今回の変更対象外のため、後続で必須8章を満たす具体的な完成例へ改訂する必要がある。現在の sample は既に `type: test` で、過去評価の内容ハッシュも現在と不一致のため、`type: project` の指摘は現状に当てはまらない。構成要件は過剰規定ではなく sample 側の不備と判断し、rulebook を正として維持した。統合後に再評価する。
- 共通正本への追記案は不要。recipe・template は `undecided`、`includes` はなく、追加の編集対象はない。成果物・sample・recipe・template・grade サイドカー・設定・result は変更していない。result への実施内容・判断根拠・文字数・未解消 finding の記録は reporter に引き継ぐ。追加した wikilink の参照先IDも確認済み。
- 適用外の検証: `npm run validate:schema:file`（変更はMarkdownの rulebook のみで、YAMLファイルを変更していない。）
- 適用外の検証: `npm run validate:history-links`（登録個票や既存の plan・result などの履歴ファイルを変更していない。）
- 適用外の検証: `npm run validate:catalog`（成果物の変更は docs/ja/specdojo/rulebooks/ 配下のみで、docs/ja/projects/ 配下を変更していない。）

## 4. 進め方と実践の型の適用

rulebook-maintenance として、PJR-8S4T の展開一覧と `sld-rulebook` を手本に、`rulebook-authoring-standard`、`document-metadata-standard`、`pm-review-viewpoints.yaml` の `vp-arc-conciseness` と `vp-qe-kata-conformance`、成果物カタログ `dct-test-specs.yaml`、`etc-rulebook`・`tsp-index-rulebook`、`etc-index-sample` と両 grade サイドカーを読んで判断した。共通運用は正本参照へ集約し、型固有の判断基準・区分・良い例と悪い例・禁止事項・受入確認の手順は維持した。F001 は解消した。F002 は、構成要件が過剰ではなく sample 側の不備と判断し、rulebook を正として維持した。共通の正本への追記案は不要である。recipe・template は `undecided` で、`includes` もないため、追加の編集対象はない。
