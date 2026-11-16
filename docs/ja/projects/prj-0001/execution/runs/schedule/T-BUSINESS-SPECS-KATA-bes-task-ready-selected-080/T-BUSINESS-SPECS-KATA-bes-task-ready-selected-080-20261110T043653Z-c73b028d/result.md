---
specdojo:
  id: prj-0001:xer-t-business-specs-kata-bes-task-ready-selected-080-20261110t043653z-c73b028d
  type: exec-result
  task_id: T-BUSINESS-SPECS-KATA-bes-task-ready-selected-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-BUSINESS-SPECS-KATA-bes-task-ready-selected-080/T-BUSINESS-SPECS-KATA-bes-task-ready-selected-080-20261110T043653Z-c73b028d/plan.md
  started_at: "2026-11-10T04:36:54.522Z"
  completed_at: "2026-11-10T06:07:16.013Z"
  agent: sol-executor
  execution: agent
  approach: condense
  targets:
    - bes-task-ready-selected
  condense_records:
    - location: bes-task-ready-selected.md 修正前21行目の導入と33行目の「対象系統」行
      category: repetition
      action: merge
      reason: 共通の進め方案を「適用範囲と承認の未決事項」冒頭へ集約し、BA・ARC の具体的な確認責務は各論に残した。担当割当の未承認、判断結果の記録先、PM の追跡・報告、および対象系統の登録簿での追跡を保持した。
      cause:
        type: document
    - location: bes-task-ready-selected.md 修正前55行目「誰が／何が」の並列行
      category: table-prose
      action: delete
      reason: 実行能力不足の候補を確定しないという説明を削除。同じ条件と、後で空きができて確定した時点で発生する例外は「発生条件」に保持した。
      cause:
        type: document
    - location: bes-task-ready-selected.md 修正前71行目と83行目「事実データ」
      category: table-prose
      action: merge
      reason: 並列選択要求識別子の意味を表の該当行へ集約。同一要求の相関、対象タスク・実行・個別イベントとの単位の区別、正本項目名が未確認であることを保持した。
      cause:
        type: document
    - location: bes-task-ready-selected.md 修正前87行目「相関と発生の確認例」導入
      category: table-prose
      action: delete
      reason: 直後の表をなぞる相関規則の説明を削除。同一要求・別要求・見送り候補の判定は表に保持し、検証規則であること、実装済み証跡ではないこと、QE への引き継ぎ条件も残した。
      cause:
        type: document
    - location: bes-task-ready-selected.md 修正前99〜101行目「データモデルとの未照合事項」
      category: repetition
      action: merge
      reason: モデル照合と引き渡し前の判断手順を、未決の内容・制約と確認手順に整理。照合先候補、参照範囲外、識別情報と集計時点の未決、最終件数の制約、依存宣言、各ロールの責務と PO の合意期限を保持した。
      cause:
        type: document
    - location: bes-task-ready-selected.md 修正前37行目「完成した業務仕様として扱う条件」
      category: repetition
      action: retain
      reason: 各未決事項と一部重なるが、確定入力として扱うための完了条件をまとめた判断箇所である。人間の PO の承認と draft 維持の理由を失わないため保持した。
      cause:
        type: document
    - location: bes-task-ready-selected.md 修正前42行目「いつ」の ready の説明
      category: canonical-restatement
      action: retain
      reason: 状態定義に関係する説明だが、過去の着手可能判定を流用せず選択時点で再判定するための制約として必要であり、状態遷移の詳細を複製していないため保持した。
      cause:
        type: document
    - location: bes-task-ready-selected.md 修正前89〜95行目「相関と発生の確認例」の表
      category: repetition
      action: retain
      reason: 発生条件と一部重なるが、発生回数、同一要求への帰属、不成立、後続失敗を具体的に判定する QE の入力となるため、5件の確認例を保持した。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 業務イベント仕様（実行可能タスクの選択）における冗長さを整理した。
- 導入文と対象系統の記述を「適用範囲と承認の未決事項」へ集約し、表と本文で重複していた説明や、表の内容をなぞるだけの記述を削除または統合した。
- 一方で、完了条件、状態遷移の制約、QE の入力となる具体的な確認例など、判断に不可欠な背景・制約・例外情報は保持している。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/030-business-model/bes-task-ready-selected.md`: 重複箇所の整理（`repetition` 5件を `merge`/`delete`）を行い、意味と必須情報を維持したまま記述を凝縮した。

## 3. 申し送り

- recipe は発生境界・相関情報・根拠照合を段階的に判断するため必要、template は五章と主体・事実データ表の骨組みを再利用するため必要と判断した。rulebook frontmatter の既存宣言 specdojo:bes-recipe / specdojo:bes-template を維持する。完成例は既存の specdojo:bes-sample に外出し済みであり、対象文書だけを編集する指定に従って Kata は変更していない。判断理由を result に記録すること。
- 適用外の検証: `npm run validate:schema:file`（executor の変更は Markdown 1文書のみで、変更した YAML ファイルがない。）
- 適用外の検証: `npm run validate:catalog`（executor の成果物変更は docs/ja/product/ 配下であり、docs/ja/projects/ 配下に達していない。）
- 適用外の検証: `npm run validate:history-links`（executor は登録簿・plan・result などの履歴ファイルを変更していない。）

## 4. 進め方と実践の型の適用

condense

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `bes-task-ready-selected.md 修正前21行目の導入と33行目の「対象系統」行` | `repetition` | `merge` | `共通の進め方案を「適用範囲と承認の未決事項」冒頭へ集約し、BA・ARC の具体的な確認責務は各論に残した。担当割当の未承認、判断結果の記録先、PM の追跡・報告、および対象系統の登録簿での追跡を保持した。` | `document` |
| `bes-task-ready-selected.md 修正前55行目「誰が／何が」の並列行` | `table-prose` | `delete` | `実行能力不足の候補を確定しないという説明を削除。同じ条件と、後で空きができて確定した時点で発生する例外は「発生条件」に保持した。` | `document` |
| `bes-task-ready-selected.md 修正前71行目と83行目「事実データ」` | `table-prose` | `merge` | `並列選択要求識別子の意味を表の該当行へ集約。同一要求の相関、対象タスク・実行・個別イベントとの単位の区別、正本項目名が未確認であることを保持した。` | `document` |
| `bes-task-ready-selected.md 修正前87行目「相関と発生の確認例」導入` | `table-prose` | `delete` | `直後の表をなぞる相関規則の説明を削除。同一要求・別要求・見送り候補の判定は表に保持し、検証規則であること、実装済み証跡ではないこと、QE への引き継ぎ条件も残した。` | `document` |
| `bes-task-ready-selected.md 修正前99〜101行目「データモデルとの未照合事項」` | `repetition` | `merge` | `モデル照合と引き渡し前の判断手順を、未決の内容・制約と確認手順に整理。照合先候補、参照範囲外、識別情報と集計時点の未決、最終件数の制約、依存宣言、各ロールの責務と PO の合意期限を保持した。` | `document` |
| `bes-task-ready-selected.md 修正前37行目「完成した業務仕様として扱う条件」` | `repetition` | `retain` | `各未決事項と一部重なるが、確定入力として扱うための完了条件をまとめた判断箇所である。人間の PO の承認と draft 維持の理由を失わないため保持した。` | `document` |
| `bes-task-ready-selected.md 修正前42行目「いつ」の ready の説明` | `canonical-restatement` | `retain` | `状態定義に関係する説明だが、過去の着手可能判定を流用せず選択時点で再判定するための制約として必要であり、状態遷移の詳細を複製していないため保持した。` | `document` |
| `bes-task-ready-selected.md 修正前89〜95行目「相関と発生の確認例」の表` | `repetition` | `retain` | `発生条件と一部重なるが、発生回数、同一要求への帰属、不成立、後続失敗を具体的に判定する QE の入力となるため、5件の確認例を保持した。` | `document` |
