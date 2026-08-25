---
specdojo:
  id: prj-0001:pjr-kaqv-agent-raw-stderr-retention
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: ARC
  registered_at: "2026-08-24T10:17:53Z"
  due_on: "2026-08-31"
---

# PJR-KAQV agent失敗時の生のstderrを保全する

## 1. 概要

PJR-E6HG の調査では、失敗した実行の stderr ログに原因を示すメッセージが残っておらず、stdout の切り詰められた要約行だけが手がかりだった。そのため原因を推測に頼らざるを得ず、初回の結論が誤りとなった。agent が非ゼロ終了した場合に生の stdout と stderr を evidence の一部として保全し、失敗理由の要約とは別に参照できるようにする。認証情報などの秘密が混入しうる点を踏まえ、保全先と取り扱いもあわせて定める。

## 2. 完了条件

- reporter 段階が非ゼロ終了した場合に、その生の stdout と stderr が保全され、後から参照できる。現在は executor 段階のみ `recordExecutorEvidence` が `log_refs` として記録しており、reporter 段階の出力はどこにも残らない。
- 保全した出力から、失敗理由の要約では失われる情報を追える。PJR-E6HG では記録が `agent exited with non-zero code: "... is not valid JSON` の切り詰められた1行のみで、原因を特定できなかった。この状態が解消している。
- 既存の秘密情報の秘匿（`redactSensitiveText`）が保全した出力にも適用される。Bearer トークン、API キー、`password` などの既存パターンを通す。
- 保全先とサイズ上限が定められている。既存の `MAX_LOG_BYTES`（64 KiB）と同じ扱いにするか、別に定めるかを判断し、理由を記録する。切り詰めが発生した場合はその旨が分かる。
- 保全した出力が Git 管理下に入るか否かが明示されている。入る場合は秘密混入時の影響、入らない場合は worktree 削除時の消失を、それぞれ許容できる形で扱う。
- executor 段階についても、非ゼロ終了時に `log_refs` の内容が原因調査に足りるかを確認し、不足があれば揃える。
- 保全の有無と内容を確認する自動テストが追加されている。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run test:integration` が成功する。

## 3. 作業内容

| No  | 作業                                                             | 担当 | 状態 | メモ                                         |
| --- | ---------------------------------------------------------------- | ---- | ---- | -------------------------------------------- |
| 1   | reporter 段階の出力が保全されていない経路を特定する              | ARC  | open | `src/exec-run.ts` の reporter 段階           |
| 2   | 保全先、サイズ上限、Git 管理下に置くか否かを判断し理由を記録する | ARC  | open | 秘密混入と worktree 削除の双方を考慮する     |
| 3   | 保全を実装し、既存の秘匿処理を適用する                           | ARC  | open | `redactSensitiveText` を通す                 |
| 4   | 保全の有無と内容を確認するテストを追加する                       | ARC  | open | 最小構成リポジトリでも動作することを確認する |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- 保全が必要になった調査: [[prj-0001:pjr-e6hg-claude-reporter-json-failure|PJR-E6HG claude-reporterがJSON解析失敗で再現性をもってブロックする]]
- 同じ reporter 段階の課題: [[prj-0001:pjr-q828-reporter-revalidation|PJR-Q828 reporterが解消済みの検証失敗を再評価できない問題を解消する]]
- exec の運用: [[specdojo:exec-operation-guide|exec運用ガイド]]
