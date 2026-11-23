---
specdojo:
  id: prj-0001:xer-t-kata-wave-4-nfr-usability-sample-050-20261123t132119z-541aed05
  type: exec-result
  task_id: T-KATA-WAVE-4-nfr-usability-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-4-nfr-usability-sample-050/T-KATA-WAVE-4-nfr-usability-sample-050-20261123T132119Z-541aed05/plan.md
  started_at: "2026-11-23T13:21:30.770Z"
  completed_at: "2026-11-23T13:38:35.503Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-usability-sample
    - specdojo:nfr-usability-sample
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/samples/nfr-usability-sample.md` を rulebook の 5 章構成（概要（対象・目的）／適用範囲・利用者前提／操作性要件一覧／測定・検証方法／関連ドキュメント導線）に沿った、駄菓子屋きぬやの操作性要件の完成例に書き直しました。
- 要件は `nfr-usb-001` から `nfr-usb-006` の 6 件とし、rulebook の標準的な 5 列構成を用いて記述しました。指標については、判定に要する分母（分母となる対象数など）を明記しました。
- 測定手段、判定時期、および判定者の役割についても定義しました。
- grade による指摘事項のうち、F001、F002、F005、F007〜F019 の各 finding を解消しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-usability-sample.md`: rulebook の構成に従い、駄菓子屋の販売管理システムを題材とした操作性要件の完成例として、概要、適用範囲、要件一覧、検証方法、関連ドキュメントの各セクションを記述しました。

## 3. 申し送り

- F003、F020、F021（承認する人、`ready` への条件、および文書を保守する役割）については、PJR-76N9 の規定により sample の本文には記載せず、承認と昇格のプロセスは登録簿の個票で管理する運用としています。
- F004（検証作業の細分化と見積もり）および F006（未決事項の追跡方針と報告先）は、操作性要件の文書が扱う範囲外であるため、計画（schedule）や登録簿で扱うものとして本文からは除外しています。type が `sample` である型に対する、viewpoint による判定基準の見直しを提案します。
- 現在 sample 用の仮の値として設定している確定が必要な値: `nfr-usb-001` の完了率 80%・被験者 5 名、`nfr-usb-002` の誤操作率 2%、`nfr-usb-003` の 60 秒（初期目標 1 分からの設定）、`nfr-usb-004` の習熟時間 30 分と熟練利用者の目安 90 秒（`_ASSUMPTION_`）、および端末の画面サイズ（10 インチ前後）とブラウザ環境（`_ASSUMPTION_`）。
- rulebook への変更提案 1: 「測定・検証方法」の判定者の表記ルール（Role code を使用するか、役割名を使用するか）を明文化すること。
- rulebook への変更提案 2: 未決事項の章が存在しないため、基準値が未確定の場合の書き方（例: `_UNDECIDED_` を使用する等）を記述ガイドに追記し、可用性の sample との整合性を図ること。
- サンプルの参照における技術的詳細: 存在しない仮の参照名 `sac-store-sales`、`uis-credit-ledger`、`uis-stock-list` については、既存の thin sample を避けるため、非機能要件インデックスの sample と同様にバッククォートを使用した形式で記載しています。
- F003・F020・F021（承認する人・ready への条件・文書を保守する役割）は、PJR-76N9 の決まりで sample の本文に書かないため対応していない。承認と昇格は登録簿の個票で追う。
- F004（検証作業の分け方と見積もり）と F006（未決事項の追跡方針と報告先）は、操作性要件の文書が扱う範囲の外のため本文に書いていない。計画は schedule と登録簿で扱う。viewpoint を型の sample に当てるときの基準の見直しを提案する。
- 確定が必要な値（現在は sample 用の仮の値）: `nfr-usb-001` の完了率 80%・被験者 5 名、`nfr-usb-002` の誤操作率 2%、`nfr-usb-003` の 60 秒（初期目標の 1 分から決めた値）、`nfr-usb-004` の習熟時間 30 分と熟練利用者の目安 90 秒（`_ASSUMPTION_`）、端末の画面 10 インチ前後とブラウザでの表示（`_ASSUMPTION_`）。
- rulebook の変更案: 「測定・検証方法」の判定者の表記を、Role code（例 QE）と役割名（例 利用者代表）のどちらにするか rulebook に書く。rulebook の良い例は `UX・QA` だが、共通の Role code に UX はない。
- rulebook の変更案: rulebook に未決事項の章がないため、基準値が未確定のときの書き方（`_UNDECIDED_` を基準の列に書き、暫定で判定するか）を記述ガイドに足すと、可用性の sample と書き方がそろう。
- 仮置きの参照名 `sac-store-sales`、`uis-credit-ledger`、`uis-stock-list` は sample として存在しない。`sac-sample` は旧形式の薄い sample のため wikilink にせず、非機能要件インデックスの sample と同じ参照名をバッククォートで使った。

## 4. 進め方と実践の型の適用

rulebook の構成に従い、`docs/ja/specdojo/samples/nfr-usability-sample.md` を「完成例」としての厚みを持たせた形で更新しました。これは、単なる構成案ではなく、具体的な数値や条件を含む実例としての sample を提供することを目的としています。編集にあたっては、`docs/ja/specdojo/standards/sample-authoring-standard.md` を遵守し、不確定な値については `_UNDECIDED_` や `_ASSUMPTION_` を用いて、決定が必要な事項を明確にしました。
