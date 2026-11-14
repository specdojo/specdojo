---
specdojo:
  id: prj-0001:pjr-sj3q-implementation-phase-kata
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: question
  item_status: open
  priority: medium
  owner: PO
  registered_at: "2026-11-14T03:47:08Z"
---

# PJR-SJ3Q 実装の段に、どの文書の型（Kata）を置くか

## 1. 確認事項

要求→要件→仕様→設計→実装→テスト→移行→運用の流れのうち、実装の段にだけ型がない。設計の次に置く文書（実装の方針・コーディングの決まり・実装の設計など）を決める

## 2. 入力

- 2026-11-14 に型 108 種類を流れで整理した。`imp-*` は影響分析の型で、実装の段の型ではない。テスト・移行・運用には型がある
- 前提（indie、2026-11-14）: 型の整備は設計までを先に仕上げる。非機能要件（`nfr-*`）とシステムの受け入れ基準（sac）は後回しでよい
- 考える点の例: 実装の方針（使う言語・ライブラリ・構成の決まり）、コーディングの決まり（.github/instructions の typescript・vitest のような規約を型にするか）、実装の設計（モジュールの分け方・依存の向き）、設計の文書（`sysd-*`）との分担、SpecDojo のように実装が先にある場合に実装から文書へ反映する向きの扱い

## 3. 背景

_TODO_: この確認が必要になった背景、前提、制約を記載する。

## 4. 回答候補

| 候補 | 内容   | 利点   | 懸念   |
| ---- | ------ | ------ | ------ |
| A    | _TODO_ | _TODO_ | _TODO_ |

## 5. 回答・結論

_TODO_: 回答または採択した方針を記載する。未回答の場合は `-` とする。

## 6. 承認

| 項目     | 内容   |
| -------- | ------ |
| 回答者   | _TODO_ |
| 回答日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は既定で `commit`（`register close` により `decided` へ遷移）を用いる。
- 回答が不可逆・高リスク・framework schema 破壊的変更を伴う場合は `PR` 方式で承認し、証跡に PR URL と merge SHA を記載する。

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
