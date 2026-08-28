---
specdojo:
  id: prj-0001:pjr-6hf3-hook-script-dependency-free-entry
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: ARC
  registered_at: "2026-08-22T23:09:24Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-22T23:52:46Z"
  conclusion: hook から起動する入口を Node 標準だけで動く tools/build-if-stale.mjs へ置き換えた。linked worktree と依存未インストールを委譲より前に判定するため、node_modules の無い新規 worktree でも hook が失敗しない。tsx の CLI は package.json の bin から解決し、PATH やパッケージ内部のレイアウトに依存しない。
  register_events:
    - v: 1
      id: reg_303bd29b9f618463353c6af0b0874fff
      ts: "2026-08-22T23:15:09Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(register): hook 入口の依存問題を PJR-6HF3 として起票"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: git hook から呼ぶスクリプトが devDependency に依存し、新規 worktree で失敗する
        - field: description
          from: ""
          to: post-checkout hook が npm run build:if-stale を実行し、その実体は tsx src/build-if-stale.ts である。exec run --worktree が新規 worktree を作る時点では node_modules が無く、tsx を解決できずに hook が非ゼロ終了する。その結果 git worktree add が失敗し、checkpoint failed として claim がロールバックされる。build-if-stale.ts には linked worktree なら何もしない判定を入れてあるが、その判定へ到達する前に起動が失敗しており、ガードが自分の前提条件に依存する構造になっている。routine 経由の自動実行が claim と release を繰り返す状態になっている。
        - field: type
          from: ""
          to: issue
        - field: priority
          from: ""
          to: high
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-23"
        - field: due
          from: ""
          to: "2026-08-31"
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: b2ffca8d1aab1913bf7b325f8025ee9195b82baf
    - v: 1
      id: reg_e0a322dfa2b9ea8a1a327178e267575f
      ts: "2026-08-22T23:15:28Z"
      action: start
      actor: SpecDojo Test
      from_status: open
      to_status: in-progress
      reason: "exec(register PJR-6HF3): start"
      changes:
        - field: status
          from: open
          to: in-progress
      legacy_commit: 95125b34f7960c82e197064c5d87d2c1255a18db
      previous_event_id: reg_303bd29b9f618463353c6af0b0874fff
    - v: 1
      id: reg_1187ba50dd0f0e3d7c640216281bf696
      ts: "2026-08-22T23:38:19Z"
      action: wait
      actor: SpecDojo Test
      from_status: in-progress
      to_status: waiting
      reason: "exec(register PJR-6HF3): wait"
      changes:
        - field: status
          from: in-progress
          to: waiting
        - field: conclusion
          from: "-"
          to: "agent exited with non-zero code: agent exited with non-zero code: agent-config-write: protected configuration changes detected; paths=lefthook.yml, package.json; agent must record the required change …"
      legacy_commit: 93a7e53ada1cfab0a0bee93fabc085de64de6539
      previous_event_id: reg_e0a322dfa2b9ea8a1a327178e267575f
    - v: 1
      id: reg_db6a9911601db019031ab6705253cc68
      ts: "2026-08-22T23:41:18Z"
      action: review
      actor: SpecDojo Test
      from_status: waiting
      to_status: review
      reason: "exec(register PJR-6HF3): review"
      changes:
        - field: status
          from: waiting
          to: review
      legacy_commit: 6214d673b265f4eeb4a3e727bfcf9c212723bcd3
      previous_event_id: reg_1187ba50dd0f0e3d7c640216281bf696
    - v: 1
      id: reg_a4c311e0eb93055b5a84a02459730ab3
      ts: "2026-08-22T23:52:46Z"
      action: close
      actor: SpecDojo Test
      from_status: review
      to_status: done
      reason: "exec(register PJR-6HF3): close"
      changes:
        - field: status
          from: review
          to: done
        - field: completed
          from: "-"
          to: "2026-08-23"
        - field: conclusion
          from: "agent exited with non-zero code: agent exited with non-zero code: agent-config-write: protected configuration changes detected; paths=lefthook.yml, package.json; agent must record the required change …"
          to: hook から起動する入口を Node 標準だけで動く tools/build-if-stale.mjs へ置き換えた。linked worktree と依存未インストールを委譲より前に判定するため、node_modules の無い新規 worktree でも hook が失敗しない。tsx の CLI は package.json の bin から解決し、PATH やパッケージ内部のレイアウトに依存しない。
      legacy_commit: 4b003886bfc36ef7fb6b2063ce583dbcef44dd98
      previous_event_id: reg_db6a9911601db019031ab6705253cc68
---

# PJR-6HF3 git hook から呼ぶスクリプトが devDependency に依存し、新規 worktree で失敗する

## 1. 課題内容

post-checkout hook が npm run build:if-stale を実行し、その実体は tsx src/build-if-stale.ts である。exec run --worktree が新規 worktree を作る時点では node_modules が無く、tsx を解決できずに hook が非ゼロ終了する。その結果 git worktree add が失敗し、checkpoint failed として claim がロールバックされる。build-if-stale.ts には linked worktree なら何もしない判定を入れてあるが、その判定へ到達する前に起動が失敗しており、ガードが自分の前提条件に依存する構造になっている。routine 経由の自動実行が claim と release を繰り返す状態になっている。

## 2. 影響範囲

| 観点         | 影響                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------ |
| スコープ     | worktree を新規作成する全タスク。`exec run --worktree` と routine 経由の `exec cycle` が該当する |
| スケジュール | 自動実行が claim と release を繰り返し、Ready タスクが進まない。実質的に自動実行が停止している   |
| コスト       | 追加の外部コストはなく、影響は復旧と再実行に要する作業時間                                       |
| 品質         | データ破損は起きない。ロールバックは正しく動作し、claim も解放されている                         |
| 関係者       | ARC（実装）。自動実行を利用する運用者                                                            |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                      |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | hook から呼ぶ入口が `tsx` に依存している。新規 worktree では `node_modules` が無く、TypeScript のガード（linked worktree なら何もしない）へ到達する前に起動が失敗する                                                                                     |
| 対応策   | Node 標準だけで動く plain JS の入口（`tools/build-if-stale.mjs` など）を追加し、linked worktree と依存未インストールを判定して即終了する。条件を満たす場合のみ既存の判定処理へ委譲する。`prepare` の `node tools/install-lefthook.mjs` と同じ方式に揃える |
| 依存事項 | なし。`npx tsx` へ切り替える案は、依存が無い環境ではレジストリ取得を試みるため採らない                                                                                                                                                                    |
| 完了条件 | 新規 worktree の作成で hook が失敗しないこと。primary worktree でのブランチ切り替えでは従来どおり再ビルド判定が働くこと                                                                                                                                   |

## 4. 対応結果

- Node 標準機能だけで起動する `tools/build-if-stale.mjs` を追加した。`.git` がファイルになる linked worktree では `node_modules` を確認する前に終了コード 0 で終了する。
- primary worktree ではローカルの `tsx` が存在する場合だけ `src/build-if-stale.ts` へ委譲し、従来の鮮度判定と再ビルドを維持した。依存未インストール時や委譲失敗時も、best-effort の hook を止めず終了コード 0 とする。
- `lefthook.yml` の `post-merge` / `post-checkout` と `package.json` の `build:if-stale` を、依存不要な入口を `node` で直接実行する形へ変更した。
- 回帰テスト `tests/tools/build-if-stale.test.ts` を追加し、linked worktree、依存未インストールの primary worktree、既存実装への委譲、委譲失敗の各経路を確認した。

検討時に却下した案を記録する。

- `npx tsx` へ切り替える: 新規 worktree では親ディレクトリを遡っても `node_modules` が無く、`npx` はレジストリ取得を試みる。ネットワークの無い実行環境では失敗し、ある環境でも worktree 作成のたびに取得が走る。
- `post-checkout` から外して `post-merge` だけにする: worktree 作成での失敗は消えるが、primary worktree でのブランチ切り替え後に dist が古いままになり、当初の目的を一部失う。

## 5. 関連ドキュメント

- hook を追加した項目: [[prj-0001:pjr-cmyx-exec-dist-parent-validations|PJR-CMYX exec 実行が古い dist ビルドを使い設定済み parent_validations が実行されない]]
- 同種の見落とし: [[prj-0001:pjr-x3e8-test-git-env-bare-repository|PJR-X3E8 テストの git 実行が環境を隔離せず、メインリポジトリを bare 化する]]
- 影響を受けた実行: `docs/ja/projects/prj-0001/execution/exec/events/` の `T-PLANNING-dct-index-010` の claim と release
- 変更対象: `tools/build-if-stale.mjs`、`tests/tools/build-if-stale.test.ts`、`lefthook.yml`、`package.json` の `build:if-stale`
- 同方式の前例: `tools/install-lefthook.mjs`
