---
specdojo:
  id: prj-0001:pjr-csrm-validation-lag-other-sync-work
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-25T21:59:34Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-P8SX
---

# PJR-CSRM 親の検証の終わりに気づくまでの遅れが、統合の commit 以外の同期の処理で残る

## 1. 課題内容

P8SX で統合の commit を非同期にした後も、親の検証の終わりに気づくまでの遅れが平均約 30 秒、最大約 140 秒残る。npm ci・specdojo build・root への merge など、event loop を止める別の同期の処理を特定して除く。

## 2. 入力

- 2026-11-25 22:30〜2026-11-26 06:00 の全件レビュー（--parallel 4 と 3）で、validation-exit-timing は 246 件。`duration_ms` は平均 33.2 秒・最大 142.1 秒、`detection_lag_ms` は平均 29.8 秒・最大 139.9 秒、`event_loop_delay_max_ms` は平均 31.8 秒・最大 139.8 秒。
- P8SX の個票では、npm ci・specdojo build・root への merge を、計測で目立たないため同期のまま残したと記録している。

## 3. 影響範囲

| 観点         | 影響                                                                    |
| ------------ | ----------------------------------------------------------------------- |
| スコープ     | `--parallel` の runner の、統合の commit 以外の同期の処理               |
| スケジュール | 親の検証が終わってから次へ進むまでに、平均約 30 秒、最大約 140 秒かかる |
| コスト       | 一括実行の全体の時間が延びる                                            |
| 品質         | 計測の値（`duration_ms`）が実際の検証の時間より長く出る                 |
| 関係者       | DEV（実装）、オーケストレーター（一括実行の運用）                       |

## 4. 対応方針

| 項目     | 内容                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------ |
| 原因     | `npm ci`・`specdojo build`・root への merge の同期待ちが event loop を停止。6.2 の再現計測で確認 |
| 対応策   | 計測で処理を特定し、処理の動きを長く止めるものを非同期にするか子のプロセスへ移す                 |
| 依存事項 | なし                                                                                             |
| 完了条件 | 「完了条件」の章のとおり                                                                         |

## 5. 完了条件

- 遅れの原因の処理を計測で特定し、処理ごとの平均と最大の時間を個票の対応結果に表で書く。
- 処理の動きを長く止めるものを、非同期にするか子のプロセスへ移す。統合の順序と lock の扱いは変えない。
- 目標は、`--parallel 3` の実行で `detection_lag_ms` の平均 5 秒以下、最大 30 秒以下とする（2026-11-26 indie の決定）。
- 単体テストで、移した処理の順序と lock の扱いが変わらないことを確かめる。
- 統合の後に、オーケストレーターが `--parallel 3` で数件流し、計測の値を確かめる。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 保護された設定（`.specdojo/exec-defaults.yaml`・オーケストレーターの本文など）は変えない。変更が要る場合は、案を個票の対応結果と報告の `handoff` に書く。反映は利用者の承認のもとで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 統合の後に、オーケストレーターが実際の run を流して動きを確かめてから close する（executor は行わない）。

## 6. 対応結果

### 6.1. 作業内容

| 作業                                 | 状態 | メモ                                                                                                                                                              |
| ------------------------------------ | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 同期処理の計測と原因の確認           | done | 依存導入・生成・merge の一時リポジトリで同期版と非同期版を各 3 回比較。条件と数値は次節。                                                                         |
| 非同期化と呼び出し元の更新           | done | 準備、checkpoint、統合、親検証前の YAML ページ再生成を順に待つ。lock の取得待ちも非同期化。                                                                       |
| 順序・排他・終了検出の回帰テスト追加 | done | 単体・統合テストを追加し、既存テストを Promise に対応。実行は親 runner が担当。                                                                                   |
| sandbox での検証                     | done | ソースのビルドと再現計測を実行。整形・文書検査の結果は executor evidence に記録する。                                                                             |
| 親検証の失敗箇所の修正               | done | テストの `import()` 型注釈を型専用 import に変更し、`mergeProject` のコールバックが数値を返さないよう修正。型検査・lint の再実行は親 runner が担当する。          |
| 統合後の実際の並列実行               | open | オーケストレーターが agent CLI を起動して使用量を消費する検査のため executor は行わない。`--parallel 3` の数件で目標値と統合失敗の有無を確認してから close する。 |

### 6.2. 計測と原因

`npm ci`・worktree の `specdojo build` は `spawnSync`、root の merge は同期の `gitResult` を使っていた。いずれも子が終了するまで runner の event loop を止める。merge の post-merge hook と、その後の `build-if-stale` も同じ待ち方だった。

一時リポジトリで実際の `npm ci`・`specdojo build`・`git merge --no-ff` を動かし、同時に 100 ms 後に最後の出力を書いて終了する検証の子を起動した。各処理を同期・非同期それぞれ 3 回計測した。npm は外部依存なしで install script を 500 ms 待たせ、build は登録簿だけを持つ 2 project、merge は 1 ファイルの差分と 500 ms 待つ pre-merge-commit hook を使った。単位は ms、各セルは平均 / 最大。

| 処理             | 同期の所要時間 | 同期の検出遅延 | 非同期の所要時間 | 非同期の検出遅延 |
| ---------------- | -------------: | -------------: | ---------------: | ---------------: |
| `npm ci`         |      671 / 680 |      556 / 566 |        683 / 695 |            3 / 3 |
| `specdojo build` |      894 / 907 |      775 / 791 |        892 / 895 |            2 / 3 |
| root への merge  |      519 / 521 |      399 / 410 |        517 / 524 |            3 / 3 |

所要時間がほぼ同じまま検出遅延が小さくなるため、これらの待ち方が終了検出を止めることを確認できた。これは小さな再現ケースであり、入力の最大約 140 秒を処理別に配分した計測でも、実際の `--parallel 3` の目標達成の証拠でもない。実運用では runner の標準エラーに出す `worktree-operation-timing` の `operation`・`at`・`duration_ms`・`event_loop_delay_max_ms` と、従来の `validation-exit-timing` を突き合わせる。

### 6.3. 実装と回帰確認

- `worktree-process.ts` に終了まで非同期で待つ起動と処理別の計測を集約した。継承する出力、cwd、環境、起動失敗・非ゼロ終了の扱いを保つ。YAML ページ再生成では従来どおり出力を上限付きで保存する。
- 依存導入から生成・checkpoint commit までを順に待つ。プロダクトも `Promise.all` にせず宣言順に処理する。再利用時の生成、失敗時の worktree 保持を維持した。checkpoint と post-review の commit も非同期に待つ。
- root・プロダクトの merge と bookkeeping 競合の解決 commit、merge 後の dist 更新を非同期にした。`withTaskIntegrationLock` と scheduler lock の内側で完了まで待ち、abort・root 作業コピーの復元・lock 解放の順序を保つ。
- scheduler lock の同期版と非同期版は、取得・stale 判定・timeout の判断を共有する。runner の取得待ちを非同期版に揃え、merge が lock を持つ間に別タスクの同期待ちが event loop を止めることを避けた。

単体テストは依存導入・生成の順序、失敗後の打ち切り、非同期 merge が終わるまでの統合の排他、失敗後の排他解放、scheduler lock の競合と timeout を確かめる。統合テストは遅い子プロセスの実行中の検証終了検出、merge hook 実行中の lock 保持を確かめる。既存の準備・複数リポジトリ・競合復旧のテストも呼び出しを `await` に更新した。指定された単体・統合テスト、型検査と lint は親 runner が実行する。

再開時に前回の親検証を確認し、単体・統合テストは成功、`lint:ts` と `typecheck` はテスト内の上記 2 点で失敗していた。両方を修正し、`register-resume.ts`・`schedule-prepare.ts`・`trial-commands.ts` を含む非同期化した関数の呼び出し元が、Promise を待つか呼び出し元へ返すことを確認した。修正後の親検証の成否は runner の再実行結果を正とする。

### 6.4. 判断と申し送り

- 呼び出し元まで Promise に揃えた。同期版と非同期版の準備・merge を重複して持つと順序や復旧処理がずれるため、処理本体を共有し、既存 CLI の完了待ちも更新する方法を選んだ。
- merge を非同期にすると、同じ lock を同期で待つ別タスクが merge 自身の完了処理を止めうる。このため、取得方法だけを非同期化し、lock の場所・timeout・stale 条件・保持範囲は変えない。
- 統合後、オーケストレーターが `--parallel 3` で数件実行し、`detection_lag_ms` の平均 5 秒以下・最大 30 秒以下、統合順序・失敗数を確認する。実際の処理別所要時間も平均・最大を集計してこの個票へ追記する。実測前に close しない。
- 保護された設定と登録簿の状態は変更していない。result は reporter / runner が記入する。

### 6.5. CHANGELOG に書く事項

- 区分: 不具合修正。
- 文案: `exec run --parallel` の依存導入・生成・merge と lock 待ちを非同期化し、別タスクの親検証の終了検出が遅れる問題を軽減した（PJR-CSRM）。

## 7. 関連ドキュメント

- [[prj-0001:pjr-p8sx-parallel-validation-slot-held|PJR-P8SX 統合の commit の非同期化]]
- [[specdojo:exec-worktree-guide|exec worktree運用ガイド]]
