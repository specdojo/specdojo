---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-project-pm-risk-register-sample-060-20261123t083617z-692a5a0f
  type: exec-result
  task_id: T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-060/T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-060-20261123T083617Z-692a5a0f/plan.md
  started_at: "2026-11-23T08:36:26.568Z"
  completed_at: "2026-11-23T16:49:47.348Z"
  agent: opus-executor
  execution: agent
  approach: template-maintenance
  targets:
    - specdojo:pm-risk-register-sample
    - specdojo:pm-risk-register-template
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/templates/pm-risk-register-template.md` は変更せず、ファイル変更は 0 件で完了した。rulebook の「位置づけ」の章は、この template を `register build` が生成するビュー（`controls/generated/pm-risk-register.md`）の骨組みと定めている。executor は、`src/register/views.ts` が `&lt;!-- specdojo:view-slot=table --&gt;` を置換する仕組みと、同種の template（issue-log・decision-log）との整合も確認している。
- F001〜F013・F015・F017 は template を単独のリスク登録簿の雛形とみなした指摘だった。rulebook を正としてこれらは見送り、6 章の骨組みは足していない。
- F014（`frontmatter_template.rulebook` の指定）は見送った。rulebook は生成と検証の手順を `specdojo:pjr-rulebook` に従わせており、同種の template もすべて `pjr-rulebook` だからである。
- F016（status が `ready`）は人の判断事項として変更していない。
- runner 検証では `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`validate:schema` が passed だった。変更がないため、他の検証は適用外だった。

## 2. 変更ファイル

- なし

## 3. 申し送り

- 再評価で F001〜F013・F015・F017 が繰り返されないよう、grade の観点（`vp-qe-kata-conformance` など）が生成ビューの template を評価する方法か、rulebook の書き方の調整を人間が判断する必要がある。
- F014 は、同種の template 一式（`pm-issue-log`・`pm-decision-log`・`pm-change-request-log` など）の `rulebook` 指定を、まとめて変えるかを人間が判断する必要がある。変えると生成されるビューの Frontmatter も変わる。
- F016 は、`template-authoring-standard` が template 自身の `specdojo.status` を `draft` と定めている一方、同種の template がすべて `ready` である。同種の template 一式の status をどうするか、人間が判断する必要がある。
- F001〜F013・F015・F017 は、template を単独のリスク登録簿（6 章）の雛形とみなした指摘である。rulebook の「位置づけ」の章は、Frontmatter の `template` が `register build` の生成ビュー（`controls/generated/pm-risk-register.md`）の骨組みを指し、単独の登録簿には template がないと定めている。src/register/views.ts もこの template の `&lt;!-- specdojo:view-slot=table --&gt;` を置き換えて生成ビューを作る。このため rulebook を正として 6 章の骨組みは足していない。再評価で同じ指摘が繰り返されないよう、grade の観点（`vp-qe-kata-conformance` など）が生成ビューの template を評価する方法か、rulebook の書き方の調整を人間に判断してほしい。
- F014（`frontmatter_template.rulebook` を `specdojo:pm-risk-register-rulebook` にすべき）は見送った。rulebook は生成と検証の手順を `specdojo:pjr-rulebook` に従うと定め、同種の pm-issue-log・pm-decision-log・pm-change-request-log の template もすべて `pjr-rulebook` である。変えると生成されるビューの Frontmatter も変わるため、同種の template 一式でそろえて変えるかを人間が判断する。
- F016: template-authoring-standard は template 自身の `specdojo.status` を `draft` と定めているが、この template と同種の template はすべて `ready` である。status の変更は人間の判断のため変えていない。同種の template 一式の status をどうするか判断してほしい。
- 適用外の検証: `npx prettier --check docs/ja/specdojo/templates/pm-risk-register-template.md`（変更した `*.md` ファイルがなく、Prettier の適用条件を満たさない）
- 適用外の検証: `npm run validate:history-links`（plan・result・個票などの履歴蓄積ファイルを executor が変更していない）

## 4. 進め方と実践の型の適用

根拠にした規範は、rulebook の「位置づけ」の章、`src/register/views.ts` の view-slot 置換、同種の template である。構造・必須項目は rulebook を正とする、という plan の方針に従い、この template を生成ビューの骨組みとして維持した。F001〜F013・F015・F017 はこれと矛盾するため見送った。F014 は同種の template との統一を優先して見送った。F016 は人の判断に回した。いずれも根拠不足ではなく規範間の判断のため、理由と次のアクションを handoff に残した。
