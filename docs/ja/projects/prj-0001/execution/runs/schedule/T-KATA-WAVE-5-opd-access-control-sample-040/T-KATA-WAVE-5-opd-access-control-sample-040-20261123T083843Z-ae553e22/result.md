---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-opd-access-control-sample-040-20261123t083843z-ae553e22
  type: exec-result
  task_id: T-KATA-WAVE-5-opd-access-control-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-opd-access-control-sample-040/T-KATA-WAVE-5-opd-access-control-sample-040-20261123T083843Z-ae553e22/plan.md
  started_at: "2026-11-23T08:38:54.704Z"
  completed_at: "2026-11-23T09:01:28.323Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:opd-access-control-sample
    - specdojo:opd-rulebook
---

# Edit Result

## 1. 実施内容

- opd-rulebook を `opd-&lt;term&gt;` 専用に絞って簡潔に再構成しました。
- `opd-index` の章立てと記述基準については `opd-index-rulebook` へ委譲し、本書の `sample` から `opd-index-sample` を除外しました。
- frontmatter の `recipe` と `template` について、理由を添えて `not-needed` とすることを確定させました。
- ファイル名の命名規則と配置基準を `opd-index-rulebook` に合わせて修正しました。
- 禁止事項の記述を、判定基準が明確になるような表現（「大量記載する」などの曖昧語の回避）へと改めました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/opd-rulebook.md`: rulebook を `opd-&lt;term&gt;` への特化という方針に基づき簡潔化しました。`opd-index` に関する記述を `opd-index-rulebook` への参照に置き換え、`sample` から `opd-index-sample` を削除しました。また、`recipe` と `template` を `not-needed` と定義し、禁止事項の判定基準を具体化しました。

## 3. 申し送り

- F009: OPR の sample 7 件（`opr-index-sample`・`opr-incident-sample`・`opr-access-control-sample`・`opr-backup-restore-sample`・`opr-batch-sample`・`opr-change-sample`・`opr-monitoring-sample`・`opr-support-sample` のうち `opr-sample` 以外）が frontmatter で `rulebook: specdojo:opd-rulebook` と宣言している。この段では sample を変更しない決まりのため直していない。sample の段で `opr-index-sample` は `specdojo:opr-index-rulebook` に、それ以外は `specdojo:opr-rulebook` に直す必要がある。
- F010: `specdojo:opd-sample` は rulebook の `sample` に載っていないが、まだ `rulebook: specdojo:opd-rulebook` と宣言している。中身も旧形式の最小サンプル（目的と適用範囲・入力情報など）で、本書の章立てに沿っていない。sample の段で廃止（削除または deprecated）するかを判断する必要がある。
- F008: rulebook の `sample` から `opd-index-sample` を外したので、この指摘の前提はなくなった。なお現在の `opd-index-sample` は 12 章をそろえており、`opd-index-rulebook` の sample として成り立っている。
- 直さなかった箇所と理由: frontmatter 規約にある `based_on` の方針（OPR を載せない）は grade の指摘がなく、`opd-index-rulebook` とも重ならないので残した。RACI と承認者の記述は文書の中身として役割を扱う運用統制で、PJR-76N9 の対象外なので残した。
- 適用外の検証: `npm run validate:history-links`（変更したのは rulebook だけで、plan・result・個票は変更していない）

## 4. 進め方と実践の型の適用

ターゲットとなる `opd-rulebook` を読み込み、`opd-index` との責務境界を明確にしました。`opd-index` に関する詳細な構成や定義は `opd-index-rulebook` に委譲するよう記述を整理し、本書の役割を `opd-&lt;term&gt;` の記述に絞り込みました。これに伴い、`sample` から `opd-index-sample` を削除し、各 `finding` に基づく不整合（命名規則、配置、禁止事項の曖昧さ）を解消しました。
