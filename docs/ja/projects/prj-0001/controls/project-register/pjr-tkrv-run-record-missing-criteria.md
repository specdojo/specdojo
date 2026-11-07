---
specdojo:
  id: prj-0001:pjr-tkrv-run-record-missing-criteria
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  registered_at: "2026-11-07T06:34:19Z"
  derived_from:
    - PJR-JT5J
  depends_on:
    - PJR-KC0T
---

# PJR-TKRV 一部だけ残った実行記録を片付け、記録の置き場所の検査を CI に入れる

## 1. 概要

PJR-KC0T の後に残る、記録の一部だけがある run のディレクトリ（14 件ほど）を片付け、--records-only を流す CI の workflow を反映する

## 2. 入力

- 由来: PJR-JT5J の統合後の exec validate の欠落のうち、過去の世代の記録でないものが 14 件ほど残る。例: result だけ（PJR-2219）、plan だけ（PJR-TNDH）、integrate.log だけ（PJR-283N）、pipeline-state.json だけ（PJR-PZBP）、evidence.json がない（PJR-23DT）（2026-11-07）
- JT5J の個票の対応結果に CI の workflow の案（.github/workflows/check-run-record-layout.yml、--records-only を流す）がある。保護された設定のため、反映は利用者の承認のもとで行う（2026-11-07）
- 決定: 過去の世代の記録を正常として扱う基準は PJR-KC0T で決める。この項目は残った記録の片付けと CI の反映だけを扱う（2026-11-07 indie が決定）

## 3. 完了条件

- `--records-only` で一部だけと判定された run を 1 件ずつ確かめ、同じ項目に完全な記録が別にあるものを外す（2026-11-07 indie が A 案を決定）。
- 同じ項目に完全な記録がない run も外す（2026-11-07 indie が決定）。
- develop で `npx specdojo exec validate --project prj-0001 --records-only` が終了コード 0 になる。
- `.github/workflows/check-run-record-layout.yml` を、利用者の承認のもと feature ブランチで足し、develop へ統合する。

## 4. 作業内容

| No  | 作業                            | 担当                  | 状態 | メモ               |
| --- | ------------------------------- | --------------------- | ---- | ------------------ |
| 1   | 完全な記録が別にある 8 件を外す | specdojo-orchestrator | done | `384035390`        |
| 2   | 完全な記録がない 5 件を外す     | specdojo-orchestrator | done | 12 ファイルの削除  |
| 3   | CI の workflow を足す           | specdojo-orchestrator | done | `380ffef24` で統合 |

## 5. 対応結果

- 一部だけ残った 13 件の run を確かめた。同じ項目に完全な記録が別にある 8 件（PJR-2219・PJR-283N・PJR-B0B8・PJR-JSEY・PJR-K87Y・PJR-PZBP・PJR-VGNG・PJR-YK1C）を `git rm` で外した（commit `384035390`）。
- 完全な記録がない 5 件（PJR-23DT・PJR-MBVM・PJR-MH9E・PJR-TNDH・schedule の `T-LAUNCH-prj-stakeholder-register-010`）も外した。どれもその run のただ 1 つの記録で、Git の履歴には残る。
- 2026-11-07 に develop で `npx specdojo exec validate --project prj-0001 --records-only` が終了コード 0（`OK: run record layout validation passed`）になることを確かめた。
- `.github/workflows/check-run-record-layout.yml` を `feature/prj-0001/run-record-layout-ci` で足し（commit `144e63e09`）、develop へ `--no-ff` で統合した（`380ffef24`）。push と pull request・手動で起動し、`--records-only` と単体テスト 2 本（`run-records`・`validate-records`）を流す。feature の worktree で両方の手順が通ることを確かめた（単体テスト 38 件）。
- 残課題: 既にある workflow の書き方（node の版など）とそろっているかは、読み取りの権限がなく確かめていない。GitHub 上で初めて動いた結果を確かめる。

## 6. 関連ドキュメント

- [[prj-0001:pjr-kc0t-validate-missing-records-warn]]: 過去の世代の記録を正常として扱う基準
- [[prj-0001:pjr-jt5j-exec-run-record-layout-check]]: 置き場所の検査と CI の案
