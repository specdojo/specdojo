---
specdojo:
  id: prj-0001:pjr-7rz4-project-move-guide
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: medium
  owner: sol-executor
  registered_at: "2026-11-03T05:01:37Z"
  due_on: "2026-12-31"
  block_reason: "parent validation failed: lint-md, test-unit"
  derived_from:
    - PJR-8HCB
  autopilot: approved
  commit_type: docs
  commit_scope: guides
---

# PJR-7RZ4 project を別リポジトリへ移す手順のガイドを書く

## 1. 概要

project を管理用の別リポジトリへ移す手順（履歴の切り出し、設定の写し、external_projects の宣言、Kata の版の固定、文書サイトから外す）をガイドに書く

## 2. 入力

- 利用者は、prj-0002（specdojo-lp の管理）を将来、管理用の別リポジトリ（例: specdojo-lp-specdojo）へ移す可能性を考え、安全に移すための機能を用意することを求めた。全自動の移行コマンドは後回しにし、読むだけの点検・手順のガイド・リポジトリをまたぐリンクの 3 件に分けると判断した（2026-11-03）
- 手順に含める項目: git subtree split などで `base_path` の履歴だけを新しいリポジトリへ切り出す（共有の履歴は書き換えない）、specdojo.config.json の project の項目と .specdojo の名簿・exec-defaults を写して元から外す、移した後も互いに起票できるよう `external_projects` に別名を宣言する、Kata を npm パッケージから参照して版を固定する、元のリポジトリの文書サイトのサイドメニューから外す、登録簿の ID と commit の Refs は project の ID を変えなければそのまま使える（2026-11-03）
- 読むだけの点検（同時に起票する todo）と、リポジトリをまたぐリンクの書き方（同時に起票する todo）を手順の中で使う（2026-11-03）

## 3. 完了条件

- project を管理用の別リポジトリへ移す手順のガイドを、`docs/ja/specdojo/guides/` に新しく書いている（ファイル名と id は [[specdojo:id-and-file-naming-standard]] と既存のガイドにならう）。文書サイトの sidebar とガイドの一覧に足している。
- 手順に、個票の入力にある 5 つを含めている。
  - `git subtree split` などで、project の `base_path` の履歴だけを新しいリポジトリへ切り出す（共有の履歴は書き換えない）。
  - `specdojo.config.json` の project の項目と、`.specdojo` の名簿・exec-defaults を写し、元から外す。
  - 移した後も互いに起票できるよう、`external_projects` に別名を宣言する。
  - Kata を npm パッケージの版で固定する。
  - 元のリポジトリの文書サイトから外す。
- 各手順に、前提・実行するコマンド・確かめ方・戻し方を書き、取り返しのつかない操作（履歴の切り出し・元から消す）の前に確かめる点を明示している。
- 読むだけの点検（PJR-9XEG）とリポジトリをまたぐリンクの書き方（PJR-66ER）はまだできていないため、手順の中では「用意されたら使う」と書き、今は手で確かめる方法を示す。
- コマンドと設定の項目名が、今の CLI の help と設定のリファレンスに合っている。prj-0002 を例にするが、実際のリポジトリは変えない。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                          | 担当     | 状態 | メモ |
| --- | --------------------------------------------- | -------- | ---- | ---- |
| 1   | 移す手順のガイドを書き、一覧と sidebar に足す | executor | done | -    |

## 5. 対応結果

### 5.1. 実施内容

- `docs/ja/specdojo/guides/project-move-guide.md`（ドキュメント ID: `specdojo:project-move-guide`）を新設した。
- 個票の入力にある 5 つの手順（`git subtree split` による履歴切り出し、Kata の npm 版固定、`specdojo.config.json` 等の設定移行と元リポジトリからの削除、`external_projects` による相互起票連携、元リポジトリの文書サイトからの除外）を、前提・実行コマンド・確かめ方・戻し方・取り返しのつかない操作の前の確認ポイントとともに網羅して記述した。
- 準備中の機能「読むだけの点検（PJR-9XEG）」および「リポジトリをまたぐリンクの記述（PJR-66ER）」について、「用意されたら使う」と明記し、現時点での手動点検・代替記法を明示・整理した。
- `packages/docs-site/.vitepress/sidebar-config.ts` のサイドバー「ガイド」セクションに `guide("プロジェクト移行", "project-move-guide")` を追加した。
- `docs/ja/specdojo/guides/specdojo-overview-guide.md` の第 8 章「目的別の次の読み物」の表に本ガイドへのリンクを追加した。

### 5.2. 成果物

- `docs/ja/specdojo/guides/project-move-guide.md`
- `packages/docs-site/.vitepress/sidebar-config.ts`
- `docs/ja/specdojo/guides/specdojo-overview-guide.md`
- `docs/ja/projects/prj-0001/controls/project-register/pjr-7rz4-project-move-guide.md`

### 5.3. 迷った点・決めた事項（executor 判断）

- **ガイドの ID とファイル名**: 命名標準にならい `specdojo:project-move-guide` / `project-move-guide.md` とし、H1 を `# プロジェクト移行ガイド` とした。
- **サイドバーの配置位置**: `sidebar-config.ts` の「ガイド」内「技で回す」グループの末尾に、既存の運用ガイドと並列で `guide("プロジェクト移行", "project-move-guide")` を配置した。
- **新リポジトリ内の配置構造**: `git subtree split` 直後はファイル群がルートに展開されるが、SpecDojo の標準ディレクトリ配置および ID とファイルパスの整合性を保つため、新リポジトリでも `docs/ja/projects/prj-0002` 配下へ再配置する手順を標準とした。
- **外部起票の別名**: 元リポジトリ側では `specdojo-lp`、新リポジトリ側では `specdojo-core` とし、直感的に識別できる別名例を示した。

### 5.4. CHANGELOG に書く事項

- 区分: 追加
- 行文案: `docs: project を別リポジトリへ移す手順と安全確認をまとめたプロジェクト移行ガイドを追加`

### 5.5. 残課題

- PJR-9XEG（読むだけの点検）および PJR-66ER（リポジトリをまたぐリンクの書き方）の実装完了後、本ガイドの該当節を標準機能の記述へ更新する。

## 6. 関連ドキュメント

- `[[specdojo:project-move-guide|プロジェクト移行ガイド]]`
- `[[specdojo:specdojo-overview-guide|全体概要ガイド]]`
- `[[specdojo:specdojo-config-reference|SpecDojo設定リファレンス]]`
- `[[specdojo:branch-workflow-guide|ブランチワークフローガイド]]`
- `[[specdojo:id-and-file-naming-standard|ドキュメントIDおよびファイル命名標準]]`
