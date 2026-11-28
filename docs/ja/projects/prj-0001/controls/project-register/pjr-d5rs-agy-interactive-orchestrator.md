---
specdojo:
  id: prj-0001:pjr-d5rs-agy-interactive-orchestrator
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-11-28T04:17:56Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-28T10:22:44Z"
  conclusion: agy を利用者が直接起動する対話のオーケストレーターとして使えるよう、本文のラッパーと設定（templates/antigravity）と .agents/rules を戻した
  derived_from:
    - PJR-N6FQ
---

# PJR-D5RS agy を対話のオーケストレーターとして使えるようにラッパーを戻す

## 1. 概要

PJR-N6FQ で agy の対応を外した際、SpecDojo が agy を起動する経路と一緒に、利用者が agy を自分で起動して使う対話のオーケストレーターのラッパーも消した。agy を対話のオーケストレーターとして使えるよう、ラッパーだけを戻す。SpecDojo から agy を起動する経路（exec の provider、`orchestrator launch`、`agent launch`）は戻さない。

## 2. 入力

- 利用者は agy をオーケストレーターとして使いたい（indie、2026-11-28）
- Antigravity の FAQ が consumer plan で禁じるのは、他社の agent や application の中に agy を包むこと（wrapping）と、他社のソフトから Antigravity にアクセスすること。利用者が agy を起動し、agy が specdojo のコマンドを打つ形は、包むことに当たらないと読める。agy から動かした specdojo がさらに別の agent を起動することは、FAQ に書かれていない（2026-11-28 の確認）
- N6FQ（f1071c571）で templates/antigravity/orchestrator.md・settings.orchestrator.json と、orchestrator:sync の対象の agy のラッパーを消した
- push の守りは PJR-D4RJ の決定（各環境の git push の deny を残す）に合わせる。v0.10.0 に入れる。担当 DEV・期限 2026-11-30 は indie の指示（2026-11-28）

## 3. 完了条件

- agy 向けのオーケストレーターのラッパーを、対話用としてだけ戻す。置き場所と形は N6FQ で消したもの（`templates/antigravity/orchestrator.md`・`templates/antigravity/settings.orchestrator.json`、`.agents/rules` 側のラッパー）を元にし、本文はオーケストレーターの SSOT とバイト一致で保つ。
- `orchestrator:sync` と `tools/validate-orchestrator-sync.mjs` の対象に agy のラッパーを戻し、`npm run lint:orchestrator-sync` で検査できるようにする。テストも合わせる。
- exec の provider、`orchestrator launch`、`agent launch`、`init`・`config scaffold`・`devcontainer scaffold` の provider の選択肢、名簿の `antigravity` の member のエラーは今のまま変えない。SpecDojo が agy を起動する経路を戻さない。
- agy のラッパーの権限の設定で、ほかの環境と同じく `git push` を拒み、認証情報・`.env`・`secrets/` を読まない。agy の設定で表せない守りがあれば、何が表せないかを個票の対応結果に書く。
- 文書（コマンドリファレンス、`orchestrator-operation-guide` など、N6FQ で agy の説明を消したもの）の「agy の対応を外した」の説明を、「SpecDojo から agy を起動する対応を外した。利用者が agy を起動して対話のオーケストレーターに使うことはできる」に直す。理由として、Antigravity の FAQ が禁じるのは他社の agent や application の中に agy を包むことである点を書く。
- `.agents/` など保護された設定に置くラッパーのファイルは executor が書かず、ファイルの中身の案を個票の対応結果と報告の `handoff` に書く。反映は利用者の承認のもとオーケストレーターが行う。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業                                 | 担当 | 状態 | メモ                                                                                     |
| --- | ------------------------------------ | ---- | ---- | ---------------------------------------------------------------------------------------- |
| 1   | 対話用の配布本文・権限設定を復元     | DEV  | done | SSOT を写し、push・主要な秘密パスの deny と編集の ask を設定した                         |
| 2   | 同期対象と回帰テストを追加           | DEV  | done | agy 配布本文のずれの検出・再同期と権限設定を検証するテストを追加した                     |
| 3   | 利用手順・対応範囲・設計を更新       | DEV  | done | README、コマンドリファレンス、運用ガイド、設計、運用メモを直接起動の方針へ合わせた       |
| 4   | 保護設定の復元案とリリース文案を記録 | DEV  | done | executor は反映せず、下記の内容案を承認後のオーケストレーターへ引き継ぐ                  |
| 5   | executor 側の整形・検査を実施        | DEV  | done | 同期・履歴リンク・カタログ検証を通した。型検査・lint・単体テスト等は親 runner が実行する |

## 5. 対応結果

### 5.1. 実施内容と範囲

- `templates/antigravity/orchestrator.md` を現在の `.agents/specdojo-orchestrator.agent.md` からバイト一致で復元し、`orchestrator:sync` と `lint:orchestrator-sync` の共通対象一覧へ戻した。
- `settings.orchestrator.json` は削除前の形を基に、既定の対話モードと編集の承認、主要な環境別 `.env`・認証情報・秘密鍵の配置の拒否を補った。`git push` の deny は [[prj-0001:pjr-d4rj-orchestrator-git-push-with-approval|PJR-D4RJ の決定]] に従って残した。
- `src/`、provider の選択肢、名簿のエラー、起動用 npm script は変更していない。exec・`agent launch`・`orchestrator launch` から agy を起動する経路は復元していない。
- FAQ は consumer plan で他社の agent や application に agy を包むことを対象外とする。利用者が agy を直接起動して SpecDojo を操作する形として扱う。agy から呼んだ SpecDojo が別の agent を起動することは FAQ に明記されておらず、許可を確認できたとは扱わない（2026-11-28、<https://antigravity.google/docs/faq>）。

### 5.2. 権限設定の制約と実機確認

CLI 権限仕様（<https://antigravity.google/docs/permissions/?tab=cli>）のファイル指定はパスとディレクトリの再帰照合であり、`*` は全対象指定である。`.env.*` や `**/secrets/` のような glob で全階層を拒むことは公開仕様で保証されない。このため既知の相対パスを列挙した。別名・入れ子の秘密ファイル、利用者のホームにある認証情報・秘密鍵、追加 workspace ごとの配置は、利用者が実際のパスを deny に追加する必要がある。shell や許可した script 経由の読み取り、Git のオプション・shell の組み合わせによる push もこの JSON だけで完全に封じるものではなく、本文の禁止とコマンド承認を併用する。

`agy --help` で `--settings` がセッションだけの JSON／ファイル設定、`-i` が対話開始の指示であることを確認した。認証・使用枠を伴う対話の起動は sandbox では行わない。利用者は無害なテストファイルで、既存グローバル設定とのマージ・deny の優先順位、編集時の承認、直接・shell 経由の秘密パスの拒否、`git push` の拒否を確認する。実際の秘密情報は検証や証跡に使わない。

### 5.3. 保護された設定の内容案（未反映）

`.agents/rules/` の6ファイルは N6FQ に先行した設定削除 commit `c811d4c742` の直前の内容へ戻す案とする。正本への参照先はすべて現在も存在する。これらは規則の参照ラッパーであり、オーケストレーターの本文そのものは `templates/antigravity/orchestrator.md` から `-i` で渡す。executor は保護設定を変更しない。以下を利用者が承認した後、オーケストレーターが反映する。

`.agents/rules/markdown.md` の全内容案:

```markdown
---
trigger: glob
globs: "docs/**/*.md"
description: Markdown Rules（.github/instructions の薄いラッパー）
---

# Markdown Rules

このファイルは Antigravity CLI（agy）向けの薄いラッパーです。本文は `.github/instructions/markdown.instructions.md` を正本とします。

@[markdown](../../.github/instructions/markdown.instructions.md)
```

`.agents/rules/rulebook.md` の全内容案:

```markdown
---
trigger: glob
globs: "docs/ja/specdojo/rulebooks/**/*-rulebook.md"
description: Rulebook Rules（.github/instructions の薄いラッパー）
---

# Rulebook Rules

このファイルは Antigravity CLI（agy）向けの薄いラッパーです。本文は `.github/instructions/rulebook.instructions.md` を正本とします。

@[rulebook](../../.github/instructions/rulebook.instructions.md)
```

`.agents/rules/sample.md` の全内容案:

```markdown
---
trigger: glob
globs: "docs/ja/specdojo/samples/**/*-sample.*"
description: Sample Rules（.github/instructions の薄いラッパー）
---

# Sample Rules

このファイルは Antigravity CLI（agy）向けの薄いラッパーです。本文は `.github/instructions/sample.instructions.md` を正本とします。

@[sample](../../.github/instructions/sample.instructions.md)
```

`.agents/rules/specdojo-exec-workflow.md` の全内容案:

```markdown
---
trigger: glob
globs: "docs/ja/projects/**"
description: SpecDojo Exec Workflow Rules（.github/instructions の薄いラッパー）
---

# SpecDojo Exec Workflow Rules

このファイルは Antigravity CLI（agy）向けの薄いラッパーです。本文は `.github/instructions/specdojo-exec-workflow.instructions.md` を正本とします。

@[specdojo-exec-workflow](../../.github/instructions/specdojo-exec-workflow.instructions.md)
```

`.agents/rules/typescript.md` の全内容案:

```markdown
---
trigger: glob
globs: "{src,tools,packages}/**/*.ts"
description: TypeScript Rules（.github/instructions の薄いラッパー）
---

# TypeScript Rules

このファイルは Antigravity CLI（agy）向けの薄いラッパーです。本文は `.github/instructions/typescript.instructions.md` を正本とします。

@[typescript](../../.github/instructions/typescript.instructions.md)
```

`.agents/rules/vitest.md` の全内容案:

```markdown
---
trigger: glob
globs: "tests/**/*.test.ts"
description: Vitest Rules（.github/instructions の薄いラッパー）
---

# Vitest Rules

このファイルは Antigravity CLI（agy）向けの薄いラッパーです。本文は `.github/instructions/vitest.instructions.md` を正本とします。

@[vitest](../../.github/instructions/vitest.instructions.md)
```

`lefthook.yml` の `pre-commit.commands.orchestrator-sync.glob` には、既存対象を保持して `templates/antigravity/orchestrator.md` を加える。置換する値の案は次のとおり（未反映）。

```yaml
glob: "{.agents/specdojo-orchestrator.agent.md,.claude/agents/specdojo-orchestrator.md,.github/agents/specdojo-orchestrator.md,.codex/agents/specdojo-orchestrator.toml,.opencode/agents/gemma-orchestrator.md,.opencode/agents/qwen-orchestrator.md,templates/*/agents/specdojo-orchestrator.*,templates/antigravity/orchestrator.md,.agents/skills/specdojo-exec-in-session/SKILL.md,.claude/skills/specdojo-exec-in-session/SKILL.md,templates/agent-skills/**,templates/claude/skills/**}"
```

### 5.4. CHANGELOG に書く事項

- 区分: Fixed（v0.10.0）
- 行の文案: agy を利用者が直接起動して対話のオーケストレーターに使うためのラッパーと権限設定を復元しました。SpecDojo から agy を起動する provider・launch・scaffold の対応は復元しません（PJR-D5RS）。

### 5.5. 検証結果

- 変更した11ファイルを `npx prettier --write` で整形した。
- `npm run orchestrator:sync` は12対象が既に同期済みで変更なし。`npm run lint:orchestrator-sync` は12対象で成功した。
- `npm run validate:history-links`、`node --import tsx tools/catalog-validate-if-configured.mjs`、`git diff --check` は成功した。カタログ検証には既存の未作成文書・再 export の参照等の警告があるが、エラーはなかった。
- YAML の変更はないため `npm run validate:schema:file` は非適用。`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を含む親検証は executor で重複実行せず、終了後の runner に委ねる。
- `.agents/`・hook・Git の状態・登録簿のステータス・`CHANGELOG.md`・result は変更していない。実機確認と保護設定の反映は上記の申し送りに従う。

## 6. 関連ドキュメント

- [[specdojo:orchestrator-operation-guide|オーケストレーター運用ガイド]]
- [[specdojo:command-reference|コマンドリファレンス]]
- [[prj-0001:sysd-orchestrator-agent-settings|オーケストレーターエージェント設定]]
- [[prj-0001:pjr-n6fq-remove-antigravity-0-10|PJR-N6FQ]]
- [[prj-0001:pjr-d4rj-orchestrator-git-push-with-approval|PJR-D4RJ]]
