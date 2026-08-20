---
specdojo:
  id: prj-0001:pjr-cmyx-exec-dist-parent-validations
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: high
  owner: ARC
  registered_at: "2026-08-20T12:28:52Z"
  due_on: "2026-08-31"
---

# PJR-CMYX exec 実行が古い dist ビルドを使い設定済み parent_validations が実行されない

## 1. 課題内容

specdojo の bin は dist/specdojo.js を指すため、npm run build を再実行しない限り古い挙動で exec run が動く。PJR-STRG の run（2026-08-18）では dist が 2026-08-15 12:33 のビルド（コミット be20ceb2 相当）で、parent_validations 機能を追加した 19eea172（2026-08-16）を含んでいなかった。その結果 exec-defaults.yaml の pipeline.parent_validations: [test-integration] が設定済みにもかかわらず npm run test:integration が実行されず、evidence にも記録が残らなかった。設定した検証が沈黙して省略されるため、恒久対応が必要である。なお docs/ja/specdojo は package.json の files に含まれる配布物であり、利用者環境には src が存在しないため、配布ドキュメントや orchestrator 指示書の呼び出しを tsx 直接実行へ変更する対応は採れない。本件は配布側ではなく開発チェックアウト固有の問題として扱う。

## 2. 影響範囲

| 観点         | 影響                                                                                                                                                                   |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `specdojo` の bin 経由で実行する exec 系コマンド全体と、同じ bin を使う orchestrator の日常操作。当該 dist のビルド時点以降に `src` へ入った変更が実行時に反映されない |
| スケジュール | 検証漏れの追試と実行の締め直しが発生する。PJR-STRG では reporter 段の手動処置と `npm run test:integration` の追加実行が必要になった                                    |
| コスト       | 追加の外部コストは発生せず、影響は調査・再実行に要する作業時間に限られる                                                                                               |
| 品質         | 設定済みの検証が沈黙して省略され、未実行のまま success となるため、evidence を根拠とした完了判断の信頼性が下がる                                                       |
| 関係者       | ARC（実装・運用）。exec を実行する運用者、および evidence を根拠に完了を判断するレビュー者                                                                             |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                               |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `specdojo` の bin が `dist/specdojo.js` を指し、当該 dist が `parent_validations` 追加コミット以前のビルドだったため                                                                                                                                                                               |
| 対応策   | dist 実行時に、`src` が存在する開発チェックアウトでのみ dist と `src` の鮮度を比較し、古ければ警告する（exec 系は中断する）。配布環境は `src` が無いため no-op になる。あわせて `src` 変更を伴う merge / checkout 後に `npm run build` を自動実行する                                              |
| 依存事項 | 自動再ビルドの実行位置（lefthook の post-merge / post-checkout か exec cycle routine の先頭か）の決定。鮮度ガードを exec 系で中断とするか警告のみとするかの判断                                                                                                                                    |
| 完了条件 | 開発チェックアウトで古い dist のまま exec を実行した場合に検知され、中断または警告されること。設定済みの `parent_validations` が未実行のまま success にならないこと。`bin`、`files`、配布ドキュメントの呼び出し記法を変更していないこと。再発防止手段が hook または routine に組み込まれていること |

## 4. 対応結果

解決内容:

- CLI 起動時の dist 鮮度ガードを追加した（`src/dist-freshness.ts` / `src/specdojo.ts`）。エントリが `dist/` 配下の `.js` で、同じパッケージルートに `src` がある開発チェックアウトの場合だけ、`src/**/*.ts` と `dist/**/*.js` の最終更新時刻を比較する。
- 古い（または `dist` が無い）場合、`exec` 系サブコマンドは標準エラーへ理由を出して終了コード 1 で中断し、その他のコマンドは警告のみ出して続行する。`SPECDOJO_SKIP_DIST_FRESHNESS_CHECK=1` で無効化できる。配布パッケージは `src` を含まないため判定は no-op になる。
- routine 実行（`specdojo routine run` の非 dry-run）の先頭で、古い dist を自動再ビルドする処理を追加した（`src/routine.ts`）。routine は bin を子プロセスとして起動するため、ここで最新化しないと子プロセスが古い挙動のまま動く。再ビルドに失敗した場合は routine を実行せず終了コード 1 で終了する。
- hook / 手動実行から使う再ビルド判定スクリプト `src/build-if-stale.ts` を追加した（`npx tsx src/build-if-stale.ts`）。linked worktree、`src` 無し、`typescript` 未インストールの環境では何もしない best-effort な処理とし、呼び出し元を止めない。
- `bin`、`files`、配布ドキュメントの呼び出し記法は変更していない。

確認結果:

- `npm run typecheck`、`npx eslint`（変更した TypeScript）、`npx prettier --write`、`npm run test:unit`（新規 22 件を含む）を実行し、いずれも成功した。
- `npm run build` 後の手動確認で、`src` を新しくした状態の `node dist/specdojo.js exec where` は中断メッセージとともに終了コード 1、`node dist/specdojo.js --version` は警告のみで終了コード 0、ビルド直後（最新状態）は無出力であることを確認した。確認用に生成した `dist` は削除して worktree の状態を戻した。

再発防止:

- routine 経由の自動実行では、routine 実行の先頭で dist を最新化するため、古い dist で `exec cycle` が起動しなくなる。
- 手動実行で古い dist のまま `exec` 系を起動した場合は、鮮度ガードが中断するため、設定済みの `parent_validations` が未実行のまま success になることがない。

未実施事項（申し送り）:

- `lefthook.yml` への `post-merge` / `post-checkout`（`npx tsx src/build-if-stale.ts`）追加と、`package.json` への `build:if-stale` script 追加は、executor のサンドボックスが両ファイルへの書き込みを拒否したため未実施である。merge / checkout 直後の自動再ビルドを有効化する場合は人手で追加する。未追加でも routine の自動再ビルドと CLI 鮮度ガードで検知・防止は成立する。

## 5. 関連ドキュメント

- 事象を検知した run: [[prj-0001:pjr-strg-deterministic-dct-strategy-generation|PJR-STRG DCTとsch-strategyの決定論的ジェネレーター実装]]
- 未実行を記録した result: [[prj-0001:xer-pjr-strg-20260818t230101z-0889|PJR-STRG Edit Result]]
- 設定の正本: `.specdojo/exec-defaults.yaml` の `pipeline.parent_validations`
- 実行方法の記載先: [[specdojo:command-reference|コマンドリファレンス]]
