---
specdojo:
  id: prj-0001:pjr-wjzd-publish-docs-lint
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: OPS
  registered_at: "2026-09-23T10:57:25Z"
  due_on: "2026-10-03"
---

# PJR-WJZD @specdojo/docs-lint を npm へ公開できるようにする

## 1. 概要

[[prj-0001:pjr-09kk-npm-onboarding-path]] で整えた導線は、文書 lint の導入をこう案内する。

```sh
npm install --save-dev @specdojo/docs-lint
```

しかし npm レジストリの状態は次のとおりで、**この手順は現状失敗する**。

| パッケージ            | npm            |
| --------------------- | -------------- |
| `specdojo`            | 0.1.0 公開済み |
| `@specdojo/docs-lint` | 未公開         |
| `@specdojo/docs-site` | 未公開         |

`packages/docs-lint/package.json` は `private: false`、`license: MIT`、`repository` あり、`bin` に `specdojo-docs-lint` を持ち、公開可能な状態にある。不足しているのは publish の経路である。`.github/workflows/` には `publish-specdojo.yml` しかなく、`packages/**` を publish する workflow が存在しない。

[[prj-0001:pjr-dpvv-docs-lint-package]] で `tools/docs` を分離した際、ルート package から lint 実装を外して外部依存にしたが、公開までは行っていない。

本項目は `@specdojo/docs-lint` を対象とする。`@specdojo/docs-site` は README の必須手順ではないため対象外とし、[[prj-0001:pjr-sj3x-docs-site-kata-staging]] の進捗に合わせて別途扱う。

## 2. 完了条件

- `.github/workflows/publish-docs-lint.yml` が存在し、`publish-specdojo.yml` と同型である。Trusted Publishing（OIDC）を使い、`NODE_AUTH_TOKEN` を使わない。
- 起動条件が `packages/docs-lint/**` と workflow 自身の変更に限定されている。ルート package の変更で起動しない。
- 公開済み version と一致する場合は skip する。`publish-specdojo.yml` と同じ判定を使う。
- scoped package のため `npm publish --access public` を指定している。
- npm 側の trusted publisher 設定が登録され、workflow のファイル名が `publish-docs-lint.yml` と一致している。
- `@specdojo/docs-lint` 0.1.0 が npm へ公開され、`npm install --save-dev @specdojo/docs-lint` が成功する。
- 導入した環境で `npx specdojo-docs-lint --help` 相当が動作する。
- 同梱範囲を `npm pack --dry-run` で確認し、不要なファイルが含まれていない。

## 3. 作業内容

| No  | 作業                                              | 担当 | 状態 | メモ                          |
| --- | ------------------------------------------------- | ---- | ---- | ----------------------------- |
| 1   | `publish-docs-lint.yml` を追加する                | DEV  | open | `publish-specdojo.yml` と同型 |
| 2   | `npm pack --dry-run` で同梱範囲を確認する         | DEV  | open | 不要ファイルの除外            |
| 3   | npm 側の trusted publisher 設定を登録する         | OPS  | open | ブラウザ操作。人が行う        |
| 4   | `main` への push で公開し、導入して動作を確認する | OPS  | open | 人が行う                      |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-7vkr-npm-release]]
- [[prj-0001:pjr-09kk-npm-onboarding-path]]
- `.github/workflows/publish-specdojo.yml`
- `packages/docs-lint/package.json`
