---
specdojo:
  id: prj-0001:pjr-aqmw-fully-guided-refine-pass-rulebook
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  owner: ARC
  registered_at: "2026-08-12T01:12:06Z"
  due_on: "2026-08-31"
---

# PJR-AQMW fully-guided(refine-pass)の指示にrulebook不適合の修正を追加

## 1. 概要

xep-fully-guided-template.mdの「4.2 既存記述の扱い」およびryu-guide.mdの「1.3 参照の共通原則」で、修正対象をdepends_onとの矛盾だけでなく、手順1で確認するrulebookの必須要素・禁止事項（章構成を含む）への不適合も含めるよう修正する。retrofit側（xep-retrofit-template.mdの判断基準表）にrulebook適合を判断基準として追加するかも合わせて検討する。フレームワーク共通ファイルのため他プロジェクトへの影響を確認のうえ反映する。

追加スコープ（1回目の対応結果を踏まえて追記）: rulebook不適合の是正だけでは、bootstrapで挿入された不要・冗長な記述が削除されない問題が残る。既存記述の尊重原則（原則加筆・補強のみ）はそのままに、`depends_on`矛盾・rulebook不適合に加えて「同一成果物内での重複記述の統合」「rulebookの必須要素にもdone_criteriaにも寄与しない記述の削除」も修正対象に含めるよう、xep-fully-guided-template.mdの「4.2 既存記述の扱い」を再改訂する。安全弁は判断根拠をresultに記録することのみとし、追加の制約は設けない。

## 2. 完了条件

- `xep-fully-guided-template.md` の「4.2 既存記述の扱い」で、修正対象が `depends_on` との矛盾に加え、手順1で確認する rulebook の必須要素・禁止事項（章構成を含む）への不適合も含むと明記されている。
- `ryu-guide.md` の「1.3 参照の共通原則」の該当行が、上記と矛盾しない記述に更新されている。
- `xep-retrofit-template.md` の判断基準表（維持・部分反映・作り直し・新設）に rulebook 章構成不適合を判断基準として追加するかどうかを検討し、結論（追加する場合は反映内容、見送る場合は理由）を対応結果に記録している。
- rulebook 適合のための修正が「内容の全面書き換え」ではなく「既存記述を尊重した章立ての移し替え」であることが、テンプレートの記述から読み取れる。
- `xep-fully-guided-template.md` の「4.2 既存記述の扱い」の修正対象に、同一成果物内での重複記述の統合（正本を1箇所に定め他は要約・参照へ置き換える）と、rulebookの必須要素にもdone_criteriaにも寄与しない記述の削除が追加されている。追加の制約（例: owner ロール限定など）は設けず、判断根拠をresultに記録する運用のみとする。
- `npm run lint:md` がエラーなく通る。
- フレームワーク共通ファイルであるため、`prj-0001` 以外で `fully-guided` / `retrofit` approach を使用している track・プロジェクトへの影響有無を確認し、対応結果に記録している。

## 3. 作業内容

| No  | 作業                                                                                         | 担当 | 状態 | メモ                                                       |
| --- | -------------------------------------------------------------------------------------------- | ---- | ---- | ---------------------------------------------------------- |
| 1   | `xep-fully-guided-template.md`「4.2 既存記述の扱い」を修正する                               | ARC  | done | 修正対象に rulebook 不適合を追加                           |
| 2   | `ryu-guide.md`「1.3 参照の共通原則」の対応行を修正する                                       | ARC  | done | 「既存記述の尊重」の行を更新                               |
| 3   | `xep-retrofit-template.md` の判断基準表への rulebook 適合追加要否を検討し結論を出す          | ARC  | done | 追加する結論。維持・部分反映・作り直しの条件へ反映         |
| 4   | 他 track・他プロジェクトでの `fully-guided` / `retrofit` approach 使用箇所への影響を確認する | ARC  | done | プロジェクトは prj-0001 のみ。`xep-template.md` も整合修正 |
| 5   | `npm run lint:md` を実行し、エラーがないことを確認する                                       | ARC  | done | 追跡対象の Markdown はエラーなし                           |
| 6   | `xep-fully-guided-template.md`「4.2 既存記述の扱い」に重複記述統合・不要記述削除を追加する   | ARC  | done | 制約なし。判断根拠をresultへ記録する運用のみ               |
| 7   | 再度 `npm run lint:md` を実行し、エラーがないことを確認する                                  | ARC  | done | エラーなし（終了コード 0）。`npm test` も 1051 件成功      |

## 4. 対応結果

- `xep-fully-guided-template.md` の「4.2 既存記述の扱い」を改訂し、既存記述であっても修正対象となる箇所を「`depends_on` の最新の決定事項と矛盾する箇所」と「手順1で確認した rulebook の必須要素の欠落・禁止事項への抵触・章構成の不適合」の2種に整理した。あわせて、rulebook 不適合の修正は内容の全面書き換えではなく、既存記述を保持したままの章立ての移し替え・必須要素の補完として行うこと、移し替え先が定まらない記述は削除せず最も近い章に残して result に記録すること、不適合か意図的な逸脱か判断できない場合は _TODO_ / _ASSUMPTION_ を残すことを明記した。
- `ryu-guide.md`「1.3 参照の共通原則」の「既存記述の尊重」の行に、参照範囲に含む実践の型への不適合（rulebook を参照範囲に含む `fully-guided` / 未指定では rulebook の必須要素・禁止事項・章構成）も最小限の修正対象に含まれること、および修正が章立ての移し替えと必須要素の補完であることを追記した。`recipe-guided` は rulebook を参照範囲に含まないため、rulebook 適合を条件に加えない書き方とした。
- `xep-retrofit-template.md` の判断基準表には rulebook 適合を追加した。理由は、同テンプレートの「根拠の位置づけ」表で rulebook を「文書構造と記法の基準」と定義済みである一方、判断基準表の「維持」の条件が現在動作と意図された仕様の充足のみだったため、rulebook 不適合の既存文書がそのまま「維持」と判定されうる隙があったため。維持の条件に rulebook 適合を加え、部分反映の条件に rulebook の必須要素・章構成の不適合を加えたうえで、対応欄に「既存記述を保持したまま章立てを移し替える」と明記し、作り直しの条件にも rulebook の章構成を満たせない場合を加えた。
- 影響確認: `docs/ja/projects/` 配下のプロジェクトは `prj-0001` のみで、`fully-guided` / `retrofit` を指定しているのは `sch-strategy-launch.yaml`（`fully-guided` 3箇所）と `sch-strategy-data-flow.yaml`（`retrofit` 3箇所・`fully-guided` 2箇所）である。いずれも plan 生成時にテンプレートを参照する構造のため、schedule 側の変更は不要。既存の in-progress タスクは生成済み plan を使うため、本改訂は次回 plan 生成分から反映される。
- 波及修正: フォールバック用の `xep-template.md`「4. 進め方」にも既存記述の扱いが同一趣旨で書かれており、改訂後の `ryu-guide.md` と矛盾するため、同じ趣旨（rulebook を参照範囲に含む `approach` での rulebook 不適合を修正対象に含める）へ更新した。`xep-recipe-guided-template.md` は rulebook を基準にしない approach のため変更しない。review 側の `xrp-fully-guided-template.md` は既に rulebook の必須要素・禁止事項の確認と、template と食い違う場合に rulebook を正とする旨を記載済みのため変更不要。
- 検証: 追跡対象の Markdown では `markdownlint` がエラーなく完了した（`npx markdownlint '**/*.md' --ignore '**/generated/**'` が終了コード 0）。`npm run test` / `npx tsx src/specdojo.ts catalog validate` / `register build` / `index build` / `validate-history-links` も成功した。
- 追加スコープ対応（2回目）: `xep-fully-guided-template.md`「4.2 既存記述の扱い」の修正対象に「同一成果物内で同じ内容が複数箇所に重複している箇所」と「rulebook の必須要素にも `done_criteria` にも寄与していない記述」の2種を追加し、既存の2種（`depends_on` 矛盾・rulebook 不適合）と合わせて4種に整理した。統合は「内容が最も適切な1箇所を正本と定め、他は要約または正本の章への参照に置き換える。統合で情報が失われる場合は不足分を正本側へ取り込んでから整理する」、削除は「既存記述の尊重の例外であり、判断根拠を result に記録することで担保する」と定義した。追加の制約（owner ロール限定・削除量の上限など）は設けていない。
- 安全弁の位置づけ: 削除の暴走防止は判断根拠の result 記録のみとする方針に従い、新たな禁止規定は追加していない。既存の「判断できない場合は破棄せず _TODO_ / _ASSUMPTION_」の行に「必須要素・`done_criteria` に寄与するか判断できない場合」を追記して既存原則の適用範囲を広げるにとどめた。あわせて「移し替え先が定まらない既存記述は削除しない」の行に「下記の削除対象に該当しない限り」の条件を付け、新設した削除規定との矛盾を解消した。判断根拠の記録先（「4.3 判断根拠の記録」および 4.2 末尾）にも統合・削除を追加し、削除・統合は対象箇所と根拠が後から追える粒度で記録すると明記した。
- 波及修正（2回目）: 参照の共通原則の正本である `ryu-guide.md`「1.3 参照の共通原則」の「既存記述の尊重」の行と、フォールバック用 `xep-template.md`「4. 進め方」の対応行にも、重複記述の統合と非寄与記述の削除を追記した。`ryu-guide.md` は `fully-guided` / `recipe-guided` / 未指定を横断して記述する行のため、必須要素の基準を「参照範囲に含む実践の型の必須要素（rulebook を参照範囲に含む `fully-guided` / 未指定では rulebook の必須要素）」と表現し、rulebook を参照範囲に含まない `recipe-guided` でも矛盾しない書き方とした。`xep-recipe-guided-template.md` 本体は今回の追加スコープ（rulebook 起点の是正）の対象外のため変更していない。
- retrofit 側の再検討（2回目）: `xep-retrofit-template.md` の判断基準表への重複統合・非寄与記述削除の追加は見送った。理由は、追加スコープの目的が bootstrap 挿入記述の整理であり、retrofit の判断基準表は「現在動作の反映可否」を判定する軸で構成されているため、削除・統合の軸を混ぜると判定基準が二重化するため。retrofit で不要記述が残る事象が観測された場合に別 PJR で扱う。
- 検証（2回目）: `npx prettier --write` と `npx markdownlint` を変更5ファイルに実行してエラーなし。`npm run lint:md` は `register build` 実行前で終了コード 0。`docs/ja/specdojo/templates/` 配下の変更のため `npm test` も実行し、79 ファイル 1051 件すべて成功した。`catalog validate`（終了コード 0）・`register build`・`index build`（1117 entries）・`validate-history-links`（終了コード 0）も成功した。`register build` 後の `lint:md` では下記の既存不具合による MD049 が `generated/` 配下のみで再現するが、staged 対象外のため commit はブロックされない。
- 既存不具合（本タスク範囲外）: `register build` 後にリポジトリ全体で `npm run lint:md` を実行すると、gitignore 済みの `generated/` 配下の一覧で MD049 が出る。原因は [[prj-0001:pjr-0053-template]] の概要に含まれるアスタリスク強調 `*CAPITAL_CASE*` で、本変更とは無関係のため修正していない。別 PJR での対応を推奨する。

## 5. 関連ドキュメント

- 変更対象（`docs/` 内だが `id` 未登録のため相対パス表記）: `docs/ja/specdojo/templates/xep-fully-guided-template.md`、`docs/ja/specdojo/templates/xep-retrofit-template.md`
- 参照の共通原則の正本: [[specdojo:ryu-guide]]
- 提案の経緯を記録したメモ: [[prj-0001:pjr-ez9g-sch-strategy-bootstrap-human-review]]
- 対になる todo: [[prj-0001:pjr-sdxb-bootstrap]]
- `xep-fully-guided-template.md` への過去の変更: [[prj-0001:pjr-0102-xep-fully-guided-template]]
