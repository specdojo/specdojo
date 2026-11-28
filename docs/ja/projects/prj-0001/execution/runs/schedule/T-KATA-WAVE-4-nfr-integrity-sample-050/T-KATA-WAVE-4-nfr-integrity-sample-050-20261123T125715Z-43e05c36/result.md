---
specdojo:
  id: prj-0001:xer-t-kata-wave-4-nfr-integrity-sample-050-20261123t125715z-43e05c36
  type: exec-result
  task_id: T-KATA-WAVE-4-nfr-integrity-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-4-nfr-integrity-sample-050/T-KATA-WAVE-4-nfr-integrity-sample-050-20261123T125715Z-43e05c36/plan.md
  started_at: "2026-11-23T12:57:22.590Z"
  completed_at: "2026-11-23T13:16:39.702Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-integrity-sample
    - specdojo:nfr-integrity-sample
---

# Edit Result

## 1. 実施内容

- sample を rulebook の構成（5章構成）に従って再構成し、駄菓子屋きぬやの業務シナリオに基づいた具体的な完成例へ更新しました。
- frontmatter に `part_of: specdoho:nfr-index-sample` を追加し、H1 タイトルを rulebook への相対リンクから平文のタイトルへ変更して、rulebook の構成との不整合を解消しました。
- 重要記録（販売記録・在庫数・つけ残高）ごとの整合性境界、除外条件、および監査証跡の保持期間（7年）と必須項目を明記しました。
- 要件（`nfr-int-001`〜`nfr-int-006`）に対し、具体的な測定手段、判定タイミング、合否条件、および判定に使用する `Role code` を定義しました。
- 重複していたセクションや、独自の「未解決事項」章を削除し、意思決定が必要な事項は `_UNDECIDED_` を用いて本文内に明示しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-integrity-sample.md`: rulebook の 5 章構成（概要、適用範囲、要件一覧、検証方法、導線）に従って再構成しました。駄菓子屋きぬやの業務データを用いた具体的な完全性要件（整合性境界、監査証跡の保持基準、要件ごとの検証方法と判定基準）を記述し、未決定事項を `_UNDECIDED_` として残しています。また、frontmatter に `part_of` を追加し、構造的な整合性を高めました。

## 3. 申し送り

- 未決（利用者の判断が必要）: 監査証跡の保持期間 7 年の根拠は、青色申告の帳簿保存期間とする `_ASSUMPTION_` として本文に書いた。根拠にする規程文書がまだないため `based_on` は空のまま。根拠文書を決めたら `based_on` に追加する。
- 未決（利用者の判断が必要）: 端末の障害中に紙へ記録した販売を復旧後にどう入力し、いつから整合性境界の対象にするかを、オフライン時の運用方針と合わせて決める必要がある（本文に `_UNDECIDED_` として記載）。
- 未決（利用者の判断が必要）: 整合性チェックを閉店後に自動で実行するか、店番が操作して実行するかを `opd-integrity-check` で決める必要がある（本文に `_UNDECIDED_` として記載）。
- PJR-76N9 に従い、F003（PO の承認判断に必要な意思決定者・選択肢）、F004（作業単位・Role 割り当て）、F006（未解決事項の転送先と Role）、F023（ready 昇格の条件）のうち、文書の役割割り当てや承認の進み具合を求める部分は sample に書いていない。未決事項は本文の `_UNDECIDED_` と、要件ごとの判定 Role code・違反時の記録先で表した。
- rulebook の変更案: 「全体方針」の `_UNDECIDED_` に「sample は本文構成の5章に揃っていない」とあるが、今回の改訂で5章に揃ったため、この記述を更新し、NFR 分冊で共通の template にできるかの判断だけを残すとよい。
- rulebook の変更案: 「推奨 Frontmatter 項目」は `part_of` に `nfr-index` を置くとしているが、sample では存在する doc id として `specdojo:nfr-index-sample` を置いた。sample での書き方を rulebook に一文添えるとよい。
- 参照先の `sac-integrity` / `stc-integrity` / `opd-integrity-check` / `opr-integrity-check` / `nfr-security-safety` は存在しないため、wikilink にせずバッククォートで仮置きした。
- 未決（利用者の判断が必要）: 監査証跡の保持期間7年の根拠は、青色申告の帳簿保存期間とする `_ASSUMPTION_` として本文に書いた。根拠にする規程文書がまだないため `based_on` は空のまま。根拠文書を決めたら `based_on` に追加する。
- 未決（利用者の判断が必要）: 端末の障害中に紙へ記録した販売を復旧後にどう入力し、いつから整合性境界の対象にするかを、オフライン時の運用方針と合わせて決める必要がある（本文に `_UNDECIDED_` として記載）。
- 未決（利用者の判断が必要）: 整合性チェックを閉店後に自動で実行するか、店番が操作して実行するかを `opd-integrity-check` で決める必要がある（本文に `_UNDECIDED_` として記載）。
- PJR-76N9 に従い、F003（PO の承認判断に必要な意思決定者・選択肢）、F004（作業単位・Role 割り当て）、F006（未解決事項の転送先と Role）、F023（ready 昇格の条件）のうち、文書の役割割り当てや承認の進み具合を求める部分は sample に書いていない。未決事項は本文の `_UNDECIDED_` と、要件ごとの判定 Role code・違反時の記録先で表した。
- rulebook の変更案: 「全体方針」の `_UNDECIDED_` に「sample は本文構成の5章に揃っていない」とあるが、今回の改訂で5章に揃ったため、この記述を更新し、NFR 分冊で共通の template にできるかの判断だけを残すとよい。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ 配下の sample だけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

rulebook の指示に基づき、成果物（sample）を共通サンプル文脈（駄菓子屋きぬや）の完成例として厚くする作業を行いました。findings で指摘された rulebook の構成不整合（5章構成の欠落、frontmatter の `part_of` 不足など）を解消し、具体的な要件、検証方法、技術的制約（監査証跡の保持基準など）を埋め込むことで、一人でも活用可能な「完成例」としての品質を目指しました。
