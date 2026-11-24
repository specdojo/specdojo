---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-notation-cnd-sample-060-20261123t075424z-310fbc23
  type: exec-result
  task_id: T-KATA-WAVE-6-NOTATION-cnd-sample-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-NOTATION-cnd-sample-060/T-KATA-WAVE-6-NOTATION-cnd-sample-060-20261123T075424Z-310fbc23/plan.md
  started_at: "2026-11-23T07:54:40.215Z"
  completed_at: "2026-11-23T08:11:21.689Z"
  agent: opus-executor
  execution: agent
  approach: template-maintenance
  targets:
    - specdojo:cnd-sample
    - specdojo:cnd-template
---

# Edit Result

## 1. 実施内容

- rulebook に基づき、`docs/ja/specdojo/templates/cnd-template.md` を更新し、template の構造を整備しました。
- 具体的な修正内容は以下の通りです：
- 「技術前提・制約」のセクションに、配置設計に必要な入力のうち未確定なものを記述する欄を追加しました (F001)。
- 「コンテナ間・外部依存の検証対象」のコメントに、図と表を照合し描画を確認する旨の参照を追加しました (F002)。
- 検証対象表の前に、結果を Pass / Fail / 未判定 のいずれかで判定する `_TODO_` を追加しました (F003)。
- 「仮定は `_ASSUMPTION_` : とし」という記述について、表示上の整合性を保つために `_ASSUMPTION_:` をインラインコードで囲むように修正しました (F005)。
- なお、F004 に関しては、sample に含まれる Person 表の列（「判断・確認の責務」）が template に存在しないため、template は変更せず、sample 側の修正として申し送りました。

## 2. 変更ファイル

- `docs/ja/specdojo/templates/cnd-template.md`: rulebook の要件を満たすよう、技術前提の入力欄、検証手順の `_TODO_`、および判定条件の `_TODO_` を追加し、`_ASSUMPTION_:` の書式を整形しました。

## 3. 申し送り

- F004: 現在の sample で template にない担当ロール系の列は、Person 表の「判断・確認の責務」だけである（主確認ロール・担当ロールの列は見当たらない）。rulebook の「本文要件」は表の列を template が正本と定め、PJR-76N9 は役割の割り当て欄を置かないと決めている。このため template の列は変えていない。sample の Person 表からこの列を外し、必要な内容を表の後の補足文へ移す見直しを、sample 側の後続タスクで行う必要がある。
- 適用外の検証: `npm run validate:history-links`（変更したのは template だけで、履歴蓄積ファイル（plan / result / 個票）は変更していない）

## 4. 進め方と実践の型の適用

template を rulebook の規定に合わせて整備しました。技術的な前提条件の入力、検証手順の照合、および判定基準の定義に関する `_TODO_` を追加し、文中の書式指定を修正しています。F004 の finding については、template の責務を維持するために変更を行わず、sample 側の修正事項として扱っています。
