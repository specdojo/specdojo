---
specdojo:
  id: prj-0001:xep-jbr-grade-kata-0514d1283804
  type: exec-plan
  rulebook: none
  task_id: JBR-grade-kata-0514d1283804
  name: "実践の型の品質評価"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: job
  job_id: job-grade-kata
  run_id: JBR-grade-kata-0514d1283804
  owner: ARC
  paths:
    - docs/ja/specdojo/rulebooks
    - docs/ja/specdojo/recipes
    - docs/ja/specdojo/samples
    - docs/ja/specdojo/templates
---

# Job Plan: 実践の型の品質評価

## 1. このRunで行うこと

runner が記録した command evidence の終了コードと、`grade run` の出力（stdout の
`graded:`・`resumed complete:`・`retry exhausted:` の行、stderr の
`grade run incomplete:`・`grade run stopped by rate limit:` に続く文書ごとの行）から
次を判断して報告する。

- 終了コード75（rate limit）または中断で未完了の文書が残っているか。残る場合は同じ
  `--run-id` で再開できる状態かを確認する。
- 失敗した文書があるか。ある場合は agent 側の失敗と、executor の marker を機械変換
  できず拒否したもののいずれかへ切り分ける。
- Run が `partial` の場合は、`graded:` の文書が1件以上あり、失敗した各文書が
  pipeline state に記録されて次の Run の `--incomplete` で選択できるかを確認する。
- `retry exhausted:` の文書があるか。ある場合は `grade state --path` で連続失敗回数を
  確かめ、人手での原因解消または state の再開判断を促す。
- agy 単段の verdict と score の分布に、評価設定の見直しを要する偏りがあるか。

選択された文書が0件の場合は no-op と判断する。判断できない事象は推測で埋めず、
観測した事実と未確認の範囲を分けて報告する。

## 2. Job Run

- `job_id`: job-grade-kata
- `run_id`: JBR-grade-kata-0514d1283804
- `scheduled_at`: 2026-11-19T20:00:00.000Z
- `result`: `docs/ja/projects/prj-0001/execution/runs/job/JBR-grade-kata-0514d1283804/JBR-grade-kata-0514d1283804/result.md`

入力:

```json
{
  "period": "2026-W47",
  "kind": "all",
  "limit": 15,
  "dependency_changed": true,
  "rulebook_changed": true,
  "unreviewed": true,
  "changed_only": true,
  "ungraded": true,
  "incomplete": true,
  "rubric_outdated": true
}
```

## 3. 対象成果物

- -

対象パス:

- `docs/ja/specdojo/rulebooks`
- `docs/ja/specdojo/recipes`
- `docs/ja/specdojo/samples`
- `docs/ja/specdojo/templates`

### 3.1. 決定論的コマンド

runner が次の解決済みコマンドを agent の sandbox 外で直接実行する。

```sh
if npm run build; then
  :
else
  build_status=$?
  printf 'grade prerequisite build failed: exit_code=%s\n' "$build_status" >&2
  exit 1
fi
# 選択は Run ごとに固定する。同じ job_run_id の再試行は、保存した選択で grade run を再開する。
# 選択条件の結果は和集合とし、条件がないときだけ全件を対象にする（precondition と同じ）。
run_dir=logs/grade/jobs/JBR-grade-kata-0514d1283804
mkdir -p "$run_dir"
if [ ! -f "$run_dir/selection.txt" ]; then
  : >"$run_dir/exhausted.txt"
  if [ "true" = "true" ]; then
    # 上限到達の文書は grade run へ渡さず、報告だけにする。
    '/usr/local/bin/node' '/workspaces/specdojo-workspace/specdojo/dist/specdojo.js' grade state --target kata --project prj-0001 --exhausted >"$run_dir/exhausted.txt" || exit 1
  fi
  selection=$(
    if [ "true" = "false" ] && [ "true" = "false" ] && [ "true" = "false" ] && [ "true" = "false" ] && [ "true" = "false" ] && [ "true" = "false" ] && [ "true" = "false" ]; then
      '/usr/local/bin/node' '/workspaces/specdojo-workspace/specdojo/dist/specdojo.js' grade list --target kata --project prj-0001
    else
      if [ "true" = "true" ]; then
        '/usr/local/bin/node' '/workspaces/specdojo-workspace/specdojo/dist/specdojo.js' grade list --target kata --project prj-0001 --dependency-changed || exit $?
      fi
      if [ "true" = "true" ]; then
        '/usr/local/bin/node' '/workspaces/specdojo-workspace/specdojo/dist/specdojo.js' grade list --target kata --project prj-0001 --rulebook-changed || exit $?
      fi
      if [ "true" = "true" ]; then
        '/usr/local/bin/node' '/workspaces/specdojo-workspace/specdojo/dist/specdojo.js' grade list --target kata --project prj-0001 --unreviewed || exit $?
      fi
      if [ "true" = "true" ]; then
        '/usr/local/bin/node' '/workspaces/specdojo-workspace/specdojo/dist/specdojo.js' grade list --target kata --project prj-0001 --changed-only || exit $?
      fi
      if [ "true" = "true" ]; then
        '/usr/local/bin/node' '/workspaces/specdojo-workspace/specdojo/dist/specdojo.js' grade list --target kata --project prj-0001 --ungraded || exit $?
      fi
      if [ "true" = "true" ]; then
        '/usr/local/bin/node' '/workspaces/specdojo-workspace/specdojo/dist/specdojo.js' grade list --target kata --project prj-0001 --incomplete || exit $?
      fi
      if [ "true" = "true" ]; then
        '/usr/local/bin/node' '/workspaces/specdojo-workspace/specdojo/dist/specdojo.js' grade list --target kata --project prj-0001 --rubric-outdated || exit $?
      fi
      cat "$run_dir/exhausted.txt"
    fi
  ) || exit 1
  printf '%s\n' "$selection" | LC_ALL=C sort -u | awk -v kind="all" -v limit="15" '
    NF && (kind == "all" || index($0, "docs/ja/specdojo/" kind "s/") == 1) && (limit == 0 || selected < limit) {
      print
      selected++
    }
  ' >"$run_dir/limited.txt"
  awk 'FILENAME == ARGV[1] { if (NF) exhausted[$0] = 1; next } !($0 in exhausted)' "$run_dir/exhausted.txt" "$run_dir/limited.txt" >"$run_dir/selection.tmp"
  awk 'FILENAME == ARGV[1] { if (NF) exhausted[$0] = 1; next } $0 in exhausted' "$run_dir/exhausted.txt" "$run_dir/limited.txt" >"$run_dir/retry-exhausted.txt"
  mv "$run_dir/selection.tmp" "$run_dir/selection.txt"
fi
while IFS= read -r document; do
  printf 'retry exhausted: %s\n' "$document"
done <"$run_dir/retry-exhausted.txt"
set --
while IFS= read -r document; do
  [ -n "$document" ] && set -- "$@" --path "$document"
done <"$run_dir/selection.txt"
if [ "$#" -eq 0 ]; then
  printf 'grade run: no documents to grade run_id=%s\n' 'JBR-grade-kata-0514d1283804'
  exit 0
fi
# grade run は、完了した文書と失敗した文書が混在すると 2、rate limit で止まると 75 を返す。
if '/usr/local/bin/node' '/workspaces/specdojo-workspace/specdojo/dist/specdojo.js' grade run --run-id JBR-grade-kata-0514d1283804 --target kata --project prj-0001 --kind all --reference-per-kind --by agy-expert-executor "$@"; then
  :
else
  grade_status=$?
  if [ "$grade_status" -eq 2 ]; then
    printf 'grade run partial: run_id=%s exit_code=%s\n' 'JBR-grade-kata-0514d1283804' "$grade_status" >&2
  else
    printf 'grade run failed: run_id=%s exit_code=%s\n' 'JBR-grade-kata-0514d1283804' "$grade_status" >&2
  fi
  exit "$grade_status"
fi
```

コマンドが成功または設定済みの部分成功になった場合、上記の判断を reporter agent が evidence に基づいて行う。

## 4. 完了手順

1. 指示と入力に従って対象成果物を更新する。
2. 必要な整形・静的検査を実行する。
3. resultの必須セクションを記入し、`_TODO_`を残したまま終了しない。

## 5. 異常終了の条件

- 入力不足、対象不明、検査未解消の場合は異常終了する。
- agent自身はJob Runの状態やcheckpointを変更しない。runnerが終了結果を反映する。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
