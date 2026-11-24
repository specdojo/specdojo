---
specdojo:
  id: prj-0001:xer-t-kata-wave-4-nfr-security-safety-sample-040-20261123t053209z-b007262b
  type: exec-result
  task_id: T-KATA-WAVE-4-nfr-security-safety-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-4-nfr-security-safety-sample-040/T-KATA-WAVE-4-nfr-security-safety-sample-040-20261123T053209Z-b007262b/plan.md
  started_at: "2026-11-23T05:32:18.021Z"
  completed_at: "2026-11-23T05:40:58.944Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:nfr-security-safety-sample
    - specdojo:nfr-security-safety-rulebook
---

# Edit Result

## 1. 実施内容

- nfr-security-safety-rulebook を、本文の要件・判断基準と「良い例」「悪い例」の形式に簡潔化しました。
- rulebook 内に含まれていたサンプル（最小例）の章を削除し、成果物としての `docs/ja/specdojo/samples/nfr-security-safety-sample.md` にその責務を譲る構成に変更しました。
- grade の指摘事項（F001〜F005, F008）に基づき、記述ガイドと禁止事項を更新しました。具体的には、測定方法と判定時期の記述指示、例外運用の集約ルール、適用範囲における権限定義の要求、および用語の統一を行いました。
- 検証担当の Role code を直接記載させるのではなく、「検証先」を用いて検証タスクへ繋ぐ方針に整理しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/nfr-security-safety-rulebook.md`: rulebook を簡潔化するために、サンプルによる最小例の章を削除し、要件の記述ガイド、禁止事項、および関連ドキュメントの導線に焦点を当てた構成へ変更しました。これにより、F001〜F005 および F008 の指摘に対応しました。

## 3. 申し送り

- F006/F007/F009 未解消: `specdojo:nfr-security-safety-sample` の構成が rulebook の本文要件（概要・適用範囲・脅威前提・機密性・安全性要件一覧・測定・検証方法・例外運用・関連ドキュメント導線）と乖離しています。後続の sample 改訂タスクにおいて、新しい rulebook の構成に合わせてサンプルを改訂する必要があります。rulebook の `status` を `ready` に変更する判断は、sample の改訂完了後に行う必要があります。
- F001: 検証担当の Role code は、本書に書かせるのではなく、「検証先」の列（`stc-*`, `sac-*`, `opr-*` 等）を用いて検証タスクへ繋ぐ方針としました。具体的な担当の割り当ては、検証先の計画およびメンバー定義で行います。
- rulebook からサンプル章を削除したため、`sample` を改訂するまで参照できる完成例がありません。なお、`良い例` に記載されている `stc-security` は、例示用の仮の ID です。
- F006/F007/F009 未解消: specdojo:nfr-security-safety-sample の構成が rulebook の本文要件（概要・適用範囲・脅威前提・機密性・安全性要件一覧・測定・検証方法・例外運用・関連ドキュメント導線の6章）と乖離している。後続の sample 改訂タスクで rulebook に合わせて作り直す必要がある。rulebook を ready にする判断は sample 改訂の完了後に行う。
- F001: 検証担当の Role code は「共通の運用」と PJR-76N9 に合わせて本書に書かせず、「検証先」列（`stc-*/sac-*/opr-*`）で検証タスクへ繋ぐ方針にした。担当の割り当ては検証先の計画とメンバー定義で行う。
- rulebook からサンプル章（最小例）を削除したため、sample を改訂するまで参照できる完成例がない。良い例の `stc-security` は例示用の仮の ID である。

## 4. 進め方と実践の型の適用

rulebook を、成果物の完成例（sample）を直接含む形式から、記述の規範を示す形式へと移行しました。検討の結果、rulebook は「何を書くべきか」「何を禁止すべきか」の基準に特化させ、具体的な構成例は sample に任せることで、文書の責務を単一化しました。
