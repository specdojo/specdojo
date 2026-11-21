---
specdojo:
  id: prj-0001:xep-jbr-grade-kata-5aef174f1ae5
  type: exec-plan
  rulebook: none
  task_id: JBR-grade-kata-5aef174f1ae5
  name: "実践の型の品質評価"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: job
  job_id: job-grade-kata
  run_id: JBR-grade-kata-5aef174f1ae5
  owner: ARC
  paths:
    - docs/ja/specdojo/rulebooks
    - docs/ja/specdojo/recipes
    - docs/ja/specdojo/samples
    - docs/ja/specdojo/templates
---

# Job Plan: 実践の型の品質評価

## 1. このRunで行うこと

runner が記録した command evidence の終了コードと、stdout に出力された
`results.tsv` から次を判断して報告する。

- 終了コード75（rate limit）または中断で未完了の段が残っているか。残る場合は同じ
  `--run-id` で再開できる状態かを確認する。
- `failed` の段があるか。ある場合は rate limit、agent 側の失敗、`grade apply` が
  executor の marker を機械変換できず拒否したもの（executor を1回再実行しても
  解消しなかったもの）のいずれかへ切り分ける。
- Run が `partial` の場合は、`passed` の文書が1件以上あり、各 `failed` の文書と
  失敗段が pipeline state に記録されて次の Run の `--incomplete` で選択できるかを確認する。
- `retry_exhausted` の文書があるか。ある場合は失敗段と連続失敗回数を示し、人手での
  原因解消または state の再開判断を促す。
- agy 単段の verdict と score の分布に、評価設定の見直しを要する偏りがあるか。

選択された文書が0件の場合は no-op と判断する。判断できない事象は推測で埋めず、
観測した事実と未確認の範囲を分けて報告する。

## 2. Job Run

- `job_id`: job-grade-kata
- `run_id`: JBR-grade-kata-5aef174f1ae5
- `scheduled_at`: 2026-11-10T20:00:00.000Z
- `result`: `docs/ja/projects/prj-0001/execution/runs/job/JBR-grade-kata-5aef174f1ae5/JBR-grade-kata-5aef174f1ae5/result.md`

入力:

```json
{
  "period": "2026-W46",
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
if tools/grade/run-per-document.sh --run-id JBR-grade-kata-5aef174f1ae5 --stages 1 --stage-1-executor agy-expert-executor --kind all --limit 15 --dependency-changed=true --rulebook-changed=true --unreviewed=true --changed-only=true --ungraded=true --incomplete=true --rubric-outdated=true; then
  cat logs/grade/runs/per-document/JBR-grade-kata-5aef174f1ae5/results.tsv
else
  grade_status=$?
  cat logs/grade/runs/per-document/JBR-grade-kata-5aef174f1ae5/results.tsv
  if [ "$grade_status" -eq 2 ]; then
    printf 'grade pipeline partial: run_id=%s exit_code=%s\n' 'JBR-grade-kata-5aef174f1ae5' "$grade_status" >&2
  else
    printf 'grade pipeline failed: run_id=%s exit_code=%s\n' 'JBR-grade-kata-5aef174f1ae5' "$grade_status" >&2
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

`共通規約 sha256:7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b` `docs/ja/projects/prj-0001/execution/conventions/7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b.txt`
