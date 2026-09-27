---
specdojo:
  id: prj-0001:pjr-xw9m-orchestrator-note-type-non-terminal
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-09-27T12:46:34Z"
---

# PJR-XW9M オーケストレーター定義の種別表で note を終端しない記録に直す

## 1. 概要

オーケストレーター定義の「登録簿（register）の使い方」にある type の表は、`note` の終端状態を `done` としている。一方、`pjr-rulebook.md` の type 別の扱い（157〜166 行）は、`note` を終端させず `open` のまま新しい事実・知見を追記し、`done` / `decided` / `rejected` / `deferred` へ遷移させないと定めている。`register-operation-guide.md` も「`note` は終端させない」としている。

2026-09-27、orchestrator はこの表を根拠に、PJR-ZFFZ が作成した `stsd-register-entry`（rulebook に沿って `note` を終端しないと定義していた）を誤りと判断し、実装に合わせて直すよう推奨した。あわせて、観測記録の `note` 6 件を close 候補として提示した。どちらも rulebook を確認して取り消した。

定義は SSOT 本文と各環境の配置先・テンプレートで同じ本文を保つ運用であり、次のファイルに同じ表がある。

- `.claude/agents/specdojo-orchestrator.md`
- `.github/agents/specdojo-orchestrator.md`
- `.agents/specdojo-orchestrator.agent.md`
- `.opencode/agents/gemma-orchestrator.md`、`.opencode/agents/qwen-orchestrator.md`
- `templates/claude/agents/specdojo-orchestrator.md`、`templates/codex/orchestrator.md`、`templates/antigravity/orchestrator.md`

## 2. 完了条件

- 上記のすべてのファイルで、type の表の `note` の終端状態が「なし（`open` のまま追記する）」になっている。
- 表の下の close 手順の説明が、`note` を close しないことと矛盾していない。
- SSOT 本文と各環境の本文が、定められた保守方法どおりに一致している（一致を確かめる検証があれば通過している）。
- `npm run check` が成功する。

## 3. 作業内容

| No  | 作業                                   | 担当 | 状態 | メモ |
| --- | -------------------------------------- | ---- | ---- | ---- |
| 1   | SSOT 本文の type 表と close 手順を直す | DEV  | open | -    |
| 2   | 各環境の配置先とテンプレートへ反映する | DEV  | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[specdojo:pjr-rulebook]]、[[specdojo:register-operation-guide]]
- PJR-ZFFZ（誤った推奨の契機）、PJR-GDQC（CLI での強制の要否）
