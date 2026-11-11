---
specdojo:
  id: prj-0001:pjr-mjeh-night-register-integrate-and-report-checks
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  registered_at: "2026-11-11T13:31:42Z"
  completed_at: "2026-11-11T14:58:09Z"
  conclusion: PJR-A7CR で直した。夜間の routine は統合と job の review まで通る
  derived_from:
    - PJR-RX14
---

# PJR-MJEH 夜間の register の統合と朝報告が、job の worktree で検査に落ちる

## 1. 課題内容

job の worktree への merge が commitlint で落ち、朝報告の frontmatter が lint-fm で落ちるため、夜間の routine が最後まで通らない

## 2. 入力

- 2026-11-11 の PJR-0X0S の確認で夜間の routine を 1 回流した（JBR-night-approved-register-44790542c979）。子の run の親の検証は通ったが、統合で commitlint が .git/worktrees/`<job>``/COMMIT_EDITMSG` を見つけられず失敗し、job の review の段で朝報告 night-orchestrator-20261111T130227127Z.md が lint-fm（type: report・rulebook なし）で落ちた

## 3. 影響範囲

| 観点         | 影響                                                                                      |
| ------------ | ----------------------------------------------------------------------------------------- |
| スコープ     | 公開済みの `orchestrator night` と、夜間の register の routine                            |
| スケジュール | 直るまで `rtn-night-approved-register` を止める。0.8.0 のリリース（PJR-PMK6）の前提にする |
| コスト       | 夜間に流す予定の項目を日中に流す手間                                                      |
| 品質         | merge のときに古い `COMMIT_EDITMSG` を commitlint が検査している可能性がある              |
| 関係者       | indie（夜間の承認）、orchestrator                                                         |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | 見立て: merge の commit-msg の hook でメッセージのファイルが渡らず、commitlint が既定の `COMMIT_EDITMSG` を探す。朝報告は生成の雛形が frontmatter の schema と見出しの決まりに合っていない |
| 対応策   | PJR-A7CR で直す                                                                                                                                                                            |
| 依存事項 | -                                                                                                                                                                                          |
| 完了条件 | PJR-A7CR が close され、夜間の routine が統合と job の review まで通る                                                                                                                     |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-rx14-night-register-env-leak]]
- [[prj-0001:pjr-a7cr-night-register-integrate-and-report-fix]]
