---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-itc-index-sample-050-20261121t131124z-51e8ee3d
  type: exec-result
  task_id: T-KATA-WAVE-3-itc-index-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-itc-index-sample-050/T-KATA-WAVE-3-itc-index-sample-050-20261121T131124Z-51e8ee3d/plan.md
  started_at: "2026-11-21T13:11:39.948Z"
  completed_at: "2026-11-21T13:22:16.630Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:itc-index-sample
    - specdojo:itc-index-sample
---

# Edit Result

## 1. 実施内容

- itc-index-sample を `itc-index-rulebook.md` の規定する 10 章構成に基づき、駄菓子屋きぬやの具体的な実装値を用いて厚く書き換えました。
- H1 見出しの形式および `based_on` ( `tsp-index` を含む) の frontmatter 定義を是正しました。
- F001 から F024 までの指摘事項に基づき、スコープの境界、技術的制約、環境実行ポリシー、および合格基準の具体例（API 応答や DB 差分の観測点）を追記しました。
- Prettier による整形および `docs:build` によるビルド検証を完了しています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/itc-index-sample.md`: `itc-index-rulebook.md` の構成に従い、駄菓子屋きぬやの販売管理システムにおけるテスト範囲、技術的制約、具体的な合格基準（API 応答値の例を含む）、および未解決事項等の具体的な設定値を用いて `sample` を拡充しました。

## 3. 申し送り

- rulebook の変更案: `itc-index-rulebook.md` の frontmatter では `recipe` と `template` が `undecided` のままです。これらが確定次第、宣言を更新する必要があります。
- F015（検証コマンド）について: `rulebook` が文書の lint を業務の検証から外しているため、`sample` にはレビュー確認と自動検査の TODO までを記載しました。`lint` コマンドを含めるべきかは再評価での判断が必要です。
- F024（変更管理）について: `rulebook` が改訂手順をドキュメントメタ情報標準に任せているため、環境方針と依存の扱いの改訂は ARC が承認する、という範囲で記述しました。
- `docs/ja/specdojo/samples/itc-sample.md` は旧来の薄い最小例のままです。別タスクでの拡充を推奨します。
- `sample` 内の `kinuya-it-compose`、`kinuya-record-schema` および各 `itc-&lt;term&gt;` は、未同梱の架空の参照名です。
- rulebook の変更案: itc-index-rulebook の frontmatter では recipe と template が undecided のまま。決まったら宣言を更新する。
- F015（検証コマンド）は、rulebook が文書の lint を業務の検証から外しているため、sample にはレビュー確認と自動検査の TODO まで書いた。lint コマンドを含めるべきかは再評価で判断する。
- F024（変更管理）は、rulebook が改訂の手順をドキュメントメタ情報標準に任せているため、環境方針と依存の扱いの改訂は ARC が承認する、という範囲で書いた。
- 同じ系列の docs/ja/specdojo/samples/itc-sample.md は旧来の薄い最小例のまま。別タスクで厚くする候補。
- sample 内の kinuya-it-compose・kinuya-record-schema と各 itc-&lt;term&gt; は未同梱の架空の参照名。

## 4. 進め方と実践の型の適用

`itc-index-rulebook.md` の要求事項に従い、既存の `sample` を `itc-index` の完成例として厚くすることを目指しました。`grade` から示された F001〜F024 の指摘事項をすべて解消し、具体的なビジネス文脈（駄菓子屋きぬや）に沿った設定値や合格基準を記述することで、実用的なリファレンスとしての品質を確保しました。
