---
specdojo:
  id: prj-0001:pjr-5f1y-exec-resume-instruction-option
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  registered_at: "2026-11-13T14:08:18Z"
  commit_type: feat
  commit_scope: exec
---

# PJR-5F1Y exec resume に、再開の指示を plan へ足すオプションを用意する

## 1. 概要

再開の前に plan の共通規約の前へ追加の指示を入れる作業を、Python の挿入ではなく CLI で行えるようにする

## 2. 入力

- 2026-11-12〜13 の型の整備と夜間の実行で、orchestrator が手作業やシェルスクリプトで補った

## 3. 完了条件

- `exec run --register <ID> --resume --resume-from executor` に、再開の指示の文を plan へ足すオプションを足す（例: `--resume-note <text>`。繰り返し指定できる。名前は executor が決める）。
- 指示は、run の plan の共通規約の参照の行の前に、見出し付きの節として入る。共通規約の参照の行とその後ろは変えない。
- `--resume-from executor` を伴わない場合は、起動の前にエラーで止める。worktree の plan を手で直すと、通常の再開では統合の前に範囲外の変更として止まるためである。
- 足した指示と日時が、run の記録（`pipeline-state.json` か evidence など、executor が決める）に残る。
- 単体テストで、plan への挿入の位置、`--resume-from executor` が無いときのエラー、記録に残ることを確かめる。
- コマンドリファレンスと exec 運用ガイドの再開の節に、オプションと使う場面を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。利用者に影響が無い場合はそう書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` が通り、親の検証が通る。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
