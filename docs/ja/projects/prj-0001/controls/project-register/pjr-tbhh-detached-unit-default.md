---
specdojo:
  id: prj-0001:pjr-tbhh-detached-unit-default
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-09-20T05:00:24Z"
  due_on: "2026-09-30"
---

# PJR-TBHH 利用プロジェクトの既定構成を Detached Unit にする

## 1. 概要

prj-0001 の実測では、2026-09-13 以降の 253 commit のうち exec の記帳（register の遷移、prepare / apply、merge）が 182 件（72%）を占めた。これは SpecDojo の仕組み上の性質であり、利用プロジェクトでも同じ比率になる。プロダクトの Git 履歴が記帳で埋まるのは、SpecDojo を導入する代償として大きすぎる。

PJR-QHKA で規定した別リポジトリ構成（Detached Unit）は、SpecDojo Unit をプロダクトと別のリポジトリに置き、成果物更新・登録簿の遷移・exec の実行記録をプロダクトの履歴から分離する。現在の docs-structure-guide はこれを選択肢の一つとして「文書のみを扱うなら採用可」と書いているが、一般の利用プロジェクトは文書から始めるため、Detached を既定にするほうが自然である。

Attached Unit（同一リポジトリ）は、SpecDojo 自身の開発のように成果物と実装が同じ変更で動く場合に限る。prj-0001 は dogfooding のため Attached のまま維持し、本線の可読性は PJR-Y013（記帳 commit の merge commit への同梱）で改善する。

### 1.1. 決定事項

- 利用プロジェクトの既定構成は Detached Unit とする（決定者 ARC、2026-09-20）。Attached は「成果物と実装が同じ変更で動く」場合の例外とする。
- 「既定」は guide の推奨と `config init` の雛形で表し、CLI が構成を強制しない。
- 実装を伴う登録簿項目（1 つの項目で文書とプロダクト実装の両方を変更する）の扱いは PJR-P7HY（複数リポジトリ統合）の完了までの制約として guide に明記する。PJR-P7HY の優先度を low から medium に上げる。
- プロダクト文書（`docs/ja/product`）の配置は、PJR-QHKA 2.4.3 の再検討（src と同期が必要な対）に従い**プロダクト実装のリポジトリ側**（`app1/docs/ja/product`）とする。現行 guide 10.3 の「`app1-specdojo/docs/ja/product/`」は旧判断であり、本 todo で改める。境界は「`app1/` = src + `docs/ja/product`、`app1-specdojo/` = `docs/ja/projects` + `docs/ja/specdojo`（運用記録と Kata）」とする。
- この配置では grade が成果物へ書き込む限り routine の commit がプロダクト実装の履歴へ流れ込むため、PJR-XKKS（grade のサイドカー化）を本 todo の前提とする。catalog の `base_path` がリポジトリをまたぐ解決と `exec run --worktree` の二重 worktree は PJR-P7HY の範囲とし、guide には前提条件として明記する。

## 2. 完了条件

- `docs-structure-guide` の構成の選び方が「既定は Detached Unit、Attached は成果物と実装が同じ変更で動く場合のみ」になり、「別リポジトリ構成」章の採用条件表が既定前提に書き換わっている。実装を伴う項目の制約が PJR-P7HY への参照付きで明記されている。
- `quick-start-guide` の手順が Detached Unit（`app1-specdojo/` + `app1-worktrees/`）を第一に案内し、同一リポジトリは注記になっている。
- `config init` の雛形（`.specdojo/specdojo.config.json`）と生成されるコメントが Detached Unit のパス構成を前提にしている。
- `directory-layout-reference` と `specdojo-overview-guide` の該当箇所が同じ前提に揃っている。
- `npm run lint:md` と `npm run docs:build` が通過している。

## 3. 作業内容

| No  | 作業                                                                                  | 担当 | 状態 | メモ                                              |
| --- | ------------------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------- |
| 1   | `docs-structure-guide` の構成の選び方と「別リポジトリ構成」章を既定前提に改める       | ARC  | open | codex-expert-executor / gemma-reporter / worktree |
| 2   | `quick-start-guide` を Detached Unit の手順に組み替え、同一リポジトリを注記に降格する | ARC  | open | 作業 1 と同一タスク                               |
| 3   | `config init` の雛形とコメントを Detached Unit のパス構成に改める                     | DEV  | open | 同上                                              |
| 4   | `directory-layout-reference` / `specdojo-overview-guide` を揃える                     | ARC  | open | 同上                                              |
| 5   | PJR-P7HY の優先度を medium に上げる                                                   | ARC  | done | オーケストレーターが直接対応（2026-09-20）        |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[specdojo:docs-structure-guide]]
- [[specdojo:quick-start-guide]]
- [[specdojo:directory-layout-reference]]
- [[specdojo:specdojo-overview-guide]]
- [[prj-0001:pjr-qhka-docs-structure-detached-unit]]
- [[prj-0001:pjr-p7hy-multi-repo-single-item]]
- [[prj-0001:pjr-y013-exec-commit-folding]]
- [[prj-0001:pjr-xkks-grade-sidecar]]
