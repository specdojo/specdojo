---
specdojo:
  id: prj-0001:pjr-a99j-agent-git-isolation-breach
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-08-26T10:59:39Z"
  due_on: "2026-08-31"
---

# PJR-A99J agentのgit操作が実リポジトリを破壊する事象が再発した

## 1. 課題内容

PJR-5YW6 の実行で、メインリポジトリの core.bare が true に変更され作業ツリーが操作不能になった。あわせて worktree へテスト用フィクスチャのコミット2件が混入し、docs/register-item.md という実在しないファイルが追加された。実装の成果はなく worktree は破棄した。同種の事象は PJR-X3E8 で一度発生しており、テストで git を扱う際は隔離した環境変数を渡す規約を設けたが、再発を防げていない。agent の git 操作が実リポジトリの設定と履歴へ影響しないようにする。

## 2. 影響範囲

| 観点         | 影響                                                                                                                 |
| ------------ | -------------------------------------------------------------------------------------------------------------------- |
| スコープ     | agent が git を扱う全タスク。実リポジトリの設定と履歴に及ぶ                                                          |
| スケジュール | 事故のたびに実行が失敗し、復旧と原因調査が要る。今回は成果が得られず worktree を破棄した                             |
| コスト       | 実行時間と agent 利用量が無駄になる。復旧に人手が要る                                                                |
| 品質         | 実リポジトリの設定変更に気づかないまま作業を続けると、後続の操作が想定外の結果になる。履歴への混入は追跡を困難にする |
| 関係者       | git を操作するタスクを実行する全 agent                                                                               |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | 未特定。agent の git 操作が隔離されず、実リポジトリの `core.bare` を変更しフィクスチャのコミットを混入させた。PJR-X3E8 では特定のテストが `GIT_DIR` を継承したことが原因だったが、同一かは未確認である |
| 対応策   | 個別のテストを直す方式では再発を防げていない。agent の git 操作が実リポジトリへ影響しない仕組みか、影響を検知して止める仕組みを設ける                                                                  |
| 依存事項 | worktree による隔離を前提とした実行方式に関わるため、exec の実行経路を変更する場合は影響範囲を確認する                                                                                                 |
| 完了条件 | 下記のとおり                                                                                                                                                                                           |

## 3.1. 完了条件

- agent の実行によって実リポジトリの git 設定が変更されない。特に `core.bare` が変わらない。
- agent の実行によって、意図しないコミットが実リポジトリまたはブランチへ混入しない。
- 上記が守られなかった場合に検知できる。実行の前後で git 設定と HEAD を比較するなど、方法は判断してよい。検知したら実行を止めるか、記録に残して報告する。
- PJR-X3E8 で追加した規約（テストから git を実行する際に隔離した環境変数を渡す）が、実際に守られているかを確認する。守られていない箇所があれば是正する。
- 今回の事象の原因が特定されている。特定できない場合は、切り分けのために行った調査と、残る可能性を記録する。
- 復旧手順が記録されている。`core.bare` が変更された場合の戻し方と、混入したコミットの扱いを含む。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run test:integration` が成功する。

### 今回の観測

- メインリポジトリの `core.bare` が `true` になり、`git status` が `fatal: this operation must be run in a work tree` で失敗した。`git config core.bare false` で復旧した。
- worktree に `register item` と `before registration` の2コミットが混入し、`docs/register-item.md` が追加されていた。実リポジトリの追跡対象には入っておらず、worktree の破棄で解消した。
- 実装の成果はなく、`src/exec-trial.ts` への変更はなかった。親検証3件は passed と記録されたが、実装が無い状態での結果である。
- PJR-5YW6 は未着手として残る。再実行時は完了条件へ「実リポジトリの git 設定・履歴を変更しない」を明記する。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- 1回目の発生: [[prj-0001:pjr-x3e8-test-git-env-bare-repository|PJR-X3E8 テストのgit実行でリポジトリがbareになる]]
- 発生した実行: [[prj-0001:pjr-5yw6-agent-trial-base-and-reporter|PJR-5YW6 trialで完了済みtodoを起点に指定しreporterも比較できるようにする]]
- agent の権限方針: [[prj-0001:pjr-3s8q-agent-writable-config-scope|PJR-3S8Q agent が書き込める設定の範囲]]
- テストでの git 実行規約: `.github/instructions/vitest.instructions.md`
