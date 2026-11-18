---
specdojo:
  id: prj-0001:pjr-qwg7-kata-slim-mm-pr
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
  registered_at: "2026-11-18T00:14:41Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-DJZD
---

# PJR-QWG7 議事録（mm）と進捗報告（pr）の rulebook と sample から文書の運用の記述を外す

## 1. 概要

mm と pr はカタログで日付ごとに作る記録の型（instance_id_pattern）で schedule の対象にならないため、kata-slim と同じ一覧で個別に簡潔にする。

## 2. 入力

- orchestrator の調べ（2026-11-18）: kata-slim-2 の schedule の生成で、mm-meeting-minutes と pr-progress-report（kind: control、`instance_id_pattern` あり、path なし）は scope に入らなかった

## 3. 完了条件

- `mm-rulebook`・`pr-rulebook` から、どの成果物にも共通する文書の運用の記述を外し、共通の正本への参照にする。手本は [[prj-0001:pjr-8s4t-sld-kata-slim-pilot|PJR-8S4T]] の対応結果の「他の型へ広げるときの一覧」と、見直し済みの [[specdojo:sld-rulebook|sld-rulebook]] である。大きさは空白を除いた文字数で今の 8 割以下を目安にする。
- `mm-sample`・`pr-sample` から、文書の運用の記述と同じ判断の言い直しを外す。結論（値・判断の基準・例外）は変えない。大きさは空白を除いた文字数で今の 7 割以下を目安にする。
- 前後の文字数を、文書ごとに個票の対応結果に書く。
- 成果物本体と recipe・template は変えない。合わせて直すべき点は変更案として個票の対応結果に書く。
- 型の grade は統合の後に orchestrator が流す。executor は grade を実行しない。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く。
- `npm run lint:md`・`npm run lint:fm` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                         | 担当         | 状態 | メモ                                                                               |
| --- | -------------------------------------------- | ------------ | ---- | ---------------------------------------------------------------------------------- |
| 1   | 2 つの rulebook から運用の記述を外す         | BA           | done | Frontmatter の項目表と冒頭の定型文を外し、全体方針の「共通の運用」で正本を参照した |
| 2   | 2 つの sample から運用の記述と言い直しを外す | BA           | done | 外す記述がなく変更なし（対応結果の「迷った点と決めた内容」）                       |
| 3   | 統合の後に型を grade し、結果を書く          | orchestrator | open | 統合の後に orchestrator が流す。executor は grade を実行しない                     |

## 5. 対応結果

### 5.1. 実施内容

- `mm-rulebook`・`pr-rulebook`: 冒頭の「本ドキュメントは…ルールを定義する。」の段落（H1 の言い直し）と、「推奨 Frontmatter 項目」の章（`id`・`type`・`status` の値の表。共通の正本の再掲）を外した。全体方針に「共通の運用」を 1 項目置き、Frontmatter の項目（`specdojo.type` は `project`）、`status` の昇格と承認、改訂と廃止は [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] を参照する形にした。章番号を詰めた。
- 見出しの「位置づけと用語定義（必要に応じて）」を「位置づけ」にした。用語の定義がなく、rulebook 作成標準が用語定義のない章を「位置づけ」とするため。
- 空行で分断されて崩れていた表（`mm-rulebook` の本文構成、`pr-rulebook` の Frontmatter 表）と、箇条の途中の余分な空行を直した。型固有の判断（決定者・担当者・期限・次回確認日、根拠のある数値、影響度と対応方針、禁止事項）は変えていない。
- `mm-sample`・`pr-sample`: 変更なし。
- recipe・template: どちらも `not-needed` のため変更なし。

### 5.2. 大きさ

測り方は空白（改行を含む）を除いた文字数で、表の区切り行（`| --- |`）は除く（PJR-8S4T と同じ数え方）。括弧内は区切り行を含む文字数。

| 文書          | 前               | 後               | 比   |
| ------------- | ---------------- | ---------------- | ---- |
| `mm-rulebook` | 857 字（924 字） | 798 字（828 字） | 93%  |
| `pr-rulebook` | 893 字（963 字） | 833 字（857 字） | 93%  |
| `mm-sample`   | 393 字（511 字） | 393 字（511 字） | 100% |
| `pr-sample`   | 494 字（724 字） | 494 字（724 字） | 100% |

### 5.3. 迷った点と決めた内容

- rulebook は 8 割の目安に届かない。もともと 1,000 字に満たず、運用の記述は外した 2 か所だけで、残りは Frontmatter（約 150 字）と型固有の判断である。目安に合わせて型固有の判断を削ると結論が変わるため、削らなかった。
- sample は役割の段落・承認の段落・文書品質の検査・同じ判断の言い直しのいずれも持たない。7 割の目安に合わせて会議情報や表の行を削ると完成例として欠けるため、変更しなかった。
- 「共通の運用」の参照文は、sld と違い役割のメンバー定義と未決事項の引き継ぎには触れなかった。どちらの rulebook も役割の割り当てや未決事項の管理を書いていないため。
- 保護された設定の変更は不要だった。

### 5.4. 変更案

- 両 rulebook は rulebook 作成標準の「内容充実化」（必須章ごとに 3 項目以上、推奨表の列定義）を満たしていない章がある（例: 位置づけ 2 項目、禁止事項 2〜3 項目、各章の列定義なし）。簡潔にする本項目の範囲外のため直していない。必要なら grade の結果を見て別の項目で扱う。
- `mm-rulebook` の禁止事項「実装詳細を議事録本文へ過度に記載しない」の「過度に」は判断の条件がない。直すかは grade の結果を見て決める。

### 5.5. CHANGELOG に書く事項

- 区分: 変更。文案: 議事録（mm）と進捗報告（pr）の rulebook から Frontmatter の項目表など共通の運用の記述を外し、ドキュメントメタ情報標準への参照にしました。崩れていた表も直しました（PJR-QWG7）。

### 5.6. 残課題

- 統合の後に orchestrator が型を grade し、結果を本個票に書く（作業内容の 3）。

## 6. 関連ドキュメント

- [[prj-0001:pjr-8s4t-sld-kata-slim-pilot]]
