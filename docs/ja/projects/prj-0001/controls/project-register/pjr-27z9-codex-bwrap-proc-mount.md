---
specdojo:
  id: prj-0001:pjr-27z9-codex-bwrap-proc-mount
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-10-03T22:19:25Z"
  due_on: null
  completed_at: "2026-10-04T04:41:35Z"
  conclusion: システムの bubblewrap を外し codex 同梱の bwrap を使わせて解決した。systempaths=unconfined は隔離を弱めるため採用しない。codex sandbox と codex-expert-executor の grade を確認済み
---

# PJR-27Z9 codex 0.160 の bubblewrap sandbox が devcontainer 内で /proc をマウントできず exec と grade が失敗する

## 1. 課題内容

2026-10-03 のリビルドで codex が 0.160.0 になり、Linux sandbox が bubblewrap 必須になった。devcontainer 内では bwrap: Can't mount proc on /proc: Operation not permitted で起動に失敗し、codex の executor はファイルを読めず異常終了する（`codex sandbox linux -- ls -d /` でも再現する）。旧方式の landlock（`features.use_legacy_landlock`）は、ファイル制限を伴う実行で「bubblewrap が必要」として panic するため回避策にならない。`codex-*` member を使う exec と grade が失敗する。

## 2. 影響範囲

| 観点         | 影響                                                                                                                                                                                                                                   |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `codex-*` member（executor / reporter）を使う exec、grade、exec trial がすべて失敗する。定期の grade（`job-grade-kata` / `job-grade-deliverable`）は `agy-expert-executor` を使うため影響しない（2026-10-04 の定期実行は成功している） |
| スケジュール | codex を前提にした比較（[[prj-0001:pjr-me20-antigravity-codex-trial]]）が進められない                                                                                                                                                  |
| コスト       | 自動選択で codex が選ばれると、失敗と再選択で実行時間を浪費する                                                                                                                                                                        |
| 品質         | codex の executor は異常終了を申告し判定を出さないため、誤った結果は記録されない                                                                                                                                                       |
| 関係者       | DEV（devcontainer の保守）                                                                                                                                                                                                             |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | Dockerfile で入れたシステムの bubblewrap 0.12.0 は `/proc` の mount に失敗したときのエラー文が codex の想定と異なり（`/newroot/proc` ではなく `/proc`）、codex が `/proc` を mount しない方式へ切り替えられない（openai/codex#44329）。Docker が `/proc` の一部をマスクしていることが mount の失敗の原因                                                                                                                    |
| 対応策   | システムの bubblewrap を外し、codex 同梱の bwrap（`~/.codex/packages/standalone/current/codex-resources/bwrap`）を使わせる。codex は PATH 上の `bwrap` を優先し、なければ同梱版を使う。`runArgs` に `--security-opt=systempaths=unconfined` を加える案は、Docker がマスクしている `/proc`・`/sys` を読み書きできるようにし、`node` の sudo 経由で Docker Desktop の VM のカーネル設定まで変更できるようになるため採用しない |
| 依存事項 | devcontainer のリビルド                                                                                                                                                                                                                                                                                                                                                                                                     |
| 完了条件 | devcontainer 内で `codex sandbox linux -- ls -d /` が成功し、`codex-expert-executor` で grade の executor plan を実行して `[VIEWPOINT ...]` 形式の判定を返せる。採否の判断と変更が `.devcontainer/` と [[tsd-home-mac-dev-server]] に反映されている                                                                                                                                                                         |

## 4. 対応結果

解決内容: `.devcontainer/Dockerfile` からシステムの `bubblewrap` を削除し、codex 同梱の bwrap が使われるようにした。exec（agy-expert-executor）が加えた `runArgs` の `--security-opt=systempaths=unconfined` は、コンテナの隔離を弱めるため取り消した。理由を [[tsd-home-mac-dev-server]] の devcontainer 設定に記載した（コミット 3802bd5a2）。

確認結果（2026-10-04、現行コンテナで `apt-get remove bubblewrap` を実行した状態）:

- `codex sandbox -- sh -c 'ls -d /; head -1 package.json; touch /etc/x'` は、読み取りに成功し、`/etc` への書き込みは「読み込み専用ファイルシステム」で拒否された。sandbox の保護が効いている。
- `codex-expert-executor` で grade の executor plan（`trc-requirements-to-tests-rulebook`）を実行し、326 秒で 23 観点の `[VIEWPOINT ...]` を返した。`grade apply --dry-run` の検証を通過し、score 62（major 17・minor 3）だった。

再発防止策: システムの bubblewrap を入れない理由を設計書に明記した。codex が上流で判定を直した場合（openai/codex#44329）も、同梱版を使う構成のままでよい。

exec の実行の経緯: 1回目の実行（agy-expert-executor / gemma-reporter）は `systempaths=unconfined` を加えて「解決」と記録したが、隔離の評価とリビルド後の確認がなかった。自動 commit はヘッダー長で失敗した（[[prj-0001:pjr-daw8-register-commit-header-length]]）。

## 5. 関連ドキュメント

- [[prj-0001:pjr-vqb5-agent-grade-comparison]]: 2026-10-03 の agent 比較で codex 3 件がすべてこの事象で失敗した。
- [[prj-0001:pjr-me20-antigravity-codex-trial]]: codex との比較が本件で止まっている。
- [[tsd-home-mac-dev-server]]
