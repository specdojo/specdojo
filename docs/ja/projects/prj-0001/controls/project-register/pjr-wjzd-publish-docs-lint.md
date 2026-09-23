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
| 1   | `publish-docs-lint.yml` を追加する                | DEV  | done | `publish-specdojo.yml` と同型 |
| 2   | `npm pack --dry-run` で同梱範囲を確認する         | DEV  | done | 不要ファイルの除外            |
| 3   | npm 側の trusted publisher 設定を登録する         | OPS  | open | ブラウザ操作。人が行う        |
| 4   | `main` への push で公開し、導入して動作を確認する | OPS  | open | 人が行う                      |

## 4. 対応結果

- `.github/workflows/publish-docs-lint.yml` を追加した。`publish-specdojo.yml` と同型で、Trusted Publishing（OIDC）を使い `NODE_AUTH_TOKEN` を持たない。起動条件は `packages/docs-lint/**` と workflow 自身の変更に限定し、ルート package の変更では起動しない。`defaults.run.working-directory` を `packages/docs-lint` とし、setup-node の `cache-dependency-path` も同 package の `package-lock.json` を指す。公開済み version と一致する場合は skip する判定は同一ロジックである。scoped package のため `npm publish --access public` を指定した。
- `publish-specdojo.yml` との差分はビルド段の有無である。このパッケージは `src` をそのまま配布し `bin` が tsx 経由で実行するため `build` script を持たない。省略した理由は workflow 内のコメントに残した。
- `npm pack --dry-run` で同梱範囲を確認した。15 ファイル、package size 19.9 kB、unpacked 64.3 kB。内訳は `LICENSE` / `README.md` / `package.json` / `bin/specdojo-docs-lint.js` / `src` 配下の `.ts` 9 件と `.cjs` 3 件で、remark プラグインの公開 export が参照するファイルが揃っている。`node_modules`、`tsconfig.json`、`package-lock.json` は含まれない。
- `.github/workflows/` は agent の書き込み保護対象であるため、exec へ流さずオーケストレーターが直接対応した。ローカル feature ブランチ `feature/prj-0001/publish-docs-lint` で実装し、`--no-ff` merge（`7469ca28`）で develop へ統合した。
- 作業 3（npm 側の trusted publisher 設定）と作業 4（公開と導入確認）は人の作業として残る。`@specdojo/docs-lint` は未公開のため、scoped package の初回公開を Trusted Publishing で行えるかが未検証である。行えない場合は初回のみ手動 publish（`npm login` と 2FA）が必要になる。

## 5. 関連ドキュメント

- [[prj-0001:pjr-7vkr-npm-release]]
- [[prj-0001:pjr-09kk-npm-onboarding-path]]
- `.github/workflows/publish-specdojo.yml`
- `packages/docs-lint/package.json`
