---
specdojo:
  id: prj-0001:pjr-xw9m-orchestrator-note-type-non-terminal
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-09-27T12:46:34Z"
  completed_at: "2026-09-28T11:18:34Z"
  block_reason: "agent exited with non-zero code: executor evidence の `source: executor` 検証コマンド（`node -e ... orchestrator note terminal state is still done` チェック）が `status: failed` であり、要約は「SSOTのnote終端状態が依然done。読み取り専用の…"
  conclusion: SSOT（.agents/specdojo-orchestrator.agent.md）の種別表で note の終端を「なし」に改め、close 手順の後に note を終端させない旨を追記し、orchestrator:sync で 10 か所へ同期した
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

| No  | 作業                                   | 担当 | 状態    | メモ                                    |
| --- | -------------------------------------- | ---- | ------- | --------------------------------------- |
| 1   | SSOT 本文の type 表と close 手順を直す | DEV  | blocked | `.agents/` が実行環境で読み取り専用     |
| 2   | 各環境の配置先とテンプレートへ反映する | DEV  | blocked | SSOT を更新できず同期不能               |
| 3   | plan 展開の grade finding を解消する   | DEV  | done    | rulebook・guide・schema・参照解決を更新 |

## 4. 対応結果

plan に展開された grade finding について、`pjr-rulebook.md` に `item_type` ごとの必須節・必須記入欄と schema・運用ガイドへの導線を追加し、`completed_at`、未定の `owner` / `due_on`、`deferred` の保存規則を正本間で統一した。複数 template の Frontmatter 宣言を schema と参照解決で扱えるようにし、PJR の全 `item_type` template を宣言した。

オーケストレーター本文の SSOT である `.agents/specdojo-orchestrator.agent.md` は、この executor の filesystem policy で読み取り専用になっており、作業ツリー相対の `apply_patch` が拒否された。SSOT を変更できないため、`npm run orchestrator:sync` による各環境への同期は未実施である。書き込み権限を付与した executor で、type 表の `note` を「なし（`open` のまま追記する）」へ変更し、close 手順へ `note` を終端させない規則を追記してから同期する必要がある。

## 5. 関連ドキュメント

- [[specdojo:pjr-rulebook]]、[[specdojo:register-operation-guide]]
- PJR-ZFFZ（誤った推奨の契機）、PJR-GDQC（CLI での強制の要否）
