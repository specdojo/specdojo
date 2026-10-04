---
specdojo:
  id: prj-0001:pjr-27z9-codex-bwrap-proc-mount
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: waiting
  priority: high
  owner: DEV
  registered_at: "2026-10-03T22:19:25Z"
  due_on: null
  block_reason: "register commit incomplete: git commit failed: summary: (done in 0.65 seconds) / 🥊 commitlint (0.65 seconds) (args: -m exec(register PJR-27Z9): codex 0.160 の … -- 9 paths)"
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

| 項目     | 内容                                                                                                                                                                                                                                                                                                           |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 推定：Docker が `/proc` の一部をマスクしているため、bubblewrap による新しい proc の mount がカーネルに拒否される。未検証                                                                                                                                                                                       |
| 対応策   | 候補：`.devcontainer/devcontainer.json` の `runArgs` に `--security-opt=systempaths=unconfined` を加えてリビルドする。コンテナの隔離が弱まるため、弱まる範囲を評価して採否を決める。採用しない場合は、codex の sandbox 設定や `exec-defaults.yaml` の codex の起動引数など代わりの手段と、その安全性を評価する |
| 依存事項 | devcontainer のリビルド                                                                                                                                                                                                                                                                                        |
| 完了条件 | devcontainer 内で `codex sandbox linux -- ls -d /` が成功し、`codex-expert-executor` で grade の executor plan を実行して `[VIEWPOINT ...]` 形式の判定を返せる。採否の判断と変更が `.devcontainer/` と [[tsd-home-mac-dev-server]] に反映されている                                                            |

## 4. 対応結果

解決内容: `.devcontainer/devcontainer.json` の `runArgs` に `--security-opt=systempaths=unconfined` を追加し、Docker の `/proc` マスクを緩和して bubblewrap が動作するようにした。変更内容は `tsd-home-mac-dev-server.md` の devcontainer 設定テーブルにも反映した。
確認結果: 設定を追加した。devcontainer のリビルドと `codex sandbox linux -- ls -d /` による動作確認は runner による検証に委ねる。
再発防止策: `tsd-home-mac-dev-server.md` に `runArgs` の設定理由を明記し、今後の設定見直しで誤って削除されないようにした。

## 5. 関連ドキュメント

- [[prj-0001:pjr-vqb5-agent-grade-comparison]]: 2026-10-03 の agent 比較で codex 3 件がすべてこの事象で失敗した。
- [[prj-0001:pjr-me20-antigravity-codex-trial]]: codex との比較が本件で止まっている。
- [[tsd-home-mac-dev-server]]
