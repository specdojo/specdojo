---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-orchestrator-playbook-sample-140-20261126t053140z-4aea81ca
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-orchestrator-playbook-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-orchestrator-playbook-sample-140/T-KATA-REVIEW-ALL-pm-orchestrator-playbook-sample-140-20261126T053140Z-4aea81ca/plan.md
  started_at: "2026-11-26T05:31:50.311Z"
  completed_at: "2026-11-26T05:40:04.838Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pm-orchestrator-playbook-sample
    - specdojo:pm-orchestrator-playbook-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、sample のコマンド、オプション、キー、列挙値、パスを `exec run --help`、`exec queue --help`、schema、`src/` と突き合わせた。誤りは 2 件あり、保護された設定の範囲と正本の記述、およびリリース手順 3 の検査の特定だった。どちらも sample で直した。
- 確かめた主張は次のとおり。`exec run` のオプション一式、`exec queue` の add / run / status / cancel、`--resume --resume-from executor`、`--force-restart`、`--resume-note`、`.specdojo/exec-defaults.yaml` の `routing`（hard / medium / easy）、`requires_human`、`question` はいずれも正本と一致した。
- `PJR-KN*`、`kinuya-*`、agent の呼び名、営業時間は共通サンプル文脈の仮定なので、確かめの対象にしていない。
- grade の finding のうち F005 は R4 の観点（`vp-qe-verifiability`）に当たるため扱った。F001、F002、F004、F008、F009 は R4 の観点の外なので扱っていない。F003、F006、F007 は executor の報告では前の段で反映済みである。
- 検証は、executor の prettier、runner の `npm run lint:md:changed`、`npm run lint:fm:changed`、`npm run lint:mermaid`、`npm run lint:d2`、`npm run test:docs`、`npm run validate:schema` が通った。ほかは変更の種類により非適用である。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R4 | `docs/ja/specdojo/samples/pm-orchestrator-playbook-sample.md` の保護された設定の扱い | 書けない範囲を `.agents/` 全体、正本を `.specdojo/` の設定としていたが、`src/exec/agent-protected-config.ts` では `.agents/rules/` と `.agents/skills/` だけが保護されていた。範囲は provider の設定から変えられない CLI の固定の定義である。 | 範囲を `.agents/rules/` と `.agents/skills/` に、正本を CLI の固定の定義に訂正した。 | `vp-arc-technical-constraints`、`src/exec/agent-protected-config.ts` | 直した |
| 2 | R4 | `docs/ja/specdojo/samples/pm-orchestrator-playbook-sample.md` のリリースの手順 3 | 「全件の検査」ではどの検査を流すか特定されず、合否を判定できなかった（F005）。 | 開発用の PC で `npm test` を流し、終了コードが 0 なら配布物を作る形に直した。 | `vp-qe-verifiability` | 直した |
| 3 | R4 | rulebook の章ごとの書き方（保護の範囲の列挙） | rulebook は保護の範囲を設定の正本を参照して列挙するとしているが、実装の正本は CLI の固定の定義であり、食い違っている。 | - | `src/exec/agent-protected-config.ts`、`vp-arc-technical-constraints` | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-orchestrator-playbook-sample.md`: 保護された設定の範囲を `.agents/` 全体から `.agents/rules/` と `.agents/skills/` に訂正し、正本を `.specdojo/` の設定ではなく CLI の固定の定義に直した。リリース手順 3 の「全件の検査」を、開発用の PC で `npm test` を流し終了コード 0 なら配布物を作る形に具体化した（F005）。差分は 2 行の挿入と 2 行の削除。

## 3. 申し送り

- `.agents/rules/` と `.agents/skills/` だけが保護される点は、`src/exec/agent-protected-config.ts` に基づく訂正である。
- F008（`based_on` が `pm-plan-sample` を指す点）は未反映である。executor の報告では R5 で照らし直す。
- rulebook の章ごとの書き方は、保護の範囲を設定の正本を参照して列挙するとしている。実装の正本は CLI の固定の定義である。rulebook の文言を直すかどうかは人が判断する。この段では rulebook を編集していない。
- 確かめの表: (1) 列の組み方の例のオプション一式は `exec run --help` と一致 (2) `exec queue` の add/run/status/cancel は一致 (3) `--resume --resume-from executor` は `src/exec/run/register-command.ts`・`src/exec/evidence.ts` と一致 (4) `--force-restart` は一致 (5) `--resume-note` は `--resume --resume-from executor` と併用で一致 (6) `.specdojo/exec-defaults.yaml` の `routing` hard/medium/easy は一致 (7) `requires_human` は `exec-evidence.schema.yaml` の状態の候補と一致 (8) `question` は `register-item-frontmatter.schema.yaml` の種類の候補と一致 (9) 保護される範囲は `src/exec/agent-protected-config.ts` と不一致（`.agents/` ではなく `.agents/rules/`・`.agents/skills/`、正本は `.specdojo/` の設定ではなく CLI の固定の定義）なので訂正した (10) `PJR-KN*`・`kinuya-*`・agent の呼び名・営業時間は共通サンプル文脈の中の仮定のため対象外。
- 指摘（R4・`vp-arc-technical-constraints`）: 保護された設定の扱いで、書けない範囲を `.agents/` 全体、正本を `.specdojo/` の設定と書いていた。`src/exec/agent-protected-config.ts` では `.agents/rules/`・`.agents/skills/` だけが保護され、範囲は provider の設定から変えられない CLI の固定の定義である。sample を訂正した。
- 指摘（R4・`vp-qe-verifiability`、F005）: リリースの手順 3 の「全件の検査」では合否を判定できなかった。`npm test` を流し、終了コード 0 なら配布物を作る形に直した。
- 要判断: rulebook の章ごとの書き方は「保護の範囲は設定の正本を参照して列挙」とするが、実装の正本は CLI の固定の定義である。rulebook の文言を直すかを人が判断する（この段では rulebook を編集していない）。
- F001・F002・F003・F004・F006・F007・F008・F009 は R4 の観点の外なので扱わず、ほかの段に任せた。F003・F006・F007 は前の段ですでに反映済み。F008（`based_on` が `pm-plan-sample` を指す）は未反映なので、R5 で照らし直す。
- 適用外の検証: `npm run validate:history-links`（変更したのは sample だけで、plan・result・個票は変えていない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

sample の事実の主張を、`--help`、schema、`src/` と 1 件ずつ突き合わせて、一致、不一致、対象外に分けた。不一致は保護範囲の記述だけで、`src/exec/agent-protected-config.ts` を正として直した。F005 はリリース手順の検査を `npm test` と終了コード 0 に具体化して解消した。ほかの finding は R4 の観点の外として、後続の段か前の段に任せた。rulebook と実装が食い違う点は rulebook を編集せず、人の判断として申し送った。
