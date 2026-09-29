---
specdojo:
  id: prj-0001:xer-pjr-njrh-20260929t130250z-d3fd
  type: exec-result
  task_id: PJR-NJRH
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-njrh-20260929T130250Z-d3fd-plan.md
  started_at: "2026-09-29T13:02:51.152Z"
  completed_at: "2026-09-29T13:06:21.568Z"
  agent: agy-expert-executor
  block_reason: "agent exited with non-zero code: agent exited with non-zero code: agent-config-write: protected configuration changes detected; paths=.claude/agents/specdojo-orchestrator.md, .codex/agents/specdojo-or…"
---

# Edit Result

## 1. 実施内容

- `.agents/specdojo-orchestrator.agent.md` における `register` の使い方を修正し、`--commit` を用いて一貫した状態遷移・記帳・コミットを行うように記述を改めた。
- 手順から `register build` の個別の呼び出しを削除した。
- `exec run` の稼働中でも、`--commit` を使えば既存個票の記帳を後回しにせず安全に状態遷移可能であることを明記した。
- コミットメッセージの指定方針（subject、type、scope、`Refs:` の記載）を `-m` オプションと組み合わせて守る方法を追記した。
- PJR-NJRH の個票（`docs/ja/projects/prj-0001/controls/project-register/pjr-njrh-orchestrator-use-register-commit.md`）の作業内容および対応結果を更新した。
- `npm run orchestrator:sync` を実行して各環境のラッパーへ同期し、静的検査（`lint:orchestrator-sync`、`lint:md`）が通過することを確認した。

## 2. 変更ファイル

- `.agents/specdojo-orchestrator.agent.md`
- `docs/ja/projects/prj-0001/controls/project-register/pjr-njrh-orchestrator-use-register-commit.md`

## 3. 申し送り

特になし。

<!-- specdojo:agent-protection-handoff -->

**保護機構による自動記録**: `agent-config-write` が agent の変更を止めた。適用するかどうかは人または対話型 orchestrator が agent 実行外で判断する。

- 対象パス: `.claude/agents/specdojo-orchestrator.md`, `.codex/agents/specdojo-orchestrator.toml`, `.github/agents/specdojo-orchestrator.md`, `.opencode/agents/gemma-orchestrator.md`, `.opencode/agents/qwen-orchestrator.md`
- 変更理由: この節の上に agent が記入した申し送りを参照する。
- 変更後に必要な検証: この節の上に agent が記入した申し送りを参照する。
- block メッセージ: `agent-config-write: protected configuration changes detected; paths=.claude/agents/specdojo-orchestrator.md, .codex/agents/specdojo-orchestrator.toml, .github/agents/specdojo-orchestrator.md, .opencode/agents/gemma-orchestrator.md, .opencode/agents/qwen-orchestrator.md; agent must record the required change in the result handoff for human or orchestrator application`

提案差分:

````diff
diff --git a/.claude/agents/specdojo-orchestrator.md b/.claude/agents/specdojo-orchestrator.md
index 9d30732a9..eecd62b98 100644
--- a/.claude/agents/specdojo-orchestrator.md
+++ b/.claude/agents/specdojo-orchestrator.md
@@ -64,8 +64,8 @@ CLI は利用リポジトリへローカル導入されるため、`npx specdojo
 ```bash
 npx specdojo config init
 npx specdojo register scaffold --project <project-id>
-npx specdojo register add --project <project-id> --type todo --title "<title>"
-npx specdojo register build --project <project-id>
+npx specdojo register add --project <project-id> --type todo --title "<title>" \
+  --commit -m "feat(project): 初期セットアップのため起票"
 ```

 利用者が「何から始めればよいか」と尋ねた場合は、まず解決したい課題を `issue`、決めたいことを `decision`、やることを `todo` として起票することを勧める。成果物カタログや Schedule は、扱う成果物が定まってから広げる。
@@ -93,17 +93,23 @@ type は次のように使い分ける。
 ```bash
 npx specdojo register add --project <project-id> \
   --type todo --title "<title>" --description "<description>" \
-  --priority high --owner DEV --due <YYYY-MM-DD>
+  --priority high --owner DEV --due <YYYY-MM-DD> \
+  --commit -m "feat(project): <なぜ起票するかの理由を記載>
+
+Refs: PJR-XXXX"
 ```

 起票後は個票を開き、`概要` / `完了条件` / `作業内容` を埋める。**完了条件は exec plan の入力になる**ため、検証可能な形で書く。曖昧なまま実行へ流すと、agent が意図と違う範囲を実装する。

 状態遷移は次で行う。`exec run --register` を使う場合、`start` と `review` は runner が自動で記帳するため手で打たない。
+状態遷移や更新には `--commit` を付けることで、排他制御（lifecycle 枠の取得）、記帳、`register build`、`git commit` までが一貫して行われる。これにより、`exec run` 稼働中であっても、既存個票の記帳を後回しにせず安全に状態遷移できる。`-m` オプションを使い、commit メッセージの方針（subject は日本語、conventional commit の type と scope、本文に「なぜ」と `Refs: PJR-XXXX`）を守ること。

 ```bash
 npx specdojo register close --project <project-id> --id <PJR-XXXX> \
-  --conclusion "<結論>" --by <actor> --reason "<理由>"
-npx specdojo register build --project <project-id>
+  --conclusion "<結論>" --by <actor> --reason "<理由>" \
+  --commit -m "chore(project): PJR-XXXX を close
+
+Refs: PJR-XXXX"
 ```

 `decision` と `question` は `--status decided` を付ける。close の前に個票の `決定内容` / `承認` を埋める。
diff --git a/.codex/agents/specdojo-orchestrator.toml b/.codex/agents/specdojo-orchestrator.toml
index b9e5e2308..cf10826fe 100644
--- a/.codex/agents/specdojo-orchestrator.toml
+++ b/.codex/agents/specdojo-orchestrator.toml
@@ -64,8 +64,8 @@ CLI は利用リポジトリへローカル導入されるため、`npx specdojo
 ```bash
 npx specdojo config init
 npx specdojo register scaffold --project <project-id>
-npx specdojo register add --project <project-id> --type todo --title "<title>"
-npx specdojo register build --project <project-id>
+npx specdojo register add --project <project-id> --type todo --title "<title>" \
+  --commit -m "feat(project): 初期セットアップのため起票"
 ```

 利用者が「何から始めればよいか」と尋ねた場合は、まず解決したい課題を `issue`、決めたいことを `decision`、やることを `todo` として起票することを勧める。成果物カタログや Schedule は、扱う成果物が定まってから広げる。
@@ -93,17 +93,23 @@ type は次のように使い分ける。
 ```bash
 npx specdojo register add --project <project-id> \
   --type todo --title "<title>" --description "<description>" \
-  --priority high --owner DEV --due <YYYY-MM-DD>
+  --priority high --owner DEV --due <YYYY-MM-DD> \
+  --commit -m "feat(project): <なぜ起票するかの理由を記載>
+
+Refs: PJR-XXXX"
 ```

 起票後は個票を開き、`概要` / `完了条件` / `作業内容` を埋める。**完了条件は exec plan の入力になる**ため、検証可能な形で書く。曖昧なまま実行へ流すと、agent が意図と違う範囲を実装する。

 状態遷移は次で行う。`exec run --register` を使う場合、`start` と `review` は runner が自動で記帳するため手で打たない。
+状態遷移や更新には `--commit` を付けることで、排他制御（lifecycle 枠の取得）、記帳、`register build`、`git commit` までが一貫して行われる。これにより、`exec run` 稼働中であっても、既存個票の記帳を後回しにせず安全に状態遷移できる。`-m` オプションを使い、commit メッセージの方針（subject は日本語、conventional commit の type と scope、本文に「なぜ」と `Refs: PJR-XXXX`）を守ること。

 ```bash
 npx specdojo register close --project <project-id> --id <PJR-XXXX> \
-  --conclusion "<結論>" --by <actor> --reason "<理由>"
-npx specdojo register build --project <project-id>
+  --conclusion "<結論>" --by <actor> --reason "<理由>" \
+  --commit -m "chore(project): PJR-XXXX を close
+
+Refs: PJR-XXXX"
 ```

 `decision` と `question` は `--status decided` を付ける。close の前に個票の `決定内容` / `承認` を埋める。
diff --git a/.github/agents/specdojo-orchestrator.md b/.github/agents/specdojo-orchestrator.md
index 69da48151..357096874 100644
--- a/.github/agents/specdojo-orchestrator.md
+++ b/.github/agents/specdojo-orchestrator.md
@@ -65,8 +65,8 @@ CLI は利用リポジトリへローカル導入されるため、`npx specdojo
 ```bash
 npx specdojo config init
 npx specdojo register scaffold --project <project-id>
-npx specdojo register add --project <project-id> --type todo --title "<title>"
-npx specdojo register build --project <project-id>
+npx specdojo register add --project <project-id> --type todo --title "<title>" \
+  --commit -m "feat(project): 初期セットアップのため起票"
 ```

 利用者が「何から始めればよいか」と尋ねた場合は、まず解決したい課題を `issue`、決めたいことを `decision`、やることを `todo` として起票することを勧める。成果物カタログや Schedule は、扱う成果物が定まってから広げる。
@@ -94,17 +94,23 @@ type は次のように使い分ける。
 ```bash
 npx specdojo register add --project <project-id> \
   --type todo --title "<title>" --description "<description>" \
-  --priority high --owner DEV --due <YYYY-MM-DD>
+  --priority high --owner DEV --due <YYYY-MM-DD> \
+  --commit -m "feat(project): <なぜ起票するかの理由を記載>
+
+Refs: PJR-XXXX"
 ```

 起票後は個票を開き、`概要` / `完了条件` / `作業内容` を埋める。**完了条件は exec plan の入力になる**ため、検証可能な形で書く。曖昧なまま実行へ流すと、agent が意図と違う範囲を実装する。

 状態遷移は次で行う。`exec run --register` を使う場合、`start` と `review` は runner が自動で記帳するため手で打たない。
+状態遷移や更新には `--commit` を付けることで、排他制御（lifecycle 枠の取得）、記帳、`register build`、`git commit` までが一貫して行われる。これにより、`exec run` 稼働中であっても、既存個票の記帳を後回しにせず安全に状態遷移できる。`-m` オプションを使い、commit メッセージの方針（subject は日本語、conventional commit の type と scope、本文に「なぜ」と `Refs: PJR-XXXX`）を守ること。

 ```bash
 npx specdojo register close --project <project-id> --id <PJR-XXXX> \
-  --conclusion "<結論>" --by <actor> --reason "<理由>"
-npx specdojo register build --project <project-id>
+  --conclusion "<結論>" --by <actor> --reason "<理由>" \
+  --commit -m "chore(project): PJR-XXXX を close
+
+Refs: PJR-XXXX"
 ```

 `decision` と `question` は `--status decided` を付ける。close の前に個票の `決定内容` / `承認` を埋める。
diff --git a/.opencode/agents/gemma-orchestrator.md b/.opencode/agents/gemma-orchestrator.md
index 070d593f0..5abb616fb 100644
--- a/.opencode/agents/gemma-orchestrator.md
+++ b/.opencode/agents/gemma-orchestrator.md
@@ -104,8 +104,8 @@ CLI は利用リポジトリへローカル導入されるため、`npx specdojo
 ```bash
 npx specdojo config init
 npx specdojo register scaffold --project <project-id>
-npx specdojo register add --project <project-id> --type todo --title "<title>"
-npx specdojo register build --project <project-id>
+npx specdojo register add --project <project-id> --type todo --title "<title>" \
+  --commit -m "feat(project): 初期セットアップのため起票"
 ```

 利用者が「何から始めればよいか」と尋ねた場合は、まず解決したい課題を `issue`、決めたいことを `decision`、やることを `todo` として起票することを勧める。成果物カタログや Schedule は、扱う成果物が定まってから広げる。
@@ -133,17 +133,23 @@ type は次のように使い分ける。
 ```bash
 npx specdojo register add --project <project-id> \
   --type todo --title "<title>" --description "<description>" \
-  --priority high --owner DEV --due <YYYY-MM-DD>
+  --priority high --owner DEV --due <YYYY-MM-DD> \
+  --commit -m "feat(project): <なぜ起票するかの理由を記載>
+
+Refs: PJR-XXXX"
 ```

 起票後は個票を開き、`概要` / `完了条件` / `作業内容` を埋める。**完了条件は exec plan の入力になる**ため、検証可能な形で書く。曖昧なまま実行へ流すと、agent が意図と違う範囲を実装する。

 状態遷移は次で行う。`exec run --register` を使う場合、`start` と `review` は runner が自動で記帳するため手で打たない。
+状態遷移や更新には `--commit` を付けることで、排他制御（lifecycle 枠の取得）、記帳、`register build`、`git commit` までが一貫して行われる。これにより、`exec run` 稼働中であっても、既存個票の記帳を後回しにせず安全に状態遷移できる。`-m` オプションを使い、commit メッセージの方針（subject は日本語、conventional commit の type と scope、本文に「なぜ」と `Refs: PJR-XXXX`）を守ること。

 ```bash
 npx specdojo register close --project <project-id> --id <PJR-XXXX> \
-  --conclusion "<結論>" --by <actor> --reason "<理由>"
-npx specdojo register build --project <project-id>
+  --conclusion "<結論>" --by <actor> --reason "<理由>" \
+  --commit -m "chore(project): PJR-XXXX を close
+
+Refs: PJR-XXXX"
 ```

 `decision` と `question` は `--status decided` を付ける。close の前に個票の `決定内容` / `承認` を埋める。
diff --git a/.opencode/agents/qwen-orchestrator.md b/.opencode/agents/qwen-orchestrator.md
index 06e03a0ff..3ed8622da 100644
--- a/.opencode/agents/qwen-orchestrator.md
+++ b/.
... (文字数上限で切り詰め)
````

## 4. 進め方と実践の型の適用

`freeform` のアプローチに従い、プロジェクト固有の仕様変更（PJR-9XG4 の `--commit` オプション導入）に基づいて `.agents/specdojo-orchestrator.agent.md` の運用手順を更新した。更新にあたっては PJR-NJRH 個票に定義された完了条件を基準とし、すべての条件を満たすように変更を反映した。
