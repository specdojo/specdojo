---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pr-sample-140-20261126t055712z-77ef5c62
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pr-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pr-sample-140/T-KATA-REVIEW-ALL-pr-sample-140-20261126T055712Z-77ef5c62/plan.md
  started_at: "2026-11-26T05:57:22.979Z"
  completed_at: "2026-11-26T06:03:26.834Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pr-sample
    - specdojo:pr-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として pr-sample の事実を schema・pr-rulebook・date コマンドの結果と突き合わせた。確かめた主張はすべて一致し、直すべき誤りはなかったため sample は変更していない。
- 確かめの表（主張、照合先、結果）: 個票 ID `PJR-KP21`、`PJR-KP22`、`PJR-KP23` は register-item-frontmatter.schema.yaml の形式 `^PJR-[0-9ABCDEFGHJKMNPQRSTVWXYZ]{4}$` に一致した。タスク ID `T-11` から `T-15` は sch-common.schema.yaml の Id の形式に一致した。担当 `PM`、`PO`、`BA`、`OPS` は Owner の形式に合い、pm-roles-sample.yaml の code として定義済みで一致した。個票の分類 risk、issue、question、decision は ItemType の列挙値に含まれ一致した。報告期間 2026-04-13（月）から 2026-04-19（日）は平日 5 日で「5 営業日」と一致した。次期 2026-04-20 から 2026-04-26 と期日 4/21（火）から 4/24（金）は範囲内で一致した。5 章の順・各表の列・影響度 3 段階の定義は pr-rulebook の本文要件と一致した。
- 補充点、16:00 の入力締切、欠品 9 回などの業務の値は正本のない共通サンプル文脈の仮定のため、確かめの対象外とした（食い違いなし）。
- F001（`vp-ba-stakeholder-clarity`）は kata のレビューに使わない観点であるため、R4 では扱っていない。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| F001 | R4 | docs/ja/specdojo/samples/pr-sample.md の 3 行目の導入文 | 報告者と報告先（定例レビューの参加者）が書かれておらず、誰が誰に向けた進捗報告か読み取れない。 | 導入文に報告者の Role code（例: `PM`）と報告先を足す案。R4 では直していない。 | `vp-ba-stakeholder-clarity`。kata-guide の「kata の観点の組」では kata の段のレビューに使わない観点で、業務の中身は R1 と R5 の `vp-qe-kata-conformance` で確かめる。 | 見送り（R5 か人の判断） |

## 2. 変更ファイル

- なし

## 3. 申し送り

- F001 は R5 か人の判断に委ねる。直す場合は、導入文に報告者の Role code（例: `PM`）と報告先（定例の参加者）を足す案になる。
- R4 の確かめの表（result の実施内容に載せる材料）: (1) 個票 ID `PJR-KP21`/`PJR-KP22`/`PJR-KP23` は register-item-frontmatter.schema.yaml の形式 `^PJR-[0-9ABCDEFGHJKMNPQRSTVWXYZ]{4}$` に一致。(2) タスク ID `T-11`〜`T-15` は sch-common.schema.yaml の Id の形式 `^[A-Za-z0-9][A-Za-z0-9_-]{1,127}$` に一致。(3) 担当 `PM`/`PO`/`BA`/`OPS` は Owner の形式 `^[A-Z]{2,4}$` に合い、pm-roles-sample.yaml の code として定義済みで一致。(4) 個票の分類 risk/issue/question/decision は ItemType の列挙値に含まれ一致。(5) 報告期間 2026-04-13(月)〜2026-04-19(日) は平日が 5 日で「5 営業日」と一致（date で確認）。(6) 次期は 2026-04-20〜2026-04-26(日)、期日 4/21(火)〜4/24(金) はすべて範囲内で一致。(7) 5 章の順・各表の列・影響度 3 段階の定義は pr-rulebook の本文要件と記述ガイドに一致。(8) 補充点・16:00 の入力締切・欠品 9 回などの業務の値は正本のない共通サンプル文脈の仮定のため確かめの対象外（確かめられない・食い違いなし）。
- F001（`vp-ba-stakeholder-clarity`、line=3、導入文に報告者・報告先を書く指摘）は、kata-guide の「kata の観点の組」で kata の段のレビューに使わない観点とされている。業務の中身は R1 と R5 の `vp-qe-kata-conformance` で確かめるため、R4 では直していない。直すかどうかは R5 か人の判断に委ねる。直す場合は、導入文に報告者の Role code（例: `PM`）と報告先（定例の参加者）を足す案になる。
- 適用外の検証: `npm run validate:history-links`（executor は plan・result・個票を変更しておらず、適用条件を満たさない）

## 4. 進め方と実践の型の適用

sample-maintenance。kata-guide の R4 の観点に従い、sample の事実主張を schema、rulebook、date コマンドの実行結果と照合した。一致した記述はすべて維持し、誤りがないため差分は入れていない。F001 は R4 の観点に当たらないため見送り、理由と次のアクションを申し送りに記録した。
