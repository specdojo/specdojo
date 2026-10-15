---
specdojo:
  id: prj-0001:pjr-v23p-src-subdirectory-layout
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-10-15T22:07:48Z"
  due_on: null
---

# PJR-V23P src を機能ごとのサブディレクトリに分ける

## 1. 背景

リファクタリング（[[prj-0001:pjr-y8p9-large-source-files-split]] など）で大きなファイルを分けた結果、`src/` の直下のファイルは 167 になった（2026-10-16）。ファイル名の接頭辞が実質的にディレクトリの代わりになっている。

| 接頭辞       | ファイル数 |
| ------------ | ---------- |
| `exec-`      | 73         |
| `register-`  | 16         |
| `grade-`     | 13         |
| `catalog-`   | 11         |
| `schedule-`  | 8          |
| `dashboard-` | 5          |
| その他       | 41         |

利用者から、`src/<func>/` のように機能ごとのサブディレクトリにまとめる提案があった（2026-10-16）。

確かめた影響:

- ほぼすべての相対 import と、`tests/src/` の 125 のテストの import が変わる。
- Vitest の規約（`.github/instructions/vitest.instructions.md`）により、`tests/` は `src/` と同じ構成にする。
- `package.json` の `bin` は `dist/specdojo.js` で、`exports` はない。`dist/` のパスは `src/spawn-self.ts`・`src/dist-freshness.ts`・`tests/helpers/schema.ts`・`lefthook.yml`・`.claude/settings.json` などが参照している。
- 設計書とガイドの 13 文書に `src/...` のパスが 52 か所ある。個票・plan・result などの履歴のファイルは書き換えない。

## 2. 検討した選択肢

| 選択肢 | 内容                                                                                    | 利点                                 | 欠点                                                                                                                           |
| ------ | --------------------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| A      | 現状のまま（直下に置き、接頭辞で区別する）                                              | 変更が要らない                       | 167 ファイルが 1 か所に並び、機能の境界が一覧で分からない。依存の向きを機械的に確かめにくい                                    |
| B      | 機能ごとのサブディレクトリへ移し、ファイル名は変えない（`src/exec/exec-run.ts`）        | ファイル名の変更がなく、検索しやすい | ディレクトリと接頭辞が重なって冗長になる                                                                                       |
| C      | 機能ごとのサブディレクトリへ移し、ディレクトリと重なる接頭辞を外す（`src/exec/run.ts`） | 冗長さがなくなる                     | 変更の量が増える。同じ名前のファイル（`src/register/core.ts` と `src/grade/core.ts` など）が増え、エディタのタブで区別しにくい |

## 3. 決定内容

推奨のとおり、次のように決める。

1. 選択肢 C を採る。CLI の入口 `src/specdojo.ts` は直下に残す。
2. 機能ごとのディレクトリは、`exec/`・`register/`・`grade/`・`catalog/`・`schedule/`・`dashboard/`（`timeline` を含む）・`job/`・`routine/`・`kata/`・`deliverable/`・`devcontainer/`・`docs/`（文書の索引・YAML のページ・frontmatter・テンプレートの解決）・`review/` とする。
3. 複数の機能から使う共通の処理（`yaml`・`yaml-schema-modeline`・`git-environment`・`specdojo-config`・`specdojo-gitignore`・`package-paths`・`spawn-self`・`dist-freshness`・`build-if-stale`・`watch`・`agent`・`agent-response`・`role-types` など）は `src/shared/` に置く。
4. 1 階層だけとし、`exec/` の下をさらに分けることは移した後の実態を見て決める。
5. 移動と import の書き換えは、スクリプト（codemod）で機械的に行い、`git mv` で履歴を辿れるようにする。agent に手で書き換えさせない。
6. 依存の向きの規則（例: `shared/` は他の機能を import しない、`register/` は `exec/` を import しない）は、移した後に別の todo で ESLint の `no-restricted-imports` などで入れる。移動と同時には行わない。
7. 小さい機能から 1 件ずつ移し（`dashboard` から始めて `exec` を最後にする）、各件で typecheck・全テスト・`--help` の一致を確かめる。runner のコードを含む件では `exec run` を 1 回流す。
8. [[prj-0001:pjr-zm1k-agent-members-model-alias]] の実装より先に行う。

## 4. 採択理由

- 機能の境界がディレクトリで一覧でき、依存の向きを機械的に確かめる土台になる。
- 接頭辞を外すことで、ディレクトリと名前の重複がなくなる。
- 移動と import の書き換えを codemod で機械的に行えば、量が多くても誤りが入りにくく、`git mv` で履歴も辿れる。
- 1 件ずつ移して検証することで、問題が出たときの範囲を小さくできる。

## 5. 承認

| 項目     | 内容                                                                   |
| -------- | ---------------------------------------------------------------------- |
| 決定者   | 利用者（PO）                                                           |
| 決定日   | 2026-10-16                                                             |
| 承認方式 | orchestrator との会話で、推奨の 8 点を「推奨でお願いします」として承認 |
| 証跡     | orchestrator との会話（2026-10-16）                                    |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------------- |
| 影響範囲   | `src/` の全ファイル、`tests/src/`、`dist/` のパスを参照する処理と設定、設計書とガイドの `src/...` のパス |
| 必要な対応 | 決定後に、移動の codemod と機能ごとの移動、依存の向きの規則の todo を起票する                            |
| 追跡先     | 決定後に起票する todo                                                                                    |

## 7. 関連ドキュメント

- [[prj-0001:pjr-y8p9-large-source-files-split]]: ファイルが増えた分割。
- [[prj-0001:pjr-zm1k-agent-members-model-alias]]: 本件の後に実装する。
