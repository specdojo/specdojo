---
specdojo:
  id: prj-0001:pjr-veq4-evidence-refs-staleness-detection
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: ARC
  registered_at: "2026-09-15T11:50:15Z"
  due_on: "2026-09-30"
---

# PJR-VEQ4 evidence_refs の陳腐化を refactor 側の commit で検知し、参照を安定した入口に寄せる

## 1. 概要

成果物カタログの evidence_refs は src/ 配下の 69 ファイルを指しており、refactor で rename・削除されると陳腐化する。catalog validate は存在しないパスをエラーにするが、pre-commit hook の catalog-validate は glob が `docs/ja/projects/**` のため src だけを変える commit では走らず、CI にも含まれていない。hook の glob に `src/**`、`tools/**`、`packages/**` を加え、CI に validate:catalog を入れて refactor 側で検知する。あわせて dct-rulebook の evidence_refs 規約に「コマンドの入口や責務単位のディレクトリを指し、内部ヘルパーは指さない」を追記し、既存参照を見直す。

### 1.1. 現状

| 項目       | 状態                                                                                                                                                                                                              |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 参照数     | `dct-*.yaml` 3 件で `src/` 配下の 69 ファイルを参照（2026-09-15 時点、陳腐化 0 件）                                                                                                                               |
| 検知       | `catalog validate` が存在しないパスをエラーにする（`src/catalog-build.ts` の `existsSync` 判定）                                                                                                                  |
| 検知の契機 | lefthook の `catalog-validate` は glob `docs/ja/projects/**`。`src/` だけを変える commit では走らない。CI（`deploy.yml`、`publish-specdojo.yml`）に `validate:catalog` は無い。`npm run check` には含まれるが手動 |
| 粒度の規約 | [[specdojo:dct-rulebook]] の `evidence_refs`: 原則ファイル、ディレクトリは責務単位に限定、`src` 全体のような広い範囲は禁止                                                                                        |
| 用途       | `retrofit` の edit / review plan と grade plan に「実装エビデンス」として展開。読み取り専用                                                                                                                       |

壊れたら検知できるが、壊す側（refactor）の commit で検知されないため、陳腐化したまま残り得る。

### 1.2. 対処

- A. 検知を refactor 側に付ける: `lefthook.yml` の `catalog-validate` の glob に `src/**`、`tools/**`、`packages/**` を加える。CI の
  workflow に `npm run validate:catalog` を入れる。
- B. 粒度を安定した入口に寄せる: [[specdojo:dct-rulebook]] の `evidence_refs` に「コマンドの入口（`src/<command>.ts`）や責務単位の
  ディレクトリを指し、内部ヘルパーは指さない」を追記し、既存 69 参照のうち内部ヘルパーを指すものを入口へ寄せる。
- 不採用: 安定 ID → パスの索引による間接参照（C）は参照が数百件規模になるまで過剰。rename 検出による自動追従（D）は削除・分割に
  効かない。

`catalog validate` はパスの存在しか見ないため、ファイルが残ったまま責務が変わったケースは検知できない。それは review-pass と
grade で `evidence_refs` を参照する人・agent が気づく運用とし、本項目の対象外とする。

## 2. 完了条件

- `src/`、`tools/`、`packages/` 配下だけを変更した commit でも pre-commit の `catalog-validate` が実行され、存在しない `evidence_refs.path` があれば commit が失敗する。
- CI で `npm run validate:catalog` が実行される。
- [[specdojo:dct-rulebook]] の `evidence_refs` 規約に、入口・責務単位を指し内部ヘルパーを指さない旨と、その理由（refactor 耐性）が記述されている。
- 既存カタログの `evidence_refs` を規約に照らして見直し、内部ヘルパーを指す参照が入口へ寄せられている。`catalog validate` が OK。
- hook の追加による commit 時間の増加が実測で記録されている。

## 3. 作業内容

| No  | 作業                                                   | 担当 | 状態    | メモ                                                         |
| --- | ------------------------------------------------------ | ---- | ------- | ------------------------------------------------------------ |
| 1   | lefthook の `catalog-validate` の glob を広げる        | ARC  | waiting | `src/**`、`tools/**`、`packages/**`。PJR-3S8Q に従い申し送り |
| 2   | CI に `validate:catalog` を入れる                      | ARC  | waiting | 保護対象の workflow は申し送り経由                           |
| 3   | dct-rulebook の `evidence_refs` 規約に粒度の指針を追記 | ARC  | done    | 入口・責務単位、内部ヘルパーは指さない                       |
| 4   | 既存カタログの参照を見直して入口へ寄せる               | ARC  | done    | 現行 11 カタログの内部ヘルパー参照を安定入口へ集約           |

## 4. 対応結果

- [[specdojo:dct-rulebook]] に、コマンド入口または責務単位のディレクトリを調査起点とし、内部ヘルパーを直接参照しない規約と refactor 耐性の理由を追記した。
- 現行 12 カタログを再調査し、うち 11 カタログで `exec-*`、`catalog-*`、`register-*` などの内部ヘルパー参照を `src/exec.ts`、`src/catalog.ts`、`src/register.ts` などのコマンド入口へ集約した。同一成果物内で入口が重複する場合は `purpose` を統合した。
- `lefthook.yml` と CI workflow は [[prj-0001:pjr-3s8q-agent-writable-config-scope]] が定める保護対象であるため、executor では変更していない。人間または orchestrator が `catalog-validate.glob` に `src/**`・`tools/**`・`packages/**` を追加し、`deploy.yml` と `publish-specdojo.yml` の依存導入後へ `npm run validate:catalog` を追加する必要がある。
- hook に追加するカタログ検証は、sandbox の IPC 制約を避けた同等起動 `node --import tsx src/specdojo.ts catalog validate` で実測し、経過 1.401 秒（user 0.837 秒、system 0.173 秒）だった。設定適用後は hook 経由でも再計測する。現時点では完了条件 1・2 が未完了である。

## 5. 関連ドキュメント

- 規約: [[specdojo:dct-rulebook]]
- 参照が増えた契機: [[prj-0001:pjr-6pd7-cdfd-overview]]（PDCA 構成の 8 件で 24 参照を追加）
- 保護対象の設定変更の扱い: [[prj-0001:pjr-3s8q-agent-writable-config-scope]]
