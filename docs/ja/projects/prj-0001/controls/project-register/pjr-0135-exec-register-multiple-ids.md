---
specdojo:
  id: prj-0001:pjr-0135-exec-register-multiple-ids
  type: project
  status: draft
  rulebook: pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  based_on:
    - prj-0001:pjr-0122
    - sysd-agent-settings
---

# PJR-0135 exec run --registerの複数ID直列実行

## 1. 概要

`exec run --register` に複数の PJR-ID を渡し、指定順に直列実行できるようにする。各IDの実行後にcommitするかどうかをオプションで選択でき、失敗時に停止するか残りを継続するかも明示できるようにする。register の worktree 化と並列実行は本項目の対象外とする。

## 2. 完了条件

- 複数の PJR-IDを指定でき、入力された順序で1件ずつ実行される。
- 単一IDを指定する既存のコマンドが互換性を保って動作する。
- 各IDについて plan/result の生成、`start`、agent実行、`review` または `waiting` への遷移が完結してから次のIDへ進む。
- オプションにより、成功したIDごとにcommitするか、自動commitせず変更を作業ツリーへ残すかを選択できる。
- ID単位commitでは当該IDの実行によって生じた変更だけを対象とし、実行前から存在する利用者の変更を含めない。
- 失敗時に残りのIDを停止するか継続するかをオプションで選択でき、最後にID別の成否、状態遷移、commit結果を一覧表示する。
- `--parallel` および register の worktree 実行はサポートせず、指定された場合は理由を示して拒否する。
- 複数ID、途中失敗、commit有無、既存変更の保護、単一ID互換性を自動テストで確認できる。

## 3. 作業内容

| No  | 作業                                                                    | 担当   | 状態 | メモ                                         |
| --- | ----------------------------------------------------------------------- | ------ | ---- | -------------------------------------------- |
| 1   | `--register` の複数ID入力形式と重複IDの扱いを定義してCLIへ実装する      | _TODO_ | done | 指定順を保持する                             |
| 2   | 1件の register 実行処理を再利用可能な関数へ分離し、複数IDを直列制御する | _TODO_ | done | routine の register 実行との共通化も検討する |
| 3   | ID単位のcommit有無と失敗時の停止・継続オプションを実装する              | _TODO_ | done | 既存の変更をcommit対象に含めない             |
| 4   | 全IDの実行結果を集約して表示し、プロセス終了コードへ反映する            | _TODO_ | done | 失敗IDを識別可能にする                       |
| 5   | コマンドリファレンス、運用ガイド、単体テストを更新する                  | _TODO_ | done | worktree・parallel対象外を明記する           |

## 4. 対応結果

- `exec run --register` を複数 PJR-ID の指定順直列実行へ拡張した。`--register <pjrIds...>`（空白・カンマ区切りの混在可）で複数IDを受け、重複は最初の1件のみ実行する。単一IDは同じ経路を通り従来どおり動作する。
- 1件分の実行を `runSingleRegisterItem()` へ抽出し、`runRegisterMode()` が共有セットアップ（paths / roster / execDefaults）を1回だけ行って各IDを直列制御する。各IDは plan/result 生成・`register start`・agent実行・`review`/`waiting` 遷移まで完結してから次へ進む。
- `--register-commit` で成功IDごとに当該IDの変更だけを commit する（項目開始前スナップショットとの差分方式。実行前から作業ツリーにある利用者の変更は含めない）。`--on-failure <stop|continue>`（既定 stop）で途中失敗時の停止・継続を選べる。
- 全ID処理後にID別の成否・状態遷移・commit 結果を一覧表示し、いずれかが失敗すると終了コード 1 を返す。`--worktree` / `--parallel` は register 実行では理由付きで拒否する。
- 純関数（`parseRegisterIds` / `selectRegisterCommitPaths` / `registerRunExitCode` / `formatRegisterRunSummary`）を単体テストで検証し、コマンドリファレンス・運用ガイドを更新した。詳細は exec result（`pjr-0135-20260725T123727Z-96e8-result.md`）を参照。

## 5. 関連ドキュメント

- [[prj-0001:pjr-0122|launch trackの振り返り]]
- [[sysd-agent-settings|エージェント共通設定]]
- [[register-operation-guide|SpecDojo登録簿運用ガイド]]
- [[exec-operation-guide|SpecDojo exec運用ガイド]]
- [[command-reference|SpecDojoコマンドリファレンス]]
