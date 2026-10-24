---
specdojo:
  id: prj-0001:pjr-zv60-kata-authoring-sources
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-10-24T09:04:44Z"
  block_reason: "agent exited with non-zero code: parent validation failed: typecheck"
  derived_from:
    - PJR-CT6G
---

# PJR-ZV60 kata を作るときの手本を、カタログの外やプロダクトリポジトリのファイルからも指定できるようにする

## 1. 概要

rulebook-authoring などの手本は、カタログに載っている成果物の doc id でしか指定できず、カタログがないリポジトリや、成果物がプロダクトリポジトリにある場合に使えない。手本を --source で、doc id・プロジェクトリポジトリのパス・repo とパスの組（パターンを含む）で指定できるようにする

## 2. 完了条件

- v0.4.5 の範囲とする（2026-10-24、利用者が承認）。
- `register add`・`register update` に、繰り返し指定できる `--source <ref>` を加え、`<種類>-authoring` の手本を指定できる。`<ref>` は次の 3 つの形を受け付ける。
  - doc id（例: `prj-0001:lesson-plan`）。id の索引で解決できる文書。カタログに載っていなくてよい。
  - プロジェクトリポジトリのリポジトリのルートからのパス（例: `docs/ja/lessons/01-chase/README.md`）。
  - `<repo>:<path>`（例: `coderdojo-lessons:lessons/01-chase/README.md`）。`<repo>` は対象 project の `repos[].name`。
- 3 つの形の見分け方を決め、result に書く（`<repo>` が `repos[].name` と一致すればプロダクトリポジトリのパス、そうでなく `/` や拡張子を含めばプロジェクトリポジトリのパス、それ以外は doc id、など）。見分けられない場合と、手本が見つからない場合は、起票と実行の時点で理由を示して止める。
- パスにはディレクトリと、`*` などのパターンも書ける。展開した手本の件数に上限を設け（値と理由を result に書く）、超える場合は止める。
- 手本は個票の frontmatter に記録し（項目の名前は既存の項目と整合をとって決め、schema に書く）、plan に手本のパス（プロダクトリポジトリは `$SPECDOJO_REPO_<NAME>` など、executor から読める形）を載せる。手本は読み取り専用とし、プロダクトリポジトリは変更せず、commit の対象にも入れない。
- カタログがなくても `<種類>-authoring` を起票・実行できる。カタログの参照の付け替えは、手本がカタログに載っている成果物で、作った種類の参照が `undecided` か未記入のときだけ行う。
- 今の `--target` の 2 つ目以降に doc id を書く形も、互換のために受け付け続け、`--source` と同じ扱いにする。
- [[specdojo:kata-guide]]・[[specdojo:quick-start-guide]] の kata を作る節・コマンドリファレンスに、`--source` の書き方を書く。
- 単体テストで、3 つの形の見分け方、パターンの展開と上限、カタログがない場合、互換の `--target` を確かめる。統合テストで、プロダクトリポジトリを `repos` で宣言しカタログを持たない一時のリポジトリで、プロダクトリポジトリのファイルを手本に rulebook を作る plan が作られ、手本のパスが載ることを確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- register と exec の plan の生成を変えるため、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- CHANGELOG の `## [Unreleased]` の節に書く（なければ作る）。

## 3. 作業内容

| No  | 作業                                              | 担当 | 状態 | メモ   |
| --- | ------------------------------------------------- | ---- | ---- | ------ |
| 1   | kata の手本を --source で広く指定できるようにする | DEV  | done | v0.4.5 |

## 4. 対応結果

- `register add` / `register update` に繰り返し可能な `--source` を追加し、個票 frontmatter の `sources` へ保存するようにした。2 個目以降の `--target` は互換入力として `sources` と同じ resolver へ渡し、新しく起票・更新する個票では `targets` の新規 kata ID と `sources` の手本を分けて記録する。
- 手本は、`<repo>` が対象 project の `repos[].name` と一致すればプロダクトリポジトリのパス、そうでなく `/` または拡張子を含めばプロジェクトリポジトリのパス、残りを doc id と判定する。パスはファイル、ディレクトリ、glob を受け付け、起票時と plan 生成時の両方で存在と展開結果を検証する。
- 展開後の手本は、重複除外後の合計を 100 ファイルまでとした。広すぎる glob による意図しない読み取り範囲と plan の肥大化を抑えつつ、複数の実例を比較する通常の authoring には十分な件数を確保するためである。超過時はパターンを狭めるよう理由を示して停止する。
- カタログなしでも authoring plan を生成できるようにし、プロダクトリポジトリのパスは `$SPECDOJO_REPO_<NAME>/<path>` として plan に載せる。手本は `targets` に含めず読み取り専用とし、カタログ成果物で該当参照が `undecided` または未記入の場合だけ参照更新の対象にする。
- [[specdojo:kata-guide|実践の型活用ガイド]]、[[specdojo:quick-start-guide|Quick Startガイド]]、[[specdojo:command-reference|CLIコマンドリファレンス]]、CHANGELOG を更新し、doc id・パス・プロダクトリポジトリ・glob・上限・カタログなし・互換入力を単体テストと統合テストへ追加した。
- 統合後の `exec run --register` の通し確認は、統合前の executor sandbox では実施せず、PJR-JSEY の手順に従って runner または人が 1 回実施する。

## 5. 関連ドキュメント

- PJR-CT6G（kata を新しく作る approach の実装）
- PJR-EKRW（利用者の kata の置き場所）
- [[specdojo:kata-guide]]
