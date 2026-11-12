---
specdojo:
  id: prj-0001:pjr-ebn6-glossary-everyday-terms
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: sol-executor
  registered_at: "2026-11-12T13:29:28Z"
  derived_from:
    - PJR-6XQ4
  commit_type: docs
  commit_scope: glossary
---

# PJR-EBN6 用語集の見出しを利用者が目にする言い方に寄せ、登録簿の操作の語をまとめる

## 1. 概要

6 件の用語集の見出しを、ガイドと CLI で実際に使う言い方に合わせ、gl-register の操作の語を 1 語にまとめる

## 2. 入力

- 用語集の確定の段の前の確認で、claim を「着手宣言」、release を「着手解放」、reporter を「実行報告者」のように硬く言い換えていること、gl-register が登録簿の操作を 1 語ずつ立てて語数が多いことを orchestrator が挙げ、indie が直すことを承認した（2026-11-12）

## 3. 完了条件

- 対象は `docs/ja/product/010-business-specs/060-glossary/` の 6 件（`gl-common`・`gl-register`・`gl-planning`・`gl-execution`・`gl-quality`・`gl-setup`）。
- 用語の見出し（`term`）を、利用者がガイド・CLI の表示・コマンド名で実際に目にする言い方に合わせている。
  - ガイドや CLI が英語のまま使う語（claim・release・worktree・executor・reporter・epic・grade など）は、その語を見出しにし、日本語の言い換えは `aliases` に置く。
  - 日本語で通じている語（登録簿・成果物・完了条件など）は今のままにする。文書で使われていない硬い造語（「着手宣言」「着手解放」「実行報告者」など）を見出しに残さない。
  - [[specdojo:gl-rulebook]] の「用語は業務用語（日本語）で記述する」との関係を、SpecDojo の利用者が業務で使う言葉に合わせる、という解釈で個票の対応結果に書く。
- `gl-register` の登録簿の操作（着手・待機・審査提出・終了・却下・延期・再開・更新など）を、1 語（登録簿の操作）にまとめ、各操作と対応するコマンド（`register start` など）を `notes` に一覧で示している。処理状態（起票済み〜延期）は、ほかの文書が状態の名前として使うため 1 語ずつ残す。
- 用語 ID（`tm-...`）は変えない。まとめて消す用語の ID が、用語集の外（`bdd-register-entry.yaml`・`bdd-sample.yaml`・rulebook・standard など）から参照されていないことを確かめ、参照されているものは消さずに残す。
- 用語の定義の意味と、schema の条件付きの決まりを用語の関係として書く方針（カタログの完了条件）は保つ。用語集どうしで同じ用語を定義しない。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。
- `npm run validate:schema`・`npm run lint:md` と親の検証が通っている。grade は統合の後に orchestrator が流す。grade を流せないことを理由に未完了としない。

## 4. 作業内容

| No  | 作業                                     | 担当         | 状態 | メモ |
| --- | ---------------------------------------- | ------------ | ---- | ---- |
| 1   | 見出しを直し、登録簿の操作の語をまとめる | executor     | open | -    |
| 2   | 統合の後に 6 件の grade を流す           | orchestrator | open | -    |
| 3   | 確定の段（`T-GLOSSARY-*-140`）           | indie        | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-6xq4-glossary]]
- [[specdojo:gl-rulebook]]
