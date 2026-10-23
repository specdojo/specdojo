---
specdojo:
  id: prj-0001:pm-orchestrator-playbook
  type: project
  status: ready
  rulebook: none
---

# prj-0001 のオーケストレーター運用メモ

## 1. 目的と適用範囲

本書は、prj-0001（SpecDojo 本体の開発）を扱う対話型オーケストレーター（`specdojo-orchestrator`）が、この環境で作業を進めるときの運用メモである。配布するオーケストレーターの本文（`.agents/specdojo-orchestrator.agent.md`）に入れない、この環境ならではの事情と、実際の運用で分かった手順・落とし穴をまとめる。

- 一般的な進め方（承認の聞き方、close の前の確かめ方など）は配布する本文に従う。本書はその上で、prj-0001 に固有の事柄だけを書く。
- 書いてある内容は 2026-10-20 から 2026-10-22 の運用（0.4.1 と 0.4.2 のリリース）で実際に起きたことに基づく。状況が変わったら書き直す。

## 2. 実行の列の組み方

登録簿の項目は `exec run --register` で流す。夜間や複数件をまとめて流すときは、次の形で「列」を組む。

```bash
npx specdojo exec run --project prj-0001 --register <PJR-ID> --worktree \
  --join --if-busy wait --on-rate-limit fallback \
  --executor-by <executor> --fallback-executor-by <代わりの executor> \
  --reporter-by gemma26-reporter --fallback-reporter-by claude-reporter
```

- 列は 2 本までにする（codex の列と agy の列など）。親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）は run をまたいで 1 件ずつ流れるため、列を増やしても速くならず、待ちと負荷が増える。
- `CHANGELOG.md` 以外の同じファイルを触る項目は、同じ列に順に並べる。LP の `GetStarted.astro` を触る 3 件を並べて流したときは、順に流すことで衝突を避けた。
- 統合の commit のときにも検査が走る。並行の検証と重なると、`tests/src/exec/pipeline-e2e.integration.test.ts` などの E2E が時間切れで落ちることがある。落ちた場合は、負荷が下がってから `--resume` で統合からやり直す。
- 列の終わりを待って次を流す待機を書くときは、相手のプロセスを `pgrep -f` のパターンで探さない（`落とし穴` を参照）。実行のログや出力ファイルに結果の行が出たことで判定するか、プロセスの番号で待つ。

## 3. agent の使い分けと癖

難しさごとの既定の振り分けは `.specdojo/exec-defaults.yaml` の `routing` にある（hard は codex、medium は agy の flash-high、easy はローカルの qwen、reporter は gemma26）。表に加えて、次の癖を踏まえて選ぶ。

| agent                      | 癖・制約                                                                                           | 対応                                                                                                                              |
| -------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| codex（sol-executor）      | 使用量の上限に当たると、解除の時刻（例: 「try again at 1:39 AM」）が出る                           | 実行のログで時刻を確かめ、待つか代わりの opus へ切り替える。解除の後に `--resume --resume-from executor` で途中の変更を引き継げる |
| agy（flash-high-executor） | 速いが、`any` の使用や使っていない変数を残し、足したテストが落ちたまま終わることがある（PJR-CNNT） | runner に関わる項目は codex に回す。agy で止まったら codex に切り替えて executor からやり直す                                     |
| agy の opus                | 割り当てが数日単位で、尽きるとすぐには戻らない                                                     | 待たずに codex へ切り替える                                                                                                       |
| opencode（qwen・gemma）    | executor が編集できるのは docs・src・tests の下だけ。`templates/` や `.devcontainer/` は触れない   | easy でもこれらの下を触る項目は agy で流す                                                                                        |
| gemma                      | 実際には変えていないのに「適用済み」と報告することがある                                           | result と差分を必ず照らす                                                                                                         |
| ローカル LLM（Ollama）     | 母艦の Ollama が止まっていると reporter が「Cannot connect to API」で止まる                        | `--fallback-reporter-by claude-reporter` を付けておく（PJR-DKD8 で切り替わる）                                                    |
| claude（sonnet・opus）     | セッションの上限に当たると、解除の時刻が出る                                                       | JSEY は claude-executor で流すため、上限の時刻を見て順番を決める                                                                  |

## 4. 止まったときの再開の使い分け

| 止まり方                                  | 原因の例                                           | 再開の仕方                                                                                                                                                                            |
| ----------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 親の検証で、executor の実装の誤りで落ちた | import の抜け、依存の欄の読み違え、lint の違反     | `--resume --resume-from executor`。`--resume-from` は `--resume` と一緒に使う                                                                                                         |
| 親の検証や統合で、負荷や偶然で落ちた      | E2E の時間切れ、乱数の衝突                         | 同じテストを手元で流し直して偶然かを確かめ、`--resume`                                                                                                                                |
| 再開のときに統合先と同期できない          | `CHANGELOG.md` の `## [Unreleased]` を両方で足した | worktree で、記帳のファイルを統合先の内容にし、`CHANGELOG.md` は両方の行を残して手で取り込み、`exec(register <ID>): merge project/prj-0001/develop ...` で commit してから `--resume` |
| executor の段が failed で再開できない     | 使えないモデルを指していた、途中で止めた           | `--force-restart` で最初から流す                                                                                                                                                      |
| 起動の直後に dist が古いと止まる          | 統合で `src/` が変わった                           | 本体で `npm run build` してから流し直す                                                                                                                                               |
| 統合で `CONFLICT`                         | 並行の項目が同じ行を変えた                         | 上の CHANGELOG と同じく worktree で手で解き、`--resume`                                                                                                                               |

- review の項目は `register reopen` できない（すでに有効な状態のため）。完了条件を補って流し直すときは、個票を直して commit し、そのまま `exec run` を流す。
- 実行中の項目を止めたいときは、見張りのスクリプトだけでなく runner のプロセスが残っていないかを確かめる。commit の途中で止めると後始末が増えるため、終わり際なら最後まで流す。

## 5. 統合後の確認と自分で確かめること

### 5.1. JSEY（runner の動作確認）

runner・register・exec のコードを変えた項目は、統合の後に PJR-JSEY を 1 回流して確かめてから close する。

1. JSEY の個票の対象の一覧（「…・PJR-XXXX）のうち」で終わる箇所）に、確かめる項目の ID を足して commit する。
2. `register reopen --id PJR-JSEY --by specdojo-orchestrator --reason "<対象> の統合後の動作確認" --commit` で開き直す。
3. `claude-executor` で流す。start から review まで通り、event の actor に実体名（sonnet-executor など）が記録されることを確かめる。
4. JSEY と対象の項目を close する。runner に関わる項目が続くときは、まとめて 1 回で確かめてよい。

docs だけの項目や、runner の通らないコード（kata、docs-site など）の項目では JSEY は要らない。

### 5.2. executor の報告に頼らないこと

- `requires_human`（人の確認が必要）と書かれた検証は、オーケストレーターが自分で流して確かめる。例: sandbox では通せない `docs:build` を手元で流し、時間と dead link の件数を確かめた（PJR-98P8）。
- 利用者のリポジトリでの動きは、tarball（`npm pack`）を空のリポジトリに入れて確かめる。PJR-7H7N は統合まで通ったが、空のリポジトリでは最初の commit が markdownlint の既定の規則で止まることが分かり、完了条件を補って流し直した。
- 外部の事実（モデルのタグ名など）は、result に確かめ方がなければ一次情報で確かめる（PJR-2ASZ では Ollama の公式の一覧で確かめた）。

## 6. 落とし穴

- 待機が自分自身を数える: `while pgrep -f "register PJR-XXXX"` のような待機は、待機のコマンドの文字列にも同じ語が含まれるため、自分自身に一致して終わらない。結果の行の有無か、プロセスの番号（`kill -0 <pid>`）で待つ。
- commit メッセージの本文は 1 行 100 文字以内（commitlint の `body-max-line-length`）。長い文は折り返す。
- 個票の Markdown: 素の URL は MD034 で止まるため `<https://...>` と書く。説明や結論にアスタリスクを 2 つ書くと、0.4.1 までの一覧の生成では MD037 で止まった（PJR-6SQH で修正済み）。
- `.git/index.lock` が残っているあいだは commit できない。runner の統合と重なるときは、消えるのを待ってから commit する。
- 別の作業ツリー（`../specdojo-prj-0002`）の中で `npx specdojo` を打つと、その作業ツリー自身の `dist/` が動く（このリポジトリはパッケージ `specdojo` 自身のため）。古いブランチでは古い CLI が動くので、本体の `dist/specdojo.js` を直接使うか、その作業ツリーで build する。
- 保護された設定（`.specdojo/`・`package.json`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`CLAUDE.md`・`AGENTS.md`・`lefthook.yml` など）は agent が書けない。変更が要る項目は、executor に変更案を result へ書かせ、オーケストレーターが利用者の承認を得て feature ブランチで反映する（PJR-SAZC）。

## 7. 別の project との分担

- prj-0002（LP と assets）は `../specdojo-prj-0002` の作業ツリーで、そちらのオーケストレーターが進める。prj-0001 のオーケストレーターは、prj-0002 の作業を代わりに流さない。
- 別の project の登録簿へ起票するときは、0.4.2 以降の `register add --project <project-id> --commit` を使う。起票の元は `--from <project-id>:PJR-XXXX` で指す。close などの状態遷移は、その project の作業ツリーで行う。
- prj-0002 の作業ツリーを新しい版に合わせるときは、prj-0002 の develop に main を取り込み、その作業ツリーで `npm ci` と `npm run build` をしてから使う。

## 8. リリースの手順

0.4.1 と 0.4.2 で行った手順である。

1. 範囲の項目がすべて close されていることを確かめ、リリースの todo を起票する。
2. feature ブランチ（`feature/prj-0001/release-v<版>`）で `npm version <版> --no-git-tag-version --ignore-scripts` と、CHANGELOG の `## [Unreleased]` を `## [<版>] - <日付>` にする変更を commit する。docs-lint に変更があれば、その版も上げる。
3. そのブランチで `npm ci`（`packages/*` も）をしてから `npm run check` を流す。
4. `npm pack` した tarball を空のリポジトリに入れ、`init` と、その版で変えた機能（lefthook、名簿の雛形など）、`register add` と `exec run --register` を確かめる。
5. feature ブランチを develop へ `--no-ff` で取り込み、PR の本文を作って、push と PR 作成のコマンドを利用者に渡す。
6. 利用者が PR を merge commit でマージし、タグを付けて push し、`npm stage` で公開を承認する。
7. npm の `latest`、タグで起動した workflow の結果、npm から入れた版での導入を確かめ、リリースの todo を close する。
