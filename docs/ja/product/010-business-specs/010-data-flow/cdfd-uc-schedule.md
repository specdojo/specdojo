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

管理する成果物とその完了条件をカタログとスケジュールに定め、計画に沿ったタスクの実行から評価、完了記録までを進捗と対応付けることで、成果物の作成を計画どおりに進め、遅れや抜けを早く見つけられるようにする。

## 2. 適用範囲

- **対象**: ケース `C-02`「schedule 系（成果物の作成から完了まで）」として、「何を成果物として管理するかの判断が確定した」ことを起点に、schedule 系の固有領域（`P-03`・`P-04`・`P-09`・`P-10`）と共用領域である実行サイクル（`P-07〜P-08・P-11`）を経て、人間の完了判断に基づく完了記録と進捗報告・派生情報の閲覧提供までを対象とする。
- **対象外**: register・routine 系、構成管理・文書廃棄の内部、個別プロセス、操作手順、実装詳細、状態定義・遷移は扱わず、共通の責任分担や Orchestrator による調整は [[cdfd-overview|概念データフロー図（全体概要）]]、成果物・タスク・ジョブの状態定義と遷移は `stsd-deliverable`・`stsd-task-execution`・`stsd-job-run` を正本とする。

## 3. プロセス領域

ケース `C-02` は、schedule 系と実行サイクル（実行・評価・完了）の二つの区分を横断する。主経路は P-03 → P-04 → 実行サイクル（P-07〜P-08・P-11）の順に進み、P-09・P-10 は要求に応じて起動する提供経路とする。全体の調整は [[cdfd-overview|概念データフロー図（全体概要）]] の Orchestrator（`P-14`）へ委ねる。複数の系統が共通して通る実行サイクルの内部は全体概要を正本とし、本書では 1 つのノードとして受け渡しの線だけを扱う。

### 3.1. schedule 系（P-03〜P-04・P-09〜P-10）

| 順序       | プロセスグループ・区分 | プロセス領域              | PDCA  | 横断上の役割                                                                                                                                                                                       | 参照先                                            |
| ---------- | ---------------------- | ------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| 1          | schedule 系            | P-03 成果物カタログ定義   | Plan  | BA が管理対象の判断を成果物 ID・依存・期待価値に対応する完了条件・根拠参照へ具体化し、検証済みの成果物カタログを計画展開へ渡す。計画展開や評価・完了照合で不足した定義・完了条件・根拠参照を補う。 | [[cdfd-overview\|概念データフロー図（全体概要）]] |
| 2          | schedule 系            | P-04 スケジュール計画展開 | Plan  | PM が Kata grade・作成要件とカタログに合うスケジュール戦略を整え、担当・期間・依存・マイルストーンを持つ Schedule と実行計画へ展開する。                                                           | [[cdfd-overview\|概念データフロー図（全体概要）]] |
| 報告要求時 | schedule 系            | P-09 進捗可視化報告       | Check | PM が計画と実行記録・評価結果を照合して進捗報告を提供し、不一致やマイルストーン・ゲートに関わる判断事項を人間へ提示する。完了判断に用いる判断事項の不足を補う。                                    | [[cdfd-overview\|概念データフロー図（全体概要）]] |
| 生成要求時 | schedule 系            | P-10 派生生成閲覧提供     | Check | ARC が対象と正本を特定し、正本と整合する派生ビュー・索引を閲覧提供する。生成結果から正本や完了判断を書き換えない。                                                                                 | [[cdfd-overview\|概念データフロー図（全体概要）]] |

### 3.2. 実行サイクル（実行・評価・完了）（P-07〜P-08・P-11）

| 順序 | プロセスグループ・区分           | プロセス領域     | PDCA       | 横断上の役割                                                                                                                                                                                                                                                                                               | 参照先                                            |
| ---- | -------------------------------- | ---------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| 3    | 実行サイクル（実行・評価・完了） | P-07〜P-08・P-11 | Do〜Action | PM が受入を担い task owner が実行計画に従って成果物を作成・更新し、editor から独立した runner と QE が評価し、人間がマイルストーン・ゲート通過と完了可否を判断し、その確定に基づき完了記録を残して完成を確定（`status` の `ready` 更新）する。内部のプロセス・データストア読み書きは全体概要を正本とする。 | [[cdfd-overview\|概念データフロー図（全体概要）]] |

## 4. データストア

引き渡す情報と判定の根拠となる正本を全体概要と同じ名称・区分で示し、読み書きの主体を領域 ID で識別する。

### 4.1. マスタ・構成データ

| データストア             | 関連する参加単位                                         | 横断上の利用                                                                                                                                                                                 |
| ------------------------ | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 稼働構成                 | P-04、実行サイクル（P-07〜P-08・P-11）                   | P-04 がメンバー・ロールを参照して担当を割り当て、実行サイクルが実行主体の権限と実行既定値を参照する。                                                                                        |
| Kata / kata              | P-03、P-04、実行サイクル（P-07〜P-08・P-11）             | P-03 が定義の型、P-04 が Kata grade・作成要件、実行サイクルが作成・レビュー・検証の型および rubric・評価観点を参照する。                                                                     |
| 成果物カタログ / catalog | P-03、P-04、P-09、P-10、実行サイクル（P-07〜P-08・P-11） | P-03 が成果物 ID・依存・`done_criteria`・`evidence_refs` を更新し、P-04 が計画展開、P-09 が報告対象、P-10 が生成対象、実行サイクルが作成対象・完了条件・根拠参照を参照する。担当は持たない。 |
| スケジュール戦略         | P-04、P-09、実行サイクル（P-07〜P-08・P-11）             | P-04 が既定値・phase の作業要件・`owner_rules`・ゲート・マイルストーン定義を参照・更新し、P-09 と実行サイクルが判断基準として参照する。                                                      |

### 4.2. トランザクションデータ

| データストア         | 関連する参加単位                                         | 横断上の利用                                                                                                                                  |
| -------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 登録簿 / register    | P-03、P-04、P-09、P-10、実行サイクル（P-07〜P-08・P-11） | P-03・P-04 が決定記録と epic・track の対応を参照する。実行サイクルが完了・再計画の決定を記録し、P-09・P-10 が対応状況・生成元として参照する。 |
| Schedule（track）    | P-04、P-09、P-10、実行サイクル（P-07〜P-08・P-11）       | P-04 がタスク・担当・期間・依存とマイルストーンを更新し、実行サイクルが対象タスク、P-09・P-10 が計画を参照する。タスク状態は保持しない。      |
| 実行計画 / plan      | P-04、実行サイクル（P-07〜P-08・P-11）                   | P-04 が対象・手順・完了条件を生成し、実行サイクルが作業と根拠の対応・完了条件を参照する。                                                     |
| 実行記録             | P-09、P-10、実行サイクル（P-07〜P-08・P-11）             | 実行サイクルが result・evidence・検証結果・実行状態および人間の確定に基づく完了記録を更新する。P-09・P-10 が記録済みの状態・結果を参照する。  |
| 成果物 / deliverable | P-10、実行サイクル（P-07〜P-08・P-11）                   | 実行サイクルが作成・更新・評価・完了照合を行い、完成確定に伴う `status` の `ready` への更新を人間が行う。P-10 が生成元として参照する。        |
| 評価結果             | P-09、実行サイクル（P-07〜P-08・P-11）                   | 実行サイクルが grade・finding または評価不能理由を更新し、P-09 が最新の評価を参照する。                                                       |
| 進捗報告             | P-09、実行サイクル（P-07〜P-08・P-11）                   | P-09 が確認済みの進捗と判断事項を更新し、実行サイクルがマイルストーン・ゲート判断の入力として参照する。                                       |
| 派生ビュー・索引     | P-10                                                     | P-10 が正本との整合を確認して更新し、関係者へ閲覧提供する。進捗報告に属する生成ビューは含めない。                                             |

## 5. 概念データフロー

### 5.1. 管理対象の確定から成果物カタログの整備まで

管理対象の判断確定を受けて成果物定義・完了条件・根拠参照をカタログへ残し、検証済みのカタログを計画展開へ渡す流れを示す。

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

start: "⚡ 何を成果物として管理するかの\n判断が確定した" {class: event}
catalog_def: "📅 P-03 成果物カタログ定義" {class: process}
planning: "📅 P-04 スケジュール計画展開" {class: process}
kata: "📐 Kata / kata" {class: store_master}
catalog: "📚 成果物カタログ / catalog" {class: store_master}
register: "📒 登録簿 / register" {class: store_transaction}

start -> catalog_def: "管理対象の判断"
kata -> catalog_def: "定義の型"
register -> catalog_def: "決定記録"
catalog_def -> catalog: "成果物定義・完了条件・根拠参照"
catalog_def -> planning: "検証済み成果物カタログ"
```

凡例は [[cdfd-overview|概念データフロー図（全体概要）]] の「凡例（本プロダクト共通）」を参照し、通常線は情報の流れを表し、物の流れは対象外とする。次図とは P-04・成果物カタログ・Kata・登録簿を共有し、計画展開の読み書きは次図、定義の不足と再計画の戻りは「例外時の戻り：カタログと計画の補完」に示す。

### 5.2. スケジュール戦略からタスクと実行計画の展開まで

成果物カタログと Kata grade・作成要件に合うスケジュール戦略を整え、タスク・担当・依存・マイルストーンと実行計画を展開する流れを示す。

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

planning: "📅 P-04 スケジュール計画展開" {class: process}
config: "🧩 稼働構成" {class: store_master}
kata: "📐 Kata / kata" {class: store_master}
catalog: "📚 成果物カタログ / catalog" {class: store_master}
strategy: "🧭 スケジュール戦略" {class: store_master}
register: "📒 登録簿 / register" {class: store_transaction}
schedule: "📅 Schedule（track）" {class: store_transaction}
plan: "📋 実行計画 / plan" {class: store_transaction}

catalog -> planning: "定義の正本"
kata -> planning: "Kata grade・作成要件"
config -> planning: "メンバー・ロール"
register -> planning: "epic・track の対応"
strategy -> planning: "生成戦略"
strategy <- planning: "整合済みの戦略"
planning -> schedule: "タスク・担当・依存・マイルストーン"
planning -> plan: "対象・手順・完了条件"
```

凡例は [[cdfd-overview|概念データフロー図（全体概要）]] の「凡例（本プロダクト共通）」を参照し、通常線は情報の流れを表し、物の流れは対象外とする。前図とは P-04・成果物カタログ・Kata・登録簿を共有する。Schedule・実行計画は「計画に沿ったタスクの実行と評価」へ、成果物カタログ・スケジュール戦略は「完了判断と完了記録」へ引き継ぎ、実行サイクル内部は全体概要へ委ねる。

### 5.3. 計画に沿ったタスクの実行と評価

展開された Schedule と実行計画に基づき、実行サイクルが成果物を作成・更新し、editor から独立した評価の結果と実行記録を残すまでの流れを示す。

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

exec_start: "⚡ 実行指示された" {class: event}
exec_cycle: "⚙️ 実行サイクル（実行・評価・完了）\nP-07〜P-08・P-11" {class: process}

config: "🧩 稼働構成" {class: store_master}
kata: "📐 Kata / kata" {class: store_master}
schedule: "📅 Schedule（track）" {class: store_transaction}
plan: "📋 実行計画 / plan" {class: store_transaction}
deliverable: "📄 成果物 / deliverable" {class: store_transaction}
record: "🧾 実行記録" {class: store_transaction}
grade: "🧪 評価結果" {class: store_transaction}

exec_start -> exec_cycle: "実行開始条件"
config -> exec_cycle: "実行権限・ロール"
kata -> exec_cycle: "実践の型・rubric"
schedule -> exec_cycle: "対象タスク・担当・依存"
plan -> exec_cycle: "対象・手順・完了条件"
deliverable -> exec_cycle: "更新対象の成果物"
exec_cycle -> deliverable: "作成・更新した成果物"
exec_cycle -> record: "result・evidence・検証結果"
exec_cycle -> grade: "grade・finding・評価不能理由"
```

凡例は [[cdfd-overview|概念データフロー図（全体概要）]] の「凡例（本プロダクト共通）」を参照し、通常線は情報の流れを表し、物の流れは対象外とする。実行サイクル内部（`P-07`・`P-08`・`P-11`）の処理やデータストア読み書きは全体概要を参照し、前図とは Schedule・実行計画を、次図とは実行サイクル・成果物・実行記録・評価結果を共有する。

### 5.4. 完了判断と完了記録

最新の評価と完了条件・ゲート基準・判断事項を照合し、人間の確定に基づく完了記録と成果物の完成確定を残すまでの流れを示す。

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

exec_cycle: "⚙️ 実行サイクル（実行・評価・完了）\nP-07〜P-08・P-11" {class: process}
finish: "⚡ 完了判断と完了記録を\n確認できた" {class: event}

catalog: "📚 成果物カタログ / catalog" {class: store_master}
strategy: "🧭 スケジュール戦略" {class: store_master}
report: "📊 進捗報告" {class: store_transaction}
grade: "🧪 評価結果" {class: store_transaction}
deliverable: "📄 成果物 / deliverable" {class: store_transaction}
record: "🧾 実行記録" {class: store_transaction}
register: "📒 登録簿 / register" {class: store_transaction}

catalog -> exec_cycle: "完了条件・根拠参照"
strategy -> exec_cycle: "ゲート・マイルストーン基準"
report -> exec_cycle: "判断事項"
grade -> exec_cycle: "最新の grade・finding"
exec_cycle -> record: "人間の確定に基づく完了記録"
exec_cycle -> register: "完了・再計画の決定記録"
exec_cycle -> deliverable: "人間が確定した完成（status の ready 更新）"
exec_cycle -> finish: "完了成立"
```

凡例は [[cdfd-overview|概念データフロー図（全体概要）]] の「凡例（本プロダクト共通）」を参照し、通常線は情報の流れを表し、物の流れは対象外とする。前図とは実行サイクル・成果物・実行記録・評価結果を共有し、判断事項を作る流れは「進捗の可視化報告」、完了条件未充足や判断材料不足の戻りは「例外時の戻り：カタログと計画の補完」「例外時の戻り：判断事項の補完」に示す。実行サイクル内部の照合手順は全体概要を参照する。

### 5.5. 進捗の可視化報告

定期的な報告時期に、計画と実行記録・評価結果を照合して進捗報告を提供し、関係者が参照できるようにするまでの流れを示す。

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

report_time: "⚡ 定期的な報告時期が\n到来した" {class: event}
reporting: "📅 P-09 進捗可視化報告" {class: process}
reported: "⚡ 要求された進捗報告を\n関係者が参照できた" {class: event}

catalog: "📚 成果物カタログ / catalog" {class: store_master}
strategy: "🧭 スケジュール戦略" {class: store_master}
schedule: "📅 Schedule（track）" {class: store_transaction}
register: "📒 登録簿 / register" {class: store_transaction}
record: "🧾 実行記録" {class: store_transaction}
grade: "🧪 評価結果" {class: store_transaction}
report: "📊 進捗報告" {class: store_transaction}

report_time -> reporting: "報告契機"
catalog -> reporting: "報告対象の定義"
strategy -> reporting: "ゲート・マイルストーン基準"
schedule -> reporting: "計画"
record -> reporting: "実績・実行状態"
register -> reporting: "判断事項・対応状況"
grade -> reporting: "grade・finding"
reporting -> report: "確認済みの進捗・判断事項"
reporting -> reported: "報告提供完了"
```

凡例は [[cdfd-overview|概念データフロー図（全体概要）]] の「凡例（本プロダクト共通）」を参照し、通常線は情報の流れを表し、物の流れは対象外とする。進捗報告で提示された判断事項は「完了判断と完了記録」で人間の判断入力として参照され、Orchestrator による要求発行は全体概要を参照する。

### 5.6. 派生情報の閲覧提供

派生成果物の生成要求に応じて、正本と整合する派生ビュー・索引を生成し、関係者が閲覧できるようにするまでの流れを示す。

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

generate_request: "⚡ 派生成果物の生成が\n要求された" {class: event}
publishing: "📅 P-10 派生生成閲覧提供" {class: process}
published: "⚡ 正本と整合する派生情報を\n関係者が閲覧できた" {class: event}

catalog: "📚 成果物カタログ / catalog" {class: store_master}
schedule: "📅 Schedule（track）" {class: store_transaction}
register: "📒 登録簿 / register" {class: store_transaction}
record: "🧾 実行記録" {class: store_transaction}
deliverable: "📄 成果物 / deliverable" {class: store_transaction}
derived: "🗂️ 派生ビュー・索引" {class: store_transaction}

generate_request -> publishing: "生成契機"
catalog -> publishing: "生成対象の定義"
schedule -> publishing: "計画の正本"
register -> publishing: "登録項目の正本"
record -> publishing: "実行結果の正本"
deliverable -> publishing: "成果物の正本"
publishing -> derived: "整合確認済みの派生情報"
publishing -> published: "閲覧提供完了"
```

凡例は [[cdfd-overview|概念データフロー図（全体概要）]] の「凡例（本プロダクト共通）」を参照し、通常線は情報の流れを表し、物の流れは対象外とする。生成結果から正本や完了判断を書き換えず、Orchestrator による要求発行は全体概要を参照する。

### 5.7. 例外時の戻り：カタログと計画の補完

計画展開時の定義不整合、評価・完了照合で特定できない完了条件や不足する根拠参照、依存・期間・担当の不整合や完了条件未充足に伴う再計画要求を、P-03・P-04 へ戻して補完・再展開した成果を再提示する流れを示す。

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

catalog_def: "📅 P-03 成果物カタログ定義" {class: process}
planning: "📅 P-04 スケジュール計画展開" {class: process}
exec_cycle: "⚙️ 実行サイクル（実行・評価・完了）\nP-07〜P-08・P-11" {class: process}

catalog: "📚 成果物カタログ / catalog" {class: store_master}

catalog_def <- planning: "定義の不足・不整合"
catalog_def -> planning: "補完・修正済みの成果物カタログ"
catalog_def <- exec_cycle: "不足する評価条件・根拠参照・特定できない完了条件"
catalog_def -> catalog: "補完した完了条件・根拠参照"
catalog -> exec_cycle: "補完した完了条件・根拠参照"
planning <- exec_cycle: "再計画要求（依存・期間・担当の不整合・完了条件未充足）"
planning -> exec_cycle: "再展開されたタスク・実行計画"
```

凡例は [[cdfd-overview|概念データフロー図（全体概要）]] の「凡例（本プロダクト共通）」を参照し、通常線は情報の流れを表し、物の流れは対象外とする。P-03・P-04・実行サイクル・成果物カタログを「管理対象の確定から成果物カタログの整備まで」「スケジュール戦略からタスクと実行計画の展開まで」「完了判断と完了記録」と共有する。実行サイクル内部（`P-07`・`P-08`・`P-11`）の例外戻り（検証失敗・レビュー差し戻し）と内部の再試行手順は全体概要を参照する。

### 5.8. 例外時の戻り：判断事項の補完

完了判断に用いる判断事項の不足を P-09 へ戻し、補完した判断事項を進捗報告を通して実行サイクルへ再提示する流れを示す。

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

reporting: "📅 P-09 進捗可視化報告" {class: process}
exec_cycle: "⚙️ 実行サイクル（実行・評価・完了）\nP-07〜P-08・P-11" {class: process}

report: "📊 進捗報告" {class: store_transaction}

reporting <- exec_cycle: "判断事項の不足・報告対象と時点"
reporting -> report: "補完した判断事項"
report -> exec_cycle: "補完した判断事項"
```

凡例は [[cdfd-overview|概念データフロー図（全体概要）]] の「凡例（本プロダクト共通）」を参照し、通常線は情報の流れを表し、物の流れは対象外とする。P-09・実行サイクル・進捗報告を「進捗の可視化報告」「完了判断と完了記録」と共有し、報告生成の内部は省略する。
