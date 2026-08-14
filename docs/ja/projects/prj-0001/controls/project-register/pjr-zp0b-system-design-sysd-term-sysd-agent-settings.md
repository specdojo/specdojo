---
specdojo:
  id: prj-0001:pjr-zp0b-system-design-sysd-term-sysd-agent-settings
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-08-14T12:26:29Z"
  due_on: "2026-08-31"
---

# PJR-ZP0B system-design: `sysd-<term>` 新設と `sysd-agent-settings` 系の再構成

## 1. 概要

`sysd-index`／`sysd-critical-flows`／`sysd-cross-cutting-policy` の最小3種構成では、既存のマルチエージェント実行設計（`sysd-agent-settings` 系4件・`sysd-job-execution`）を収める場所が無い。`tsd-index`／`tsd-rulebook` に倣い `sysd-rulebook`（hub＋子構成を許容する個別設計トピック用rulebook）を新設し、既存文書を横断ルール・運用手順・個別設計トピックへ再配置する。

## 2. 完了条件

- `sysd-rulebook.md`（`sysd-<term>`、hub＋子構成を許容）が新設され、`tsd-rulebook.md`との対応関係が明確であること。
- `sysd-agent-settings.md` の1〜6章・8章（3層責務分離、設定解決規則、rate limit検出・retry/fallback方針、worktree分離・イベント命名、reopen規則）が `sysd-cross-cutting-policy.md` へ移設され、`scp-<カテゴリ>-<連番>` 形式のルールとして再構成されていること。
- `sysd-agent-settings.md` の7章（外部エージェントCLI更新手順）が `opr-agent-cli-update.md`（運用手順）へ移設されていること。
- `sysd-agent-settings.md` が、4provider設計（`sysd-claude/codex/opencode/github-copilot-agent-settings.md`）への導線を持つ薄いhubへ縮小され、`rulebook` 参照が実在する `specdojo:sysd-rulebook` に更新されていること。
- `sysd-claude/codex/opencode/github-copilot-agent-settings.md`・`sysd-job-execution.md` の `rulebook` 参照が `specdojo:sysd-rulebook` に更新されていること。
- `sysd-index.md`（SSOT一覧）が新設され、`Configurations` 種別に agent実行構成（`.specdojo/exec-defaults.yaml`／`.claude/agents/`／`pm-members.yaml` 等）の行が追加されていること。
- `sysd-critical-flows.md` の要否を判断し、作らない場合はその判断根拠を残すこと。
- `prj-0001:dct-system-design` の該当エントリが、再構成後の構成・パスと整合していること。
- `npm run -s lint:md` にエラーがないこと。
- `npm run docs:build` が成功すること。

## 3. 作業内容

<!-- prettier-ignore -->
| No  | 作業 | 担当 | 状態 | メモ |
| --- | --- | --- | --- | --- |
| 1   | `sysd-rulebook.md` の新設 | ARC | open | 対象: `docs/ja/specdojo/rulebooks/sysd-rulebook.md`。`tsd-rulebook.md`に倣うが hub＋子構成を許容する |
| 2   | `sysd-cross-cutting-policy.md` の新設・内容移設 | ARC | open | 対象: `docs/ja/product/040-system-design/sysd-cross-cutting-policy.md`。`sysd-agent-settings.md`1〜6・8章を移設 |
| 3   | `opr-agent-cli-update.md` の新設・内容移設 | ARC | open | 対象: `docs/ja/product/`配下の運用手順ディレクトリ。`sysd-agent-settings.md`7章を移設 |
| 4   | `sysd-agent-settings.md` の縮小・rulebook参照修正 | ARC | open | 薄いhubへ縮小し、`specdojo:sysd-rulebook`を参照する |
| 5   | 4provider設計・`sysd-job-execution.md` のrulebook参照修正 | ARC | open | `specdojo:sysd-rulebook`へ更新 |
| 6   | `sysd-index.md` の新設 | ARC | open | Configurations種別にagent実行構成の行を追加 |
| 7   | `sysd-critical-flows.md` の要否判断 | ARC | open | 不要なら判断根拠を残す |
| 8   | `dct-system-design.yaml` の整合確認、lint:md／docs:build 実行 | ARC | open | 完了条件の検証コマンドを実行する |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:dct-architecture]]: `tsd-index`／`tsd-rulebook` の先例
- [[specdojo:tsd-index-rulebook]]: hub側rulebookの参照先例
- [[specdojo:tsd-rulebook]]: 個別トピックrulebookの参照先例
- [[specdojo:sysd-index-rulebook]]: `sysd-index`のCode as Spec方針・カテゴリ別書き分け方針
- [[specdojo:sysd-cross-cutting-policy-rulebook]]: 横断ルールの記述形式（Rule ID・カテゴリ）
- [[specdojo:kata-guide]]: rulebook / recipe / sample / template の役割分担
