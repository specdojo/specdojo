---
specdojo:
  id: prj-0001:pjr-g5dy-dashboard-action-required-content
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-27T10:33:10Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-27T12:22:57Z"
  conclusion: dashboard の「人の対応が要るもの」の表に「内容」の列を足した。登録簿の項目は個票のタイトル、schedule の task は対象の文書の名前を出す
---

# PJR-G5DY dashboard の「人の対応が要るもの」の表に内容の列を足す

## 1. 概要

表が種別・項目（ID）・次にすることだけで、項目が何かをパッと見て分からないため、個票のタイトルや対象の成果物の名前を出す列を足す

## 2. 入力

- 利用者（indie）が、dashboard の「人の対応が要るもの」の表に内容が書かれていないため、パッと見て分からないと指摘した（2026-11-27）
- 表は src/dashboard/dashboard.ts の renderActionRequiredSection が作り、行は aggregateActionRequired が集める。今の列は種別・項目・次にすること

## 3. 完了条件

- `dashboard build` が作る「人の対応が要るもの」の表に、「項目」の次へ「内容」の列を足している。
- 登録簿の項目の行（`review`・`decision`・`question`・`waiting` など）は、「内容」に個票のタイトルを出している。
- schedule の task の行（`human`・`blocked`）は、「内容」に対象の成果物の名前（成果物カタログから引けるもの）を出している。引けない場合は task の名前、どちらもない場合は `-` を出す。どれを出すかの細かい決め方は executor が決め、理由を個票の対応結果に書いている。
- 「内容」のセルは、今の `sanitizeDashboardCell` と同じ扱い（`|` のエスケープ、改行の除去）をしている。長いタイトルを切るかどうかは executor が決め、理由を個票の対応結果に書いている。
- 「種別」「項目」「次にすること」の列と、行の並びは変えていない。dashboard のほかの章は変えていない。
- dashboard の単体テストで、登録簿の項目と schedule の task の両方の行に「内容」が出ることを確かめている。
- `docs/ja/specdojo/` の dashboard の説明に表の列が書かれていれば、それに合わせている。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`package.json` など）は変えない。
- 作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。

- 2 回目の実行（2026-11-27）で、schedule の task の行の「内容」を直している。1 回目では、型の task（`T-KATA-WAVE-3-atc-index-sample-140` など）の対象が成果物カタログにないため、task 名（「完成版確定」）が出て「次にすること」と重なり、blocked の行（`T-KATA-WAVE-1-bes-index-140` など）は `-` だった。
  - 「内容」には、対象の文書の名前を出す。ready.json の task の `local_id`（例: `atc-index-sample`）を使い、成果物カタログか型のカタログ（`dct-kata.yaml` など）から引ける場合は、その文書の名前（H1 などの人が読む名前が引ければそれ、引けなければ `local_id`）を出す。
  - ready.json にない blocked・doing の task も、schedule の task の定義から `local_id` を引いて同じように出す。
  - task 名は、「次にすること」と同じ中身になるときは「内容」に出さない。
  - 単体テストに、型の task と blocked の task の行の「内容」を確かめる場合を足している。

## 4. 作業内容

| No  | 作業                                                                           | 担当 | 状態 | メモ                                                            |
| --- | ------------------------------------------------------------------------------ | ---- | ---- | --------------------------------------------------------------- |
| 1   | 「内容」列を `aggregateActionRequired` と `renderActionRequiredSection` に追加 | DEV  | done | `src/dashboard/dashboard.ts`                                    |
| 2   | 単体テストと dashboard の説明の更新                                            | DEV  | done | `tests/src/dashboard/dashboard.test.ts`、`command-reference.md` |

## 5. 対応結果

「項目」の次に「内容」の列を足した。

- 登録簿の項目の行は個票のタイトルを出す（なければ `-`）。
- schedule の task の行は、成果物カタログから引ける成果物のファイル名（拡張子なし）、なければ ready の task 名、どちらもなければ `-` の順に出す。カタログの対応表は成果物の名前を持たずパスだけのため、ファイル名を名前として使った。
- セルは `sanitizeDashboardCell` を通す。長いタイトルは切らない。切ると項目の見分けに要る情報が欠け、表の幅は文書サイトの折り返しで足りるため。
- 変更ファイル: `src/dashboard/dashboard.ts`、`tests/src/dashboard/dashboard.test.ts`、`docs/ja/specdojo/references/command-reference.md`。
- 検証: `npm run typecheck`・`npm run lint:ts`（エラーなし）、dashboard の単体テストは通過。

### 5.1. 2 回目の実行（2026-11-27）

schedule の task の行の「内容」を、対象の文書の名前に直した。

- 型の task の ID（`T-KATA-WAVE-3-atc-index-sample-140`）は `extractLocalId` では `WAVE-3-atc-index-sample` と誤って引けるため、schedule の task 定義（`buildScheduleIndex` の node）の `local_id` を使う。ready.json の task は、その `local_id` を優先する。
- 選ぶ順は、task 定義の成果物名（`artifact_name`、strategy のカタログの名前）、成果物カタログのファイル名、`local_id`、task 名、`-`。blocked・doing で ready.json にない task も、task 定義から同じように引く。
- task 名は「次にすること」に含まれるときは出さない（human の行は「<task 名>を実施」と重なるため）。
- 単体テストを足した（型の task と blocked の task の行）。既存の human の行の期待は、task 名が出なくなり `-` に変えた。
- 変更ファイル: `src/dashboard/dashboard.ts`、`tests/src/dashboard/dashboard.test.ts`、`docs/ja/specdojo/references/command-reference.md`。
- 検証: dashboard の単体テスト・`npm run typecheck`・`npm run lint:ts`（エラーなし）を通した。

### CHANGELOG に書く事項

- 区分: Changed
- 文案: dashboard の「人の対応が要るもの」の表に、項目の内容（個票のタイトル、または成果物名・task 名）を示す「内容」の列を追加した。

## 6. 関連ドキュメント

- なし
