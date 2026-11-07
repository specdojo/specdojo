---
specdojo:
  id: prj-0001:xer-t-stsd-pilot-stsd-job-run-080
  type: exec-result
  task_id: T-STSD-PILOT-stsd-job-run-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-STSD-PILOT-stsd-job-run-080/20261105T134850727Z-07ac1892/plan.md
  started_at: "2026-11-05T13:48:54.577Z"
  completed_at: "2026-11-05T13:59:01.681Z"
  agent: sol-executor
  execution: agent
  approach: condense
  targets:
    - stsd-job-run
  condense_records:
    - location: 編集前18行・概要「開始時は新しい試行を実行中として追加し、結果記録時は最新の試行と Run を同じ結果に更新する」
      category: table-prose
      action: merge
      reason: 開始処理は遷移表の T-01・T-06・T-07 に保持し、Run と最新試行を同じ結果に更新する処理は第4章の共通説明へ集約。一意判定と生存保証の制約は概要に残した。
      cause:
        type: document
    - location: 編集前20行・概要「失敗・実行中では試行を追加でき、成功・部分成功・処理不要では同一 Run の重複実行を抑止する」
      category: table-prose
      action: delete
      reason: 再試行は T-06・T-07、重複抑止は第4章の既存結果を返す説明に保持。業務上の到達点、終了点を置かない理由、継続状態の特定は概要に残した。
      cause:
        type: document
    - location: 編集前75〜78行・遷移表 T-02〜T-05 の補足、および83〜84行・結果記録と checkpoint の説明
      category: repetition
      action: merge
      reason: 各行で繰り返していた結果・完了時刻の記録を、第4章の結果記録の共通説明へ集約。結果参照と任意の証跡参照・終了コード・理由も保持。checkpoint の定義有無、対象結果、未指定時の扱い、結果状態を変えない制約は既存の共通説明に保持した。
      cause:
        type: document
    - location: 編集前79行・T-06 の補足と83行「再試行は過去の試行を再開せず、新しい試行を追加する」
      category: table-prose
      action: merge
      reason: 過去の試行を再開せず保持する説明を T-06 に統合。T-07 には新しい試行の追加、前試行を実行中のまま保持する制約、事前判定を再実施しない扱いを残した。
      cause:
        type: document
    - location: 編集前38行・状態遷移図の分割理由と共有状態の説明
      category: figure-prose
      action: retain
      reason: 実行中に接続する入出力遷移が閾値6を超えるという分割判断と、共有状態を介して到達性を確認する方法に必要なため保持。図の分割は変更しない。
      cause:
        type: document
    - location: 編集前42〜64行・状態遷移図と72〜80行・遷移表の対応記述
      category: canonical-restatement
      action: retain
      reason: 遷移表を正本、図を全遷移の投影とする必須構造であり、図と表の対応確認に必要な状態・イベント・条件を保持した。
      cause:
        type: kata
        kind: rulebook
        location: docs/ja/specdojo/rulebooks/stsd-rulebook.md「1. 全体方針」状態遷移図を遷移の説明の全行の投影とする規定、および「6.4. 遷移の説明」全遷移を一行ずつ記載する規定
    - location: 編集前90〜92行・今後の検討メモの3論点
      category: repetition
      action: retain
      reason: 本文と関連する記述でも、未確認範囲、業務判断待ちの論点、影響する状態・遷移、決定者・決定時期を担うため保持。結果選択、再試行の安全性、結果訂正の制約を失わないよう章全体を維持した。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 対象文書の冗長さを整理し、情報を集約しました。
- 概要部分における開始処理や再試行に関する説明を、状態遷移表および第4章の共通説明へ集約しました。
- 遷移表の各行に記述されていた結果・完了時刻の記録に関する補足説明を、第4章の共通説明へ集約しました。
- 状態遷移図の分割理由や、図と遷移表の対応に関する記述を、意味と必須情報を維持するために保持しました。
- 検討事項の論点を、業務上の判断を担う重要な情報として保持しました。
- すべての修正において、内容・決定・完了条件の重要性を維持し、整形および差分確認を完了しています。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/020-data-model/stsd-job-run.md`: 概要部分の冗長な説明（開始処理、再試行、重複抑止）を、状態遷移表および第4章の共通説明へ集約。遷移表の各行における結果記録の補足説明も共通説明へ集約。状態遷移図の分割理由、図と表の対応、および今後の検討事項の記述は、意味と判断基準を維持するために保持。文書全体を `prettier` で整形。

## 3. 申し送り

- 適用外の検証: `npm run validate:schema:file`（変更は Markdown 1文書のみで、YAML ファイルの変更がないため。）
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイルを変更していないため。）
- 適用外の検証: `npm run validate:catalog`（変更対象は docs/ja/product/ 配下のみで、docs/ja/projects/ 配下の成果物を変更していないため。）

## 4. 進め方と実践の型の適用

冗長さを削り、まとめる・参照に置き換えるという `condense` の方針に基づき、各箇所の `repetition` や `table-prose` を整理しました。図の分割判断や、`stsd-rulebook.md` に基づく図と表の対応関係といった、意味の維持に欠かせない情報は `retain` としています。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `編集前18行・概要「開始時は新しい試行を実行中として追加し、結果記録時は最新の試行と Run を同じ結果に更新する」` | `table-prose` | `merge` | `開始処理は遷移表の T-01・T-06・T-07 に保持し、Run と最新試行を同じ結果に更新する処理は第4章の共通説明へ集約。一意判定と生存保証の制約は概要に残した。` | `document` |
| `編集前20行・概要「失敗・実行中では試行を追加でき、成功・部分成功・処理不要では同一 Run の重複実行を抑止する」` | `table-prose` | `delete` | `再試行は T-06・T-07、重複抑止は第4章の既存結果を返す説明に保持。業務上の到達点、終了点を置かない理由、継続状態の特定は概要に残した。` | `document` |
| `編集前75〜78行・遷移表 T-02〜T-05 の補足、および83〜84行・結果記録と checkpoint の説明` | `repetition` | `merge` | `各行で繰り返していた結果・完了時刻の記録を、第4章の結果記録の共通説明へ集約。結果参照と任意の証跡参照・終了コード・理由も保持。checkpoint の定義有無、対象結果、未指定時の扱い、結果状態を変えない制約は既存の共通説明に保持した。` | `document` |
| `編集前79行・T-06 の補足と83行「再試行は過去の試行を再開せず、新しい試行を追加する」` | `table-prose` | `merge` | `過去の試行を再開せず保持する説明を T-06 に統合。T-07 には新しい試行の追加、前試行を実行中のまま保持する制約、事前判定を再実施しない扱いを残した。` | `document` |
| `編集前38行・状態遷移図の分割理由と共有状態の説明` | `figure-prose` | `retain` | `実行中に接続する入出力遷移が閾値6を超えるという分割判断と、共有状態を介して到達性を確認する方法に必要なため保持。図の分割は変更しない。` | `document` |
| `編集前42〜64行・状態遷移図と72〜80行・遷移表の対応記述` | `canonical-restatement` | `retain` | `遷移表を正本、図を全遷移の投影とする必須構造であり、図と表の対応確認に必要な状態・イベント・条件を保持した。` | `kata:rulebook; location=docs/ja/specdojo/rulebooks/stsd-rulebook.md「1. 全体方針」状態遷移図を遷移の説明の全行の投影とする規定、および「6.4. 遷移の説明」全遷移を一行ずつ記載する規定` |
| `編集前90〜92行・今後の検討メモの3論点` | `repetition` | `retain` | `本文と関連する記述でも、未確認範囲、業務判断待ちの論点、影響する状態・遷移、決定者・決定時期を担うため保持。結果選択、再試行の安全性、結果訂正の制約を失わないよう章全体を維持した。` | `document` |
