---
specdojo:
  id: prj-0001:pjr-0163-register-add-id-fetch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
---

# PJR-0163 register addのID採番方式見直しと統合ブランチ予約のfetch同期

## 1. 概要

`register add` を worktree 側から実行して即座に起票したいが、統合ブランチが未同期だと別マシンとの並行起票でIDが衝突しうる。数字4桁連番の代替として検討したダミーID・案3（1項目1ファイル化）・数字乱数（4桁/5桁）はいずれも過剰な改修範囲か実用に耐えない衝突確率だったため、既存の統合ブランチ予約経路（[[prj-0001:pjr-0138-register-add-on-integration-branch]]）を維持したまま、ID の文字種変更と fetch 同期の自動化で残存リスクを縮小する。

## 2. 完了条件

- PJR-ID の乱数部分が、数字4桁から曖昧文字（`I` `L` `O` `U`）を除いた32文字セット（英大文字+数字、単一ケース）による4桁のランダムIDへ変更されている。
- 生成した候補が既存IDまたは簡易な不適切語ブロックリストに一致する場合、再抽選してから採用する。
- `register add` が統合ブランチへルーティングする際（`--reserve` 相当の経路）、書き込み前に統合ブランチの worktree で `git fetch` と `git merge --ff-only` を自動実行し、ローカルの `pjr-index.md` を最新化してから採番する。
- fetch が失敗した場合（オフライン等）は既定で警告のみを表示して処理を継続する。厳密な同期を要求する `--strict-sync` 相当のオプションで、失敗時に処理を中断できる。
- 統合ブランチが origin から分岐している（ff-only 不可）場合は、書き込みを行わずにエラーで終了し、手動解決を促すメッセージを表示する。
- `git push` は `specdojo` に組み込まず、統合ブランチの worktree パスを返す読み取り専用コマンド（例: `register where --integration`）とそれを使う npm script（素の git コマンド）側に委譲する。
- 衝突が発生した場合の検知・復旧は新規フォーマットを作らず、既存の `register renumber`・`validate:schema:pjr-index` をそのまま利用できる（ID正規表現 `PJR-\d{4}` を新しい文字種へ拡張するのみ）。
- ID正規表現を参照している箇所（`src/register.ts`、`src/exec-register.ts`、`tools/docs/src/remark-md-content.ts` など）が新しい文字種に対応し、既存テストと新規テストが green である。
- 運用ガイド（`register-operation-guide.md` 4.3節）とコマンドリファレンスに、新しいID形式・fetch自動同期・`register where --integration` の使い方が反映されている。

## 3. 作業内容

| No  | 作業                                                              | 担当 | 状態 | メモ                                                                             |
| --- | ----------------------------------------------------------------- | ---- | ---- | -------------------------------------------------------------------------------- |
| 1   | ID生成ロジックを数字4桁連番から英数字4桁ランダムへ変更する        | ARC  | open | 曖昧文字・母音一部除外、不適切語ブロックリストと再抽選を含む                     |
| 2   | ID正規表現を参照する全箇所を新しい文字種に対応させる              | ARC  | open | `src/register.ts`、`src/exec-register.ts`、`tools/docs/src/remark-md-content.ts` |
| 3   | 統合ブランチ予約経路に fetch + ff-only merge の自動実行を追加する | ARC  | open | 失敗時は警告継続、分岐時はエラー中断、`--strict-sync` 相当オプションを検討       |
| 4   | 統合ブランチworktreeのパスを返す読み取り専用コマンドを追加する    | ARC  | open | 例: `register where --integration`。push/pullはspecdojoに含めない                |
| 5   | pull/push用のnpm script（素のgitコマンド）を整備する              | ARC  | open | 例: `register:sync-pull` / `register:sync-push`（命名は実装時に確定）            |
| 6   | 自動テストを追加し、運用ガイド・コマンドリファレンスへ反映する    | ARC  | open | ID生成・fetch同期・分岐時エラーの代表ケースを検証                                |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-0137-register-id-uniqueness|pjr-indexの重複ID検知と再採番]]
- [[prj-0001:pjr-0138-register-add-on-integration-branch|起票を統合ブランチへ委譲するregister add]]
- [[specdojo:pjr-rulebook|プロジェクト登録簿ルールブック]]
- [[specdojo:register-operation-guide|SpecDojo登録簿運用ガイド]]
- [[specdojo:command-reference|SpecDojoコマンドリファレンス]]
