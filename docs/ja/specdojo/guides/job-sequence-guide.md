---
specdojo:
  id: specdojo:job-sequence-guide
  type: guide
  status: draft
---

# 順次実行 Job の例

Sequential Job Guide

止まった Schedule task の再開 → track の auto ループ → 次の register 項目 → grade → docs build を、runner が順に実行する例です。`docs/ja/specdojo/samples/job-sequence.yaml` を project の `jobs_path` へコピーして使います。値制約と記録形式は [[specdojo:job-definition-standard|Job 定義標準]] を参照してください。

**対象読者**

- exec・grade・検査を夜間などにまとめて順次実行する開発者、運用者

**この文書で分かること**

- 順次実行 Job の定義例、手動・routine / cron からの起動、結果確認と再試行

**次に読む文書**

- [[specdojo:job-definition-standard|Job 定義標準]]
- [[specdojo:routine-operation-guide|routine 運用ガイド]]

## 1. 手動実行

入力の task ID・track・個票・評価対象を、実在する対象へ置き換えます。`schedule_state` は `execution_path` の `generated/state.json` を指し、段の末尾の `exec refresh` で最新状態を生成します。例は SpecDojo 本体の `docs:build` を呼ぶため、別の repository では導入済みの検査へ差し替えます。

```bash
specdojo job validate --project prj-0001
specdojo exec run --project prj-0001 --job job-sequence \
  --input resume_task=T-EXAMPLE-document-020 track=example \
  track_end_task=T-EXAMPLE-document-090 \
  schedule_state=docs/ja/projects/prj-0001/execution/generated/state.json \
  register_item=PJR-XXXX \
  register_ticket=docs/ja/projects/prj-0001/controls/project-register/pjr-xxxx-example.md \
  grade_path=docs/ja/product/example.md --dry-run
```

dry-run で解決済みの段・状態参照先を確かめ、実行時は `--dry-run` を外します。resume と auto は refresh 後の task 状態、register は個票の状態を終了コードに加えて確認します。grade は選択した文書の pipeline が完了しなければ非 0 で終了するため、その終了コードを使います。grade の失敗後も build を試す `on_failure: continue` を例示していますが、Run 全体は失敗のままです。

## 2. routine と cron

同じ Job を routine の `action` で参照します。`rtn-sequence.yaml` を `routines_path` に置き、入力は手動例と同様に対象へ合わせます。運用前に実行対象と agent 設定を確認してください。

```yaml
id: rtn-sequence
name: 夜間の順次実行
enabled: true
trigger:
  cron: "0 1 * * *"
  timezone: Asia/Tokyo
action:
  kind: job
  job: job-sequence
  inputs:
    resume_task: T-EXAMPLE-document-020
    track: example
    track_end_task: T-EXAMPLE-document-090
    schedule_state: docs/ja/projects/prj-0001/execution/generated/state.json
    register_item: PJR-XXXX
    register_ticket: docs/ja/projects/prj-0001/controls/project-register/pjr-xxxx-example.md
    grade_path: docs/ja/product/example.md
policy:
  missed_run: latest
  overlap: skip
```

cron は repository に移動して `routine run --due` を起動するだけです。たとえば5分ごとに `cd /path/to/repository && specdojo routine run --project prj-0001 --due` を呼びます。runner 自身が待機・各段の起動・完了判定を行うので、Claude Code・Codex などの会話機能には依存しません。

## 3. 結果と再試行

Job Run JSON の `attempts[].steps` で成功・失敗・延期、終了コード、理由、各 command evidence 参照を確認します。project lock を取得するまでの上限は定義の3600秒です。grade 独自の lock も `--if-busy wait` で待ちます。grade 段の `timeout_seconds: 7200` は待機と処理を含む実行時間の上限で、超過するとプロセスを停止して延期にします。次回は同じ `job_run_id` による grade の再開を使います。

同じ `--scheduled-at` と入力で再実行すると、失敗した Run の次 attempt で先頭から実行します。完了済み Run の同じ実行枠は重複実行しません。新しい `--scheduled-at` は新規 Run になるため、停止した task の再開条件を確認して入力を変えます。routine 自体の失敗・延期履歴と実行枠の扱いは [[specdojo:routine-operation-guide|routine 運用ガイド]] に従います。
