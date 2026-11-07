---
specdojo:
  id: prj-0001:pjr-bvs9-plan-conventions-by-reference
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-06T15:05:39Z"
  due_on: null
  block_reason: "parent validation failed: lint-ts, test-integration, test-unit"
  derived_from:
    - PJR-2WC2
  depends_on:
    - PJR-Z0XR
---

# PJR-BVS9 保存する plan の共通の規約を版への参照にする

## 1. 概要

agent に渡す prompt には共通の規約の全文を含めたまま、保存する plan.md の規約の部分を版（ハッシュ）への参照にし、規約の本体は版ごとに 1 つだけ保存する（PJR-2WC2）

## 2. 入力

- PJR-VH8D の決定（2026-11-07 indie）: 実行記録は run 単位のディレクトリ execution/runs/`<出どころ>`/`<項目 ID>`/`<run ID>`/ に plan.md・result.md・evidence.json・ログを置く（R1）。出どころは register・schedule・job。置き場所を決める処理はコードの 1 つのモジュールにまとめる（R2）。exec validate と CI で置き場所を検査する（R3）。ガイドの構成図をモジュールと照らすテストを置く（R4）。grade/results と jobs/ の定義は外に残す。既存は git mv で移し、パスの欄だけ書き換える
- 利用者の決定（PJR-2WC2）: 増え方はログ以外の原因で抑える。全 plan に埋め込む共通の規約（約 3 KB）を減らす（2026-11-06）
- 既存の設計: 共通の規約は plan の本文に断片として注入する。agent の CLI によらず規約が届くのは plan の本文経由だけのため。agent に渡す内容は変えず、保存する plan.md だけを規約の版への参照にする（2026-11-07 indie が承認）

## 3. 完了条件

- agent に渡す prompt には、今までどおり共通の規約の全文が入っている（agent の CLI によらず規約が届く）。
- 保存する `plan.md` では、共通の規約の部分が、規約の版（内容のハッシュ）への参照になっている。規約の本体は版ごとに 1 つだけ、PJR-Z0XR のモジュールが決める場所に保存される。
- plan を読んで prompt を組み立てる処理（`--resume`、reporter、plan を手で渡す `exec run --plan` を含む）が、参照から規約の全文を復元できる。規約の版が見つからないときは、原因が分かるエラーで止まる。
- 既存の plan（規約を埋め込んだもの）も、そのまま読める。
- 単体テストで、保存する plan の参照、prompt の全文、版が欠けたときのエラー、古い plan の読み取りを確かめている。1 件の plan で減った大きさを個票の対応結果に書いている。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` が通り、親の検証（`test-integration` を含む）が通っている。
- CHANGELOG は未公開の版の節に書き、公開済みの版の節を変えていない。
- 保護された設定（`package.json`・`lefthook.yml`・`.github/workflows/`・`.specdojo/` の設定・agent の定義・`.gitignore` が保護されている場合はそれも）を変える必要があるときは、変えずに案を個票の対応結果に書き、pipeline では報告の `handoff` にも書いている。反映は利用者の承認のもと行う。
- 未決の点は executor が決め、決めた内容と理由を個票の対応結果に書き、pipeline では報告の `handoff` にも書いている。

## 4. 作業内容

| No  | 作業                             | 担当 | 状態 | メモ                                               |
| --- | -------------------------------- | ---- | ---- | -------------------------------------------------- |
| 1   | 保存する plan の規約を参照にする | DEV  | done | 共通の保存先と SHA-256 の版を追加                  |
| 2   | prompt で全文を復元する          | DEV  | done | schedule・register・job・再開・手動 plan・reporter |
| 3   | テストを足す                     | DEV  | done | 参照の保存・復元・欠落・改変・旧 plan と CLI 経路  |

## 5. 対応結果

- `src/shared/plan-conventions.ts` に版の保存・検証・復元を追加し、保存先は PJR-Z0XR の `src/shared/run-records.ts` で決める。schedule・register・job の生成時は、共通規約を版への相対リンクに置き換える。同じ内容は上書きせず、並行生成でも完成済みのファイルを公開する。
- plan を読む共通処理から規約を復元し、再開・`exec run --plan`・reporter・trial に当時の全文を渡す。欠落・改変・不正な参照は原因を示して停止する。埋め込み済みの旧 plan は変更せず読み取る。worktree の checkpoint・記録の引き継ぎ・commit 対象に規約を含め、旧配置へ出力した plan の archive 時は相対参照を直す。
- 判断: 規約は `<execution_path>/conventions/<SHA-256>.txt` に保存する。run 間で共有するため run ディレクトリの外に置き、整形によるハッシュの変化を防ぐためプレーンテキストにした。版は mode・schema を解決した注入本文と末尾の改行から計算する。現在のテンプレートへのフォールバックは、過去の指示が変わるため行わない。配置と読み取りの説明は [[specdojo:plan-result-lifecycle-guide|plan と result の扱い]] を更新した。
- 削減量: `generateSinglePlan` で作った freeform の edit plan 1 件は、復元後の 9,297 バイトに対して保存時は 5,835 バイトで、3,462 バイト減った。規約の共有ファイルは 3,643 バイトで、同じ版の次の plan から再利用する。最初の 1 件だけでは共有ファイル分の削減効果は出ない。
- テスト: 単体テストに版の重複防止、edit/review、schema 別の版、復元する全文、欠落・改変のエラー、旧 plan、移動後と archive 後の参照を追加した。手動 plan の CLI テストは参照と埋め込みの両方を対象にし、schedule/register の pipeline と再開の統合テストで executor と reporter へ参照が漏れず全文が届くことを確認する。
- 検証: ビルド、スモーク検証、変更ファイルの Prettier、履歴リンク検査、カタログ検査、register の派生一覧の生成を実施した。カタログの既存文書の移動・re-export に関する警告以外は問題なし。CLI の検証では認証情報を読み込まないよう、一時ラッパーで dotenv の読み込みを無効化した。主要 lint・型検査・単体／統合テスト・schema は指定どおり親 runner に委ねる。
- CHANGELOG は未公開の節だけを更新した。保護設定の変更は不要だった。実 agent CLI の確認は、統合後に PJR-JSEY へ対象を加えて行う。

## 6. 関連ドキュメント

- [[prj-0001:pjr-2wc2-execution-records-growth]]: 増え方の抑制
