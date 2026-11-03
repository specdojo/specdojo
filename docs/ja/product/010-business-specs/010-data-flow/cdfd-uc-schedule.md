---
specdojo:
  id: cdfd-uc-schedule
  type: flow
  status: draft
  rulebook: specdojo:cdfd-uc-rulebook
  based_on:
    - cdfd-overview
  supersedes:
    - cdfd-uc-deliverable
---

# 概念データフロー図（スケジュール計画から完了まで）

[[cdfd-overview|概念データフロー図（全体概要）]] のケース `C-02`「schedule 系（成果物の作成から完了まで）」について、成果物カタログ定義から計画展開、タスク実行、評価、完了記録、および進捗・閲覧提供までの領域間の流れと、受け渡す情報を示す。

## 1. 目的

成果物の期待価値や完了条件から担当と実行根拠までを共通の正本で引き継ぎ、計画からタスク実行、評価を経て人間の判断に基づく完了記録と進捗・派生情報の提供までを成立させるために、schedule 系と実行サイクルの流れを示す。

## 2. 適用範囲

- **対象**: ケース `C-02`「schedule 系（成果物の作成から完了まで）」として、「何を成果物として管理するかの判断が確定した」ことを起点に、schedule 系の固有領域（`P-03`・`P-04`・`P-09`・`P-10`）と共用領域である実行サイクル（`P-07`・`P-08`・`P-11`）を経て、人間の完了判断に基づく完了記録と進捗報告・派生情報の閲覧提供までを対象とする。
- **対象外**: register・routine 系、構成管理・文書廃棄の内部、個別プロセス、操作手順、実装詳細、状態定義・遷移は扱わず、共通の責任分担や Orchestrator による調整は [[cdfd-overview|概念データフロー図（全体概要）]]、成果物・タスク・ジョブの状態定義と遷移は `stsd-deliverable`・`stsd-task-execution`・`stsd-job-run` を正本とする。

## 3. プロセス領域

ケース `C-02` は、schedule 系と実行サイクル（実行・評価・完了）の二つの区分を横断する。主経路は P-03 → P-04 → P-07 → P-08 → P-11 の順に進み、P-09・P-10 は要求に応じて起動する提供経路とする。全体の調整は [[cdfd-overview|概念データフロー図（全体概要）]] の Orchestrator（`P-14`）へ委ねる。

### 3.1. schedule 系（P-03〜P-04・P-09〜P-10）

| 順序       | プロセスグループ・区分 | プロセス領域              | PDCA  | 横断上の役割                                                                                                                             | 参照先                                            |
| ---------- | ---------------------- | ------------------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| 1          | schedule 系            | P-03 成果物カタログ定義   | Plan  | BA が管理対象の判断を成果物 ID・依存・期待価値に対応する完了条件・根拠参照へ具体化し、検証済みの成果物カタログを計画展開へ渡す。         | [[cdfd-overview\|概念データフロー図（全体概要）]] |
| 2          | schedule 系            | P-04 スケジュール計画展開 | Plan  | PM が Kata grade・作成要件とカタログに合うスケジュール戦略を整え、担当・期間・依存・マイルストーンを持つ Schedule と実行計画へ展開する。 | [[cdfd-overview\|概念データフロー図（全体概要）]] |
| 報告要求時 | schedule 系            | P-09 進捗可視化報告       | Check | PM が計画と実行記録・評価結果を照合して進捗報告を提供し、不一致やマイルストーン・ゲートに関わる判断事項を人間へ提示する。                | [[cdfd-overview\|概念データフロー図（全体概要）]] |
| 生成要求時 | schedule 系            | P-10 派生生成閲覧提供     | Check | ARC が対象と正本を特定し、正本と整合する派生ビュー・索引を閲覧提供する。生成結果から正本や完了判断を書き換えない。                       | [[cdfd-overview\|概念データフロー図（全体概要）]] |

### 3.2. 実行サイクル（実行・評価・完了）（P-07〜P-08・P-11）

| 順序 | プロセスグループ・区分 | プロセス領域    | PDCA   | 横断上の役割                                                                                                                                                                                             | 参照先                                            |
| ---- | ---------------------- | --------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| 3    | 実行サイクル           | P-07 タスク実行 | Do     | PM が受入を担い、Schedule の task owner が実行計画と Kata に従って成果物を作成・更新する。要求されたレビュー・検証によって評価へ渡せる成果と根拠を確定する。                                             | [[cdfd-overview\|概念データフロー図（全体概要）]] |
| 4    | 実行サイクル           | P-08 成果物評価 | Check  | editor から独立した runner が成果物と根拠を一度だけ照合し、QE が grade・finding または評価不能の範囲を確定して完了判断へ渡す。                                                                           | [[cdfd-overview\|概念データフロー図（全体概要）]] |
| 5    | 実行サイクル           | P-11 タスク完了 | Action | review phase で最新の grade・finding を事実として完了条件と照合し、人間の確定後に完了記録を残す。未充足ならタスク実行または計画展開へ差し戻す。完成確定に伴う `status` の `ready` への更新は人間が行う。 | [[cdfd-overview\|概念データフロー図（全体概要）]] |

## 4. データストア

引き渡す情報と判定の根拠となる正本を全体概要と同じ名称・区分で示し、読み書きの主体を領域 ID で識別する。

### 4.1. マスタ・構成データ

| データストア             | 関連する参加単位                   | 横断上の利用                                                                                                                                                                                 |
| ------------------------ | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 稼働構成                 | P-04、P-07                         | P-04 がメンバー・ロールを参照して担当を割り当て、P-07 が実行主体の権限と実行既定値を参照する。                                                                                               |
| Kata / kata              | P-03、P-04、P-07、P-08             | P-03 が定義の型、P-04 が Kata grade・作成要件、P-07 が作成・レビュー・検証の型、P-08 が rubric・評価観点を参照する。                                                                         |
| 成果物カタログ / catalog | P-03、P-04、P-07、P-08、P-10、P-11 | P-03 が成果物 ID・依存・`done_criteria`・`evidence_refs` を更新し、P-04 が計画展開、P-07 が作成対象・完了条件、P-08 が評価基準、P-11 が完了条件、P-10 が生成対象を参照する。担当は持たない。 |
| スケジュール戦略         | P-04、P-09、P-11                   | P-04 が既定値・phase の作業要件・`owner_rules`・ゲート・マイルストーン定義を参照・更新し、P-09・P-11 が判断基準として参照する。                                                              |

### 4.2. トランザクションデータ

| データストア         | 関連する参加単位             | 横断上の利用                                                                                                                                   |
| -------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 登録簿 / register    | P-03、P-04、P-09、P-10、P-11 | P-03・P-04 が決定記録と epic・track の対応を参照する。P-11 が完了・再計画の決定を記録し、P-09・P-10 が対応状況・生成元として参照する。         |
| Schedule（track）    | P-04、P-07、P-09、P-10、P-11 | P-04 がタスク・担当・期間・依存とマイルストーンを更新し、P-07 が対象タスク、P-09・P-10・P-11 が計画を参照する。タスク状態は保持しない。        |
| 実行計画 / plan      | P-04、P-07、P-08、P-11       | P-04 が対象・手順・完了条件を生成し、P-07・P-08・P-11 が作業と根拠の対応を参照する。                                                           |
| 実行記録             | P-07、P-08、P-09、P-10、P-11 | P-07 が result・evidence・検証結果と実行状態、P-11 が人間の確定に基づく完了記録を更新する。P-08・P-09・P-10 が記録済みの状態・結果を参照する。 |
| 成果物 / deliverable | P-07、P-08、P-10、P-11       | P-07 が作成・更新し、P-08 が評価、P-11 が完了照合、P-10 が生成元として参照する。完成確定に伴う `status` の `ready` への更新は人間が行う。      |
| 評価結果             | P-08、P-09、P-11             | P-08 が grade・finding または評価不能理由を更新し、P-09・P-11 が最新の評価を参照する。                                                         |
| 進捗報告             | P-09、P-11                   | P-09 が確認済みの進捗と判断事項を更新し、P-11 がマイルストーン・ゲート判断の入力として参照する。                                               |
| 派生ビュー・索引     | P-10                         | P-10 が正本との整合を確認して更新し、関係者へ閲覧提供する。進捗報告に属する生成ビューは含めない。                                              |

## 5. 概念データフロー

### 5.1. カタログ定義からスケジュール計画展開まで

管理対象の判断確定から成果物カタログを定義し、スケジュール戦略と合わせてタスク・担当・実行計画を展開するまでの流れを示す。

```d2
direction: down

classes: {
  process: {
    shape: rectangle
    style: {
      border-radius: 8
      fill: "#e3f2fd"
      stroke: "#1e88e5"
      font-color: "#000000"
    }
  }
  event: {
    shape: hexagon
    style: {
      fill: "#fff3e0"
      stroke: "#fb8c00"
      font-color: "#000000"
    }
  }
  store_master: {
    shape: cylinder
    style: {
      fill: "#e8f5e9"
      stroke: "#43a047"
      font-color: "#000000"
    }
  }
  store_transaction: {
    shape: cylinder
    style: {
      fill: "#c8e6c9"
      stroke: "#2e7d32"
      font-color: "#000000"
    }
  }
}

start: "何を成果物として管理するかの\n判断が確定した" {class: event}
catalog_def: "P-03 成果物カタログ定義" {class: process}
planning: "P-04 スケジュール計画展開" {class: process}

config: "稼働構成" {class: store_master}
kata: "Kata / kata" {class: store_master}
catalog: "成果物カタログ / catalog" {class: store_master}
strategy: "スケジュール戦略" {class: store_master}
register: "登録簿 / register" {class: store_transaction}
schedule: "Schedule（track）" {class: store_transaction}
plan: "実行計画 / plan" {class: store_transaction}

start -> catalog_def: "管理対象の判断"
kata -> catalog_def: "定義の型"
register -> catalog_def: "決定記録"
catalog_def -> catalog: "成果物定義・完了条件・根拠参照"
catalog_def -> planning: "検証済み成果物カタログ"
catalog -> planning: "定義の正本"
kata -> planning: "Kata grade・作成要件"
config -> planning: "メンバー・ロール"
register -> planning: "epic・track の対応"
strategy -> planning: "タスク生成戦略"
strategy <- planning: "整合済みの戦略"
planning -> schedule: "タスク・担当・依存・マイルストーン"
planning -> plan: "対象・手順・完了条件"
```

凡例は [[cdfd-overview|概念データフロー図（全体概要）]] の「凡例（本プロダクト共通）」を参照し、通常線は情報の流れを表し、物の流れは対象外とする。Orchestrator による調整は全体概要を参照し、次図へは実行計画・Schedule・成果物カタログが引き継がれる。

### 5.2. タスク実行から完了記録まで

実行指示を受けたタスクを実行・検証し、独立した成果物評価を経て、人間の完了判断に基づく完了記録と完成確定を行うまでの流れを示す。

```d2
direction: down

classes: {
  process: {
    shape: rectangle
    style: {
      border-radius: 8
      fill: "#e3f2fd"
      stroke: "#1e88e5"
      font-color: "#000000"
    }
  }
  event: {
    shape: hexagon
    style: {
      fill: "#fff3e0"
      stroke: "#fb8c00"
      font-color: "#000000"
    }
  }
  store_master: {
    shape: cylinder
    style: {
      fill: "#e8f5e9"
      stroke: "#43a047"
      font-color: "#000000"
    }
  }
  store_transaction: {
    shape: cylinder
    style: {
      fill: "#c8e6c9"
      stroke: "#2e7d32"
      font-color: "#000000"
    }
  }
}

exec_start: "実行指示された" {class: event}
execution: "P-07 タスク実行" {class: process}
evaluation: "P-08 成果物評価" {class: process}
completion: "P-11 タスク完了" {class: process}
finish: "完了判断と完了記録を\n確認できた" {class: event}

config: "稼働構成" {class: store_master}
kata: "Kata / kata" {class: store_master}
catalog: "成果物カタログ / catalog" {class: store_master}
strategy: "スケジュール戦略" {class: store_master}
schedule: "Schedule（track）" {class: store_transaction}
plan: "実行計画 / plan" {class: store_transaction}
deliverable: "成果物 / deliverable" {class: store_transaction}
record: "実行記録" {class: store_transaction}
grade: "評価結果" {class: store_transaction}
register: "登録簿 / register" {class: store_transaction}
report: "進捗報告" {class: store_transaction}

exec_start -> execution: "実行開始条件"
config -> execution: "実行権限"
kata -> execution: "作成・レビュー・検証の型"
catalog -> execution: "対象・完了条件"
schedule -> execution: "対象タスク・担当・依存"
plan -> execution: "実行基準"
deliverable -> execution: "更新対象の成果"
deliverable <- execution: "作成・更新した成果"
execution -> record: "result・evidence・実行状態"
execution -> evaluation: "評価対象の版・検証結果"
deliverable -> evaluation: "評価対象の版"
plan -> evaluation: "作業要件"
catalog -> evaluation: "done_criteria・evidence_refs"
kata -> evaluation: "rubric・評価観点"
evaluation -> grade: "grade・finding・評価不能理由"
evaluation -> completion: "確定した評価結果"
catalog -> completion: "完了条件"
strategy -> completion: "ゲート・マイルストーン基準"
schedule -> completion: "計画・マイルストーン"
plan -> completion: "タスクの完了条件"
deliverable -> completion: "評価済み成果"
report -> completion: "判断事項"
record -> completion: "検証・実行結果"
completion -> register: "完了・再計画の決定記録"
completion -> record: "人間の確定に基づく完了記録"
completion -> deliverable: "完成確定時の status 更新（ready）"
completion -> finish: "完了成立"
```

凡例は [[cdfd-overview|概念データフロー図（全体概要）]] の「凡例（本プロダクト共通）」を参照し、通常線は情報の流れを表し、物の流れは対象外とする。Orchestrator による要求発行や調整は全体概要を参照し、例外時の戻りの流れは「5.4. 例外時の戻り」に示す。

### 5.3. 進捗報告と派生情報の閲覧提供

定期的な報告時期や生成要求に応じて、正本から進捗状況を可視化報告し、正本と整合する派生ビュー・索引を閲覧提供するまでの流れを示す。

```d2
direction: down

classes: {
  process: {
    shape: rectangle
    style: {
      border-radius: 8
      fill: "#e3f2fd"
      stroke: "#1e88e5"
      font-color: "#000000"
    }
  }
  event: {
    shape: hexagon
    style: {
      fill: "#fff3e0"
      stroke: "#fb8c00"
      font-color: "#000000"
    }
  }
  store_master: {
    shape: cylinder
    style: {
      fill: "#e8f5e9"
      stroke: "#43a047"
      font-color: "#000000"
    }
  }
  store_transaction: {
    shape: cylinder
    style: {
      fill: "#c8e6c9"
      stroke: "#2e7d32"
      font-color: "#000000"
    }
  }
}

report_time: "定期的な報告時期が到来した" {class: event}
generate_request: "派生成果物の生成が要求された" {class: event}
reporting: "P-09 進捗可視化報告" {class: process}
publishing: "P-10 派生生成閲覧提供" {class: process}
reported: "要求された進捗報告を\n関係者が参照できた" {class: event}
published: "正本と整合する派生情報を\n関係者が閲覧できた" {class: event}

catalog: "成果物カタログ / catalog" {class: store_master}
strategy: "スケジュール戦略" {class: store_master}
schedule: "Schedule（track）" {class: store_transaction}
register: "登録簿 / register" {class: store_transaction}
record: "実行記録" {class: store_transaction}
grade: "評価結果" {class: store_transaction}
deliverable: "成果物 / deliverable" {class: store_transaction}
report: "進捗報告" {class: store_transaction}
derived: "派生ビュー・索引" {class: store_transaction}

report_time -> reporting: "報告契機"
catalog -> reporting: "報告対象の定義"
strategy -> reporting: "ゲート・マイルストーン基準"
schedule -> reporting: "計画"
record -> reporting: "実績・実行状態"
register -> reporting: "判断事項・対応状況"
grade -> reporting: "grade・finding"
reporting -> report: "確認済みの進捗・判断事項"
reporting -> reported: "報告提供完了"

generate_request -> publishing: "生成契機"
catalog -> publishing: "生成対象の定義"
schedule -> publishing: "計画の正本"
register -> publishing: "登録項目の正本"
record -> publishing: "実行結果の正本"
deliverable -> publishing: "成果物の正本"
publishing -> derived: "整合確認済みの派生情報"
publishing -> published: "閲覧提供完了"
```

凡例は [[cdfd-overview|概念データフロー図（全体概要）]] の「凡例（本プロダクト共通）」を参照し、通常線は情報の流れを表し、物の流れは対象外とする。進捗報告で提示された判断事項はタスク完了（`P-11`）における人間の判断入力として参照され、Orchestrator による要求発行は全体概要を参照する。

### 5.4. 例外時の戻り

評価での根拠不足・検証失敗や完了照合での未充足事項を、補完・再判断を担う先行領域へ戻し、修正後の成果・情報を再提示する流れを示す。

```d2
direction: down

classes: {
  process: {
    shape: rectangle
    style: {
      border-radius: 8
      fill: "#e3f2fd"
      stroke: "#1e88e5"
      font-color: "#000000"
    }
  }
}

catalog_def: "P-03 成果物カタログ定義" {class: process}
planning: "P-04 スケジュール計画展開" {class: process}
execution: "P-07 タスク実行" {class: process}
evaluation: "P-08 成果物評価" {class: process}
completion: "P-11 タスク完了" {class: process}

catalog_def <- planning: "定義の不足・不整合"
catalog_def -> planning: "補完・修正済みの成果物カタログ"
execution <- evaluation: "根拠不足・検証失敗・評価不能理由"
execution -> evaluation: "修正・再検証済みの成果と根拠"
execution <- completion: "レビュー差し戻し・完了条件未充足事項"
execution -> completion: "補完・再対応結果"
planning <- completion: "再計画要求（依存・期間・担当の不整合）"
planning -> execution: "再展開されたタスク・実行計画"
```

凡例は [[cdfd-overview|概念データフロー図（全体概要）]] の「凡例（本プロダクト共通）」を参照し、通常線による情報の戻りと再提示を示す。カタログ定義の不足、評価時の根拠不足、完了照合時の未充足に対する再対応・再計画の判断が業務上重要なため図を追加し、データストアと内部の再試行手順は省略する。
