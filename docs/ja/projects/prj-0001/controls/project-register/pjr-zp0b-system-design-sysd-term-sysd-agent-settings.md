---
specdojo:
  id: prj-0001:pjr-zp0b-system-design-sysd-term-sysd-agent-settings
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-14T12:26:29Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-16T10:00:11Z"
  conclusion: 個別SYSD体系を新設し、agent実行設計をhub・横断ルール・重要フロー・運用手順へ再構成した
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
- `sysd-critical-flows.md` の要否を判断し、採用または不採用の判断根拠を残すこと。
- `prj-0001:dct-system-design` の該当エントリが、再構成後の構成・パスと整合していること。
- `npm run -s lint:md` にエラーがないこと。
- `npm run docs:build` が成功すること。

## 3. 作業内容

<!-- prettier-ignore -->
| No  | 作業 | 担当 | 状態 | メモ |
| --- | --- | --- | --- | --- |
| 1   | `sysd-rulebook.md` の新設 | ARC | done | hub＋子構成を許容する個別システム設計rulebookを新設 |
| 2   | `sysd-cross-cutting-policy.md` の新設・内容移設 | ARC | done | 規範を14件の`scp-<カテゴリ>-<連番>`へ再構成 |
| 3   | `opr-agent-cli-update.md` の新設・内容移設 | ARC | done | `docs/ja/product/090-operations/`へ更新手順と証跡要件を移設 |
| 4   | `sysd-agent-settings.md` の縮小・rulebook参照修正 | ARC | done | 共通責務と子設計への薄いhubへ縮小 |
| 5   | 個別agent設計・`sysd-job-execution.md` のrulebook参照修正 | ARC | done | 4provider、orchestrator、Jobを`specdojo:sysd-rulebook`へ統一 |
| 6   | `sysd-index.md` の新設 | ARC | done | Configurationsを含む設計SSOT一覧を追加 |
| 7   | `sysd-critical-flows.md` の要否判断 | ARC | done | SpecDojo固有の事故予防フロー5件を採用 |
| 8   | catalog整合確認、lint:md／docs:build 実行 | ARC | done | catalog・全体lint・Frontmatter・docs:buildが成功 |

## 4. 対応結果

- `sysd-critical-flows` は作成する。PR承認、task worktreeの分離・統合・保持、register ID採番と衝突復旧、agent worker poolの並列実行、provider利用制限からの延期再開は、いずれも順序・排他・監査・再実行を誤ると成果物または状態の整合性を損なうため、最大5件の重要フローとして採用した。
- `sysd-agent-settings` は共通責務と子設計へのhubへ縮小し、規範は`sysd-cross-cutting-policy`、CLI更新手順は`opr-agent-cli-update`へ移設した。
- 4providerに加えて、既にhubから参照され同じrulebookを使用する`sysd-orchestrator-agent-settings`を個別設計トピックとしてdeliverables catalogへ追加した。
- rulebook作成では`rulebook-authoring-standard`、`rulebook.instructions.md`、類似する`tsd-rulebook`・`cdfd-rulebook`・`opd-rulebook`を参照した。upsert-rulebook Skillが指定する`docs-contents-guide.md`はリポジトリに存在しないため、個票とdeliverables catalogを内容根拠として補完した。
- `npm run -s validate:catalog`: 成功。未作成成果物に対する既存warningはあるが、`dct-system-design.yaml`を含む全catalogが`OK`となった。
- 変更対象ファイルのMarkdown lint: 成功。
- `npm run docs:build`: 成功。`sysd-critical-flows.md`のMermaid 5図を含めてVitePress buildが完了した。
- `npm run -s lint:md`: 成功。生成元の`PJR-0053`で`*CAPITAL_CASE*`をコード表記へ修正し、派生登録簿のMD049を解消した。
- `npm run -s lint:fm`: 成功。結論確定済みの`PJR-1F46`へ確定コミット時刻の`completed_at`を追加した。
- 状態遷移の監査記録: 本対応は着手時に`specdojo register start`を実行せず、作業完了後に`specdojo register close`で`done`へ遷移した。このためGit履歴上は`open`から`done`への遷移となる。実態と異なる遡及遷移は作成せず、現在の`done`を維持する。後続の登録項目は着手前に`register start`、審査移行時に`register review`、終了時に`register close`を実行する。

## 5. 関連ドキュメント

- [[prj-0001:dct-architecture]]: `tsd-index`／`tsd-rulebook` の先例
- [[specdojo:tsd-index-rulebook]]: hub側rulebookの参照先例
- [[specdojo:tsd-rulebook]]: 個別トピックrulebookの参照先例
- [[specdojo:sysd-index-rulebook]]: `sysd-index`のCode as Spec方針・カテゴリ別書き分け方針
- [[specdojo:sysd-cross-cutting-policy-rulebook]]: 横断ルールの記述形式（Rule ID・カテゴリ）
- [[specdojo:kata-guide]]: rulebook / recipe / sample / template の役割分担
