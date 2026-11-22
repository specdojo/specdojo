---
specdojo:
  id: prj-0001:pjr-bbtw-docs-dev-skip-exec-records
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-22T13:29:54Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-BNAV
---

# PJR-BBTW docs:dev では実行の記録のページを読まず、起動を速くする

## 1. 概要

文書サイトの Markdown 6,979 ページのうち 5,179 ページが execution/ の下で、多くは plan と result である。docs:dev のときだけ外し、VitePress の起動を速くする。docs:build は全部のページを出す。

## 2. 入力

- 2026-11-22 の数え: docs の Markdown は 6,979 ページ、docs/ja/projects/prj-0001/execution の下が 5,179 ページ、controls の下が 1,181 ページ。
- PJR-BNAV の測り: 作業ツリー（bind mount）での VitePress の起動は cache のある 2 回目でも 25.3 秒。生成は --skip-if-fresh でほぼ 0 秒になった。
- 実行の記録のページの範囲は packages/docs-site/.vitepress/exec-record-paths.ts にある。
- 利用者の承認（2026-11-22、indie）で起票した。担当 DEV、期限 2026-11-30。

## 3. 完了条件

- `docs:dev` のときだけ、実行の記録のページ（`execution/` の下の plan・result など）を VitePress に読ませない。`docs:build` の出力（ページと dead link の検査）は変えない。
- 実行の記録のページを dev でも見たいときに含める指定（例: `docs:dev -- --with-exec-records`）を足す。名前は executor が決め、理由を個票の対応結果に書く。
- 外したページへのリンクが dev で dead link の警告や表示の崩れを起こさないかを確かめ、扱いを個票の対応結果に書く。
- 外す範囲の判定を単体テストで確かめる。
- packages/docs-site の README か文書サイトのガイドに、dev で外すページと含め方を書く。
- `package.json` などの保護された設定は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。
- 起動の時間は executor の sandbox で測れないため、統合の後にオーケストレーターが変える前と後の起動の時間を測り、個票の対応結果に書いてから close する。

## 4. 作業内容

| No  | 作業                                         | 担当 | 状態 | メモ                                                               |
| --- | -------------------------------------------- | ---- | ---- | ------------------------------------------------------------------ |
| 1   | dev だけ実行記録を走査から外す判定を実装する | DEV  | done | `resolveExecRecordSrcExclude` を追加し `config.mts` で使う         |
| 2   | `--with-exec-records` の指定を追加する       | DEV  | done | `bin/specdojo-docs-site.js` が環境変数でコンフィグへ渡す           |
| 3   | 単体テストと README を更新する               | DEV  | done | `tests/packages/docs-site/exec-record-paths.test.ts`、README       |
| 4   | 変更前後の起動時間を測る                     | DEV  | open | executor の sandbox では測れない。統合後にオーケストレーターが測る |

## 5. 対応結果

### 5.1. 実施内容

- `packages/docs-site/.vitepress/exec-record-paths.ts` に `DEV_EXEC_RECORD_SRC_EXCLUDE` と `resolveExecRecordSrcExclude` を追加した。`dev` で `--with-exec-records` が無いときだけ、`execution/` 配下の `runs/`・`exec/`・`jobs/runs/`・`routines/failures/`・`grade/results/` を `srcExclude` へ足す。`build` の除外は変えない。
- `config.mts` は環境変数 `SPECDOJO_DOCS_COMMAND` と `SPECDOJO_DOCS_WITH_EXEC_RECORDS` から判定する。`bin/specdojo-docs-site.js` がこれらを設定し、`--with-exec-records` を VitePress へ渡さず取り除く。
- 指定名は `--with-exec-records` とした。「何を含めるか」が名前で分かり、既定（外す）を変えずに足せるため。ルートの `npm run docs:dev -- --with-exec-records` は末尾の npm 呼び出しに付き npm のオプション扱いになるので、`npm_config_with_exec_records` も受け付ける。これで `package.json` を変えずに済む。
- 単体テストで、dev・build・含める指定の 3 通りの除外と、dev での実ファイル走査（付随ページを外し `generated/` と `grade/criteria/` を残す）を確かめた。
- README に、dev で外すページと含め方、リンク切れの扱いを書いた。

### 5.2. 外したページへのリンクの扱い

- dev では VitePress は dead link を検査しない。外したページへのリンクはクリック時に 404 になるだけで、表示は崩れない。plan・result へのリンクは従来どおり GitHub の正本へ付け替わる。dead link の検査は `build` が担い、`build` の出力は変えていない。
- サイドバーと検索は走査ではなくパスの判定（`isExecRecordPath`）で除外済みで、変更していない。

### 5.3. 判断した点

- 起票時の入力にある「execution/ の 5,179 ページ」の大半（`runs/*/*/*/plan.md` と `result.md`）は、PJR-T4X7 の時点で `srcExclude` により dev・build とも走査から外れている。この作業ツリーで plan と result 以外の `runs/` 配下の Markdown は 0 件だった。このため本変更で新たに減るのは、`exec/`・`grade/results/` などの少数のページで、起動時間の短縮は小さい可能性がある。測定結果次第で、`controls/project-register/pjr-*.md`（約 1,181 ページ）を dev で外す案を別項目で検討する。

### 5.4. CHANGELOG に書く事項

- 区分: Changed
- 文案: `docs:dev` は実行記録のページ（`execution/` 配下の `runs/`・`exec/` など）を読まず起動を速くする。含めるときは `--with-exec-records` を付ける。`docs:build` は変わらない。

### 5.5. 残課題

- 統合後に、変更前後の `docs:dev` 起動時間を測り、ここへ追記してから close する。

## 6. 関連ドキュメント

- `PJR-BNAV`（起動時間の測り）と `PJR-T4X7`（plan・result の除外）。
