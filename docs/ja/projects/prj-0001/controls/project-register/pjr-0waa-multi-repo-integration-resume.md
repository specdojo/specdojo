---
specdojo:
  id: prj-0001:pjr-0waa-multi-repo-integration-resume
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: DEV
  registered_at: "2026-10-01T03:53:55Z"
  block_reason: "agent exited with non-zero code: runner による検証 `test-integration` が失敗しているため。"
---

# PJR-0WAA 複数リポジトリの統合と再開

## 1. 概要

commit 対象の算出と統合をリポジトリごとに行い、宣言順（プロダクト先行）で統合する。統合済みの範囲を pipeline state に記録し、失敗した位置から再開する（v0.3.0）

## 2. 完了条件

- 方針は [[prj-0001:pjr-5822-multi-repo-item-design]] の決定内容に従う。変更箇所は同個票の「現行実装の変更箇所」を起点にする。
- 統合の前に、全リポジトリで commit 対象の算出と merge 可否を確かめる。いずれかで不可なら、どのリポジトリも統合しない。
- 事前検査の「統合先の未 commit の変更と merge の対象の重なり」の判定は、単一リポジトリの統合と同じ基準にする。runner が統合の前に解放・退避する自分の記帳（plan・result・event など、単一リポジトリの統合で `releasePaths` として扱うもの）は、複数リポジトリの経路でも同じく除外し、統合を妨げない。定期実行などが統合先に残した無関係な未 commit のファイルも、merge の対象と重ならない限り妨げない。
- 2026-10-01 の 1 回目の実行（codex）では、失敗位置ごとの再開の統合テスト 3 件が、上の除外が効かず事前検査で止まって失敗した。差分の控えは `/workspaces/specdojo-workspace/specdojo/logs/pjr-0waa-attempt1.patch`（読めれば参考にしてよい）にある。
- 宣言順にプロダクトを統合し、最後にプロジェクトを統合する。commit 対象の算出と統合をリポジトリごとに行う。
- `stages.integrate` の下にリポジトリ別の状態（統合済みか、commit、時刻）を任意項目で記録し、旧形式の pipeline state を読める。
- 途中で失敗したら `waiting` に戻し、統合済みと未統合のリポジトリを `block_reason` に書く。`--resume` で統合済みのリポジトリを飛ばし、失敗した位置から再開する。
- プロダクトが 2 つの構成で、1 つ目・2 つ目・プロジェクトのそれぞれで失敗したときの部分状態と再開を、実 Git を使う統合テストで確かめる。
- 宣言（`repos`）を持たない project の動作が変わらないことを、既存のテストと回帰テストで確かめる。
- `.specdojo/exec-defaults.yaml`・`package.json` など agent が変更できない設定は変更しない。必要な変更は result の申し送りに書く。
- 親検証（lint・test・typecheck・validate-schema）がすべて通る。

## 3. 作業内容

| No  | 作業                                     | 担当 | 状態 | メモ                                             |
| --- | ---------------------------------------- | ---- | ---- | ------------------------------------------------ |
| 1   | 事前検査                                 | DEV  | done | 全リポジトリの commit 後、merge 前に一括検査する |
| 2   | 宣言順の統合とリポジトリ別の commit 対象 | DEV  | done | 宣言順のプロダクト、最後にプロジェクトを統合する |
| 3   | pipeline state のリポジトリ別記録と再開  | DEV  | done | Git の実状態から統合済みを判定して飛ばす         |
| 4   | 失敗位置ごとの統合テスト                 | DEV  | done | 2 製品とプロジェクトの各失敗位置を実 Git で扱う  |

## 4. 対応結果

- commit 対象をリポジトリごとに算出し、全対象を commit した後に merge 可否を一括検査する統合段を追加した。
- プロジェクト側の事前検査は、単一リポジトリ統合と同じ `releasePaths` を除外する。runner 自身の plan・result・event は統合を妨げず、統合先の無関係な未 commit ファイルも merge 対象と重ならなければ保持したまま統合できる。
- 宣言順のプロダクトからプロジェクトの順に統合し、`stages.integrate.repos` へ `status`、`commit`、`merged_at`、失敗理由を記録する。`repos` の無い旧 pipeline state は従来どおり読める。
- 部分失敗時は統合済みと未統合のリポジトリを理由へ含め、再開時は Git の到達関係から統合済みを飛ばす。
- 2 製品構成の各統合位置で merge を失敗させ、失敗位置から再開して既統合リポジトリを再統合しない実 Git テストを追加した。宣言の無い project は従来の単一 worktree 経路を維持する。
- 親 runner が lint、schema 検証、型検査、unit test、integration test を実行する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-5822-multi-repo-item-design]]
