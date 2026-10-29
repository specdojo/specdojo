---
specdojo:
  id: prj-0001:pjr-d0gb-context-marker-info-level
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: easy
  registered_at: "2026-10-29T11:52:41Z"
  derived_from:
    - PJR-JRSY
---

# PJR-D0GB ready 以外の文書の _CONTEXT_ の検出を情報に下げ、--frail で lint:fm を落とさない

## 1. 概要

下書きに _CONTEXT_ を書くと --frail の lint:fm が warning で失敗し、draft までの間すべての exec run の親の検証が止まる。ready 以外は file.info とし、ready の error は維持する

## 2. 完了条件

- docs-lint の `_CONTEXT_` の検出（`packages/docs-lint/src/context-marker.ts`）が、`status: ready` 以外の文書では情報（`file.info`）として報告し、`--frail` 付きの `npm run lint:fm` を失敗させない。`status: ready` の文書では従来どおり error として失敗させる。
- 記述規約（document-metadata-standard の「文脈の目印」など、PJR-JRSY で検出の扱いを書いた箇所）と `packages/docs-lint/README.md` の説明を、ready 以外は情報、ready は error に改める。
- 単体テストで、ready 以外の文書の `_CONTEXT_` が warning ではなく情報として報告されること、ready の文書では error になることを確かめる。
- `CHANGELOG.md` の `## [Unreleased]` 節に追記する。`0.5.0` と公開済みの版の節は変えない。
- 作業の中で `npm run typecheck`・`npm run lint:ts`・`npm run lint:md`・`npm run test:unit` が通り、親の検証 7 件が通る。

## 3. 作業内容

| No  | 作業                                  | 担当     | 状態 | メモ                                                   |
| --- | ------------------------------------- | -------- | ---- | ------------------------------------------------------ |
| 1   | 検出の重さを変え、規約・README を直す | executor | done | ready 以外を情報へ変更し、メタ情報標準と README を更新 |
| 2   | テストと CHANGELOG を更新する         | executor | done | 単体テストを情報レベルの検証に更新し CHANGELOG に追記  |

## 4. 対応結果

- `packages/docs-lint/src/context-marker.ts` において、`_CONTEXT_:` の検出時に `specdojo.status` が `ready` でない場合は `file.info(...)` を呼び出して情報レベルとして報告し、`ready` の場合は従来どおり `file.message(...)` を用いて `message.fatal = true`（error）とするように修正した。これにより、`--frail` 指定時でも ready 以外の文書の指示残存で `npm run lint:fm` が失敗しないようになった。
- [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] の「文脈の目印」節および `packages/docs-lint/README.md` において、`ready` 以外の文書における検出の扱いを warning から情報へ改めた。
- `tests/packages/docs-lint/context-marker.test.ts` を更新し、`ready` の文書では `fatal: true`（error）となり、`draft`・`deprecated` や frontmatter なし・不正 YAML などの `ready` 以外の文書では `fatal: undefined`（情報レベル、warning の `fatal: false` ではない）として報告されることを確認した。
- `CHANGELOG.md` の `## [Unreleased]` の「### 変更」節に、`@specdojo/docs-lint` の `_CONTEXT_:` 検出レベルの変更内容を追記した。
- 設計判断: unified-engine の `--frail` は `fatal` または `warn` のメッセージが存在する場合に終了コード 1 となるため、`ready` 以外を `file.info(...)`（`fatal: undefined`）に下げることで下書き中の `_CONTEXT_:` による親検証の停止を防ぎつつ、成果物確定時の `ready` では確実にエラーとして検出できるようにした。
- 検証: 単体テスト `tests/packages/docs-lint/context-marker.test.ts` が 11 件すべてパスすることを確認した。
- 親検証: `lint-ts`・`lint-fm`・`lint-md`・`test-integration`・`validate-schema`・`typecheck`・`test-unit` は executor 内では実行せず、終了後の親 runner へ委ねる。
- 申し送り: なし（保護された設定変更や未解決の判断事項はない）。

## 5. 関連ドキュメント

- [[prj-0001:pjr-jrsy-context-marker]]
- [[prj-0001:pjr-65ds-deliverable-context-draft-approach]]
