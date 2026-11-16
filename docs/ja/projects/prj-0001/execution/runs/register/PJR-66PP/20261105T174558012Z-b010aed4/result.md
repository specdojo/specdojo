---
specdojo:
  id: prj-0001:xer-pjr-66pp-20261105t174558z-47ef0781
  type: exec-result
  task_id: PJR-66PP
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-66PP/20261105T174558012Z-b010aed4/plan.md
  started_at: "2026-11-05T17:46:07.800Z"
  completed_at: "2026-11-05T17:55:48.755Z"
  agent: sol-executor
  approach: fully-guided
  targets:
    - prj-0001:stsd-job-run
---

# Edit Result

## 1. 実施内容

- stsd-job-run の冒頭構成を「1. 目的」「2. 適用範囲」に再編し、既存の「概要」の内容を適切に分配しました。
- 状態遷移図の各状態の表示名を、`状態名&lt;br&gt;値` の形式（値がある場合）または `状態名` の形式（値が `-` の場合）に更新し、状態一覧の値と一致させました。
- 章構成の変更に伴い、本文中の章参照を新しい章タイトルに基づいて修正しました。
- 内容の削除や統合は行わず、既存の情報を保持したまま構成を変更しました。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/020-data-model/stsd-job-run.md`: 冒頭の「概要」を「目的」と「適用範囲」に分割して再構成し、状態遷移図の表示名を定義された形式（2行表示）に更新しました。また、章番号変更に伴う本文中の参照を修正しました。

## 3. 申し送り

- reporter の「進め方と実践の型の適用」へ記録: stsd-rulebook を章構成、stsd-mermaid-rulebook を表示名の基準とし、stsd-recipe の頭書き・目的・適用範囲の分離に従った。stsd-sample は新設する冒頭構成と2行表示の形式だけを参照した。実践の型の欠落・矛盾はない。template は fully-guided の指定により参照していない。
- 参照資料: 対象成果物、指定された rulebook 2件・recipe・sample、prj-overview、共通規約2件、AGENTS.md と運用 playbook、実装エビデンスの src/job/definition.ts と src/job/job.ts。検査判断のため package.json・.specdojo/specdojo.config.json・lefthook.yml を確認した。`based_on` は空、`bdd-job-run` は plan で未作成と明示されており内容を推測していない。未宣言のプロジェクト文書・呼出元実装・テスト・外部情報は参照していない。
- 変更根拠: 旧概要の利用者・利用目的を「目的」、対象・AS-IS・管理場所・境界・継続管理・実装根拠を「適用範囲」へ移した。頭書きは既存主題の要約。後続章と小見出しを改番し、7か所の状態宣言へ状態一覧と同じ値を追加した。本文の章参照は既にタイトル形式。内容の削除・統合はない。読み取り専用の比較で frontmatter・全表・全遷移行の一致、旧概要の全内容の保持、5状態・7遷移・共有状態の表示一致を確認した。`_CONTEXT_:` はない。対象成果物以外は編集せず、result・grade result・runner 管理ファイルも更新していない。
- F001 未解消: 調査担当と確認時点を確定する根拠がなく、既存の決定者・決定時期を保持した。次のアクションは、人間が呼出元調査の担当を割り当て、調査完了と本書承認レビューを確認時点として合意すること。
- F002・F005 未解消: 未作成の `bdd-job-run` と未確認の呼出元に依存するため、結果選択・受入条件・境界事例を断定できない。内容保持条件に従い T-02〜T-05 を変更していない。次のアクションは BA・PO・QE による呼出元調査と業務データ辞書の策定後、command・agent・reporter・review の観測事実から結果を選ぶ判断表と代表的な境界事例を合意すること。
- F003 未解消: 呼出元とテストは参照許可された実装エビデンスに含まれず、互換性への影響を検証できない。finding が示す src/exec/run/job.ts と tests/src/job/job.test.ts を次回の参照範囲へ追加し、結果訂正・完了元制限・結果選択の方針と回帰期待を確認する。これらのパスは finding の記載であり実在・内容を独自確認していない。
- F004 未解消: 検査コマンドの追加は今回の冒頭・表示名変更の範囲を超えるため本文へ追記していない。今回必要な `npm run -s lint:md`・`npm run -s lint:fm`・`npm run -s lint:mermaid` は親 runner の実行対象であり、期待結果はすべて終了コード0。対象限定の Job Run テストコマンドは未宣言のテスト・設定を調査できず確定していないため、次回の参照範囲を追加してコマンドと成功条件を確定する。
- F006 未解消: 生存確認・再試行の許可条件・残留試行の扱いに承認根拠がなく、T-07 の条件追加は内容保持条件に反する。次のアクションは PO・運用担当・ARC が運用境界と判断責任を合意し、合意までの利用制限を決めること。本編集は T-07 の安全性や運用利用を承認するものではない。
- 適用外の検証: `npm run validate:schema:file`（executor の変更は Markdown 成果物1件のみで、YAML の変更がない。）
- 適用外の検証: `npm run validate:catalog`（executor が変更した成果物は docs/ja/product/ 配下であり、docs/ja/projects/ 配下への変更がない。）
- 適用外の検証: `npm run validate:history-links`（executor は登録簿の履歴ファイル、既存 plan、result を変更していない。）

## 4. 進め方と実践の型の適用

stsd-rulebook を章構成の基準とし、stsd-recipe に基づいて「目的」「適用範囲」への分割を行いました。また、stsd-mermaid-rulebook に従い、状態遷移図の表示名を「状態名&lt;br&gt;値」の形式に更新しました。既存の「概要」から情報を適切に移行し、内容の欠落がないことを確認しました。
