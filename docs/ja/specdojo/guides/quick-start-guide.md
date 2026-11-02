---
specdojo:
  id: specdojo:quick-start-guide
  type: guide
  status: ready
---

# Quick Start ガイド

Quick Start Guide

SpecDojo の導入から始め、オーケストレーターとの対話を通して、管理対象リポジトリと Git flow の初期設定、register での起票・AI 実行、成果物カタログから schedule による成果物作成、routine の登録までを一貫したストーリーで体験します。

本書では、共通の題材として Web サイトのプロダクトリポジトリ `../landing-page` を用います（※掲載している todo・issue・decision はガイド用の例であり、実プロジェクトの事実ではありません）。

各ステップは次の順序で構成されています:

1. **前提**: その操作に必要な準備や前提条件
2. **具体的対話**: 利用者とオーケストレーターの対話（不足事項の確認、提案、承認、実行の流れ）
3. **得られる結果と確認先**: 操作によって生成・更新されるファイルや確認手順
4. **折りたたんだコマンドと設定差分**: `<details>` で折りたたんだ CLI コマンドや設定ファイルの差分

> [!NOTE]
> オーケストレーターは担当者、期限、採択判断などのプロジェクト事実を勝手に確定しません。必ず利用者に確認・提案し、明示的な承認を得てから実行します。

**対象読者**

- SpecDojo を初めて使い、プロジェクトの作業登録から AI 実行、スケジュール、ルーチン運用までを一通り体験したい開発者・運用者

**この文書で分かること**

- プロジェクトリポジトリの導入と、管理対象リポジトリ（`../landing-page`）および Git flow ブランチルールの初期設定
- register を使った機能追加（todo）、不具合調査（issue）、方針比較（decision）の起票と AI による隔離実行
- 成果物カタログ（`dct-*.yaml`）の準備と、schedule による成果物の体系的作成
- routine による定期実行の登録と cron / CI への組み込み

**次に読む文書**

- 登録簿の種別と状態遷移は [[specdojo:register-operation-guide|登録簿運用ガイド]] を参照してください。
- オーケストレーターの起動や安全設計は [[specdojo:orchestrator-operation-guide|オーケストレーター運用ガイド]] を参照してください。
- 隔離実行の詳細は [[specdojo:exec-worktree-guide|exec worktree運用ガイド]]、ブランチ運用規則は [[specdojo:branch-workflow-guide|ブランチワークフローガイド]] を参照してください。

## 1. 導入とオーケストレーターの起動

Node.js 22.13 以上と Git を用意します。SpecDojo は、成果物の更新、登録簿の状態遷移、実行記録をプロダクトの Git 履歴に混ぜないため、**別リポジトリ構成（Detached Unit）** を基本とします。

```text
landing-page-workspace/
├── landing-page/                    # 既存のプロダクトリポジトリ（Web サイト本体）
├── landing-page-specdojo/           # SpecDojo プロジェクトリポジトリ
└── landing-page-specdojo-worktrees/ # タスクごとの作業ツリー置き場
```

### 1.1. ワークスペースの準備と導入

#### 前提

- ワークスペースディレクトリに既存のプロダクトリポジトリ `landing-page/` があること。
- Node.js 22.13 以上、npm、Git が利用可能であること。
- オーケストレーターに使う AI provider（Claude Code、Codex、Antigravity、OpenCode など）の CLI が導入・ログイン済みであること。

#### 導入と起動コマンド（本文）

プロダクトリポジトリと並べてプロジェクトリポジトリを作成し、SpecDojo を導入して `init` の質問に答えます。

```bash
mkdir -p landing-page-workspace
cd landing-page-workspace
# 既存プロダクト landing-page と並べてプロジェクトリポジトリを作成
mkdir landing-page-specdojo
git -C landing-page-specdojo init
cd landing-page-specdojo
npm init -y
npm install --save-dev specdojo
npx specdojo init
```

対話式 `init` では、最小構成で以下のように答えます（`[]` 内は既定値で、Enter で採用されます）。

```text
Project ID [prj-0001]:                              <- Enter（prj-0001）
Project name [My Project]: LP サイト改善プロジェクト <- プロジェクト名を入力
Create a project register? [Y/n]:                   <- Enter（登録簿を作る）
Your nickname [owner]: owner                        <- あなたのニックネーム
Your display name [Project Owner]: サイト責任者      <- 表示名
Orchestrator providers (...) [codex]: claude        <- 利用する AI ツールを選ぶ
Delegate work to agents (exec)? [y/N]: y            <- y（AI への作業委譲を有効化）
Create a Dev Container? [y/N]: n                    <- Enter（手元環境で進める）
Create Git hooks with lefthook? [y/N]: n            <- Enter（初期設定では作らない）
```

初期化が完了すると、選んだ provider のオーケストレーター起動スクリプトが案内されます。次のコマンドでオーケストレーターを起動します。

```bash
npm run orch:opus
```

provider に応じて `npm run orch:sonnet`、`npm run orch:sol`、`npm run orch:flash`、`npm run orch:opencode` などが利用できます。詳細は [[specdojo:orchestrator-operation-guide|オーケストレーター運用ガイド]] を参照してください。

#### 具体的対話

起動後、ターミナルでオーケストレーターとのセッションが始まります。

```text
あなた: SpecDojo の導入ができました。このプロジェクトを進めたいです。
オーケストレーター: SpecDojo の初期化を確認しました。登録簿（controls/project-register/）と名簿設定（.specdojo/pm-members.yaml）が準備されています。
  まずは隣にあるプロダクトリポジトリ（../landing-page）を管理対象リポジトリとして接続し、安全に開発を進めるための Git flow ブランチ運用ルールを設定することをお勧めします。
  進めてよろしいですか？
あなた: はい、進めてください。
```

#### 得られる結果と確認先

- `docs/ja/projects/prj-0001/controls/project-register/` に登録簿の基本構造が作成されます。
- `package.json` に `orch:<provider>` スクリプトが追加されます。
- オーケストレーターが対話可能になります。

#### 折りたたんだコマンドと設定差分

<details>
<summary>初期設定の確認コマンドとディレクトリ構造（クリックで展開）</summary>

```bash
# プロジェクト一覧の確認
npx specdojo project list

# 作成された登録簿の確認
ls -l docs/ja/projects/prj-0001/controls/project-register/
```

生成された初期ディレクトリ構成:

```text
landing-page-specdojo/
├── .specdojo/
│   ├── specdojo.config.json
│   ├── agent-members.yaml
│   ├── pm-members.yaml
│   └── exec-defaults.yaml
├── docs/ja/projects/prj-0001/
│   └── controls/
│       └── project-register/
│           ├── generated/
│           └── events/
└── package.json
```

</details>

## 2. 管理対象リポジトリと Git flow の設定

### 前提

- オーケストレーターと対話中であること。
- プロダクトリポジトリ `../landing-page` が Git で初期化されており、`main` および `develop` ブランチが存在すること。

### 具体的対話

オーケストレーターにプロダクトリポジトリの接続と Git flow ルールの設定を依頼します。オーケストレーターはブランチ名や統合方式の不足事項を確認し、利用者が選択した後に設定を適用します。

```text
あなた: 隣にある ../landing-page を管理対象リポジトリに追加して、Git flow のブランチルールで運用したいです。
オーケストレーター: ../landing-page をプロダクトリポジトリ（repos）として接続し、Git flow のブランチ運用ルールを設定します。以下の運用設定について確認させてください:
  1. 統合先ブランチ（integration_branch）: develop でよろしいですか？（本番用の main と日々の開発統合用の develop を分ける Git flow 構成）
  2. 作業ブランチ命名規則（branch_template）: feature/{topic} でよろしいですか？（例: feature/add-faq-section）
  3. 統合方式（integration_strategy）: ff（Fast-Forward 早送り統合）にしますか、それとも merge（マージコミット作成）にしますか？（推奨は履歴が直線的になる ff です）
  4. コミット件名規則（commit_subject_template）: Conventional Commits 形式 {type}({scope}): {title} で統一しますか？
  5. 依存解決（setup）: 隔離作業ツリー作成時に npm install を自動実行（install: true）しますか？
あなた: 統合先は develop、作業ブランチは feature/{topic}、統合方式は ff、コミット件名は提案どおりの Conventional Commits、依存解決は install: true でお願いします。
オーケストレーター: 承知しました。以下の設定を .specdojo/specdojo.config.json の projects.prj-0001.repos に追加します:
  ・リポジトリ名: landing-page
  ・パス: ../landing-page
  ・統合先ブランチ: develop
  ・作業ブランチ規則: feature/{topic}
  ・統合方式: ff
  ・コミット件名: {type}({scope}): {title}
  ・setup: { "install": true, "build": false }
  この変更を適用してよろしいですか？
あなた: はい、適用してください。
オーケストレーター: 設定を更新しました。landing-page が管理対象として認識されました。
  VS Code でプロジェクトリポジトリとプロダクトリポジトリを同時に開くマルチルートワークスペース（prj-0001.code-workspace）を生成できますが、作成しますか？
あなた: はい、作成してください。
オーケストレーター: prj-0001.code-workspace を生成しました。VS Code で「ファイル > ワークスペースを開く」から開くことで、両リポジトリを 1 つのウィンドウで操作できます。
```

### 得られる結果と確認先

- `.specdojo/specdojo.config.json` に `repos` 定義が保存され、`../landing-page` がプロジェクトの管理下に入ります。
- `npx specdojo project list` でプロダクトリポジトリ `landing-page` が表示されます。
- `prj-0001.code-workspace` が作成され、VS Code で 2 つのリポジトリを同時に開けます。

### 折りたたんだコマンドと設定差分

<details>
<summary>repos 設定差分と CLI コマンド（クリックで展開）</summary>

`.specdojo/specdojo.config.json` の設定差分:

```json
{
  "projects": {
    "prj-0001": {
      "base_path": "docs/ja/projects/prj-0001",
      "project_register_path": "controls/project-register",
      "repos": [
        {
          "name": "landing-page",
          "path": "../landing-page",
          "integration_branch": "develop",
          "branch_template": "feature/{topic}",
          "integration_strategy": "ff",
          "commit_subject_template": "{type}({scope}): {title}",
          "merge_message_template": "Merge branch '{branch}' into {target}",
          "setup": {
            "install": true,
            "build": false
          }
        }
      ]
    }
  }
}
```

対応する手動確認・ワークスペース生成コマンド:

```bash
# プロジェクト設定と repos の確認
npx specdojo project list

# VS Code マルチルートワークスペースの生成
npx specdojo config scaffold --workspace --project prj-0001
```

</details>

## 3. registerをユースケース別に使う

register（登録簿）は、問題・判断・作業を個票として残し、追跡する入口です。
ここでは `../landing-page` を題材に、初学者がよく直面する 3 つのユースケース（機能追加の todo、不具合の issue、方針決定の decision）を対話で進めます。

> [!NOTE]
> 掲載している FAQ 追加、メニュー不具合、問い合わせフォーム方針の各事例は、ガイド用のサンプルであり実プロジェクトの事実ではありません。

### 3.1. 機能追加を起票する（todo）

#### 前提

- LP にユーザーから寄せられる疑問に答える「よくある質問（FAQ）」セクションをページ下部に追加したい。
- 目的と完了条件を定めて作業を追跡したい。

#### 具体的対話

```text
あなた: LP によくある質問（FAQ）セクションを追加したいので、todo を起票してほしいです。
オーケストレーター: FAQ セクション追加の todo を起票します。登録項目について確認させてください:
  ・タイトル: 「よくある質問（FAQ）セクションを追加する」
  ・topic（個票ファイル名や作業ブランチ名に使われます）: add-faq-section
  ・優先度: medium（通常）でよろしいですか？
  ・担当者（owner）: あなた（owner）を割り当てますか？
  ・完了期日（due_on）: 目安の日付はありますか？（未定なら空欄にします）
  ・難しさ（difficulty）: 既存のコンポーネント構成に沿った追加のため medium を推奨します。
あなた: 優先度は medium、担当は owner、期日は 2026-11-30、難しさは medium でお願いします。
オーケストレーター: 承知しました。以下の内容で todo を起票し、登録簿へコミットします:
  ・種別: todo
  ・タイトル: 「よくある質問（FAQ）セクションを追加する」
  ・topic: add-faq-section
  ・優先度: medium、担当: owner、期日: 2026-11-30、難しさ: medium
  起票を実行してよろしいですか？
あなた: はい、実行してください。
オーケストレーター: 個票 PJR-FA01（例）を作成し、登録簿へコミットしました。
  個票ファイル docs/ja/projects/prj-0001/controls/project-register/pjr-fa01-add-faq-section.md を確認してください。
  個票の「完了条件」に、掲載する質問項目、アコーディオン UI の動作、モバイル表示での検証条件などを記載しておくと、後の AI 実行がスムーズになります。
```

#### 得られる結果と確認先

- 個票ファイル `docs/ja/projects/prj-0001/controls/project-register/pjr-fa01-add-faq-section.md` が作成されます。
- `docs/ja/projects/prj-0001/controls/project-register/generated/pjr-index.md`（登録簿一覧）に項目が追加されます。
- 個票に章立て（概要、完了条件、作業内容、対応結果）が用意されます。

#### 折りたたんだコマンドと設定差分

<details>
<summary>CLI コマンドと作成された個票の例（クリックで展開）</summary>

対応する CLI コマンド:

```bash
npx specdojo register add \
  --project prj-0001 \
  --type todo \
  --title "よくある質問（FAQ）セクションを追加する" \
  --topic add-faq-section \
  --priority medium \
  --owner owner \
  --due 2026-11-30 \
  --difficulty medium \
  --commit
```

作成される個票の Frontmatter:

```yaml
---
specdojo:
  id: prj-0001:pjr-fa01-add-faq-section
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: owner
  due_on: "2026-11-30"
---
```

</details>

### 3.2. 不具合を調べて直す（issue）

#### 前提

- スマートフォンで LP を閲覧中、ナビゲーションメニューを開いてリンクをタップしてもメニューオーバーレイが閉じない問題が報告された。
- 症状と再現条件を記録し、原因調査と修正を進めたい。

#### 具体的対話

```text
あなた: スマホ表示でナビゲーションメニューを開いた後、リンクをタップしてもメニューが閉じない不具合があります。issue を起票して調査したいです。
オーケストレーター: ナビゲーションメニュー不具合の issue を起票します。以下の内容を確認させてください:
  ・タイトル: 「スマホ表示でナビゲーションメニューが閉じない不具合の調査と修正」
  ・topic: fix-mobile-nav-close
  ・優先度: モバイル利用者の閲覧に影響するため high を推奨しますが、いかがでしょうか？
  ・担当者: owner でよろしいですか？
  ・難しさ（difficulty）: 原因調査と修正が必要なため medium に設定しますか？
  ・再現条件: 現時点で分かっている再現手順や環境はありますか？
あなた: 優先度は high、担当は owner、難しさは medium でお願いします。再現条件は画面幅 768px 以下の環境で、メニュー内のアンカーリンクをクリックした際にオーバーレイの閉じる処理が発火していません。
オーケストレーター: 承知しました。以下の内容で issue を起票します:
  ・種別: issue
  ・タイトル: 「スマホ表示でナビゲーションメニューが閉じない不具合の調査と修正」
  ・topic: fix-mobile-nav-close
  ・優先度: high、担当: owner、難しさ: medium
  ・再現条件のメモを個票の「問題」セクションに記載します
  起票を実行してよろしいですか？
あなた: はい、起票してください。
オーケストレーター: 個票 PJR-NV02（例）を作成しました。
  課題ログ（docs/ja/projects/prj-0001/controls/generated/pm-issue-log.md）にも登録されました。
  調査結果や修正方針が定まったら、個票の「原因」「影響」「対応結果」に記録します。
```

#### 得られる結果と確認先

- 個票ファイル `docs/ja/projects/prj-0001/controls/project-register/pjr-nv02-fix-mobile-nav-close.md` が作成されます。
- `docs/ja/projects/prj-0001/controls/generated/pm-issue-log.md`（課題ログ）に登録されます。

#### 折りたたんだコマンドと設定差分

<details>
<summary>CLI コマンドと課題ログの反映例（クリックで展開）</summary>

対応する CLI コマンド:

```bash
npx specdojo register add \
  --project prj-0001 \
  --type issue \
  --title "スマホ表示でナビゲーションメニューが閉じない不具合の調査と修正" \
  --topic fix-mobile-nav-close \
  --priority high \
  --owner owner \
  --difficulty medium \
  --commit
```

生成される課題ログの例:

```markdown
| ID       | ステータス | タイトル                                                       | 優先度 | 担当  |
| -------- | ---------- | -------------------------------------------------------------- | ------ | ----- |
| PJR-NV02 | open       | スマホ表示でナビゲーションメニューが閉じない不具合の調査と修正 | high   | owner |
```

</details>

### 3.3. 実装方針を比較して決める（decision）

#### 前提

- LP に問い合わせフォームを設置するにあたり、複数の選択肢（外部フォームサービス、自前サーバーレス関数、mailto リンクなど）があり、トレードオフを比較して決定したい。

#### 具体的対話

```text
あなた: 問い合わせフォームの実装方針をいくつか比較して決めたいので、decision を起票して相談したいです。
オーケストレーター: 問い合わせフォーム実装方針の decision を起票します。確認事項です:
  ・タイトル: 「問い合わせフォームの実装方針を比較・決定する」
  ・topic: contact-form-strategy
  ・担当者: owner でよろしいですか？
  ・比較検討する選択肢の候補として、以下を個票に整理してよろしいでしょうか:
    - 案 A: 外部フォームサービス（Formspree や Google Forms 等）の埋め込み連携
    - 案 B: サーバーレス関数（API エンドポイント）による自前送信処理の実装
    - 案 C: mailto リンクまたは問い合わせメールアドレスの掲示のみ
あなた: 担当は owner、選択肢はその 3 つで比較を作成してください。
オーケストレーター: 以下の内容で decision を起票します:
  ・種別: decision
  ・タイトル: 「問い合わせフォームの実装方針を比較・決定する」
  ・topic: contact-form-strategy
  ・担当: owner
  起票を実行してよろしいですか？
あなた: お願いします。
オーケストレーター: 個票 PJR-CF03（例）を作成しました。各選択肢の長所・短所を個票に整理しました:
  - 案 A: 導入が迅速でサーバー保守不要。外部サービスの利用規約や制限がトレードオフ。
  - 案 B: デザインと挙動を完全制御できるが、スパム対策やバックエンド保守が必要。
  - 案 C: 実装工数ゼロだが、メールクライアント起動の手間とアドレス収集スパムのリスク。
  初期リリースとしてはどの方針を採用しますか？採択理由と合わせてご指示ください（オーケストレーターが勝手に採択案を決定することはありません）。
あなた: 保守負荷を抑えて最短で安全に開始したいため、案 A（外部フォームサービス連携）を採用します。
オーケストレーター: 承知しました。以下の内容で個票を更新し、decision を完了（decided）にしてよろしいですか？
  ・決定内容: 「案 A: 外部フォームサービスの埋め込み連携を採用」
  ・採択理由: 「保守工数の削減とスパム対策の両立」
あなた: はい、完了してください。
オーケストレーター: decision PJR-CF03 を完了（decided）としてクローズしました。
  決定ログ（docs/ja/projects/prj-0001/controls/generated/pm-decision-log.md）に記録されました。
```

#### 得られる結果と確認先

- 個票ファイル `docs/ja/projects/prj-0001/controls/project-register/pjr-cf03-contact-form-strategy.md` に選択肢・決定内容・採択理由が記録され、ステータスが `decided` になります。
- `docs/ja/projects/prj-0001/controls/generated/pm-decision-log.md`（決定ログ）に反映されます。

#### 折りたたんだコマンドと設定差分

<details>
<summary>CLI コマンドと決定ログの反映例（クリックで展開）</summary>

起票と完了の CLI コマンド:

```bash
# decision の起票
npx specdojo register add \
  --project prj-0001 \
  --type decision \
  --title "問い合わせフォームの実装方針を比較・決定する" \
  --topic contact-form-strategy \
  --owner owner \
  --commit

# 個票編集後のクローズ（decided への遷移）
npx specdojo register close \
  --project prj-0001 \
  --id PJR-CF03 \
  --conclusion "案 A: 外部フォームサービスの埋め込み連携を採用（保守工数削減とスパム対策両立）" \
  --commit
```

</details>

### 3.4. その他の種別と運用ガイド

register には上記のほか、以下の種別があります。目的に応じて使い分けてください。詳しい種別の選び方と状態遷移は [[specdojo:register-operation-guide|登録簿運用ガイド]] を参照してください。

| 種別             | 主な用途                               | 完了時の状態           |
| ---------------- | -------------------------------------- | ---------------------- |
| `todo`           | 完了条件を定義して実行する作業項目     | `done`                 |
| `issue`          | 症状・原因・影響を調査して解決する問題 | `resolved` / `done`    |
| `decision`       | 選択肢を比較し理由を残して下す意思決定 | `decided`              |
| `question`       | まだ答えの出ていない論点や確認事項     | `answered` / `decided` |
| `change-request` | 合意済みの仕様やスコープを変更する要求 | `done`                 |
| `risk`           | 発生前に備える潜在的な危険・不確実性   | `mitigated` / `closed` |
| `note`           | 後から参照するための観察記録・メモ     | `open`（蓄積）         |
| `epic`           | 複数の作業を束ねるトラック単位の大括り | `done`（人が判断）     |

## 4. 発展: worktreeで1タスクを隔離実行する

登録した作業は、AI エージェント（executor / reporter）に委任して実行できます。
手元の作業ツリーを保護するため、SpecDojo は Git worktree による**隔離実行**を行います。

### 前提

- 3.1 で起票した FAQ 追加の todo（`PJR-FA01`）の個票に完了条件が書かれていること。
- `.specdojo/exec-defaults.yaml` に難しさに応じた agent ルーティングが設定されていること（初期化時に設定済み）。
- プロダクトリポジトリ `../landing-page` の `develop` ブランチが作業可能な状態であること。

### 具体的対話

オーケストレーターに起票済みタスクの隔離実行を依頼します。オーケストレーターは実行方式（worktree）、作業ブランチ名、統合先ブランチを提示して承認を得てから実行します。

```text
あなた: 起票した FAQ 追加の todo（PJR-FA01）を AI に実行させたいです。安全に進めてください。
オーケストレーター: PJR-FA01 の AI 実行（exec run）を準備します。以下の計画を確認させてください:
  ・隔離実行: ../landing-page-specdojo-worktrees/PJR-FA01/ に専用の作業環境を隔離作成します。
  ・Git flow 規則の適用: 設定済みのブランチ規則に従い、プロダクト側（../landing-page）に作業ブランチ feature/add-faq-section を作成します。
  ・実行 agent: 難しさ medium に応じた標準 executor と reporter を割り当てます。
  ・統合方式: 検証（lint, typecheck 等）合格後、プロダクト側の develop へ Fast-Forward（早送り）で自動統合し、worktree を片付けます。
  この計画で AI 実行を開始してよろしいですか？
あなた: はい、実行を開始してください。
オーケストレーター: 実行を開始しました。
  [1/4] worktree を準備し、プロダクト側に feature/add-faq-section を作成しました。
  [2/4] executor が FAQ コンポーネントを実装し、親の文書・型検査に合格しました。
  [3/4] reporter が実行結果（evidence / result）を作成しました。
  [4/4] feature/add-faq-section を develop へ Fast-Forward 統合し、worktree を片付けました。
  個票 PJR-FA01 のステータスが review（人間の講評待ち）になりました。以下の確認をお願いします:
  1. プロダクト側（../landing-page）のコミットログ（git log -1）と変更差分
  2. 実行結果ファイル（docs/ja/projects/prj-0001/execution/exec/results/pjr-fa01-....md）
  3. ローカル開発サーバーでの FAQ 表示とアコーディオン動作
  確認後、問題がなければ完了（close）をご指示ください。
あなた: プロダクトのコミットとローカル表示を確認しました。FAQ が期待通り動作しています。完了してください。
オーケストレーター: 完了条件の達成を確認しました。PJR-FA01 を完了（done）としてクローズし、登録簿へコミットします。よろしいですか？
あなた: はい、クローズしてください。
オーケストレーター: PJR-FA01 を完了としてクローズしました。お疲れ様でした！
```

### 得られる結果と確認先

- `../landing-page` の `develop` ブランチに、`feat(add-faq-section): よくある質問（FAQ）セクションを追加する` がコミット・統合されます。
- `docs/ja/projects/prj-0001/execution/exec/results/` に result ファイルが生成され、変更ファイル一覧や検証記録が保存されます。
- 個票 `PJR-FA01` のステータスが `review` から `done` に遷移します。

### 折りたたんだコマンドと設定差分

<details>
<summary>AI 実行と確認の手動 CLI コマンド（クリックで展開）</summary>

手動で実行する場合のコマンド:

```bash
# 1 タスクを worktree で隔離実行
npx specdojo exec run \
  --project prj-0001 \
  --register PJR-FA01 \
  --worktree

# プロダクトリポジトリの統合コミットを確認
git -C ../landing-page log -1 --stat

# 個票の完了クローズ
npx specdojo register close \
  --project prj-0001 \
  --id PJR-FA01 \
  --conclusion "FAQ セクションの実装とローカルでの表示・動作確認を完了" \
  --commit
```

</details>

## 5. 発展: 成果物カタログからscheduleへ展開する

個別の todo / issue 管理から進み、LP の仕様書・設計書群（要件定義、画面設計、運用手順など）を体系的に計画し、依存関係に沿って段階的に作成する経路です。

### 5.1. 成果物カタログを作成する

#### 前提

- 仕様書・設計書群を体系的に管理したい。
- `.specdojo/specdojo.config.json` に `catalog_path`（例: `010-deliverables-catalog`）が設定されていること。

#### 具体的対話

```text
あなた: LP の仕様書や設計ドキュメントを体系的に揃えたいです。成果物カタログを作って進めるにはどうすればよいですか？
オーケストレーター: 成果物カタログ（dct-*.yaml）を作成します。以下の内容を確認させてください:
  ・規模（size）: 最小限の基本構成が揃う small サイズで生成しますか？（後から成果物の追加や削除が可能です）
  ・配置場所: .specdojo/specdojo.config.json の catalog_path（010-deliverables-catalog）に配置します。
  まず small サイズのカタログ雛形を生成し、構文を検証してよろしいですか？
あなた: はい、small サイズで生成してください。
オーケストレーター: 成果物カタログの生成、検証、および成果物雛形の生成を実行しました。
  ・dct-project-definition.yaml（プロジェクト定義カタログ）を作成しました。
  ・カタログが参照する成果物ファイル（docs/ja/projects/prj-0001/010-deliverables/ 配下）を生成しました。
  プロジェクトのスコープに合わせてカタログ内の成果物定義を調整できます。
```

#### 得られる結果と確認先

- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-project-definition.yaml` が作成されます。
- `docs/ja/projects/prj-0001/010-deliverables/` 配下に成果物 Markdown 雛形が生成されます。
- `docs/ja/projects/prj-0001/010-deliverables-catalog/generated/` にカタログ派生ビューが出力されます。

#### 折りたたんだコマンドと設定差分

<details>
<summary>カタログ操作の CLI コマンド（クリックで展開）</summary>

```bash
# 規模別テンプレートからカタログを生成
npx specdojo catalog scaffold --project prj-0001 --size small

# カタログの構造と依存関係を検証
npx specdojo catalog validate --project prj-0001

# カタログが指す成果物ファイル本体を生成
npx specdojo deliverable scaffold --project prj-0001

# カタログの Markdown 派生ビューをビルド
npx specdojo catalog build --project prj-0001
```

</details>

### 5.2. トラック戦略を作成する

#### 前提

- カタログの成果物をどのようなフェーズ、担当ロール、所要日数で作成するかを定めるトラック戦略 `sch-strategy-<track>.yaml` を作成すること。
- 名簿（`pm-members.yaml`）と役割（`pm-roles.yaml`）が準備されていること。

#### 具体的対話

```text
あなた: カタログの成果物を作成するためのスケジュール戦略を作りたいです。
オーケストレーター: トラック戦略（sch-strategy-launch.yaml）を生成します。確認事項です:
  ・トラック名: 立ち上げトラックの launch でよろしいですか？
  ・作成担当（default-owner）: ドキュメント作成担当を名簿の BA ロールに割り当てますか？
  ・ゲート・マイルストーン担当: 同じく BA に設定しますか？
あなた: トラックは launch、担当ロールは BA でお願いします。
オーケストレーター: sch-strategy-launch.yaml を生成しました。
  small カタログに含まれる成果物を依存関係順に作成する計画が設定されました。
```

#### 得られる結果と確認先

- `docs/ja/projects/prj-0001/execution/schedule/sch-strategy-launch.yaml` が生成されます。

#### 折りたたんだコマンドと設定差分

<details>
<summary>トラック戦略生成コマンド（クリックで展開）</summary>

```bash
npx specdojo schedule strategy generate \
  --project prj-0001 \
  --track launch \
  --default-owner BA \
  --gate-owner BA \
  --milestone-owner BA
```

</details>

### 5.3. Scheduleを生成する

#### 前提

- カタログとトラック戦略が存在すること。

#### 具体的対話

```text
あなた: スケジュールを生成して、今すぐ着手できるタスクを確認したいです。
オーケストレーター: launch トラックのスケジュールをビルドし、Ready タスクを抽出します。実行してよろしいですか？
あなた: はい、実行してください。
オーケストレーター: スケジュール（sch-track-launch.yaml）を生成し、exec refresh を実行しました。
  最初の Ready タスクとして prj-overview-010（プロジェクト概要の初稿作成）が着手可能です。
```

#### 得られる結果と確認先

- `docs/ja/projects/prj-0001/execution/schedule/sch-track-launch.yaml`
- `docs/ja/projects/prj-0001/execution/generated/ready.json`（着手可能タスク一覧）

#### 折りたたんだコマンドと設定差分

<details>
<summary>スケジュールビルドの CLI コマンド（クリックで展開）</summary>

```bash
# スケジュールのビルド
npx specdojo schedule build --project prj-0001 --track launch --force

# Ready タスクと CPM の更新
npx specdojo exec refresh --project prj-0001
```

</details>

### 5.4. 1タスクを実行する

#### 前提

- `ready.json` に着手可能なタスクがあること。

#### 具体的対話

```text
あなた: 最初の Ready タスクを進めたいです。
オーケストレーター: タスク prj-overview-010（プロジェクト概要の初稿作成）を実行します:
  ・担当者: あなた（owner）で claim しますか？
  ・作業方式: 人間が内容を記述して確定する（execution: human）構成です。
  まずタスクを claim して、result 雛形を準備してよろしいですか？
あなた: はい、owner で claim してください。
オーケストレーター: claim を完了しました。成果物ファイル（docs/ja/projects/prj-0001/010-deliverables/prj-overview.md）と生成された result を編集してください。
  完了条件を満たしたら「完了にして」とお知らせください。
あなた: 成果物の編集が終わりました。完了にしてください。
オーケストレーター: タスク prj-overview-010 を完了として記録し、次の Ready タスクを更新しました。
```

#### 得られる結果と確認先

- 成果物ファイルおよび `<execution_path>/exec/results/` の result が記録されます。
- `exec refresh` により後続のタスクが Ready に繰り上がります。

#### 折りたたんだコマンドと設定差分

<details>
<summary>タスク実行の CLI コマンド（クリックで展開）</summary>

```bash
# 次のタスクを確認
npx specdojo exec scheduler --project prj-0001 --by owner --dry-run

# タスクを claim
npx specdojo exec claim --project prj-0001 --task prj-overview-010 --by owner

# 成果物と result を編集後、完了を記録
npx specdojo exec complete --project prj-0001 --task prj-overview-010 --by owner

# Ready タスクを更新
npx specdojo exec refresh --project prj-0001
```

</details>

## 6. 発展: routineで定期実行する

日次の未処理 todo スイープや定期確認作業など、決まった間隔で繰り返し実行したいジョブを `routine` として定義・自動化します。

### 前提

- `.specdojo/specdojo.config.json` に `routines_path`（例: `routines`）および `jobs_path` が設定されていること。
- 登録簿スイープ用の Job 定義（例: `docs/ja/projects/prj-0001/jobs/job-register-sweep.yaml`）が存在すること。

### 具体的対話

オーケストレーターに定期実行ルーチンの登録を相談します。オーケストレーターは実行頻度や対象条件を確認し、定義を作成して検証します。

```text
あなた: オープンな高優先度 todo を毎日確認して処理する仕組み（routine）を作りたいです。
オーケストレーター: 定期実行ルーチン（routine）を設定します。以下の設定内容を確認させてください:
  ・ルーチン ID: rtn-daily-register-sweep
  ・実行頻度（interval）: 毎日 1 回の 1d でよろしいですか？
  ・対象条件: 状態が open かつ優先度が high の todo を対象にしますか？
  ・処理件数上限（limit）: 安全のため 1 回あたり最大 3 件までに制限しますか？
  ・呼び出し Job: 登録簿スイープ用 Job job-register-sweep を指定します。
  この内容でルーチン定義ファイル（routines/rtn-daily-register-sweep.yaml）を作成してよろしいですか？
あなた: はい、その設定で作成してください。
オーケストレーター: 定義ファイルを作成しました。定義の構文検証と dry-run（試行実行）を行ってよろしいですか？
あなた: はい、検証と dry-run をお願いします。
オーケストレーター: routine validate に合格し、dry-run で対象の todo が正しく抽出されることを確認しました。
  継続運用では、cron や CI（GitHub Actions の scheduled workflow 等）から定期的に実行コマンドを呼び出します。設定例を確認しますか？
あなた: cron の設定例を教えてください。
オーケストレーター: cron の設定例を提示します。平日の朝 9 時に due なルーチンを実行する例です:
  0 9 * * 1-5 cd /path/to/landing-page-specdojo && npx specdojo routine run --project prj-0001 --due
```

### 得られる結果と確認先

- `docs/ja/projects/prj-0001/routines/rtn-daily-register-sweep.yaml` が作成されます。
- `npx specdojo routine list` でルーチンの一覧、有効/無効状態、前回実行日時が確認できます。
- cron や CI による無人定期運用が可能になります。

### 折りたたんだコマンドと設定差分

<details>
<summary>ルーチン定義ファイルと CLI コマンド（クリックで展開）</summary>

`routines/rtn-daily-register-sweep.yaml` の内容:

```yaml
id: rtn-daily-register-sweep
name: 登録簿 open todo の日次スイープ
enabled: true
interval: 1d
action:
  kind: job
  job: job-register-sweep
  inputs:
    types: todo
    priorities: high
    statuses: open
    limit: "3"
```

対応する CLI コマンド:

```bash
# ルーチン定義の構文検証
npx specdojo routine validate --project prj-0001

# ルーチン一覧の確認
npx specdojo routine list --project prj-0001

# dry-run で実行対象を確認
npx specdojo routine run --project prj-0001 --id rtn-daily-register-sweep --dry-run

# 期限が到来した（due）ルーチンを一括実行
npx specdojo routine run --project prj-0001 --due
```

</details>
