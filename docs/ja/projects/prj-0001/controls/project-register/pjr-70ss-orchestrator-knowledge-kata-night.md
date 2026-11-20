---
specdojo:
  id: prj-0001:pjr-70ss-orchestrator-knowledge-kata-night
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: medium
  owner: sol-executor
  registered_at: "2026-11-13T14:07:54Z"
  block_reason: agent exited 0 but result is incomplete or its frontmatter differs from the scaffold (treated as blocked)
  commit_type: docs
  commit_scope: orchestrator
---

# PJR-70SS オーケストレーターの本体と運用メモに、型の整備と夜間の実行の知見を書き足す

## 1. 概要

どのプロジェクトでも同じ振る舞いは specdojo-orchestrator の本体に、prj-0001 だけの運用は運用メモに書き足す

## 2. 入力

- 2026-11-12〜13 の型の整備と夜間の実行で、orchestrator が手作業やシェルスクリプトで補った

## 3. 完了条件

- どのプロジェクトでも同じ振る舞いを、`.agents/specdojo-orchestrator.agent.md` に書き足す変更案を作っている。この本体は保護された設定のため executor は変えず、変更案（差分）を個票の対応結果と報告の `handoff` に書く。書き足す知見は次のとおり。
  - 型を整える schedule では、review の段とは別に、型そのもの（rulebook と sample の組）を grade して確かめる。
  - 裏で完了を待つときは、ログの文字列ではなく、終了コードや lock のファイルで判定する。ログを grep で読む場合はバイナリとして扱われないようにする。
  - 実行中の run が残した状態のファイルを、自分の commit に混ぜない。
  - 人の確定のタスクも claim と complete で記録し、確定したら成果物の `status` を ready に上げる。直すために確定を開き直すときは、`exec reopen` してから直す。
  - strategy の YAML を道具で書き直したときは、`task_suffix` などの文字列が数値に変わっていないかを schema のテストで確かめる。
- prj-0001 だけの運用を、[[prj-0001:pm-orchestrator-playbook]] に書き足している。
  - codex 2 本・agy 2 本の並べ方（`providers.<name>.max_concurrency` と `priority`）と、agy-opus と argon の使い分け。
  - 使用量の上限のときの代わり（sol → argon、sol-review → agy-opus-review）。
  - 文書サイトのビルドはメモリを多く使うため、並べた run と重ねない。
  - grade は一度に 1 本しか流せない。
  - 負荷で統合テストが時間切れになったら、手元で同じテストを流し直してから `--resume` する。
  - 0:00 の夜間の routine は、別の run が lock を持っていると skip され、流し直されない。夜に手で長い run を流すときは、routine とぶつからないかを先に確かめる。
  - 夜間の job の中で作られた子の run は、日中の `--resume` で plan が見つからないことがある。その場合の扱い（PJR-50CF が直るまでの回避策）。
- 回避策として書く項目には、直す側の登録簿の項目（PJR-J0VS・ZZVE・KVWH・50CF・97KE・36PW・5QJ5・V0FQ・52EE・5F1Y・7KXW・SW7T）を添え、直ったら消せるようにしている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更（オーケストレーターの本体の変更）を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                                        | 担当         | 状態 | メモ                                                                                                                               |
| --- | ----------------------------------------------------------- | ------------ | ---- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 運用メモを書き足し、本体の変更案を書く                      | executor     | done | 運用メモを追記し、本体の変更案を作成した                                                                                           |
| 2   | 本体の変更案を feature ブランチで反映し、ラッパーを作り直す | orchestrator | open | 本体の `.agents/specdojo-orchestrator.agent.md` は保護された設定のため、orchestrator が feature ブランチで反映しラッパーを作り直す |

## 5. 対応結果

### 5.1. 実施内容

- **運用メモ（[[prj-0001:pm-orchestrator-playbook]]）の更新**:
  - codex 2 本・agy 2 本の並べ方（`providers.<name>.max_concurrency` と `priority`）および親検証の直列制約（`pipeline.parent_validation_concurrency: 1`）を追記した。
  - agy-opus と argon の使い分け（通常は argon を優先し、agy-opus は割り当て上限が長いため priority を下げて限定的に使用）を追記した。
  - 使用量上限時の代替エージェント（sol → argon、sol-review → agy-opus-review）を追記した。
  - 文書サイトのビルド（`npm run docs:build`）のメモリ負荷と並列 run との重複禁止（回避策: [[prj-0001:pjr-v0fq-exec-sequential-batch|PJR-V0FQ]]）を追記した。
  - grade の排他制約（1 本のみ実行可能）と順次実行（回避策: [[prj-0001:pjr-36pw-grade-run-if-busy-wait|PJR-36PW]]、型の一括評価の回避策: [[prj-0001:pjr-sw7t-grade-kata-batch|PJR-SW7T]]）を追記した。
  - 負荷による統合テスト時間切れ時の手動再実行と `--resume`（回避策: [[prj-0001:pjr-52ee-exec-watch-auto-recover|PJR-52EE]]）を追記した。
  - 0:00 の夜間 routine と手動実行 run のロック競合回避（回避策: [[prj-0001:pjr-kvwh-routine-busy-skip-not-retried|PJR-KVWH]]）を追記した。
  - 夜間の job 内の子 run を日中に再開する際の plan 不見・同期の扱い（回避策: [[prj-0001:pjr-50cf-exec-resume-no-sync|PJR-50CF]]、[[prj-0001:pjr-97ke-night-child-run-resume|PJR-97KE]]）を追記した。
  - 再開指示オプション（回避策: [[prj-0001:pjr-5f1y-exec-resume-instruction-option|PJR-5F1Y]]）を追記した。
  - 型整備と評価での注意点（型の個別 grade、recipe/template 手直し段の補填、YAML の数値誤判定防止、個票章本文更新の回避策: [[prj-0001:pjr-zzve-kata-review-grades-deliverable|PJR-ZZVE]]、[[prj-0001:pjr-j0vs-strategy-kata-phases-missing|PJR-J0VS]]、[[prj-0001:pjr-5qj5-schema-validate-yaml-version-mismatch|PJR-5QJ5]]、[[prj-0001:pjr-7kxw-register-update-section-body|PJR-7KXW]]）を追記した。

- **本体（`.agents/specdojo-orchestrator.agent.md`）の変更案**:
  オーケストレーター本体は保護された設定のため直接変更せず、以下の変更案（差分）を作成した。

```diff
diff --git a/.agents/specdojo-orchestrator.agent.md b/.agents/specdojo-orchestrator.agent.md
index 1234567..89abcdef 100644
--- a/.agents/specdojo-orchestrator.agent.md
+++ b/.agents/specdojo-orchestrator.agent.md
@@ -148,6 +148,7 @@ npx specdojo kata eject --id <id>           # 上書きしたいものだけ複
 利用者が規範を変えたいと言った場合にだけ `eject` を提案する。eject したファイルは利用リポジトリの git 管理下に入り、以後そちらが優先される。`exec-template` と `schema` は CLI の版と対応するため eject できない。
+型を整える schedule では、review の段とは別に、型そのもの（rulebook と sample の組）を grade して確かめる。

 ## タスク実行
@@ -164,6 +165,7 @@ npx specdojo exec validate --project <project-id>
 失敗して `waiting` になった場合は、個票の `block_reason` と result の申し送りを読み、原因を特定してから再開する。reporter 段だけの再開は `--resume` で行う。
+人の確定のタスク（decision や manual confirm など）も claim と complete で記録し、確定したら成果物の `status` を ready に上げる。直すために確定を開き直すときは、`exec reopen` してから直す。

 ## 実行の運び方
@@ -167,6 +169,7 @@ npx specdojo exec validate --project <project-id>
 - `exec run --register` は `--worktree` で流す。同時に流すのは 2〜3 件までとする。親の検証は 1 件ずつ順に流れ、並行が多いと負荷で統合テストが時間切れになる。
 - 時間のかかる run は background で流し、終わりの通知を待つ。途中経過を何度も見に行かない。
+- 裏で完了を待つときは、ログの文字列ではなく、終了コードや lock のファイルで判定する。ログを grep で読む場合はバイナリとして扱われないようにする（`-a` オプションを付けるか、終了コードを見る）。
 - grade・`exec run`・build を順に流すときは、待ち合わせのシェルスクリプトを書かず `specdojo exec queue add <queue-id> --step "..."` で予約し、`specdojo exec queue run <queue-id>` を background で流す。進み具合は `exec queue status <queue-id>` か `exec status` の `queues:` で確かめる。止まった予約は原因を直してから同じ `exec queue run` で再開する。
 - プロセスを探す・止めるときに `pkill -f`・`pgrep -f` を使わない。探す文字列を含む自分のシェルにも一致し、自分を止める。
 - 統合の後に `src` が dist より新しくなると、次の run は始まる前に止まる。dist を作り直してから流す。
 - 記帳は `register ... --commit` で行う。登録簿の lifecycle のロックを取るため、実行中の run と取り合わない。
 - 個票の本文を書き換えて普通に commit するのは、統合中の run がないときだけにする（`.git/index.lock` を確かめる）。commit に失敗したら、index に載ったファイルを残さない。残ると次の run の checkpoint が止まる。
+- 実行中の run が残した状態のファイル（`.specdojo/` 配下の実行状態や一時ファイルなど）を、自分の commit に混ぜない。
+- strategy の YAML を道具で書き直したときは、`task_suffix` などの文字列が数値に変わっていないかを schema のテスト（`validate:schema` など）で確かめる。
 - 保護された設定（agent の定義・名簿・`exec-defaults.yaml`・`package.json` など）は、executor が書き換えると統合の前に止まる。register の完了条件では「案を個票の対応結果に書き、pipeline では報告の `handoff` にも書く」と指示する。「案を result に書く」は executor が result を直接書ける実行形式に限る。反映は利用者の承認のもと feature ブランチで行う。
 - プロジェクトの文書にオーケストレーター向けの運用メモがあれば、作業を始める前に読む。
```

### 5.2. 判断と申し送り

- **判断事項**:
  - 本体の変更案の配置先:
    - 「型そのものを grade して確かめる」: 「実践の型（kata）の扱い」の末尾に配置した。
    - 「人の確定タスクの進め方」: 「タスク実行」の末尾に配置した。
    - 「裏での完了判定」「実行中状態ファイルの commit 除外」「strategy YAML の文字列型検証」: 「実行の運び方」に配置した。
      理由: 各項目の対象操作（型管理、タスク確定、実行オペレーション）が対応するセクションと最も親和性が高いため。
  - 回避策の記載方法:
    - 直す側の登録簿項目（PJR-J0VS・ZZVE・KVWH・50CF・97KE・36PW・5QJ5・V0FQ・52EE・5F1Y・7KXW・SW7T）を運用メモ内の各該当箇所に明記し、改修完了時に該当の回避策記述を特定・削除しやすくした。
- **申し送り（handoff）**:
  - 本体の変更案（`.agents/specdojo-orchestrator.agent.md`）は保護された設定のため本タスクでは反映していません。オーケストレーターが利用者の承認のもと feature ブランチで反映し、ラッパーを作り直してください（作業内容 No 2）。

### 5.3. CHANGELOG に書く事項

- 区分: 変更
- 文案: オーケストレーターの本体（`.agents/specdojo-orchestrator.agent.md`）に、型整備での grade 実行、バックグラウンド待機判定、実行中状態ファイルの commit 除外、人の確定タスクの進め方、strategy YAML の型テストに関する知見を追加する変更案を作成しました。また、prj-0001 の運用メモ（`pm-orchestrator-playbook.md`）に並行実行制限、エージェント上限時のフォールバック、夜間ルーチンや再開時の回避策を追記しました。

### 5.4. 残課題

- 本体の変更案（`.agents/specdojo-orchestrator.agent.md`）を orchestrator が feature ブランチで反映し、ラッパーを作り直す（作業内容 No 2）。

## 6. 関連ドキュメント

- [[prj-0001:pm-orchestrator-playbook]]
- [[prj-0001:pjr-j0vs-strategy-kata-phases-missing]]
- [[prj-0001:pjr-zzve-kata-review-grades-deliverable]]
- [[prj-0001:pjr-kvwh-routine-busy-skip-not-retried]]
- [[prj-0001:pjr-50cf-exec-resume-no-sync]]
- [[prj-0001:pjr-97ke-night-child-run-resume]]
- [[prj-0001:pjr-36pw-grade-run-if-busy-wait]]
- [[prj-0001:pjr-5qj5-schema-validate-yaml-version-mismatch]]
- [[prj-0001:pjr-v0fq-exec-sequential-batch]]
- [[prj-0001:pjr-52ee-exec-watch-auto-recover]]
- [[prj-0001:pjr-5f1y-exec-resume-instruction-option]]
- [[prj-0001:pjr-7kxw-register-update-section-body]]
- [[prj-0001:pjr-sw7t-grade-kata-batch]]
