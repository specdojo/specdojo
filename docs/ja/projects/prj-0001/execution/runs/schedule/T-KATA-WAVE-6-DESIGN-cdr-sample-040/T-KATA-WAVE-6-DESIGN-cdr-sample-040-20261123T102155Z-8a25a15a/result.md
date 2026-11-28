---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-design-cdr-sample-040-20261123t102155z-8a25a15a
  type: exec-result
  task_id: T-KATA-WAVE-6-DESIGN-cdr-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-DESIGN-cdr-sample-040/T-KATA-WAVE-6-DESIGN-cdr-sample-040-20261123T102155Z-8a25a15a/plan.md
  started_at: "2026-11-23T10:22:04.430Z"
  completed_at: "2026-11-23T10:34:14.966Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:cdr-sample
    - specdojo:cdr-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook である `docs/ja/specdojo/rulebooks/cdr-rulebook.md` を更新しました。
- F001 に基づき、Frontmatter の検証方法（`validate:catalog` 等）と合格条件についての記述を追加しました。
- F004 に基づき、既存規約を新しい規約で置き換える場面（`supersedes`）における適用場面の明記と、用語をメタ情報標準の「改訂・廃止」に統一しました。
- F002 および F003 に関しては、判断の基準となる記述を追加しましたが、sample や template 自体の変更は次段で行うため、本段では rulebook の更新に留めています。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/cdr-rulebook.md`: Frontmatter の検証手段と合格条件に関する記述の追加、および規約の差し替え適用場面における用語の統一と説明の補足を行いました。

## 3. 申し送り

- F002: `cdr-sample` の基本方針「金額は円単位の整数で扱う」と禁止事項「金額を浮動小数点で計算する」が重なっている。モジュールと import の章の `src/server/` 配置と禁止事項「クライアントコンポーネントから DB 接続を import する」も同じ。sample の段で、どちらも本文か禁止事項の一方へ寄せる。
- F003: `cdr-template` の `型` の章のコメントを rulebook の省略条件に合わせる。動的型の言語で型ヒントも使わない場合に限り削除して理由を書き、型ヒントを使う場合は章を残して型ヒントの方針を書く、という内容にする。template の段で対応する。
- result の『直さなかった箇所と理由』: 上記以外の記述は grade の指摘がなく、冗長な記述やほかの型との重なりも見つからなかったため変更していない。
- 適用外の検証: `npm run validate:catalog`（変更したのは docs/ja/specdojo/rulebooks/ だけで、docs/ja/projects/ に届く変更がない）
- 適用外の検証: `npm run validate:history-links`（plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

F001 および F004 の指摘を解消するため、`docs/ja/specdojo/rulebooks/cdr-rulebook.md` を編集しました。F002 および F003 に関しては、rulebook 側の判断基準の更新を行っていますが、対象となる sample や template の修正は本タスクの範囲外であるため、次段の作業として残しています。
