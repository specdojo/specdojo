---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-cop-sample-040-20261123t121500z-cf770a8d
  type: exec-result
  task_id: T-KATA-WAVE-5-cop-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-cop-sample-040/T-KATA-WAVE-5-cop-sample-040-20261123T121500Z-cf770a8d/plan.md
  started_at: "2026-11-23T12:15:08.908Z"
  completed_at: "2026-11-23T12:24:03.358Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:cop-sample
    - specdojo:cop-rulebook
---

# Edit Result

## 1. 実施内容

- `cop-rulebook` を簡潔に整えました。
- 指摘事項 `F001` 〜 `F004` を `rulebook` 側で解消しました（個人連絡先の扱い、当日の判定・課題の記録先、構成変更時の追従、検証の具体的な方法について）。
- 経過措置としてのサンプル章および `sample` への参照文を削除し、完成例を `sample` のみに集約しました。
- 指摘 `F005`（`sample` の構成不整合）については、今回のフェーズでは `sample` を変更しないため、未解消として残しています。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/cop-rulebook.md`: 「個人連絡先の扱い」の記述を整理し、周知には利用者が判断に必要な情報のみを含めるよう統一しました。また、当日の判定結果や課題を `pm-decision-log` や `pm-issue-log` へ記録する旨を明記しました。さらに、必須構成（見出し等）の変更時に `sample` を追従確認する旨の記述を追加し、検証に関する記述を整えました。最後に、経過措置として用意されていたサンプル章を削除しました。

## 3. 申し送り

- F005 未解消: `specdojo:cop-sample` (`docs/ja/specdojo/samples/cop-sample.md`) が `cop-rulebook` の必須の10章（概要〜関連ドキュメント）に沿っていない。この段は `sample` を変更しないため直していない。次のアクション: `sample` を厚くする段で、駄菓子屋の販売管理システムの題材で10章構成に作り直す。
- F003 の一部: 規則（必須章・Frontmatter を変えたら同じ変更で `sample` を合わせる）は追加したが、現在の `sample` との不整合は `F005` と同じく `sample` の段で解消する。
- F004 で書いた「必須章の有無と順序は機械検証がないため、grade で確かめる」は、`cop` 系統に `template` がない（宣言なし）ことからの判断。検証ツール側の仕様は確認していない。
- サンプル章（経過措置）を `plan` の指示に従って削除した。完成例は `sample` だけになるため、`sample` の整備を優先したい。
- 直さなかった箇所と理由: 本文要件の10章の表、記述ガイドの「当日タイムラインと判定点」、ファイル命名・ID規則は指摘がなく正本と合うため維持。判定・手順の「判断者」「実施者」は当日の手順そのものに含まれる役割なので、PJR-76N9 の対象外として維持。
- F005 未解消: `specdojo:cop-sample`（`docs/ja/specdojo/samples/cop-sample.md`）が `cop-rulebook` の必須の10章（概要〜関連ドキュメント）に沿っていない。この段は sample を変更しないため直していない。次のアクション: sample を厚くする段で、駄菓子屋の販売管理システムの題材で10章構成に作り直す。
- F003 の一部: 規則（必須章・Frontmatter を変えたら同じ変更で sample を合わせる）は追加したが、現在の sample との不整合は F005 と同じく sample の段で解消する。
- F004 で書いた「必須章の有無と順序は機械検証がないため、grade で確かめる」は、`cop` 系統に template がない（宣言なし）ことからの判断。検証ツール側の仕様は確認していない。
- サンプル章（経過措置）を plan の指示に従って削除した。完成例は sample だけになるため、sample の整備を優先したい。

## 4. 進め方と実践の型の適用

対象の `sample` が従う `rulebook` を、`grade` の指摘と `done_criteria` に沿って簡潔に整えるアプローチをとりました。具体的には、`F001` 〜 `F004` の指摘に基づき、連絡先の扱い、当日の記録先、構成変更時の追従ルール、および検証方法に関する記述を `rulebook` に反映しました。また、`rulebook` 内に存在していた経過措置用のサンプル章を削除し、成果物の完成例は `sample` に委ねる形に整理しました。
