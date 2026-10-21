---
specdojo:
  id: prj-0001:xrp-pjr-jsey-20261018T150415Z-d71e-post-review
  type: exec-plan
  rulebook: none
  task_id: PJR-JSEY-post-review
  name: "PJR-JSEY exec-run.ts の分割後に runner の動作を確かめる の統合後レビュー"
  mode: review
  status: ready
  project_id: prj-0001
  origin: register
---

# Register Post-run Review Plan: PJR-JSEY exec-run.ts の分割後に runner の動作を確かめる

## 1. このフェーズで行うこと

`exec run --register` が統合した変更を読み取り専用で確認し、登録項目を自動で close できるかを判定する。

この review は成果物の grade ではなく、登録項目の完了判定である。grade サイドカーの有無や鮮度は判定条件にしない。verdict は `complete`、`complete-with-findings`、`incomplete` のいずれかにする。

## 2. 確認対象

- 登録項目: `docs/ja/projects/prj-0001/controls/project-register/pjr-jsey-exec-run-split-smoke.md`
- edit plan: `docs/ja/projects/prj-0001/execution/exec/plans/pjr-jsey-20261018T150415Z-d71e-plan.md`
- edit result: `docs/ja/projects/prj-0001/execution/exec/results/pjr-jsey-20261018T150415Z-d71e-result.md`
- executor evidence: `docs/ja/projects/prj-0001/execution/exec/evidence/PJR-JSEY/20261018T150415833Z-ddd3748b/evidence.json`
- 統合前 commit: `ad386c926b2b9e7f47f2891d57f7f10d98fd559a`
- 統合後 commit: `82170d2bf7c11ecac44d6e0482a310e8ee7660b7`
- review result: `docs/ja/projects/prj-0001/execution/exec/results/pjr-jsey-20261018T150415Z-d71e-post-review-result.md`

## 3. 完了条件

1. 登録項目の「完了条件」を edit result、統合差分、検証結果と照合している。
2. `ad386c926b2b9e7f47f2891d57f7f10d98fd559a..82170d2bf7c11ecac44d6e0482a310e8ee7660b7` の差分に対象外の変更が混入していない。
3. edit result と executor evidence に、完了を妨げる失敗、未実施の必須検証、未解消の申し送りがない。
4. 完了条件を満たす場合は `complete`、軽微な finding を残して完了できる場合は `complete-with-findings`、未充足・根拠不足・検証失敗がある場合は `incomplete` とする。
5. review executor は、確認のための読み取り専用コマンドだけを実行し、成果物、登録項目、edit plan/result を変更しない。

## 4. 判断手順

1. 登録項目の概要と完了条件、edit plan、edit result を読む。
2. `git diff --stat ad386c926b2b9e7f47f2891d57f7f10d98fd559a..82170d2bf7c11ecac44d6e0482a310e8ee7660b7` と `git diff --name-status ad386c926b2b9e7f47f2891d57f7f10d98fd559a..82170d2bf7c11ecac44d6e0482a310e8ee7660b7` を実行し、必要に応じて同じ範囲の差分本文を読む。
3. executor evidence がある場合は、変更一覧、検証結果、block 理由、申し送りを確認する。`docs/ja/projects/prj-0001/execution/exec/evidence/PJR-JSEY/20261018T150415833Z-ddd3748b/evidence.json` が `-` の場合は、edit result と差分から確認できる範囲を判断根拠に明記する。
4. 個票の各完了条件について、満たした根拠または未充足事項を具体的に記録する。
5. result の「評価結果の確認」には、この review では grade を使わず、edit の検証結果を確認したことを書く。

## 5. 完了手順

1. review result の全セクションを埋める。
2. `decision` に `complete`、`complete-with-findings`、`incomplete` のいずれかを記録する。
3. verdict にかかわらず、review 自体を完了できた場合は終了コード 0 とする。

## 6. 異常終了の条件

- 登録項目、edit plan/result、または統合差分を読めず review 自体を完了できない場合は終了コード 1 とする。
- review executor は review result を含むファイルを編集しない。result の記入は reporter が行う。
