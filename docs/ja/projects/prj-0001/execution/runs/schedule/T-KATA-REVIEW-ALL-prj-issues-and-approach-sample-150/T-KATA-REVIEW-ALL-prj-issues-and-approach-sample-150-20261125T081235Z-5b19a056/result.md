---
specdojo:
  id: prj-0001:xer-t-kata-review-all-prj-issues-and-approach-sample-150-20261125t081235z-5b19a056
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-prj-issues-and-approach-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-prj-issues-and-approach-sample-150/T-KATA-REVIEW-ALL-prj-issues-and-approach-sample-150-20261125T081235Z-5b19a056/plan.md
  started_at: "2026-11-25T08:12:45.613Z"
  completed_at: "2026-11-25T08:27:23.883Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:prj-issues-and-approach-sample
    - specdojo:prj-issues-and-approach-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）の段で、プロジェクト課題と解決アプローチの sample を概要・スコープ・前提制約依存関係の sample と照合し、食い違い 4 か所を sample 側で直した。
- 比較検討の sample の P-03 の要約と、概要の sample の「初期公開」の表記は、相手側を直す案として申し送った。相手側は変更していない。
- F001（A-01 の対応課題の P-04）は前の段で「P-04（記録の蓄積のみ）」に直っていた。3 章本文の P-04 を先送りする扱いとそろっているため、解消と判断した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/prj-issues-and-approach-sample.md`: 食い違い 4 か所を直した（14 行追加・14 行削除）。(1) 冒頭段落の前提・制約・依存関係の成立条件から単一店舗と店主代表の最終判断を外し、単一店舗はスコープの初期対象へ移した。成立条件は ACD-D01 と ACD-A01 に絞った。(2) P-02 の備考の引用を概要の初期公開指標（残高表示まで1分以内）の表現に直した。(3) 通信断のリスク行を「端末が使えない日（ACD-D01）や通信断が起きた日（ACD-A02）に記録が抜ける」に直した。(4) オフライン時の記録方法の完了条件に、成功基準へ追加する受入条件を足した。

## 3. 申し送り

- R5-1 から R5-4 は sample 側で直した。R5-5 と R5-6 は相手側を直す案で、変更していない。指摘 1 件ごとの表は、実施内容の表として evidence.handoff の記述から 1 回だけ書く。
- 要判断（R5-6）: 概要の sample だけが「初期公開」と書き、ほかの sample は「初期リリース」と書く。案は、`docs/ja/specdojo/samples/prj-overview-sample.md` の「初期公開」を「初期リリース」に寄せることである。ただし概要は「初期公開」を定義して使っており、意図した使い分けの可能性がある。本 sample 側だけを直す案は、概要の章名と食い違うため採らなかった。概要の章名を変えるなら、本 sample の参照も合わせて直す。
- 相手側の修正案（R5-5）: `docs/ja/specdojo/samples/prj-comparison-of-alternatives-sample.md` の課題と解決アプローチの要約「P-03 在庫過不足」を、本 sample に合わせて「P-03 在庫低下の気づきの遅れ」に直す。
- R5-1: R5 / 冒頭の段落 / 前提・制約・依存関係の成立条件として「単一店舗、タブレット1台、店主代表の最終判断」を挙げていたが、ACD の sample は単一店舗の境界をスコープに任せている。店主代表の最終判断は概要の「前提条件」にあり、ACD の項目ではない / 単一店舗をスコープの初期対象（単一店舗の店頭販売・在庫・つけ管理）に移し、ACD の成立条件を「タブレット1台の継続提供（ACD-D01）、現行手順に近い操作での記録継続（ACD-A01）」に直した / `vp-qe-kata-conformance`（kata 相互）、ACD の sample の「前提条件」の冒頭の文 / -
- R5-2: R5 / 課題一覧（P-02 の備考） / 「期待効果「つけ残高を1分以内で確認」の対象」は概要の文言のように括弧付きで引いているが、概要にその文言はない。概要の該当箇所は初期公開指標のつけ管理（顧客検索からつけ残高の表示まで1分以内） / 「概要の初期公開指標（残高表示まで1分以内）の対象」に直した / `vp-qe-kata-conformance`、概要の sample の「初期公開指標」の表 / -
- R5-3: R5 / トレードオフ/リスク（通信断の行） / 「ACD-D01・ACD-A02 の前提が崩れた場合」としていたが、ACD-A02 の内容は「店頭では通信断が起き得る」という前提であり、通信断が起きても前提が崩れたことにはならない。また ACD-D01 は前提ではなく依存である / 「端末が使えない日（ACD-D01）や通信断が起きた日（ACD-A02）に記録が抜ける」に直した / `vp-qe-kata-conformance`、ACD の sample の ACD-A02・ACD-D01 の行 / -
- R5-4: R5 / 次の検討事項（オフライン時の記録方法の行） / 完了条件が方針の決定だけで、ACD-D03 の「方針・追加受入条件・確認結果がそろうまで未成立」と、スコープの「受入後に追加する受入条件で判定する」に足りていない / 完了条件に「成功基準に追加する受入条件」を足した / `vp-dev-change-impact`、ACD の sample の ACD-D03、スコープの sample の「スコープ外」の後の段落 / -
- R5-5: R5 / 解決アプローチの比較検討の sample（相手側。前提の一覧の課題と解決アプローチの項目） / 「P-01 記録不統一、P-02 残高確認の負荷、P-03 在庫過不足」としているが、本 sample の P-03 は「人気商品の在庫の減りに気づくのが遅れる」で、在庫過不足は P-04（先送り）に当たる / - / `vp-qe-kata-conformance`。相手側の docs/ja/specdojo/samples/prj-comparison-of-alternatives-sample.md の P-03 の要約を「P-03 在庫低下の気づきの遅れ」に直す案 / -
- R5-6: R5 / プロジェクト概要の sample（相手側、全体） / 概要の sample だけが「初期公開」と書き、スコープ・憲章・成功基準・共通サンプル文脈・本 sample は「初期リリース」と書く。系列の中で表記が分かれている / - / W8、`vp-qe-kata-conformance`。相手側の docs/ja/specdojo/samples/prj-overview-sample.md の「初期公開」を「初期リリース」に寄せる案。迷った理由: 概要は「初期公開（店頭で使い始める最初の版の提供）」と定義して使っており、意図して分けた語の可能性がある。選ばなかった案は、本 sample の「初期公開指標」の参照を「初期リリース指標」に変えて本 sample の側だけを直すこと。概要の章名と食い違うため採らなかった。概要の章名を変える場合は、本 sample の参照も合わせて直す / 要判断
- F001（A-01 の対応課題の P-04）は前の段で「P-04（記録の蓄積のみ）」に直っており、3 章の本文の P-04 を先送りする扱いとそろっているため解消と判断した。用語集（docs/ja/product/010-business-specs/060-glossary/ の `gl-*.yaml`）には本 sample の業務の語（つけ、ベースライン、店主代表など）が載っておらず、食い違いはない。共通サンプル文脈（役割名を使い人物名を書かない、駄菓子屋の題材）にも合っている。frontmatter の `based_on`（概要・スコープ・前提・制約・依存関係）と本文の wikilink の参照先は一致している。
- 適用外の検証: `npm run validate:history-links`（履歴ファイル（plan / result / 個票）を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更した YAML ファイルがない）

## 4. 進め方と実践の型の適用

根拠にした資料は次のとおり。概要・スコープ・前提制約依存関係の各 sample、用語集、Sample 記述標準の共通サンプル文脈、frontmatter の `based_on` と本文の wikilink の参照先。食い違いは `vp-qe-kata-conformance` と `vp-dev-change-impact` の観点で判断した。直したのは R5-1 から R5-4 の 4 か所で、相手側に当たる R5-5 と R5-6 は変更せず、直す案を申し送った。維持した記述もある。用語集には本 sample の業務の語（つけ、ベースライン、店主代表など）が載っておらず、食い違いはなかった。共通サンプル文脈（役割名を使い、人物名を書かない。駄菓子屋の題材）にも合っている。`based_on` と wikilink の参照先も一致していた。frontmatter の `status` は変更していない。検査は、executor が prettier と markdownlint を実行して通った。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通った。
