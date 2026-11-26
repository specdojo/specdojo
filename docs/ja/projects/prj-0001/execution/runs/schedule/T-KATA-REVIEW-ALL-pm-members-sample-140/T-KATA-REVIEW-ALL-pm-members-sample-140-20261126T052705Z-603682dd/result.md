---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-members-sample-140-20261126t052705z-603682dd
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-members-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-members-sample-140/T-KATA-REVIEW-ALL-pm-members-sample-140-20261126T052705Z-603682dd/plan.md
  started_at: "2026-11-26T05:27:15.229Z"
  completed_at: "2026-11-26T05:35:36.493Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:pm-members-sample
    - specdojo:pm-members-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、`docs/ja/specdojo/samples/pm-members-sample.yaml` に書かれた事実 12 件を、schema、rulebook、関連 sample、共通登場人物と突き合わせた。12 件はすべて一致した。そのため sample は変更していない（`changes` は空）。
- `npm run validate:schema:file` で schema 適合を確認し、出力は valid だった。runner 側の `npm run validate:schema` も passed だった。
- F001（`display_name`「同行レビュー担当」）は R4 の観点に当たらないため直していない。この表示名は共通登場人物の役割名どおりで、sample は正本と一致している。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| F001 | R4 正しさ | docs/ja/specdojo/samples/pm-members-sample.yaml 38 行目 `display_name` | `display_name`「同行レビュー担当」が nickname `peer-reviewer` と note の「第三者視点で確認」に合わず、レビューの独立性が伝わらない（grade の finding, `vp-ux-language-consistency`）。 | 直していない。共通登場人物の表を人が改訂したあと、sample の `display_name` と `rules` の 2 行目をそろえる。 | `sample-authoring-standard.md` の共通登場人物で、`peer-reviewer` の役割名が「同行レビュー担当」と決まっている。sample は正本どおり。R4 の観点ではない。 | 見送り |

## 2. 変更ファイル

- なし

## 3. 申し送り

- F001 を解消するには、先に人が共通登場人物の表（`sample-authoring-standard.md`）を改訂する必要がある。その後で sample の `display_name` と `rules` の 2 行目をそろえる。
- 確かめの表（No、主張、正本、確かめ方、結果、根拠）: 1 sample 全体の schema 適合、schema、validate:schema:file の実行、一致、出力は valid / 2 type・status・version の値、schema、読み取り、一致、const project・status の列挙・version は 1 以上 / 3 rulebook ID、pm-members-rulebook.md、grep、一致、3 行目の id と一致 / 4 `based_on` の 3 件、各標準と sample、grep、一致、3 件とも存在 / 5 `project_id` prj-0001、pm-roles-sample.yaml、読み取り、一致、11 行目と一致 / 6 roles の 8 件の code、pm-roles-sample.yaml、grep、一致、8 件とも定義済み / 7 `scheduler_strategy` の値、schema の列挙値、読み取り、一致 / 8 nickname と表示名の 5 人、sample-authoring-standard.md の共通登場人物、読み取り、一致 / 9 未成年は開発担当と同行レビュー担当、共通登場人物の年齢、読み取り、一致、12 歳と 12 歳、家族利用者代表は 24 歳 / 10 ARC と UX は owner にしない、pm-organization-sample.md、読み取り、一致、47 行目 / 11 家族利用者は承認責任を持たない、pm-organization-sample.md、読み取り、一致、16 行目 / 12 rules の交代時の扱い、rulebook の禁止事項、読み取り、一致。稼働条件（週 1 回、月 2 回、30 分以内）は正本のない業務上の仮定で、共通サンプル文脈と食い違わないので確かめの対象外。
- F001（vp-ux-language-consistency、38 行目の `display_name`「同行レビュー担当」）は直していない。R4 の観点ではなく、sample-authoring-standard.md の共通登場人物で peer-reviewer の役割名が「同行レビュー担当」（役割の説明は「第三者視点で確認」）と決まっており、sample は正本どおりのため。変えるなら、先に共通登場人物の表を人が改訂し、そのあと sample の `display_name` と rules の 2 行目をそろえる。

## 4. 進め方と実践の型の適用

参照の向きを成果物から sample に切り替え、sample の事実（type・status・version、rulebook ID、`based_on`、`project_id`、roles の code、`scheduler_strategy` の値、共通登場人物の nickname と表示名・年齢、owner にしない役割、承認責任、`rules` の交代時の扱い）を正本と照合した。稼働条件（週 1 回、月 2 回、30 分以内）は正本のない業務上の仮定で、共通サンプル文脈と食い違わないため、確かめの対象にしていない。F001 は、共通登場人物で `peer-reviewer` の役割名が「同行レビュー担当」と定められているため、正本を正として維持した。
