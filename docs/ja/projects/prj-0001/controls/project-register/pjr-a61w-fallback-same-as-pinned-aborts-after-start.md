---
specdojo:
  id: prj-0001:pjr-a61w-fallback-same-as-pinned-aborts-after-start
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  difficulty: hard
  registered_at: "2026-10-31T21:59:04Z"
  completed_at: "2026-11-17T03:12:12Z"
  conclusion: 代わりの executor が振り分けと重なる指定は start の前に終了コード 1 で止まり、個票・worktree・HEAD を変えない
  commit_type: fix
  commit_scope: exec
---

# PJR-A61W 代わりの executor が振り分けと重なると start の後に止まり、終了コード 0 で終わる

## 1. 課題内容

exec run --register で --executor-by に振り分けの代わりと同じ agent を指定すると、start の記帳の後に止まり、記帳を commit しないまま終了コード 0 で終わる

## 2. 入力

- prj-0002:PJR-7MB3 の実行で見つけた。prj-0001 の設定は prj-0002 を持たないため、由来は --from ではなくここに書く
- 2026-11-01、prj-0002 の作業ツリーで specdojo 0.6.0 の exec run --project prj-0002 --register PJR-7MB3 --worktree --executor-by sol-executor --reporter-by gemma-reporter を流した。PJR-7MB3 は difficulty medium で、routing.medium の `fallback_executor_by` は sol-executor
- 出力は worktree の setup の後に「Fallback executor must differ from the pinned agent: sol-executor」で止まり、executor は起動しなかった。終了コードは 0 だった
- 止まった後、PJR-7MB3 は start の記帳で in-progress になり、作業ツリーに start のイベント・個票の状態・plan と result の雛形が commit されずに残った。worktree（exec/prj-0002-PJR-7MB3）も残った
- その後 --force-restart で flash-executor を使って流し直すと review まで通ったが、新しい start は記帳されず、イベントの start の actor は実際には動かなかった sol-executor のまま残った（review の actor は flash-executor）。止まった run の plan は commit されずに残り、result は superseded として commit された
- 検査は src/exec/run/shared.ts の代わりの agent の解決（resolution.actor === primary.actor で throw）にある
- 直し方（検査を start の前に移す、振り分けの代わりが指定の agent と同じときは代わりなしとして扱う、など）は executor が決めて、理由を個票の対応結果に書いてよい

## 3. 影響範囲

| 観点         | 影響                                                                               |
| ------------ | ---------------------------------------------------------------------------------- |
| スコープ     | register pipeline 通常実行の開始前検査（in-place / worktree、複数 ID、強制再実行） |
| スケジュール | 変更なし                                                                           |
| コスト       | 不正な fallback 設定での不要な worktree 準備を回避                                 |
| 品質         | 未起動 agent の start 記帳と未 commit の雛形の残留を防止                           |
| 関係者       | register pipeline の利用者、runner の保守担当                                      |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 指名 agent の fallback 解決が agent 起動直前にあり、start と worktree 準備を終えてから同一 agent を拒否していた。現在の CLI は例外を終了コード 1 にするが、検査の順序は遅いままだった。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 対応策   | routing 適用後、全選択項目の指名 executor・reporter と fallback を開始前に解決・検査し、既存の CLI エラー処理で終了コード 1 にする。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 依存事項 | 保護設定の変更は不要。型・lint・単体・統合テストは親 runner の検証に委ねる。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 完了条件 | 代わりの executor が指定の agent と同じになる場合を start の記帳の前に判定する。止める場合は 0 以外の終了コードで終え、start の記帳・plan と result の雛形・worktree を残さない（止めるか代わりなしとして流すかは executor が決める）。`--force-restart` で流し直したとき、start の actor が実際に動いた agent になる。routing.medium の `fallback_executor_by` と同じ `--executor-by` を指定する回帰テストを足す。迷った点は executor が決め、決めた内容と理由を個票の対応結果に書き、報告の `handoff` にも書く。`CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く（影響がなければ「なし」、PJR-EPQ3）。保護された設定（`.specdojo/`・`package.json`・`.agents/`・`.claude/`・`.codex/`・`lefthook.yml` など）は変えず、変更が要る場合は案を個票の対応結果と `handoff` に書く。`npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る。 |

## 5. 対応結果

### 5.1. 判断と実装

同一 agent の fallback は設定エラーとして開始前に拒否する。代わりなしへの暗黙の変更は、利用者が指定した rate limit・接続不能時の切替方針を変えるため採用しない。`runRegisterMode` で全 ID の routing と CLI 指定を解決した後、既存の `resolvePinnedRateLimitRunOptions` を呼び、plan/result の生成・start・worktree 準備に入る前に検査する。エラーは既存の CLI catch で終了コード 1 になる。

再開（`--resume`）は保存された actor を使う既存経路を維持し、通常実行と `--force-restart` を対象とした。過去の run のイベントを遡って書き換えず、不正設定の試行に start を作らないことで、修正後の強制再実行に実際の executor の start だけを記録する。

### 5.2. 作業内容と検証

| 作業           | 状態 | メモ                                                                                                                                                                                                                                                                                                                                                                     |
| -------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 開始前検査     | done | 全 ID の指名 executor・reporter と fallback を副作用前に検査する。                                                                                                                                                                                                                                                                                                       |
| 回帰テスト追加 | done | `routing.medium` の fallback と CLI 指名の衝突を両実行モードで確認。後続 ID の衝突でも先行 ID を開始しないこと、終了コード 1、個票・イベント・plan/result・worktree・HEAD が変わらないことを検査する。修正後の `--force-restart` が review まで通り、start と review の actor が実行した executor になることも検査する。実行は親 runner の `test-integration` に委ねる。 |
| 設定ガイド更新 | done | 開始前の拒否、終了コード、再実行方法を記載した。                                                                                                                                                                                                                                                                                                                         |
| 整形・文書検証 | done | Prettier、履歴リンク、catalog 検証、register の生成が成功。catalog は既存参照の警告あり。型・lint・単体・統合テストは指定された親検証に委ねる。                                                                                                                                                                                                                          |

### 5.3. 申し送り

統合後は運用メモに従い、PJR-JSEY で実 agent の start から review と actor を確認してから close する。実 agent CLI の起動と利用枠消費を伴うため executor sandbox では実施しない。保護設定の変更案はない。

### 5.4. CHANGELOG に書く事項

- 区分: 不具合修正。
- 文案: `exec run --register` で指名 agent が難易度別 routing の fallback と重なる場合、start の記帳や plan/result・worktree の作成前に終了コード 1 で停止するよう修正。

## 6. 関連ドキュメント

- [[specdojo:exec-config-guide|exec 設定ガイド]]
- [[prj-0001:pm-orchestrator-playbook|オーケストレーター運用メモ]]
