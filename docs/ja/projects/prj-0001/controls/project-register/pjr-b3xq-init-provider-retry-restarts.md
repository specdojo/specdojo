---
specdojo:
  id: prj-0001:pjr-b3xq-init-provider-retry-restarts
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-17T11:27:15Z"
  due_on: null
  completed_at: "2026-10-17T13:09:19Z"
  conclusion: 対話式の init で、各質問の直後に答えを検証し、誤りなら理由を出してその質問だけを聞き直すようにした。非対話では従来どおり誤りで終える。Claude Code を選んだときの最後の案内を orch:opus に揃えた
---

# PJR-B3XQ specdojo init で provider の入力を誤ると最初から入力し直しになる

## 1. 課題内容

対話式の specdojo init で agent の provider の設定を誤ると、プロジェクトや名簿などの入力を含めて最初からやり直しになる。誤った provider の設定だけを入力し直せるようにする

## 2. 影響範囲

| 観点         | 影響                                                                                                                       |
| ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `src/commands/init.ts` の対話式の入力（`collectInitAnswers`）と検証（`parseProviders`・`parseCatalog`・`validateAnswers`） |
| スケジュール | 急がない                                                                                                                   |
| コスト       | 対話式の `init` で provider などを誤ると、プロジェクト・名簿などの入力を最初からやり直す                                   |
| 品質         | 初めて使う利用者が最初につまずく場所になる                                                                                 |
| 関係者       | `specdojo init` を対話式で使う利用者                                                                                       |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                 |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `collectInitAnswers` が全部の答えを集めた後に、`parseProviders`・`parseCatalog`・`validateAnswers` がまとめて検証し、誤りがあると例外で `init` 全体を終える          |
| 対応策   | 対話式の入力では、それぞれの質問の直後にその答えを検証し、誤りなら理由を表示して同じ質問だけをやり直す。非対話（`--yes` や引数での指定）では、従来どおり誤りで終える |
| 依存事項 | なし                                                                                                                                                                 |
| 完了条件 | 下記の完了条件を満たす                                                                                                                                               |

### 3.1. 完了条件

- 対話式の `init` で、provider に未知の値（例: `claud`）を入れると、使える provider の一覧を表示して provider の質問だけをやり直し、それまでの答えは保たれる。
- 同じく、プロジェクト ID・nickname・catalog の大きさなど、検証のあるほかの質問も、誤りならその質問だけをやり直す。
- `--exec` を選んで provider を 1 つも入れなかった場合も、provider の質問をやり直す。
- 非対話（`--yes`、引数での指定）では、従来どおり誤りの理由を出して終える。
- 対話の入力を差し替えられる既存の仕組み（`InitPrompter`）で、誤った答えのあとに正しい答えを入れたときに 1 回で完了する単体テストを加える。
- `docs/ja/specdojo/guides/` の init のガイドで、入力を誤ったときの振る舞いに触れている箇所があれば直す。
- `init` の最後の「次の手順」の案内が、Claude Code の場合に `npm run orch:sonnet` を勧めている（`src/commands/init.ts`）。LP（<https://specdojo.org/>）と README の始め方は `npm run orch:opus` を勧めるため、案内を `orch:opus` に揃える（[[prj-0001:pjr-y79w-readme-lp-init-guide-alignment]] で見つかった食い違い）。案内の文言を確かめている単体テストがあれば合わせる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 4. 対応結果

`collectInitAnswers` の対話入力を質問単位で検証するように変更した。不正な project ID、真偽値、
nickname、provider、catalog は理由を表示して同じ質問だけを再表示し、それまでの回答を保持する。
`--exec` 選択時に provider が空の場合も provider の質問へ戻す。非対話入力は従来どおり例外で終了する。

Claude Code を選んだ場合の最後の案内は `npm run orch:opus` に統一した。対話入力を差し替える単体
テストに、不正値からの再試行、`--exec` と空 provider の組み合わせ、非対話入力のエラー維持、
Claude Code の案内を追加した。コマンドリファレンスと Quick Start ガイドにも再入力の挙動を追記した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-y79w-readme-lp-init-guide-alignment]]: init のガイドの整合。
