---
specdojo:
  id: prj-0001:pjr-t7em-ifx-cmd
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-08-14T09:09:31Z"
  due_on: "2026-08-31"
---

# PJR-T7EM ifx-cmd（外部コマンド連携仕様）の新設

## 1. 概要

esil.schema.yaml の interfaces[].kind が API／ファイル／メッセージの3値固定で、CLIコマンド起動型の外部連携（AI provider CLI、Git/GitHub等）を表す区分が無い。ifx-cmd-rulebook.md を新設し、esil.schema.yaml のkind・spec_refパターンを拡張する。

あわせて、レビューで発見した命名不整合を修正する。`ifx-index`（ESIL一覧）は他ドメインの `-index` Hub命名規約（`opd-index`→`opd-index-rulebook`等）に反し `specdojo:ifx-rulebook` を参照していた。`ifx-rulebook.md` を `ifx-index-rulebook.md` へリネームし、命名を統一した（本チケット登録前に実施済み。作業内容No.0参照）。

## 2. 完了条件

- `esil.schema.yaml` の `interfaces[].kind` に、CLIコマンド起動型の連携を表す区分（例: `コマンド`）が追加されていること。
- `esil.schema.yaml` の `interfaces[].spec_ref` パターンが `ifx-cmd-...` を許容していること。あわせて、現状 `eapis`/`efes`/`ems` のままになっている `spec_ref` パターンを、各rulebook本文が指示する `ifx-api`/`ifx-file`/`ifx-msg` 接頭辞と一致させること。
- `ifx-index-rulebook.md` の `kind` 説明表に新区分が追記されていること。
- `ifx-cmd-rulebook.md`（コマンド名・引数・stdin/stdout・終了コード・認証注入方式・エラー処理を定義する構成）が新設されていること。`ifx-api-rulebook.md` に準じ、recipe・sample・templateの要否もあわせて判断すること。
- `id-and-file-naming-standard.md` 14.2 に `ifx-cmd-` prefix の行が追加されていること。
- `deliverables-reference.md` 2.2 に「外部コマンド連携仕様」の行が追加されていること。
- `prj-0001:dct-external-interface-specs` の `ifx-index` にある暫定記述（`kind: API`／`spec_ref: TBD`）を、新設した区分・IDへ更新できる状態になっていること。
- `npm run -s lint:md` にエラーがないこと。
- `npm run docs:build` が成功すること。

## 3. 作業内容

<!-- prettier-ignore -->
| No  | 作業 | 担当 | 状態 | メモ |
| --- | --- | --- | --- | --- |
| 0   | `ifx-rulebook.md` を `ifx-index-rulebook.md` へリネーム（`ifx-index`のHub命名規約への統一） | ARC | done | 対象: `docs/ja/specdojo/rulebooks/ifx-rulebook.md`→`ifx-index-rulebook.md`（frontmatter・英語名行を追加）。参照元5ファイル（`dct-external-interface-specs.yaml`／`dct-external-interface-specs-template.yaml`／`deliverables-reference.md`／`docs/ja/sample-gcs-product/...`／本チケット）を追従。孤立していた旧`ifx-index-rulebook.md`（Markdown Hub想定の未使用スタブ）と`ifx-index-sample.md`は破棄した |
| 1   | `esil.schema.yaml` の `kind` 区分追加・`spec_ref` パターン修正（`eapis`/`efes`/`ems`→`ifx-api`/`ifx-file`/`ifx-msg`／`ifx-cmd`） | ARC | open | 対象: `docs/specdojo/schemas/v1/esil.schema.yaml` |
| 2   | `ifx-index-rulebook.md` の `kind` 説明表更新 | ARC | open | 対象: `docs/ja/specdojo/rulebooks/ifx-index-rulebook.md` |
| 3   | `ifx-cmd-rulebook.md` の新設 | ARC | open | 対象: `docs/ja/specdojo/rulebooks/ifx-cmd-rulebook.md`。recipe/sample/templateの要否を判断のうえ必要なら追加 |
| 4   | `id-and-file-naming-standard.md` 14.2 の更新 | ARC | open | `ifx-cmd-` prefix行を追加 |
| 5   | `deliverables-reference.md` 2.2 の更新 | ARC | open | 「外部コマンド連携仕様」行を追加 |
| 6   | `dct-external-interface-specs.yaml`（`ifx-index`）の暫定記述更新、lint:md／docs:build 実行 | ARC | open | 完了条件の検証コマンドを実行する |

## 4. 対応結果

- No.0（`ifx-rulebook.md`→`ifx-index-rulebook.md`リネーム）は、PJR-MWXSレビューの過程で `opd-index`／`opr-index`／`sf-index` の同種命名不整合を確認した際に併せて発見し、本チケット登録と同時に実施済み。`catalog validate`／`lint:md` で確認済み（詳細な検証コマンド結果は本チケット完了時にNo.1〜6分とまとめて記録する）。

## 5. 関連ドキュメント

- [[prj-0001:dct-external-interface-specs]]: `ifx-index` の暫定記述（`kind: API`／`spec_ref: TBD`）が更新対象
- [[specdojo:ifx-index-rulebook]]: `kind` 区分を追記する対象（`ifx-rulebook`からリネーム済み）
- [[specdojo:id-and-file-naming-standard]]: `ifx-cmd-` prefixを追加する対象
- [[specdojo:deliverables-reference]]: 「外部コマンド連携仕様」を追加する対象
- [[specdojo:kata-guide]]: rulebook / recipe / sample / template の役割分担
- [[prj-0001:pjr-mwxs-uis-index-rulebook-bds-index-rulebook]]: 同種の`-index`命名不整合を発見した経緯
