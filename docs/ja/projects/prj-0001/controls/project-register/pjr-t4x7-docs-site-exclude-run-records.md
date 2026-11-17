---
specdojo:
  id: prj-0001:pjr-t4x7-docs-site-exclude-run-records
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-17T05:12:32Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-9BY9
    - PJR-G85C
  commit_type: fix
  commit_scope: docs-site
---

# PJR-T4X7 run 単位の plan と result を文書サイトの対象から外し、docs:build のメモリ不足を直す

## 1. 概要

PJR-9BY9 で execution/runs/ へ移した plan・result が srcExclude とリンクの付け替えから外れ、docs:build が 8GB のヒープで止まる

## 2. 入力

- 2026-11-17 に orchestrator が npm run docs:build を流すと、約 19 分後にページの描画（rendering pages）で JavaScript heap out of memory になり SIGABRT で止まった。PJR-G85C の close 時は約 113 秒で通っていた
- packages/docs-site/.vitepress/config.mts の srcExclude は `docs/**/execution/exec/plans/**` と `docs/**/execution/exec/results/**` だけを外す。exec-record-links.ts の `EXEC_RECORD_PATH` も execution/exec/(plans|results)/ だけに一致する
- docs 配下の execution/runs/ には plan.md・result.md が 3,323 件あり、途中までの dist には execution/runs/ の HTML が 1,826 件出ていた

## 3. 完了条件

- 文書サイトの `srcExclude` が、run 単位の `execution/runs/<origin>/<item>/<run>/` 配下の `plan.md`・`result.md` を外す。旧の `execution/exec/plans/`・`execution/exec/results/` の除外も残す。
- `exec-record-links.ts` の付け替えが、run 単位の `plan.md`・`result.md` への Markdown リンクも GitHub のファイル表示へ付け替える。`config.mts` の `isExecPlanLink`・`isExecResultLink` など、旧の場所だけを見ている判定も run 単位の場所に合わせる。
- 実行記録の入口（`exec-records.md` などの生成物）から run 単位の plan・result へのリンクが、dead link にならない。
- 付け替えと除外の判定に、run 単位の場所と旧の場所の両方の単体テストがある（`tests/packages/docs-site/exec-record-links.test.ts` など）。
- `npm run docs:build` が、`package.json` の既定のヒープ（8GB）で通る。executor の sandbox では build を起動できないため、orchestrator が統合の後に手元で流し、時間と dead link の件数を確かめる。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                                   | 担当         | 状態 | メモ                                                                                                                           |
| --- | ------------------------------------------------------ | ------------ | ---- | ------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 除外とリンクの付け替えを run 単位の場所に合わせる      | executor     | done | ページ走査・サイドバー・検索・Markdown / wikilink / frontmatter の参照を新旧配置に対応                                         |
| 2   | 単体テストを足す                                       | executor     | done | 新旧配置の判定・走査除外と register / schedule / job のリンクを追加。実行は設定済みの親 runner が担当                          |
| 3   | 統合の後に docs:build を流して確かめる（orchestrator） | orchestrator | done | 既定の 8GB で 284 秒（VitePress の build は 240 秒）。2,378 ページ、run 単位の plan・result のページは 0 件、dead link は 0 件 |

## 5. 対応結果

### 5.1. 実施内容と判断

- `packages/docs-site/.vitepress/exec-record-paths.ts` に新旧配置の判定と除外 glob を集約し、`config.mts` の `srcExclude`・サイドバー・検索と `exec-record-links.ts` から利用する。run の `plan.md`・`result.md` をページにせず、Markdown・wikilink・frontmatter の doc id 参照を GitHub のファイル表示へ向ける。入口となる生成一覧は引き続きサイトへ残す。
- 除外範囲は [[specdojo:plan-result-lifecycle-guide|plan / result ライフサイクルガイド]] と `src/shared/run-records.ts` の配置に従い、`runs/<origin>/<item>/<run>/plan.md`・`result.md` に限定した。同じ配下の別の Markdown や job 状態管理の `execution/jobs/runs/` を一括で除外しない。旧配置と event の既存の扱いも維持する。
- `tests/packages/docs-site/exec-record-links.test.ts` と `exec-record-paths.test.ts` に、新旧配置・3 種の origin・相対 / ルート相対リンク・query / fragment・行番号付き wikilink・Windows 区切り・非対象パス・glob による実際の走査除外を確認するテストを用意した。パッケージ README にも対象配置を明記した。
- 保護された設定の変更は不要。`CHANGELOG.md`・登録簿の一覧・個票のステータス・result は変更していない。

### 5.2. 検証と残作業

- 変更ファイルを Prettier で整形した。
- `node --import tsx tools/catalog-validate-if-configured.mjs`・`npm run validate:history-links`・`node --import tsx src/specdojo.ts register build` は終了コード 0。カタログ検証には対象外の既存文書の未作成・再 export 参照などの警告がある。
- 型検査・単体 / 結合テスト・lint・schema 検証は、`.specdojo/exec-defaults.yaml` の `pipeline.parent_validations` に設定済みのため、executor で重複実行せず親 runner に委ねる。
- `npm run docs:build` は個票の完了条件に従って executor では実行しない。orchestrator が統合後に既定ヒープ 8GB で流し、終了コード・所要時間・dead link 件数と、run の plan / result が HTML 出力へ含まれないことを確認する。OOM 解消の実測はこの確認まで未確定である。

### 5.3. CHANGELOG に書く事項

- 区分: 不具合修正
- 文案: 文書サイトのビルド対象から run 単位の plan・result を除外し、実行記録一覧などのリンクを GitHub の正本へ向ける。配置移行後にビルドの対象ページが増え、メモリ不足になる原因を修正。
- 統合後の確認（2026-11-17、orchestrator）: `npm run docs:build` が `package.json` の既定のヒープ（8GB）で通った。全体で 284 秒、そのうち VitePress の build は 240 秒。出力した HTML は 2,378 件で、`execution/runs/` 配下のページは 0 件、dead link の検出は 0 件だった。修正前は約 19 分後にページの描画でメモリ不足になっていた。

## 6. 関連ドキュメント

- [[prj-0001:pjr-9by9-exec-run-record-migration]]
- [[prj-0001:pjr-g85c-vitepress-exclude-exec-records]]
