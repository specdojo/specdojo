---
specdojo:
  id: prj-0002:pjr-0wfv-lp-why-register
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: waiting
  priority: low
  owner: BA
  registered_at: "2026-10-17T14:40:01Z"
  due_on: null
  block_reason: "agent exited with non-zero code: parent validation failed: lint-md, test-unit"
---

# PJR-0WFV LP で plan モードと比べた register の価値を伝える

## 1. 概要

AI のコーディングツールの plan モードの plan（会話の中の下書き、ランダムな名前、既定で約 30 日で消える）と比べ、SpecDojo の register が ID・種類・状態の遷移・実行の plan と result への接続・decision の承認の記録を持ち、判断と作業を台帳として残せることを、LP の説明の材料にする。prj-0001 の PJR-YFBW（運用ガイドの使い分け）と内容を揃える

## 2. 完了条件

- `specdojo-lp` の「register の考え方」の節（`src/components/sections/RegisterTypes.astro`）に、plan モードの plan との違いを示す対比を加える。
- 対比の観点は、識別（`PJR-XXXX` の ID）・種類・状態の遷移・実行の plan や result とのつながり・決定の記録（決めた人・決めた日・承認の方式）・残り方（リポジトリの履歴として残る）とする。表現は prj-0001 の PJR-YFBW で書いた [[specdojo:orchestrator-operation-guide]] の「plan モードと register の使い分け」とそろえる。
- plan モードを否定せず、「plan は段取りの下書き、register は判断と作業を残す台帳」として補い合う関係で書く。冒頭の一文は、下の申し送りの「打ち出しの軸の案」を短くしたものにする。
- plan モードの plan の保存期間は「約 30 日」などと数字で断定せず、「既定では一定期間で消えうる」と書く。ツールや設定で変わるためである。
- 「道具の使い分け」の節（`src/components/sections/ToolFit.astro`）の plan mode の行は、新しい対比と言い回しがそろっているかを確かめる。そろっていない場合だけ直す。
- 申し送りの「弱い点」と競合との比較は、この項目では LP に載せない。
- 変えるのは `specdojo-lp` の `RegisterTypes.astro` と、必要な場合の `ToolFit.astro` だけとする。
- 作業を終える前に、`specdojo-lp` で `npm run typecheck`・`npm run lint:ts`・`npm run format:check`・`npm run build` を実行して通す。
- 親の検証が通る。

### 2.1. prj-0001 からの申し送り：競合との比較（2026-10-17）

prj-0001 の orchestrator が、2026 年 10 月時点で公開されている情報（比較記事の多くは提供元か競合が書いたもので、偏りがありうる。実際に使って確かめたものではない）で比べた結果。LP の説明の材料にする。

比べた相手:

| 系統                    | 主な道具                                                                  | 中心になるもの                                                  |
| ----------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------- |
| 仕様駆動の開発          | GitHub Spec Kit、Kiro、OpenSpec、BMAD-METHOD、Tessl                       | 機能ごとの仕様・設計・タスクの Markdown                         |
| AI のタスク管理         | Task Master                                                               | PRD から作る `tasks.json`（pending・done・deferred と依存関係） |
| 課題管理と agent の連携 | Linear・GitHub Issues から Copilot・Codex・Cursor・Devin などへ割り当てる | 課題から draft の PR                                            |

SpecDojo の register が優位な点:

- decision・question・risk・change-request・note を、todo・issue と同じ台帳で、種類ごとの終わり方を決めて扱う。
- decision に、選択肢・採択の理由・決定者・決定日・承認方式が残る。
- 状態の遷移のイベント（誰が・いつ・なぜ）がリポジトリの中に残り、Git で辿れる。
- 完了条件から、実行の plan・result・evidence・統合の commit・close の理由までがつながる。
- worktree での隔離、統合前の検証、保護された設定の検知、review の判定を runner が行う。
- 複数の AI ツール（claude・codex・agy・opencode など）を役割ごとに選べる。
- 定期の grade で、成果物と kata の品質を評価し続ける。

弱い点（LP で補うもの）:

- 種類・状態・規則が多く、始めるまでに覚えることが多い。`init` で 10 分で始められることを示して補う。
- Linear のような画面・通知・共同編集はない。
- 利用者・事例・連携は、Spec Kit・Kiro・Linear に比べて少ない。文書は日本語が中心。
- 小さな修正を 1 つ頼むだけなら、課題を割り当てるだけの連携や plan モードの方が早い。

打ち出しの軸の案: 1 件を早く仕上げる道具ではなく、プロジェクトの判断と作業を長い期間にわたって検証できる形で残し、複数の agent に安全に実行させる台帳。

## 3. 作業内容

| No  | 作業                                                      | 担当 | 状態 | メモ                      |
| --- | --------------------------------------------------------- | ---- | ---- | ------------------------- |
| 1   | 「register の考え方」に plan モードとの対比を加える       | BA   | open | PJR-YFBW と表現をそろえる |
| 2   | 「道具の使い分け」の plan mode の行との言い回しを確かめる | BA   | open | 必要な場合だけ直す        |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-yfbw-guide-plan-mode-vs-register]]: 運用ガイドに同じ内容を書いた項目。
- [[specdojo:orchestrator-operation-guide]]: 表現をそろえる先のガイド。
