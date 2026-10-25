---
specdojo:
  id: prj-0001:pjr-xte6-executor-incomplete-report
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-25T01:32:57Z"
---

# PJR-XTE6 executor が未完了と報告しても、正常終了と親の検証の通過で review になる

## 1. 課題内容

executor が作業を途中で止めて報告に「未完了」と書いても、終了コード 0 で終わり、親の検証が通れば、runner は項目を review にして統合する。未完了の変更が統合先へ入り、オーケストレーターが差分を読むまで気づけない。

- 起きた条件: [[prj-0001:pjr-6hs2-kata-companion-files|PJR-6HS2]] を `exec run --register --worktree` で luna-executor に流した（2026-10-25 10:05 JST）。
- 起きたこと: executor は 40 秒ほどで終わり、一覧の拡張子の絞り込みだけを入れた。報告の `final_message` に「未完了。kata 一覧の拡張子フィルターのみ変更しました。eject・テスト・文書更新が残っています。」、`handoff` に残りの作業、validations はすべて `not_run` と書いた。evidence の `stage.status` は `succeeded`、`exit_code` は 0 だった。親の検証 7 種が通り、項目は review になって統合された。
- 原因の見立て: executor の報告の形式（`src/exec/run/agent.ts` の報告の例と `src/exec/evidence.ts` の読み取り）に、作業を終えたかどうかを示す欄がない。runner は終了コードと親の検証だけで成否を決める。
- 統合後は worktree がないため `--resume --resume-from executor` も使えず、項目を流し直すしかなかった。

## 2. 影響範囲

| 観点         | 影響                                                                                   |
| ------------ | -------------------------------------------------------------------------------------- |
| スコープ     | `exec run --register` の executor と reporter の pipeline すべて                       |
| スケジュール | 未完了に気づくまでの遅れと、流し直しの時間                                             |
| コスト       | 流し直しの agent の実行                                                                |
| 品質         | 完了条件を満たさない変更が統合先へ入る。親の検証は既存の test が通ることしか確かめない |
| 関係者       | オーケストレーター、runner を使う利用者                                                |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                              |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | executor の報告に完了・未完了の欄がなく、runner が executor 自身の未完了の申告を判定に使わない                                                                                                                                                    |
| 対応策   | 1. executor の報告に、作業を終えたかどうかを示す欄を加える。<br>2. 未完了と報告された場合、runner は統合せず項目を `waiting` にし、報告の理由を `block_reason` に載せ、worktree を残す。<br>3. 欄のない既存の報告は、これまでどおり完了として扱う |
| 依存事項 | [[prj-0001:pjr-r1fb-completion-record-destination\|PJR-R1FB]]（報告の `handoff`）                                                                                                                                                                 |
| 完了条件 | 未完了の報告で項目が `waiting` になり、統合されず、`--resume --resume-from executor` で再開できる。欄のない報告と完了の報告は従来どおり review になる。これらを確かめる test がある                                                               |

### 追記（2026-10-25、利用者が承認）

- v0.4.6 の範囲とする。
- 欄の名前と値は executor が決め、理由を個票の対応結果と報告の `handoff` に書く。
- executor の prompt に、作業を終えられなかった場合はその欄で未完了と報告し、残りの作業を `handoff` に書くよう加える。
- 未完了で `waiting` になったときの `block_reason` に、executor の `final_message` の要旨が載る。
- [[specdojo:exec-config-guide]] の報告の形式の説明を更新する。
- runner のコードを変えるため、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [Unreleased]` の節に書く（なければ作る）。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-6hs2-kata-companion-files]]：起きた項目
- [[prj-0001:pjr-r1fb-completion-record-destination]]：executor の報告の `handoff`
