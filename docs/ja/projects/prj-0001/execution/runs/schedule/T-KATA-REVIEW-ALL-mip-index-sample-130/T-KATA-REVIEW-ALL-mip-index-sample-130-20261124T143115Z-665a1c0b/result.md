---
specdojo:
  id: prj-0001:xer-t-kata-review-all-mip-index-sample-130-20261124t143115z-665a1c0b
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-mip-index-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-mip-index-sample-130/T-KATA-REVIEW-ALL-mip-index-sample-130-20261124T143115Z-665a1c0b/plan.md
  started_at: "2026-11-24T14:31:24.677Z"
  completed_at: "2026-11-24T14:43:58.901Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:mip-index-sample
    - specdojo:mip-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの R3（読みやすさ）を `mip-index-sample` に対して実施した。W1〜W10 に照らして文と表の導入を直し、必須 9 章、表の列、停止時間、許容差、判定者、例外、切戻し方針、支援期間といった判断に要る条件は維持した。
- 指摘は 10 件で、「要判断」の印を付けたものはない。下表に 1 回だけ示す。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R3-1 | R3 | 1. 移行の背景/目的 | 背景と目的が同じ段落にあり、目的文が移行手段・到達状態・計画の役割をまとめている | 背景を別段落にし、移行手段・目的・計画の役割を文に分けた | W3、`vp-ux-readability` | - | | R3-2 | R3 | 2. 前提・制約 | 臨時休業・取り込み・開店・本番利用が一文に連なっている | 午前の作業と正午の本番利用を別文にし、「この午前」を「切替日の午前」にした | W3、W4 | - | | R3-3 | R3 | 2. 前提・制約 | 転記用の表の保管と端末の保護が一つの箇条書きに混在している | 紙の管理と画面ロックを別項目にした。保管場所・持出禁止・廃棄時点・暗証番号の共有範囲は維持した | `vp-ux-readability`、SpecDojo の考え方 3.6 の一項目一論点 | - | | R3-4 | R3 | 3・4・5.1・6・7・8.1・9 | 表が示す対応や受入判定の説明が不足している | 各表の直前に、比較する項目や確認する基準を示す一文を補った | `vp-ux-readability`、Sample 記述標準 第 6 章の表の前の一文 | - | | R3-5 | R3 | 4・5.2・9 | I/F・GO/NO-GO・SLA の意味が初見で読み取れない | インターフェース、本番利用と正本切替の可否、サービスレベル合意を添えた。ハイパーケアも集中支援と説明した | W8 | - | | R3-6 | R3 | 5.1. 項目ごとの受入基準 | 業務停止時間の証跡が長い修飾になっている | 「移行作業の記録表（正午に販売を受け付けたかの記録）」にした | W5 | - | | R3-7 | R3 | 5.1. 項目ごとの受入基準 | 「顧客を直す」「商品を直す」では修正対象が読み取りにくい | 顧客の残高と商品の在庫数を直す表現にした | `vp-ux-readability` | - | | R3-8 | R3 | 5.2. GO/NO-GO の最低条件 | 「正本切替は、差異が残っていない」は主題と述語が対応していない | 「正本切替の条件は、…差異が残っていないことである」にした。期限と差異の条件は維持した | W2 | - | | R3-9 | R3 | 7. 移行リスクと対策 | 「並行記録の二重記録」が重複した表現になっている | 「ノートとシステムへの二重記録」にした | `vp-arc-conciseness` | - | | R3-10 | R3 | 7. 移行リスクと対策 | 影響欄の「記録漏れと、差異の理由が残らない」で名詞と文が不揃いに接続されている | 「店番中に記録が漏れ、差異の理由も残らない」にした | W2 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/mip-index-sample.md`: R3（読みやすさ）の指摘 10 件を反映した。背景と目的の段落分離、長い一文の分割、箇条書きの一項目一論点化、各表の直前への説明文の追加、略語（インターフェース・GO/NO-GO・SLA・ハイパーケア）への説明の補足、主題と述語の対応、重複表現の整理を行った。必須 9 章、表の列、業務条件、R1・R2 の修正は維持した。status は変更していない。

## 3. 申し送り

- runner 実施の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` は passed だった。その他の runner 検査は変更種別により `not_applicable` だった。
- executor は result、grade サイドカー、保護された設定を編集していない。executor の報告では、rulebook と矛盾する変更、根拠不足による見送り、要判断の指摘はない。
- R3-1: R3 / 1. 移行の背景/目的 / 背景と目的が同じ段落にあり、目的文が移行手段・到達状態・計画の役割をまとめている / 背景を別段落にし、移行手段・目的・計画の役割を文に分けた / W3、vp-ux-readability / -
- R3-2: R3 / 2. 前提・制約 / 臨時休業・取り込み・開店・本番利用が一文に連なっている / 午前の作業と正午の本番利用を別文にし、「この午前」を「切替日の午前」にした / W3、W4 / -
- R3-3: R3 / 2. 前提・制約 / 転記用の表の保管と端末の保護が一つの箇条書きに混在している / 紙の管理と画面ロックを別項目にした。保管場所・持出禁止・廃棄時点・暗証番号の共有範囲は維持した / vp-ux-readability。SpecDojo の考え方 3.6 の一項目一論点 / -
- R3-4: R3 / 3・4・5.1・6・7・8.1・9 / 表が示す対応や受入判定の説明が不足している / 各表の直前に、比較する項目や確認する基準を示す一文を補った / vp-ux-readability。Sample 記述標準 第 6 章の表の前の一文 / -
- R3-5: R3 / 4・5.2・9 / I/F・GO/NO-GO・SLA の意味が初見で読み取れない / インターフェース、本番利用と正本切替の可否、サービスレベル合意を添えた。ハイパーケアも集中支援と説明した / W8 / -
- R3-6: R3 / 5.1. 項目ごとの受入基準 / 業務停止時間の証跡が「記録表に書いた、正午に販売を受け付けたかの記録」という長い修飾になっている / 「移行作業の記録表（正午に販売を受け付けたかの記録）」にした / W5 / -
- R3-7: R3 / 5.1. 項目ごとの受入基準 / 「顧客を直す」「商品を直す」では修正対象が読み取りにくい / 顧客の残高と商品の在庫数を直す表現にした / vp-ux-readability / -
- R3-8: R3 / 5.2. GO/NO-GO の最低条件 / 「正本切替は、差異が残っていない」は主題と述語が対応していない / 「正本切替の条件は、…差異が残っていないことである」にした。期限と差異の条件は維持した / W2 / -
- R3-9: R3 / 7. 移行リスクと対策 / 「並行記録の二重記録」が重複した表現になっている / 「ノートとシステムへの二重記録」にした / vp-arc-conciseness / -
- R3-10: R3 / 7. 移行リスクと対策 / 影響欄の「記録漏れと、差異の理由が残らない」で名詞と文が不揃いに接続されている / 「店番中に記録が漏れ、差異の理由も残らない」にした / W2 / -
- reporter 向け（判断根拠）: 共通規約 2 文書、[[specdojo:kata-guide|実践の型活用ガイド]] 第 6 章、[[specdojo:sample-authoring-standard|Sample 記述標準]]、[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]] の用語統一規定、[[specdojo:specdojo-philosophy|SpecDojo の考え方]] 3.6、[[specdojo:mip-index-rulebook|移行計画 作成ルール]]、共通レビュー観点の R3 対象を確認した。先行 R1・R2 の result と sample の既存 grade（指摘なし）も確認した。rulebook の `recipe` と `template` は `undecided` で参照先の宣言がない。用語集では今回説明を補った略語に対応する定義は見つからなかった。
- reporter 向け（変更・維持・確認）: 変更ファイルは docs/ja/specdojo/samples/mip-index-sample.md のみ。W1〜W10 に照らして確認し、必須 9 章、表の列、R1・R2 の修正、停止時間、許容差、判定者、例外、切戻し方針、支援期間を維持した。rulebook と矛盾する変更、根拠不足による見送り、要判断の指摘はない。上記 10 件を result の実施内容に Markdown 表として 1 回だけ記載し、申し送りに表を重ねない。result・grade サイドカー・保護された設定は未編集。親 runner 指定の検査は重複実行していない。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown のみで、YAML ファイルを変更していない。）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/samples/ 配下のみで、docs/ja/projects/ 配下の成果物を変更していない。）
- 適用外の検証: `npm run validate:history-links`（executor は履歴ファイル、plan、result を変更していない。）

## 4. 進め方と実践の型の適用

根拠にしたのは共通規約 2 文書、kata-guide 第 6 章（W1〜W10）、sample-authoring-standard、rulebook-authoring-standard の用語統一規定、SpecDojo の考え方 3.6、`mip-index-rulebook`、共通レビュー観点の R3 対象である。先行の R1・R2 の result と、sample の既存 grade（指摘なし）も確認し、前段の指摘は繰り返していない。rulebook の `recipe` と `template` は `undecided` で、参照先の宣言がない。用語集には今回説明を補った略語に対応する定義がなかった。plan に展開された grade の finding と condense の finding はなく、根拠不足による見送りもない。構造・必須項目・禁止事項は rulebook を正とし、矛盾する変更はしていない。
