---
specdojo:
  id: prj-0001:pjr-qqrh-runner-false-success
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-18T12:17:56Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-08EK
---

# PJR-QQRH executor が編集を拒まれたまま完了と報告すると、runner が成功として review に進める

## 1. 課題内容

権限で拒まれた出力や、プロダクトの変更がないことを見落とし、waiting にせず review へ進めてしまう

executor が、ツールの権限でプロダクトのファイルの編集を拒まれ続けたまま「直した」と報告した。runner はそれを成功として受け取り、プロダクトの統合を「変更なし」で飛ばして、項目を `review` に進めた。誤りに気づけるのは、人が差分を見たときだけだった。

直接のきっかけは、opencode の executor がプロダクトの worktree を編集できない問題（PJR-08EK）だが、どの provider でも、executor が編集できないまま完了と報告すれば同じことが起こりうる。

## 2. 入力

- opencode の executor（Ollama のローカルモデル）はプロダクトの worktree への Edit を 20 回拒まれたあと、直したと報告した
- evidence.json は stage.status succeeded、`exit_code` 0、`completion_status` complete で、changes は登録簿のイベントの 1 件だけだった
- executor が報告した検証 npm run test:browser は passed と記録されたが、ログ上はルートの npm test（no test specified）が走っていた
- runner のログは integrate で no changes; skipped のあと review へ進んだ
- 環境: specdojo 0.7.0、opencode 1.19.5、Linux（devcontainer）
- 起票案は利用者が作成した tmp/specdojo-issue-2-runner-false-success.md

## 3. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容                                                                                         |
| -------- | -------------------------------------------------------------------------------------------- |
| 原因     | _TODO_                                                                                       |
| 対応策   | 次のどれかに当たる場合は成功とせず `waiting` にし、`block_reason` に理由を残す（下記の内訳） |
| 依存事項 | PJR-08EK（直る前は、再現の材料に使える）                                                     |
| 完了条件 | 下記の条件をすべて満たすこと                                                                 |

対応策の内訳。

- executor の出力に、ツールの権限による拒否（`external_directory`・`edit` の deny など）がある。
- 項目がプロダクトリポジトリの変更を求めている（`repos` が宣言され、`target_path` が `<repo>:` で始まる、または plan がプロダクトを対象にしている）のに、プロダクトの worktree に変更がない。
- 少なくとも、runner の要約と `exec status` で「プロダクトの変更なし」を警告として目立たせる。

完了条件の内訳。

- 対応策の 2 つの場合のどちらに当たっても、項目が `review` に進まず、`waiting` と `block_reason` が残る。統合テストで確かめる
- プロダクトを対象にしない項目と、通常の成功の動きは変わらない
- 「プロダクトの変更なし」が runner の要約と `exec status` に警告として出る
- 検証の主張と実際の食い違い（入力の `npm run test:browser` の件）を、この項目で扱うか別に起票するかは executor が決め、理由を個票の対応結果と報告の `handoff` に書く
- `CHANGELOG.md` は変えず、個票の対応結果の `### <n>.<m>. CHANGELOG に書く事項` に区分（追加・変更・不具合修正など）と行の文案を書く。影響がなければ「なし」と書く
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` と親の検証が通る
- 統合の後、PJR-JSEY で runner の動きを確かめてから close する

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
