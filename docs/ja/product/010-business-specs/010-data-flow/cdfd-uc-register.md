---
specdojo:
  id: cdfd-uc-register
  type: flow
  status: draft
  rulebook: specdojo:cdfd-uc-rulebook
  based_on:
    - cdfd-overview
---

# 概念データフロー図（登録簿起票から完了まで）

ケース `C-01`「register 系（登録簿起票から完了まで）」について、未整理事項の発見または意思決定から、登録項目の起票、対応、評価、人間による完了判断と完了記録までの流れを定める。

## 1. 目的

未整理事項や決定事項を登録簿に残し、承認された対応から評価、完了記録までを判断根拠と対応付けることで、担当者が交代しても対応の漏れを防ぎ、判断と作業を引き継げるようにする。

## 2. 適用範囲

- **対象**: `C-01` の P-02 → P-07 → P-08 → P-11 を、未整理事項の発見・意思決定から完了記録の確認まで扱い、epic・track の対応と計画・判断材料の補完に関わる schedule 系との受け渡しを含む。
- **対象外**: 他系統の内部、構成管理、文書廃棄、各領域の個別プロセス、補助操作、実装詳細、状態定義・遷移は扱わず、登録項目・実行記録の状態は `stsd-register-entry`・`stsd-job-run`、共通の責任分担と要求の調整は [[cdfd-overview|概念データフロー図（全体概要）]] の「適用範囲」と「Orchestrator による PDCA の調整」を正本とする。

## 3. プロセス領域

区分・領域 ID・名称・起点イベントは [[cdfd-overview|概念データフロー図（全体概要）]] の「プロセス領域」を正本とする。`C-01` の正常系は P-02 → P-07 → P-08 → P-11 とし、epic を計画へ展開する場合は P-04 と連携する。schedule 系は受け渡しに関係する領域だけを示し、実行サイクルは 3 系統が共用する同じ領域として扱う。

### 3.1. register 系（P-02）

| 順序 | プロセスグループ・区分 | プロセス領域    | 横断上の役割                                                                                                                                                                                                       | 参照先                                            |
| ---- | ---------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| 1    | register 系            | P-02 登録簿定義 | 全参加者が起票でき、PM が対象と決定を一意に記録する。人間が承認した対応対象を実行へ、epic と決定記録を計画へ渡す。保留は不足情報の補完と人間の承認を待ち、却下は理由を記録して実行せず、再提案には再承認を要する。 | [[cdfd-overview\|概念データフロー図（全体概要）]] |

### 3.2. schedule 系（P-03〜P-04・P-09〜P-10）

| 順序                      | プロセスグループ・区分 | プロセス領域              | 横断上の役割                                                                                                                                    | 参照先                                            |
| ------------------------- | ---------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| 補完時                    | schedule 系            | P-03 成果物カタログ定義   | 評価・完了判断に必要なカタログの完了条件・根拠参照の不足を補う。                                                                                | [[cdfd-overview\|概念データフロー図（全体概要）]] |
| 計画連携時（1 と 2 の間） | schedule 系            | P-04 スケジュール計画展開 | 対象 epic と決定を受け取り、対応する track のタスク・担当・依存と実行計画を渡す。対応や計画を特定できない場合は補完し、それまで実行を保留する。 | [[cdfd-overview\|概念データフロー図（全体概要）]] |
| 判断事項がある場合        | schedule 系            | P-09 進捗可視化報告       | 完了判断に用いる進捗報告の判断事項を渡し、対象範囲・時点の不足を補う。                                                                          | [[cdfd-overview\|概念データフロー図（全体概要）]] |

### 3.3. 実行サイクル（実行・評価・完了）（P-07〜P-08・P-11）

| 順序 | プロセスグループ・区分           | プロセス領域    | 横断上の役割                                                                                                                                                                                                                                                                                | 参照先                                            |
| ---- | -------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| 2    | 実行サイクル（実行・評価・完了） | P-07 タスク実行 | 実行指示を受け、PM が対象・計画の手順と完了条件・Kata・実行主体と権限を確認し、owner ロールが対応・検証する。必要な人間の承認について承認者の権限、決定記録と計画の対象一致を確認し、対応内容と result・evidence・実行状態を残す。保護設定の変更は実行外の適用へ委ねる。                    | [[cdfd-overview\|概念データフロー図（全体概要）]] |
| 3    | 実行サイクル（実行・評価・完了） | P-08 成果物評価 | 評価要求を受け、editor から独立した runner が対応後の対象と根拠を一度だけ照合し、QE が grade・finding または評価不能の範囲を確定する。対象変更・記録不一致・根拠不足は対応元へ返し、評価基準の不足は補完を求める。                                                                          | [[cdfd-overview\|概念データフロー図（全体概要）]] |
| 4    | 実行サイクル（実行・評価・完了） | P-11 タスク完了 | 最新の grade・finding と完了要求を受け、review phase で PO と PM が評価後の対象変更の有無、完了条件と判断事項を照合し、人間が review から close へ進める完了可否を確定する。評価不能は非適合と区別して完了確定を止める。PM が完了・決定の記録と完了記録を残し、未充足なら再計画要求を戻す。 | [[cdfd-overview\|概念データフロー図（全体概要）]] |

## 4. データストア

このケースで参照・更新する正本だけを、[[cdfd-overview|概念データフロー図（全体概要）]] と同じ名称・区分で示す。

### 4.1. マスタ・構成データ

| データストア             | 関連する参加単位 | 横断上の利用                                                                             |
| ------------------------ | ---------------- | ---------------------------------------------------------------------------------------- |
| Kata / kata              | P-07・P-08       | P-07 が実行・検証基準、P-08 が rubric・評価観点を参照する。                              |
| 稼働構成                 | P-07             | メンバー・ロール、agent 定義・権限を参照し、実行主体と承認者の権限を確認する。           |
| 成果物カタログ / catalog | P-03・P-08・P-11 | P-03 が不足を補い、P-08 が `done_criteria`・`evidence_refs`、P-11 が完了条件を参照する。 |

### 4.2. トランザクションデータ

| データストア      | 関連する参加単位             | 横断上の利用                                                                                                                                                   |
| ----------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 登録簿 / register | P-02・P-04・P-07・P-08・P-11 | P-02 が登録項目・承認判断・決定記録、P-07 が対応内容、P-11 が完了・決定の記録を更新する。P-07 が承認済み対象、P-08 が対応結果、P-04 が epic と決定を参照する。 |
| Schedule（track） | P-02・P-04                   | P-04 が生成した track 計画と epic の対応を P-02 が参照する。タスク状態は実行記録を正本とする。                                                                 |
| 実行計画 / plan   | P-04・P-07                   | P-04 が渡す対象・手順・完了条件を P-07 が参照する。P-02 に計画生成の責務を置かない。                                                                           |
| 実行記録          | P-07・P-08・P-11             | P-07 が result・evidence・実行状態、P-11 が人間の判断後の完了記録を更新し、P-08 が参照する。                                                                   |
| 評価結果          | P-08・P-11                   | P-08 が grade・finding と評価不能の範囲を記録し、P-11 が最新の結果を参照する。                                                                                 |
| 進捗報告          | P-09・P-11                   | P-09 が生成した判断事項がある場合に P-11 が参照する。register 系では生成しない。                                                                               |

## 5. 概念データフロー

### 5.1. 起票から実行結果まで

未整理事項の発見または意思決定を受けて起票し、人間が承認した対象に対応して実行結果を残し、epic の計画展開が必要な場合は P-04 を介して track と実行計画を受け取る。

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

register_def: "P-02 登録簿定義" { class: process }
plan: "P-04 スケジュール計画展開" { class: process }
execute: "P-07 タスク実行" { class: process }

start: "未整理事項（タスク・問題・課題・\nメモなど）が発見された" { class: event }
decision: "意思決定した" { class: event }
kata: "Kata / kata" { class: store_master }
config: "稼働構成" { class: store_master }
register: "登録簿 / register" { class: store_transaction }
schedule: "Schedule（track）" { class: store_transaction }
exec_plan: "実行計画 / plan" { class: store_transaction }
exec_log: "実行記録" { class: store_transaction }

start -> register_def: "起票内容"
decision -> register_def: "決定事項"
register_def -> register: "登録項目・承認判断・決定記録"
register_def -> execute: "人間が承認した対応対象"
register -> execute: "登録項目・承認の決定記録"
execute <- kata: "実行・検証基準"
execute <- config: "メンバー・ロール・権限"
register_def -> plan: "epic・決定記録（計画展開時）"
register -> plan: "epic・決定記録"
plan -> schedule: "track 計画（epic 対応）"
register_def <- schedule: "track 計画（epic 対応）"
plan -> exec_plan: "対象・手順・完了条件"
exec_plan -> execute: "対象・手順・完了条件"
register <- execute: "対応内容"
execute -> exec_log: "result・evidence・実行状態"
```

凡例は [[cdfd-overview|概念データフロー図（全体概要）]] の「凡例（本プロダクト共通）」を参照し、通常線は情報の流れを表す。物の流れと計画展開の内部は対象外とし、次図とは P-07・登録簿・実行記録を共有する。

### 5.2. 実行結果から完了記録まで

P-07 の対応結果と記録を P-08 が評価し、P-11 が最新の評価結果と完了条件を照合して人間の完了判断を登録簿と実行記録へ残す。

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

execute: "P-07 タスク実行" { class: process }
evaluate: "P-08 成果物評価" { class: process }
complete: "P-11 タスク完了" { class: process }

finish: "完了記録が残った" { class: event }
kata: "Kata / kata" { class: store_master }
catalog: "成果物カタログ / catalog" { class: store_master }
register: "登録簿 / register" { class: store_transaction }
exec_log: "実行記録" { class: store_transaction }
grade: "評価結果" { class: store_transaction }
progress: "進捗報告" { class: store_transaction }

execute -> evaluate: "対応結果・検証結果・根拠"
register -> evaluate: "対応済み登録項目"
exec_log -> evaluate: "result・evidence・実行状態"
evaluate <- catalog: "完了条件・根拠参照"
evaluate <- kata: "評価基準"
evaluate -> grade: "grade・finding・評価不能"
evaluate -> complete: "確定した評価結果・再評価条件"
grade -> complete: "最新の grade・finding"
complete <- catalog: "完了条件"
complete <- progress: "判断事項（ある場合）"
register <- complete: "人間が確定した完了・決定の記録"
exec_log <- complete: "完了記録"
complete -> finish: "記録完了の確認"
```

凡例は [[cdfd-overview|概念データフロー図（全体概要）]] の「凡例（本プロダクト共通）」を参照し、通常線は情報の流れを表す。物の流れと進捗報告の生成は省略し、前図とは P-07・登録簿・実行記録を共有する。

### 5.3. 例外時の戻り

対象・計画・評価根拠・判断事項の不足を補完責任のある領域へ返し、完了条件の未充足は P-02 へ再計画要求として戻す。

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

register_def: "P-02 登録簿定義" { class: process }
catalog_def: "P-03 成果物カタログ定義" { class: process }
plan: "P-04 スケジュール計画展開" { class: process }
execute: "P-07 タスク実行" { class: process }
evaluate: "P-08 成果物評価" { class: process }
report: "P-09 進捗可視化報告" { class: process }
complete: "P-11 タスク完了" { class: process }
catalog: "成果物カタログ / catalog" { class: store_master }
progress: "進捗報告" { class: store_transaction }

register_def <- plan: "特定できない epic・決定"
register_def <- execute: "不足項目・保留や却下の理由"
plan <- execute: "epic・track の不一致・計画の不足"
execute <- evaluate: "対象変更・記録不一致・不足根拠"
catalog_def <- evaluate: "不足する評価条件・根拠参照"
catalog_def <- complete: "特定できない完了条件"
catalog_def -> catalog: "補完した完了条件・根拠参照"
evaluate <- complete: "未確定・不整合の評価対象・評価不能"
report <- complete: "判断事項の不足・報告対象と時点"
report -> progress: "補完した判断事項"
register_def <- complete: "未充足事項・再計画要求"
```

凡例は [[cdfd-overview|概念データフロー図（全体概要）]] の「凡例（本プロダクト共通）」を参照し、通常線は情報の戻りと補完結果を表す。前二図と同じ領域・データストアを共有し、承認保留・却下、評価不能と未充足を区別するため図を追加する。補完・再承認後の再提示と登録簿等への記録は前二図、要求の調整と権限・Kata の補完依頼は全体概要の「Orchestrator による PDCA の調整」へ委ね、物の流れと内部の再試行は省略する。
