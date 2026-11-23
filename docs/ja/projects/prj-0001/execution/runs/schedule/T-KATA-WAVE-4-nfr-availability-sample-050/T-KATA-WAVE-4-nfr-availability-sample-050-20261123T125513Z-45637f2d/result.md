---
specdojo:
  id: prj-0001:xer-t-kata-wave-4-nfr-availability-sample-050-20261123t125513z-45637f2d
  type: exec-result
  task_id: T-KATA-WAVE-4-nfr-availability-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-4-nfr-availability-sample-050/T-KATA-WAVE-4-nfr-availability-sample-050-20261123T125513Z-45637f2d/plan.md
  started_at: "2026-11-23T12:55:22.182Z"
  completed_at: "2026-11-23T13:05:27.050Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-availability-sample
    - specdojo:nfr-availability-sample
---

# Edit Result

## 1. 実施内容

- 可用性要件の sample (`docs/ja/specdojo/samples/nfr-availability-sample.md`) を、rulebook の構成に従った完成例へと厚く書き直しました。
- 具体的な目標値（稼働率、RTO、RPO）や、ホスティング環境の SLA、代替端末の有無、通信断の頻度などは、決定すべき事項として `_UNDECIDED_` とし、判断の基準となる暫定的な扱いを併記しました。
- frontmatter に `part_of` および `based_on` を追加し、文書間の構造的関係を明示しました。
- 本文中からの rulebook への相対パスによるリンクを削除し、frontmatter による定義へ集約しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-availability-sample.md`: rulebook の必須構成（概要、適用範囲・除外条件、可用性要件一覧、測定・検証方法、関連ドキュメント導線、未決事項）に従って再構成し、駄菓子屋プロジェクトの具体的なコンテキスト（営業時間や障害時の振る舞い）を盛り込んだ完成例として書き直しました。技術的な不確定要素は `_UNDECIDED_` として残しています。

## 3. 申し送り

- 利用者が決める値: `nfr-avl-001` の営業時間内の月間稼働率の目標（%）、`nfr-avl-002` の RTO、`nfr-avl-003` の RPO、ホスティング環境の SLA、タブレット故障時の代替端末の有無、通信断の頻度と店頭での記録方法。sample 内ではいずれも `_UNDECIDED_` とし、opd-index-sample の暫定の扱い（翌営業日の開店までに再開、前日の閉店時点まで戻ることを許す）を併記した。値を決めたら opd-index-sample と opr-backup-restore-sample の同じ値も合わせて直す必要がある。
- 仮置きの値: 営業時間 10:00〜18:00 は opd-index-sample の運用時間帯に揃え、`_ASSUMPTION_` を付けた。`nfr-avl-004` の転記漏れ 0 件と、単一構成で冗長化しないことも `_ASSUMPTION_` とした。
- 直さなかった指摘（PJR-76N9）: F003・F004・F006・F009・F023・F025 は、文書の作成・承認の担当、ready に上げる条件、変更管理の責任者、登録簿への引き継ぎ先を求めるもので、sample-authoring-standard の記述ガイドと PJR-76N9 により本文に足していない。F002 が求める未決事項の判断者の列も同じ理由で入れていない。未決事項の判断者と承認は登録簿の個票で追う。障害時の復旧判断（OPS）と復元の決定（PO）は文書の中身なので本文に書いた。
- rulebook の変更案: 記述ガイドの「可用性要件一覧」「関連ドキュメント導線」は、技術前提の根拠に `dec-*` を書くよう求めているが、dec-sample は deprecated で、決定記録は登録簿の decision（pjr）に移っている。参照先を登録簿の decision または運用方針（opd-index）の該当章に改めることを提案する。
- rulebook の変更案: 「位置づけ」の `sac-*` / `stc-*` に可用性向けの sample がなく、sample 内では `sac-availability`・`stc-availability` をバッククォートで仮置きした。
- 整合の申し送り: 同じ型の `nfr-*` sample（performance・reliability など）はまだ旧来の薄い形のままで、nfr-index-sample にも可用性分冊への導線がない。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ 配下の sample だけで、plan / result / pjr 個票は変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したのは Markdown 1 件だけで、`*.yaml` / `*.yml` の変更がない）

## 4. 進め方と実践の型の適用

rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くしました。具体的には、F001 から F025 までの finding に基づき、概要、適用範囲、要件一覧、検証方法、未決事項の構成を充足させ、具体的な業務コンテキストを組み込んでいます。
