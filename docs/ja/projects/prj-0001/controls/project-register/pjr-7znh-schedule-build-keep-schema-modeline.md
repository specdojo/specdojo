---
specdojo:
  id: prj-0001:pjr-7znh-schedule-build-keep-schema-modeline
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-09-27T01:18:55Z"
  completed_at: "2026-09-27T01:21:35Z"
  conclusion: schedule build の track と milestones の書き出しへ schema modeline を付けるようにした
---

# PJR-7ZNH schedule build が track と milestones の schema modeline を消さないようにする

## 1. 概要

`schedule build` は `sch-track-<track>.yaml` と `sch-milestones.yaml` を、`yaml.dump` の結果だけで書き出していた。先頭の `# yaml-language-server: $schema=...` modeline が再生成のたびに消えるため、`validate:schema` が `missing yaml-language-server $schema modeline` で失敗する。

原因は、schema 指定を modeline へ集めた commit 263603cf で、既存ファイルに modeline を付けたものの、`src/schedule.ts` の書き出し処理を更新しなかったことである。`src/grade-result.ts` は同じ場面で modeline を付けている。

PJR-06RE の完了条件は `schedule build --force` の実行を求めるため、この不具合がある限り、agent の作業内容に関係なく runner の `validate-schema` で失敗する。

## 2. 完了条件

- `schedule build` が書き出す `sch-track-<track>.yaml` と `sch-milestones.yaml` の先頭に、schema への modeline が付く。
- modeline の参照先は、書き出したファイルの位置から schema への相対パスで、`validate:schema` が解決できる。
- milestones を新規作成した場合も、再構築した場合も、modeline が 1 行だけ付く。
- 単体テストがあり、`npm run test:unit` と `npm run typecheck` が成功する。

## 3. 作業内容

| No  | 作業                                                                    | 担当         | 状態 | メモ |
| --- | ----------------------------------------------------------------------- | ------------ | ---- | ---- |
| 1   | track と milestones の書き出しに modeline を付ける                      | orchestrator | done | -    |
| 2   | 相対パスと、作成・再構築時に modeline が 1 行だけ付くことのテストを追加 | orchestrator | done | -    |

## 4. 対応結果

利用者の承認のもと、orchestrator が直接対応した。

- `src/schedule.ts` に `withSchemaModeline` を追加し、track と milestones の書き出しで使うようにした。schema のパスは `resolveSpecdojoPath` で解決するので、npm 導入先でも package 同梱の schema を指す。`src/grade-result.ts` と同じ方式である。
- `tests/src/schedule-command.test.ts` に 2 件を追加した。1 件は、出力先から schema への相対パスが `../../../../specdojo/schemas/v1/sch-track.schema.yaml` になることを確かめる。もう 1 件は、milestones を作成・再構築しても modeline が 1 行だけで、参照先が schema に解決されることを確かめる。
- 確認した結果は次のとおり。
  - `schedule build --project prj-0001 --track launch --dry-run` の先頭行が modeline になった。
  - `npm run test:unit` は 1,588 件すべて成功した。
  - `npm run typecheck` と ESLint はエラーなしだった。
- `schedule-strategy-generate.ts` の strategy 書き出しは、生成文字列をそのまま書くので対象外とした。

## 5. 関連ドキュメント

- PJR-06RE（本不具合で `validate-schema` が失敗した項目）
- `src/schedule.ts`、`src/grade-result.ts`
