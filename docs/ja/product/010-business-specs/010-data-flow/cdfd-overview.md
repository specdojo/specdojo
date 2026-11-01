---
specdojo:
  id: cdfd-overview
  type: flow
  status: draft
  rulebook: specdojo:cdfd-overview-rulebook
  based_on: []
  supersedes: []
---

# 概念データフロー図（全体概要）: SpecDojo

SpecDojo を活用したプロジェクト運営の全体概要について、立ち上げから成果物作成、レビュー、承認までを PDCA サイクルに沿った業務プロセスとして整理する。

## 1. 目的

SpecDojo を活用した仕様駆動開発について、PO が共通・基盤と register・schedule・routine の 3 系統の業務境界および 14 領域の分割を承認するための全体像を示す。ARC は各系統の詳細 CDFD の設計入力として、QE は領域と詳細化先の対応から重複・欠落を確認する入力として用い、参加者が判断と作業を引き継げるようにする。

## 2. 適用範囲

- **対象**: SpecDojo を用いたプロジェクト開始から成果物作成・評価・改善を含むライフサイクル全体。
- **対象外**: 各領域の内部処理・操作手順・例外経路は詳細 CDFD へ、状態の定義・遷移は [[specdojo:stsd-rulebook|STSD の作成規範]] に従う状態定義へ委ねる。
- 承認・主要判断・公開可否は人間が責任を持ち、AI Agent は記録・提案・実行・評価を支援する（稼働構成変更の承認と非推奨化判断を含む）；参照・検証などの補助操作は独立領域にしない。

## 3. プロセス領域

業務は 14 のプロセス領域を六つのプロセスグループにまとめ、主な担当は [[prj-0001:pm-roles|ロール一覧]] の Role code に統一する。領域の分割は本章の表、受け渡しは「概念データフロー（概要）」の図、各系統の領域単位の流れは「ユースケース別 CDFD」の詳細化先を正本とする。

### 3.1. Onboarding（P-01）

<!-- prettier-ignore -->
| 領域 ID | プロセス領域 | 業務目的 | 主な担当 | 起点イベント |
| --- | --- | --- | --- | --- |
| `P-01` | プロジェクト初期セットアップ | プロジェクトの推進環境を整備する。 | PO、ARC | PO が新しいプロジェクトを立ち上げた |

### 3.2. Plan（P-02〜P-06）

<!-- prettier-ignore -->
| 領域 ID | プロセス領域 | 業務目的 | 主な担当 | 起点イベント |
| --- | --- | --- | --- | --- |
| `P-02` | 登録簿定義 | ticket ベースで気付いた TODO や問題・課題、メモ、決定事項等を記録する。 | PM（起票は全参加者） | 未整理事項（タスク・問題・課題・メモなど）が発見された、意思決定した |
| `P-03` | 成果物カタログ定義 | プロジェクトの成果物を定義する。 | BA（提案は全参加者） | 何を成果物として管理するかの判断が確定した |
| `P-04` | スケジュール計画展開 | 成果物カタログ・スケジュール戦略と Kata grade・作成要件から、作成する成果物ごとのタスクを Schedule に展開する。 | PM | 成果物カタログが整備された |
| `P-05` | 定期実行定義 | 定義された時期・条件に基づき、継続的な確認または実行を定義する。 | PM、OPS | 定期的に確認・実行する事項が判明した |
| `P-06` | ジョブ定義 | runner が直接実行する決定論的コマンド、または agent へ委譲する判断を定義する。 | PM（定義は全参加者） | 定型的に実行する処理の手順が定まった |

### 3.3. Do（P-07）

<!-- prettier-ignore -->
| 領域 ID | プロセス領域 | 業務目的 | 主な担当 | 起点イベント |
| --- | --- | --- | --- | --- |
| `P-07` | タスク実行 | 実行可能なタスクを人または AI Agent が担当し、成果物と検証可能な実行結果を残す。 | PM（実担当は各タスクの owner ロール） | 実行指示された |

### 3.4. Check（P-08〜P-10）

<!-- prettier-ignore -->
| 領域 ID | プロセス領域 | 業務目的 | 主な担当 | 起点イベント |
| --- | --- | --- | --- | --- |
| `P-08` | 成果物評価 | editor から独立した runner が成果物や登録項目の対応結果を一度だけ確認し、品質や適合性を評価する。 | QE | 成果物の内容または評価コンテキストの変化に対する評価要求が発行された |
| `P-09` | 進捗可視化報告 | プロジェクトの進捗状況を可視化し、関係者に報告する。 | PM | 定期的な報告時期が到来した |
| `P-10` | 派生生成閲覧提供 | 派生成果物の生成および閲覧を提供する。 | ARC | 派生成果物の生成が要求された |

### 3.5. Action（P-11〜P-13）

<!-- prettier-ignore -->
| 領域 ID | プロセス領域 | 業務目的 | 主な担当 | 起点イベント |
| --- | --- | --- | --- | --- |
| `P-11` | タスク完了 | review phase で最新の grade・finding と完了条件を照合し、タスクの完了可否を確定して記録する。 | PO、PM | 最新の grade・finding と完了要求がそろった |
| `P-12` | 稼働構成管理 | 人間の承認に基づき SpecDojo の稼働構成を変更管理する。 | ARC | 稼働構成の変更要求が発生した |
| `P-13` | 非推奨化保管 | 人間の非推奨化判断に基づき、役割を終えた、または新 ID へ引き継がれた文書を非推奨化し、誤参照を防ぐ保管場所へ移す。 | PM、ARC | 文書が新 ID へ引き継がれた、または継続利用しないと判断された |

### 3.6. Orchestrator（P-14）

<!-- prettier-ignore -->
| 領域 ID | プロセス領域 | 業務目的 | 主な担当 | 起点イベント |
| --- | --- | --- | --- | --- |
| `P-14` | オーケストレーター | プロジェクト全体のタスクやプロセスの PDCA を調整・管理する。 | PM（対話型運転は全参加者、自動運転は runner） | プロジェクトが開始された、PDCA の各サイクルが到来した |

## 4. データストア

読み書きするデータストアを、承認された変更で更新するマスタ・構成データと、業務活動に伴い都度更新するトランザクションデータに分け、リポジトリや開発環境そのものは含めない。`<project-id>` は `docs/ja/projects/<project-id>/` を指す。

### 4.1. マスタ・構成データ

<!-- prettier-ignore -->
| データストア | 主な内容 | 主な保管先 |
| --- | --- | --- |
| 稼働構成 | SpecDojo を稼働させる最低限の設定。リポジトリ層は SpecDojo の依存とバージョン、プロジェクト登録・パス設定、実行既定値、索引規則、agent 名簿・権限、オーケストレーター・executor・reporter の定義と入口指示。プロジェクト層は人間のメンバー、ロール、レビュー観点 | `package.json`、<br>`.specdojo/specdojo.config.json`、<br>`.specdojo/agent-members.yaml`、<br>`.specdojo/exec-defaults.yaml`、<br>`.specdojo/index-config.yaml`、<br>`.specdojo/<provider>/`、<br>`.claude/agents/`、<br>`.claude/settings.json`、<br>`.codex/`、<br>`.opencode/`、<br>`.agents/*.agent.md`、<br>`.github/agents/`、<br>`CLAUDE.md`、<br>`AGENTS.md`、<br>`<project-id>/030-project-management/pm-members.yaml`、<br>`<project-id>/030-project-management/pm-roles.yaml`、<br>`<project-id>/030-project-management/pm-review-viewpoints.yaml` |
| Kata / kata | rulebook、recipe、template、sample、standard、schema、Kata grade・作成要件、plan・result テンプレート、既定レビュー観点、評価 rubric、provider 別の agent 定義・設定の雛形、agent 向けの記述ルールと skill。内容は product 側で保守し、プロジェクトでは配置とバージョン更新だけを行う | `docs/ja/specdojo/`、<br>`docs/specdojo/schemas/`、<br>`templates/<provider>/`、<br>`.github/instructions/`、<br>`.claude/rules/`、<br>`.claude/skills/`、<br>`.agents/skills/` |
| 成果物カタログ / catalog | 成果物 ID、種別、依存、完了条件（`done_criteria`）、根拠参照（`evidence_refs`）。担当は持たず、スケジュール戦略の `owner_rules` から Schedule（track）へ展開する | `<project-id>/010-deliverables-catalog/dct-*.yaml` |
| スケジュール戦略 | 既定値、トラックごとのタスク生成戦略（対象カタログ、approach、phase の作業要件、ゲート・マイルストーンの定義） | `<project-id>/schedule/sch-defaults.yaml`、<br>`<project-id>/schedule/sch-strategy-<track>.yaml` |
| 定期実行定義 / routine | 周期・条件、対象ジョブ、次回判定に使う状態 | `<project-id>/routines/rtn-*.yaml` |
| ジョブ定義 / job | 実行手順、runner 直接実行か agent 委譲か、成功条件 | `<project-id>/jobs/job-*.yaml` |

### 4.2. トランザクションデータ

<!-- prettier-ignore -->
| データストア | 主な内容 | 主な保管先 |
| --- | --- | --- |
| 登録簿 / register | 登録項目の個票、登録簿索引、状態遷移イベント。epic は register 側の作業のまとまりとして schedule 側の track とつながる | `<project-id>/controls/project-register/` |
| Schedule（track） | epic とつながるトラックごとのタスク、担当、期間、依存と、タスクに依存するマイルストーン。スケジュール戦略と成果物カタログから `schedule build` で生成する計画の正本であり、タスクの状態は持たない。状態は実行記録を正本とする | `<project-id>/schedule/sch-track-<track>.yaml`、<br>`<project-id>/schedule/sch-milestones.yaml`、<br>`<project-id>/timeline/` |
| 実行計画 / plan | plan。タスクごとの実施手順、対象文書、完了条件 | `<project-id>/execution/exec/plans/` |
| 実行記録 | result、状態遷移イベント、evidence、trial、ジョブ実行記録、agent 実行ログ | `<project-id>/execution/exec/results/`、<br>`<project-id>/execution/exec/events/`、<br>`<project-id>/execution/exec/evidence/`、<br>`<project-id>/execution/exec/trials/`、<br>`<project-id>/execution/jobs/runs/`、<br>`logs/` |
| 成果物 / deliverable | プロジェクトで作成・更新する成果物本体。プロジェクト定義（概要、憲章、スコープ）や計画書も含む | `docs/ja/product/`（`trash/` を除く）、<br>`<project-id>/020-project-definition/`、<br>`<project-id>/030-project-management/`（稼働構成に属する YAML を除く） |
| 保管庫（trash） / trash | 非推奨化して退避した文書 | `docs/ja/product/trash/`、<br>`<project-id>/trash/` |
| 評価結果 | 完了条件の判定、grade、finding | `<project-id>/execution/grade/`、<br>成果物 Frontmatter の `grade`（成果物データストアとファイルを共有し、`grade` キーだけを評価結果の正本として埋め込む） |
| 進捗報告 | ダッシュボード、クリティカルパス、ガントチャート、各種ログの生成ビュー | `<project-id>/execution/generated/`、<br>`<project-id>/controls/generated/` |
| 派生ビュー・索引 | YAML の閲覧ページ、文書索引、サイトビルド出力（進捗報告に含まれる生成ビューを除く） | 各 `generated/<name>.md`、<br>`.specdojo/doc-index.json` |

## 5. 概念データフロー（概要）

「系統の関係を描く」方式で共通・基盤と 3 系統の関係を 3 図に分け、図をまたぐ同名ノードは同じ責務・正本を表す。矢印は情報・実行要求の受け渡し（実行順や毎回の通過ではない）であり、更新エッジは更新前の参照を含む。

### 5.1. 共通・基盤と 3 系統

共通・基盤が 3 系統を支える関係と、Kata・稼働構成・非推奨化の正本を示す。

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

foundation: "🚀 共通・基盤\nP-01・P-12〜P-13" {
  class: process
}

orchestrator: "🎛️ Orchestrator\nP-14" {
  class: process
}

register_sys: "📒 register 系\nP-02・共通実行領域" {
  class: process
}

schedule_sys: "📅 schedule 系\nP-03〜P-04・P-09〜P-10\n共通実行領域" {
  class: process
}

routine_sys: "⏰ routine 系\nP-05〜P-06・共通実行領域" {
  class: process
}

kata: "📐 Kata / kata" {
  class: store_master
}

config: "🧩 稼働構成" {
  class: store_master
}

deliverables: "📄 成果物 / deliverable" {
  class: store_transaction
}

trash: "🗃️ 保管庫（trash） / trash" {
  class: store_transaction
}

kata -> foundation: "provider 別雛形"
foundation -> kata: "配置・バージョン更新"
foundation -> config: "初期状態・承認済み構成変更"
config -> orchestrator: "agent 定義・実行既定値"
kata -> register_sys: "rulebook・recipe・template・rubric"
kata -> schedule_sys: "Kata grade・作成要件・実践の型"
kata -> routine_sys: "rulebook・recipe・template・rubric"
config -> register_sys: "メンバー・ロール・agent 定義・権限"
config -> schedule_sys: "メンバー・ロール・agent 定義・権限"
config -> routine_sys: "agent 定義・権限・実行既定値"
foundation -> deliverables: "人間の判断に基づく非推奨化文書"
foundation -> trash: "保管した文書"
```

「凡例（本プロダクト共通）」に従い、`->` は情報・実行要求の流れを表し、物の流れは対象外とする。起点イベントは「プロセス領域」の表に置き、系統内の流れは「詳細 CDFD 一覧」の詳細化先へ委ねる。

### 5.2. epic・track・Job による系統間の接続

系統間をつなぐ epic・track・Job と Orchestrator の関係を示す。Orchestrator は利用者または定期実行の意図を受けて要求を調整し、Job の実行でも「適用範囲」の人間の判断境界に従う。

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

orchestrator: "🎛️ Orchestrator\nP-14" {
  class: process
}

register_sys: "📒 register 系\nP-02・共通実行領域" {
  class: process
}

schedule_sys: "📅 schedule 系\nP-03〜P-04・P-09〜P-10\n共通実行領域" {
  class: process
}

routine_sys: "⏰ routine 系\nP-05〜P-06・共通実行領域" {
  class: process
}

register: "📒 登録簿 / register" {
  class: store_transaction
}

catalog: "📚 成果物カタログ / catalog" {
  class: store_master
}

strategy: "🧭 スケジュール戦略" {
  class: store_master
}

schedule: "📅 Schedule（track）" {
  class: store_transaction
}

routine: "⏰ 定期実行定義 / routine" {
  class: store_master
}

job: "🧰 ジョブ定義 / job" {
  class: store_master
}

orchestrator -> register_sys: "計画・実行・評価・完了要求"
orchestrator <- register_sys: "実行状態・判断依頼・結果"
orchestrator -> schedule_sys: "計画・実行・評価・完了要求"
orchestrator <- schedule_sys: "実行状態・判断依頼・結果"
orchestrator -> routine_sys: "定義・Job 実行要求"
orchestrator <- routine_sys: "Job 実行状態・判断依頼"
orchestrator <- routine: "実行時期・条件・対象 Job"
orchestrator <- job: "ジョブ手順・成功条件"
orchestrator <- strategy: "phase の作業要件"
orchestrator <- catalog: "done_criteria・evidence_refs"
register_sys -> register: "登録項目・決定・完了記録"
register -> schedule_sys: "epic と track の対応"
schedule -> register_sys: "track 計画（epic 対応）"
schedule_sys -> catalog: "成果物定義・完了条件・根拠参照"
schedule_sys -> strategy: "既定値・タスク生成戦略"
schedule_sys -> schedule: "タスク・担当・依存"
routine_sys -> routine: "周期・条件・対象 Job"
routine_sys -> job: "実行手順・委譲先・成功条件"
register_sys <- job: "登録項目の実行要求"
schedule_sys <- job: "タスク実行・成果物評価要求"
```

「凡例（本プロダクト共通）」に従い、`->` は情報・実行要求の流れを表し、物の流れは対象外とする。系統内の処理順と epic・track の対応フィールドは省略し、実行成果の受け渡しは「共用する実行計画・成果物・実行記録」に示す。

### 5.3. 共用する実行計画・成果物・実行記録

3 系統が共用する実行成果と、進捗・派生ビューの正本を示す。grade・finding は完了判定で参照する確定済みの事実とする。

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

orchestrator: "🎛️ Orchestrator\nP-14" {
  class: process
}

register_sys: "📒 register 系\nP-02・共通実行領域" {
  class: process
}

schedule_sys: "📅 schedule 系\nP-03〜P-04・P-09〜P-10\n共通実行領域" {
  class: process
}

routine_sys: "⏰ routine 系\nP-05〜P-06・共通実行領域" {
  class: process
}

exec_plan: "📋 実行計画 / plan" {
  class: store_transaction
}

deliverables: "📄 成果物 / deliverable" {
  class: store_transaction
}

exec_log: "🧾 実行記録" {
  class: store_transaction
}

grade: "🧪 評価結果" {
  class: store_transaction
}

report: "📊 進捗報告" {
  class: store_transaction
}

derived: "🗂️ 派生ビュー・索引" {
  class: store_transaction
}

orchestrator <- exec_plan: "対象・手順・完了条件"
orchestrator <- exec_log: "記録済みの実行状態"
orchestrator -> exec_log: "サイクルの実行記録"
register_sys -> exec_plan: "実行計画"
schedule_sys -> exec_plan: "実行計画"
register_sys -> deliverables: "作成・更新した成果物"
schedule_sys -> deliverables: "作成・更新した成果物"
register_sys -> exec_log: "実行状態・実行結果・完了記録"
schedule_sys -> exec_log: "実行状態・実行結果・完了記録"
routine_sys -> exec_log: "ジョブ実行状態・実行結果・完了記録"
register_sys -> grade: "grade・finding"
schedule_sys -> grade: "grade・finding"
routine_sys -> grade: "grade・finding"
schedule_sys -> report: "進捗報告"
schedule_sys -> derived: "派生ビュー・索引"
```

「凡例（本プロダクト共通）」に従い、`->` は情報・実行要求の流れを表し、物の流れは対象外とする。更新前の参照を更新エッジに含めるため、対象成果物・実行記録・最新の評価結果への参照エッジは省略する。

## 6. 詳細 CDFD 一覧

各系統の流れはユースケース別 CDFD でプロセス領域の単位に詳細化し、入口・引き渡し・終了のイベントとデータストアの読み書きを定める。共通・基盤（P-01・P-12・P-13）の関係は「共通・基盤と 3 系統」を境界とし、状態の定義・遷移は STSD に委ねる。

### 6.1. プロセスグループ別 CDFD（移行期の参照）

次表は、旧プロセスグループ別 CDFD の非推奨化までの移行期の参照として残す。

<!-- prettier-ignore -->
| プロセスグループ | 含む領域 | プロセスグループ別 CDFD |
| --- | --- | --- |
| Onboarding | `P-01` | [[cdfd-onboarding\|Onboarding の CDFD]] |
| Plan | `P-02`〜`P-06` | [[cdfd-plan\|Plan の CDFD]] |
| Do | `P-07` | [[cdfd-do\|Do の CDFD]] |
| Check | `P-08`〜`P-10` | [[cdfd-check\|Check の CDFD]] |
| Action | `P-11`〜`P-13` | [[cdfd-action\|Action の CDFD]] |
| Orchestrator | `P-14` | [[cdfd-orchestrator\|Orchestrator の CDFD]] |

### 6.2. ユースケース別 CDFD

P-02〜P-06・P-09〜P-10 は次表の各系統に固有の領域、P-07・P-08・P-11・P-14 は各系統が利用する共通の実行・評価・完了・調整の責務とする。共通領域を別領域として複製せず、同じ領域 ID・名称・データストアを用い、系統固有の入口と受け渡しだけを詳細化する。

<!-- prettier-ignore -->
| ケース ID | ユースケース（系統名） | 業務目的 | 対象系統・領域 | ユースケース別 CDFD |
| --- | --- | --- | --- | --- |
| `C-01` | register 系（登録簿起票から完了まで） | 未整理事項の発見または意思決定を入口に、登録項目の起票、対応、評価、完了記録と epic・track の引き渡しを定める | 固有: `P-02`。共通: `P-07`・`P-08`・`P-11`・`P-14` | [[cdfd-uc-register\|register 系の CDFD]] |
| `C-02` | schedule 系（成果物の作成から完了まで） | 成果物として管理する対象の確定とカタログ整備を入口に、Kata grade・作成要件から track を展開し、実行、評価、完了、進捗・派生ビュー提供までを定める | 固有: `P-03`〜`P-04`・`P-09`〜`P-10`。共通: `P-07`・`P-08`・`P-11`・`P-14` | `cdfd-uc-schedule` |
| `C-03` | routine 系（定期実行と Job） | 定期的な確認・実行事項の判明または定型手順の確定を入口に、定期実行定義と Job を定義し、指定契機で両系統への要求と実行・評価・結果記録を行う | 固有: `P-05`〜`P-06`。共通: `P-07`・`P-08`・`P-11`・`P-14` | `cdfd-uc-routine` |

旧プロセスグループ別 6 文書と [[cdfd-uc-deliverable|成果物の作成から完了までの CDFD]] の移行・参照切替は、PJR-SJQC の決定に基づき epic PJR-GEZN で行う。

## 7. 凡例（本プロダクト共通）

本プロダクトの全 CDFD が共通して参照するノード形状・線種・色・絵文字の対応を示す。記法は D2、全体概要は共通・基盤と 3 系統を代表ノードとする「系統の関係を描く」方式とし、各系統の流れはユースケース別 CDFD で領域単位に描く。

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
  physical_store: {
    shape: rectangle
    style: {
      border-radius: 20
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
  material_flow: {
    style: {
      stroke-width: 3
    }
  }
}

actor_node: "🧑 外部主体" {
  class: actor
}
event_node: "⚡ 起点イベント" {
  class: event
}
process_node: "⚙️ プロセス／グループ／系統" {
  class: process
}
master_store: "🗄️ マスタ・構成データ" {
  class: store_master
}
transaction_store: "🗄️ トランザクションデータ" {
  class: store_transaction
}
physical_store_node: "🏬 物理保管" {
  class: physical_store
}

actor_node -> process_node: "情報の流れ"
event_node -> process_node: "起動条件"
process_node -> master_store: "参照・更新"
process_node -> transaction_store: "更新"
process_node -> physical_store_node: "物の流れ" {
  class: material_flow
}

# 配置制御用（受け渡しではない）: 物理保管をデータストアより下に置く
master_store -> physical_store_node: {style.opacity: 0}
transaction_store -> physical_store_node: {style.opacity: 0}
```

<!-- prettier-ignore -->
| 概念 | 形状 | 色 | 絵文字例 |
| --- | --- | --- | --- |
| プロセス／プロセスグループ／系統・共通基盤 | 角丸四角形（`style.border-radius: 8`） | 青（`#e3f2fd` / `#1e88e5`） | 業務内容が伝わる絵文字（例: ⚙️） |
| 起点イベント | 六角形（`shape: hexagon`） | 橙（`#fff3e0` / `#fb8c00`） | 出来事が伝わる絵文字（例: ⚡） |
| データストア（マスタ・構成データ） | 円柱（`shape: cylinder`） | 薄い緑（`#e8f5e9` / `#43a047`） | 保管物が伝わる絵文字（例: 📐） |
| データストア（トランザクションデータ） | 円柱（`shape: cylinder`） | 中間の緑（`#c8e6c9` / `#2e7d32`） | 保管物が伝わる絵文字（例: 📒） |
| 物理保管 | 大角丸四角形（`style.border-radius: 20`） | 中間の緑（トランザクションデータと同じ） | 保管場所が伝わる絵文字（例: 🏬） |
| 外部主体 | 四角形（`shape: rectangle`） | グレー（`#f5f7fa` / `#607d8b`） | 主体が伝わる絵文字（例: 🧑） |
| 情報の流れ | ラベル付き通常線 `->` | — | — |
| 物の流れ | ラベル付き太線 `->`（`material_flow` class） | — | — |

ノード形状・線種・スタイルの記法は [[specdojo:cdfd-d2-rulebook|D2 記法ルール]] に従い、本章で採用する色・絵文字の割り当てを固定する。マスタ・構成データは承認された変更、トランザクションデータは都度の業務活動を更新契機とする区分であり、詳細 CDFD は本章を参照し再掲しない。

## 8. 未決事項

<!-- prettier-ignore -->
| 論点 | 影響 | 決定者 | 決定時期 | 状態 |
| --- | --- | --- | --- | --- |
| _UNDECIDED_: 稼働構成変更の承認結果・非推奨化判断を渡す境界の文書間統一 | 「適用範囲」の人間の判断責任と [[cdfd-action\|Action の CDFD]] の処理境界を照合し、判断主体と受け渡しを統一する必要がある | PO（ARC・PM が整理） | 詳細 CDFD の境界確定前 | 文書間整合の確認待ち |
