---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-trc-requirements-to-tests-040-20261118t140806z-0ecdcb16
  type: exec-result
  task_id: T-KATA-SLIM-2-trc-requirements-to-tests-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-trc-requirements-to-tests-040/T-KATA-SLIM-2-trc-requirements-to-tests-040-20261118T140806Z-0ecdcb16/plan.md
  started_at: "2026-11-18T14:08:12.488Z"
  completed_at: "2026-11-18T14:25:09.256Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - trc-requirements-to-tests
    - specdojo:trc-requirements-to-tests-rulebook
---

# Edit Result

## 1. 実施内容

- `trc-requirements-to-tests-rulebook.md` を更新し、共通運用の記述を整理して正本への参照に切り替えると同時に、grade result での major 指摘（F002〜F014）に基づく規定の具体化および修正を行いました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/trc-requirements-to-tests-rulebook.md`: 共通運用の記述を排除し、正本への参照に置き換えました。また、`based_on` の必須化、要求母集団の生成手段、充足状況の判定基準、集計方法、未対応行の表記規則などを具体的に定めて major 指摘に対応しました。章名を「本文要件」へ変更し、構成を整理しました。

## 3. 申し送り

- 大きさ（空白と表の区切り行を除く）: 前 2,473 字、後 3,686 字（約149%）。区切り行を含めると 2,734 字から 4,150 字。外せる運用の記述がほとんどなく、grade の major の指摘（F002〜F014）を直すのに規定を足す必要があったため8割を超えた。手本の trc-requirements-to-specs-rulebook（3,549 字）とほぼ同じ大きさ。
- 章の求め方の変更: 第5章の見出しを「本文構成（標準テンプレ）」から rulebook 作成標準の章名「本文要件」に変えた（F010）。中に並ぶ6章の名前は変えていない（既存の成果物との対応を保つため）。「変更履歴と更新ルール」は「任意」から「条件付き」にし、再生成の契機や差分を残すときに置くと条件を書いた（手本の trc-requirements-to-specs と揃えるため）。
- finding への対応: F001 はギャップの担当・期限の列を求めないことにして解消した（追跡は登録簿）。F002・F013 は「充足状況の判定」の表で解消した（実行結果は扱わず、テストの対応と `status` で判定する）。F003 は要求 ID を重複なく数え、合計が母集団の件数と一致する、と定めて解消した。F004・F009 は対応テストIDの `なし` の行で解消した。F005・F006 は `based_on` を必須にし、要求とテストの生成元をすべて書くことにして解消した。F007・F014 は 1 行 1 要求とその対応テスト群に揃えて解消した。F008・F011・F012 は前提の章に生成手段を書くことと、生成元を直して再生成し本ビューへ直接書かないことで解消した。F015 は rulebook 側は直したが、sample 側の手で書き換える前提が残っているため次の sample の変更案で扱う。
- sample の変更案（trc-requirements-to-tests-sample）: (1) 「変更履歴と更新ルール」の手で書き換える前提（状態の遷移を手で管理し、備考にチケット ID を足す）を、生成元を直して再生成し、生成日と差分の要点を残す形に直す（F015）。(2) 「ギャップと対応方針」の担当・期限の列を外し、直す生成元の成果物の列に変える。(3) `based_on` に要求側の文書（例: 受入基準の文書）を足し、前提の章に要求の母集団と生成手段・生成日を書く（F005・F006）。(4) テストのない要求を `なし` で示す行を足す（F004）。(5) 充足状況を新しい判定条件と合わせる（例: req-r1-004 は対応テストがあるため `未着手` ではなく `一部充足`）。
- recipe・template: rulebook に宣言がないため変えていない。共通の正本（ドキュメントメタ情報標準）への追記は要らない。
- 適用外の検証: `npm run validate:history-links`（変更は rulebook だけで、plan・result・個票などの履歴ファイルを変えていない）
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-18T14:09:57.378Z に再開

## 4. 進め方と実践の型の適用

rulebook-maintenance
