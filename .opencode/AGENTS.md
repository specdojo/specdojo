# Agent Instructions

## Language

<!-- markdownlint-disable MD061 -->

- 必ず自然な日本語で回答する。ただし、agent の定義が出力の言語を指定している場合は、その指定に従う。
- 簡体字・繁体字・中国語表現を日本語に混在させない。
- 漢字は日本で一般的な字体と語彙を使用する。
- 中国語の字体・語彙を混ぜない。例: 业→業、务→務、揭→掲、对→対、关→関、发→発、说→説。
- 対象文書の用語は、文書中の表記をそのまま引用する。

<!-- markdownlint-enable MD061 -->

## Project Policy

- 変更前に関連する設計書を確認する。
- タスクに関係しない変更を行わない。

## Safety

- 認証情報、秘密鍵、`.env`、`secrets/` を読み込まない。
- 破壊的変更や `git push` を行わない。push は、対話型オーケストレーターに限り `npx specdojo guarded-push --project <project-id>` で行う。`project/<project-id>/develop` と `feature/<project-id>/*` の範囲で、先に `--dry-run` で送るブランチ・remote・commit の範囲と件数を示し、送るたびに利用者の承認を得る。直接の `git push`、main・タグ・履歴を書き換える push は行わない。executor・reporter はこの入口も使わない。登録簿などの同期専用ブランチへの push は、specdojo のコマンド（`register ... --commit`・`exec run`・`register branch-push`）に任せる。
