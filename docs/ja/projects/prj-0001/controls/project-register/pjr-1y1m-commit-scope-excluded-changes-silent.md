---
specdojo:
  id: prj-0001:pjr-1y1m-commit-scope-excluded-changes-silent
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  registered_at: "2026-11-13T21:50:32Z"
  completed_at: "2026-11-16T13:30:17Z"
  conclusion: PJR-160D の停止の仕組みを保ち、止めた理由に対象外のファイルをすべて残すようにした。kata-wave-1 の 3 つの形を回帰テストで再現した
---

# PJR-1Y1M executor の変更が commit の対象外になっても、統合が黙って進む

## 1. 課題内容

executor が対象外のファイル（カタログ・schema・型のメニュー）を直しても、commit の対象から外れて統合に入らず、develop で検査が落ちてから気づく

## 2. 入力

- 2026-11-14 の kata-wave-1 で 3 回起きた。bes-index のカタログの依存、ifx-index の esil.schema.yaml、型のメニュー（sidebar-config.ts）の直しが統合に入らず、worktree は統合の後に片付けられて直しが消えた
- 型の文書を作るタスクでは、カタログ・schema・メニューも直す範囲に入る。commit の対象をそこまで広げるか、対象外の変更が残ったら統合を止めて知らせる必要がある。commit-scope の「unresolved target doc id」の警告とも合わせて確かめる

## 3. 影響範囲

| 観点         | 影響                                                 |
| ------------ | ---------------------------------------------------- |
| スコープ     | agent の worktree commit・統合・撤去と停止理由の記録 |
| スケジュール | 停止後は対象外変更の確認と統合の再開が必要           |
| コスト       | 既存ガードを利用し、対象を絞った回帰テストを追加     |
| 品質         | commit 対象外の変更が撤去時に失われることを防ぐ      |
| 関係者       | executor、親 runner、統合後の確認を行う運用担当者    |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | schedule 由来の許可リスト外の変更を commit せず、統合・撤去を進めていた。停止ガードは派生タスク PJR-160D で実装済みだが、例外メッセージの対象一覧は先頭 3 件に省略されていた。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 対応策   | PJR-160D の停止方針を維持し、省略による停止理由の欠落を修正する。実際に起きた 3 種類の編集と、4 件以上の未追跡変更を回帰テストへ追加する。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 依存事項 | [[prj-0001:pjr-160d-commit-scope-excluded-changes-fix\|PJR-160D の停止ガード]]を利用する。保護設定の変更は不要。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 完了条件 | 統合の前に commit の対象外の変更（未追跡・未 stage）が worktree に残っていたら、黙って統合しない。止めて対象外のファイルの一覧を `block_reason` に残すか、型の文書のタスクではカタログ・schema・型のメニューを commit の対象に含めるか（または両方）を executor が決める。止めた場合は worktree を片付けず、直しが消えない。kata-wave-1 の 3 件の形（カタログの依存・`esil.schema.yaml`・`sidebar-config.ts`）を回帰テストで再現する。commit-scope の「unresolved target doc id」の警告との関係を確かめて対応結果に記録する。迷った点は executor が決め、決めた内容と理由を個票の対応結果に書き、報告の `handoff` にも書く。`CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く（影響がなければ「なし」、PJR-EPQ3）。保護された設定（`.specdojo/`・`package.json`・`.agents/`・`.claude/`・`.codex/`・`lefthook.yml` など）は変えず、変更が要る場合は案を個票の対応結果と `handoff` に書く。`npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通る。 |

### 4.1. 作業内容

| No  | 作業                                       | 状態 | メモ                                                                                                                              |
| --- | ------------------------------------------ | ---- | --------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 既存修正と完了条件を照合                   | done | PJR-160D の commit 前後・統合前・撤去時・再開時のガードを確認                                                                     |
| 2   | 停止理由の対象一覧を修正                   | done | 例外の先頭 3 件への省略を削除                                                                                                     |
| 3   | kata-wave-1 と停止・再開の回帰テストを追加 | done | 3 種類の追跡済みファイルの未 stage 編集と、未追跡 4 件の停止理由・統合再開を検証する fixture を追加。テスト実行は親 runner が担当 |
| 4   | 検証と申し送りを記録                       | done | executor の検査結果は下記、親検証の実測結果は runner の evidence に記録                                                           |

## 5. 対応結果

### 5.1. 実施内容と判断

- [[prj-0001:pjr-160d-commit-scope-excluded-changes-fix|PJR-160D]]で、対象外変更を残した agent の commit・統合・通常の撤去を止め、worktree を保持するガードが実装済みだった。本件でも、型の周辺ファイルの許可範囲は広げず、停止して確認する方針を採用する。カタログ・schema・メニューは他の成果物に影響するため、checkpoint 済みの `targets` による個別許可か別タスクで扱う。
- `UncommittedChangesError` の対象一覧が先頭 3 件へ省略される点を修正した。これにより、4 件目以降も runner が記録する `block_reason` の元メッセージへ渡る。登録簿の理由欄には既存の長さ制限があるため、全パスは引き続き `integrate.log` と result の申し送りにも残す。
- `tests/src/exec/worktree-ops.integration.test.ts` に、カタログの `depends_on`、`esil.schema.yaml`、`sidebar-config.ts` の追跡済みファイルの編集を追加した。commit・統合・撤去が止まり、統合先の内容と HEAD が変わらず、worktree の編集と停止ログが残ることを検証する。
- `tests/src/exec/pipeline-e2e.integration.test.ts` の再開テストを未追跡 4 件へ拡張した。`block_reason` に全 4 パスが残ること、確認後は executor / reporter を再実行せず統合だけを再開し、成功時に worktree が撤去されることを検証する。
- `unresolved target doc id (no individual path; approach directory permissions still apply)` は doc-index / catalog で個別パスを解決できなかった警告であり、approach の型ディレクトリ許可とは独立している。PJR-160D の bootstrap と全 4 種の maintenance の既存テストがこの関係を検証している。新しい未 stage 編集のテストも未解決 ID を持つ bootstrap とし、警告に関係なく周辺ファイルの変更では停止することを検証する。

### 5.2. 検証

- Prettier、hook と同じ `node --import tsx tools/catalog-validate-if-configured.mjs`、`npm run validate:history-links`、`node --import tsx src/specdojo.ts register build --project prj-0001`、`git diff --check` が通過した。カタログ検証には既存の re-export と未作成文書に関する警告があるが、終了コードは 0。登録簿の生成物は commit 対象外である。
- `typecheck`、`lint:ts`、`test:unit`、`test:integration`、Markdown・frontmatter・図・schema の検証は、指定済みの親 runner が実行する。executor では対象限定版も実行しないため、新規回帰テストの成功は親 runner の evidence で確認する。

### 5.3. 申し送り

- 未解決の設計判断・保護設定の変更提案はない。result は reporter / runner が記入する。
- 統合後は[[prj-0001:pm-orchestrator-playbook|運用メモ]]に従い、PJR-JSEY の対象へ PJR-1Y1M を加え、実 agent の start から review までを確認してから close する。実 agent の起動を伴うため、この executor では実行しない。

### 5.4. CHANGELOG に書く事項

- 不具合修正: executor の commit 対象外の変更による停止理由に、4 件目以降の対象パスも含める。対象外変更による統合・撤去の停止と worktree 保持は PJR-160D の記載と合わせてリリース時に集約する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-160d-commit-scope-excluded-changes-fix|派生修正 PJR-160D]]
- [[specdojo:exec-config-guide|exec 設定ガイド]]
- [[specdojo:exec-worktree-guide|exec worktree ガイド]]
- [[prj-0001:pm-orchestrator-playbook|prj-0001 のオーケストレーター運用メモ]]
