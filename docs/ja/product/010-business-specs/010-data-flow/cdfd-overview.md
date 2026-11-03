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

Spec道の道場である SpecDojo でプロジェクトを進めるときの業務の全体像として、7 つの区分のプロセス領域と、それらが読み書きするデータの関係を示す。

## 2. 適用範囲

- **対象**: SpecDojo を用いたプロジェクト開始から成果物作成・評価・改善を含むライフサイクル全体。
- **対象外**: 各領域の内部処理・操作手順・例外経路は詳細 CDFD へ、状態の定義・遷移は [[specdojo:stsd-rulebook|STSD の作成規範]] に従う状態定義へ委ねる。
- 承認・主要判断・公開可否は人間が責任を持ち、AI Agent は記録・提案・実行・評価を支援する（稼働構成変更の承認と非推奨化判断を含む）；参照・検証などの補助操作は独立領域にしない。

## 3. プロセス領域

業務は 14 のプロセス領域を、プロジェクト構成の構築・管理、3 系統（register・schedule・routine）、3 系統が共用してタスクを実行・評価・完了する実行サイクル、文書の廃棄、および Orchestrator の 7 区分に整理し、主な担当は [[prj-0001:pm-roles|ロール一覧]] の Role code に統一する。

### 3.1. プロジェクト構成の構築・管理（P-01・P-12）

<!-- prettier-ignore -->
| 領域 ID | PDCA | プロセス領域 | 業務目的 | 主な担当 | 起点イベント |
| --- | --- | --- | --- | --- | --- |
| `P-01` | Plan | プロジェクト初期セットアップ | プロジェクトの推進環境を整備する。 | PO、ARC | PO が新しいプロジェクトを立ち上げた |
| `P-12` | Action | 稼働構成管理 | 人間の承認に基づき SpecDojo の稼働構成を変更管理する。 | ARC | 稼働構成の変更要求が発生した |

### 3.2. register 系（P-02）

<!-- prettier-ignore -->
| 領域 ID | PDCA | プロセス領域 | 業務目的 | 主な担当 | 起点イベント |
| --- | --- | --- | --- | --- | --- |
| `P-02` | Plan | 登録簿定義 | ticket ベースで気付いた TODO や問題・課題、メモ、決定事項等を記録する。 | PM（起票は全参加者） | 未整理事項（タスク・問題・課題・メモなど）が発見された、意思決定した |

### 3.3. schedule 系（P-03〜P-04・P-09〜P-10）

<!-- prettier-ignore -->
| 領域 ID | PDCA | プロセス領域 | 業務目的 | 主な担当 | 起点イベント |
| --- | --- | --- | --- | --- | --- |
| `P-03` | Plan | 成果物カタログ定義 | プロジェクトの成果物を定義する。 | BA（提案は全参加者） | 何を成果物として管理するかの判断が確定した |
| `P-04` | Plan | スケジュール計画展開 | 成果物カタログ・スケジュール戦略と Kata grade・作成要件から、作成する成果物ごとのタスクを Schedule に展開する。 | PM | 成果物カタログが整備された |
| `P-09` | Check | 進捗可視化報告 | プロジェクトの進捗状況を可視化し、関係者に報告する。 | PM | 定期的な報告時期が到来した |
| `P-10` | Check | 派生生成閲覧提供 | 派生成果物の生成および閲覧を提供する。 | ARC | 派生成果物の生成が要求された |

### 3.4. routine 系（P-05〜P-06）

<!-- prettier-ignore -->
| 領域 ID | PDCA | プロセス領域 | 業務目的 | 主な担当 | 起点イベント |
| --- | --- | --- | --- | --- | --- |
| `P-05` | Plan | 定期実行定義 | 定義された時期・条件に基づき、継続的な確認または実行を定義する。 | PM、OPS | 定期的に確認・実行する事項が判明した |
| `P-06` | Plan | ジョブ定義 | runner が直接実行する決定論的コマンド、または agent へ委譲する判断を定義する。 | PM（定義は全参加者） | 定型的に実行する処理の手順が定まった |

### 3.5. 実行サイクル（実行・評価・完了）（P-07〜P-08・P-11）

<!-- prettier-ignore -->
| 領域 ID | PDCA | プロセス領域 | 業務目的 | 主な担当 | 起点イベント |
| --- | --- | --- | --- | --- | --- |
| `P-07` | Do | タスク実行 | 実行可能なタスクを人または AI Agent が担当し、成果物と検証可能な実行結果を残す。 | PM（実担当は各タスクの owner ロール） | 実行指示された |
| `P-08` | Check | 成果物評価 | editor から独立した runner が成果物や登録項目の対応結果を一度だけ確認し、品質や適合性を評価する。 | QE | 成果物の内容または評価コンテキストの変化に対する評価要求が発行された |
| `P-11` | Action | タスク完了 | review phase で最新の grade・finding と完了条件を照合し、タスクの完了可否を確定して記録する。 | PO、PM | 最新の grade・finding と完了要求がそろった |

### 3.6. 文書の廃棄（非推奨化・保管）（P-13）

<!-- prettier-ignore -->
| 領域 ID | PDCA | プロセス領域 | 業務目的 | 主な担当 | 起点イベント |
| --- | --- | --- | --- | --- | --- |
| `P-13` | Action | 非推奨化保管 | 人間の非推奨化判断に基づき、役割を終えた、または新 ID へ引き継がれた文書を非推奨化し、誤参照を防ぐ保管場所へ移す。 | PM、ARC | 文書が新 ID へ引き継がれた、または継続利用しないと判断された |

### 3.7. Orchestrator（P-14）

<!-- prettier-ignore -->
| 領域 ID | PDCA | プロセス領域 | 業務目的 | 主な担当 | 起点イベント |
| --- | --- | --- | --- | --- | --- |
| `P-14` | 全体 | オーケストレーター | プロジェクト全体のタスクやプロセスの PDCA を調整・管理する。 | PM（対話型運転は全参加者、自動運転は runner） | プロジェクトが開始された、PDCA の各サイクルが到来した |

## 4. データストア

読み書きするデータストアを承認された変更で更新するマスタ・構成データと業務活動に伴い都度更新するトランザクションデータに分類し、リポジトリや開発環境そのものは除外する（`<project-id>` は `docs/ja/projects/<project-id>/` を指す）。

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

「プロセス領域」の区分ごとに、PDCA のプロセスとデータの関係、プロセスを実行する設定・構成情報の流れ、Orchestrator による PDCA の調整の 3 つの図で示す。

### 5.1. PDCA のプロセスとデータの関係

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
  store_transaction: {
    shape: cylinder
    style: {
      fill: "#c8e6c9"
      stroke: "#2e7d32"
      font-color: "#000000"
    }
  }
}

register_sys: "📒 register 系\nP-02" {
  class: process
}

schedule_sys: "📅 schedule 系\nP-03〜P-04・P-09〜P-10" {
  class: process
}

routine_sys: "⏰ routine 系\nP-05〜P-06" {
  class: process
}

exec_cycle: "⚙️ 実行サイクル（実行・評価・完了）\nP-07〜P-08・P-11" {
  class: process
}

deprecation: "📦 文書の廃棄（非推奨化・保管）\nP-13" {
  class: process
}

register: "📒 登録簿 / register" {
  class: store_transaction
}

schedule: "📅 Schedule（track）" {
  class: store_transaction
}

exec_plan: "📋 実行計画 / plan" {
  class: store_transaction
}

exec_log: "🧾 実行記録" {
  class: store_transaction
}

deliverables: "📄 成果物 / deliverable" {
  class: store_transaction
}

trash: "🗃️ 保管庫（trash） / trash" {
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

register_sys -> register: "登録項目・決定"
register_sys <- schedule: "track 計画"
schedule_sys <- register: "epic 対応"
schedule_sys -> schedule: "タスク計画"
schedule_sys -> exec_plan: "実行計画"
register_sys -> exec_cycle: "対応要求"
schedule_sys -> exec_cycle: "実行要求"
register_sys <- exec_cycle: "Job 実行要求"
schedule_sys <- exec_cycle: "Job 実行・評価要求"
register <- exec_cycle: "対応・完了記録"
schedule -> exec_cycle: "タスク計画"
exec_plan <- exec_cycle: "Job 計画"
exec_plan -> exec_cycle: "実行計画"
exec_cycle -> deliverables: "成果物"
exec_cycle -> exec_log: "実行記録"
exec_cycle -> grade: "grade・finding"
schedule_sys <- exec_log: "実行記録"
schedule_sys <- grade: "grade・finding"
schedule_sys <- deliverables: "対象文書"
schedule_sys -> report: "進捗報告"
schedule_sys -> derived: "派生ビュー・索引"
exec_cycle <- report: "判断事項"
deliverables <- deprecation: "非推奨化文書"
deprecation -> trash: "保管文書"

# 配置制御用（受け渡しではない）
routine_sys -> exec_cycle -> deprecation: {style.opacity: 0}

# 配置制御用（受け渡しではない。非表示の基点で 3 系統を同段にそろえる）
layout_top: "" {
  width: 0
  height: 0
  style.opacity: 0
}

layout_top -> register_sys: {style.opacity: 0}
layout_top -> schedule_sys: {style.opacity: 0}
layout_top -> routine_sys: {style.opacity: 0}
```

register・schedule・routine の 3 系統が計画を作り、実行サイクルが計画を受けて成果物と記録を残し、評価と報告が次の計画につながる関係を示す。

### 5.2. プロセスを実行する設定・構成情報の流れ

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
}

project_config: "🚀 プロジェクト構成の構築・管理\nP-01・P-12" {
  class: process
}

register_sys: "📒 register 系\nP-02" {
  class: process
}

schedule_sys: "📅 schedule 系\nP-03〜P-04・P-09〜P-10" {
  class: process
}

routine_sys: "⏰ routine 系\nP-05〜P-06" {
  class: process
}

exec_cycle: "⚙️ 実行サイクル（実行・評価・完了）\nP-07〜P-08・P-11" {
  class: process
}

config: "🧩 稼働構成" {
  class: store_master
}

kata: "📐 Kata / kata" {
  class: store_master
}

catalog: "📚 成果物カタログ / catalog" {
  class: store_master
}

strategy: "🧭 スケジュール戦略" {
  class: store_master
}

routine: "⏰ 定期実行定義 / routine" {
  class: store_master
}

job: "🧰 ジョブ定義 / job" {
  class: store_master
}

# ELK で 3 系統の左右順をそろえるため、エッジの宣言順を維持する
register_sys <- config: "稼働構成"
register_sys <- kata: "実践の型"
exec_cycle <- strategy: "作業要件・判断基準"
schedule_sys -> strategy: "生成戦略"
project_config -> config: "稼働構成"
exec_cycle <- config: "稼働構成"
exec_cycle <- catalog: "完了条件・根拠参照"
routine_sys <- config: "稼働構成"
exec_cycle <- kata: "実践の型・rubric"
routine_sys -> job: "手順・成功条件"
schedule_sys <- config: "稼働構成"
schedule_sys -> catalog: "成果物定義"
routine_sys -> routine: "定期実行定義"
routine_sys <- kata: "定義の型"
project_config -> kata: "配置・版"
exec_cycle <- job: "手順・成功条件"
project_config <- kata: "provider 雛形"
schedule_sys <- kata: "Kata・作成要件"

# 配置制御用（受け渡しではない）
project_config -> register_sys: {style.opacity: 0}
project_config -> schedule_sys: {style.opacity: 0}
project_config -> routine_sys: {style.opacity: 0}
register_sys -> exec_cycle: {style.opacity: 0}
schedule_sys -> exec_cycle: {style.opacity: 0}
routine_sys -> exec_cycle: {style.opacity: 0}
```

プロジェクト構成の構築・管理が整えた稼働構成と Kata、各系統が定めたカタログ・戦略・定期実行・ジョブの定義を、実行サイクルが使う流れを示す。

### 5.3. Orchestrator による PDCA の調整

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

orchestrator: "🧭 Orchestrator\nP-14" {
  class: process
}

project_config: "🚀 プロジェクト構成の構築・管理\nP-01・P-12" {
  class: process
}

register_sys: "📒 register 系\nP-02" {
  class: process
}

schedule_sys: "📅 schedule 系\nP-03〜P-04・P-09〜P-10" {
  class: process
}

routine_sys: "⏰ routine 系\nP-05〜P-06" {
  class: process
}

exec_cycle: "⚙️ 実行サイクル（実行・評価・完了）\nP-07〜P-08・P-11" {
  class: process
}

deprecation: "📦 文書の廃棄（非推奨化・保管）\nP-13" {
  class: process
}

config: "🧩 稼働構成" {
  class: store_master
}

register: "📒 登録簿 / register" {
  class: store_transaction
}

exec_log: "🧾 実行記録" {
  class: store_transaction
}

orchestrator -> project_config: "構成要求"
orchestrator -> register_sys: "登録要求"
orchestrator -> schedule_sys: "計画要求"
orchestrator -> routine_sys: "定義要求"
orchestrator -> exec_cycle: "実行要求"
orchestrator -> deprecation: "廃棄要求"
orchestrator <- config: "運転設定"
orchestrator -> config: "承認済構成"
orchestrator <- register: "承認済項目"
orchestrator -> register: "登録項目・決定"
orchestrator <- exec_log: "実行状態"

# 配置制御用（受け渡しではない）
project_config -> register_sys: {style.opacity: 0}
project_config -> schedule_sys: {style.opacity: 0}
project_config -> routine_sys: {style.opacity: 0}
register_sys -> exec_cycle: {style.opacity: 0}
schedule_sys -> exec_cycle: {style.opacity: 0}
routine_sys -> exec_cycle -> deprecation: {style.opacity: 0}
```

Orchestrator が 6 つの区分に指示を出し、稼働構成・登録簿・実行記録を直接読み書きして PDCA を進める関係を示す。

## 6. 詳細 CDFD 一覧

各系統の流れはユースケース別 CDFD でプロセス領域の単位に詳細化し、入口・引き渡し・終了のイベントとデータストアの読み書きを定める。

<!-- prettier-ignore -->
| ケース ID | ユースケース（系統名） | 業務目的 | 対象系統・領域 | ユースケース別 CDFD |
| --- | --- | --- | --- | --- |
| `C-01` | register 系（登録簿起票から完了まで） | 未整理事項の発見または意思決定を入口に、登録項目の起票、対応、評価、完了記録と epic・track の引き渡しを定める | 固有: `P-02`。実行サイクル: `P-07`・`P-08`・`P-11`。調整: `P-14` | [[cdfd-uc-register\|register 系の CDFD]] |
| `C-02` | schedule 系（成果物の作成から完了まで） | 成果物として管理する対象の確定とカタログ整備を入口に、Kata grade・作成要件から track を展開し、実行、評価、完了、進捗・派生ビュー提供までを定める | 固有: `P-03`〜`P-04`・`P-09`〜`P-10`。実行サイクル: `P-07`・`P-08`・`P-11`。調整: `P-14` | `cdfd-uc-schedule` |
| `C-03` | routine 系（定期実行と Job） | 定期的な確認・実行事項の判明または定型手順の確定を入口に、定期実行定義と Job を定義し、指定契機で両系統への要求と実行・評価・結果記録を行う | 固有: `P-05`〜`P-06`。実行サイクル: `P-07`・`P-08`・`P-11`。調整: `P-14` | `cdfd-uc-routine` |

## 7. 凡例（本プロダクト共通）

本プロダクトの全 CDFD が共通して参照する、D2 記法によるノード形状・線種・色・絵文字の対応を示す。

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

ノード形状・線種・スタイルの記法は [[specdojo:cdfd-d2-rulebook|D2 記法ルール]] に従い、詳細 CDFD は本章を参照して再掲しない。
