---
specdojo:
  id: prj-0001:pjr-0vpb-kata-slim-ifx-api-msg-dec
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-17T23:21:54Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-DJZD
---

# PJR-0VPB ifx-api・ifx-msg・dec の rulebook と sample から文書の運用の記述を外す

## 1. 概要

SpecDojo に実物がなくカタログに代表を作らない 3 つの型を、sample だけを相手に kata-slim と同じ一覧で簡潔にする。

## 2. 入力

- 利用者の決定（2026-11-18）: SpecDojo には REST API・非同期メッセージの連携・dec 文書がないため、カタログに代表を作らない（捏造を避ける）。dec を非推奨にするかは別の decision で決める

## 3. 完了条件

- `ifx-api-rulebook`・`ifx-msg-rulebook`・`dec-rulebook` から、どの成果物にも共通する文書の運用の記述を外し、共通の正本への参照にする。手本は [[prj-0001:pjr-8s4t-sld-kata-slim-pilot|PJR-8S4T]] の対応結果の「他の型へ広げるときの一覧」と、見直し済みの [[specdojo:sld-rulebook|sld-rulebook]] である。大きさは空白を除いた文字数で今の 8 割以下を目安にする。
- `ifx-api-sample`・`ifx-msg-sample`・`dec-sample` から、文書の運用の記述と同じ判断の言い直しを外す。OpenAPI と AsyncAPI の標準の構造と、結論（値・判断の基準・例外）は変えない。markdown の sample は空白を除いた文字数で今の 7 割以下を目安にする。YAML の sample は説明の文（`description` など）の言い直しだけを外し、構造を保つ。
- 前後の文字数を、文書ごとに個票の対応結果に書く。
- `dec` を非推奨にするかは [[prj-0001:pjr-3vjm-dec-deprecation|PJR-3VJM]] で決めるため、この項目では非推奨の記述を足さない。
- 成果物本体と recipe・template は変えない。合わせて直すべき点は変更案として個票の対応結果に書く。
- YAML の sample は `npm run validate:schema` を通す。
- 型の grade は統合の後に orchestrator が流す。executor は grade を実行しない。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く。
- `npm run lint:md`・`npm run lint:fm` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                         | 担当         | 状態 | メモ                                                                       |
| --- | -------------------------------------------- | ------------ | ---- | -------------------------------------------------------------------------- |
| 1   | 3 つの rulebook から運用の記述を外す         | BA           | done | 共通の運用を参照にした。大きさは目安に届かない（対応結果の大きさ）         |
| 2   | 3 つの sample から運用の記述と言い直しを外す | BA           | done | 運用の記述はなく、言い直しだけを外した                                     |
| 3   | 統合の後に型を grade し、結果を書く          | orchestrator | open | executor は grade を実行しない（完了条件）。統合の後に orchestrator が流す |

## 5. 対応結果

### 5.1. 実施内容

- 3 つの rulebook は、もともと役割・承認・文書品質の検査などの運用の記述をほとんど含まず、`status` の値（`draft` / `ready` / `deprecated`）の列挙だけが共通の運用に当たった。これを [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] への参照にした。
- ifx-api-rulebook・ifx-msg-rulebook: 冒頭に `status` の昇格と承認、改訂と廃止をドキュメントメタ情報標準に従う 1 文を置き、`x-spec-meta` の `status` の行を標準の値の参照にした。ESIL の `spec_ref` との対応（冒頭・ファイル規約・`id` の行の 3 か所）を冒頭の 1 か所にまとめ、「トレーサビリティ管理のため」（記載方針と重複）と「（内部実装の都合は書かない）」（禁止の箇条と重複）を外した。バージョンの 2 行、エラー定義の後置きの段落を 1 文にまとめた。`## 4.1` の見出しを `### 4.1.` に直し、区切り行の後の空行で壊れていた ifx-api の表と、箇条の間の不要な空行を直した。OpenAPI・AsyncAPI・CloudEvents の構造と値は変えていない。
- dec-rulebook: 全体方針に「共通の運用」を 1 項目置いた。Frontmatter の表（壊れていた表、`status` の値の列挙を含む）を `id`・`type` の指定と共通の運用の参照の 1 文にした。「結論だけでなく判断根拠を残す」（禁止事項と重複）を外し、禁止事項の「影響範囲未記載のまま確定しない」を外した（影響範囲は本文構成で必須。確定は共通の運用が扱う）。用語の定義がないため、第 2 章を「位置づけと用語定義（必要に応じて）」から「位置づけ」にした。
- dec-sample: 運用の記述はなかった。H1 の rulebook への Markdown リンクを外し、決定内容の 2 行目（選択肢 C の概要の言い直し）を外した。結論（選択肢 C、採択理由、影響範囲）は変えていない。
- ifx-api-sample・ifx-msg-sample: `info.description` が `info.title` の言い直しだったため外した。ほかの `description` は項目の意味を補うため残し、構造は変えていない。
- recipe・template: 3 つの型とも `recipe`・`template` は `not-needed`（dec は未宣言）で、変更対象がない。

### 5.2. 大きさ

測り方は空白（改行を含む）を除いた文字数。表の区切り行は除く（PJR-8S4T と同じ数え方）。括弧内はバイト数。

| 文書             | 前                  | 後                  | 比     |
| ---------------- | ------------------- | ------------------- | ------ |
| ifx-api-rulebook | 1,620 字（3,129 B） | 1,542 字（3,229 B） | 95.2%  |
| ifx-msg-rulebook | 1,736 字（3,603 B） | 1,646 字（3,396 B） | 94.8%  |
| dec-rulebook     | 858 字（1,936 B）   | 907 字（1,988 B）   | 105.7% |
| dec-sample       | 630 字（1,894 B）   | 555 字（1,737 B）   | 88.1%  |
| ifx-api-sample   | 1,469 字（2,463 B） | 1,440 字（2,399 B） | 98.0%  |
| ifx-msg-sample   | 1,350 字（2,197 B） | 1,314 字（2,106 B） | 97.3%  |

- 目安（rulebook 8 割以下、markdown の sample 7 割以下）には届かなかった。3 つの型は sld などと違い、もとから運用の記述と言い直しがほとんどなく、残りは型固有の構造・値・判断基準だったため。目安に合わせて型固有の記述を削ることはしなかった。
- dec-rulebook は「共通の運用」の 1 項目を足したため増えた。ifx-api-rulebook のバイト数の増加は、壊れていた表を整形して区切り行の幅が広がったため。

### 5.3. 迷った点と決めた内容

- 目安に届かない点: 判断に要る記述は長さだけで削らない（`vp-arc-conciseness`）方針を優先し、目安を超えたままにした。
- ifx の rulebook には sld と同じ「全体方針」の章がないため、章を新設せず冒頭に参照の 1 文を置いた。rulebook 作成標準の章構成へ合わせる見直しはこの項目の範囲外とした。
- 壊れた表・見出し番号の書式を直した。外した記述と同じ節にあり、直さないと参照の形にできなかったため。
- dec の非推奨の記述は足していない（PJR-3VJM で決める）。

### 5.4. 合わせて直すべき点（変更案）

- ifx-api-sample・ifx-msg-sample に `info.version` がない。OpenAPI 3.0.3 と AsyncAPI 2.6.0 では必須で、ifx-msg-rulebook の必須構造も `info` に `version` を求める。標準の構造を変えないという完了条件に従い、この項目では足していない。足すかは別の項目で決める。
- dec-sample の業務文脈（管理画面の認証方式）は、sample 作成標準の共通サンプル文脈（駄菓子屋）に揃っていない。結論を変えないという完了条件に従い、この項目では変えていない。dec を残すかを PJR-3VJM で決めた後に扱う。
- 保護された設定の変更は不要だった。

### 5.5. CHANGELOG に書く事項

- 区分: 変更。文案: 外部API仕様・外部メッセージ仕様・決定記録の rulebook で、`status` の値と運用をドキュメントメタ情報標準への参照にし、重複した記述と壊れた表を整理しました。sample から見出しのリンクとタイトルの言い直しを外しました（PJR-0VPB）。

### 5.6. 残課題

- 統合の後に orchestrator が型を grade し、結果を本個票に書く（作業内容の 3）。

## 6. 関連ドキュメント

- [[prj-0001:pjr-8s4t-sld-kata-slim-pilot]]
- [[prj-0001:pjr-3vjm-dec-deprecation]]
- [[specdojo:document-metadata-standard]]
