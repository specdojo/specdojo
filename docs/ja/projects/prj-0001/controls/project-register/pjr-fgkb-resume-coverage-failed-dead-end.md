---
specdojo:
  id: prj-0001:pjr-fgkb-resume-coverage-failed-dead-end
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  difficulty: medium
  registered_at: "2026-11-21T09:02:58Z"
---

# PJR-FGKB 再開時の対象の検証に失敗すると executor が failed になり、作業を捨てる --force-restart しか残らない

## 1. 課題内容

未完了の試行がうっかり作ったファイル（出力先を誤った build の生成物など）が attempt_changes に入り、再開時の target coverage の下限になる。そのファイルを消しても下限から外せず、executor が報告しきれないと runner は executor を failed にする。failed は --resume でも --resume-from executor でも再開できず、worktree を捨てる --force-restart しか残らないため、確かめ済みで commit 前の編集を失う。下限から不要な対象を外す手段か、failed からの再開経路を用意する

## 2. 入力

- 発端は利用者のプロジェクト coderdojo-lessons-specdojo の prj-0001:PJR-AF5N（SpecDojo 0.9.2、2026-11-21）。
- opus-executor の試行で、npx slidev build の --out がスライドのディレクトリ基準で解決され、プロダクトリポジトリに未追跡の build 生成物（数十ファイル）ができた。executor は削除を許されず incomplete で終わり、その evidence の `attempt_changes` に生成物が入った。
- orchestrator が生成物を削除して --resume --resume-from executor で再開した。executor は個票の記録だけを直して complete と報告したが、下限の生成物の一部しか `target_coverage` に書かなかったため、validateResumedTargetCoverage が「did not account for every plan target」で失敗し、executor の段が failed になった。
- 次の --resume --resume-from executor は「executor stage is failed …; re-run the item instead」で拒まれた。残る経路は worktree と未 commit の変更を捨てる --force-restart だけだった。利用者のプロジェクトでは、orchestrator が差分を控えて feature ブランチに手で当て、統合した。
- 関連：[[prj-0001:pjr-ppyf-register-targets-from-first-attempt]]（最初の試行の `attempt_changes` を下限にした項目。下限に漏れがあれば failed にするのはこの仕様）。

## 3. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
