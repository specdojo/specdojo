---
specdojo:
  id: prj-0001:xer-pjr-6aqf-20261108t081319z-3e8a3a79
  type: exec-result
  task_id: PJR-6AQF
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-6AQF/pjr-6aqf-20261108T081319Z-3e8a3a79/plan.md
  started_at: "2026-11-08T08:13:26.749Z"
  completed_at: "2026-11-08T08:30:04.001Z"
  agent: flash-high-executor
  approach: rulebook-maintenance
  targets:
    - specdojo:clis-rulebook
---

# Edit Result

## 1. 実施内容

- CLI 仕様（`clis`）の型に、入力ファイルの規則（読むファイル、ない場合・破損時の扱い、正本参照、エラー連携）に関する記述を追加しました。
- `clis-sample` に、読むファイルの例（商品マスタなど）と、ファイルが存在しない場合や形式が破損している場合のエラー例を追加しました。
- これに伴い、`clis-rulebook` の章構成を調整し、`clis-sample` の内容を更新しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/clis-rulebook.md`: 「出力と生成ファイルの要点」を「入力と出力のファイルの要点」に改題し、コマンドが読むファイル（設定・正本・前のコマンドが作ったファイル）と、作る・変えるファイルを分けて記述する規則、および読むファイルの中身は書かずに `rulebook` や `schema` を参照する旨の記述を追加しました。また、読むファイルの誤りに伴うエラー（終了コード、エラー表示、利用者の次の手）の扱いについても追記しました。
- `docs/ja/specdojo/samples/clis-sample.md`: 読むファイルの例（商品マスタ等）と、それらが存在しない場合や形式が壊れているときのエラー例を追加しました。

## 3. 申し送り

- CHANGELOG に書く事項 - 区分: 変更, 行の文案: CLI 仕様（clis）の型に入力ファイルの要点（読むファイル、ない場合・形式破損時の扱い、正本参照、エラー連携）を追加し、clis-sample に商品マスタ等の例とエラー回復例を追加（specdojo:clis-rulebook, specdojo:clis-sample）
- 規則と sample の書き方で executor が決めた内容と理由（PJR-025M への判断材料）: 1) 章立てと小節構成（第5章を入力と出力のファイルの要点とし、読むファイル、標準出力、作る・変えるファイルの3小節に分離）、2) 中身の重複排除と正本参照（中身は書かずrulebook/schema参照）、3) ない場合と形式破損時の扱いの明記、4) 終了コード・エラー表示・利用者の次の手との連携、5) ifx-cmd の型との用語・概念の整合性（渡すファイル/作るファイルと読むファイル/作る・変えるファイルの一貫性維持）
- 後続アクション: uis の型、ほかの型、カタログ（`dct-*.yaml`）は変更なし。後続の確定タスク（PJR-025M）にて本対応結果の決定内容と clis の型の確定判断を行う。
- 適用外の検証: `npm run validate:schema:file`（No `*.yaml` or `*.yml` deliverable files were changed）

## 4. 進め方と実践の型の適用

指示に従い、`docs/ja/specdojo/rulebooks/clis-rulebook.md` を編集して「入力と出力のファイルの要点」に関する規定を追加しました。また、`docs/ja/specdojo/samples/clis-sample.md` に具体的な入力ファイルとエラーの例を追記しました。
