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

定期的に確認・実行する事項を定期実行と Job の定義に残し、サイクルが来るたびに同じ手順で実行して結果を記録することで、特定の人の記憶や手作業に頼らずに反復作業を続け、前回の結果を次の判断に生かせるようにする。

## 2. 適用範囲

- **対象**: `C-03` の routine 系（`P-05`〜`P-06`）と、3 系統が共用する実行サイクル（`P-07`〜`P-08`・`P-11`）との受け渡しを対象に、定期実行と Job の定義、および「PDCA の各サイクルが到来した」から Job の実行、register 系・schedule 系への要求、評価・完了と結果の記録までを扱う。
- **対象外**: 実行サイクルの内部、Orchestrator（`P-14`）による実行機会の選択・調整、register 系・schedule 系の内部、コマンド・保存形式などの実装詳細は扱わず、責任分担と調整は [[cdfd-overview|全体概要]]、状態の定義・遷移は [[stsd-routine-run|定期処理の実行結果のステータス定義]] と未作成の `stsd-job-run`・`stsd-task-execution` へ委ねる。

## 3. プロセス領域

ケース `C-03` は、定義を routine 系の `P-06` → `P-05` の順に整え、サイクル到来後は実行サイクルを通り、評価・完了の要求がある場合だけ実行サイクルの中で評価・完了まで進む。区分・領域 ID・名称・起点イベントは全体概要を正本とする。実行サイクルは 3 系統が共通して通る領域のまとまりのため、本書では 1 つの参加単位として受け渡しだけを示し、内部の領域間の流れは描かない。実行機会の選択（時期・取りこぼし・busy の判定）と停止・再開の調整は、全体概要の「Orchestrator による PDCA の調整」に委ねる。

### 3.1. routine 系（P-05〜P-06）

| 順序 | プロセスグループ・区分 | プロセス領域      | PDCA | 横断上の役割                                                                                                                                                                           | 参照先                      |
| ---- | ---------------------- | ----------------- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| 1    | routine 系             | P-06 ジョブ定義   | Plan | 定型的な処理の入力・手順・実行主体・成功条件を定め、決定論的な処理は runner の直接実行、判断は agent への委譲として、register 系・schedule 系への要求を含めて再利用できる Job にする。 | [[cdfd-overview\|全体概要]] |
| 2    | routine 系             | P-05 定期実行定義 | Plan | 継続的に確認・実行する事項を、周期・条件、対象 Job、取りこぼしの扱いを持つ定義にまとめ、次回の実行を判定できる形で残す。推測で定義を補正しない。                                       | [[cdfd-overview\|全体概要]] |

### 3.2. 実行サイクル（実行・評価・完了）（P-07〜P-08・P-11）

| 順序 | プロセスグループ・区分 | 含む領域               | PDCA              | 横断上の役割                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 参照先                                                            |
| ---- | ---------------------- | ---------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 3    | 実行サイクル           | `P-07`〜`P-08`・`P-11` | Do・Check・Action | 定期実行の機会と Job から Job Run と実行計画を具体化し、既存の Job Run・前回成功情報で同じ機会の重複実行を防いで、直接実行、owner ロールの agent への委譲、register 系・schedule 系への要求を行う。busy・利用制限・事前条件で実行しない場合は理由を残し、Job の完了と委譲先タスクの完了を分けて記録する。評価・完了の要求がある場合だけ、editor から独立した runner による一度だけの評価と、人間による最新の grade・finding と完了条件の照合を経て完了可否を記録し、Job の成功記録だけで成果物の完成を確定しない。定義された周期・条件・Job・権限の範囲を越える判断・承認と保護設定の変更は行わず、人間が停止を指示した場合は後続の実行を始めず進行中の成果を完了扱いしない。再開は人間の判断と記録済みの再開位置に基づく。 | [[cdfd-overview\|全体概要]]、[[sysd-job-execution\|Job 実行設計]] |

## 4. データストア

全体概要から、このケースで参照・更新する正本だけを同じ名称・区分で示す。Job Run・試行履歴・前回成功情報は「実行記録」に含める。実行サイクルは 1 つの参加単位として示し、その内部だけで参照する正本は含めない。

### 4.1. マスタ・構成データ

| データストア           | 関連する参加単位         | 横断上の利用                                                                                                           |
| ---------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| 稼働構成               | P-06・実行サイクル       | 実行主体・権限と実行既定値を参照する。運転中に自動で変更しない。                                                       |
| Kata / kata            | P-06                     | Job の定義の型を参照する。                                                                                             |
| 定期実行定義 / routine | P-05・実行サイクル       | 周期・条件、対象 Job、取りこぼしの扱い、次回判定の基準（周期型は今回の試行開始、暦型は処理済みの予定時刻）を保持する。 |
| ジョブ定義 / job       | P-05・P-06・実行サイクル | 入力・手順・実行主体・成功条件と、同じ論理実行を識別する規則を保持する。                                               |

### 4.2. トランザクションデータ

| データストア         | 関連する参加単位 | 横断上の利用                                                                                                                                                                            |
| -------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 登録簿 / register    | 実行サイクル     | Job が要求する対象登録項目と必要な承認を参照し、登録項目の完了を扱う場合は判断記録を残す。                                                                                              |
| Schedule（track）    | 実行サイクル     | Job が要求する対象タスク・担当・依存を参照する。タスクの状態は実行記録を正本とする。                                                                                                    |
| 実行計画 / plan      | 実行サイクル     | Job Run の対象・手順・完了条件を計画として残し、完了判断で照合する。                                                                                                                    |
| 実行記録             | 実行サイクル     | Job Run・試行結果・evidence・前回成功情報、スキップ・利用制限の理由、完了記録を残す。複数 Job は段別の結果を保ち、Orchestrator の調整による非起動の理由と次回判定情報も同じ正本に残る。 |
| 成果物 / deliverable | 実行サイクル     | 作成・更新を行う Job が成果物を更新し、評価の対象にする。                                                                                                                               |
| 評価結果             | 実行サイクル     | grade・finding・評価不能の理由を残し、完了判断で最新の結果を参照する。                                                                                                                  |

## 5. 概念データフロー

凡例は [[cdfd-overview|全体概要]] の「凡例（本プロダクト共通）」を参照する。各図は通常線で情報・実行要求の流れを表し、ノードの絵文字は全体概要の図と同じ割り当てにする。

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
job_def: "⏰ P-06 ジョブ定義" { class: process }
routine_def: "⏰ P-05 定期実行定義" { class: process }
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

### 5.2. サイクル到来から Job Run の計画まで

サイクル到来を受けて実行サイクルが定期実行と Job の定義、前回までの記録、要求先の対象から Job Run の実行計画を具体化する流れを示す。

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

cycle_start: "⚡ PDCA の各サイクルが\n到来した" { class: event }
exec_cycle: "⚙️ 実行サイクル（実行・評価・完了）\nP-07〜P-08・P-11" { class: process }
routine: "⏰ 定期実行定義 / routine" { class: store_master }
job: "🧰 ジョブ定義 / job" { class: store_master }
config: "🧩 稼働構成" { class: store_master }
exec_log: "🧾 実行記録" { class: store_transaction }
register: "📒 登録簿 / register" { class: store_transaction }
schedule: "📅 Schedule（track）" { class: store_transaction }
exec_plan: "📋 実行計画 / plan" { class: store_transaction }

cycle_start -> exec_cycle: "定期実行の機会"
routine -> exec_cycle: "周期・条件・対象 Job"
job -> exec_cycle: "入力・手順・成功条件"
config -> exec_cycle: "実行主体・権限"
exec_log -> exec_cycle: "既存の Job Run・前回成功情報"
register -> exec_cycle: "対象登録項目・必要な承認"
schedule -> exec_cycle: "対象タスク・担当・依存"
exec_cycle -> exec_plan: "Job Run の実行計画"
```

実行サイクルの内部は描かず、実行機会の選択と調整は全体概要の図に委ねる。実行サイクル・実行記録・登録簿は次の図と共有する。

### 5.3. 系統への要求から結果の記録まで

実行サイクルが register 系・schedule 系へ要求して結果を受け取り、成果物、評価結果、判断記録と Job Run の結果を記録する流れを示す。

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
  store_transaction: {
    shape: cylinder
    style: {
      fill: "#c8e6c9"
      stroke: "#2e7d32"
      font-color: "#000000"
    }
  }
}

exec_cycle: "⚙️ 実行サイクル（実行・評価・完了）\nP-07〜P-08・P-11" { class: process }
register_sys: "📒 register 系\nP-02" { class: process }
schedule_sys: "📅 schedule 系\nP-03〜P-04・P-09〜P-10" { class: process }
run_recorded: "⚡ Job Run の結果が\n記録された" { class: event }
deliverables: "📄 成果物 / deliverable" { class: store_transaction }
grade: "🧪 評価結果" { class: store_transaction }
exec_log: "🧾 実行記録" { class: store_transaction }
register: "📒 登録簿 / register" { class: store_transaction }

exec_cycle -> register_sys: "登録項目の実行要求"
exec_cycle -> schedule_sys: "タスクの実行・再開・評価要求"
exec_cycle <- register_sys: "対応結果・利用制限の理由"
exec_cycle <- schedule_sys: "タスク結果・利用制限の理由"
exec_cycle -> deliverables: "作成・更新した成果物"
exec_cycle -> grade: "grade・finding・評価不能の理由"
exec_cycle -> register: "登録項目の判断記録"
exec_cycle -> exec_log: "Job Run・試行結果・evidence・スキップ理由・完了記録"
exec_cycle -> run_recorded: "今回の Job Run の結果・完了可否"
```

register 系・schedule 系は要求先の境界だけを描き、その内部は [[cdfd-uc-register|register 系の CDFD]]・[[cdfd-uc-schedule|schedule 系の CDFD]] に委ねる。評価・完了は要求がある場合だけ実行サイクルの中で行い、その内部の流れは描かない。

### 5.4. 例外時の戻り

定義の不足は実行サイクルから P-06・P-05 へ返し、補った定義を再び渡す流れを示す。

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

job_def: "⏰ P-06 ジョブ定義" { class: process }
routine_def: "⏰ P-05 定期実行定義" { class: process }
exec_cycle: "⚙️ 実行サイクル（実行・評価・完了）\nP-07〜P-08・P-11" { class: process }

job_def <- exec_cycle: "不足した入力・成功条件・権限"
job_def -> exec_cycle: "補った Job の定義"
routine_def <- exec_cycle: "参照できない対象 Job・不正な周期・条件"
routine_def -> exec_cycle: "補った定期実行の定義"

# 配置制御用（受け渡しではない）
job_def -> routine_def: {style.opacity: 0}
```

定義の不備は推測で補正せず定義の担当へ返す。register 系・schedule 系から返る利用制限の理由は前の図に示し、評価できない範囲や未充足の完了条件による実行サイクル内部の戻り、データストアと内部の再試行、Orchestrator による再開の調整は省略する。

## 6. 未決事項

| 論点                                                                                                                                                                                   | 影響するケース・参加単位       | 決定者           | 決定時期                       |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ---------------- | ------------------------------ |
| _UNDECIDED_: 中断した試行の復旧・記録訂正と、停止期間の補完範囲を人間が判断する条件の詳細。定義済みの取りこぼしの扱い以外を自動で決めない。                                            | C-03・P-05・実行サイクル       | PM・OPS・ARC・QE | 自動運転の運用確定前           |
| _UNDECIDED_: routine 全体の重複起動にスキップの方針を適用するか。現行の重複起動の停止と project busy のスキップを区別したまま、状態正本の既存論点を引き継ぐ。                          | C-03・実行サイクル             | PM・ARC・QE      | 重複起動方針の確定時           |
| _UNDECIDED_: 実行サイクル（`P-07`〜`P-08`・`P-11`）の内部を描く唯一の正本文書。全体概要は領域の定義と 1 ノードの図だけを持つため、確定までは全体概要を参照し、本書では内部を描かない。 | C-01・C-02・C-03・実行サイクル | BA・ARC          | 3 系統の詳細 CDFD の整合確認時 |
