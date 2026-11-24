---
specdojo:
  id: prj-0001:pjr-nm7e-docs-site-name-too-long
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  difficulty: medium
  registered_at: "2026-11-24T17:49:58Z"
  derived_from:
    - PJR-FZQA
---

# PJR-NM7E 長い名前の生成ページで文書サイトのビルドが ENAMETOOLONG で止まる

## 1. 課題内容

PJR-FZQA の確かめ（2026-11-25）で、試しのリポジトリ（prj-9001）の文書サイトのビルドが `ENAMETOOLONG` で止まった。grade の生成ページ `execution/grade/generated/runs/review-prj-9001-T-N0P1-prj-success-criteria-and-acceptance-criteria-010-5b3f299a01-20261124T134340Z/1/stage-1/...-grade-reporter-plan.md` のパスを VitePress が `_` でつないで asset のファイル名にし、1 つのファイル名の上限（255 バイト）を超えた。task ID や sample 名が長い利用者のリポジトリでも起こりうる。試しのビルドでは生成ページをよけて通した。

## 2. 入力

- 試しのリポジトリ prj-9001 の grade の生成ページで再現（2026-11-25、オーケストレーター）
- 担当と期限は利用者の確認待ち

## 3. 影響範囲

- 文書サイトのビルド全体が止まる。対象は、grade の生成ページなど、長い task ID や sample 名をパスに含むページを持つ利用者のリポジトリ。prj-0001 の今のサイトでは起きていない。

## 4. 対応方針

- 再現の条件（どの生成ページのパスが、VitePress の出力の asset のファイル名でどの長さになるか）を確かめ、個票の対応結果に書く。
- 長い task ID や sample 名でも、文書サイトのビルドが `ENAMETOOLONG` で止まらないようにする。直し方（生成ページのファイル名を短くする、サイトの対象から外す、VitePress の asset の名前の付け方を変えるなど）は executor が決め、理由を個票の対応結果と報告の `handoff` に書く。生成ページのファイル名を変える場合は、そのページへのリンクと既存の生成物の扱いも決めて書く。
- 単体テストを足す（長い名前でもファイル名の上限に収まること）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。
- 統合の後に、オーケストレーターが長い名前の grade の記録を持つ試しのリポジトリでサイトをビルドし、止まらないことを確かめてから close する。
- 保護された設定（`.github`・`.specdojo/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
