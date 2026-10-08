---
specdojo:
  id: prj-0001:pjr-hrms-v030-changelog-finalize
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  owner: DEV
  registered_at: "2026-10-08T12:08:02Z"
  due_on: null
  block_reason: rate limit reached
---

# PJR-HRMS v0.3.0 の CHANGELOG と移行ガイドを最終化する

## 1. 概要

CHANGELOG の v0.3.0 は 2026-09-29 付けのままで、その後に入った利用者に見える変更（requires_human、--resume-from executor、grade の英語正本と翻訳、合成コマンドの判定など）が載っていない。公開の前に CHANGELOG と移行ガイドを最終化する。

公開の判定基準は [[prj-0001:pjr-p8tk-release-stabilization-criteria]] で決める。

## 2. 完了条件

- 2026-09-29 以降に close した登録簿の項目と、`feat` / `fix` の commit を洗い出し、利用者に見える変更を CHANGELOG の v0.3.0 の該当する区分（破壊的変更・追加機能・不具合修正・既知の問題）に追記する。少なくとも次を含める。
  - executor の検証の状態 `requires_human`（PJR-BK4K）
  - `exec run --resume --resume-from executor` と、executor 段の再開での統合先の取り込み（PJR-PG6W）
  - grade の英語の判定の正本化、日本語の表示用の翻訳、level の下方向の補正（PJR-27Y0・PJR-JWXK・PJR-WAFC・PJR-PZPA）
  - 親検証の失敗の出力の保存（PJR-R8WR）
  - 委譲した検証・合成コマンドの判定の修正（PJR-979N・PJR-SDWF）
  - Git の一時的な失敗の再試行の拡張（PJR-VX97）
  - `devcontainer scaffold` の Emacs のテンプレートと codex の設定（PJR-J7WE・PJR-EZAF）
  - Markdown の lint の中国語の字体の規則（PJR-86JE）
  - 選択式の `specdojo init`（PJR-6QDA）と、名簿の読み込みが `members_path` なしでも agent を読む修正・provider のテンプレートの案内の修正（PJR-WZYW）
  - exec plan の共通規約が、実行できない検査を求めない修正（PJR-44J9）
  - 呼び方を「仕様道（Spec-Dō）の道場」に改め、技・流の名前を加えたこと（PJR-QGP4・PJR-0WYM・PJR-J29X）
  - 判断台帳のクイックスタート（PJR-XMQH）
- 既知の問題に、本体の実行時の依存 `fast-glob` 経由の `braces` の high の脆弱性（修正版なし、PJR-HQKV）と、統合の commit のフックのテストが一時的に失敗することがあり `--resume` で回避できること（PJR-Q7GJ）を載せる。CHANGELOG の「依存の脆弱性に対応しました」の記述と矛盾しないように書く。
- 本リポジトリだけの設定の変更（Ornith や Qwen などの member の追加と無効化、本リポジトリの devcontainer の調整）は載せない。
- 既に載っている項目（agent の定義の分離など）と重複させない。表現は既存の項目の文体にそろえる。
- 見出しの日付は公開日に人が記入する。それまでは `## [0.3.0] - 未定` とする。
- 移行ガイド（release-v0-3-0-migration-guide）が、CHANGELOG の破壊的変更をすべて扱っていることを確かめ、不足があれば追記する。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                               | 担当 | 状態 | メモ                             |
| --- | ---------------------------------- | ---- | ---- | -------------------------------- |
| 1   | CHANGELOG と移行ガイドを最終化する | DEV  | open | 本リポジトリだけの変更は載せない |
| 2   | 公開日を記入する                   | PO   | open | 公開の当日に人が行う             |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-nyzr-adoption-strategy]]（普及戦略）
