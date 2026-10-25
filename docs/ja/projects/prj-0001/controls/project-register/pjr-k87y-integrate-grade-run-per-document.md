---
specdojo:
  id: prj-0001:pjr-k87y-integrate-grade-run-per-document
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  difficulty: medium
  owner: indie
  registered_at: "2026-10-25T14:16:35Z"
  completed_at: "2026-10-25T21:39:12Z"
  conclusion: 単一文書gradeをCLI本体へ統合し、配布版・実agent評価・レビュー前grade・runner統合後の動作を確認した。
---

# PJR-K87Y gradeの単一文書評価パイプライン（run-per-document.sh相当）をspecdojoコマンド本体へ統合する

## 1. 概要

exec run のレビュー前 grade 実行（`ensureReviewGrade`）が外部スクリプト `tools/grade/run-per-document.sh` に依存しているため、`specdojo grade run` サブコマンドとして CLI 本体へ統合する。あわせて今回のマルチリポジトリ運用で確認された関連課題（1. `ensureReviewGrade` から grade plan -> agent run -> grade apply のネイティブ実行とエージェント自動選択/引き継ぎ、2. `dist/grade/targets.js` の `project.repos` マルチリポジトリ相対パス `../` 許容、3. ワークツリー分岐前の grade 結果/criteria サイドカーのチェックポイント対象化、4. `exec scaffold --project` 時の `pm-review-viewpoints.yaml` 参照先 `standards/` -> `defaults/` 修正および `viewpoints_path` 未設定時の `specdojo:pm-review-viewpoints` フォールバック、5. `xrp-*-template.md` の `done_criteria` 表で発生する markdownlint MD060 警告の解消）を解消する。

## 2. 完了条件

- npm package から `npx specdojo grade run` を使え、少なくとも `target`（kata / deliverable）、kata の `kind`、対象文書の `path`、`run-id`、`dry-run`、1 段構成と中断後の再開を扱える。`grade list`・`grade plan`・agent 実行・`grade apply` の連携で評価結果のサイドカーを生成し、同じ run の完了済み段を再適用しない。agent の選択は名簿に従い、実際の actor を記録する。
- `ensureReviewGrade` が本体リポジトリ専用の `tools/grade/run-per-document.sh` の存在を前提にせず、CLI 本体の grade 実行経路を使う。評価が最新の場合は既存結果を使い、失敗時は対象文書・理由を結果へ残す。
- 宣言済み `project.repos` の対象について、grade の対象パスが project の基準ディレクトリから `../` を含む場合も正しく解決する。宣言外のリポジトリや対象外のパスを許さないことをテストで確かめる。
- exec の worktree を作る前に、grade 結果と criteria サイドカーの必要な変更を checkpoint に含める。worktree から grade を参照・更新しても既存結果を失わないことを検証する。
- `exec scaffold --project` は project の `viewpoints_path` に観点の差分雛形を生成し、未設定時は `specdojo:pm-review-viewpoints` を参照する。存在しない `standards/` のパスを生成しない。
- `xrp-review-*-template.md` の `done_criteria` の表を Markdown lint の MD060 に適合させる。変更したテンプレートから生成した文書でも lint が通る。
- `grade` と `exec` の関連テスト、`npm run typecheck`、`npm run lint:ts`、`npm run lint:md`、親の検証を通す。空のリポジトリに `npm pack` の tarball を導入して `grade run` が利用できることを確かめる。runner の変更は統合後に実際の `exec run --register` でも確認する。
- CHANGELOG は `Unreleased` に記載し、公開済みの版を変えない。保護設定の変更が必要なら個票の対応結果と報告の `handoff` に案を残し、反映の承認を待つ。実施内容・検証結果・残課題は個票の対応結果に記録する。

## 3. 作業内容

| No  | 作業                                                       | 担当  | 状態       | メモ                                                  |
| --- | ---------------------------------------------------------- | ----- | ---------- | ----------------------------------------------------- |
| 1   | grade の単一文書パイプラインを CLI に統合する              | indie | done       | 単段・再開・実体 actor の保存を実装                   |
| 2   | review 前 grade と複数リポジトリのパス解決を対応する       | indie | done       | package 内 CLI の起動と宣言済み製品パスの解決         |
| 3   | サイドカーの checkpoint と観点 scaffold を修正する         | indie | done       | 分岐・統合時の保持、共通観点へのフォールバック        |
| 4   | review template の MD060、配布版と runner の動作を確かめる | indie | 確認引継ぎ | 配布版検証済み。親検証と統合後の実 agent 確認へ引継ぎ |

## 4. 対応結果

### 実施内容・成果物

- `src/grade/command-run.ts`・`run.ts` を追加し、対象探索、文書ごとの plan、agent 実行、marker の機械変換、grade apply を CLI 本体で連携した。kata / deliverable、`--kind`、繰り返しの `--path`、`--run-id`、`--dry-run`、単段、再開を扱う。選択は run ごとに固定し、文書・観点・比較リファレンス・完了条件・突き合わせ先の変更と結果の置換を検出する。apply 直後の中断も保存済み評価日時と実体 actor で復旧し、完了段を再適用しない。project 単位の排他制御と失敗理由の保存を追加した。
- `src/exec/agent-plan.ts` に既存の `agent run` の実行機能を共通化した。`src/shared/agent-plan.ts` は実行機能の型だけを定義し、`src/specdojo.ts` から grade へ実装を渡すことでモジュールの依存方向を維持する。名簿の有効な review executor（または旧形式 review agent）を priority 順に選び、別名を実体名へ解決する。`src/review/grade.ts` と schedule の準備処理は同じ package の `grade run` を使い、選択した actor と起動設定を引き継ぐ。`--exec-defaults` の CLI 引数も実行処理へ明示的に渡す。最新結果を再利用し、失敗時は対象文書と理由を review plan に記録する。
- `src/grade/targets.ts` と plan / apply / pipeline state / inspection の関連処理を更新した。宣言済み `project.repos` の `../` を解決し、宣言外・パス逸脱・範囲外 symlink を拒否する。現在選択中の project と `--project` が異なる場合も、対象と比較リファレンスを指定した project の宣言で解決する。pipeline state の schema も製品リポジトリの相対パスに対応した。
- `src/exec/grade-checkpoint.ts` と schedule / register / worktree の準備・再開・統合処理を更新した。grade の results / criteria / pipeline の変更と削除を checkpoint に含める。分岐後に root で更新された同じサイドカーは、統合前に差分を検出して上書きを止める。exec branch が変更しない別文書の grade は root に保持したまま統合する。
- `src/exec/commands.ts`・`project.ts` と grade の観点解決を更新した。scaffold は `defaults/pm-review-viewpoints.yaml` から差分雛形を生成し、`viewpoints_path` 未設定時は同梱の `specdojo:pm-review-viewpoints` を参照する。
- review plan の 9 テンプレートの完了条件表を compact 形式にそろえた。MD060 を無効化せず、テンプレートと展開後の表の検査を追加した。grade / review / scaffold / checkpoint の回帰テスト、[[specdojo:command-reference|コマンドリファレンス]]、[[specdojo:exec-operation-guide|exec 運用ガイド]]、[[specdojo:review-guide|レビューガイド]]、`CHANGELOG.md` の `Unreleased` を更新した。

### 検証結果

- `npm run build`、`npm run check:src-imports`、変更ファイルの Prettier 整形、`git diff --check` を実行した。hook の catalog 検査と `register build --project prj-0001` も実行した。
- `npm pack --ignore-scripts --pack-destination tmp --cache tmp/pjr-k87y-npm-cache --json` の tarball を空の利用先ディレクトリへ展開し、実行時依存は既存のローカル導入を参照させて、配布版 CLI の `grade run --help` と dry-run を確認した。固定応答 adapter を使い、導入した package の native pipeline で実体 actor、サイドカー生成、完了段のスキップ、apply 直後の中断からの復旧、現在選択中と異なる project の製品リポジトリの評価・完了条件サイドカー・失敗後の再開、パス逸脱・symlink の拒否を確認した。開発用シェルと `src/` は tarball に含まれない。
- 製品リポジトリを指す `../product/doc.md` の未完了 state を `npm run validate:schema:file` で検査した。`catalog validate --project prj-0001` は成功した（既存の未作成成果物に対する警告あり）。
- unit / integration test、TypeScript lint・型検査、Markdown・frontmatter lint、schema の全件検査は、指定された親 runner の検証に委ねる。executor は重複実行していない。
- 再開時に前回の親検証ログを確認し、共通モジュールから exec への依存方向違反、grade サブコマンド一覧の期待値、完了条件表の区切り行の期待値を修正した。起動設定引数の受け渡しと、現在選択中と異なる project の製品パスを扱う回帰テストも追加・拡充した。これらのテストの実行結果は今回の親検証で確定する。

### 申し送り

- 統合後、[[prj-0001:pm-orchestrator-playbook|オーケストレーター運用メモ]] に従い、PJR-JSEY の確認対象へ PJR-K87Y を追加し、実際の `exec run --register PJR-JSEY` で start から review、実体 actor の記録、checkpoint と統合を確認する。sandbox で実 agent CLI の起動と利用枠消費を伴う確認はできないため、`requires_human` として引き継ぐ。
- 配布版の実 agent による `grade run` と review 前 grade の通し実行はホスト側で確認する。この sandbox では Node の子プロセス起動が `EPERM` となるため、固定応答 adapter により評価・保存・再開を検証した。クリーンな環境での npm による依存解決・導入もホスト側で確認する。親 runner が関連テストと静的検査を実施する。
- ネイティブ経路は単段と機械 reporter を対象とする。開発用シェルの実験的な 3 段構成は移植せず、日本語 finding の表示用翻訳は既存の `translation-plan` / `localize` を利用する。保護設定の変更は不要である。

### 統合後の確認（2026-10-26）

- 再開後の `PJR-K87Y` の親検証 7 件（`lint-ts`・`lint-fm`・`lint-md`・`test-integration`・`validate-schema`・`typecheck`・`test-unit`）はすべて `passed` となり、統合 commit `1d6e58f4b` まで完了した。保護設定の変更はなかった。
- 統合後の `PJR-JSEY` は start から review、親検証 7 件、統合 commit `c1244c193` まで通った。event の実体 actor は `sol-executor` だった。
- 一時 worktree で `ntp-rulebook.md` 1 文書を実 agent `sol-review-executor` で評価し、grade サイドカーに actor・結果・content hash が保存されたことを確認した。同じ run-id の再実行は `resumed complete` と表示され、再評価しなかった。対象文書への評価結果 `needs-work` は文書品質の判定であり、CLI の実行失敗ではない。
- 同じ一時 worktree の評価用 fixture で `ensureReviewGrade` を呼び、同梱 CLI 経由の実 agent 評価が `executed`、結果保存後の再呼び出しが `skipped` となることを確認した。grade の生成物は一時 worktree に隔離した。
- `npm pack` の tarball を空の利用先へ `npm install --offline` で導入し、その利用先で `npx specdojo grade run --help` が起動した。

## 5. 関連ドキュメント

- [[specdojo:command-reference]]
- [[specdojo:exec-operation-guide]]
