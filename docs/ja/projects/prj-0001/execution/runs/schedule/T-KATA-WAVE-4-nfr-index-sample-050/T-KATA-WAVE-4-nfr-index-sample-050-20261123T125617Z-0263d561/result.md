---
specdojo:
  id: prj-0001:xer-t-kata-wave-4-nfr-index-sample-050-20261123t125617z-0263d561
  type: exec-result
  task_id: T-KATA-WAVE-4-nfr-index-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-4-nfr-index-sample-050/T-KATA-WAVE-4-nfr-index-sample-050-20261123T125617Z-0263d561/plan.md
  started_at: "2026-11-23T12:56:24.776Z"
  completed_at: "2026-11-23T13:10:48.338Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-index-sample
    - specdojo:nfr-index-sample
---

# Edit Result

## 1. 実施内容

- nfr-index-sample.md を `rulebook` の本文要件（5章構成）に沿った、駄菓子屋きぬやの完成例として全面改訂しました。
- 8カテゴリそれぞれの目的と代表指標、分冊 ID、および各カテゴリにおける検証・運用導線（`sac-*`, `stc-*`, `opd-*`, `opr-*`, `dec-*`）を具体的に記載しました。
- 変更の入口（追加・変更・統合・分割・改定）に関する記述を追加し、`based_on` による根拠の明示を行いました。
- 利用者が決定すべき目標値については、`_UNDECIDED_` を用いて記載し、実例としての厚みを確保しています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-index-sample.md`: `rulebook` の第5章で定義された構成（1.概要〜5.関連導線）に従い、8カテゴリの目的・代表指標、分冊の参照先、および変更の入口、カテゴリ別の導線表を盛り込んだ具体的な完成例へ更新しました。また、`based_on` を追加して NFR 策定の根拠を明示しました。

## 3. 申し送り

- PJR-76N9 と `sample-authoring-standard` の決まりにより、F003・F005・F009・F014・F023・F024 が求める担当ロール、報告先、レビュアー・合意者、ready の条件、問い合わせ窓口、lint/schema の検証コマンドは本文に足していない。F014 は `rulebook` の『共通の運用』でも成果物の業務の検証から除外されている。合わせて直す点として、これらの `viewpoint` が kata の sample に役割・承認の記述を求めないよう判定根拠の見直しを提案する。
- F002・F004: `rulebook` の本文要件は見出しを5章に固定しており未決事項の章がないため、未定の値は分冊一覧の備考に `_UNDECIDED_` で示した。`rulebook` の変更案として、未決の目標値の扱い（分冊一覧の備考に書くか、登録簿へ引き継ぐか）を『分冊ドキュメント一覧』の記述ガイドに1行足すことを提案する。
- 利用者が決める必要のある値（`_UNDECIDED_` で残した値）: 営業時間内の稼働率の目標、RTO・RPO（可用性）、会計確定の応答時間の目標（性能）、営業時間外の緊急連絡手段（運用）、オフライン時の記録方法（判断記録 `dec-offline-recording`）。いずれも `opd-index-sample` の未決事項と揃えている。
- `sac-store-sales` と `dec-offline-recording` はこの sample のために置いた架空の ID である。`sac-sample` には条件 ID がなく、`dec-sample` は非推奨のため。`stc-cash-sale`・`stc-sale-hold`・`stc-record-recovery` は `stc-index-sample` の term に揃えた。
- 8つのカテゴリ別 sample（`nfr-reliability-sample` など）はまだ薄い旧形式のままで、本書の代表指標と整合していない。後続の型タスクで、本書のカテゴリ一覧の代表指標に揃えて厚くする必要がある。
- `rulebook` の変更案: 本文要件の『分冊ドキュメント一覧』は ID と参照先の列を要求しているが、参照先の基準ディレクトリ（`docs/ja/product/060-non-functional-requirements/` からの相対か、リポジトリ相対か）を明記するとよい。
- PJR-76N9 と sample-authoring-standard の決まりにより、F003・F005・F009・F014・F023・F024 が求める担当ロール、報告先、レビュアー・合意者、ready の条件、問い合わせ窓口、lint/schema の検証コマンドは本文に足していない。F014 は rulebook の『共通の運用』でも成果物の業務の検証から除外されている。合わせて直す点として、これらの viewpoint が kata の sample に役割・承認の記述を求めないよう判定根拠の見直しを提案する。
- F002・F004: rulebook の本文要件は見出しを5章に固定しており未決事項の章がないため、未定の値は分冊一覧の備考に `_UNDECIDED_` で示した。rulebook の変更案として、未決の目標値の扱い（分冊一覧の備考に書くか、登録簿へ引き継ぐか）を『分冊ドキュメント一覧』の記述ガイドに1行足すことを提案する。
- 利用者が決める必要のある値（`_UNDECIDED_` で残した値）: 営業時間内の稼働率の目標、RTO・RPO（可用性）、会計確定の応答時間の目標（性能）、営業時間外の緊急連絡手段（運用）、オフライン時の記録方法（判断記録 `dec-offline-recording`）。いずれも opd-index-sample の未決事項と揃えている。
- `sac-store-sales` と `dec-offline-recording` はこの sample のために置いた架空の ID である。sac-sample には条件 ID がなく、dec-sample は非推奨のため。`stc-cash-sale`・`stc-sale-hold`・`stc-record-recovery` は stc-index-sample の term に揃えた。
- 8つのカテゴリ別 sample（nfr-reliability-sample など）はまだ薄い旧形式のままで、本書の代表指標と整合していない。後続の型タスクで、本書のカテゴリ一覧の代表指標に揃えて厚くする必要がある。
- rulebook の変更案: 本文要件の『分冊ドキュメント一覧』は ID と参照先の列を要求しているが、参照先の基準ディレクトリ（`docs/ja/product/060-non-functional-requirements/` からの相対か、リポジトリ相対か）を明記するとよい。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ 配下の sample だけで、plan/result/個票などの履歴蓄積ファイルを変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更ファイルに `*.yaml` / `*.yml` が含まれない）

## 4. 進め方と実践の型の適用

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集しました。`rulebook` の構成要件を満たすよう、8カテゴリの目的・代表指標・分冊情報・導線を具体的な値で埋め、`_UNDECIDED_` を活用して実例の厚みを持たせました。
