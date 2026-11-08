---
specdojo:
  id: prj-0001:xep-pjr-vmxk-20261108t065105z-51c8a28c
  type: exec-plan
  rulebook: none
  task_id: PJR-VMXK
  name: "CLI 仕様（clis）の型を新しく作る"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  approach: rulebook-authoring
  targets:
    - specdojo:clis-rulebook
---

# Edit Plan: PJR-VMXK

## 1. このフェーズで行うこと

SpecDojo 自身の CLI を利用者から見た仕様を書く新しい種類 clis の rulebook と sample を作る。PJR-0YNQ で uis に足した CLI の部分を土台にし、コマンドリファレンスを参照して操作の流れ・出力の要点・終了とエラーと次の手に絞る

## 2. 新しく作る実践の型

- id: `specdojo:clis-rulebook`
- kind: `rulebook`
- path: `docs/ja/specdojo/rulebooks/clis-rulebook.md`
- 記述標準: [[specdojo:rulebook-authoring-standard|執筆標準]]（`docs/ja/specdojo/standards/rulebook-authoring-standard.md`）
- result: `docs/ja/projects/prj-0001/execution/runs/register/PJR-VMXK/pjr-vmxk-20261108T065105Z-51c8a28c/result.md`

手本にするファイル:

- `specdojo:uis-rulebook`: uis-rulebook.md（`docs/ja/specdojo/rulebooks/uis-rulebook.md`、参照更新: `カタログ外のため参照の付け替え対象外`）
- `specdojo:uis-sample`: uis-sample.md（`docs/ja/specdojo/samples/uis-sample.md`、参照更新: `カタログ外のため参照の付け替え対象外`）

手本ファイルは読み取り専用であり、プロジェクトリポジトリとプロダクトリポジトリのどちらにあっても変更しない。手本がない場合は、記述標準と対象領域の慣行だけを根拠に実践の型を作る。

## 3. 進め方

1. 記述標準と手本ファイルを実際に読み、複数の成果物に再利用できる規則・問い・完成例・雛形を抽出する。
2. `docs/ja/specdojo/rulebooks/clis-rulebook.md` に `specdojo:clis-rulebook` を持つ `rulebook` を新規作成する。frontmatter の `status` は `draft` とし、`ready` へ変更しない。
3. 手本の内容を丸写しせず、プロジェクト固有の値を一般化する。手本同士が矛盾する場合は、共通部分と差異を分け、判断できない点を result の申し送りへ記録する。
4. 手本のうち成果物カタログに載っているものだけ、作った種類の参照が `undecided` または未記入なら `specdojo:clis-rulebook` へ更新する。カタログ外の文書とプロダクトリポジトリのファイルは読み取り専用の手本にとどめ、参照を付け替えない。rulebook は成果物カタログの `rulebook`、recipe / sample / template は成果物が参照する rulebook frontmatter の同名フィールドを正本とする。
5. カタログ成果物の参照がすでに別の kata を指す場合は上書きせず、その成果物 ID・既存参照・新しい kata ID を result の申し送りへ記録する。`not-needed` も意図的な判断として上書きしない。
   recipe / sample / template の作成時に、手本の rulebook 自体が `undecided`・未記入・`not-needed` で参照先を記録できない場合は、別種の kata を同時作成せず、付け替え不能として result へ記録する。
6. 新しい kata と参照の更新だけを変更対象とし、手本ファイルは変更しない。

## 4. 完了手順

1. 新しい実践の型と、条件を満たす参照の更新を完了する。
2. 共通規約に従って必要な整形・静的検査を実行する。
3. result に実施内容、変更ファイル、手本、一般化した内容、参照を更新しなかった理由を記録する。

## 5. 異常終了の条件

- 新しい id が既に存在する、対象種別と id の末尾が一致しない、手本を解決できない、または検査が未解消の場合は異常終了する。
- 手本ファイル（プロダクトリポジトリを含む）へ変更が生じた場合は元に戻し、commit の対象に含めない。解消できなければ異常終了する。
- agent 自身は登録簿の状態を変更しない。

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- PJR-RMMM（indie が決定、2026-11-08）: CLI を新しい種類 clis（CLI Specification）に分け、uis は GUI の画面仕様だけにする。
- clis は SpecDojo 自身の CLI を利用者から見た仕様で、SpecDojo が起動する外部の CLI との約束である ifx-cmd とは分ける。

## 個票の追加完了条件

成果物カタログの `done_criteria` に加え、登録簿の個票が定める次の条件も満たす。

- `docs/ja/specdojo/rulebooks/clis-rulebook.md`（`specdojo:clis-rulebook`）と `docs/ja/specdojo/samples/clis-sample.md`（`specdojo:clis-sample`）を作っている。[[specdojo:rulebook-authoring-standard]] の章立てに従い、rulebook にサンプルの章を置かず、frontmatter の `sample` で sample を宣言している。recipe と template の要否を決め、frontmatter に書いている。
- rulebook に、次の規則を書いている。
  - clis は SpecDojo 自身の CLI のコマンド群を、利用者から見た仕様として書く。SpecDojo が起動する外部の CLI との約束（ifx-cmd）とは分ける。
  - 引数・オプションの表と使い方の詳細は書かず、コマンドリファレンスを参照する。
  - 文書には、利用目的、操作の流れ（どのコマンドからどのコマンドへ進むか）、出力と作るファイルの要点、終了コードとエラー表示と利用者の次の手を書く。
- PJR-0YNQ で `uis-rulebook`・`uis-sample` に足した CLI の部分を土台にし、CLI に合わない GUI の章（画面の表示項目・遷移など）は持ち込んでいない。
- `clis-sample` は、駄菓子屋の販売管理システムの CLI のコマンド群を題材にした完成例である。
- ID の命名の標準・成果物のリファレンス・文書サイトの sidebar・レビューの観点の設定など、種類の一覧を持つ文書と設定に clis を足している。保護された設定に当たるものは executor が変えず、変更案を個票の対応結果と報告の `handoff` に書いている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている（PJR-PJYJ で人が判断する材料にする）。
- uis の型と、prj-0001 のカタログは変えていない。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分（追加・変更・不具合修正など）と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `specdojo index build`・`npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run test:unit` が通っている。

`共通規約 sha256:7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b` `docs/ja/projects/prj-0001/execution/conventions/7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b.txt`
