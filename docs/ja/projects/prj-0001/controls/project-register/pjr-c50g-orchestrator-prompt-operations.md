---
specdojo:
  id: prj-0001:pjr-c50g-orchestrator-prompt-operations
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-20T12:03:24Z"
---

# PJR-C50G オーケストレーターの本文に、実行の運び方・close の前の確かめ方・止まったときの対処を書く

## 1. 概要

2026-10-18〜20 の運用で分かった一般的な勘どころを、配布するオーケストレーターの本文（.agents/specdojo-orchestrator.agent.md と 4 つのラッパー）に書く。実行の運び方（worktree・並行の上限・background と通知・自分に一致する pkill を避ける・dist の作り直し）、commit の作法（register の --commit を使い、統合中は普通の commit を避ける）、close の前の確かめ方（完了条件と差分の突き合わせ、agent の報告を実物で確かめる、保護された設定、runner を変えた項目の動作確認）、止まったときの対処の表、完了条件の書き方、agent は振り分けの設定に従って選ぶこと（2026-10-20、利用者が承認）

## 2. 完了条件

- 0.4.1 の昇格の後に流す（0.5.0 の範囲）。
- `.agents/specdojo-orchestrator.agent.md` に次の節を加え、4 つのラッパー（`.claude/agents/`・`.github/agents/`・`.opencode/agents/`・`.codex/agents/`）の本文をバイト単位で同じにそろえる。配布する雛形（`templates/` の orchestrator）も同じ本文にする。
  - 実行の運び方: worktree で流すこと、同時に流すのは 2〜3 件までとし理由（親検証は順に流れ、負荷で時間切れが起きる）を書くこと、run は background で流して通知を待つこと、自分自身にも一致する `pkill -f`・`pgrep -f` を避けること、統合の後に dist が古いと runner が止まること。
  - commit の作法: 記帳は `register ... --commit` で行う（lifecycle のロックを取る）こと、個票の本文を普通に commit するのは統合中の run がないときだけにすること、commit に失敗したら index に載ったファイルを残さないこと。
  - close の前の確かめ方: 完了条件と差分を項目ごとに突き合わせること、agent の「直した」「反映済み」という報告を実物で確かめること、保護された設定に触れていないかを確かめること、runner のコードを変えた項目は統合の後に実際の run を 1 回流すこと。
  - 止まったときの対処の表: rate limit・つながらない、親検証の失敗、負荷による時間切れ、統合での CHANGELOG の衝突、保護された設定、hook の失敗、それぞれの対処と使うオプション（`--resume`・`--resume-from executor`・`--force-restart`・`exec handoff apply`）。
  - 完了条件の書き方: 作業を終える前に流す検査、CHANGELOG は未公開の版の節に書くこと、保護された設定は案を result に書くこと、Markdown で `*`・`_` を含む語をコードの書式にし、コードの書式の中に空白を入れないこと。
  - agent の選び方: 具体的な agent の名前は書かず、`exec-defaults.yaml` の振り分けの設定（PJR-5HYP）に従うこと。個票の `difficulty` の決め方。
  - プロジェクトに運用メモがあれば読むこと（置き場所の決め方は PJR-S7JJ に合わせる）。
- 特定の model 名や、本リポジトリだけの事情（JSEY など）は本文に書かない。
- 本文は今の 157 行から大きく増やしすぎない。節ごとに要点を箇条書きにし、詳しい手順はガイド（[[specdojo:orchestrator-operation-guide]] など）に置いて参照する。
- 本文とラッパーが同じであることをテストで確かめる仕組みがあれば通す。なければ本文の一致を確かめる単体テストを足す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の未公開の版の節（0.4.1 の公開の後なので `## [0.5.0] - 未定` を作る）に書く。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                               | 担当 | 状態 | メモ                   |
| --- | ---------------------------------- | ---- | ---- | ---------------------- |
| 1   | オーケストレーターの本文を改訂する | DEV  | open | 0.4.1 の昇格の後に流す |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[specdojo:orchestrator-operation-guide]]（詳しい手順の置き場所）
- [[prj-0001:pjr-5hyp-agent-routing-by-difficulty]]（agent の振り分け）
- [[prj-0001:pjr-s7jj-prj-0001-orchestrator-playbook]]（プロジェクトの運用メモ）
