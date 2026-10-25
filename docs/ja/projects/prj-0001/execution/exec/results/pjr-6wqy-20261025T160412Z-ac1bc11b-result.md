---
specdojo:
  id: prj-0001:xer-pjr-6wqy-20261025t160412z-ac1bc11b
  type: exec-result
  task_id: PJR-6WQY
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-6wqy-20261025T160412Z-ac1bc11b-plan.md
  started_at: "2026-10-25T16:04:12.676Z"
  completed_at: "2026-10-25T16:30:40.249Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- カタログ未登録の成果物であっても、個票での明示指定や既存文書の frontmatter を辿ることで `fully-guided` 等の各種 plan を生成できる機能を実装した。
- 個票の frontmatter に `--target-path` (`target_path`) および `--target-rulebook` (`target_rulebook`) オプションを導入し、対象成果物を明示的に指定可能にした。
- カタログなしの状態における `bootstrap`, `finalize`, `retrofit` 等の各 plan 生成ロジックを実装し、命名規則に基づいた未作成候補の導出や既存文書の対象化を実現した。
- 仕様変更に伴い、Schema 定義（`register-item-frontmatter.schema.yaml`, `register-events.schema.yaml`）、各種ガイド、コマンドリファレンスを更新した。
- 単体テスト 253 件および統合テスト 8 件が成功し、既存のカタログ経由の互換性と新規機能を検証済みである。

## 2. 変更ファイル

- `CHANGELOG.md`: カタログなし成果物対応の変更履歴を追加。
- `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md`: カタログなし成果物のライフサイクルに関する記述を更新。
- `docs/ja/specdojo/guides/quick-start-guide.md`: クイックスタートガイドにカタログなしでの利用手順を追加。
- `docs/ja/specdojo/guides/ryu-guide.md`: 運用ガイドにカタログレスアプローチの記述を追加。
- `docs/ja/specdojo/references/command-reference.md`: 個票登録時の `--target-path` および `--target-rulebook` オプションの説明を追加。
- `docs/ja/specdojo/rulebooks/pjr-rulebook.md`: 個票（PJR）の登録ルールを更新し、新オプションを定義。
- `docs/specdojo/schemas/v1/register-events.schema.yaml`: 対象指定の変更イベントを許容するようスキーマを更新。
- `docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml`: 個票 frontmatter に `target_path` と `target_rulebook` フィールドを追加。
- `src/exec/plans-core.ts`: カタログなし状態での plan 生成コアロジックを実装。
- `src/exec/plans-generation.ts`: 各種 guided plan の生成ロジックをカタログレス対応に拡張。
- `src/exec/register.ts`: 個票登録時の対象解決ロジックを実装。
- `src/register/approach.ts`: カタログレスアプローチの判定および解決処理を実装。
- `src/register/command-types.ts`: 登録コマンドの型定義に新オプションを追加。
- `src/register/core.ts`: 個票のコア処理を更新。
- `src/register/create-commands.ts`: 個票作成コマンドに新オプションの処理を追加。
- `src/register/events.ts`: イベント生成ロジックをカタログレス対応に更新。
- `src/register/item.ts`: 個票アイテムのモデルを更新。
- `src/catalog/document-target.ts`: 成果物ターゲットの解決ロジックを拡張。
- `src/register/deliverable-target.ts`: カタログ外の成果物ターゲット定義を実装。
- `tests/src/exec/catalogless-register.integration.test.ts`: カタログなしでの plan 生成に関する統合テストを新規作成。
- `tests/src/register/catalogless-target.test.ts`: カタログなし成果物のターゲット解決に関する単体テストを新規作成。

## 3. 申し送り

- `--target-path`／`target_path` と `--target-rulebook`／`target_rulebook` を採用した。対象成果物の指定であることを明示し、個票自身の `specdojo.rulebook` と区別するため。既存文書と明示指定の不一致は拒否する。カタログ登録済みの対象は従来の宣言を優先し、未登録の対象は両指定がある場合だけ補完する。個票の対応結果にも記録済み。
- カタログなしの bootstrap は既存 rulebook を拒否する。共有規約の意図しない改変を防ぐため。`&lt;authority&gt;:&lt;stem&gt;-rulebook` から同じ名前部分の recipe・sample・template ID を導出し、`docs/ja/specdojo/&lt;kind&gt;s/&lt;authority&gt;/&lt;stem&gt;-&lt;kind&gt;.md` を未作成候補とする。命名の再現性を保つための判断で、個票にも記録済み。
- カタログなしの完了基準は個票の完了条件と rulebook。finalize系は既存文書だけを対象にし、bootstrap-finalizeでは複数sampleを含むkata一式を列挙する。retrofitの実装調査パスは個票に明記する運用とした。個票にも記録済み。
- 統合後、orchestratorがPJR-JSEYで実 agentによる `exec run --register` を確認する。全体の型・lint・単体・統合・schema検証は指定どおり親 runnerへ委譲。実装上の未決事項と保護設定の変更案はない。
- 人の確認が必要: `npx specdojo exec run --project prj-0001 --register PJR-JSEY --worktree --executor-by claude-executor`（統合後にorchestratorが実agentで確認する。sandbox内では実agentの起動・使用枠消費を伴う検証を実施しない。）

## 4. 進め方

カタログ不在時でも成果物を特定できるよう、個票 frontmatter への明示的なパス・ルールブック指定 (`target_path`, `target_rulebook`) を導入し、これを基に plan 生成ロジックを拡張した。bootstrap 時には命名規則に基づいた候補導出を行い、finalize 時には既存文書の探索を行うことで、カタログ依存を排除した成果物作成フローを実現した。
