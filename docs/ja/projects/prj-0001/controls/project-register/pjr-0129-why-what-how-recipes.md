---
specdojo:
  id: prj-0001:pjr-0129-why-what-how-recipes
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  due_on: "2026-07-31"
  completed_at: "2026-07-26T12:00:00Z"
  conclusion: specdojo:recipe-authoring-standardにWhy/What/How/Traceを論理の骨格として定義し、全16 recipeへ成果物固有の問いと委譲境界を反映（コミット67f8049d）
  register_events:
    - v: 1
      id: reg_17c3db8ed290eddebe7c1beb128a7fbf
      ts: "2026-07-25T10:10:47Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "refactor(docs): 横断ディレクトリをプロジェクト直下へ移動"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: Why-What-How作成原則をrecipeへ反映
        - field: description
          from: ""
          to: agent が手段や網羅的な説明へ引っ張られず、主要な論点を保って成果物を作成できるよう、Why・What・How・Trace を共通の論理構造として定義する。全成果物へ同じ章順を強制せず、共通原則は一か所に置き、各 recipe には成果物の責務に応じた問いと適用方法だけを反映する。
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: _TODO_
        - field: registered
          from: ""
          to: _TODO_
        - field: due
          from: ""
          to: _TODO_
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: 393767768e66c987bff6cfac9914f208620e9166
    - v: 1
      id: reg_972eb82fed1337766c60236781a76993
      ts: "2026-08-09T10:55:22Z"
      action: close
      actor: SpecDojo Test
      from_status: open
      to_status: done
      reason: "exec(register PJR-9P5Q): 既存登録項目を個票 frontmatter へ一括移行する"
      changes:
        - field: status
          from: open
          to: done
        - field: description
          from: agent が手段や網羅的な説明へ引っ張られず、主要な論点を保って成果物を作成できるよう、Why・What・How・Trace を共通の論理構造として定義する。全成果物へ同じ章順を強制せず、共通原則は一か所に置き、各 recipe には成果物の責務に応じた問いと適用方法だけを反映する。
          to: Why・What・How・Traceを章順ではなく論理の骨格として定義し、各成果物recipeへ重複なく適用する
        - field: owner
          from: _TODO_
          to: ARC
        - field: due
          from: _TODO_
          to: "2026-07-31"
        - field: conclusion
          from: "-"
          to: specdojo:recipe-authoring-standardにWhy/What/How/Traceを論理の骨格として定義し、全16 recipeへ成果物固有の問いと委譲境界を反映（コミット67f8049d）
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
      previous_event_id: reg_17c3db8ed290eddebe7c1beb128a7fbf
    - v: 1
      id: reg_0c9993db8a6e1afcdbfaf3f3867f31ef
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: done
      to_status: done
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: completed
          from: "-"
          to: "2026-07-26"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_972eb82fed1337766c60236781a76993
---

# PJR-0129 Why-What-How作成原則をrecipeへ反映

## 1. 概要

Why・What・How・Traceを章順ではなく論理の骨格として定義し、各成果物recipeへ重複なく適用する

agent が手段や網羅的な説明へ引っ張られず、主要な論点を保って成果物を作成できるよう、Why・What・How・Trace を共通の論理構造として定義する。全成果物へ同じ章順を強制せず、共通原則は一か所に置き、各 recipe には成果物の責務に応じた問いと適用方法だけを反映する。

## 2. 完了条件

- Why・What・How・Trace の意味、相互関係、記述時の判定基準が共通原則として定義されている。
- 共通原則が「章の固定順」ではなく「主要な主張・判断の論理の骨格」であることが明記されている。
- Markdown、表形式の登録簿、YAML など、成果物形式に応じた適用方法または非適用条件が定義されている。
- 対象 recipe には共通説明を複製せず、その成果物で答えるべき固有の問いと委譲境界が記載されている。
- sample または代表成果物を用いて、Why から What / How への対応を追えることが確認されている。
- recipe の指示によって成果物の責務外の詳細や重複記述を要求しない。

## 3. 作業内容

<!-- prettier-ignore -->
| No | 作業 | 担当 | 状態 | メモ |
| --- | --- | --- | --- | --- |
| 1 | Why・What・How・Trace の共通原則とアンチパターンを定義する | ARC | done | 論理の骨格として一か所に定義 |
| 2 | recipe を成果物種別ごとに棚卸しし、適用対象と適用方法を決める | ARC | done | Markdown・登録簿・YAML・実行結果を定義 |
| 3 | 対象 recipe の問い・深掘り手順・仕上げ確認へ固有部分を反映する | ARC | done | 全 16 recipe に固有の対応と委譲境界を反映 |
| 4 | 代表 sample / 成果物で論点、簡潔性、委譲境界への効果を確認する | BA | done | 概要 sample と SpecDojo 概要で対応を確認 |

## 4. 対応結果

- [[specdojo:recipe-authoring-standard|Recipe 記述標準]]に、Why・What・How・Trace の意味、相互関係、判定基準、形式別の適用方法、非適用条件、アンチパターンを定義した。4 要素は固定章ではなく、主要な主張・判断の論理の骨格として既存の章・表・フィールドへ配置する。
- `docs/ja/specdojo/recipes/` 配下の全 16 recipe を棚卸しし、各「このレシピの使い方」に成果物固有の Why / What / How / Trace と責務外の委譲先を記載した。共通原則の説明は各 recipe へ複製していない。
- 各 recipe の「仕上げチェック」に、成果物固有の論点・判断・方法・証跡の対応を確認する項目を追加した。YAML recipe は schema 外キーを増やさず `based_on` と既存 ID、登録簿 recipe は行 ID・根拠・対応・証跡、実行 result は `done_criteria` と同じ result で追跡する。
- [[specdojo:prj-overview-sample|プロジェクト概要サンプル]]と [[prj-0001:prj-overview|SpecDojo プロジェクト概要]]を代表例として確認した。背景・必要性と中心仮説（Why）から、実現したいこと・価値仮説（What）、基本的な考え方・判断原則（How）、`CH-01` / `BV-01`〜`BV-04` と後続文書参照（Trace）を追え、詳細スコープ・受入条件・設計が委譲されていることを確認した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-0122-review-launch|launch trackの振り返り]] — 起票元
- [[prj-0001:pjr-0127-clarify-project-why|prj-overviewのプロジェクトWhyを明確化]] — project-level Why の整備
- [[specdojo:needs-to-implementation-philosophy]] — Why / What / How の既存概念
- [[specdojo:kata-guide]] — recipe の役割と参照方針
