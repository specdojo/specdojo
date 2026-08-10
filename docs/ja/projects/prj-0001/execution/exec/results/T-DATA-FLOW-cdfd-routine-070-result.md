---
specdojo:
  id: prj-0001:xer-t-data-flow-cdfd-routine-070
  type: exec-result
  task_id: T-DATA-FLOW-cdfd-routine-070
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-DATA-FLOW-cdfd-routine-070-plan.md
  started_at: "2026-08-10T00:06:19.386Z"
  completed_at: "2026-08-10T00:09:07.044Z"
  agent: codex-edit-agent
  execution: agent
  approach: fully-guided
  targets:
    - prj-0001:cdfd-routine
---

# Edit Result

## 1. 実施内容

既存の定期運用 CDFD を、指定された rulebook・recipe、先行 CDFD およびプロジェクト概要に照らして確認した。表と図のプロセス ID、起点イベント、入出力、データストア、主要例外、領域外委譲および受入条件は整合していたため、図で `P-05-08` へ渡している Job Run 集約結果を、同プロセスの一覧上の主要入力にも明記した。これにより、register / Schedule / exec-cycle / Job の全委譲経路が、表と図の双方で routine 結果反映へ追跡できる。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/010-data-flow/cdfd-routine.md`
- `docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-routine-070-result.md`

## 3. 申し送り

未決事項として既に記録されている routine lock と `policy.overlap: skip` の適用差、試行記録と `last_result` の復旧規則、Job Run の `noop` 判定条件は、実装・運用方針を決める後続の判断対象として維持した。

## 4. 進め方と実践の型の適用

fully-guided として、`specdojo:cdfd-rulebook` を本文構成、プロセス一覧と図の一対一対応、例外・委譲・受入条件の確認基準に用いた。併せて `specdojo:cdfd-mermaid-rulebook` をノード形状、情報エッジのラベル、凡例の確認に適用し、`specdojo:cdfd-recipe` の起点から完了までの追跡、条件付き経路、表と図の対応確認の問いに沿って既存記述を確認した。いずれも基準として十分な内容であり、欠落・薄い実践の型の補完は不要だった。sample / template は plan の指示に従い参照していない。

内容根拠として、depends_on の [[prj-0001:cdfd-register-operation|概念データフロー図（登録簿ライフサイクル）]] から個票 Frontmatter 正本と項目別 `review` / `waiting` の返却、[[prj-0001:cdfd-task-execution|概念データフロー図（タスク実行ライフサイクル）]] から project busy、block、再開時刻待ちと cycle 結果の委譲境界を確認した。プロジェクト概要は、共有可能な正本と役割分担により継続・継承を支えるという判断軸だけを本文の利用場面・担当記述との整合確認に用い、frontmatter の `based_on` には追加していない。参照範囲外の文書は追加で参照していない。

既存記述は保持し、図に存在する Job Run 集約結果が `P-05-08` の表の主要入力にない不整合だけを最小限補正した。参照文書間で rulebook を正として解く必要がある矛盾は検出しなかった。
