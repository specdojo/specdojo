---
specdojo:
  id: prj-0001:xer-t-kata-review-all-prj-scope-sample-140-20261125t042624z-fd7bdc43
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-prj-scope-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-prj-scope-sample-140/T-KATA-REVIEW-ALL-prj-scope-sample-140-20261125T042624Z-fd7bdc43/plan.md
  started_at: "2026-11-25T04:26:33.370Z"
  completed_at: "2026-11-25T04:39:15.813Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:prj-scope-sample
    - specdojo:prj-scope-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として prj-scope-sample の主張 11 件を schema・rulebook・関連 sample と突き合わせた。10 件は一致し、不一致は 1 件だった。
- 不一致は、運用開始前 1 か月のベースライン手書き記録を、前提・制約・依存関係の依存条件として扱うという記述だった。前提・制約・依存関係 sample にベースラインの項目はなく、記録手順は成功基準と受入条件 sample の判定手順の 1 番にある。この記述を、成功基準と受入条件の判定手順を参照する形に直した。
- この sample はコマンド・オプション・`src/` の挙動を書いていない。そのため `--help` や `src/` との照合は対象外とした。plan に展開された grade と condense の finding はなかった。
- 検証は、executor の prettier と markdownlint が通り、runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` も通った。変更種別により非適用になった検査は runner が記録している。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/prj-scope-sample.md`: ベースライン記録を前提・制約・依存関係の依存条件として扱っていた記述を、成功基準と受入条件の判定手順を参照する記述に直した（1 行の差分）。タブレット 1 台は前提・制約・依存関係の依存条件のまま維持した。

## 3. 申し送り

- R4 で確かめた主張と結果は、executor handoff の No.1〜No.11 のとおり。不一致は No.7 の 1 件だけで、修正済み。
- 確かめられなかった主張はない。
- 確かめ No.1 | 主張: frontmatter の type: project と rulebook: specdojo:prj-scope-rulebook | 正本: docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml、docs/ja/specdojo/rulebooks/prj-scope-rulebook.md | 確かめ方: schema の deliverableType の enum と rulebook frontmatter の `deliverable_type`・sample を読み取り | 結果: 一致 | 根拠: enum に project があり、rulebook は `deliverable_type:` project と sample: specdojo:prj-scope-sample を宣言している
- 確かめ No.2 | 主張: 章構成（対象業務・対象システム・対象期間・スコープ外・境界の判断基準・スコープ変更方針）と各表の列 | 正本: docs/ja/specdojo/rulebooks/prj-scope-rulebook.md の「本文構成（標準テンプレ）」「記述ガイド」 | 確かめ方: 見出しと表の列名を読み取って照合 | 結果: 一致 | 根拠: 必須の 1〜4 章と任意の 5・6 章があり、列は 対象/内容/境界、対象（Out）/理由/補足、項目（変更入口・影響評価・承認者・記録先）
- 確かめ No.3 | 主張: 本文の wikilink 6 件（prj-overview・prj-assumptions-constraints-dependencies・prj-success-criteria-and-acceptance-criteria・dec・pm-issue-log・pm-change-request-log の各 sample） | 正本: docs/ja/specdojo/samples/ 配下の各 sample の specdojo.id | 確かめ方: grep で id を検索 | 結果: 一致 | 根拠: 6 件とも該当する id の sample がある
- 確かめ No.4 | 主張: SC-02 は営業日の90%以上で販売・在庫・つけの記録が残ることで、運用開始後2週間で判定する | 正本: docs/ja/specdojo/samples/prj-success-criteria-and-acceptance-criteria-sample.md | 確かめ方: SC-02 の行を読み取り | 結果: 一致 | 根拠: SC-02 の行の判定時期が「運用開始後2週間」
- 確かめ No.5 | 主張: 中長期指標（欠品削減・在庫適正化・つけ管理・店舗継続）を運用開始後6か月・12か月で判定する | 正本: 成功基準と受入条件 sample の SC-04〜SC-06・SC-10、prj-overview-sample の指標表 | 確かめ方: 判定時期の列を読み取り | 結果: 一致 | 根拠: SC-04・SC-06・SC-10 は6か月、SC-05 は12か月
- 確かめ No.6 | 主張: タブレット1台の用意を前提・制約・依存関係で依存条件として扱う | 正本: docs/ja/specdojo/samples/prj-assumptions-constraints-dependencies-sample.md | 確かめ方: ACD-D 行を読み取り | 結果: 一致 | 根拠: ACD-D01「店頭で使うタブレット1台の継続提供」
- 確かめ No.7 | 主張: 運用開始前1か月のベースラインの手書き記録を前提・制約・依存関係で依存条件として扱う | 正本: prj-assumptions-constraints-dependencies-sample.md、成功基準と受入条件 sample の判定手順 | 確かめ方: 「ベースライン」「手書き」「1か月」を grep | 結果: 不一致（修正済み） | 根拠: 前提・制約・依存関係 sample にベースラインの項目がなく、記録手順は成功基準と受入条件 sample の判定手順の1番にある。sample は、タブレットを前提・制約・依存関係、ベースラインを成功基準と受入条件の判定手順で参照するように直した
- 確かめ No.8 | 主張: オフライン時の運用を初期スコープに含めるかは未決 | 正本: 前提・制約・依存関係 sample の ACD-D03 | 確かめ方: 読み取り | 結果: 一致 | 根拠: ACD-D03「店主代表によるオフライン時の運用方針の決定（PJR-KN01）」
- 確かめ No.9 | 主張: ロールコード PO（店主代表）と BA（業務分析） | 正本: docs/specdojo/schemas/v1/pm-roles.schema.yaml | 確かめ方: role code の enum を grep | 結果: 一致 | 根拠: enum が PO, PM, BA, ARC, DEV, QE, UX, OPS
- 確かめ No.10 | 主張: 記録先は DEC・課題一覧・変更要求ログ | 正本: prj-scope-rulebook の「記述ガイド」のスコープ変更方針の表 | 確かめ方: 記録先の行を読み取り | 結果: 一致 | 根拠: 「DEC、課題一覧、Issue、PR、変更要求ログなど」から選んでいる
- 確かめ No.11 | 主張: 冒頭の期待効果（店主不在でも同じ手順、欠品と在庫の無駄の削減） | 正本: prj-overview-sample.md | 確かめ方: 指標表と依存の記述を読み取り | 結果: 一致 | 根拠: 指標表の欠品削減・在庫適正化、店主不在時の運営
- 申し送り（R5 または人の判断）: プロジェクト概要 sample の依存の段落は、ベースライン記録不足を前提・制約・依存関係へリスクまたは未決事項として引き継ぐと書いているが、前提・制約・依存関係 sample には対応する項目がない。前提・制約・依存関係 sample へベースライン記録の依存を足すかを決める。R4 では別の sample を直さない。
- この sample はコマンド・オプション・src/ の挙動を書いていないため、--help や src/ との照合は対象外とした。plan に展開された grade と condense の finding はなかった。

## 4. 進め方と実践の型の適用

sample-maintenance の R4 として、sample の事実主張を正本と照合した。照合先は `docs/specdojo/schemas/v1/` の schema、prj-scope-rulebook、関連 sample（概要・前提・制約・依存関係・成功基準と受入条件・DEC・課題一覧・変更要求ログ）。根拠が確認できた不一致 1 件だけを直し、一致した記述は維持した。駄菓子屋の業務の値は共通サンプル文脈の仮定として確かめの対象にしていない。プロジェクト概要 sample と前提・制約・依存関係 sample の食い違いは、別の sample の変更になるため R4 では直さず、申し送りに残した。
