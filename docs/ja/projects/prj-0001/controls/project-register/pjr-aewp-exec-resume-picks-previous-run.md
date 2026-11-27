---
specdojo:
  id: prj-0001:pjr-aewp-exec-resume-picks-previous-run
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
  registered_at: "2026-11-27T12:33:45Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-86RK
---

# PJR-AEWP worktree の用意で止まった run の --resume が、統合済みの前の run の統合をやり直す

## 1. 課題内容

同じ項目に統合済みの前の run があると、用意の段で止まった新しい run を --resume したとき、前の run の状態を拾って統合の段から再開し、executor が動かないまま統合に失敗する

## 2. 入力

- 2026-11-27 の PJR-86RK: 1 回目の run（pjr-86rk-20261127T105508Z-a3432ad6）は統合済み。2 回目の run（pjr-86rk-20261127T122100Z-b1757966）は worktree の用意で止まり、plan と result だけがあった
- exec run --register PJR-86RK --worktree --resume は「Syncing integration targets before integrate resume」として 1 回目の run の pipeline-state を使い、親の検証の後、統合の commit が index-build（生成した登録簿の索引がない）で失敗して waiting になった。develop の作業ツリーと index は汚れなかった

## 3. 影響範囲

| 観点         | 影響                                                        |
| ------------ | ----------------------------------------------------------- |
| スコープ     | register の worktree 準備・再開と pipeline の状態記録       |
| スケジュール | 準備失敗後に同じ run を再開でき、不要な統合のやり直しを防ぐ |
| コスト       | 準備・executor が未実行の run に対する不要な親検証を防ぐ    |
| 品質         | 最新 run の特定と統合前提の検査を回帰テストで固定する       |
| 関係者       | register の worktree 実行を利用する開発者・運用者           |

## 4. 対応方針

| 項目     | 内容                                                                                                                                     |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 準備前には pipeline の状態を保存せず、再開時は worktree 内に状態ファイルがある run だけを候補にしたため、新しい plan/result を見落とした |
| 対応策   | 止まった段を正しく記録し、`--resume` はその段から再開する                                                                                |
| 依存事項 | なし                                                                                                                                     |
| 完了条件 | 下の一覧のとおり                                                                                                                         |

完了条件:

- 同じ項目に統合済みの前の run がある状態で、worktree の用意（`specdojo build`・`exec refresh` などの checkpoint）の段で止まった `exec run --register --worktree` を `--resume` すると、用意の段からやり直し、executor・親の検証・reporter・統合の順に進む。executor を飛ばして統合の段から再開せず、統合済みの前の run の状態を拾わない。
- 原因（止まった段の記録のされ方と、`--resume` が段を選ぶ判断）を個票の対応結果に書いている。
- executor が動いていない run を統合の段から再開しようとした場合は、run を統合せず、理由を示して止まる。
- 統合テストで、用意の段で止まった run の `--resume` が executor から流れることを確かめている。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 保護された設定は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- 作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証の `test-integration` を通す。

## 5. 対応結果

### 5.1. 作業内容

| No  | 作業                              | 状態 | メモ                                                                                                  |
| --- | --------------------------------- | ---- | ----------------------------------------------------------------------------------------------------- |
| 1   | 原因調査と再開処理の修正          | done | 準備段の記録・復元、最新 run の選択、統合再開の前提検査を追加した                                     |
| 2   | 回帰テストと運用ガイドの更新      | done | 統合済みの前 run がある状態での準備失敗と旧形式の復元、未実行 executor の統合拒否を追加した           |
| 3   | executor が担当する整形・文書検査 | done | 検査結果は executor evidence に記録する。型検査・lint・単体／統合テストは pipeline の親検証が実行する |

### 5.2. 原因と変更

従来は plan/result を root に生成した後、worktree の依存導入・生成物の build・checkpoint を済ませてから `runAgentPipeline` が初めて状態を保存していた。このため、準備失敗時には新しい run に状態がなく、worktree に継承された統合済み run の状態だけが候補に残った。再開段は executor と reporter の成功から統合と推定され、選択も run の作成順ではなく `updated_at` の順だった。

修正後は、準備前に `stages.prepare` と未実行の executor/reporter、plan/result の参照、統合先の指定を保存する。準備の失敗も root と残存 worktree に記録し、再開時は同じ plan/result・run ID を使って準備と checkpoint をやり直す。準備成功後は通常の executor → 親検証 → reporter → 統合へ進む。

最新 run は root と worktree 双方の run ディレクトリと、run ID の作成日時から特定する。最新状態が壊れている場合や入力が欠けている場合は、理由を示して停止し、古い run に遡らない。旧 runner が plan/result だけを残した場合は、項目が一致する未完了の入力が揃い、executor/reporter の実行記録がないときだけ準備段として復元する。

統合再開の入口でも、executor・reporter の成功と対象 run に一致する executor evidence を検査する。executor 未実行なのに reporter が成功済みと記録された不整合は、状態遷移・同期・統合の前に拒否する。

### 5.3. 確認と申し送り

単体テストには、準備中断と失敗、準備成功直後の中断、前 run の更新時刻が新しい場合、最新状態の破損・入力欠損、executor 未実行の拒否を追加した。統合テストには、前 run を実際に統合してから次 run の build を失敗させ、記録済み形式と plan/result のみの旧形式の両方で、同じ run の executor と親検証を経て統合するケースを追加した。統合前提が不整合のときに両作業ツリーの HEAD・差分と waiting 状態を維持するケースも追加した。

テスト・型検査・lint はこの executor では実行せず、終了後の親 runner に設定された `typecheck`・`lint-ts`・`test-unit`・`test-integration` などで確認する。実行済みの整形・catalog・履歴リンク・schema 検査の結果は executor evidence を参照する。保護された設定の変更は不要であり、`CHANGELOG.md` と result は編集していない。

### 5.4. CHANGELOG に書く事項

- 区分: 不具合修正
- 文案: register の worktree 準備で止まった run を `--resume` したとき、統合済みの前 run を拾わず、同じ run の準備から executor・検証・reporter・統合を再開するよう修正した。

## 6. 関連ドキュメント

- [[specdojo:exec-operation-guide|exec運用ガイド]] の register pipeline の再開条件。
