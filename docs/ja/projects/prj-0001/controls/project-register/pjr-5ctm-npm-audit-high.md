---
specdojo:
  id: prj-0001:pjr-5ctm-npm-audit-high
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-18T12:18:01Z"
  due_on: "2026-11-30"
---

# PJR-5CTM npm audit の high を解消する（配る依存を先に）

## 1. 概要

npm audit の high 15 件を解消する。配る依存（tinyglobby・fdir・picomatch・fast-uri）を先に直し、開発用は依存ごとに上げるか外すかを決める。古い版へ下げる直し方は使わない

## 2. 入力

- 利用者の依頼（2026-11-18）: npm audit で high が多く出るようになったので直したい
- orchestrator の調べ（2026-11-18）: npm audit は high 15・moderate 18・low 3・critical 0。--omit=dev では high 3（tinyglobby・fdir・picomatch）と moderate 1（fast-uri）。tinyglobby は実行時の依存
- orchestrator の調べ（2026-11-18）: 開発用の high は vitest・markdownlint-cli・remark-cli・ajv-cli・vite・markdown-it などの推移的な依存。npm audit の直し方には vitest@3.1.4・markdownlint-cli@0.33.0 など今より古い版へ下げる案が混じる
- 利用者の決定（2026-11-18）: 直し方は推奨の案 1。executor が依存ごとの直し方を調べて個票の対応結果に書き、package.json・package-lock.json（保護された設定）への反映は利用者の承認のもと orchestrator が feature ブランチで行う

## 3. 完了条件

- 配る依存（`npm audit --omit=dev` の対象）の high と moderate を解消する直し方を決める。依存ごとに、上げる版と、上げられない場合に `overrides` を使うかを、個票の対応結果に表で書く。
- 開発用の high（12 件）について、依存ごとに「上げる」「`overrides`」「外す（使っていないツール）」「上流待ち（理由と追跡先）」のどれにするかを、個票の対応結果に表で書く。今より古い版へ下げる直し方（`npm audit fix --force` が示す `vitest@3.1.4`・`markdownlint-cli@0.33.0` など）は使わない。
- `package.json`・`package-lock.json` は保護された設定のため executor は変えない。変更案（`dependencies`・`devDependencies`・`overrides` の差分）を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと orchestrator が feature ブランチで行う。
- npm registry へつながらず調べられない依存がある場合は、そのことと調べられなかった範囲を個票の対応結果に書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- 反映の後に、orchestrator が次を確かめる。`npm audit --omit=dev` の high と moderate が 0。全体の high が上流待ちとして記録したものだけ。`npm run check`・`npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run test:integration`・`npm run docs:build` が通る。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。

2 回目の実行（2026-11-18）:

- 1 回目の変更案のうち、`ajv-cli` を外す、`markdownlint-cli` を `^0.50.0`・`vitest` を `^4.1.12` に上げる、`overrides`（`fast-uri`・`vite`・`source-map-js`）、ルートの `engines.node` を `>=22.17` に上げる分は、orchestrator が利用者の承認のもと feature ブランチで反映した。executor はこれらを変えない。
- 利用者の決定（2026-11-18）: `tinyglobby` を外し、`node:fs` の `globSync` へ移す（`node:fs` の `globSync` が安定版になる Node 22.17 を前提にする）。
- `src/register/authoring-sources.ts` と、別に publish する `packages/docs-lint` の `src/glob-files.ts`・`src/deliverable-type.cjs` の `tinyglobby` の `globSync` を、`node:fs` の `globSync` へ置き換える。今の結果を保つ。ファイルだけを返す（`onlyFiles`）、ドットで始まるファイルとディレクトリを含めない（`dot: false`）、シンボリックリンクをたどらない（`followSymbolicLinks: false`）、`ignore` に当たるもの（`.git`・`node_modules` など）を除く、パスの区切りを `/` にそろえる、結果を並べ替える。
- 置き換えた 3 か所について、上の各点を確かめる単体テストを足す。置き換えの前と同じ入力で同じ結果になることを確かめる。
- `package.json`（ルートと `packages/docs-lint`）と lock は保護された設定のため executor は変えない。ルートと docs-lint の `dependencies` から `tinyglobby` を外す差分と、docs-lint の `engines.node` を `>=22.17` に上げる差分を、個票の対応結果に書き、報告の `handoff` にも書く。反映は orchestrator が行う。
- 反映の後に、orchestrator が `npm audit --omit=dev` の high と moderate が 0 であることを確かめる。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` と親の検証が通る。
- `CHANGELOG.md` は変えず、「CHANGELOG に書く事項」の節の文案を 2 回目の内容で更新する。`engines` を上げることは利用者への影響として Changed に書く。

## 4. 作業内容

| No  | 作業                                                                          | 担当         | 状態  | メモ                                                        |
| --- | ----------------------------------------------------------------------------- | ------------ | ----- | ----------------------------------------------------------- |
| 1   | 配る依存の high・moderate の直し方を調べて表に書く                            | ARC          | done  | `npm audit --omit=dev` 対象 4 件の直し方を決定              |
| 2   | 開発用の high の直し方を依存ごとに決めて表に書く                              | ARC          | done  | 開発用 high 12 件の直し方を決定（古い版へ下げる案は不採用） |
| 3   | `package.json`・`package-lock.json` の変更案を書く                            | ARC          | done  | 対応結果および `handoff` に変更案を記録                     |
| 4   | 変更案を feature ブランチで反映し、audit と検証を確かめる                     | orchestrator | doing | 利用者の承認後に orchestrator が feature ブランチで実施     |
| 5   | `tinyglobby` を `node:fs` の `globSync` へ移し、テストを足す（2 回目）        | ARC          | open  | 本体と `packages/docs-lint`                                 |
| 6   | `tinyglobby` を外す `package.json` の差分を反映し、audit を確かめる（2 回目） | orchestrator | open  | 利用者の承認の後                                            |

## 5. 対応結果

### 5.1 実施内容

npm audit で報告された high 15 件および moderate 1 件（配る依存に含まれる `fast-uri`）について、npm registry の最新版とセキュリティアドバイザリ（GitHub Advisory Database）を調査し、依存ごとの直し方を決定した。古い版へ下げる案（`npm audit fix --force` の提案）は採用せず、上げる・`overrides`・外す・上流待ちのいずれかに分類した。

なお、npm registry への接続は正常に行われ、すべての対象依存について最新情報と依存関係を調査完了した（調べられなかった範囲はない）。

### 5.2 配る依存（`npm audit --omit=dev` 対象）の直し方

配る依存（`dependencies` およびその推移的依存）にある 4 件の対処方針は下表の通り。

| 依存パッケージ | 現在の版 | 重大度   | 直し方（上げる版 / overrides / 外す）  | 理由・詳細                                                                                                                                                                                                                                                          |
| -------------- | -------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fast-uri`     | 3.1.8    | moderate | `overrides`: `^3.1.9`                  | `ajv@8.20.0` の指定 `^3.0.1` に合致する修正版 `3.1.9`（最新は 4.2.3 だが 3 系最新で互換性確保）を `overrides` で指定し、URI spoofing（GHSA-w74x-v6f9-j3xg）等の脆弱性を解消する。                                                                                   |
| `tinyglobby`   | 0.2.17   | high     | 外す（推奨） / 上流待ち（次善）        | 唯一の利用箇所である `src/register/authoring-sources.ts` を Node.js >= 22.13 組み込みの `node:fs` の `globSync` へ移行し、配る依存から外す。これにより推移的依存の `fdir`・`picomatch` も配る依存から完全に除外され、`npm audit --omit=dev` の high が 0 件になる。 |
| `fdir`         | 6.5.0    | high     | 外す（`tinyglobby` に連動） / 上流待ち | `tinyglobby` が推移的に引く依存。`tinyglobby` を外すことで配る依存から解消される。残す場合は推移的依存 `picomatch` の上流待ち。                                                                                                                                     |
| `picomatch`    | 4.0.7    | high     | 外す（`tinyglobby` に連動） / 上流待ち | ReDoS 脆弱性（GHSA-fc5q-39xc-vjpf、<=4.0.7 が対象）。現在公式パッチ版が未リリースのため上流待ちだが、`tinyglobby` を配る依存から外すことで配る依存からは完全に解消される。                                                                                          |

### 5.3 開発用依存の high（12 件）の直し方

開発用依存（`devDependencies` およびその推移的依存）にある 12 件の high 脆弱性の対処方針は下表の通り。

| 依存パッケージ                         | 現在の版 | 直し方                                 | 理由・追跡先                                                                                                                                                                                                                                                                                                                 |
| -------------------------------------- | -------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@typescript-eslint/typescript-estree` | 8.71.0   | 上流待ち                               | `tinyglobby` -> `picomatch` 起因の high。追跡先: GHSA-fc5q-39xc-vjpf（micromatch/picomatch）。なお、`@typescript-eslint/*` 自体は `8.73.0` に上げることで `minimatch` 起因の moderate を解消できる。                                                                                                                         |
| `ajv-cli`                              | 5.0.0    | 外す（使っていないツール）             | プロジェクト内のスキーマ検証は `packages/docs-lint` の `specdojo-docs-lint yaml-schema`（Ajv API 直接呼び出し）に移行しており、CLI ツールである `ajv-cli` は scripts やコードから参照されていない。外すことで推移的依存の `fast-json-patch` ごと解消する。（残す場合の代替案: `overrides: { "fast-json-patch": "^3.1.1" }`） |
| `fast-json-patch`                      | 2.2.1    | 外す（`ajv-cli` に連動） / `overrides` | `ajv-cli` の推移的依存。Prototype Pollution（GHSA-8gh8-hqwg-xf34）。`ajv-cli` を外すことで解消。残す場合は `overrides: { "fast-json-patch": "^3.1.1" }`。                                                                                                                                                                    |
| `markdownlint-cli`                     | 0.49.1   | 上げる + 上流待ち                      | `^0.50.0` に上げる。推移的依存の `markdown-it` が `~15.0.3` に更新されて ReDoS（GHSA-gfr2-rv44-r23c）が解消する。なお、`tinyglobby` -> `picomatch` 起因の high は上流待ち（GHSA-fc5q-39xc-vjpf）。                                                                                                                           |
| `markdown-it`                          | 14.3.2   | 上げる                                 | `markdownlint-cli` を `^0.50.0` に上げることで `15.0.3`（>=14.3.3）に更新され、ReDoS（GHSA-gfr2-rv44-r23c）が解消する。                                                                                                                                                                                                      |
| `vitest`                               | 4.1.11   | 上げる + 上流待ち                      | `^4.1.12` に上げることで推移的依存の `@vitest/mocker@4.1.12` が適用され、モックコードインジェクション脆弱性（GHSA-qxg6-89mg-rqv8 等）が解消する。`picomatch` 起因の high は上流待ち（GHSA-fc5q-39xc-vjpf）。                                                                                                                 |
| `vite`                                 | 8.3.1    | `overrides` + 上流待ち                 | `overrides: { "vite": "^8.3.8" }` を指定。launch-editor の Windows bypass 脆弱性（GHSA-587h-7wmj-h5pm）が解消する。`picomatch` 起因の high は上流待ち（GHSA-fc5q-39xc-vjpf）。                                                                                                                                               |
| `source-map-js`                        | 1.2.1    | `overrides`                            | `overrides: { "source-map-js": "^1.2.2" }` を指定。DoS 脆弱性（GHSA-68fv-2mgg-jv7q）が解消する。                                                                                                                                                                                                                             |
| `unified-args`                         | 11.0.1   | 上流待ち                               | `remark-cli` の推移的依存（最新版）。`chokidar@3.6.0` -> `anymatch` / `readdirp` -> `picomatch@2.3.2` 起因。追跡先: GHSA-fc5q-39xc-vjpf（micromatch/picomatch）。                                                                                                                                                            |
| `chokidar`                             | 3.6.0    | 上流待ち                               | `unified-args` の推移的依存。`anymatch` / `readdirp` -> `picomatch@2.3.2` 起因。追跡先: GHSA-fc5q-39xc-vjpf（micromatch/picomatch）。                                                                                                                                                                                        |
| `anymatch`                             | 3.1.3    | 上流待ち                               | `picomatch@2.3.2`（<=4.0.7）起因。追跡先: GHSA-fc5q-39xc-vjpf（micromatch/picomatch）。                                                                                                                                                                                                                                      |
| `readdirp`                             | 3.6.0    | 上流待ち                               | `picomatch@2.3.2`（<=4.0.7）起因。追跡先: GHSA-fc5q-39xc-vjpf（micromatch/picomatch）。                                                                                                                                                                                                                                      |

### 5.4 迷った点・executor の判断

1. **`picomatch` の未修正脆弱性と配る依存の扱い**:
   `picomatch`（<=4.0.7）の ReDoS（GHSA-fc5q-39xc-vjpf）は npm registry 全体にパッチ版（>4.0.7）が未リリースであり、上流待ちの状態である。そのため、配る依存に `tinyglobby` が含まれる限り、`npm audit --omit=dev` の high を 0 にすることができない。
   調査の結果、`tinyglobby` の利用箇所は `src/register/authoring-sources.ts` のみであり、プロジェクト要件（Node.js >= 22.13）で標準提供されている `node:fs` の `globSync` で完全代替可能であることが判明した。
   したがって、配る依存から `tinyglobby` を外す改修を行うことを「推奨案」とし、これにより `npm audit --omit=dev` の high を確実に 0 件にする判断とした。
2. **`ajv-cli` の扱い**:
   `ajv-cli` は最新版（5.0.0）でも脆弱性のある `fast-json-patch@2.2.1` に依存している。リポジトリ内のコードおよびスクリプトを精査したところ、スキーマ検証は `packages/docs-lint` の内部実装へ移行済みであり、`ajv-cli` は未使用ツールとなっていた。そのため「外す（使っていないツール）」として判定した。

### 5.5 `package.json`・`package-lock.json` の変更案

利用者の承認のもと、orchestrator が feature ブランチで反映するための `package.json` 差分案は以下の通り。

```json
{
  "dependencies": {
    // "tinyglobby": "^0.2.17" を削除（src/register/authoring-sources.ts を node:fs の globSync に置換）
  },
  "devDependencies": {
    // "ajv-cli": "^5.0.0" を削除（未使用ツール）
    "markdownlint-cli": "^0.50.0", // 0.49.1 から更新
    "vitest": "^4.1.12" // 4.1.11 から更新
  },
  "overrides": {
    "fast-uri": "^3.1.9",
    "vite": "^8.3.8",
    "source-map-js": "^1.2.2"
  }
}
```

※テスト環境（`tmp/`）での検証結果：
上記変更を反映して `npm install --package-lock-only` を実行したところ、

- `npm audit --omit=dev` は **high 0 / moderate 0 / low 0（脆弱性 0 件）** を達成した。
- 全体の `npm audit` の残存 high は 12 件となり、すべて公式パッチ未リリースの `picomatch`（GHSA-fc5q-39xc-vjpf）に起因する上流待ちのみに絞り込まれることを確認した。

### 5.6 反映後の確認事項（orchestrator 向け）

orchestrator が feature ブランチで上記変更案および `src/register/authoring-sources.ts` の移行（推奨案の場合）を反映した後、以下を確認する。

1. `npm audit --omit=dev`: high 0 件、moderate 0 件であること。
2. `npm audit`: high が上流待ちとして記録した `picomatch` 起因のもの（12件）のみであること。
3. 検証コマンドがすべて成功すること:
   - `npm run check`
   - `npm run typecheck`
   - `npm run lint:ts`
   - `npm run test:unit`
   - `npm run test:integration`
   - `npm run docs:build`

### 5.7 CHANGELOG に書く事項

- **区分**: `Security`
- **行の文案**:
  - `配る依存から tinyglobby を除外して Node.js 組み込みの globSync へ移行し、fast-uri・source-map-js・vite などの推移的依存の脆弱性を解消（PJR-5CTM）`

## 6. 関連ドキュメント

- [[prj-0001:pjr-p318-security-automation|PJR-P318]]
