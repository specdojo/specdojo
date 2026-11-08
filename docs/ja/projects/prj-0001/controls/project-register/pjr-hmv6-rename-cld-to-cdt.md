---
specdojo:
  id: prj-0001:pjr-hmv6-rename-cld-to-cdt
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  registered_at: "2026-11-08T00:30:11Z"
  derived_from:
    - PJR-2GD6
  depends_on:
    - PJR-V6RB
---

# PJR-HMV6 分類一覧の略号を cld から cdt に変える

## 1. 概要

分類一覧（Classification List）の略号 cld が概念クラス図の ccd と紛れるため、code table の cdt に変える。公開済みの kata ID は経路 B で新しい ID に切り替え、古い ID は非推奨として残す

## 2. 入力

- 略号は cdt にする（indie が決定、2026-11-08）。prj-0001 には cld の成果物も schedule のタスクもまだない。

## 3. 完了条件

- 新しい `specdojo:cdt-rulebook`・`specdojo:cdt-sample` と、カタログのテンプレート `dct-data-model-cdt-template.yaml` を作って正本にし、frontmatter（YAML は対応する項目）の `supersedes` に古い ID を書いている。中身は古い cld の型を引き継ぎ、略号・ID・見出しの表記だけを cdt に変えている。中身の手入れは PJR-7FXC で行うため、ここでは変えない。
- 古い `cld-rulebook`・`cld-sample`・`dct-data-model-cld-template.yaml` は削除せず、`status: deprecated` にして、移る先への案内だけに縮めている（[[specdojo:id-and-file-naming-standard]] の経路 B）。v0.7.0 までに公開した ID を利用者のカタログが参照している可能性があるためである。
- prj-0001 のカタログ `dct-data-model-cld.yaml` を `dct-data-model-cdt.yaml` にし、5 件の `local_id` と `path` を `cdt-*` にしている。成果物も schedule のタスクもまだないため、古い項目は残さない。`cdt-register-type` の `overview` を、今の登録項目の種別 8 種類（issue・decision・todo・question・risk・change-request・note・epic）に直している。
- ガイド・標準・rulebook・sample・template・カタログの索引など、cld を参照している文書を cdt に直している。古い略号は、移行を説明する箇所だけに残している。
- 実行記録（`execution/runs/`）・登録簿の個票とイベント・CHANGELOG の公開済みの版の節は、履歴なので変えていない。
- `src/`・`tests/` に cld を扱う処理や期待値があれば直し、なければ変えていない。
- CHANGELOG の未公開の版の節に、略号の変更と古い ID が非推奨になったことを書いている。
- `specdojo index build`・`specdojo catalog validate --project prj-0001`・`npm run lint:md`・`npm run validate:schema`・`npm run docs:build` が通っている。

## 4. 作業内容

| No  | 作業                                                          | 担当   | 状態 | メモ |
| --- | ------------------------------------------------------------- | ------ | ---- | ---- |
| 1   | cld を参照している文書と設定を洗い出す                        | _TODO_ | open | -    |
| 2   | 新しい cdt の型とカタログを作り、古い型を非推奨の案内に縮める | _TODO_ | open | -    |
| 3   | 参照を cdt に直し、CHANGELOG を書いて検査を流す               | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]
- 規範: [[specdojo:id-and-file-naming-standard]]
- 後続: [[prj-0001:pjr-7fxc-cdt-kata-reference-to-implementation]]
