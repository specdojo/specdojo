---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-sysd-index-040-20261118t061826z-3764eb58
  type: exec-result
  task_id: T-KATA-SLIM-2-sysd-index-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-sysd-index-040/T-KATA-SLIM-2-sysd-index-040-20261118T061826Z-3764eb58/plan.md
  started_at: "2026-11-18T06:18:33.291Z"
  completed_at: "2026-11-18T06:49:19.569Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - sysd-index
    - specdojo:sysd-index-rulebook
---

# Edit Result

## 1. 実施内容

- `sysd-index-rulebook` から、公開の判断・承認など共通の運用に当たる記述と、全体方針・禁止事項との重複を外した。空白を除いた文字数は 3669 字から 2931 字（79.9%）になり、目安の 8 割以下を満たした。
- 全体方針の「共通の運用」の項目は維持した。この型固有の判断基準、良い例と悪い例、禁止事項も残した。
- 成果物本体、recipe、template、sample は変更していない。
- 検証は、executor の prettier が成功した。runner の `lint:fm`・`lint:md`・`lint:mermaid`・`lint:d2`・`validate:schema`・`test:unit`・`test:integration` も成功した。`lint:ts` と `typecheck` は変更種別により対象外である。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/sysd-index-rulebook.md`: 共通の運用に当たる公開の判断・承認の記述を外し、冒頭の要約と本文要件の箇条書きのうち全体方針・禁止事項と重なる部分をまとめた。条件付き必須の項目名を「留保と公開判断」から「留保事項」に、記述ガイドの見出しを「未決事項・公開前確認の書き方」から「留保事項の書き方」に変えた。記述ガイドでは本文要件を言い直すだけの判断基準と冗長な例を削った。必須・条件付きの区分は変えていない。差分は 39 行追加、64 行削除である。

## 3. 申し送り

- template の変更案として、`sysd-index-template` の「6.2. 公開・昇格前の確認条件」を削ることを提案する。この節には、ロール別の確認条件と PO 承認・ready 昇格が書かれており、運用の記述に当たる。
- template の変更案として、章名「未決事項・変更影響・公開前確認」を「未決事項と変更影響」へ改め、6.1 の未決事項の表から「担当ロール」の列を外すことを提案する。表は論点・影響・当面の扱い・解消条件に絞る。
- 成果物の変更案として、`sysd-index.md` の「6.2. 公開・status: ready 昇格前の確認条件」と、概要の PO 行にある ready 昇格の記述を整理するかどうかを判断してほしい。template を改めた後に判断することを勧める。この段では成果物を変更していない。
- result に記録: 空白を除いた文字数は改訂前 3669 字、改訂後 2931 字（79.9%）。
- result に記録: 本文要件の条件付き必須の項目名を「留保と公開判断」から「留保事項」に、記述ガイドの見出しを「未決事項・公開前確認の書き方」から「留保事項の書き方」に変えた。公開・昇格の承認はドキュメントメタ情報標準の扱いで、rulebook の対象外のため。必須・条件付きの区分は変えていない。
- result に記録: 冒頭の要約の後半（詳細は正本、索引は所在・責任を扱う）と、本文要件の箇条書き（非該当も残す・転載しない）は、全体方針と禁止事項に重なっていたためまとめた。記述ガイドでは本文要件を言い直すだけの判断基準と冗長な例を削った。この型固有の判断基準・良い例と悪い例・禁止事項は残した。
- template の変更案: sysd-index-template の「6.2. 公開・昇格前の確認条件」（ロール別の確認条件と PO 承認・ready 昇格）は運用の記述のため削る。章名「未決事項・変更影響・公開前確認」は「未決事項と変更影響」へ改める。6.1 の未決事項の表から「担当ロール」の列を外し、論点・影響・当面の扱い・解消条件に絞る。
- template の変更案: 「1. 概要」のロール表は役割の割り当て（適用先のメンバー定義の扱い）に当たるため、削るかどうかを template の段で判断する。
- 成果物の変更案: sysd-index.md の「6.2. 公開・status: ready 昇格前の確認条件」と、概要の PO 行にある ready 昇格の記述は共通の運用に当たる。template を改めた後に成果物側で整理するかどうかを判断する（この段では成果物を変えていない）。
- 適用外の検証: `npm run validate:history-links`（変更したのは rulebook だけで、plan・result・個票を変更していないため）
- rate limit後に sol-executor から opus-executor へ切り替え、2026-11-18T06:23:39.779Z に再開

## 4. 進め方と実践の型の適用

rulebook-maintenance の進め方に従い、sld の試行結果と同じ一覧に沿って、共通の運用に当たる記述を共通の正本への参照に置き換えた。grade や condense 由来の finding はなかった。章名と必須・条件付きの区分は原則維持した。変えたのは条件付き必須の項目名「留保事項」と記述ガイドの見出しだけで、理由は、公開・昇格の承認がドキュメントメタ情報標準の扱いで rulebook の対象外だからである。recipe・template・sample・成果物は変更せず、合わせて直すべき点は変更案として handoff に残した。
