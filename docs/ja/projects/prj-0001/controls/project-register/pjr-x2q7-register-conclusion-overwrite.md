---
specdojo:
  id: prj-0001:pjr-x2q7-register-conclusion-overwrite
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: ARC
  registered_at: "2026-08-24T11:26:51Z"
  due_on: "2026-08-31"
---

# PJR-X2Q7 失敗時のブロック理由が個票のconclusionを上書きする問題を解消する

## 1. 概要

exec run が失敗すると、その時点のブロック理由が個票の conclusion へ書き込まれる。実行が成功して完了した後も古いブロック理由が残るため、PJR-JT1Y・PJR-E6HG・PJR-Q828・PJR-1Z1H の4件連続で手作業による書き換えが必要になった。conclusion は項目の結論を記録する欄であり、途中の失敗理由を保持する場所として適切ではない。ブロック理由の記録先を分けるか、完了時に上書きされるようにする。あわせて register update に conclusion を更新するオプションがなく、直接編集が必要である点も解消する。

## 2. 完了条件

- 実行が失敗して `waiting` へ遷移した後、再実行して完了した項目の `conclusion` に、古いブロック理由が残らない。
- ブロック理由そのものは失われない。どこに記録するかを判断し、理由とともに記録する。`conclusion` とは別の欄へ移すか、完了時に確実に上書きされるようにするか、いずれの方式でもよい。
- `register update` から `conclusion` を更新できる。現在は該当オプションがなく、個票を直接編集するしかない。
- 既存の個票に残っている古いブロック理由は本項目では書き換えない。過去の記録の訂正は対象外とし、以後発生しないことを条件とする。
- `register history` がブロック理由を追える。記録先を変える場合、履歴の再構成が壊れないことを確認する。
- 規約や生成物の文言を変えた場合、既存テストの期待値が新しい仕様と整合していることを確認する。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run test:integration` が成功する。

### 調査済みの事実

- 書き込みは `src/exec-run.ts` が `register wait --conclusion <理由>` を呼ぶ経路で発生する。`wait` の `--conclusion` は「待機の理由」を意味しており、項目の結論とは用途が異なる。
- `register close --conclusion` は同じ欄を上書きするため、クローズ時に結論を書けば古い理由は消える。実際にはオーケストレーターが毎回手作業で妥当な結論を書いており、書き忘れると失敗理由が結論として残る。
- 発生は7回連続である（PJR-JT1Y、PJR-E6HG、PJR-Q828、PJR-1Z1H、PJR-XGJK、PJR-K9KG、PJR-KAQV）。

## 3. 作業内容

| No  | 作業                                                    | 担当 | 状態 | メモ                                  |
| --- | ------------------------------------------------------- | ---- | ---- | ------------------------------------- |
| 1   | ブロック理由の記録先を判断し、理由を記録する            | ARC  | done | `block_reason` へ分離                 |
| 2   | 判断した方式を実装する                                  | ARC  | done | exec の全失敗経路を `--reason` へ変更 |
| 3   | `register update` に `conclusion` の更新を追加する      | ARC  | done | `-` による削除にも対応                |
| 4   | `register history` がブロック理由を追えることを確認する | ARC  | done | 通常履歴と status-only の対象へ追加   |

## 4. 対応結果

ブロック理由を個票 Frontmatter の `block_reason` へ分離した。`conclusion` を成功時に暗黙上書きする方式では、再実行後に確定した結論を CLI が推測する必要があり、既存の結論を誤って消す可能性があるため採用しなかった。`block_reason` は直近の待機理由として保持し、Git ベースの `register history` が変更を追跡する。

- `register wait --reason <text>` を追加し、exec run の失敗・commit 失敗・worktree 失敗の各経路をこのオプションへ接続した。旧 `register wait --conclusion` は互換入力として残すが、保存先は `block_reason` とする。
- `register update --conclusion <text>` を追加した。`-` を指定すると既存キーを削除できる。
- `register history` の比較対象と `--status-only` の対象へ `block_reason` を追加した。
- schema、ルールブック、運用ガイド、コマンドリファレンスと関連するレビュー差し戻し設計を新しい責務分離へ合わせた。
- 既存個票に残る古いブロック理由は対象外として変更していない。

残課題はない。

## 5. 関連ドキュメント

- Register の運用: [[specdojo:register-operation-guide|Register運用ガイド]]
- 個票の記述規約: [[specdojo:pjr-rulebook|プロジェクト登録簿ルールブック]]
- 履歴の扱いを見直す項目: [[prj-0001:pjr-tpy9-register-git-github|PJR-TPY9 Register履歴をGitコミット粒度から分離する]]
- 実装: `src/exec-run.ts`（`register wait --conclusion` の呼び出し）、`src/register.ts`
