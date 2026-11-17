---
specdojo:
  id: prj-0001:pjr-mj8v-exec-serialize-overlapping-items
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-16T03:22:47Z"
  due_on: null
  completed_at: "2026-11-17T03:12:50Z"
  conclusion: 変更範囲の重なる項目を先行の統合まで待たせ、共通手順の文による誤った重なりを除いた
  derived_from:
    - PJR-1GCD
  commit_type: feat
  commit_scope: exec
---

# PJR-MJ8V 同じ範囲を触る項目を並べて流さず、順番に流す

## 1. 概要

並列の run で、同じファイルや同じ範囲を変えそうな項目を同時に流さず、先の項目の統合の後に流す

## 2. 入力

- 2026-11-15〜16、PJR-1GCD と PJR-ED0K が同じ develop から分かれて src/exec/run/lifecycle-commands.ts・in-place.ts・register-resume.ts などの同じ関数を書き換えた。ED0K が先に統合されたため、1GCD は再開の前の同期でコードの衝突になり、orchestrator が手で両方の規則を合わせて解いた
- merge を直列化しても（PJR-30SA）、同じ起点から同じ範囲を変えた 2 件目の衝突は防げない。防ぐには、流す前に範囲が重なる項目を順番にするか、衝突を executor に解かせる必要がある。まず前者を入れ、後者は起きたときの手当てとして別に扱う（2026-11-16、利用者が起票を依頼）

## 3. 完了条件

- `exec run --register`・schedule の並列の run で、変更の範囲が重なりそうな項目（個票や plan に書いた対象のファイル・ディレクトリ、成果物の対象から推定）を同時に流さず、先の項目の統合の後に流す。
- 範囲の推定の仕方（明示した対象、approach の既定の範囲、推定できない場合の扱い）を決めて文書に書く。推定できない項目は従来どおり並べてよいかを選べる。
- 順番を待たせた項目と理由（重なった範囲と相手の項目）を run の出力と記録に残す。
- 1GCD と ED0K の形（同じ関数を書き換える 2 件）を再現するテストで、2 件目が先の統合の後に流れ、衝突しない。
- `npm run check` と親の検証が通る。
- 2 回目の実行（2026-11-17）: plan の雛形が全項目に書く文（完了手順の「登録簿（`pjr-index.md`）の行と個票のステータス項目は変更しない」など）から範囲を推定しない。1 回目の実装では、この禁止の文の `pjr-index.md` がすべての register 項目の範囲に入り、どの 2 件も重なると判定された（PJR-981V が範囲の重ならない PJR-V0FQ に止められた）。
  - 範囲の推定は、個票と plan のうち項目ごとに書いた部分（対象・完了条件・作業内容など）に限り、runner が生成する共通の手順・規約の文は読まない。生成物（`generated/` 配下、gitignore された一覧）も範囲に入れない。
  - 雛形の文だけを共有する 2 件の register 項目が重ならないと判定され、並べて流れることを回帰テストで確かめる。1GCD と ED0K の形のテストは引き続き通る。

## 4. 作業内容

| No  | 作業                                                      | 担当 | 状態 | メモ                                                                                                                     |
| --- | --------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------------------------------------------------------ |
| 1   | 範囲の推定の仕方を設計する（対象の宣言、approach の既定） | DEV  | done | 明示対象・本文のパス・approach の範囲を合成。不明範囲は CLI で parallel / serialize を選択する                           |
| 2   | 並列の run の並べ方に、範囲の重なりによる順番待ちを入れる | DEV  | done | worktree 作成前の予約を register の並列・join と schedule の自動選択に追加。統合時に解放し、未統合の失敗は後続を停止する |
| 3   | 記録・出力と文書を更新し、回帰テストを足す                | DEV  | done | 待機出力・plan の記録・予約の履歴、推定／失敗／別プロセス／同一関数の E2E を追加。親 runner 担当の検査は後段で実施する   |
| 4   | 共通手順と生成物による範囲の誤検知を修正する              | DEV  | done | 項目固有の節・finding だけを plan から抽出し、生成物を除外。実雛形と既存 plan を持つ並列 register の回帰テストを追加     |

## 5. 対応結果

### 5.1. 実施内容

- `src/exec/run/change-scope.ts` に、パス正規化・対象解決・包含関係の判定・プロセスをまたぐ予約を実装した。推定と不明範囲の方針は [[specdojo:exec-operation-guide|exec運用ガイド]] の「変更範囲が重なる項目の順番待ち」を正本とする。
- register は lifecycle lock の外で範囲を待ち、統合後の HEAD から worktree を作る。schedule は重なる候補を未準備のまま保留し、先行項目の統合後に選び直す。予約の解放は統合成功で行い、撤去や post-review の失敗と分けた。
- 待機の日時・項目・相手・重複範囲を出力と予約履歴へ残し、新規生成の plan にも追記する。失敗・heartbeat 停止で未統合の予約を見つけた場合は、先行項目の再開を促して後続を停止する。
- テストは範囲の正規化・宣言と approach の解決、不明範囲の方針、失敗の保持と再開、schedule の準備順、別プロセス間の予約、同一関数を変更する ED0K / 1GCD 形の実 Git E2E を追加した。実 Git E2E は、二件目が一件目の変更を読めることと、両方の変更が衝突せず統合されることを検査する。
- 再開時に前回の親検証エラーを調べ、型 import の規約違反、待機記録の追記で plan 末尾の共通規約参照を展開できなくなる不具合、本文の「executor/reporter」をパスと誤認する不具合を修正した。共通規約スナップショットを推定から除外し、新旧の参照形式の展開・checkpoint と、準備失敗時の予約保持を回帰テストへ追加した。
- 2 回目の実行では、plan の対象・入力・追加完了条件・作業内容など項目固有の節と finding に推定を限定し、共通の進め方・完了手順・異常終了条件を除外した。Markdown の見出しを解析し、コード例内の見出しでは抽出範囲を切り替えない。正規化した `generated/` 配下と project repo で Git が無視するパスは、明示対象からも除外する。
- 実際の register 雛形を使った推定・並行予約、共通手順の後にある追加完了条件、生成物・Git が無視する一覧の回帰テストを追加した。register の実 Git E2E も既存 plan を持つ 2 件で実行し、共通文中の `pjr-index.md` による待機が起きないことを検査する形にした。同一関数を変更する ED0K / 1GCD 形の E2E は維持した。

### 5.2. 検証と申し送り

- 2 回目の executor では、変更ファイルの Prettier、`check:src-imports`、catalog 検証、履歴リンク検査、登録簿の派生ビュー生成が終了コード 0。catalog の既存警告（re-export 参照・未作成文書）は残る。追加・更新した回帰テストと型検査・lint は親 runner に委ね、executor では重複実行していない。
- 完了条件の `npm run check` は、pipeline の二重実行禁止に従い、型検査・lint・schema・unit / integration test を親 runner に委ね、残りの catalog・履歴リンク・runtime import 検査を executor で実施する。親 runner の検査結果を合わせて完了を判定する。result の記入は reporter / runner が行う。
- runner の統合後は [[prj-0001:pm-orchestrator-playbook|オーケストレーター運用メモ]] に従い PJR-JSEY の実 agent CLI による動作確認へ本項目を含める。実 agent の利用枠を消費するため executor では起動しない。
- 推定できない部分の既定は互換性のため並列許可とした。宣言にない変更まで競合を防ぐ保証はなく、不明な項目も待たせる列では `--unknown-scope serialize` を指定する。

### 5.3. CHANGELOG に書く事項

- 追加: register の並列・join 実行と schedule の自動実行で、変更範囲が重なる項目を先行項目の統合後まで待機させる。不明な変更範囲は `--unknown-scope parallel|serialize` で扱いを選べる。
- 不具合修正: 変更範囲の推定から生成 plan の共通手順と生成物を除き、範囲の重ならない register 項目が共通文中の `pjr-index.md` によって順番待ちになる問題を修正する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-1gcd-exec-condense-records-missing-retry]]
- [[prj-0001:pjr-ed0k-exec-resume-executor-from-integrate]]
- [[prj-0001:pjr-30sa-specdojo-git-serialized]]
