---
specdojo:
  id: prj-0001:pjr-8nwr-grade-result-path-repo-collision
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-27T13:26:19Z"
---

# PJR-8NWR grade の結果ファイルが別リポジトリの同じ ID の文書で重なる

## 1. 課題内容

grade の結果は results/`<文書 ID>.yaml` に保存され、ID はプロダクトリポジトリの成果物では project の修飾を持たない。project.repos の複数のリポジトリや本リポジトリに同じ ID の文書があると、結果が黙って上書きされ、plan も別の文書の前回の結果を読む。repos のリポジトリの文書は results/`<repo 名>`/`<ID>.yaml` に分けて保存する。

## 2. 影響範囲

| 観点         | 影響                                                                                                                                                                        |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | grade の結果の保存と読み込み（`src/shared/grade-result.ts` の `gradeResultPath`、`grade plan` の前回結果の読み込み、`grade apply`、`grade run`、結果を読む dashboard など） |
| スケジュール | 影響なし。現時点で重なった事例は確認していない                                                                                                                              |
| コスト       | 保存先の分岐と、結果を読む側の追従、テストの追加                                                                                                                            |
| 品質         | 重なると、後から評価した文書の結果で前の結果が黙って上書きされ、plan が別の文書の前回の結果を読む                                                                           |
| 関係者       | `project.repos` でプロダクトリポジトリを分けて grade を使う利用者                                                                                                           |

## 3. 対応方針

| 項目     | 内容                                      |
| -------- | ----------------------------------------- |
| 原因     | `原因` を参照                             |
| 対応策   | `対応策` を参照（利用者と合意済みの案 A） |
| 依存事項 | なし                                      |
| 完了条件 | `完了条件` を参照                         |

### 3.1. 原因

- 結果は `<project の execution>/grade/results/<文書 ID>.yaml` に保存され、ファイル名は ID の `:` を `.` に置き換えて作る（`src/shared/grade-result.ts`）。
- [[specdojo:id-and-file-naming-standard]] は、ID の一意を 1 つの `docs/` ルート（SpecDojo Unit）の中でだけ求める。プロダクトの成果物の ID は project の修飾を持たない。
- このため、`project.repos` に宣言した複数のプロダクトリポジトリ、または本リポジトリとプロダクトリポジトリに同じ ID の文書があると、同じ結果ファイルになる。

### 3.2. 対応策

利用者と合意した案 A を採る。

- `project.repos` のリポジトリの文書の結果は、`results/<repo 名>/<文書 ID>.yaml` に保存する。`<repo 名>` は `repos[].name` とし、`--source` の `<repo>:<path>` の表記と揃える。
- 本リポジトリの文書の結果は、今の `results/<文書 ID>.yaml` のまま変えない。

見送った案:

| 案                                       | 見送った理由                                 |
| ---------------------------------------- | -------------------------------------------- |
| ファイル名にパスのハッシュを足す         | 人がファイル名から文書を判別できない         |
| プロダクトの文書に ID の修飾を必須にする | 規約の変更と、利用者の既存の文書の移行が要る |

### 3.3. 完了条件

1. `project.repos` のリポジトリの文書の grade の結果が `results/<repo 名>/<文書 ID>.yaml` に保存され、`grade plan` の前回結果の読み込み、`grade apply`、`grade run` の再開、結果を読むほかの処理（dashboard など）が同じ場所を読む。
2. 本リポジトリの文書の結果の場所は変わらず、既存の結果をそのまま読める。
3. 異なる 2 つの `repos` に同じ ID の文書を置いた fixture で、結果が別々のファイルに保存され、互いを上書きしないことを単体テストで確かめる。
4. `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` と、親の検証が通る。
5. [[specdojo:command-reference]] の grade の結果の保存先の説明を更新する。
6. `CHANGELOG.md` の未公開の版の節に不具合の修正として書く。公開済みの版の節は変えない。

## 4. 対応結果

### 4.1. 作業内容

- `src/shared/grade-result.ts` の文書別パス解決で、対象 project の `repos` と文書の実体パスを照合し、宣言名のサブディレクトリへ保存・参照するようにした。`resolveRepoRoot` を使い、通常の checkout と exec の worktree の両方の配置に対応する。本リポジトリの文書は従来の直下のパスを維持する。
- `grade plan` の前回結果、`grade apply`、インライン grade の移行処理を同じパス解決へ統一した。`grade run` の再開、結果表示・検証・翻訳、review・exec・schedule が使う共通の読み取りも新配置を参照する。dashboard は結果ディレクトリを再帰的に読むようにした。
- `tests/src/grade/repo-results.test.ts` に、本リポジトリと 2 つのプロダクトリポジトリに同じ ID を置く fixture を追加した。保存・再適用時の上書き防止、前回 finding の分離、旧形式の本リポジトリの結果の読み取り、保存先の指定、dashboard、ネストしたリポジトリとパス境界、明示した project と root の選択、exec の兄弟 worktree 配置、インライン grade の移行を検証する。
- `tests/src/grade/run.test.ts` に、同じ ID の 3 文書のうち 1 件が中断しても、再開時は完了済み結果を保持し、失敗した文書だけを再実行するテストを追加した。
- [[specdojo:command-reference|コマンドリファレンス]] に保存先・互換性・旧配置のプロダクト結果の扱いを記載し、[[specdojo:document-metadata-standard|ドキュメントメタデータ標準]] のサイドカー配置も揃えた。`CHANGELOG.md` の未公開版の不具合修正へ PJR-8NWR を追記した。
- 前回の親検証で報告された dashboard の未使用 import を削除した。`grade.test.ts` と `triggers.test.ts` の一時ディレクトリに正規の `.specdojo/specdojo.config.json` を置き、指定した root の設定を読む実装にテストを合わせた。`triggers.test.ts` の旧設定 YAML を JSON に置き換え、実際の設定形式に揃えた。
- 再開後の親検証で失敗した兄弟 worktree のテストは、`api` のパス解決時に `web` が未作成だった。設定の読み込みでは宣言した全リポジトリの存在を検証するため、両方の worktree と文書を作成してから保存先を検証する順序に修正した。

### 4.2. 確認結果と申し送り

- 型検査・TypeScript lint・単体テスト・結合テスト・frontmatter lint・Markdown lint・スキーマの全体検証は、pipeline の親 runner が executor 終了後に実施する。追加した回帰テストも親の単体テストの対象であり、executor 内では重複実行しない。
- 変更した Markdown・TypeScript 全 13 ファイルの Prettier 整形と `git diff --check` は成功した。hook と同じ `node --import tsx tools/catalog-validate-if-configured.mjs` と `node --import tsx src/specdojo.ts register build` も終了コード 0 で成功した。カタログ検証では未作成成果物の `based_on` の検証対象が見つからない警告が出るが、検証エラーはない。登録簿の生成物はコミット対象外である。全体の lint・単体テストの再検証結果は親 runner が追記する。
- 再開時点から存在した runner 管理のイベント YAML の差分についても、`npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/register-events.schema.yaml --data docs/ja/projects/prj-0001/controls/project-register/events/pjr-8nwr.yaml` で検証し、成功した。イベントファイル自体は executor では編集していない。
- 旧配置の直下にあるプロダクトリポジトリの結果は、別文書との取り違えを防ぐため自動では流用しない。既存のプロダクト結果がある利用環境では、新しい run ID で再評価してリポジトリ別の結果を作成する。本リポジトリの既存結果は移動せず引き続き読める。
- 登録簿の行と個票の状態項目は変更していない。親検証の成否を確認してから、runner と人間が後続の状態遷移を行う。

## 5. 関連ドキュメント

- [[specdojo:id-and-file-naming-standard]]
- [[specdojo:command-reference]]
- `src/shared/grade-result.ts`
