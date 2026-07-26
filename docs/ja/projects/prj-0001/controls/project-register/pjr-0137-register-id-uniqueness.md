---
specdojo:
  id: prj-0001:pjr-0137-register-id-uniqueness
  type: project
  status: draft
  rulebook: pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-0137 pjr-indexの重複ID検知と再採番

## 1. 概要

`specdojo register add` の PJR-ID は `pjr-index.md` の最大値 +1 で採番されるため、複数の作業者や worktree が並行して起票すると同じ ID が別 branch で発生する。表末尾への追記は通常 merge conflict になるが、rebase や cherry-pick を経た場合は重複が検知されずに通る。重複 ID を検証で必ず落とし、発生時には表・個票ファイル名・参照リンクを一括で付け替える再採番コマンドを用意する。

## 2. 完了条件

- `pjr-index.md` の登録項目一覧に同じ PJR-ID が 2 行以上ある場合、検証がエラーとして報告する。
- 重複エラーのメッセージから、重複した ID と該当行を特定できる。
- 表の PJR-ID と個票ファイル名 `pjr-XXXX-<topic>.md` の対応が取れていない場合を検出できる。
- 検証は既存の Markdown 検証経路に載り、VSCode のリアルタイム検証と CI の両方で機能する。
- 再採番コマンドで、指定した PJR-ID を未使用の PJR-ID へ移動できる。
- 再採番では、`pjr-index.md` の該当行、個票ファイル名、個票 frontmatter の `id`、他文書からの参照リンク、exec plan / result の `targets` が同時に更新される。
- 再採番先の ID が既に使われている場合は、何も書き換えずにエラーで終了する。
- 実行前に変更内容を確認できる dry-run を提供する。
- 重複検知と再採番の代表ケースが自動テストで確認できる。

## 3. 作業内容

| No  | 作業                                                             | 担当 | 状態 | メモ                                                    |
| --- | ---------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------- |
| 1   | pjr-index schema へ ID の一意制約を追加する                      | ARC  | done | `unique_columns` を追加した                             |
| 2   | 本文検証へ列値の重複判定を実装する                               | ARC  | done | `remark-md-content.ts` に重複判定を実装した             |
| 3   | 表の ID と個票ファイル名の対応を検証する                         | ARC  | done | `ticket_filename_check` でリンク URL と ID を照合した   |
| 4   | 再採番コマンドを実装する                                         | ARC  | done | `register renumber` で表・個票・リンク・targets を更新  |
| 5   | 再採番の dry-run と衝突時のエラー処理を実装する                  | ARC  | done | 事前算出後に一括適用し、部分適用を残さない              |
| 6   | 重複検知・再採番のテストを追加し、運用ガイドとコマンド一覧へ反映 | ARC  | done | vitest 追加、運用ガイドとコマンドリファレンスへ反映した |

## 4. 対応結果

- ID 一意制約と個票ファイル名整合を pjr-index schema（`unique_columns` / `ticket_filename_check`）へ追加し、`remark-md-content.ts` に検証を実装した。これにより VSCode のリアルタイム検証（`.remarkrc.yaml`）と CI（`validate:schema:pjr-index` / `lint:fm`）の両経路で重複と不整合を検知する。
- 重複エラーは重複した ID と該当行位置（例: 「1 行目と 3 行目」）を示す。個票ファイル名は Markdown リンク URL から取得し、`pjr-XXXX-<topic>.md` が ID と一致しない場合を報告する。
- `register renumber --id <from> --to <to>` を実装した。`pjr-index.md` の該当行・個票ファイル名・個票 frontmatter の `id`・他文書の参照リンク（wikilink）・exec plan / result の `targets` を同時に付け替え、派生ビューを再生成する。
- 変更対象を事前に全算出してから書き込む方式にし、移動先 ID が使用済み・個票ファイルの衝突などを検出した場合は何も書き換えずにエラー終了する（部分適用なし）。`--dry-run` で変更対象を事前確認できる。
- 重複検知・個票ファイル名整合・再採番の代表ケースを vitest に追加し、運用ガイドへ並行起票時の復旧手順、コマンドリファレンスへ `register renumber` を反映した。

## 5. 関連ドキュメント

- [[pjr-rulebook|プロジェクト登録簿ルールブック]]
- [[specdojo-register-operation-guide|SpecDojo登録簿運用ガイド]]
- [[specdojo-command-reference-guide|SpecDojoコマンドリファレンス]]
