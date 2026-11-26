---
specdojo:
  id: prj-0001:xer-t-kata-review-all-sysd-index-sample-130-20261126t031233z-ddec535f
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-sysd-index-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-sysd-index-sample-130/T-KATA-REVIEW-ALL-sysd-index-sample-130-20261126T031233Z-ddec535f/plan.md
  started_at: "2026-11-26T03:12:44.442Z"
  completed_at: "2026-11-26T03:19:21.273Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:sysd-index-sample
    - specdojo:sysd-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として `docs/ja/specdojo/samples/sysd-index-sample.md` を見直し、文の直しを 4 件入れた。意味・制約・例外は変えていない。
- executor は `npx prettier --check` を通過した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通過した。
- 変更は sample 1 ファイルだけで、`validate:history-links` と、src・tests に関わる検査は非適用だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R3 | 冒頭の段落 | 主語がなく、3 人の担当と目的を 1 文に詰めた長い文で、何がそうするのかが一つに決まらない。 | 「本索引は、設計の正本（SSOT: Single Source of Truth）への入口を集約する。開発担当は…、同行レビュー担当は…、店舗運営アドバイザーは…を、本索引から探す。」の 2 文に分けた（反映済み）。 | W1、W3、`vp-ux-readability` | - |
| 2 | R3 | 概要（対象範囲・更新責任）の 1 段落め「店舗端末1台で人が操作する」 | 操作する主体が「人」で、ほかの箇所の役割名と合わない。 | 「店舗端末1台で店番担当が操作する」にした（反映済み）。 | W1、`vp-ux-language-consistency` | - |
| 3 | R3 | 概要（対象範囲・更新責任）の略語の文 | 5 つの略語と正式名・意味を読点でつないだ長い 1 文で、読みにくい。 | 「本索引で使う略語は次のとおり。」の後に、略語ごとの箇条書きを置いた。役割略語の文は別の段落に残した（反映済み）。 | W9、W3、`vp-ux-readability` | - |
| 4 | R3 | 公開・昇格前の確認条件の 1 項目め | 「架空参照を実在の正本へ置き換え、…が一致している」で主語と述語がねじれ、何と一致するかも書かれていない。 | 「架空参照が実在の正本へ置き換わり、API・保存・設定・監視の所在と生成・検証コマンドが本索引の記載と一致している。」にした（反映済み）。 | W2、W4 | 要判断（一致の相手を「本索引の記載」と読んだため、書き手の意図と合うかを確かめてほしい） |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sysd-index-sample.md`: 冒頭段落を 2 文に分け、操作主体を「人」から「店番担当」へ改めた。略語の長い 1 文を箇条書きにし、公開・昇格前の確認条件 1 項目めの主語と述語のねじれを直した。

## 3. 申し送り

- 指摘 No 4 は、「一致」の相手を「本索引の記載」と読んで直した。書き手の意図と合うかを確かめてほしい。
- No: 1 / 段: R3 / 箇所: 冒頭の段落 / 指摘: 主語がなく、3 人の担当と目的を 1 文に詰めた長い文で、何がそうするのかが一つに決まらない / 直した案: 「本索引は、設計の正本（SSOT: Single Source of Truth）への入口を集約する。開発担当は…、同行レビュー担当は…、店舗運営アドバイザーは…を、本索引から探す。」の 2 文に分けた（反映済み） / 根拠: W1、W3、`vp-ux-readability` / 印: なし
- No: 2 / 段: R3 / 箇所: 概要（対象範囲・更新責任）の 1 段落め「店舗端末1台で人が操作する」 / 指摘: 操作する主体が「人」で、ほかの箇所の役割名と合わない / 直した案: 「店舗端末1台で店番担当が操作する」にした（反映済み） / 根拠: W1、`vp-ux-language-consistency` / 印: なし
- No: 3 / 段: R3 / 箇所: 概要（対象範囲・更新責任）の略語の文 / 指摘: 5 つの略語と正式名・意味を読点でつないだ長い 1 文で、読みにくい / 直した案: 「本索引で使う略語は次のとおり。」の後に、略語ごとの箇条書きを置いた。役割略語の文は別の段落に残した（反映済み） / 根拠: W9、W3、`vp-ux-readability` / 印: なし
- No: 4 / 段: R3 / 箇所: 公開・昇格前の確認条件の 1 項目め / 指摘: 「架空参照を実在の正本へ置き換え、…が一致している」で主語と述語がねじれ、何と一致するかも書かれていない / 直した案: 「架空参照が実在の正本へ置き換わり、API・保存・設定・監視の所在と生成・検証コマンドが本索引の記載と一致している。」にした（反映済み） / 根拠: W2、W4 / 印: 要判断（一致の相手を「本索引の記載」と読んだため、書き手の意図と合うかを確かめてほしい）
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ の sample だけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に従い、plan に展開された grade の finding と Kata 起因の finding はなかった。このため R3 の観点（W1〜W10 と読みやすさ）に当たる文の直しだけを sample に入れた。判断に要る背景・例外・制約は維持し、規範の矛盾も見つからなかった。
