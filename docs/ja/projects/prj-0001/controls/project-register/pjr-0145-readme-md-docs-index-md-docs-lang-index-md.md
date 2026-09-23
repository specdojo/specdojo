---
specdojo:
  id: prj-0001:pjr-0145-readme-md-docs-index-md-docs-lang-index-md
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: PO
  due_on: "2026-10-31"
  completed_at: "2026-09-05T13:53:27Z"
  conclusion: README と docs 配下 index の責務を分離し、重複4節を参照で解消した。英語版は未翻訳であることと日本語版への導線を明示する構成にした。
---

# PJR-0145 README.md / docs/index.md / docs/`<lang>`/index.md の責務再整理と記述見直し

## 1. 概要

`README.md`、`docs/index.md`、`docs/<lang>/index.md` の役割分担を整理し、記述内容を見直す。

現状は `README.md` と `docs/ja/index.md` が同じ内容を別々の表現で持っており、二重管理に
なっている。片方を更新しても、もう片方は追従しない。

## 2. 着手時の状況

### 2.1. 規模と読者

| ファイル           | 行数 | VitePress  | 主な読者                          |
| ------------------ | ---- | ---------- | --------------------------------- |
| `README.md`        | 64   | **対象外** | GitHub の閲覧者、リポジトリ利用者 |
| `docs/index.md`    | 4    | 対象       | 言語選択のみ                      |
| `docs/ja/index.md` | 81   | 対象       | 文書サイトの閲覧者                |
| `docs/en/index.md` | 3    | 対象       | 未整備（工事中の表示のみ）        |

`README.md` は `.vitepress/config.mts` の `srcExclude: ["*.md", ...]` により走査対象から外れる。
GitHub 上でのみ読まれ、文書サイトには現れない。

### 2.2. 重複している節

`README.md` と `docs/ja/index.md` は次の4節を共有する。

| 節               | README | ja/index             | 状態                   |
| ---------------- | ------ | -------------------- | ---------------------- |
| Quick Start      | あり   | あり                 | 同じ趣旨、表現が異なる |
| ディレクトリ構成 | あり   | 基本ディレクトリ構成 | 見出しも内容も相違     |
| ライセンス       | あり   | あり                 | 差分あり               |
| 著者・問い合わせ | あり   | あり                 | 差分あり               |

Quick Start は導入手順という同じ目的を持ちながら、README は GitHub のテンプレート機能を、
ja/index は `Use this template` とダウンロードの2経路を説明する。片方だけを読んだ利用者が
異なる手順を得る。

### 2.3. 着手時に未整備だった箇所

`docs/en/index.md` は3行で、工事中である旨だけを記す。`docs/index.md` が英語版への導線を
持つため、閲覧者は工事中のページへ到達する。

## 3. 完了条件

- `README.md`、`docs/index.md`、`docs/<lang>/index.md` それぞれの責務が明文化されている。
  どの読者に何を伝えるかを区別する。
- 重複する4節について、正本をどちらに置くかが決まっている。重複を残す場合はその理由が
  示されている。
- Quick Start の手順が README と ja/index で矛盾しない。
- `docs/en/index.md` の扱いが決まっている。整備するか、導線を外すか、工事中である旨を
  明示的に維持するかを判断する。
- `npm run -s lint:md` と `npm run docs:build` が通る。

## 4. 検討事項

- README は VitePress の対象外であり、GitHub でのみ読まれる。文書サイトの閲覧者は README を
  見ない。逆にリポジトリを clone した利用者は文書サイトを開かないことがある。両者へ同じ
  情報が要るのか、役割で分けるのかを決める必要がある。
- 重複を機械的に排除すると、README が薄くなりすぎて GitHub 上での第一印象を損なう恐れがある。
  一方で二重管理は必ず乖離する。転記ではなく参照で解決できるかを検討する。
- 英語版は文書全体の多言語対応と関わる。本項目で `docs/en/index.md` だけを整備しても、配下の
  文書が日本語のままでは利用者の期待とずれる。導線の扱いを先に決めるほうが実務的である。

## 5. 作業内容

| No  | 作業                              | 担当 | 状態 | メモ                       |
| --- | --------------------------------- | ---- | ---- | -------------------------- |
| 1   | 3種のファイルの責務を定義する     | ARC  | done | 各ページの本文に明記       |
| 2   | 重複4節の正本を決める             | ARC  | done | 詳細文書への参照に統一     |
| 3   | Quick Start の手順を統一する      | ARC  | done | Quick Start ガイドを正本化 |
| 4   | `docs/en/index.md` の扱いを決める | ARC  | done | 未整備の状態を明示して維持 |
| 5   | 決定に沿って記述を更新する        | ARC  | done | 4つの入口文書を更新        |
| 6   | lint と docs:build を確認する     | ARC  | done | 整形・検査を実施           |

## 6. 対応結果

- `README.md` は GitHub とパッケージページの入口として、概要、入手方法、詳細文書への導線を担うものとした。
- `docs/index.md` は言語選択だけを担い、英語版が未整備であることをリンク上で明示した。
- `docs/ja/index.md` は日本語文書サイトの入口として、目的別の導線と主な文書領域を示すものとした。
- `docs/en/index.md` は英語版の提供状況を明示するページとして維持し、完全な日本語版への導線を設けた。
- Quick Start の詳細は [[specdojo:quick-start-guide]]、ディレクトリ構成は [[specdojo:docs-structure-guide]] と [[specdojo:directory-layout-reference]]、ライセンス条文は `LICENSE` を正本とした。入口文書には要約と参照だけを置き、重複更新を避けた。
- 残課題はない。

受け入れ時に orchestrator が次を確認した。

| ファイル           | 変更前 | 変更後 | 責務                            |
| ------------------ | ------ | ------ | ------------------------------- |
| `README.md`        | 64 行  | 35 行  | GitHub とパッケージページの入口 |
| `docs/index.md`    | 4 行   | 6 行   | 言語選択と提供状況の明示        |
| `docs/ja/index.md` | 81 行  | 36 行  | 日本語文書サイトの入口          |
| `docs/en/index.md` | 3 行   | 9 行   | 英語版の提供状況の明示          |

- 重複していた4節（Quick Start、ディレクトリ構成、ライセンス、著者）が解消された。両ファイルの
  合計は 145 行から 71 行へ減っている。転記の重複ではなく、詳細を持つ文書への参照で解決して
  おり、検討事項に挙げた「転記か参照か」の判断として妥当である。
- 英語版は「工事中」の一言ではなく、未翻訳であることと日本語版への導線を明示する構成になった。
  `docs/index.md` のリンクにも提供状況を併記している。配下が日本語のまま英語版の体裁だけ整えると
  利用者の期待とずれるという懸念に対し、期待を正しく設定する方向で解いている。
- `lint:md` と `docs:build` が通る。リンク切れも出ていない。

## 7. 関連ドキュメント

- [[specdojo:docs-structure-guide]]: ディレクトリ構成の正本。README との記述が整合する必要がある。
- [[specdojo:waza-guide]]: 導入手順の詳細。Quick Start からの導線になる。
