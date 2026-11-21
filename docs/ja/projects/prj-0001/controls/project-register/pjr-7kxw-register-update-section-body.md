---
specdojo:
  id: prj-0001:pjr-7kxw-register-update-section-body
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: medium
  registered_at: "2026-11-13T14:08:21Z"
  block_reason: "agent exited with non-zero code: root agent idle; waiting for 1 background task(s) to finish"
  commit_type: feat
  commit_scope: register
---

# PJR-7KXW register update で、個票の章の本文をファイルから入れられるようにする

## 1. 概要

完了条件・作業内容・範囲などの章の本文を、CLI で差し替えられるようにする（orchestrator の Python での書き換えの置き換え）

## 2. 入力

- 2026-11-12〜13 の型の整備と夜間の実行で、orchestrator が手作業やシェルスクリプトで補った

## 3. 完了条件

- `register update` に、個票の 1 つの章の本文を差し替えるオプションを足す（例: `--section <章の名前> --section-file <path>`。名前は executor が決める）。章は見出しの番号を除いた名前（`完了条件` など）で指定する。
- 指定した章の見出しの行は残し、次の同じ深さの見出しまでの本文だけを、ファイルの中身で置き換える。ほかの章と frontmatter は変えない。
- 個票に無い章の名前、読めないファイル、見出しを含むファイルはエラーにし、個票を変えない。
- `--commit` と一緒に使える。変えた個票とイベントだけが commit される。イベントに章を差し替えたことが残る。
- 単体テストで、章の差し替え、ほかの章が変わらないこと、エラーの 3 つを確かめる。
- コマンドリファレンスの `register update` の節に、オプションと例を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。利用者に影響が無い場合はそう書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` が通り、親の検証が通る。

2 回目の実行（2026-11-21）で直す点。

- `--dry-run` を付けたときも、通常の実行と同じく、個票に無い章の名前、読めないファイル、見出しを含むファイルをエラーにする。今は dry-run だと、無い章の名前でも「Would update」と表示して終了コード 0 で終わる。
- 単体テストで、dry-run のときの 3 つのエラーを確かめる。
- dry-run で期限や結論が「(removed)」と出る表示は、章の指定と関係なく前からある動きのため、この項目では変えない。
- 個票の対応結果の「CHANGELOG に書く事項」の文案を、この範囲に合わせて見直す。

## 4. 作業内容

| No  | 作業                                                                           | 担当 | 状態 | メモ                                                                      |
| --- | ------------------------------------------------------------------------------ | ---- | ---- | ------------------------------------------------------------------------- |
| 1   | 章の置換モジュール（`src/register/section.ts`）の設計・実装                    | DEV  | done | `validateSectionFile`, `replaceTicketSection`                             |
| 2   | スキーマおよびイベント型の更新（`field: "section"` の追加）                    | DEV  | done | `register-events.schema.yaml`, `events.ts`                                |
| 3   | `update.ts`, `renumber.ts`, `create-commands.ts` への CLI オプション・処理追加 | DEV  | done | `--section` と `--section-file` の連携                                    |
| 4   | 単体テストの作成（`tests/src/register/section.test.ts`）                       | DEV  | done | 置換・他章不変・エラーの 3 点および CLI を検証                            |
| 5   | コマンドリファレンスの更新                                                     | DEV  | done | `docs/ja/specdojo/references/command-reference.md` にオプションと例を追記 |

## 5. 対応結果

### 5.1. 実施内容

- `src/register/section.ts` を新設し、見出し番号を除去する `stripSectionNumber`、差し替えファイルの検証・読込を行う `validateSectionFile`、および個票の見出し行を残して次の同深度見出しまでの本文のみを差し替える `replaceTicketSection` を実装した。
- `docs/specdojo/schemas/v1/register-events.schema.yaml` の `RegisterEventChange` の `field` enum に `section` を追加し、`src/register/events.ts` で `section` を受け付けられるよう更新した。
- `src/register/create-commands.ts` の `register update` コマンドに `--section <name>` と `--section-file <path>` オプションを追加し、ペア指定・ファイル読取・見出し有無チェックのガードを組み込んだ。
- `src/register/update.ts` の `applyItemUpdate` および `src/register/renumber.ts` の `retopicPjrItem` に章置換処理とイベント変更差分（`{ field: "section", from: "", to: <章名> }`）の生成を追加した。
- `tests/src/register/section.test.ts` を作成し、章の差し替え、他の章や frontmatter が不変であること、存在しない章名・読めないファイル・見出しを含むファイル・不整合なオプションでのエラー発生（個票が変更されないこと）を検証した。
- `docs/ja/specdojo/references/command-reference.md` の `register update` の解説および主要オプション表に、`--section` と `--section-file` の説明と使用例を追記した。

### 5.2. 判断事項

- **オプション名**: `--section <章の名前>` と `--section-file <path>` を採用した。両方はペアで指定必須とし、片方のみの指定はエラーとした。
- **章の探索と置換範囲**: 見出し文字列から先頭の番号（例: `3.` と続く空白）を除いた名前で検索する。個票の標準的な章構造である H2 見出しを優先して検索し、指定した章の見出しの行は残した上で、次の同じ深さ（H2 等）またはそれより浅い見出しの直前までの本文全体を差し替え用ファイルの内容で置き換える。これにより、章内にサブ見出し（H3 等）が含まれていても章全体を一括して置換できるようにした。
- **イベントへの記録形式**: 個票本文の変更と監査履歴の差分を分離するアーキテクチャ方針に基づき、イベントスキーマの `RegisterEventChange` に `section` を追加し、イベントの changes に `{ field: "section", from: "", to: <章の名前> }` を記録した。また、`--reason` が明示されていない場合のイベント reason を `section "<章の名前>" updated` とすることで、どの章が更新されたかを監査ログおよびコミットログから追跡可能にした。

### 5.3. CHANGELOG に書く事項

- 区分: 追加
- 文案: `specdojo register update` に、個票の指定した章の本文をファイルから差し替える `--section <name>` と `--section-file <path>` オプションを追加した。

## 6. 関連ドキュメント

- [[specdojo:command-reference|コマンドリファレンス]]
- [[prj-0001:pjr-index|プロジェクト登録簿]]
