---
specdojo:
  id: prj-0001:pjr-e73z-docs-generate-fresh-per-step
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-22T23:45:26Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-23T04:51:29Z"
  conclusion: specdojo build --skip-fresh を足し、docs:generate:fresh が段ごとに入力（パス・サイズ・更新時刻の一覧のハッシュ）を見て、変わった段だけを作り直すようにした。判定できないときは作り直す
  derived_from:
    - PJR-BBTW
  depends_on:
    - PJR-BEQ8
    - PJR-XHS8
  commit_type: perf
  commit_scope: docs-site
---

# PJR-E73Z docs:generate:fresh を段ごとの判定にする

## 1. 概要

docs/ のどれかが新しいと build の 6 段を全部作り直す。入力が変わった段だけを作り直す

## 2. 入力

- docs:dev の起動を速くする（利用者の依頼、2026-11-23）。devcontainer を作り直した後の 2 回目の起動で 58.4 秒だった

## 3. 完了条件

- `docs:generate:fresh`（`specdojo-docs-site generate --skip-if-fresh`）は、今は `.specdojo/doc-index.json` より新しいファイルが `docs/` にあると `specdojo build` の 6 段（exec refresh・catalog・register・yaml-pages・dashboard・index）を全部作り直す。段ごとに入力を見て、入力が変わった段だけを作り直すようにする。
- 段ごとの入力（どのファイルが変わるとどの段を作り直すか）と、判定の方法（更新時刻か内容のハッシュか）を設計し、個票の対応結果に表で書く。段の間の依存（例: register の生成物を dashboard が読む）を落とさない。
- 判定を誤って古い生成物で起動しないことを優先する。判定できないときは、その段を作り直す。`specdojo build`（全部作り直す経路）は変えない。
- register の個票を 1 件直した後と、何も変えていない後の 2 つの場合で、`docs:generate:fresh` の時間を直す前と直した後で測り、個票の対応結果に書く。
- 単体テストを足す（段ごとの判定、判定できないときに作り直すこと）。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                                                 | 担当 | 状態 | メモ                                                         |
| --- | -------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------ |
| 1   | 6 段の入力・出力・段の間の依存を実装から調べ、判定を設計する         | DEV  | done | 入力と判定の方法の表に書いた                                 |
| 2   | `specdojo build --skip-fresh` を足し、`--skip-if-fresh` から使う     | DEV  | done | `src/commands/build-freshness.ts`、`build.ts`、docs-site bin |
| 3   | 単体テストを足す                                                     | DEV  | done | `tests/src/commands/build-freshness.test.ts`（13 件）        |
| 4   | 直す前と直した後の時間を測る                                         | DEV  | done | 時間の表に書いた                                             |
| 5   | コマンドリファレンスに `--skip-fresh` を書き、CHANGELOG の文案を作る | DEV  | done | `CHANGELOG.md` は変えていない                                |

## 5. 対応結果

### 5.1. 実施内容

- `specdojo build --skip-fresh` を足した。既定の 6 段のうち、前回 `--skip-fresh` で成功した時から入力が変わった段だけを流す。`specdojo-docs-site generate --skip-if-fresh`（`docs:generate:fresh`）は、`doc-index.json` と `docs/` の更新時刻の比較をやめ、この経路を呼ぶ。`--skip-fresh` の無い `specdojo build` は変えていない（段を流す処理を関数へ切り出しただけ）。
- 判定の実装は `src/commands/build-freshness.ts`、組み込みは `src/commands/build.ts`、呼び出しは `packages/docs-site/bin/specdojo-docs-site.js`。説明は [[specdojo:command-reference|コマンドリファレンス]] の「watch / build」に足した。

### 5.2. 入力と判定の方法

判定の方法は、内容のハッシュではなく、入力ファイルのパス・サイズ・更新時刻の一覧のハッシュにした（理由は判断した点に書く）。段ごとに、次の材料から鍵を作り、前回成功した時の鍵と違えば作り直す。

- 全段に共通: CLI の実装（`src/` または `dist/` の全ファイル）、`.specdojo/` の設定（`doc-index.json` を除く）、`package-lock.json`、`SPECDOJO_*` 環境変数、段の引数。
- 走査の範囲: `docs/` と、`docs/` の外に置かれた project のディレクトリ。`generated/`・`node_modules`・`.git` は数えない。生成物の受け渡しは段の間の依存で表す。

| 段             | 入力（変わると作り直す）                                                             | 日付   | 依存する前段                                           | 記録する出力（欠けたら作り直す）                  |
| -------------- | ------------------------------------------------------------------------------------ | ------ | ------------------------------------------------------ | ------------------------------------------------- |
| exec refresh   | `schedule/` と `execution/` の全ファイル、`docs/` のどこかの `dct-*.yaml`            | 見る   | なし                                                   | `execution/generated/` のファイル                 |
| catalog build  | `docs/` の全ファイルから、各 project の登録簿のディレクトリを除いたもの              | 見ない | なし                                                   | カタログの `generated/` のファイル                |
| register build | `docs/` の全ファイル（個票・events・派生元や対象文書の doc id を docs 全体から引く） | 見る   | なし                                                   | 登録簿と `controls/` の `generated/` のファイル   |
| yaml-pages     | `docs/` の `*.yaml`・`*.yml`                                                         | 見ない | なし                                                   | YAML ごとの `generated/<名前>.md`                 |
| dashboard      | `docs/` の全ファイル                                                                 | 見る   | exec refresh・catalog・register                        | `execution/generated/dashboard.md`                |
| index build    | `docs/` の全ファイル                                                                 | 見ない | exec refresh・catalog・register・yaml-pages・dashboard | `.specdojo/doc-index.json`（`--output` の指定先） |

- 依存する前段は、その鍵を自分の鍵に含める。前段を今回作り直す場合も作り直す。dashboard は exec refresh の `state.json`・`ready.json` を、index は前段の生成物（登録簿の `pjr-index.md`・YAML の表示のページなど）を読むためである。
- 日付は UTC・ホストの時間帯・各 project の `register_date_timezone` で数える。登録簿の期限切れや dashboard の進捗は、入力が同じでも日付で変わるためである。
- 判定できないときは作り直す。具体的には、記録が無い・読めない・形が違う、記録した出力が欠けた、`repos` か `external_projects` があり入力が repo の外に及ぶ、project のパスが repo の外を指す、repo に `node_modules` が無く記録を置けない、のいずれか。
- 記録は `node_modules/.cache/specdojo/build-steps.json` に置く。段を流す前に、その段の記録を消し、成功した後に鍵と出力を書く。途中で止まった段は次回作り直す。

### 5.3. 時間

2026-11-23 にこの worktree（`dist` なし、tsx で流れる）で測った。`docs:generate:fresh` を `tmp/e73z/measure.mjs` から流し、終わるまでの時間を取った。「個票を 1 件直した」は、この個票の更新時刻を今へ変えた後に流した。各 2 回。

| 場合              | 直す前           | 直した後         |
| ----------------- | ---------------- | ---------------- |
| 何も変えていない  | 0.15 秒・0.15 秒 | 0.58 秒・0.58 秒 |
| 個票を 1 件直した | 13.7 秒・13.6 秒 | 11.1 秒・11.4 秒 |

- 個票を直した後は、register（4.4 秒）・dashboard（5.2 秒）・index（1.0 秒）だけが流れ、exec refresh・catalog・yaml-pages の約 2.3 秒が減った。残りの大半は register と dashboard そのものにかかる。
- 何も変えていない場合は 0.4 秒ほど遅くなった。CLI の起動（tsx）と、約 17,000 ファイルの更新時刻の走査にかかる。前の判定は `docs/` の最新の更新時刻だけを見ていたため、ファイルを消した場合や、日付の変わり目、生成物が欠けた場合を取り違えていた。古い生成物で起動しないことを優先し、この差は受け入れた。

### 5.4. 判断した点

- 判定は内容のハッシュでなく、パス・サイズ・更新時刻にした。`docs/` の約 17,000 ファイルを毎回読むと、何も変えていない場合の時間が延びる。更新時刻は「新しいか」でなく「同じか」で比べるため、消したファイル・足したファイル・checkout で戻ったファイルも変化として拾う。内容の同じ書き直しでも作り直すが、これは安全側の誤りである。
- catalog・register・dashboard・index の入力は、狭めると取り違える恐れがあるため `docs/` 全体にした。catalog はカタログが指す成果物・rulebook・sample を `docs/` のどこからでも読む。register と dashboard は doc id を `docs/` 全体から引く。catalog だけは、成果物にならない登録簿のディレクトリを外した。
- yaml-pages の入力は YAML だけにした。表示のページは YAML の中身とパスから作り、Markdown の doc id は YAML の項目にならない（重複した id は索引の生成で失敗として出る）。
- CLI の実装が変わると全段を作り直す。段ごとにどの実装ファイルを使うかを数えると取り違えるためである。
- 記録の置き場は `node_modules/.cache/` にした。git の管理外で worktree ごとに分かれ、保護された設定（`.specdojo/`）や `.gitignore` を変えずに済む。`node_modules` の無い repo では記録せず、毎回全段を流す。
- `--skip-fresh` は `--only` と併用できないようにした。段の間の依存は既定の 6 段の順で決めているためである。

### 5.5. 保護された設定

- 変えていない。`package.json` の `docs:generate:fresh` は今の `specdojo-docs-site generate . --skip-if-fresh` のままで、新しい判定を使う。

### 5.6. CHANGELOG に書く事項

- 区分: Changed
- 文案: `specdojo build --skip-fresh` を追加し、`specdojo-docs-site generate --skip-if-fresh`（`docs:generate:fresh`）は、入力が前回の成功から変わった段だけを作り直すようにした。段ごとに入力ファイルのパス・サイズ・更新時刻、CLI の実装、設定、日付（exec・register・dashboard）、依存する前段から鍵を作って比べ、判定できないときはその段を作り直す。個票を 1 件直した後の生成は 13.7 秒から 11.1 秒になった。

### 5.7. 残課題

- `dist` がある場合の時間は測っていない。run の最中に `npm run build` をしない運用のためである。

## 6. 関連ドキュメント

- [[specdojo:command-reference|コマンドリファレンス]]: `build --skip-fresh` の説明を足した。
- [[prj-0001:pjr-bnav-faster-docs-dev-startup|PJR-BNAV]]: `--skip-if-fresh` を足した項目。直す前の判定の出どころ。
- [[prj-0001:pjr-bbtw-docs-dev-skip-exec-records|PJR-BBTW]]: 派生元。
