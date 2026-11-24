---
specdojo:
  id: prj-0001:xer-t-kata-wave-4-nfr-security-safety-sample-050-20261123t131429z-034e7759
  type: exec-result
  task_id: T-KATA-WAVE-4-nfr-security-safety-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-4-nfr-security-safety-sample-050/T-KATA-WAVE-4-nfr-security-safety-sample-050-20261123T131429Z-034e7759/plan.md
  started_at: "2026-11-23T13:14:37.470Z"
  completed_at: "2026-11-23T13:34:08.828Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-security-safety-sample
    - specdojo:nfr-security-safety-sample
---

# Edit Result

## 1. 実施内容

- 既存の `nfr-security-safety-sample.md` を、rulebook の規定する 6 章構成に従って「駄菓子屋きぬや」の完成例として再構成しました。
- 対象システムの概要（保護対象と目的）、権限区分を含む主体ごとの権限表、および 12 個のセキュリティ要件（`nfr-sec-001`〜`012`）とそれぞれの判定基準を具体化しました。
- finding で指摘された「不明瞭なスコープ」「抽象的なトピックリスト」「検証可能性の欠如」を解消し、実案件適用時に具体的な値（脆弱性の修正期限など）を決定できるよう `_UNDECIDED_` を用いて記述しました。
- frontmatter に `part_of` および `based_on` を追加し、文書の体系的な位置付けを明示するとともに、H1 の relative path による参照を ID ベースの参照へ修正しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-security-safety-sample.md`: rulebook の順序固定構成（概要、要件一覧、測定と検証、例外運用、関連導線）に従い、駄菓子屋の販売管理システムに関する具体的なセキュリティ・安全性要件の完成例として記述を大幅に拡充・整理しました。

## 3. 申し送り

- F004・F005・F007・F024 と、F003・F006・F014 の責任者・役割を求める部分は、文書の役割の割り当て・承認・報告先を本文へ書くよう求めている。PJR-76N9 と sample-authoring-standard の記述ガイドが禁じているため本文には足さなかった。下流との依存は関連ドキュメント導線の表で示している。rulebook 側の変更案: 例外運用の `承認者` 列は例外を認める業務上の権限者であり、文書の承認とは別だと sample でも読み取れるよう、rulebook の記述ガイドの例を維持する（変更は不要）。
- 利用者が決める値: `nfr-sec-012` の脆弱性の修正期限（CVSS 7.0 以上を公表から何日以内に直すか）を `_UNDECIDED_` のままにした。決めたら nfr-index sample の機密性の行と `sac-store-sales` の基準もそろえる。
- `nfr-sec-ex-001` は記入例として、自動ログアウトを 20 分に緩める例外を置いた（期限は初期リリースの 30 日後、承認者は店主代表）。opd-access-control sample の 10 分と食い違う例外になるため、例として残すか「なし」や別の例に替えるかを判断してほしい。
- 主体の表で opd-access-control sample にない要素として、店番の「顧客情報の出力」の不許可と「本部連携（外部システム）」の行を足した。運用方針の sample に反映するかを判断してほしい。
- `sac-store-sales` と opr-access-control の手順は sample が未作成または未整備のため、バッククォートで仮置きした。opr-access-control-sample は役割名（Ops Lead 等）が共通サンプル文脈と合っておらず、作り直しの候補。同じ型の nfr-integrity・maintainability・operations・performance・reliability・usability の 6 本も旧来の最小サンプルのまま。
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイル（plan・result・個票）を変更していないため）

## 4. 進め方と実践の型の適用

rulebook の規定する 6 章構成に基づき、既存の sample を「駄菓子屋きぬや」の具体的なビジネス文脈に沿った完成例へと拡充しました。finding で指摘された、スコープの曖昧さ、トピックの抽象性、検証可能性の欠如を、具体的な権限表や要件（成果物 ID 付き）の導入によって解消しています。また、未決定の事項については `_UNDECIDED_` を用いることで、将来的な具体化を促す形式を維持しています。
