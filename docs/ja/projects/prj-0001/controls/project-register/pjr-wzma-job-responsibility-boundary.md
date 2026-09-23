---
specdojo:
  id: prj-0001:pjr-wzma-job-responsibility-boundary
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-09-01T12:02:27Z"
  due_on: "2026-09-30"
  completed_at: "2026-09-03T10:07:15Z"
  block_reason: "integrate failed: git add failed: fatal: pathspec 'docs/ja/projects/prj-0001/jobs/job-grade-kata-expert-check.yaml' did not match any files (args: -A -- 19 paths)"
  conclusion: job の責務を判断へ限定し、決定論的な手順を script へ移した。agent は task.agent で構造化して指定する。
---

# PJR-WZMA job の責務を agent への委譲に限定する

## 1. 概要

grade 系 3 つの job の `task.description` を読むと、対象文書の選択、agent の呼び分け、
1 件ごとの `grade apply` 実行、段の順序制御がすべて自然言語で書かれている。判断を要する
記述は一つもなく、実質は日本語で書かれた shell script である。

この構造では agent が手順の解釈にも判断力を使うため、実行するか、引数が正しいかが
agent 依存になる。判断のために確保すべき rate limit を手順の解釈が消費し、301 文書の
ループを 1 セッションが抱えるため中断時の損失も大きい。

job の責務を「agent へ委譲する判断の定義」に限定し、決定論的な手順は script または CLI へ
移す。あわせて agent を nickname で指定できるようにし、選択の揺れをなくす。

## 2. 完了条件

- job の責務境界が standard に明記され、決定論的手順を description へ書かない旨が定まっている。
- job から agent を nickname で指定でき、`capabilities` による間接指定に依存しない。
- grade 系 3 job が新しい責務境界に沿って整理されている。
- `rtn-grade-kata` が整理後の構成で動作する。

## 3. 作業内容

| No  | 作業                                     | 担当 | 状態 | メモ                                          |
| --- | ---------------------------------------- | ---- | ---- | --------------------------------------------- |
| 1   | job の責務境界を standard へ記述する     | ARC  | done | `job-definition-standard` を新設              |
| 2   | job schema へ agent の直接指定を追加する | ARC  | done | `task.agent.executor` / `task.agent.reporter` |
| 3   | grade 系 3 job を整理する                | ARC  | done | 1 job へ統合し script の入口を呼ぶ            |
| 4   | `rtn-grade-kata` を追従させる            | ARC  | done | 単一 action へ変更                            |

## 4. 対応結果

- job の責務境界を `[[specdojo:job-definition-standard]]` として新設した。判断と手順の切り分け基準、`task.description` の規約、agent 指名の規約、粒度と禁止事項を判定可能な形で定義し、決定論的手順を description へ書かないことを規範とした。
- `job.schema.yaml` と `job validate` に `task.agent` を追加した。`executor` を必須、`reporter` を任意とする mapping で、nickname は `pm-members.yaml` と同じ書式に限定し、未知のキーは typo による reporter 欠落を防ぐため拒否する。
- `capabilities` による間接指定に依存できない理由を実装から確認した。auto 選択は stage_role を持たない member だけを候補にするが、本プロジェクトの roster は全 agent が stage_role を持つため、指名なしの Job Run は候補 0 件で解決できない。
- `exec run --job` を、executor と reporter の双方を指名した場合に register 項目と同じ executor/reporter pipeline で実行するようにした。result は reporter が書き、evidence と pipeline state は既存の `exec/evidence/<taskId>/<runId>/` 形式へ記録する。reporter 未指名時は従来の単一 agent 実行を維持する。
- grade 系 3 job を `job-grade-kata` 1 件へ統合した。段の順序・対象の選択・`grade apply` の逐次実行は `tools/grade/run-per-document.sh`（[[prj-0001:pjr-excv-grade-per-document-pipeline]]）の責務とし、job は入口の1回起動と、未完了段・失敗の切り分け・3段目スキップ理由・閾値見直し要否の判断だけを委譲する。`job-grade-kata-local-confirmation` と `job-grade-kata-expert-check` は削除した。
- `rtn-grade-kata` を単一 action へ変更した。再開キーに使う値は script の `--run-id` 書式（`^[A-Za-z0-9._-]+$`）を満たす必要があるため、記号を含む `scheduled_at` ではなく `{{scheduled_at | iso_week}}` の `period` を入力にした。
- 検証は `job validate`（3 件 0 エラー）、`routine validate`（6 件 0 エラー）、`exec run --job job-grade-kata --dry-run`（executor `claude-expert-executor` / reporter `claude-reporter` を解決）、`routine run --id rtn-grade-kata --dry-run`（`--input period=2026-W36` を解決）で行った。
- 残課題は次の2点である。1つ目は、VitePress の sidebar（`.vitepress/sidebar-config.ts`）へ新標準の項目を追加できていないこと。実行環境の書き込み範囲外のため未反映で、人手での追加が要る。2つ目は、統合後の `job-grade-kata` を実 agent で通した所要時間と rate limit の実測で、これは [[prj-0001:pjr-excv-grade-per-document-pipeline]] の残課題と同じ測定に含まれる。

- 受け入れ時に orchestrator が、job の description から決定論的な手順が消え、script 1行の実行と
  結果の判断だけが残っていることを確認した。agent の指定は `task.agent.executor` /
  `task.agent.reporter` として構造化され、自然言語からの解釈に依存しない。routine も3段の配列
  action から単一 job へ整理されている。
- 統合は本項目の実装とは別の欠陥で2度失敗した。1度目と2度目は executor が rate limit で中断し、
  3度目は削除ファイルを含む変更を統合できない欠陥に当たった。後者は
  [[prj-0001:pjr-reds-integrate-staged-deletion]] として分離し、修正後に `--resume` で統合段から
  再開して完了した。本項目の成果物自体に問題はない。
- validate:schema、typecheck、lint:ts、単体テスト1356件の通過を確認した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-excv-grade-per-document-pipeline]]: 手順の移し先。
- [[prj-0001:pjr-ta5c-agent-run-primitive]]: 手順を script 化するための primitive。
- [[prj-0001:pjr-ga2k-routine-sequential-actions]]: routine の順次実行。
