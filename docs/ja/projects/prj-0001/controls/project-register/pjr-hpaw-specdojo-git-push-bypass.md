---
specdojo:
  id: prj-0001:pjr-hpaw-specdojo-git-push-bypass
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-11-28T04:16:53Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-D4RJ
---

# PJR-HPAW specdojo git が push を止めずに通し、executor が git push の deny をすり抜けられる

## 1. 課題内容

specdojo git -- push が git push をそのまま実行するため、npx specdojo を許された executor が push の deny をすり抜けられる。v0.10.0 の前に push を拒むように直す

## 2. 入力

- src/commands/git.ts は push を止めずに git へ渡す（2026-11-28 の確認）。executor の .specdojo/claude/settings.edit.json は Bash(npx specdojo `*)` を許し、deny は Bash(git push `*)` の形だけを見る。codex の rules も git push の形だけを見る
- PJR-D4RJ でオーケストレーターの push を守りのある入口で許すと決めた際に見つけた。入口は別の todo で作る
- v0.10.0 に入れる。担当 DEV・期限 2026-11-30 は indie の指示（2026-11-28）

## 3. 影響範囲

| 観点         | 内容                                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| スコープ     | `specdojo git`（`src/commands/git.ts`）と、それを許している各 provider の権限の設定                              |
| スケジュール | v0.10.0 の前に直す                                                                                               |
| コスト       | 小さい                                                                                                           |
| 品質         | 成果物の本文などから指示を差し込まれた executor が、Dev Container の共有の GitHub 認証で push できるおそれがある |
| 関係者       | `specdojo git` を使うオーケストレーターと、exec の executor・reporter                                            |

## 4. 対応方針

| 観点     | 内容                                                                                                                                                                                                                 |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `specdojo git -- <git の引数>` は書き込みの git 操作をロックに並べるための入口で、`push` を止めずに git へ渡す。executor の claude の設定は `npx specdojo *` を許し、`git push` の deny は `git push` の形しか見ない |
| 対応策   | `specdojo git` で `push` を拒む。拒み方（サブコマンドの判定、global option を挟んだ形・別名の扱い）は executor が決め、理由を個票の対応結果に書く                                                                    |
| 依存事項 | PJR-D4RJ の守りのある push の入口は別の todo で作る。この項目ではその入口を作らない                                                                                                                                  |
| 完了条件 | 下の一覧のとおり                                                                                                                                                                                                     |

- `specdojo git --project <id> -- push ...` を、git を起動する前にエラーで止める。global option（`-C`・`-c` など）を前に置いた形も止める。エラーには、push は人が行うか、PJR-D4RJ の入口を使うことを書く。
- git の別名（alias）で `push` を呼ぶ形を止められるかを確かめる。止められない場合は、その理由と残る危うさを個票の対応結果に書く。
- `push` 以外の、remote を書き換える操作（例: `send-pack`）で同じ穴がないかを確かめ、あれば同じく止める。何を止めたかと理由を個票の対応結果に書く。
- `commit`・`merge` など今の使い方と、読み取りのコマンドは今どおり動く。
- 単体テストで、`push`、global option を前に置いた `push`、今どおり通る操作を確かめている。
- コマンドリファレンスの `git` の説明に、`push` を拒むことを書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、案を個票の対応結果と報告の `handoff` に書く。
- 作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通し、親の検証を通す。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
