---
specdojo:
  id: prj-0001:pjr-0f94-dashboard-action-first-layout
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  registered_at: "2026-11-08T14:34:25Z"
  completed_at: "2026-11-08T22:56:22Z"
  conclusion: ダッシュボードを、人の対応が要るもの・おすすめ（リンク付き、先行の項目がそろったものだけ）・実行中の epic（段ごとの進み具合と次のタスク、開始日・終了日）を先に出し、終わった epic・routine の定義・Grade の表・全体の集計を折りたたむ構成にした
---

# PJR-0F94 ダッシュボードを、人の対応とおすすめと実行中の epic を先に見せる構成に直す

## 1. 概要

dashboard build が作るダッシュボードを、人の対応が要るもの・おすすめの登録項目（リンク付き）・実行中の epic を先に出し、終わった epic・routine の定義・Grade の表・全体の集計を折りたたむ構成に直す

## 2. 入力

- 利用者の要望（2026-11-08）: 見たいものが表示されておらず使っていない。最初はおすすめの register をリンク付きで、schedule は今実行中の epic を表示し、epic ごとに完了したものは折りたたみ、Grade も折りたたむ。
- orchestrator の案を indie が推奨どおりと決定（2026-11-08）: 先頭に「人の対応が要るもの」を足す。おすすめは先行の項目がそろったものだけにし deferred を外す。実行中の epic は段ごとの数と次に流せるタスク 3 件まで。
- 今の問題: 集計が先でおすすめは 6 番目、ID がコードの書式でリンクがない、review と人の判断待ちが出ない、進捗率がプロジェクト全体の 1 つだけ、終わった epic も並ぶ、routine の定義が全部出る、Grade が 327 行、登録簿の件数は判断に使わない。

## 3. 完了条件

- `specdojo dashboard build` が作る `dashboard.md` の章を、次の順と既定の開き方にしている。折りたたみは VitePress の `::: details` で書く。
  1. 人の対応が要るもの（開く）: `review` の項目（close の確認待ち）、人の判断を待つ open の `decision`・`question`、`waiting` の項目、人が行う schedule のタスク（execution が human のもの）。それぞれ個票または plan へのリンクと、次にすることを 1 行で書く。
  2. おすすめの登録項目（開く）: 先行の項目（`depends_on`）がすべて終わり、`deferred`・`rejected`・終端でない着手できるものだけを、今のおすすめ順で 10 件。個票へのリンクと理由を書く。
  3. 実行中の epic（開く）: open の epic ごとに、track の段ごとの done と全体の数（例: 作成 3/8）、次に流せる schedule のタスクを 3 件まで、子の項目の状態。終わった子の項目は折りたたむ。
  4. 終わった epic（折りたたみ）: 一覧。
  5. routine（開く）: 直近 24 時間に失敗したものと、次に動くもの。失敗がなければその旨を 1 行で書く。routine の定義の一覧は折りたたむ。
  6. Grade（開く）: verdict ごとの件数と、点の低い 5 件。全体の表は折りたたむ。
  7. 全体の集計（折りたたみ）: Schedule の進捗率と状態別の件数、登録簿の状態別・優先度別の件数、ガントチャート。
  8. 実行記録（開く）: 一覧へのリンク 1 行。
- 個票・plan・成果物へのリンクは、`dashboard.md` からの相対パスで、文書サイトで開けるものにしている。ID はリンクの表示名にする。
- 項目がない章は、章を消さずに「ありません」の 1 行を出す。
- 単体テスト（`tests/src/dashboard/dashboard.test.ts` など）で、章の順、折りたたみ、おすすめから先行の項目がそろわないものと `deferred` が外れること、人の対応が要るものに review と人の判断待ちが出ることを確かめている。
- 空のリポジトリ（`mktemp -d` などで作った一時ディレクトリの中で `git init`・`config init`・`register scaffold` をした直後）で `dashboard build` を流し、項目のない章が「ありません」で出て、エラーにならないことを確かめ、結果を個票の対応結果に書いている。
- prj-0001 で `dashboard build` を流し、生成された `dashboard.md` が `npm run lint:md` を通り、文書サイトで折りたたみとリンクが働くことを確かめている（`npm run docs:build` が通る）。
- ガイドやリファレンスにダッシュボードの章の説明があれば、新しい構成に合わせている。
- 2 回目の実行（2026-11-09 追加）: 1 回目で前の「全体計画（epic）」の表がなくなり、epic ごとの開始日・終了日・稼働日数がガントチャートの画像の中でしか見られなくなった。「実行中の epic」と「終わった epic」の各 epic に開始日・終了日・稼働日数を書き、予定の開始日だけで着手の記録がない epic や、期限のない epic の扱い（未定の表示）を前の表と同じにしている。1 回目で外した日付のテスト（予定の開始日、終了日が未定）を、新しい場所の表示に合わせて戻している（indie が決定）。
- 空のリポジトリの確かめは、一時ディレクトリの中だけで行い、終わったら消している。`/tmp` の直下や、一時ディレクトリの外に `config init` などの出力を書いていない（2026-11-09 追加。`/tmp` の直下に init の出力が残ると、ほかのテストが既にある設定を見つけて落ちるため。PJR-5FTV）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` が通り、親の検証 `test-integration` も通る。

## 4. 作業内容

| No  | 作業                                                                         | 担当 | 状態 | メモ                                                                                         |
| --- | ---------------------------------------------------------------------------- | ---- | ---- | -------------------------------------------------------------------------------------------- |
| 1   | 今の生成の処理と、人の対応・おすすめ・epic の材料の取り方を読む              | ARC  | done | `dashboard.ts` と関連ヘルパーを精査し抽出要件を把握                                          |
| 2   | 章の順と折りたたみとリンクを直し、テストを足す                               | ARC  | done | 新8章構成、折りたたみ、リンク相対化、単体テスト実装                                          |
| 3   | 空のリポジトリと prj-0001 で生成して確かめ、対応結果に書く                   | ARC  | done | 空リポジトリ・prj-0001 での検証、`lint:md`、`docs:build` 通過                                |
| 4   | 実行中・終わった epic の各 epic に開始日・終了日・稼働日数を足しテストを復元 | ARC  | done | 実行中・完了 epic への日付表示、`track-domains.test.ts` 日付テスト復元、単体テスト追加・検証 |

## 5. 対応結果

### 実施内容

`src/dashboard/dashboard.ts` の生成ロジックを刷新し、指示された 8 章のアクションファーストな構成へ変更した。

1. **章構成と既定の開き方**:
   - `## 1. 人の対応が要るもの`（開く）: `review` 項目（close の確認待ち）、人の判断を待つ open の `decision`・`question`、`waiting` 項目（待機理由の解消）、human schedule タスクを収集し、相対リンクと次にすることを表示。
   - `## 2. おすすめの登録項目`（開く）: 先行項目（`depends_on`）がすべて完了（`done` または `decided`）し、`deferred`・`rejected`・終端でない着手可能な項目から上位 10 件を抽出し、個票への相対リンクと優先度・期日理由を表示。
   - `## 3. 実行中の epic`（開く）: open / in-progress の epic ごとに開始日・終了日・稼働日数（期限なしや未定のものは `未定` / `-` 表示）、track の段ごとの進捗（例: `作成 3/8`）、次に流せるタスク（最大 3 件）、未完了の子項目、完了した子項目（`::: details` 折りたたみ）を表示。
   - `## 4. 終わった epic`（折りたたみ）: `::: details 終わった epic の一覧（N件）` で一覧を表形式（id, title, track, 開始日, 終了日, 稼働日数）で表示。
   - `## 5. routine`（開く）: 直近 24 時間に失敗したものと次に動くものを表示（失敗なし時はその旨 1 行）。routine 定義一覧は `::: details` で折りたたみ。
   - `## 6. Grade`（開く）: verdict 別件数と点の低い 5 件を表示。全体の表は `::: details` で折りたたみ。
   - `## 7. 全体の集計`（折りたたみ）: Schedule 進捗率と状態別件数、登録簿の状態別・優先度別件数、Schedule ガントチャート、全体計画ガントチャートを `::: details 全体の集計` でまとめて折りたたみ。
   - `## 8. 実行記録`（開く）: 実行記録一覧ページへの相対リンクを 1 行で表示。
2. **リンクと空章の表示**:
   - 個票・タスクへのリンクは `execution/generated/dashboard.md` からの相対パスで生成し、ID をリンク表示名とした。
   - 各章で対象が存在しない場合は章を削除せず「- ありません」を出力。
3. **epic 日付・稼働日数の配置（2回目実行）**:
   - `loadEpicSchedules`（`computeEpicSchedules`）により算出された epic ごとの `startDate`、`endDate`、`estimateDays` を「3. 実行中の epic」および「4. 終わった epic」に復元した。
   - 予定開始日のみで着手記録のない epic、期限のない epic、日付逆転のある epic は旧全体計画表と同様に `未定` および `-` として安全に表示した。
4. **ドキュメント更新**:
   - `docs/ja/specdojo/references/command-reference.md` の `dashboard build` 説明文を新章構成・折りたたみ仕様および各 epic への日付・稼働日数表示に合わせて改訂。
5. **テスト追加・修正**:
   - `tests/src/dashboard/dashboard.test.ts` に章順、空章表示、おすすめ候補の先行項目依存・`deferred` 除外判定、人の対応が要るものの抽出、折りたたみ、実行中 epic / 終わった epic の開始日・終了日・稼働日数の各テストを追加。
   - `tests/src/register/track-domains.test.ts` で 1 回目に外していた日付テスト（開始日・期限なし未定、予定開始日のみからの日付計算・逆転時未定判定）を新レイアウトの出力形式に合わせて復元。

### 検証結果

- **空リポジトリでの検証**:
  - `mktemp -d` で作成した一時ディレクトリ内にて `git init`、`node dist/specdojo.js config init`、`node dist/specdojo.js register scaffold --project prj-0001`、`node dist/specdojo.js dashboard build --project prj-0001` を実行。
  - 全章で「- ありません」（実行記録は件数 0 件のリンク）が出力され、エラーなく終了することを確認した。検証完了後に一時ディレクトリを確実に削除し、`/tmp` 直下や一時ディレクトリ外部に出力を残さないことを確認した。
  - なお、前回の実行時に `/tmp` 直下へ残存していた init 出力（`.devcontainer`、`.prettierrc`、`.vscode`、`.claude`、`.codex`、`.opencode` 等）を清掃し、親検証（`test-integration`、`test-unit`）で発生していた失敗原因を解消した。
- **prj-0001 での検証**:
  - `node dist/specdojo.js dashboard build --project prj-0001` を実行し、`docs/ja/projects/prj-0001/execution/generated/dashboard.md` を再生成。
  - 生成されたダッシュボードの「3. 実行中の epic」に開始日・終了日・稼働日数、「4. 終わった epic」の表に開始日・終了日・稼働日数が正しく出力されることを確認。
  - `npm run docs:build`（`docs:generate` + VitePress ビルド）が exit code 0 で通過し、生成されたダッシュボードの相対リンクや VitePress 折りたたみ記法が正常にビルドされることを確認。
- **単体テスト**:
  - `npx vitest run tests/src/dashboard/dashboard.test.ts tests/src/register/track-domains.test.ts` が 41 件全件 pass することを確認。

### 迷った点と決定理由

1. **旧第 2 章「全体計画（epic）」の表の扱いと日付の復元**:
   - 1 回目で全 epic の一覧表（旧第 2 章）を整理した際、epic ごとの日付・稼働日数がガントチャート SVG 内に限定されていた。indie の決定に従い、open / in-progress な epic は「3. 実行中の epic」に、完了した epic は「4. 終わった epic」の一覧表に、それぞれ開始日・終了日・稼働日数を復元した。日付の算出ロジックは従前と同じ `loadEpicSchedules` を共有し、予定開始日のみの扱い、期限なしの未定表示、日付逆転時の未定表示との整合性を担保した。
2. **おすすめ項目の先行条件充足判定**:
   - `depends_on` に指定された項目の状態が `done` だけでなく `decided`（方針決定済み）の場合も先行条件を満たしたと判定するように実装した。これにより、決定待ちが解消された後続の作業が適切におすすめ候補に浮上する。
3. **リンク先が存在しない場合の安全対策**:
   - 個票やタスクへの相対リンクを組み立てる際、ファイルが存在しない可能性がある場合はリンク化せずコード表記やテキストとするフォールバックを設け、文書サイトでの dead link 発生を防止した。

### 5.1. CHANGELOG に書く事項

#### 変更

- `dashboard build` が生成するダッシュボードを、人の対応が要るもの・おすすめの登録項目・実行中の epic を優先し、終わった epic・routine 定義・Grade 全体表・全体の集計を折りたたむアクションファースト構成に刷新しました。「実行中の epic」および「終わった epic」には各 epic の開始日・終了日・稼働日数を表示します。

## 6. 関連ドキュメント

- 生成物: `docs/ja/projects/prj-0001/execution/generated/dashboard.md`
- コマンド: [[specdojo:command-reference]] の `dashboard build`
