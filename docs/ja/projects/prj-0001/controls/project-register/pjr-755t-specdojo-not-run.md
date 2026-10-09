---
specdojo:
  id: prj-0001:pjr-755t-specdojo-not-run
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: high
  owner: DEV
  registered_at: "2026-10-09T03:54:26Z"
---

# PJR-755T 適用外の検査の判定が specdojo のサブコマンドを誤って反証し、not_run の記録も救えない

## 1. 課題内容

公開物の試用（2026-10-09）で、codex は catalog_path のない project の npx specdojo catalog validate を理由付きの not_applicable と記録したが、specdojo が依存にあるため A0NE の反証が block した。claude（sonnet）は未導入の prettier と catalog validate を not_run と記録して止まった。specdojo のサブコマンドは設定で適用条件を判定し、機械的に適用外と分かる not_run は runner が適用外として扱う方式を検討する。

## 2. 影響範囲

| 観点         | 影響                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------- |
| スコープ     | `src/exec-reporter.ts` の executor の検証の機械の判定、exec plan の共通規約、exec の案内文書、CHANGELOG |
| スケジュール | v0.3.0 の公開の判定基準 3・4 を止める                                                                   |
| コスト       | 成果物が正しくても、利用者の最初の exec が waiting になる                                               |
| 品質         | 規約どおりに記録した agent も、規約に従わない agent も止まる                                            |
| 関係者       | exec を使う利用者（provider を問わない）                                                                |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                         |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | A0NE の反証が `npx <package>` の依存の有無だけを見て、`specdojo` のサブコマンドの適用条件（設定）を見ていない。また、適用外の判定を agent の記録に頼っている |
| 対応策   | 2026-10-09 に利用者が推奨案を採用した。適用外の判定を runner の機械の判定へ寄せる。下記の「完了条件の詳細」のとおり                                          |
| 依存事項 | PJR-A0NE（`not_applicable` の追加）、PJR-44J9（共通規約の適用条件）                                                                                          |
| 完了条件 | 下記の「完了条件の詳細」を満たす                                                                                                                             |

### 3.1. 完了条件の詳細

- `specdojo` の検査（`specdojo <subcommand>`、`npx specdojo <subcommand>`、本リポジトリの `node --import tsx src/specdojo.ts <subcommand>` などの起動形）は、依存の有無で反証しない。サブコマンドごとの適用条件を設定から判定する。少なくとも `catalog validate` は、対象 project に `catalog_path` が設定されていなければ適用外とする。適用条件を判定できないサブコマンドは、従来どおり agent の記録に従う。
- executor が `not_run` と記録した検査も、次のいずれかで機械的に適用外と分かる場合は block の理由にせず、適用外として result の申し送りへ出す（「適用外の検証（runner の判定）」などと区別が分かる表記にする）。
  - `npx <package>` で、`<package>` が `package.json` の `dependencies` / `devDependencies` にない。
  - `npm run <name>`（`npm test` などの短縮形を含む）で、`<name>` が `package.json` の scripts にない。
  - `specdojo` のサブコマンドで、上記の適用条件を満たさない。
- 機械的に適用外と分からない `not_run` は、従来どおり block する（委譲した検査の扱い PJR-979N・PJR-SDWF は変えない）。
- `not_applicable` の申告を、script や依存が存在することで反証する A0NE の判定は、`specdojo` の検査を除いて保つ。
- unit test で、次の場合をそれぞれ確かめる。
  - `catalog_path` のない project の `npx specdojo catalog validate --project <id>` の `not_applicable` と `not_run` は block しない。
  - `catalog_path` のある project では block する。
  - 未導入の `npx prettier` の `not_run` は block しない。
  - 導入済みの `npx prettier` の `not_run` は block する。
- 共通規約と exec-config-guide・exec-operation-guide に、runner が機械的に判定する範囲を書く。CHANGELOG の v0.3.0 の A0NE の項目に追記する。
- `npm run check` が通る。

## 4. 対応結果

- runner の検証判定へ、npm script の不在、`npx` package の未導入、SpecDojo サブコマンドの設定上の適用条件を判定する共通処理を追加した。
- `catalog validate` は `specdojo` の導入有無ではなく対象 project の `catalog_path` で判定する。`catalog_path` がなければ理由付きの `not_applicable` と `not_run` の双方を block せず、設定済みなら双方を block する。適用条件が未定義または設定から判定できない SpecDojo サブコマンドの `not_run` は従来どおり block する。
- 機械的に適用外と確定した `not_run` は edit result の申し送りへ「適用外の検証（runner の判定）」として理由とともに出すようにした。
- 未導入／導入済み Prettier と `catalog_path` の有無を組み合わせた unit test、runner 判定による申し送りの描画 test を追加した。
- 共通規約、exec 設定ガイド、exec 運用ガイド、CHANGELOG を新しい判定範囲に合わせて更新した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-p8tk-release-stabilization-criteria]]（公開の判定基準）
