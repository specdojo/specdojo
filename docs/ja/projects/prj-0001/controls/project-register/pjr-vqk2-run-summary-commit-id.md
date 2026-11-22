---
specdojo:
  id: prj-0001:pjr-vqk2-run-summary-commit-id
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: low
  owner: DEV
  registered_at: "2026-11-22T11:15:38Z"
  due_on: "2026-11-30"
---

# PJR-VQK2 exec run の要約の commit= に、その run のものではない commit の ID が出ることがある

## 1. 課題内容

exec run --register の要約（Register run summary）の commit= に、その run の統合の commit ではなく HEAD の commit の ID が出ることがある。記録だけの問題で、統合そのものには影響しない。

## 2. 入力

- 2026-11-22 の運用で観測した。例の run の記録は手元に残っておらず、再現の手順の特定も調査に含める。
- 要約の整形は formatRegisterRunSummary（src/exec/register.ts）。
- 利用者の承認（2026-11-22、indie）で起票した。担当 DEV、期限 2026-11-30。

## 3. 影響範囲

| 観点         | 影響                                                       |
| ------------ | ---------------------------------------------------------- |
| スコープ     | `exec run --register` の要約（Register run summary）の表示 |
| スケジュール | なし                                                       |
| コスト       | 小さい〜中（出どころの調査と、特定できれば修正）           |
| 品質         | 要約から統合の commit を読み違えるおそれがある             |
| 関係者       | オーケストレーター、夜間の実行の朝の報告                   |

## 4. 対応方針

| 項目     | 内容                                                        |
| -------- | ----------------------------------------------------------- |
| 原因     | 未特定。調査に含める                                        |
| 対応策   | 出どころを特定し、その run の統合の commit が出るように直す |
| 依存事項 | なし                                                        |
| 完了条件 | 下の箇条書きのすべてを満たす                                |

- 要約の `commit=` の値の出どころを調べ、その run の統合の commit ではない ID（HEAD の commit など）が入る経路を特定して、個票の対応結果に書く。
- 経路を特定できたら、その run の統合の commit が出るように直し、再現と修正を単体テストで確かめる。
- 特定できなければ直さず、調べた範囲と、次に起きたときに集める記録を個票の対応結果に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。
- runner の出力を変えるため、統合の後にオーケストレーターが JSEY を流して確かめてから close する。

## 5. 対応結果

### 5.1. 原因の経路

要約の `commit=` は 2 経路で root の `HEAD` を読んでいた。

- `src/exec/run/register-post-review.ts`: `commitRegisterState` は staged 差分が無いと commit を作らずに戻る。その後の `git rev-parse --short HEAD` が、その run のものではない commit の ID を返した。
- `src/exec/run/register-worktree.ts`: post-review が無い経路で、統合後の `HEAD` を読んでいた。並行 run や他の commit で `HEAD` が動くと、統合の commit と食い違う。

例の run の記録が無く、実際にどちらで起きたかは断定できない。ただし、どちらも `HEAD` が run の commit とは限らない点で同じ原因である。

### 5.2. 修正

- `selectRunCommitId`（`src/exec/register.ts`）を追加した。run の前後で `HEAD` が動いた場合だけその `HEAD` を使い、動かなければ統合の commit（`outputCommit`）を使う。
- post-review は `selectRunCommitId` を使う。post-review が無い経路は `outputCommit` を直接使う。
- 単体テストを `tests/src/exec/register-multiple-ids.test.ts` に追加した。`HEAD` が動かない場合と動いた場合を確かめる。

### 5.3. 確認

親 runner の検証（`npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md`）に委ねる。runner の出力を変えるため、統合の後にオーケストレーターが JSEY を流して確かめてから close する。

### 5.4. CHANGELOG に書く事項

- 区分: Fixed
- 文案: `exec run --register` の要約の `commit=` が、その run の統合の commit ではない `HEAD` の ID を出すことがあった問題を修正した。

### 5.5. 判断

- 要約の ID は `--short` の長さが環境で変わるため、12 桁に揃えた。既存の経路（`outputCommit.slice(0, 12)`）に合わせた。

## 6. 関連ドキュメント

- なし
