---
specdojo:
  id: prj-0001:pjr-5f1y-exec-resume-instruction-option
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  registered_at: "2026-11-13T14:08:18Z"
  commit_type: feat
  commit_scope: exec
---

# PJR-5F1Y exec resume に、再開の指示を plan へ足すオプションを用意する

## 1. 概要

再開の前に plan の共通規約の前へ追加の指示を入れる作業を、Python の挿入ではなく CLI で行えるようにする

## 2. 入力

- 2026-11-12〜13 の型の整備と夜間の実行で、orchestrator が手作業やシェルスクリプトで補った

## 3. 完了条件

- `exec run --register <ID> --resume --resume-from executor` に、再開の指示の文を plan へ足すオプションを足す（例: `--resume-note <text>`。繰り返し指定できる。名前は executor が決める）。
- 指示は、run の plan の共通規約の参照の行の前に、見出し付きの節として入る。共通規約の参照の行とその後ろは変えない。
- `--resume-from executor` を伴わない場合は、起動の前にエラーで止める。worktree の plan を手で直すと、通常の再開では統合の前に範囲外の変更として止まるためである。
- 足した指示と日時が、run の記録（`pipeline-state.json` か evidence など、executor が決める）に残る。
- 単体テストで、plan への挿入の位置、`--resume-from executor` が無いときのエラー、記録に残ることを確かめる。
- コマンドリファレンスと exec 運用ガイドの再開の節に、オプションと使う場面を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。利用者に影響が無い場合はそう書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` が通り、親の検証が通る。

## 4. 作業内容

| No  | 作業                                                                                        | 担当     | 状態 | メモ                                                                                                 |
| --- | ------------------------------------------------------------------------------------------- | -------- | ---- | ---------------------------------------------------------------------------------------------------- |
| 1   | `exec run --register` に `--resume-note <text>`（繰り返し可）と起動前の組み合わせ検査を足す | executor | done | `src/exec/run/register-command.ts`・`src/exec/run/resume-notes.ts`                                   |
| 2   | executor の再開で worktree の plan の共通規約の参照の前へ節を入れる                         | executor | done | `src/shared/plan-conventions.ts` の `insertBeforePlanConventions`・`src/exec/run/register-resume.ts` |
| 3   | 足した指示と日時を `pipeline-state.json` の `resume_notes` に残す                           | executor | done | `src/exec/pipeline-state.ts`・`src/exec/run/agent-pipeline.ts`・schema                               |
| 4   | 単体テストを足す                                                                            | executor | done | `tests/src/exec/run/resume-notes.test.ts`                                                            |
| 5   | コマンドリファレンスと exec 運用ガイドの再開の節を更新する                                  | executor | done | 両文書の register の再開の説明                                                                       |

## 5. 対応結果

### 5.1. 実施内容

- `specdojo exec run --register <PJR-ID> --worktree --resume --resume-from executor --resume-note <text>` を足した。繰り返し指定した指示は 1 つの節に箇条書きで並ぶ。
- 指示は worktree の plan の共通規約の参照の行（最後の段落）の前に `## 再開の指示（<ISO 日時>）` の節として入る。参照の行とその後ろは変えない。参照の無い旧形式の plan では末尾に足す。挿入は agent の起動と register の `start` の後、executor を起動する直前に行い、prompt は挿入後の plan から作り直す。
- `--resume-from executor` を伴わない場合、`--resume` が無い場合、`--register` の ID が 1 件でない場合、`--register-filter` と併用した場合、空の文字列の場合は、project の解決・lock・register の状態変更より前にエラーで止める。
- 足した指示と日時は `pipeline-state.json` の `resume_notes`（`at`・`notes` の配列）に残る。次の再開でも前回までの分を引き継ぐ。`docs/specdojo/schemas/v1/pipeline-state.schema.yaml` と読み込み時の検査に項目を足した。
- 単体テストで、挿入の位置（参照の前・参照の不変・展開が引き続き動くこと）、参照の無い plan、組み合わせのエラー（CLI の起動前の停止を含む）、`resume_notes` の記録・引き継ぎ・schema 適合・不正値の拒否を確かめた。
- [[specdojo:command-reference|コマンドリファレンス]] のオプション表・例・register の再開の説明と、[[specdojo:exec-operation-guide|exec運用ガイド]] の「register実行の再開」に、オプションと使う場面を書いた。

### 5.2. 迷った点と決めた内容

- オプション名は完了条件の例のとおり `--resume-note <text>` とした。
- 対象は完了条件のとおり `exec run --register` に限り、schedule の `exec resume --task` には足していない。schedule でも同じ要望があれば別の項目で扱う。
- `--register` の ID は 1 件に限った。指示は項目ごとの内容であり、複数の項目へ同じ指示を入れる誤りを防ぐためである。
- 記録先は `pipeline-state.json` とした。run の checkpoint として再開のたびに読み込まれ、前回までの分を引き継げるためである。executor を再開すると前回の state は `pipeline-state.attempt-N.json` に退避されるが、`resume_notes` は新しい state に引き継ぐ。
- 挿入先は worktree の plan とした。`--resume-from executor` の再開では worktree の plan が prompt の入力で、統合でも plan の変更が許されるためである。worktree に plan が無い場合は、状態を変えずに再開を拒否する。
- 節の見出しには番号を付けていない。plan の runner が足す節（変更範囲による実行待ち）と同じ形にそろえた。

### 5.3. CHANGELOG に書く事項

- 区分: Added
- 行の文案: `exec run --register <PJR-ID> --resume --resume-from executor` に `--resume-note <text>`（繰り返し可）を追加。再開の前に、run の plan の共通規約の参照の前へ再開の指示の節を足し、指示と日時を `pipeline-state.json` の `resume_notes` に記録する（PJR-5F1Y）。

### 5.4. 残課題

- 本項目の外の既存の不足として、`pipeline-state.schema.yaml` には `src/exec/pipeline-state.ts` が書く `artifacts` の項目が無い。そのため実際の run の `pipeline-state.json` は `npm run validate:schema:file` で `must NOT have additional properties` になる。本項目では `artifacts` を除き `resume_notes` を足した state で schema への適合を確かめた。schema への `artifacts` の追加は別の項目で扱う。

## 6. 関連ドキュメント

- [[specdojo:command-reference|コマンドリファレンス]]
- [[specdojo:exec-operation-guide|exec運用ガイド]]
