---
specdojo:
  id: prj-0001:pjr-a77m-codeql-src-alerts
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: waiting
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-19T22:05:49Z"
  due_on: "2026-11-30"
  block_reason: "parent validation failed: test-integration"
  derived_from:
    - PJR-P318
---

# PJR-A77M CodeQL が見つけた src の 5 件を直す

## 1. 課題内容

CodeQL が PR #34 で出した src の alert 5 件を直す。trash.ts の正規表現への local_id の埋め込み、change-scope.ts の ReDoS、repo-trace.ts と dashboard/shared.ts の表のセルのエスケープ、exec/shared.ts の何もしない replace

## 2. 入力

- 利用者の決定（2026-11-20）: 案 A。0.9.0 はこのまま出し、src の 5 件は 0.9.1 で直す。テストの 3 件は理由を付けて dismiss する
- orchestrator の調べ（2026-11-20）: high js/regex-injection src/deliverable/trash.ts:90、high js/redos src/exec/run/change-scope.ts:234、high js/incomplete-sanitization src/exec/repo-trace.ts:135 と src/dashboard/shared.ts:16、medium js/identity-replacement src/exec/shared.ts:23
- orchestrator の見立て（2026-11-20）: どれも利用者が自分のリポジトリで動かす CLI への入力に関するもので、外からの攻撃の経路は見当たらない。0.9.0 で入れた変更ではなく、既存のコードが初めて解析されたもの

## 3. 影響範囲

| 観点         | 影響                                                                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| スコープ     | `src/deliverable/trash.ts`・`src/exec/run/change-scope.ts`・`src/exec/repo-trace.ts`・`src/dashboard/shared.ts`・`src/exec/shared.ts` とその単体テスト |
| スケジュール | 0.9.1 のリリース（PJR-D25E、期限 2026-11-30）の前に close する                                                                                         |
| コスト       | 5 か所の小さな修正と単体テスト                                                                                                                         |
| 品質         | 記号を含む `local_id` での誤動作、長い個票の本文での遅さ、`\` で終わるセルでの表の崩れを防ぐ                                                           |
| 関係者       | DEV（対応）、利用者（merge の後の CodeQL の確認）                                                                                                      |

## 4. 対応方針

| 項目     | 内容                                                                                                                   |
| -------- | ---------------------------------------------------------------------------------------------------------------------- |
| 原因     | 外から入る値を正規表現や表のセルへ入れるときのエスケープが足りない。正規表現の書き方がバックトラックを招く。書き間違い |
| 対応策   | 下記の完了条件のとおり、1 か所ずつ最小の変更で直す                                                                     |
| 依存事項 | なし                                                                                                                   |
| 完了条件 | 下記の条件をすべて満たすこと                                                                                           |

完了条件の内訳。

- `src/deliverable/trash.ts` の `rewriteCatalogPath`: `new RegExp` に入れる `localId` を正規表現としてエスケープする。エスケープの関数は、既にある同じ働きの関数（`src/register/renumber.ts`・`src/exec/register-foreign-wait.ts`・`src/exec/parent-validation.ts` の `escapeRegExp`）を `src/shared/` の 1 つにまとめて使う。まとめるかどうかは executor が決め、理由を個票の対応結果に書く。`.` や `+` を含む `local_id` で、別の項目の `path:` を書き換えないことを単体テストで確かめる。
- `src/exec/run/change-scope.ts` の 234 行目あたりの正規表現（CodeQL `js/redos`、`.-/` の繰り返しで指数的なバックトラック）: 同じ入力で同じ path を拾う形のまま、バックトラックしない書き方にする。今の単体テストが変わらずに通り、`.-/` を数千回繰り返した文字列でもすぐに終わることを単体テストで確かめる。
- `src/exec/repo-trace.ts` の `renderTable` と `src/dashboard/shared.ts` のセルのエスケープ（CodeQL `js/incomplete-sanitization`）: `|` だけでなく `\` もエスケープする（先に `\` を `\\` にしてから `|` を `\|` にする）。`\` で終わるセルと `\|` を含むセルで表の列がずれないことを単体テストで確かめる。2 か所で同じ関数を使うかは executor が決め、理由を個票の対応結果に書く。
- `src/exec/shared.ts` の `tsForFilenameUtc`（CodeQL `js/identity-replacement`）: 何も変えていない `.replace("T", "T")` を消す。出力が変わらないことを単体テストで確かめる。
- 5 か所の外の動き（CLI の出力、生成するファイル）は変えない。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` が通り、親の検証が通る。
- merge の後に、CodeQL の 5 件の alert（1・2・5・6・7）が閉じるかを orchestrator が確かめる。executor は確かめなくてよい。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
