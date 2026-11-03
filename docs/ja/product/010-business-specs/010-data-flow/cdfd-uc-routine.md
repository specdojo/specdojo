---
specdojo:
  id: cdfd-uc-routine
  type: flow
  status: draft
  rulebook: specdojo:cdfd-uc-rulebook
  based_on:
    - cdfd-overview
  supersedes: []
---

# 概念データフロー図（定期処理・自動運転）

[[cdfd-overview|概念データフロー図（全体概要）]] のケース `C-03`「routine 系（定期実行と Job）」について、定期実行と Job の定義から、サイクル到来による Job の実行、評価・完了と結果の記録までの流れと、受け渡す情報を示す。

## 1. 目的

反復する確認・実行作業を、定めた周期・条件と手順で特定の参加者の記憶や手作業に頼らず続け、その結果を次回の判断へ引き継げるようにするために、定期実行と Job の定義から実行・評価・完了の記録までの流れを示す。

## 2. 適用範囲

- **対象**: `C-03` の routine 系（`P-05`〜`P-06`）と実行サイクル（`P-07`・`P-08`・`P-11`）を対象に、定期実行と Job の定義、および「PDCA の各サイクルが到来した」から Job の実行、register 系・schedule 系への要求、評価・完了と結果の記録までを扱う。
- **対象外**: Orchestrator（`P-14`）による実行機会の選択・調整、register 系・schedule 系の内部、コマンド・保存形式などの実装詳細は扱わず、責任分担と調整は [[cdfd-overview|全体概要]]、状態の定義・遷移は [[stsd-routine-run|定期処理の実行結果のステータス定義]] と未作成の `stsd-job-run`・`stsd-task-execution` へ委ねる。

## 3. プロセス領域

ケース `C-03` は、定義を routine 系の `P-06` → `P-05` の順に整え、サイクル到来後は実行サイクルの `P-07` を通り、評価・完了の要求がある場合だけ `P-08` → `P-11` へ進む。区分・領域 ID・名称・起点イベントは全体概要を正本とし、`P-07`・`P-08`・`P-11` は 3 系統が共用する同じ領域である。実行機会の選択（時期・取りこぼし・busy の判定）と停止・再開の調整は、全体概要の「Orchestrator による PDCA の調整」に委ねる。

### 3.1. routine 系（P-05〜P-06）

| 順序 | プロセスグループ・区分 | プロセス領域      | PDCA | 横断上の役割                                                                                                                                                                           | 参照先                      |
| ---- | ---------------------- | ----------------- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| 1    | routine 系             | P-06 ジョブ定義   | Plan | 定型的な処理の入力・手順・実行主体・成功条件を定め、決定論的な処理は runner の直接実行、判断は agent への委譲として、register 系・schedule 系への要求を含めて再利用できる Job にする。 | [[cdfd-overview\|全体概要]] |
| 2    | routine 系             | P-05 定期実行定義 | Plan | 継続的に確認・実行する事項を、周期・条件、対象 Job、取りこぼしの扱いを持つ定義にまとめ、次回の実行を判定できる形で残す。推測で定義を補正しない。                                       | [[cdfd-overview\|全体概要]] |

### 3.2. 実行サイクル（実行・評価・完了）（P-07〜P-08・P-11）

| 順序 | プロセスグループ・区分 | プロセス領域    | PDCA   | 横断上の役割                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 参照先                                                            |
| ---- | ---------------------- | --------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 3    | 実行サイクル           | P-07 タスク実行 | Do     | 定期実行の機会と Job から Job Run と実行計画を具体化し、既存の Job Run・前回成功情報で同じ機会の重複実行を防いで、直接実行または owner ロールの agent への委譲を行う。busy・利用制限・事前条件で実行しない場合は理由を残し、Job の完了と委譲先タスクの完了を分けて記録する。定義された周期・条件・Job・権限の範囲を越える判断・承認と保護設定の変更は行わず、人間が停止を指示した場合は後続の実行を始めず進行中の成果を完了扱いしない。再開は人間の判断と記録済みの再開位置に基づく。 | [[cdfd-overview\|全体概要]]、[[sysd-job-execution\|Job 実行設計]] |
| 4    | 実行サイクル           | P-08 成果物評価 | Check  | 評価要求がある場合に、editor から独立した runner が成果と根拠を一度だけ確認し、grade・finding または評価不能の範囲を確定する。Job の成功記録だけで成果物の完成を確定しない。                                                                                                                                                                                                                                                                                                          | [[cdfd-overview\|全体概要]]                                       |
| 5    | 実行サイクル           | P-11 タスク完了 | Action | 完了要求がある場合に、人間が最新の grade・finding と完了条件を照合して完了可否を記録する。評価が古い・評価不能・条件未充足のときは完了と確定しない。                                                                                                                                                                                                                                                                                                                                  | [[cdfd-overview\|全体概要]]                                       |

## 4. データストア

全体概要から、このケースで参照・更新する正本だけを同じ名称・区分で示す。Job Run・試行履歴・前回成功情報は「実行記録」に含める。

### 4.1. マスタ・構成データ

| データストア             | 関連する参加単位 | 横断上の利用                                                                                                           |
| ------------------------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 稼働構成                 | P-06・P-07       | 実行主体・権限と実行既定値を参照する。運転中に自動で変更しない。                                                       |
| Kata / kata              | P-06・P-07・P-08 | 定義の型、作成・検証の型、評価基準を参照する。                                                                         |
| 成果物カタログ / catalog | P-08・P-11       | 成果物を評価・完了する場合に、対象の `done_criteria`・`evidence_refs` を参照する。                                     |
| 定期実行定義 / routine   | P-05・P-07       | 周期・条件、対象 Job、取りこぼしの扱い、次回判定の基準（周期型は今回の試行開始、暦型は処理済みの予定時刻）を保持する。 |
| ジョブ定義 / job         | P-05・P-06・P-07 | 入力・手順・実行主体・成功条件と、同じ論理実行を識別する規則を保持する。                                               |

### 4.2. トランザクションデータ

| データストア         | 関連する参加単位 | 横断上の利用                                                                                                                                                                            |
| -------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 登録簿 / register    | P-07・P-11       | Job が要求する対象登録項目と必要な承認を参照し、登録項目の完了を扱う場合は判断記録を残す。                                                                                              |
| Schedule（track）    | P-07             | Job が要求する対象タスク・担当・依存を参照する。タスクの状態は実行記録を正本とする。                                                                                                    |
| 実行計画 / plan      | P-07・P-11       | Job Run の対象・手順・完了条件を計画として残し、完了判断で照合する。                                                                                                                    |
| 実行記録             | P-07・P-08・P-11 | Job Run・試行結果・evidence・前回成功情報、スキップ・利用制限の理由、完了記録を残す。複数 Job は段別の結果を保ち、Orchestrator の調整による非起動の理由と次回判定情報も同じ正本に残る。 |
| 成果物 / deliverable | P-07・P-08       | 作成・更新を行う Job が成果物を更新し、評価の対象として参照される。                                                                                                                     |
| 評価結果             | P-08・P-11       | grade・finding・評価不能の理由を残し、完了判断で最新の結果を参照する。                                                                                                                  |

## 5. 概念データフロー

凡例は [[cdfd-overview|全体概要]] の「凡例（本プロダクト共通）」を参照する。各図は通常線で情報・実行要求の流れを表し、領域の内部は省略する。

### 5.1. 定期処理と Job の定義

定型的な手順から Job を定義し、その Job を対象に周期・条件を持つ定期実行の定義を残す流れを示す。

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
}

job_start: "⚡ 定型的に実行する処理の\n手順が定まった" { class: event }
routine_start: "⚡ 定期的に確認・実行する\n事項が判明した" { class: event }
job_def: "⚙️ P-06 ジョブ定義" { class: process }
routine_def: "⚙️ P-05 定期実行定義" { class: process }
config: "🧩 稼働構成" { class: store_master }
kata: "📐 Kata / kata" { class: store_master }
job: "🧰 ジョブ定義 / job" { class: store_master }
routine: "⏰ 定期実行定義 / routine" { class: store_master }

job_start -> job_def: "起動条件"
config -> job_def: "実行主体・権限"
kata -> job_def: "定義の型"
job_def -> job: "入力・手順・実行主体・成功条件"
job_def -> routine_def: "利用できる Job"
routine_start -> routine_def: "起動条件"
job -> routine_def: "対象 Job"
routine_def -> routine: "周期・条件・対象 Job・取りこぼしの扱い"
```

定義の整備に Orchestrator の定義要求が関わる場合も、その調整は全体概要の図に委ねて省略する。ジョブ定義と定期実行定義は次の図と同じデータストアである。

### 5.2. サイクル到来から Job の実行結果まで

サイクル到来を受けて P-07 が定義から Job Run を具体化し、register 系・schedule 系へ要求して、成果物と実行結果を記録する流れを示す。

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
  actor: {
    shape: rectangle
    style: {
      fill: "#f5f7fa"
      stroke: "#607d8b"
      font-color: "#000000"
    }
  }
}

cycle_start: "⚡ PDCA の各サイクルが\n到来した" { class: event }
execute: "⚙️ P-07 タスク実行" { class: process }
run_recorded: "⚡ Job Run の結果が\n記録された" { class: event }
register_sys: "📒 register 系" { class: actor }
schedule_sys: "📅 schedule 系" { class: actor }
routine: "⏰ 定期実行定義 / routine" { class: store_master }
job: "🧰 ジョブ定義 / job" { class: store_master }
config: "🧩 稼働構成" { class: store_master }
kata: "📐 Kata / kata" { class: store_master }
register: "📒 登録簿 / register" { class: store_transaction }
schedule: "📅 Schedule（track）" { class: store_transaction }
exec_plan: "📋 実行計画 / plan" { class: store_transaction }
exec_log: "🧾 実行記録" { class: store_transaction }
deliverables: "📄 成果物 / deliverable" { class: store_transaction }

cycle_start -> execute: "定期実行の機会"
routine -> execute: "周期・条件・対象 Job"
job -> execute: "入力・手順・成功条件"
config -> execute: "実行主体・権限"
kata -> execute: "作成・検証の型"
exec_log -> execute: "既存の Job Run・前回成功情報"
register -> execute: "対象登録項目・必要な承認"
schedule -> execute: "対象タスク・担当・依存"
execute -> exec_plan: "Job Run の実行計画"
execute -> register_sys: "登録項目の実行要求"
execute -> schedule_sys: "タスクの実行・再開・評価要求"
execute <- register_sys: "対応結果・利用制限の理由"
execute <- schedule_sys: "タスク結果・利用制限の理由"
execute -> deliverables: "作成・更新した成果物"
execute -> exec_log: "Job Run・試行結果・evidence・スキップ理由"
execute -> run_recorded: "今回の Job Run の結果"
```

register 系・schedule 系は要求先の境界だけを描き、その内部は [[cdfd-uc-register|register 系の CDFD]]・[[cdfd-uc-schedule|schedule 系の CDFD]] に委ねる。P-07 と同名のデータストアは次の図と共有する。

### 5.3. 評価から完了の記録まで

評価・完了の要求がある場合に、P-07 の成果と根拠を P-08 が評価し、P-11 が最新の評価と完了条件を照合して完了可否を記録する流れを示す。

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

execute: "⚙️ P-07 タスク実行" { class: process }
evaluate: "⚙️ P-08 成果物評価" { class: process }
complete: "⚙️ P-11 タスク完了" { class: process }
completion_recorded: "⚡ タスクの完了可否が\n記録された" { class: event }
kata: "📐 Kata / kata" { class: store_master }
catalog: "📚 成果物カタログ / catalog" { class: store_master }
deliverables: "📄 成果物 / deliverable" { class: store_transaction }
grade: "🧪 評価結果" { class: store_transaction }
exec_plan: "📋 実行計画 / plan" { class: store_transaction }
exec_log: "🧾 実行記録" { class: store_transaction }
register: "📒 登録簿 / register" { class: store_transaction }

execute -> evaluate: "成果・Job Run の結果・検証根拠"
deliverables -> evaluate: "評価対象"
kata -> evaluate: "評価基準"
catalog -> evaluate: "成果物の条件・根拠参照"
evaluate -> grade: "grade・finding・評価不能の理由"
evaluate -> complete: "確定した評価結果"
grade -> complete: "最新の grade・finding"
exec_plan -> complete: "対象・完了条件"
catalog -> complete: "成果物の完了条件"
complete -> exec_log: "完了判断・完了記録"
complete -> register: "登録項目の判断記録"
complete -> completion_recorded: "完了可否"
```

P-07 と同名のデータストアは前の図と共有し、成果物の種別ごとの評価手順は省略する。

### 5.4. 例外時の戻り

定義の不足は P-07 から P-06・P-05 へ、評価できない成果や未充足の完了条件は P-08・P-11 から先行する領域へ返し、補った定義や成果を再び渡す流れを示す。

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

job_def: "⚙️ P-06 ジョブ定義" { class: process }
routine_def: "⚙️ P-05 定期実行定義" { class: process }
execute: "⚙️ P-07 タスク実行" { class: process }
evaluate: "⚙️ P-08 成果物評価" { class: process }
complete: "⚙️ P-11 タスク完了" { class: process }

job_def <- execute: "不足した入力・成功条件・権限"
job_def -> execute: "補った Job の定義"
routine_def <- execute: "参照できない対象 Job・不正な周期・条件"
routine_def -> execute: "補った定期実行の定義"
execute <- evaluate: "評価できない範囲・不足した根拠"
execute -> evaluate: "そろえた成果・検証根拠"
evaluate <- complete: "古い・未確定の評価"
execute <- complete: "未充足の完了条件"

# 配置制御用（受け渡しではない）
job_def -> routine_def: {style.opacity: 0}
```

定義の不備は推測で補正せず定義の担当へ返し、成果や根拠の不足は評価・完了を確定しないために先行する領域へ返すことが重要なため図を追加する。データストアと内部の再試行、Orchestrator による再開の調整は省略する。

## 6. 未決事項

| 論点                                                                                                                                                          | 影響するケース・参加単位 | 決定者           | 決定時期             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ---------------- | -------------------- |
| _UNDECIDED_: 中断した試行の復旧・記録訂正と、停止期間の補完範囲を人間が判断する条件の詳細。定義済みの取りこぼしの扱い以外を自動で決めない。                   | C-03・P-05・P-07         | PM・OPS・ARC・QE | 自動運転の運用確定前 |
| _UNDECIDED_: routine 全体の重複起動にスキップの方針を適用するか。現行の重複起動の停止と project busy のスキップを区別したまま、状態正本の既存論点を引き継ぐ。 | C-03・P-07               | PM・ARC・QE      | 重複起動方針の確定時 |
