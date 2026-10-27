---
specdojo:
  id: prj-0001:pjr-6rvj-register-depends-on
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  difficulty: medium
  registered_at: "2026-10-27T23:00:16Z"
  block_reason: "parent validation failed: lint-ts"
  derived_from:
    - PJR-NJJ7
---

# PJR-6RVJ register の項目に順番の依存（`depends_on`）を追加する

## 1. 概要

個票の frontmatter に `depends_on` を足し、先行の項目が終端でなければ `exec run --register`・routine の sweep・夜間の queue で実行を飛ばす。存在しない ID・自己参照・循環を検証し、一覧と逆引きのビューに出す

- 由来を表す `derived_from` とは別に、先に終わっているべき項目を `depends_on` に記録し、順番のある todo を順番どおりに実行できるようにする（PJR-NJJ7 のフォローアップ）。
- 名前は timeline と schedule の `depends_on` にそろえる。

## 2. 完了条件

- 個票の frontmatter の schema（`register-item-frontmatter.schema.yaml`）と event の schema に `depends_on`（登録項目の ID の配列）がある。
- `register add` / `update` で `--depends-on <ID>` を繰り返し指定でき、`--depends-on -` で外せる。変更は event に記録される。
- 記帳と `register build` が、存在しない ID・自分自身・循環する依存をエラーにする。別の project の ID の扱いは `derived_from` の規則にそろえる。
- 先行の項目が終端（`done` / `decided`）でなければ、`exec run --register` は実行せずに止まり、終わっていない先行の項目を表示する。夜間の orchestrator（`specdojo orchestrator night`）は、その項目を飛ばして理由を記録する。
- 先行が `rejected` / `deferred` の場合も自動では進めない。状態を自動で `waiting` に変えない。
- 一覧（`pjr-index.md`）に `depends_on` が出る。どの項目に後続があるかを逆引きできるビューがある。
- pjr-rulebook・register-operation-guide・command-reference に、`depends_on` と `derived_from` の違いと、実行を飛ばす判定を書く。
- CHANGELOG の `## [Unreleased]` に追記する。公開済みの版の節は変えない。
- 単体テストで、検証の 3 種類・実行を飛ばす判定・記帳と event の往復を確かめる。
- 作業の中で `npm run typecheck`・`npm run lint:ts`・`npm run lint:md`・`npm run test:unit` が通り、親の検証 7 件が通る。
- 設計で決めること（依存のグラフの検証を置くモジュールなど）は executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。

## 3. 作業内容

| No  | 作業                                                     | 担当     | 状態 | メモ                                                                                                           |
| --- | -------------------------------------------------------- | -------- | ---- | -------------------------------------------------------------------------------------------------------------- |
| 1   | schema・個票・event に `depends_on` を追加する           | executor | done | 参照配列、現在値、event 差分・merge 復元に対応                                                                 |
| 2   | `register add` / `update` の `--depends-on` と検証を実装 | executor | done | 反復指定・置換・削除、存在確認・自己参照・循環の拒否                                                           |
| 3   | `exec run --register` と夜間の orchestrator の判定を実装 | executor | done | 直接実行は停止、sweep と夜間は理由付きでスキップ。resume と lifecycle lock 取得後も再確認                      |
| 4   | 一覧と逆引きのビューを追加する                           | executor | done | 一覧の依存列、`generated/pjr-dependent-items.md` と生成 template                                               |
| 5   | rulebook・ガイド・command-reference・CHANGELOG を更新    | executor | done | 由来との違い、成功終端の判定、次回 queue での再選択を明文化                                                    |
| 6   | 単体テストを追加し、検査を通す                           | executor | done | 単体テストを追加。build・隔離 CLI smoke・schema・catalog・register build 成功。親の 7 検証は runner が後続実行 |

## 4. 対応結果

- `depends_on` を schema、個票の読み書き、add/update の反復オプション、event・history・統合時の event 復元へ追加した。`--depends-on -` で削除でき、別リポジトリへの add でもオプションを転送する。ID の再採番では依存参照も追随させる。
- 設計判断: 依存グラフの検証と実行可否の判定は `src/register/dependency.ts` に集約した。register・exec・夜間 queue の判定をそろえ、register から実行制御への依存を増やさないためである。project 修飾した ID をグラフのキーにし、DFS で自己参照・循環・未存在参照を検出する。add/update は変更予定の項目を一時的にグラフへ反映して、書き込み前に検証する。
- project 間の扱いは `derived_from` に合わせ、設定済み project のローカル統合ブランチの Git tree から個票を読む。未設定の project や統合ブランチ不在は拒否する。循環検証は project をまたいで行い、実行時の先行状態も同じ tree で確認する。
- 実行許可はすべての先行項目が `done` / `decided` の場合だけとした。`rejected` / `deferred` を含む未充足の依存では、直接実行は ID と状態を示して停止し、sweep・夜間 queue は理由を出力して飛ばす。夜間の朝報告にも理由を保存する。状態を自動で `waiting` に変えず、スキップを選択件数上限へ数えない。先行完了後の後続項目は次回の queue 選択で拾う。
- 一覧末尾へ `depends_on` 列を追加し、`generated/pjr-dependent-items.md` で先行項目から後続項目を逆引きできるようにした。既存の一覧の先頭 12 列と旧一覧の読み取り互換は維持した。
- 単体テストは参照先不在・自己参照・循環、project 間の循環とブランチ不在、8 状態の先行判定、直接実行・worktree・resume・sweep・夜間朝報告、記帳・event・history の往復、schema、一覧・逆引き、再採番、外部 add と event 復元を対象に追加・更新した。
- 検証: `npm run build`、隔離した登録簿を使う CLI smoke、個票・event の `validate:schema:file`、`catalog validate --project prj-0001`、`register build --project prj-0001` が成功した。catalog には未作成文書に関する既存警告がある。CLI 検証では `.env` の読み込みを preload で無効にした。Prettier を変更ファイルへ適用した。
- 申し送り: 親の `lint-ts`・`lint-fm`・`lint-md`・`test-integration`・`validate-schema`・`typecheck`・`test-unit` は sandbox で重複実行せず、後続の runner に委ねる。統合後は [[prj-0001:pm-orchestrator-playbook|運用メモ]] に従い、実 agent の利用枠を使う PJR-JSEY の動作確認を行う。
- result は executor/reporter pipeline の責務分離に従って編集していない。上記の設計判断と検証・申し送りは executor evidence の `handoff` にも記載し、reporter と runner が result へ反映する。

## 5. 関連ドキュメント

- [[specdojo:pjr-rulebook]]
- [[specdojo:register-operation-guide]]
- [[specdojo:command-reference]]
