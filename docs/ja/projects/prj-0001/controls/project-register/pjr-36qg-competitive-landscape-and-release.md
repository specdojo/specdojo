---
specdojo:
  id: prj-0001:pjr-36qg-competitive-landscape-and-release
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: note
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-09-06T13:53:16Z"
---

# PJR-36QG 競合状況

## 1. 概要

公開作業は [[prj-0001:pjr-7vkr-npm-release]] と [[prj-0001:pjr-0143-vs-code-marketplace]] で扱う。
本 note は競合の観測に絞る。

本 note は状況の変化に応じて更新する。終端させない。初回調査は 2026-09-06 時点で、`Gas Town / Gas City` は 2026-09-24、Claude Code / Codex の plan 機能との比較とチームでの利用は 2026-09-30、v0.3.0 の機能の比較、設計文書の領域の比較、ソフトウェア以外の領域への適用の評価は 2026-10-08 に追加した。

2026-10-24 に BMAD・AI-DLC との比較を `3.14.` へ追加した。開発方式全体の直接競合として両者を扱う。
2026-11-18 に長期タスクの実行力の比較を `3.15.` へ追加した。
2026-11-23 に、外部の分析（ChatGPT）との突き合わせと、同じ日の実測からの評価を `3.16.` へ追加した。
同じ日に、理解の負債という課題の一般性と既存の取り組みとの比較を `3.17.` へ追加した。
それ以前の「独自」「確認できず」という評価は、各節に掲げた比較対象と調査日の範囲に限る。
BMAD・AI-DLC を含む市場全体での独自性を示すものではない。

## 2. 競合の状況

### 2.1. 主要な3つ

初回調査で選んだ SDD の比較対象である。開発方式全体の競合を網羅する一覧ではなく、BMAD・AI-DLC を含む位置づけは `3.14.1.` で補う。

| ツール   | 提供元     | 形態                 | 配布                                  |
| -------- | ---------- | -------------------- | ------------------------------------- |
| Spec Kit | GitHub     | CLI（Python）        | `uv tool install specify-cli`         |
| Kiro     | AWS        | IDE（Code OSS 派生） | 製品として提供                        |
| OpenSpec | Fission-AI | CLI（Node）          | `npm install -g @fission-ai/openspec` |

いずれも 2026 年時点で活発である。SDD は既に確立した領域で、後発として参入する位置にある。

### 2.2. Spec Kit

最も広く採用されている。無償、MIT、agent 中立で 38 の統合を持つ。Claude Code、Copilot、Gemini、
Cursor などへ対応する。ワークフローは `Spec → Plan → Tasks → Implement` である。

機能ごとに独立した仕様ファイルを保ち、機能間の相互作用を分析できる。greenfield（0→1）に最適化
されている。

### 2.3. Kiro

Amazon Bedrock 経由の Claude で動く agentic IDE である。要件、設計、タスクを生成し、人の承認を
経てからコードを書く。仕様が正本でコードは生成物という位置づけを取る。

固有の機能として次を持つ。

- **agent hooks**: ファイル変更やパイプラインイベントで agent タスクを自動実行する。IDE 内で
  動く GitHub Actions に近い。
- **steering files**: プロジェクトの規約、採用ライブラリ、アーキテクチャ判断を Markdown で
  持続的に与える。毎回の説明を不要にする。

要件は EARS 記法で書き、タスクは要件へ紐づく。3 フェーズのゲート（要件、設計、タスクと実行）で
人が承認する。

AWS 外では MCP カタログと並列実行の利点を失う。ベンダーロックインの指摘がある。

### 2.4. OpenSpec

軽量な spec レイヤーである。5 コマンド、`openspec/changes/` 配下の Markdown、20 以上の AI
アシスタントへ対応する。

`propose` / `apply` / `archive` の3コマンドで、提案、実行、履歴への移動を行う。提案、実行中、
アーカイブ済みの監査証跡を保つ。変更が追加・変更・削除した内容だけを記録する差分仕様を生成する。

brownfield（1→n）に最適化されている。既存コードベースの進化を扱う設計で、greenfield には
向かないとされる。

### 2.5. beads

登録簿領域の直接競合である。SDD ツールではなく、coding agent 向けの課題追跡に特化する。

| 項目   | 内容                      |
| ------ | ------------------------- |
| 提供元 | Steve Yegge               |
| 実装   | Go、MIT                   |
| 公開   | 2025-10-12                |
| star   | 26,957（2026-09-07 時点） |
| 配布   | バイナリ                  |

解こうとする問題は「50 First Dates」である。agent はセッションをまたぐと前日の作業を覚えて
いない。この記憶の欠落を、依存関係を持つ課題グラフで埋める。

保存方式は Dolt（版管理付き SQL データベース）を `.beads/embeddeddolt/` に埋め込む。git remote
に対する `bd dolt push` / `pull` で同期する。`.beads/issues.jsonl` へエクスポートするが、これは
閲覧と交換のための出力であり正本ではない。初期は SQLite と JSONL の組み合わせで、JSONL を git
へ commit する方式であった。

主要コマンドは `bd create` / `bd ready` / `bd update --claim` / `bd close` / `bd dep add` /
`bd prime` / `bd remember` である。`bd setup claude` のように agent 別のフック設定を持つ。

依存の種別は blocks、parent-child、discovered-from、relates-to などを持ち、`bd ready` が未完了の
依存を持たない課題だけを返す。

Markdown に対する立場を明示的に取る。公式の説明は「plans/ ディレクトリの食べかけの markdown の
山を置き換える」と述べており、SpecDojo とは正反対の前提に立つ。

### 2.6. Gas Town / Gas City

2026-09-24 の追加調査で、beads がより大きなエコシステムの一部であることが分かった。当初は beads 単体を登録簿の競合として扱っていたが、**実行基盤の競合を見落としていた**。

| リポジトリ            | star   | 作成    | 実装 | 内容                           |
| --------------------- | ------ | ------- | ---- | ------------------------------ |
| `steveyegge/beads`    | 27,391 | 2025-10 | Go   | 課題追跡。agent の記憶の外部化 |
| `gastownhall/gastown` | 18,167 | 2025-12 | Go   | multi-agent workspace manager  |
| `gastownhall/gascity` | 1,293  | 2026-02 | Go   | orchestration-builder SDK      |

star 数は 2026-09-24 時点。いずれも直近まで活発に更新されている。Steve Yegge が Gas Town を始め、Gas City は community（Julian Knutsen、Chris Sells）が Gas Town を部品へ分解して作った SDK で、エコシステムの新しい方向とされる。

Gas City は「CLI coding agent を束ね、durable な beads の work、再利用可能な workflow、テスト、レビュー、ゲートで回す software factory platform」と自称する。

#### 2.6.1. SpecDojo の exec 層との対応

| Gas City                                                                 | SpecDojo                                          | 一致度 |
| ------------------------------------------------------------------------ | ------------------------------------------------- | ------ |
| runtime providers（tmux / subprocess / exec / ACP / Kubernetes / herdr） | `command_template` による provider 抽象           | 高     |
| beads（work store）                                                      | register                                          | 高     |
| orders（定期ディスパッチ）                                               | routine（`routine run --due`）                    | 高     |
| formulas（再利用可能な workflow）                                        | exec plan テンプレート（`xep-*`）                 | 中     |
| gates / tests / reviews                                                  | 親検証と review フェーズ                          | 高     |
| health patrol（desired state と actual state の突き合わせ）              | 該当なし                                          | -      |
| `city.toml`（宣言的設定）                                                | `exec-defaults.yaml` + `pm-members.yaml`          | 高     |
| 対応 CLI: Claude / Codex / Gemini                                        | claude / codex / opencode / antigravity / copilot | 同等   |

**tmux が Gas City の既定 runtime provider である。** agent を tmux セッションで回す方式は、この領域では既に標準的な実装手段であり、後発が同じことをしても差別化にならない。

#### 2.6.2. 対話型オーケストレーターとの関係

Gas City は人と会話する司令塔ではなく、**多数の自律 agent を回すための SDK** である。数百の並行 agent と enterprise 規模を掲げる。SpecDojo の対話型オーケストレーター（提案 → 承認 → 実行、commit 先の 3 層分離、保護設定）とは目的が異なり、直接の競合は薄い。

競合するのは SpecDojo の exec 層である。executor / reporter pipeline、worktree 隔離、親検証、routine、rate limit 検出は、Gas City の解く問題とほぼ重なる。

#### 2.6.3. 設計思想の違い

| 観点       | Gas Town / Gas City     | SpecDojo                           |
| ---------- | ----------------------- | ---------------------------------- |
| 正本       | データベース（beads）   | Markdown                           |
| 目的       | agent を多数動かす基盤  | 成果物体系を人と agent で維持する  |
| 成果物の型 | 持たない                | kata 106 種                        |
| 想定規模   | 数百 agent、enterprise  | 単独〜小規模                       |
| 品質       | tests / reviews / gates | grade による継続評価 + review 観点 |

#### 2.6.4. 判定

「agent を多数回す」競争には参加しない。規模と成熟度で勝てず、tmux による実行や work routing はこのエコシステムが既に押さえている。

SpecDojo の exec 層は、成果物体系を維持するための手段として位置づける。差別化として前面に出すのは成果物 kata の網羅範囲と品質の継続評価であり、実行基盤はそれを支える構成要素とする。beads に対する register の判定（Markdown が正本、kata と実行に接続）と同じ論理である。

## 3. SpecDojo との比較

4つの視点で比較する。判定は 2026-09-06 時点の公開情報に基づく。各ツールの内部実装まで確認して
いないため、「確認できなかった」は「存在しない」を意味しない。

### 3.1. 考え方のレベル

[[specdojo:specdojo-philosophy]] が掲げる3方針との対応である。

| 方針                   | Spec Kit           | Kiro                       | OpenSpec            | SpecDojo           |
| ---------------------- | ------------------ | -------------------------- | ------------------- | ------------------ |
| Docs as Code           | 仕様を Git で管理  | 仕様が正本、コードは生成物 | Markdown を repo へ | 同左               |
| Kata（実践の型）       | テンプレートあり   | steering files             | 規約は薄い          | 4種別を体系化      |
| Human & AI Readability | 構造化テンプレート | EARS 記法                  | 差分仕様            | Frontmatter + 本文 |

**類似**: 「仕様を正本とし、コードを生成物として扱う」思想は Kiro と一致する。Git で管理し
機械検証する点は3ツールとも共通で、独自性はない。

**独自**: philosophy を文書種別として持ち、規約の設計理由を standard と分離している点。他は
規約（何をするか）を持つが、判断原則（なぜそうするか）を独立した正本として扱う構造は確認
できなかった。`2.6. 簡潔さと文章量を責務に合わせる` のように、AI が冗長な文章を書く傾向へ
対処する原則を明文化している点も見当たらない。

**劣位**: 思想の記述量が多い。philosophy だけで 177 行あり、導入時の学習コストが Spec Kit の
`Spec → Plan → Tasks → Implement` の4語より明らかに高い。OpenSpec は「5コマンド、Markdown だけ」
を掲げており、参入障壁の低さで劣る。

### 3.2. kata / ryu / waza の体系

| 観点             | Spec Kit     | Kiro           | OpenSpec   | SpecDojo             |
| ---------------- | ------------ | -------------- | ---------- | -------------------- |
| 型の種別数       | テンプレート | steering files | 規約は最小 | 8種別（うち kata 4） |
| 参照度合いの制御 | 確認できず   | 確認できず     | 確認できず | `approach` で切替    |
| 型自体の品質管理 | 確認できず   | 確認できず     | 確認できず | `grade`              |

**類似**: 「AI へ持続的な文脈を与える」目的は Kiro の steering files と同じである。プロジェクト
の規約、採用ライブラリ、アーキテクチャ判断を Markdown で与え、毎回の説明を不要にする点は共通
する。

**独自**: 型を rulebook / recipe / sample / template の4種別へ分け、それぞれが答える問いを
区別している点。「何を書くか」「どう作るか」「どの形から始めるか」「完成形はどうなるか」を
別文書とする構造は他に見当たらない。`approach` で参照度合いを切り替え、成熟度に応じて
`fully-guided` から `retrofit` まで変える仕組みも確認できなかった。

型自体を継続評価する `grade` も独自である。他ツールはテンプレートを提供するが、その品質を測る
仕組みは持たない。

**劣位**: 種別が多い。8種別のうち kata 4種別を成果物ごとに揃える負担は大きい。本リポジトリで
301文書に達しており、走査で sample の40%が `fail` と判定された事実は、体系の維持コストが
高いことを示す。Spec Kit や OpenSpec の「テンプレート1つ」の方が導入は容易である。

### 3.3. 遂行体系

`register → exec / timeline → schedule → exec / routine / grade` の連携である。

| 機能           | Spec Kit   | Kiro         | OpenSpec       | SpecDojo          |
| -------------- | ---------- | ------------ | -------------- | ----------------- |
| 課題の登録簿   | 確認できず | 確認できず   | 確認できず     | `register`        |
| 実行の状態追跡 | 確認できず | 確認できず   | 提案/実行/保管 | 遷移イベント      |
| スケジュール   | 確認できず | タスク依存順 | 確認できず     | `schedule`（CPM） |
| 定期実行       | 確認できず | agent hooks  | 確認できず     | `routine`         |
| worktree 隔離  | 確認できず | 並列実行あり | 確認できず     | `exec --worktree` |
| 品質の継続評価 | 確認できず | 確認できず   | 確認できず     | `grade`           |

**類似**: OpenSpec の `propose` / `apply` / `archive` は状態遷移を持ち、提案・実行中・アーカイブ
済みの監査証跡を保つ。SpecDojo の登録簿の `open` → `close` に相当する。Kiro の agent hooks は
ファイル変更で agent タスクを起動する点で `routine` と目的が重なる。

**独自**: 実行を登録簿の状態遷移として記帳し、`start` の actor に実行した agent 名を残す構造。
本セッションで実際に、私が経路を外れて実装した際に記録が欠落し、やり直した経緯がある。この
検知が働くのは記帳が仕組みとして組み込まれているためである。

worktree の統合失敗から統合段だけを再試行する経路（PJR-Y0AH）、agent の設定変更を止めて申し
送りを自動記録する保護機構（PJR-VH6R）も確認できなかった。

CPM によるスケジュール生成は、SDD ツールというよりプロジェクト管理ツールの領域である。この
組み合わせ自体が特徴といえる。

**劣位**: 機能が多く、全体像の把握に時間がかかる。本セッションだけで統合の欠陥を3件（PJR-REDS、
PJR-E6QJ、PJR-G1QZ）発見しており、機能量に対して成熟度が追いついていない。Spec Kit は38統合、
OpenSpec は25以上の AI アシスタントへ対応するが、SpecDojo は `pm-members.yaml` で定義した
agent に限られる。

### 3.4. local LLM の活用

| 観点                   | Spec Kit   | Kiro           | OpenSpec   | SpecDojo             |
| ---------------------- | ---------- | -------------- | ---------- | -------------------- |
| agent 中立             | 38統合     | Bedrock 前提   | 25以上     | provider 設定で追加  |
| local LLM              | 確認できず | 確認できず     | 確認できず | opencode 経由で利用  |
| 役割別のモデル使い分け | 確認できず | Sonnet と Nova | 確認できず | executor/reporter 別 |
| 同時実行の制御         | 確認できず | 確認できず     | 確認できず | `max_concurrency`    |

**類似**: Kiro はタスク種別でモデルを切り替える。仕様生成に Claude Sonnet、コード生成に Amazon
Nova を使う。SpecDojo の executor と reporter の使い分けと発想が近い。

**独自**: local LLM を実運用の段として組み込んでいる点。本セッションの走査では、1段目と2段目を
gemma（Ollama）、3段目を codex で実行し、codex 呼び出しを rulebook で72%削減した。ローカル
モデルの制約（メモリ競合、モデルロード待ち）を `max_concurrency: 1` として設定へ落としている
点も、実運用での知見が反映されている。

Kiro は Bedrock 前提でベンダーロックインの指摘がある。Spec Kit と OpenSpec は agent 中立だが、
local LLM を前提とした段構成やリソース制御は確認できなかった。

**劣位**: 対応 agent 数で劣る。Spec Kit と OpenSpec は導入時に agent を選べば同じテンプレートが
動くが、SpecDojo は `pm-members.yaml` と `exec-defaults.yaml` の両方を設定する必要がある。

### 3.5. 成果物 kata の網羅範囲

競合3ツールが提供する文書は次のとおりである。

| ツール   | 提供する文書                                             |  数 |
| -------- | -------------------------------------------------------- | --: |
| Kiro     | `requirements.md`（EARS 記法）、`design.md`、`tasks.md`  |   3 |
| OpenSpec | `proposal.md`、`specs/`、`design.md`（任意）、`tasks.md` |   4 |
| Spec Kit | 仕様、計画、タスクのテンプレート                         |   3 |

いずれも「機能単位の変更」を1セットの文書で扱う設計である。要件、設計、タスクの3点セットが
基本形で、ツール間の差は記法（EARS）や粒度（差分仕様）にある。

SpecDojo の rulebook は 106 件あり、成果物の種類ごとに分かれている。

| 領域             | 例                                                                |
| ---------------- | ----------------------------------------------------------------- |
| 業務・要件       | `bac`（受入基準）、`br`（業務ルール）、`bes`/`bps`（業務モデル）  |
| 仕様             | `ifx-api`/`ifx-cmd`/`ifx-file`/`ifx-msg`（インタフェース）、`sac` |
| 設計             | `sysd`（システム設計）、`cxd`/`cnd`/`cpd`/`cdfd`（C4 各層）       |
| データ           | `bdd`/`ccd`/`cld`/`cstd`/`cdsd`（データモデル各種）               |
| 実装・テスト     | `imp-*`（実装方針5種）、`utc`/`itc`/`stc`/`atc`（テスト各層）     |
| トレーサビリティ | `trc-requirements-to-specs`、`trc-requirements-to-tests`          |
| プロジェクト管理 | `prj-*`（憲章、スコープ、前提制約）、`pm-*`（体制、計画、RACI）   |

**独自**: この網羅範囲を持つ競合は確認できなかった。競合は「機能単位の変更」を扱うのに対し、
SpecDojo は「プロジェクト全体の成果物体系」を型化している。C4 モデルの各層、データモデルの
5種類、テストの4層、トレーサビリティ行列をそれぞれ独立した kata として持つ構成は見当たらない。

さらに各 rulebook に recipe / sample / template が対応し、1つの成果物種別あたり最大4文書の
kata が用意される。「どう書くか」「完成形はどうか」「どの形から始めるか」を分けて提供する
構造も他にない。

**劣位**: 網羅範囲の広さが維持負担に直結する。237 件の kata を評価した結果、要修正は 137 件
（58%）であった。競合の3〜4文書に対し、SpecDojo は桁が違う量を保守する必要がある。

また利用者から見ると、106 種類の成果物のうちどれを使うかの判断が要る。競合は「まず
requirements.md を書く」で始められるが、SpecDojo は成果物カタログの設計から入る。

### 3.6. 開始の容易さ

「いつでもどこからでも始められる」という利点について検討する。

**そのとおりである根拠**:

- `approach` に `retrofit` があり、既存の成果物を後から型へ寄せられる。OpenSpec も brownfield
  対応を掲げるが、こちらは「変更を差分仕様として記録する」方式で、既存文書そのものを型へ
  合わせる仕組みではない。
- 成果物カタログで必要な成果物だけを宣言できる。106 種類すべてを作る必要はない。
- philosophy の `2.7. 小さく始めて、必要に応じて拡張する` が方針として明記されている。

**留保が要る点**:

- 「どこからでも」は成果物カタログを設計してからである。`dct-*.yaml` で何を作るかを宣言する
  工程が先にあり、ここが競合の「まず requirements.md を書く」より重い。
- 106 種類から選ぶ判断が利用者に委ねられる。選定を助ける仕組み（推奨セット、規模別の
  プリセット）は確認していない。
- 本セッションで確認した限り、最小構成で始める手順を示した文書は見当たらない。
  [[specdojo:waza-guide]] が全体像を扱うが、これは「小さく始める」ための導線とは異なる。

したがって「いつでもどこからでも始められる」は設計思想としては正しいが、**それを支える導線が
現状では弱い**。retrofit や最小構成の手順を示せれば、競合に対する優位として主張できる。

### 3.6.1. register 単体での利用可能性

「軽く始められる」という主張の裏付けとして、register が他の機能へ依存するかを確認した。

`src/register.ts` は `getProjectRegisterPath` だけを参照する。`src/exec-register.ts` に catalog
への参照はない。catalog や kata を用意しなくても `register add` / `close` と
`exec run --register` は成立する。

当初は `schedule_path` と `execution_path` が型定義上の必須で、register だけを使う場合も設定を
書く必要があった。一方 `src/build-command.ts` の `isStepApplicable` は、各 path が設定されている
ときだけ対応する build 段を実行する。path は既に opt-in スイッチとして働いており、型の必須指定
だけが実挙動とずれていた。この不整合を解消し、両 path を省略可能にした（既定値は `schedule` /
`execution`）。

| 設定                    | 型定義 | register に必要か            |
| ----------------------- | ------ | ---------------------------- |
| `project_register_path` | 任意   | 必要                         |
| `schedule_path`         | 任意   | 不要。省略できる             |
| `execution_path`        | 任意   | `exec run --register` で必要 |
| `members_path`          | 任意   | agent 実行時のみ必要         |
| `catalog_path`          | 任意   | 不要                         |

これにより最小構成は次まで縮む。

```json
{
  "version": 1,
  "current_project": "prj-min",
  "projects": {
    "prj-min": {
      "base_path": "docs/ja/projects/prj-min",
      "project_register_path": "controls/project-register"
    }
  }
}
```

この構成を一時ディレクトリで実測し、`register add` / `start` / `close` / `build` が動作すること、
登録簿本体と owner / priority / status の3ビュー、および PM 系ログが生成されることを確認した。

### 3.6.2. backlog としての register

register を backlog とみなすと、アジャイル開発の基盤として扱える。必要な要素との対応は次の
とおりである。

| backlog に要る要素 | register の対応                                        |
| ------------------ | ------------------------------------------------------ |
| 項目の追加         | `register add`（todo / issue / question など7種別）    |
| 優先順位           | `priority`（high / medium / low）                      |
| 期限               | `due`                                                  |
| 担当               | `owner`。人と agent を同じ欄で扱う                     |
| 状態の可視化       | `register build` が status / owner / priority 別ビュー |
| 実行への接続       | `exec run --register`                                  |

競合3ツールに登録簿に相当する機能は確認できなかった。OpenSpec の `propose` / `apply` /
`archive` は個々の変更提案の状態遷移であり、複数項目を優先順位付きで並べて残す台帳ではない。

**register 単体の位置づけ**は、SDD ツールというより「agent への指示と結果が履歴として残る
backlog」である。この用途なら kata を1つも用意せずに始められる。網羅範囲の広さが導入障壁に
なるという `3.5.` の劣位を、register から入る導線で回避できる。

#### 3.6.2.1. git だけで完結すること

当初この note は「課題管理は GitHub Issues が担う成熟領域であり、差別化は限定的」と記述して
いた。これは比較の軸を誤っていた。Issues と register は同じ土俵にない。

| 観点                 | GitHub Issues              | register               |
| -------------------- | -------------------------- | ---------------------- |
| 実体                 | サーバ上の DB              | リポジトリ内のファイル |
| 取得                 | API 経由                   | `git clone` で丸ごと   |
| agent からの読み取り | 認証・トークン・レート制限 | ファイルを読むだけ     |
| コードとの関係       | 別管理。参照は番号のみ     | 同一コミットに同居     |
| 可搬性               | エクスポートが必要         | ディレクトリを移すだけ |
| 可用性               | サービスへ依存             | リポジトリがあれば動く |

重いのは次の2点である。

**agent が読める形式であること**。Issues を agent に読ませるには MCP なり API なりの経路が要り、
認証とレート制限が付く。register は登録簿の Markdown を読むだけで、ツール統合を必要としない。

**同一コミットに同居すること**。Issues 運用では、コードは Git、課題はサーバに分かれる。実装の
経緯を追うにはコミットから番号を拾ってサーバへ問い合わせる必要があり、Issue が後から編集されて
いても履歴には残らない。register では `git log` だけで、その時点の判断・実装・記帳を再構成
できる。ブランチを切れば課題の状態も分岐し、マージすれば統合される。worktree で並行実行しても
各 worktree が自分の登録簿を持つ。

この性質は Docs as Code の philosophy から直接導かれる。思想と実装が一致している。

劣位は、ブラウザから起票できない、通知が飛ばない、開発者以外が参加しにくい点である。ただし
agent 主体の運用では重要度が下がる。

### 3.6.3. 未解決: テンプレートの解決元

上記の実測で、別リポジトリから使う際の障害を1件検出した。

`specdojoRootDir()` は利用者リポジトリのルートを返し、register は
`docs/ja/specdojo/templates/pjr-*-template.md` と `pm-*-template.md` をそこから読む。npm で
インストールした利用者のリポジトリにこれらは存在せず、`Template not found` で失敗する。

同梱パッケージ側へフォールバックする経路が要る。npm 公開（`4.`）の前提条件である。

あわせて、同梱対象の template 26 件に `specdojo:finding` コメントが残っていることを確認した。
実測では finding コメントが生成された登録簿の要約欄へ流入した。公開前に除去するか、生成時に
除去する必要がある。

### 3.6.4. beads との比較

beads は register の直接競合である。SDD ツール3種とは異なり、比較対象が register そのものに
なるため独立して扱う。

| 観点           | beads                          | register                        |
| -------------- | ------------------------------ | ------------------------------- |
| 正本           | Dolt データベース              | Markdown                        |
| git が持つもの | エクスポート（`issues.jsonl`） | 正本そのもの                    |
| 人間可読性     | `bd show` を要する             | ファイルをそのまま読める        |
| 依存関係       | **グラフ。4種の依存**          | **なし**                        |
| 着手可能判定   | **`bd ready`**                 | **なし**（schedule 側にはある） |
| 同時実行       | 埋め込みは単一書き込み         | worktree で分離                 |
| agent 統合     | `bd setup claude` 等           | ファイル読み取りのみ            |
| 導入           | バイナリ1つ                    | Node + 設定                     |
| 採用           | 26,957 star                    | 実質未公開                      |

**類似**: git を同期の土台にして課題を持ち回る発想は同じである。サーバを立てずに分散させる点、
agent が課題を claim して状態を進める点、監査証跡を残す点も一致する。beads の
`bd update --claim` は `register start`、`bd close` は `register close` に対応する。

agent の記憶を課題として外部化する目的も共通する。beads の「50 First Dates」は、SpecDojo が
登録簿と plan / result で解いている問題と同じである。

**register が優る点**: 正本が Markdown である。beads は git に置くのがエクスポートであり、正本は
データベースにある。`git log` で差分を読んでも意味が追いにくく、閲覧に `bd show` が要る。
register は登録簿も個票もそのまま読め、VitePress でも GitHub でも描画される。ツールが無い環境、
将来 SpecDojo を使わなくなった後でも読める。

加えて register は課題と成果物が同じ体系にある。beads は課題追跡に特化し、仕様や設計の kata を
持たない。SpecDojo は登録簿から `exec run --register` を経て成果物へ接続する。

**依存関係と着手可能判定の扱い**: beads は依存グラフの4種別と `bd ready` を tracker 内に持つ。
register にはどちらもない。当初これを欠落と判断したが、誤りであった。

SpecDojo は順序判定を別の層へ分離している。track 間の順序は timeline の `depends_on` /
`parallel_group` / `order`、タスク単位の順序と ready 判定は schedule の CPM が担う。
`src/schedule.ts` が読むのは catalog / timeline / roles であり、register は参照しない。

beads が tracker 内で依存判定を行うのは planning 層を持たないためである。SpecDojo で同じことを
すれば timeline と schedule に対する二重実装になる。したがってこれは優劣ではなく、planning 層を
持つか持たないかの帰結である。

register 項目は todo / question / risk などのアドホックな項目で、並び順は human の判断領域に
ある。`register add` に工数・期間の項目もなく、CPM の入力を満たさない。この経緯は
[[prj-0001:pjr-srqz-register-dependencies]] に記録した。

**採用規模**: beads は公開から約11か月で 26,957 star を集めた。register は実質未公開である。
「git ベースの agent 向け課題追跡」という枠を beads が先に取っている。

**判定**: 登録簿を単体機能として比べると、完成度と採用で beads が先行している。register の意味は
「Markdown が正本であること」と「kata と実行に接続していること」の2点にある。前者は思想の
一貫性であり、後者は SpecDojo 全体の設計に由来する。beads は課題追跡として完成度が高いが、
仕様体系と順序計画は持たない。

したがって register を単独の製品として売り込む方針は取らない。SpecDojo の一部として、成果物
体系と実行記帳に接続された登録簿という位置づけを維持する。依存関係と ready 判定の欠落は、
beads との差というより登録簿自体の弱点として [[prj-0001:pjr-srqz-register-dependencies]] へ起票した。

### 3.7. 総合

| 区分         | 内容                                                                                                                               |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| 独自性が高い | 実行の記帳、品質の継続評価、local LLM の段構成、保護機構、**kata の網羅範囲**                                                      |
| 類似         | 仕様を正本とする思想、型による文脈供給、状態遷移による追跡                                                                         |
| 劣位         | 学習コスト、体系の維持負担、対応 agent 数、機能量に対する成熟度、**開始の導線**、**実行基盤の規模と成熟度（Gas Town / Gas City）** |

SDD の入口機能では既存ツールに対抗しにくい。差別化の軸は次の3つと考えられる。

1. **成果物 kata の網羅範囲**。競合は機能単位の3〜4文書を扱うが、SpecDojo はプロジェクト全体の
   成果物体系を型化する。C4 各層、データモデル5種、テスト4層、トレーサビリティを含む。
2. **実行の記帳**。誰が何をいつ行ったかを登録簿の状態遷移として残す。監査可能性を要する組織に
   向く。
3. **品質の継続評価**。文書の劣化を検知する。長期運用する文書体系に向く。

一方、小規模で素早く始めたい用途では OpenSpec や Spec Kit が適する。SpecDojo は「小さく始める」
ことを philosophy で掲げているが、それを支える導線が弱い。ここを整えれば、網羅範囲の広さと
開始の容易さを両立できる。

この位置づけが妥当かは実際の利用者の反応を見ないと判断できない。

2026-09-24 の追加調査（`Gas Town / Gas City`）を踏まえると、差別化の軸 2「実行の記帳」は慎重に扱う必要がある。実行基盤としては Gas City が同じ問題を解いており、規模で先行している。記帳が意味を持つのは、それが成果物体系と登録簿へ接続されている場合に限る。実行基盤そのものの機能比較へ持ち込まない。

### 3.8. Claude Code / Codex の plan 機能との比較

2026-09-30、v0.3.0 の公開を前に、利用者から「register と orchestrator は、beads・Spec Kit・Gas City・Kiro・Claude や Codex の plan と比べて優位性があるか」という問いがあった。これまでの比較に含めていなかった Claude Code と Codex の plan 機能を、公開情報（下記の URL）をもとに追加する。

| 観点         | Claude Code の plan mode                                     | Codex の plan mode / ExecPlan（`PLANS.md`） | register + orchestrator                                                                  |
| ------------ | ------------------------------------------------------------ | ------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 扱う単位     | 1 つのタスクの手順                                           | 1 つの長い作業の生きた計画書                | プロジェクトの記録全体（作業・判断・問い・リスク・観測・変更要求）                       |
| 置き場所     | `~/.claude/plans/`（利用者の全体共通の場所で、Git 管理の外） | リポジトリ内                                | リポジトリ内の Markdown が正本                                                           |
| 寿命         | セッションをまたいで残るが、タスクが終われば役目を終える     | 作業が終わるまで                            | 長期。判断の経緯まで残る                                                                 |
| 判断の記録   | 計画の中だけ                                                 | 計画の中の Decision Log                     | decision / question を独立した記録として持ち、決定ログ・課題ログ・リスク登録簿を生成する |
| 会話との関係 | 会話の中で作る                                               | 会話の中で作る                              | 会話の内容が個票になる。変更前に提示し、承認を得る規律がある                             |
| 導入         | 設定不要                                                     | ファイル 1 つの規約                         | Node と設定                                                                              |

**類似**: Codex の ExecPlan は、計画書をリポジトリに置き、Progress、Surprises & Discoveries、Decision Log、Outcomes & Retrospectives を作業の間ずっと更新する規約である。チャットの履歴ではなく計画書を正とする点、判断を書き残す点で、register の個票に最も近い。

**独自**: register は、作業以外の記録（判断・保留・リスク・観測・変更要求）を種別ごとの型で残し、決定ログなどの統制文書を生成する。ExecPlan の Decision Log は 1 つの計画書の中の節であり、プロジェクトをまたいで判断を並べ、検索する台帳ではない。Claude Code の plan は Git 管理の外にあり、チームで追えない。register は `exec run --register` で、agent の実行・検証・統合を個票の状態遷移とイベントとして記録し、`git log` だけで誰が何をいつしたかを再構成できる。

**位置づけ**: plan 機能は「このタスクをどう進めるか」を扱い、register は「プロジェクトで何をなぜ決めたか」を長く残す。競合ではなく補完の関係にある。exec の plan（`xep-*` テンプレートから生成する実行計画）は、タスクごとの計画として plan 機能と同じ役割を担う。

**劣位**: 導入は plan 機能のほうが圧倒的に軽い。2026-09-27〜29 の 3 日間だけで、再開・統合・並行実行まわりの実行結果を失いかねない不具合を 10 件以上直しており（PJR-R0XA、PJR-CTV4、PJR-FFPK、PJR-GRB5 など）、成熟度は plan 機能に及ばない。オーケストレーターの振る舞いは定義の質に依存し、定義の誤り 1 つ（`note` の終端、PJR-XW9M）で orchestrator が誤った推奨をした。

参照した公開情報:

- <https://thepromptshelf.dev/blog/claude-code-plan-mode-complete-guide-2026/>
- <https://continuumcode.ai/guides/claude-code-plan-mode/>
- <https://developers.openai.com/cookbook/articles/codex_exec_plans>
- <https://codex.danielvaughan.com/2026/04/19/the-execplan-pattern-structuring-long-codex-sessions-with-plans-md/>

### 3.9. チームでの利用

3.8. の検討で、orchestrator は当初「1 人か小さなチーム向け」と評価したが、利用者から「register は Git で登録簿を共有できるので、チームでも活用できるのではないか」という指摘があった。実装を確かめた結果、同じリポジトリで作業する開発チームであれば十分に使えると評価を改める。

チームで使える根拠は次のとおり。

| 仕組み                                 | チームで使うときの効果                                                                                |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 1 項目 1 ファイルの個票（正本）        | 別々の項目を同時に起票・更新しても、ファイルが分かれているため競合しない                              |
| 乱数で振る ID                          | 別々のブランチで起票しても ID がぶつかりにくく、ぶつかっても `register renumber` で直せる             |
| 追記型のイベント                       | 変更の履歴と実行者（`--by`）が残る。統合時にイベントが競合しても、両側の和集合で解決する（PJR-36CN）  |
| 一覧やビューは生成物（ignore 済み）    | 一覧のファイルで競合しない。各自が `register build` で作り直す（PJR-HG98）                            |
| ブランチと PR                          | 判断の記録（decision）もコードと同じ PR でレビューできる。重い決定は PR で承認する規則がある          |
| docs サイト                            | 登録簿の一覧・ビュー・個票を GitHub Pages で閲覧でき、開発者以外もブラウザで読める                    |
| 担当とロール（`owner`、PO / PM / DEV） | 人と agent の担当を同じ欄で扱える                                                                     |
| 記帳の `--commit`                      | `register lifecycle` の枠を取って commit するため、agent の実行と並行して安全に記帳できる（PJR-9XG4） |

PJR-HG98 の統合テストで、2 つの worktree で並行に起票・実行しても統合で競合しないことを確かめている。

チームで使うときに足りない点は次のとおり。

| 点                       | 内容                                                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------------------------------ |
| 同じ項目の同時編集       | 同じ個票を 2 人が別々のブランチで書き換えると、Markdown の競合になり、手で解決する必要がある                 |
| リアルタイム性           | 他の人の起票や close は、push と pull をするまで見えない。通知もない                                         |
| 権限                     | 誰でも close できる。`--by` は自己申告であり、「決定者は PO」といった権限を仕組みとしては強制していない      |
| 開発者以外の起票         | 閲覧は docs サイトでできるが、起票には Git と CLI（または orchestrator）が要る                               |
| オーケストレーターの運用 | 各メンバーが自分の agent で orchestrator を動かすため、承認の規律や使う agent をチーム内でそろえる運用が要る |

**判定**: 同じリポジトリで作業する開発チームにとって、課題と判断がコードと同じ commit に残り、agent がそのまま読めるという利点（3.6.2.1.）は、チームでも変わらない。開発者以外が主に起票するチームや、リアルタイムの通知を必要とする運用には向かず、GitHub Issues などとの併用になる。この連携は [[prj-0001:pjr-5w8c-register-github-integration]] で扱う候補である。

### 3.10. 価値の裏付けについて

3.8. と 3.9. の評価は、公開情報と、本リポジトリでの利用者 1 人と orchestrator の経験にもとづく。他の利用者が同じ使いやすさを感じるかは確認していない。次の方法で確かめる余地がある。

- 2〜3 週間かかる作業を題材に、Claude Code の plan や ExecPlan だけで進める場合と、register と orchestrator で進める場合を比べる。1 週間空けたあと再開するまでの時間、過去の判断を探して見つけられるか、誤った変更を途中で止められたかを測る。
- v0.3.0 の公開後に 3〜5 人に試用してもらい、最初の起票までの時間と、1 週間後も使い続けているかを聞く。

### 3.11. v0.3.0 の機能と SDD のツールの比較（2026-10-08）

v0.3.0（`package.json` は 0.3.0、npm の公開版は 0.2.1）で出す機能を、公開情報で競合と比べた。競合の内部実装は確認していない。

競合の現状は次のとおりである。Spec Kit は 2026-06 時点で 115k star、2026-08-21 に 1.0 を公開し、agent の統合 38、コミュニティの extension 157、preset 33 を持つ。OpenSpec は 2026-04 時点で 50k star で、2026-09-19 に GitHub Trending に載った。Kiro は IDE に加えて CLI とクラウドの sandbox で動く Web 版を持ち、外部サービスと連携する Powers を加えた。

| v0.3.0 の機能                                                                                                           | Spec Kit / OpenSpec / Kiro                     | beads・Gas City・plan 機能                                       | 判定                                                                                                                                                    |
| ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| register と orchestrator（Markdown が正本の 7 種別の登録簿、提案・承認・実行、`--commit` の記帳）                       | 該当なし（変更提案単位の状態遷移のみ）         | beads は DB が正本で依存グラフを持つ。plan 機能は 1 タスクの計画 | 独自                                                                                                                                                    |
| exec pipeline（executor と reporter の分離、worktree、親検証、再開、rate limit からの回復、N 個のプロダクトリポジトリ） | Kiro は並列実行と hooks、Spec Kit は workflows | Gas City がほぼ同じ問題をより大きな規模で解く                    | 劣位〜同等                                                                                                                                              |
| 保護機構（agent による定義・フック・CI の変更を止める、agent の定義の `.specdojo/` への分離）                           | 確認できず                                     | 確認できず                                                       | 独自                                                                                                                                                    |
| grade と review（28 観点の継続評価、review は最新の grade を入力にする）                                                | 確認できず                                     | gates や tests はあるが文書の品質評価ではない                    | 独自                                                                                                                                                    |
| kata（rulebook 106 種と recipe・sample・template）                                                                      | 機能単位の 3〜4 文書、Spec Kit は preset 33    | なし                                                             | 範囲は独自、維持負担は劣位                                                                                                                              |
| local LLM の段構成                                                                                                      | 確認できず                                     | Gas City は runtime の抽象のみ                                   | 弱まった。2026-10 の計測で、ローカルモデルは grade の判定に使える水準に届かなかった（[[prj-0001:pjr-vqb5-agent-grade-comparison]]）。要約と翻訳には有効 |
| 導入（`config init` / `scaffold`、`devcontainer scaffold`、docs-site、docs-lint）                                       | Spec Kit は 1 行の導入、OpenSpec は 5 コマンド | beads はバイナリ 1 つ、plan 機能は設定不要                       | 劣位                                                                                                                                                    |
| 日本語の kata・文書・対話                                                                                               | 英語中心                                       | 英語中心                                                         | 独自                                                                                                                                                    |

当初は SpecDojo を SDD のツールとして Spec Kit と同じ土俵に置いて比べたが、利用者の指摘で位置づけを改めた。Spec Kit などは 1 つの機能を実装するまで（仕様 → 計画 → タスク → コード）を扱い、仕様は実装が済めば役目をほぼ終える。SpecDojo の主な機能は、プロジェクトの仕様と設計を成果物の体系として作るまでであり、それを運用・保守へつなぐ。工程として SpecDojo は Spec Kit の上流に立ち、重なるのは「spec」という言葉と市場での分類くらいである。比較の相手は 3.12. の領域にある。

参照した公開情報:

- <https://github.github.com/spec-kit/>
- <https://github.github.com/spec-kit/history.html>
- <https://codemyspec.com/blog/github-spec-kit-guide>
- <https://ssojet.com/blog/best-spec-driven-development-tools>
- <https://realpython.com/ref/ai-coding-tools/kiro/>
- <https://www.gilricardo.com/blog/kiro-review-spec-driven-agentic-ide>
- <https://agentic-ai.readthedocs.io/en/latest/Standards/openspec/>
- <https://aitoolly.com/ai-news/article/2026-09-20-openspec-trends-on-github-advancing-specification-driven-development-for-ai-coding-assistants-by-fis>

### 3.12. 設計文書・判断の記録・文書の維持の領域の比較（2026-10-08）

3.11. の位置づけにもとづき、設計文書を作る、判断を残す、文書を保つ、の各領域の競合を公開情報で調べた。

| 領域                 | 見つかったもの                                                                                                                                                                      | SpecDojo との違い                                                                                                                                |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 設計書を作る         | arc42 Toolkit。AI agent（Claude Code・Copilot・Cursor など）の skill として arc42 の 12 章を対話で作る。深さの 3 段階（LEAN / ESSENTIAL / THOROUGH）、C4 の図、整合性の lint を持つ | 発想が最も近い（型に沿って AI が書く）。範囲はアーキテクチャ文書だけで、要件・データ・テスト・トレーサビリティ、品質の継続評価、判断の台帳はない |
| 設計書を作る（日本） | 生成 AI でソースコードから設計書を作る取り組みが主流                                                                                                                                | 方向が逆（コード → 文書）。SpecDojo は文書を先に作り正本とする                                                                                   |
| 判断を残す           | ADR の系統（adr-tools、adrpy-ai、Vercel の adr-skill、Claude Code のセッション中の判断を ADR として残す skill など）                                                                | 判断だけを扱い、agent の skill として汎用品になりつつある。register は論点・リスク・作業も扱い、設計書と実行につながる                           |
| 文書を保つ           | Swimm。コードと結びつけた文書のずれを CI で検知し更新案を出す（2,000 以上のチーム、商用）                                                                                           | 対象はコードに近い説明文書で、設計書の体系や型に照らした品質評価ではない                                                                         |
| トレーサビリティ     | RTMX。AI 向けの要件トレーサビリティ（CSV、依存グラフ、MCP サーバ）                                                                                                                  | 要件とテストの対応に特化し、設計書の本文は扱わない                                                                                               |
| 規制                 | EU AI Act の技術文書の要件（高リスクのシステムは 2026-08 から施行）                                                                                                                 | 保たれた設計文書と判断の監査証跡の需要が規制の側から生まれている                                                                                 |

**判定**: 仕様の判断 → 設計書の体系 → 品質の継続評価 → 運用・保守を 1 つにつないだものは見つからなかった。各部分には専門の道具がある（arc42 Toolkit、ADR の skill、Swimm、RTMX）。寄せ集めと見られないよう、1 本の流れとして見せる必要がある。arc42 Toolkit の深さの 3 段階は、`approach` や規模別の kata の組と同じ問題への答えであり参考になる。

**register を入口にする位置づけ**: 利用者の提案により、register を「仕様を決めるまで、そして仕様を保つための台帳」と位置づける。仕様を決めるまでは question・decision・todo・risk で論点と判断を残し、決まったら設計書（kata）へ反映し、運用・保守では change-request・issue と grade で設計書を保つ。kata を用意せずに始められ、使ううちに設計書の体系へ進める。一方、「登録簿」という言葉と種別の一覧だけでは「git に置く課題管理」と受け取られやすく、価値の核心である「判断が設計書につながること」が見えにくい。打ち出す言葉と、起票から設計書の更新・変更要求までを通すクイックスタートで補う必要がある。戦略は [[prj-0001:pjr-nyzr-adoption-strategy]] で決める。

参照した公開情報:

- <https://github.com/MSiccDev/arc42-toolkit>
- <https://heise.de/-11267038>
- <https://arxiv.org/html/2603.28735v1>
- <https://docs.swimm.io/ide-integrations/vs-code/ide-plugins-vscode-keep-docs-up-to-date>
- <https://falconer.com/guides/sync-documentation-code-changes/>
- <https://pypi.org/project/rtmx/>
- <https://weel.co.jp/media/design-document-creation/>
- <https://book.st-hakky.com/business/efficient-specification-document-creation-automation-and-flowcharts>
- <https://pypi.org/project/adrpy-ai/>
- <https://codex.danielvaughan.com/2026/04/28/codex-cli-architecture-decision-records-adr-automated-governance/>
- <https://agentskillsfinder.com/skills/adr-skill>

### 3.13. ソフトウェア以外の領域への適用（2026-10-08）

利用者から「仕様と設計を決める仕組みはソフトウェア開発に限らず使えるはずで、競合に対する優位性になるか」という問いがあり、公開情報と本リポジトリの kata の構成から評価した。

**構造上の特長**: 3.11. と 3.12. で比べた道具は、いずれもソフトウェア専用である。Spec Kit / Kiro / OpenSpec は最終成果物がコードで、arc42 Toolkit・ADR の skill・Swimm・RTMX も対象がソフトウェアの文書に限られる。SpecDojo の中核は領域に依存しない。

- register の種別（question・decision・risk・change-request など）は、論点と判断を残す一般的な型である。
- kata の 4 種別（何を書くか・どう作るか・どの形から始めるか・完成形）は、文書体系の種類を問わない構造である。
- `grade` による型に照らした品質評価と、提案・承認・実行の進め方も領域を問わない。

kata を差し替えれば別の領域の文書体系にも使える設計であり、SDD のツールは構造上これを持たない。

**優位として打ち出しにくい理由**:

1. 現在の rulebook 106 種はソフトウェア寄りである。そのまま使えるのは `pjr`・`prj-*`・`pm-*`・`br`・`bps`/`bes`・`bac`・`gl` などの一部で、大半（C4 系、`ifx-*`、`imp-*`、`utc`/`itc`/`stc`、`sysd` など）はソフトウェア専用である。他の領域への適用は、現時点では機能ではなく可能性にとどまる。
2. 利用者の前提が開発者である。git・worktree・npm・CLI・テストによる検証を前提とし、法務・研究・製造などの利用者には 3.7. で劣位とした開始の導線の弱さがさらに大きく効く。
3. 領域が変わると競合も変わる。ソフトウェア以外では、Confluence や Notion の AI 機能、ISO 9001 などの文書管理、製造業の PLM、規制対応の文書管理が既にあり、git と Markdown を正本とすることはむしろ不利に働く。git 上で判断と規約の文書を管理する汎用の試み（Data-Olympus など）も現れている。
4. 位置づけが薄まる。3.11. と 3.12. で「SDD の上流で仕様と設計の体系を担う」と絞り込み、寄せ集めと見られないよう 1 本の流れとして見せることを課題とした。「何にでも使える」を加えると、この絞り込みと逆に働く。3.10. のとおり、ソフトウェアでの価値も利用者 1 人の経験でしか確かめていない。

**判定**: 見出しの差別化の軸にはせず、設計上の拡張性として扱う。README では、成果物の型へ広げる節で「kata を差し替えれば別の領域の文書体系にも使える」と添える程度にとどめるのが妥当と考える。

**確かめる順序**: 適用を試すなら、一般の業界ではなく、git・Markdown・レビューの文化を共有する隣接領域から始める。候補はインフラ・運用の設計、データ分析・ML、研究開発の文書、規制対応の技術文書（3.12. の EU AI Act の線上）である。1 つの領域で手応えを得てから、優位として打ち出すかを [[prj-0001:pjr-nyzr-adoption-strategy]] で判断する。

参照した公開情報:

- <https://github.com/topics/decision-log>
- <https://mcpmarket.com/zh/server/data-olympus>
- <https://hackmd.io/blog/2026/04/22/AI-writes-your-docs-hackmd>

### 3.14. BMAD・AI-DLC との直接競合の比較（2026-10-24）

利用者から「直接の競合は BMAD・AI-DLC ではないか」という指摘を受け、公式文書を確認した。
本節は公開情報からの観測と評価であり、両者を導入して比較実行した結果ではない。
確認時の BMAD 公式サイトの表示版は v6.12.0、AI-DLC Workflows の README の表示版は 2.11.1 である。
参照先は更新されるため、以下を将来の版にも適用できる固定的な評価とはしない。

#### 3.14.1. 競合の捉え直し

比較の起点を「同じ機能を持つか」だけでなく「同じ目的のために利用者がどちらを採用するか」に置く。

| 対象                       | 主に重なる領域                                   | 比較上の位置づけ                                  |
| -------------------------- | ------------------------------------------------ | ------------------------------------------------- |
| BMAD Method                | 要件・設計・成果物・専門 agent・承認・実装・検証 | 開発方式全体の直接競合                            |
| AI-DLC                     | AI と人の役割分担、工程、判断と実行の管理        | 方法論と、その実装である Workflows を含む直接競合 |
| Gas Town / Gas City        | agent の実行・並列化・作業管理・統合             | 主に exec 層の競合                                |
| Spec Kit / OpenSpec / Kiro | 仕様から計画・実装へつなぐ流れ                   | 仕様駆動の領域での競合                            |

Gas Town との思想の対比は [[prj-0001:pjr-q3w9-gastown-design-philosophy]] に残す。
それだけから SpecDojo 全体の差別化を導かず、BMAD・AI-DLC を比較の中心に加える。

#### 3.14.2. BMAD Method

BMAD は、専門 agent と workflow を既存の AI coding tool に組み込み、企画・要件・設計から実装・検証までを扱う。
公式の説明は、人が専門的判断を担い、AI が進行を支援することを重視する。
計画と判断をファイルに残すため、「文書を介して人と agent が仕事を引き継ぐ」という点で SpecDojo と重なる。

**直接競合となる理由**: 利用者が要件と設計を明示し、専門的な役割を使い分けて開発を進めたいとき、両者は代替候補になる。
「SpecDojo は上流、競合は実装」という対比だけでは BMAD との差を説明できない。
また BMAD の公式ドキュメントは、計画支援だけの利用や小さな変更からの開始も案内している。
段階的に導入できることも SpecDojo だけの利点には数えない。

#### 3.14.3. AI-DLC と AI-DLC Workflows

AWS の AI-DLC は、Inception・Construction・Operations を通じた人と AI の協働を示す方法論である。
方法論の解説と、実行可能な実装である `awslabs/aidlc-workflows` は区別して比較する。
従来の 3 フェーズの説明だけで、現在の Workflows の構成を言い尽くしたものとはしない。

確認した Workflows の README は、複数の coding tool 上で共通の engine を動かし、依頼に応じて workflow を選び、
不足する判断を人に尋ね、承認ゲートで停止する構成を示している。永続的な状態と監査履歴も掲げる。
したがって、AI-DLC を「考え方だけ」、SpecDojo を「実行できる仕組み」として分けるのは不適切である。
また AWS が提供するという理由だけで、方法論全体を AWS 専用・特定 IDE 専用とは扱わない。

**直接競合となる理由**: AI 開発の工程、判断、成果物、実行と検証を接続する目的が重なる。
SpecDojo の対話型オーケストレーターと exec・記帳の領域も比較が必要である。

#### 3.14.4. 共通点と差別化の候補

| 比較軸                 | BMAD・AI-DLC との比較からの評価                       | SpecDojo で追加検証する点                        |
| ---------------------- | ----------------------------------------------------- | ------------------------------------------------ |
| 人の判断と承認         | 両者も重視しており、承認を挟むだけでは差別化しない    | 判断主体と根拠を後から追えるか                   |
| 文書と成果物           | 両者も開発の文脈を成果物として残す                    | 成果物同士の関係と変更影響をどこまで扱えるか     |
| 専門 agent と workflow | 役割分担と工程の構造化は共通する                      | 引き継ぎの欠落や再開時の手戻りを減らせるか       |
| 実行・検証・履歴       | 両者を実装・レビューまで含めて比較する必要がある      | register と exec の接続、再開・統合の実用上の差  |
| 型と品質の維持         | kata の種別分離と grade は比較すべき構造上の特徴      | 両者の拡張・品質評価と同一条件で比べたときの効果 |
| 計画の導出             | catalog・timeline・CPM による schedule は差の候補     | 両者の計画・追跡方式に対し、維持負担に見合うか   |
| 導入負担               | BMAD にも小さく開始する導線があり、軽さを独占できない | 最初の成果までの時間、設定量、継続利用の負担     |

「両者にない」と断定できる機能差は、今回の公開文書の確認だけでは確定しない。
kata・登録簿・catalog／schedule・grade の接続は SpecDojo の特徴として説明できるが、
競合より高い品質や低いコストを実現するという優位性は未検証である。

#### 3.14.5. 既存の評価への影響と確かめ方

`3.11.` と `3.12.` の「上流」「一つにつないだものは見つからなかった」という評価は、BMAD・AI-DLC を含む結論へ一般化しない。
同様に、Git 管理の文書、人による承認、専門 agent、判断の記録、段階的導入をそれぞれ単独の独自性とはしない。
[[prj-0001:prj-comparison-of-alternatives]] にある BMAD の責務重複による非採択は併用の判断であり、
利用者にとって代替候補となるかという競合の判断とは別である。

次に比較実行するなら、同じ小規模の変更と既存プロジェクトへの変更を題材にし、
入力・完了条件・利用モデル・検証条件をそろえる。導入から最初の成果までの時間、
人が補った判断、要件から検証までの追跡可能性、変更後の文書の整合性、再開の容易さ、維持工数を測る。
本 note の追記によって採用方式や位置づけを正式に変更したものとはせず、結果を位置づけと導入戦略の判断材料にする。

参照した一次情報（2026-10-24 確認）:

- BMAD Method 公式の方式説明: <https://www.bmadcode.com/method>
- BMAD Method 公式ドキュメント: <https://docs.bmad-method.org/>
- AWS の AI-DLC 方法論の解説: <https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/>
- AI-DLC Workflows 公式リポジトリ: <https://github.com/awslabs/aidlc-workflows>

### 3.15. 長期タスクの実行力の比較（2026-11-18）

利用者から「SpecDojo は最近かなりの精度で長期タスクを実行できるようになった。今の実力を競合と比べたい」という依頼を受けて追加した。
SpecDojo の値は prj-0001 の登録簿と実行の記録から数えた実測である。競合の値は公開情報からの観測で、同じ条件で比較実行した結果ではない。

#### 3.15.1. SpecDojo の実績（prj-0001、2026-11）

| 観点               | 実測                                                                                                                                                                                                                    |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 処理量             | 2026-11-01〜11-18 に登録簿の項目 265 件が done / decided になった。11-11〜11-18 では 110 件。schedule の task の完了は 11 月に 339 件                                                                                   |
| 無人の連続実行     | track kata-slim（rulebook と sample の 36 task）を 2026-11-17 23:39〜11-18 06:05 の約 6.5 時間、3 並行で人の介入なしに完了した。続く kata-slim-2 は 109 task で実行中                                                   |
| 止まったときの扱い | 上限（quota）は block に `resume_at` を記録し、`exec resume --due` で再開する。代わりの agent（`--fallback-executor-by`）を指定すれば切り替える。親の検証の失敗は `--resume-from executor` で失敗の結果を渡してやり直す |
| 統合と並行         | task ごとの worktree、変更範囲の予約、commit の許可リスト、統合の後の dist の作り直し（PJR-8KXJ）で、並行の task が互いの成果を壊さずに develop へ入る                                                                  |
| 品質の確かめ       | 親プロセスが固定の検査（lint・型・単体・統合）を流し、kata は grade で別の agent が採点する。kata-slim の 40 件は pass 35・needs-work 5                                                                                 |
| 記録               | 実行ごとに plan・result・evidence・親の検証の記録が残り、登録簿のイベントに判断の主体と理由が残る                                                                                                                       |

#### 3.15.2. 競合の長期実行の機能

| 対象                        | 長期実行の機能（確認日 2026-11-18）                                                                                                                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Kiro（AWS）                 | cloud session で agent を数時間〜夜通し動かす。Kiro Crew で多数の agent を並行に動かし、2026-11-05 に Kiro bots（名前と記憶を持つ長命の agent、worker の監視、スケジュール実行、道具の権限の範囲、人の承認）を GA とした |
| AI-DLC Workflows（awslabs） | 2.11.4（2026-11-13）が最新。Unit を worktree や別 clone で並行に構築し、会話をまたいで承認待ちを引き継ぎ、状態から進み具合を答える。preview は夜間の全体テストの失敗を待たずに出る                                       |
| BMAD Method                 | 最新は v6.12.4（2026-10-14）。`bmad-dev-auto`（v6.10.0）は spec の frontmatter の状態で動く無人の 1 回分の worker で、外の orchestrator が polling する。長期の連続実行は利用者の側の仕組みに委ねる                      |
| Codex CLI の `/goal`        | v0.133.0（2026-05-21）で GA。1 つの目標を数時間〜数日続け、再起動をまたいで保たれ、pause・resume・token の予算を持つ。長い目標が要約の後に継続の指示を失う報告がある                                                     |
| Claude Code                 | background agent、agent teams、`/goal`、Agent View（2026-05）。1 つの session の中で長く動かす方向                                                                                                                       |
| Gas Town / Gas City         | 10 以上の agent を並行に動かす orchestrator。2026 年に hosted 版と SDK（Gas City）へ広がった。作者自身が本格的な利用を戒めている                                                                                         |

研究の指標では、2〜10 時間の task を集めた SWE-Marathon（2026-06）の完了率が 30% 未満と報告されている。1 つの agent に長い目標を任せる方式の成功率は、まだ高くない。

#### 3.15.3. 比較と評価

| 比較軸             | SpecDojo                                                                                         | 競合の傾向                                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| 長期の単位         | 長い仕事を、完了条件を持つ小さな task（約 10〜30 分）の連なりに分け、task ごとに検証して統合する | Codex・Claude Code の `/goal` は 1 つの目標を 1 つの session で長く続ける。Kiro bots は長命の agent が worker を束ねる |
| 検証の主体         | agent の報告を信じず、親プロセスの固定の検査と、別の agent による grade で確かめる               | `/goal` は完了条件の書き方を利用者に委ねる。AI-DLC は承認ゲート、Kiro は人の sign-off                                  |
| 止まったときの再開 | 上限・検証の失敗・統合の衝突を種類ごとに記録し、その段から再開する                               | Codex は目標の pause・resume、AI-DLC は会話をまたぐ承認の引き継ぎ                                                      |
| agent の混在       | codex・claude・local LLM を task ごとに選び、上限で切り替える                                    | Kiro は bot と worker でモデルを分ける。AI-DLC・BMAD は複数の coding tool に対応                                       |
| 成果の置き場       | すべて git の中（登録簿・plan・result・evidence）。cloud を前提にしない                          | Kiro は cloud session と EC2。Codex・Claude Code は session の状態を手元に持つ                                         |
| 並行の統合         | worktree・変更範囲の予約・commit の許可リストで、同じリポジトリへ並行の成果を入れる              | AI-DLC も worktree で Unit を並行に入れる。Gas Town は多数の agent の統合を独自の仕組みで扱う                          |

差別化の候補として説明できるのは次の 3 点である。

- 長い仕事を「検証できる完了条件を持つ task の連なり」として計画（catalog・schedule・登録簿）から導き、task ごとに独立に検証して統合すること。1 つの session で長く動かす方式が要約で指示を失う問題を、構造で避けている。
- 検証を agent の自己申告から切り離していること（親プロセスの検査、別の agent の grade、orchestrator の実物の確認）。
- 実行の記録と判断の主体がすべて git に残り、後から追えること。

一方で、次の弱点が今回の実行でも観測された。

- 運用の継ぎ目に人や orchestrator の手作業が残る。順番の予約は orchestrator のスクリプトで行っており（PJR-1565 で機能にする）、保護された設定の反映は利用者の承認を待つ。
- 段の指示の書き方の誤り（glob を強調と読む）で task が準備の段で止まった。変更範囲の誤った重なり（PJR-9JN6）で並行が 1 本に落ちたこともある。
- 使用量の上限に大きく左右される。代わりの agent を指定しない実行では、10 task が上限の解除まで待った。
- grade の major は人の判断に回しており、品質の最終判断は自動化していない。

#### 3.15.4. 既存の評価への影響と確かめ方

`3.14.4.` の「実行・検証・履歴」の軸は、SpecDojo の実測で「数百 task を無人で流し、検証と記録を残せる」ところまで裏付けが進んだ。競合より高い品質や低いコストを実現するという優位性は、引き続き未検証とする。

次に比較実行するなら、同じ長期の題材（例: 20〜40 の文書の改訂、または既存コードの段階的な変更）を、SpecDojo の schedule、Codex の `/goal`、AI-DLC Workflows で流し、完了率、人が補った判断の回数、検証で見つかった誤り、止まった回数と再開に要した手間、使用量を測る。

参照した情報（2026-11-18 確認。二次情報を含む）:

- Kiro の長期実行の考え方: <https://kiro.dev/topics/frontier-engineering/maximize-agent-time/>
- Kiro bots の GA（SD Times、2026-11-05）: <https://sdtimes.com/agentic-ai/kiro-introduces-kiro-bots-goal-oriented-agents/>
- AI-DLC Workflows のリリース: <https://github.com/awslabs/aidlc-workflows/releases>
- BMAD Method のリリース: <https://github.com/bmad-code-org/BMAD-METHOD/releases>
- Codex CLI の `/goal`（二次情報）: <https://codex.danielvaughan.com/2026/05/22/codex-v133-goal-mode-ga/>
- Claude Code の長期実行の機能（二次情報）: <https://pinggy.io/blog/claude_code_loop_codex_goal_long_horizon_tasks/>
- Gas Town の hosted 版と Gas City: <https://thenewstack.io/steve-yegges-ai-agent-orchestration-project-gas-town-comes-to-the-cloud-and-brings-the-wasteland-with-it/>
- SWE-Marathon: <https://neurips.cc/virtual/2026/poster/139342>

### 3.16. 外部の分析（2026-11-23）との突き合わせ

利用者が ChatGPT にまとめさせた分析（`tmp/specdojo-analysis-2026-11-23.md`、v0.9.2 と開発ブランチが対象）を、本 note の既存の評価と、2026-11-23 の prj-0001 の実測に照らして突き合わせた。外部の分析は公開リポジトリと実践事例（OpenFisca-Japan・Scratch 教材）の観測で、SpecDojo を動かした結果ではない。本節の SpecDojo の値は prj-0001 の登録簿と実行の記録から数えた。

#### 3.16.1. 外部の分析の要旨

- 本質的な価値を 2 つに絞る。(1) プロジェクトとプロダクトを分け、作業・判断・課題を自由に記録・管理できること。(2) 登録簿を含む成果物を kata で標準化し、人と AI が同じ型で作れること。exec・schedule・grade・オーケストレーターは、その手段と位置づける。
- 登録簿を kata と並ぶ別の概念とせず、kata で標準化された成果物の一種で、同時に exec と schedule の実行の対象とみる。
- 公平な比較の相手を「Claude Code 単体」ではなく「Claude Code + GitHub Issues + Markdown + Skills + worktree + CI」とする。SpecDojo にしかできない作業は多くなく、価値は長期の継続的な管理の負担を減らせるかにある。
- マルチエージェント、AI のコード生成、worktree、Todo の依存管理、テストを先に整える方針などは、独自の優位として前面に出すべきでないとする。
- 改善の課題として、気軽な起票、kata の標準化と柔軟さの両立、外部 PR との連携（PR と項目の関連、レビュー指摘からの起票、マージ待ちの扱い）、実行の正しさの検証、定量的な比較を挙げる。

#### 3.16.2. 本 note の既存の評価との一致と相違

| 観点             | 本 note の既存の評価                                                                                    | 外部の分析                                                                        | 突き合わせの結論                                                                                                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 価値の中心       | `3.7.` は kata の網羅範囲・実行の記帳・品質の継続評価の 3 つを差別化の軸とした                          | 自由な記録（登録簿）と kata による標準化の 2 つを本質とし、実行と評価は手段とする | 方向は一致する。外部の分析は「実行の記帳」と「品質の継続評価」を手段に下げ、「プロジェクトとプロダクトの分離」を上げている。分離は `3.` の比較でほとんど扱っておらず、本 note の欠けていた観点である             |
| 登録簿の位置づけ | 登録簿は backlog・状態遷移の追跡として、kata とは別に比べてきた（`3.6.2.`）                             | 登録簿も kata で標準化された成果物の一種とみる                                    | 実装と合う（登録簿の個票は `pjr-rulebook` に従う型である）。説明の順を「kata が成果物を型にし、登録簿もその一つ」とすると体系が単純に伝わる                                                                      |
| 比較の相手       | `3.8.` で Claude Code・Codex の plan 機能と比べた                                                       | Claude Code に Issues・Markdown・Skills・worktree・CI を足した構成と比べる        | 外部の分析の比較の相手のほうが公平である。次の比較実行の基準線に採る                                                                                                                                             |
| 長期の実行       | `3.15.` で「検証できる task の連なり」と「検証を agent の自己申告から切り離すこと」を差別化の候補とした | マルチエージェントや依存管理は独自とせず、実行の正しさの検証を課題に挙げる        | 両方とも成り立つ。下の `3.16.3.` のとおり、検証の切り離しは実際に誤りを捕まえている一方、それを支えているのはまだ自動の仕組みではなくオーケストレーターの判断で、無人の長期実行の信頼性は `3.15.` の評価より低い |
| 外部 PR との連携 | 扱っていない                                                                                            | PR・レビュー・マージ待ちを、実装の完了と分けて扱う必要を挙げる                    | 妥当である。今の `depends_on` は登録簿の中の先行関係だけで、上流の PR の承認やマージの状態を持たない。OpenFisca-Japan の運用（実装の依存と承認の依存の区別）は、登録簿の機能の候補になる                         |
| 起票の手軽さ     | `3.6.` で開始の導線の弱さを劣位とした                                                                   | Todo 1 件の起票に多くの入力が要るなら登録簿の価値が下がると指摘する               | 一致する。2026-11-23 の運用では、オーケストレーターが完了条件まで書くため起票の質は高いが、人だけで起票する導線は軽くない                                                                                        |

#### 3.16.3. 2026-11-23 の実測から加える評価

外部の分析の「実行の正しさの検証」と「定量的な比較」の論点について、2026-11-23 の prj-0001 の運用で次を観測した。

| 観点                         | 観測                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 処理量                       | 2026-11-23（JST）の登録簿の記帳は、起票 45 件・close 33 件だった。v0.10.0 に入れる項目（運用メモの型・handoff・依存の脆弱性・利用側の issue など）を 1 日でそろえた                                                                                                                                                                                                                                                                                                  |
| 検証の切り離しが捕まえた誤り | executor が完了と報告した項目のうち、オーケストレーターの実物の確認で直す点が見つかったものがあった。人のタスクだけが残ると終了コード 1 のままだった（PJR-0JVB）、作成時刻に頼る時々落ちるテスト（PJR-BEQ8）、dry-run の行の直し漏れ（PJR-TJZM）、決めた範囲を超えた過去の run の生の記録の書き換え（PJR-E4MW）、古い列の並び（PJR-5N1Q）。どれも完了条件に次の回を足して直した                                                                                      |
| 無人の長期実行の信頼性       | 第 4〜6 波の sample を作る列（269 task、5 並行）は、約 7 時間で 82 task が済み、13 task が止まった（約 14%）。止まった理由は、検査のプロセスが終わらない時間切れ、ローカルの reporter の出力の形、API の混雑、型の sample の変更による fixture の古さ、変更範囲の取り違え、template が生成するビューの外枠も兼ねる設計の問題だった。ほかに、一度候補から外した task を外したままにする不具合で、2 つの波が数時間拾われず、オーケストレーターが列を区切って流し直した |
| 外部の利用からの改善         | 利用側（OpenFisca-Japan）から 4 件の issue が起票され（`external_projects` が worktree で止まる、Claude の executor の設定、流し直したときの commit の 1 行目、ログのタイトル）、同じ日のうちに直して close した。第三者の独立した検証ではないが、別のプロジェクトでの利用が具体的な改善につながっている                                                                                                                                                             |

これを踏まえた評価は次のとおりである。

- **検証の切り離しは差別化の候補として残るが、まだ人寄りである。** 誤りを捕まえたのは、親プロセスの検査よりも、オーケストレーターが差分・対応結果・result と完了条件を照らす確認だった。外部の分析の「実行の正しさの検証」を課題とする見方は妥当で、確認の一部を runner の固定の検査に移す（完了条件の自動の照合、生の記録の書き換えの検出など）ことが次の課題になる。
- **無人の長期実行は、`3.15.` の評価より慎重に扱う。** 2026-11-17〜18 の kata-slim（36 task）は止まらずに流れたが、規模と並行を上げると、検査・外部 API・ローカル LLM・テストの fixture といった周辺の脆さが表に出る。止まりの多くは種類が決まっており、PJR-52EE の見張り（分類・決まった手当て・診断）で減らせる見込みがある。
- **セッションをまたぐ継続は、v0.10.0 で仕組みにした。** 外部の分析が比較の軸に挙げる「セッション間の継続」について、2026-11-23 に運用メモ（`where playbook`）・引き継ぎ（`handoff`）・判断待ち（`question`）を正式な機能にした（PJR-2P7C・PJR-5RY7）。これが手作業の引き継ぎよりも再開の成功率を上げるかは、次の比較の指標に入れる。
- **プロジェクトとプロダクトの分離は、説明の軸に加える。** `repos`・`external_projects` に加えて、読むだけの参照のディレクトリ（PJR-77FH）を足すことで、分離した構成を宣言だけで組めるようになる。ただし外部の分析のとおり、分離そのものは独自の技術ではなく、差別化は構築と運用の手軽さにある。

#### 3.16.4. 位置づけの更新と次の確かめ方

`3.7.` の差別化の軸を、次の順に読み替える。正式な位置づけの変更ではなく、説明と次の比較の判断材料とする。

1. 登録簿を含む成果物を kata で標準化し、人と AI が同じ型で作り、grade で継続的に確かめること（`3.7.` の軸 1 と 3 をまとめる）。
2. プロダクトから分けたプロジェクトの環境で、課題・判断・実行の記録を残し、セッションと agent をまたいで続けられること（`3.7.` の軸 2 を、記帳だけでなく継続の仕組みとして捉え直す）。
3. 長い仕事を、検証できる完了条件を持つ task の連なりとして流すこと。ただし信頼性はまだオーケストレーターの確認に支えられている。

次に比較実行するなら、外部の分析の構成 A（Claude Code + GitHub Issues + Markdown + Git）・B（Claude Code + SpecDojo）・C（競合の方式 + 同じモデル）で、複数の PR と外部のレビューを伴う題材を流し、人の介入時間、セッションを変えた後の再開の成功率、未対応の課題の取りこぼし、成果物の一貫性を測る。`3.14.5.` と `3.15.4.` の比較の案と合わせ、題材をそろえて 1 回にまとめる。

### 3.17. 理解の負債という課題の一般性（2026-11-23）

利用者から「理解の負債をなくすことは、シビックテックの文脈を除けば一般的な課題ではないか。競合は取り組んでいないか」という問いを受け、公開情報を確かめた。位置づけの決定は [[prj-0001:pjr-y5rd-civic-tech-comprehension-debt|PJR-Y5RD]] にある。

#### 3.17.1. 課題の一般性

理解の負債（comprehension debt）は、2026 年に AI が書くコードの文脈で広く論じられている一般的な課題である。言葉は 2025 年に Jason Gorman が使い始め、2026 年に Addy Osmani や O'Reilly が「システムが持つコードの量と、誰かが理解している量の差」として広めた。2026 年 4 月の論文は、学生のプロジェクトでのたまり方の型を調べ、AI を使った群は作業時間が変わらないのに理解度のテストの点が低かったという試験を引用している。

#### 3.17.2. 既存の取り組みとの比較

| 取り組み                   | 例                                     | 解いている範囲                         | 足りない点                                                                                                                   |
| -------------------------- | -------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| コードから文書を自動で作る | Google Code Wiki、DeepWiki など        | 既存のコードの「何をしているか」の説明 | AI が書いた文書はもっともらしいが実際の設計とずれうると指摘されている。「なぜ」は戻らない                                    |
| 仕様駆動開発で予防する     | Spec Kit、Kiro、Augment Code など      | これから作るものの仕様を正本として残す | 予防が中心で、たまった負債からの復元は主な対象でない。十分に細かい仕様はプログラムそのものになる、という限界も指摘されている |
| 文書を整える               | OSS の維持者や Linux Foundation の提言 | 人と AI の両方が読める文書             | 方法論が中心で、決まった型や確認の仕組みは持たない                                                                           |

#### 3.17.3. 評価

- 課題そのものを SpecDojo の独自性として主張しない。課題が一般的であることは、むしろ市場が大きいことを示す。
- 独自性の候補は、(1) kata による復元と確認状態・人の確定・記録を組にすること（自動で文書を作る道具の「もっともらしいが確かめていない説明」と対になる）、(2) 予防（新しく作る）と復元（既存から起こす）を同じ型で扱うこと、(3) 最初の相手をシビックテックにすること、の組み合わせである。
- シビックテックは、資金と人が少なく、当事者が非エンジニアで、入れ替わりが多いため、この課題がとくに深刻である。成功した後に止まるシビックテックのプロジェクトや、ボランティア頼みで人が減る状況が報告されている。一般の開発組織向けの道具は、ここを狙っていない。
- 説明は「理解の負債は AI 時代の一般的な課題である。SpecDojo は kata による復元と確認状態・人の確定・記録の流れでそれを解き、もっとも深刻なシビックテックから始める」とする。シビックテックを最初の市場（足場）とし、既存のシステムの改修、OSS の引き継ぎ、受託開発の引き渡しなど、同じ課題を持つ一般の開発へ広げる。
- 本節は公開情報からの観測で、競合の道具を導入して比べた結果ではない。

参照した情報（2026-11-23 確認。実践者のブログや事業者の記事を含み、数値は元の研究で確かめていない）:

- Comprehension debt（Addy Osmani）: <https://addyosmani.com/blog/comprehension-debt/>
- Comprehension debt: the hidden cost of AI generated code（O'Reilly）: <https://www.oreilly.com/radar/comprehension-debt-the-hidden-cost-of-ai-generated-code/>
- GenAI を使った学生のプロジェクトの理解の負債（arXiv 2604.13277）: <https://arxiv.org/html/2604.13277>
- Comprehension debt: the silent risk of AI-accelerated delivery（Versent）: <https://versent.com.au/blog/comprehension-debt-the-silent-risk-of-ai-accelerated-delivery/>
- AI technical debt compounds（Augment Code）: <https://www.augmentcode.com/guides/ai-technical-debt-compounds-spec-driven-development>
- Comprehension debt（DEV Community）: <https://dev.to/vibecodiq/comprehension-debt-when-your-ai-generated-codebase-outgrows-your-understanding-2fcl>
- Rewiring Democracy: AI & the Struggle for Open Knowledge in Brazil（Schneier）: <https://www.schneier.com/essays/archives/2026/05/rewiring-democracy-ai-the-struggle-for-open-knowledge-in-brazil.html>
- AI-generated abandonware is hollowing out open source（LeadDev）: <https://leaddev.com/software-quality/ai-generated-abandonware-is-hollowing-out-open-source>

## 4. 関連ドキュメント

- [[prj-0001:pjr-0143-vs-code-marketplace]]: Marketplace 公開の手順と発行者 ID の決定。
- [[prj-0001:pjr-gx9d-vscode-extension-consolidation]]: VS Code 拡張の集約方針。
- [[prj-0001:pjr-2w38-sample-quality-observation]]: kata の品質観測。
