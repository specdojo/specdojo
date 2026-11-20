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

## 2. 登録簿項目の完了条件の書き方（CHANGELOG を個票の申し送りでまとめる）

PJR-EPQ3 の決定どおり、並べて流したときに `CHANGELOG.md` の統合衝突を避けるため、完了条件の書き方を次のようにする。

- 登録簿項目の完了条件では「`CHANGELOG.md` は変えず、個票の対応結果の `### <n>.<m>. CHANGELOG に書く事項`（Markdown の連番ルールに従う）に区分（追加・変更・不具合修正など）と行の文案を書く。影響がなければ『なし』と書く」と指示する。リリースでは見出しの文言「CHANGELOG に書く事項」で探して集める。
- 利用者に影響する変更がある項目は必ずこの節に書いておく。空欄や「_TODO_」のまま `close` しない。
- executor は `CHANGELOG.md` を変えず、文案を個票の対応結果と報告の `handoff` に書く。result へ直接書ける実行形態では result にも書く。
- 旧方（未公開の版の節へ直接書く）で書かれた行がまだ残っている間は、その行をそのまま残してリリース時に集める。新方に切り替えた項目と旧方の行を混ぜて集めてもよい。

## 3. 実行の列の組み方

登録簿の項目は `exec run --register` で流す。夜間や複数件をまとめて流すときは、次の形で「列」を組む。

```bash
npx specdojo exec run --project prj-0001 --register <PJR-ID> --worktree \
  --join --if-busy wait --on-rate-limit fallback \
  --executor-by <executor> --fallback-executor-by <代わりの executor> \
  --reporter-by gemma26-reporter --fallback-reporter-by claude-reporter
```

- 列は 2 本までにする（codex の列と agy の列など）。親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）は run をまたいで 1 件ずつ流れるため、列を増やしても速くならず、待ちと負荷が増える。
- 新方（PJR-EPQ3）では項目ごとに `CHANGELOG.md` を変えない。実装の範囲が重なる項目は runner が先行項目の統合まで待たせる。個票の入力・完了条件に対象の相対パスを書き、推定できない項目も直列化したい列には `--unknown-scope serialize` を付ける。推定と再開の規則は [[specdojo:exec-operation-guide|exec運用ガイド]] の「変更範囲が重なる項目の順番待ち」に従う。
- 旧方の行（未公開の版の節へ直接書いた `CHANGELOG.md`）が残っている間は、その項目は新方と混ぜて並べる場合、まだ `CHANGELOG.md` を書くため衝突の可能性が残る。リリースまでに旧方の行を集めて `## [Unreleased]` へまとめた後（第 9 節）に列を組むのが安全である。
- 統合の commit のときにも検査が走る。並行の検証と重なると、`tests/src/exec/pipeline-e2e.integration.test.ts` などの E2E が時間切れで落ちることがある。落ちた場合は、負荷が下がってから `--resume` で統合からやり直す。
- 列の終わりを待って次を流すときは、待機のスクリプトを書かず `exec queue` で予約する（[[specdojo:command-reference|コマンドリファレンス]] の「実行の予約（exec queue）」）。予約ファイル（`execution/queues/<queue-id>.json`）は記帳と同じく commit する。どうしても待機を書く場合も、相手のプロセスを `pgrep -f` のパターンで探さない（`落とし穴` を参照）。

## 4. agent の使い分けと癖

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

## 5. 止まったときの再開の使い分け

| 止まり方                                           | 原因の例                                                   | 再開の仕方                                                                                                                                                                                                                                                                                           |
| -------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 親の検証で、executor の実装の誤りで落ちた          | import の抜け、依存の欄の読み違え、lint の違反             | `--resume --resume-from executor`。`--resume-from` は `--resume` と一緒に使う                                                                                                                                                                                                                        |
| 親の検証や統合で、負荷や偶然で落ちた               | E2E の時間切れ、乱数の衝突                                 | 同じテストを手元で流し直して偶然かを確かめ、`--resume`                                                                                                                                                                                                                                               |
| 再開のときに統合先と同期できない                   | `CHANGELOG.md` の `## [Unreleased]` を両方で足した（旧方） | 新方（PJR-EPQ3）では項目は `CHANGELOG.md` を変えないため、この衝突は起きない。旧方の行が残っている間は、worktree で記帳のファイルを統合先の内容にし、`CHANGELOG.md` は両方の行を残して手で取り込み、`exec(register <ID>): merge project/prj-0001/develop ...` で commit してから `--resume`          |
| executor の段が failed で再開できない              | 使えないモデルを指していた、途中で止めた                   | `--force-restart` で最初から流す                                                                                                                                                                                                                                                                     |
| 起動の直後に dist が古いと止まる                   | 統合で `src/` が変わった                                   | 本体で `npm run build` してから流し直す                                                                                                                                                                                                                                                              |
| 夜間の job の中で止まった子の run を日中に再開する | job の worktree の中で wait になった                       | 本体から `exec run --register <ID> --worktree --resume` で再開できる（PJR-97KE）。再開の前に job の branch から wait の記録を取り込むため、同じ夜にその前に job へ統合された他の項目の成果も、job 全体の review より先に本体へ入る。job 全体の review を待つべき夜は、job を先に統合してから再開する |
| 統合で `CONFLICT`                                  | 並行の項目が同じ行を変えた                                 | 対象ファイルの両方の行を残して worktree で手で解き、`--resume`（旧方では `CHANGELOG.md`、新方では該当の個票・実装ファイル。個別の `CHANGELOG.md` の衝突は新方で起きない）                                                                                                                            |

- review の項目は `register reopen` できない（すでに有効な状態のため）。完了条件を補って流し直すときは、個票を直して commit し、そのまま `exec run` を流す。
- 実行中の項目を止めたいときは、見張りのスクリプトだけでなく runner のプロセスが残っていないかを確かめる。commit の途中で止めると後始末が増えるため、終わり際なら最後まで流す。

## 6. 統合後の確認と自分で確かめること

### 6.1. JSEY（runner の動作確認）

runner・register・exec のコードを変えた項目は、統合の後に PJR-JSEY を 1 回流して確かめてから close する。

統合後に本体で `npm run build` を実行し、新しいプロセスで次を流す。先に `--dry-run` を付けると、書き込みや agent 起動をせず手順を確認できる。

```bash
npx specdojo exec smoke --project prj-0001 --register PJR-JSEY \
  --targets PJR-8NB8 --executor-by claude-executor --reporter-by gemma26-reporter
```

コマンドは対象一覧への重複しない ID 追記と commit、done の JSEY の reopen と commit、`exec run --register --worktree`、今回の start → review と実体 actor の照合を順に行う。対象は実行時点で review または done を要求する。複数項目は `--targets PJR-XXXX,PJR-YYYY` でまとめて確かめる。

成功後に JSEY と対象の項目の完了条件を確認し、既存の `register close --commit` で close する。失敗時は出力の `[smoke:<段>]` と run の記録を調べる。waiting / in-progress の JSEY は先に既存の再開手順で解決する。オプションと他 project の確認用個票の書式は [[specdojo:command-reference|コマンドリファレンス]] の「統合後の runner 動作確認」を参照する。

docs だけの項目や、runner の通らないコード（kata、docs-site など）の項目では JSEY は要らない。

### 6.2. executor の報告に頼らないこと

- `requires_human`（人の確認が必要）と書かれた検証は、オーケストレーターが自分で流して確かめる。例: sandbox では通せない `docs:build` を手元で流し、時間と dead link の件数を確かめた（PJR-98P8）。
- 利用者のリポジトリでの動きは、tarball（`npm pack`）を空のリポジトリに入れて確かめる。PJR-7H7N は統合まで通ったが、空のリポジトリでは最初の commit が markdownlint の既定の規則で止まることが分かり、完了条件を補って流し直した。
- 外部の事実（モデルのタグ名など）は、result に確かめ方がなければ一次情報で確かめる（PJR-2ASZ では Ollama の公式の一覧で確かめた）。

## 7. 落とし穴

- 待機が自分自身を数える: `while pgrep -f "register PJR-XXXX"` のような待機は、待機のコマンドの文字列にも同じ語が含まれるため、自分自身に一致して終わらない。結果の行の有無か、プロセスの番号（`kill -0 <pid>`）で待つ。
- commit メッセージの本文は 1 行 100 文字以内（commitlint の `body-max-line-length`）。長い文は折り返す。
- 個票の Markdown: 素の URL は MD034 で止まるため `<https://...>` と書く。説明や結論にアスタリスクを 2 つ書くと、0.4.1 までの一覧の生成では MD037 で止まった（PJR-6SQH で修正済み）。
- orchestrator の commit・merge・add・checkout などは `npx specdojo git --project prj-0001 -- <Git の引数>` で実行し、runner の統合と同じ `exec-lifecycle` ロックに並べる。例: `npx specdojo git --project prj-0001 -- commit -m "docs: update playbook"`。`status`・`log`・`diff` はロックを待たない。ロックなしの commit を検知する pre-commit 警告の設定案は [[prj-0001:pjr-30sa-specdojo-git-serialized|PJR-30SA]] にある。
- 別の作業ツリー（`../specdojo-prj-0002`）の中で `npx specdojo` を打つと、その作業ツリー自身の `dist/` が動く（このリポジトリはパッケージ `specdojo` 自身のため）。古いブランチでは古い CLI が動くので、本体の `dist/specdojo.js` を直接使うか、その作業ツリーで build する。
- 保護された設定（`.specdojo/`・`package.json`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`CLAUDE.md`・`AGENTS.md`・`lefthook.yml` など）は agent が書けない。変更が要る登録簿項目は、executor に変更案を個票の対応結果と報告の `handoff` に書かせ（result へ直接書ける実行形態だけ result にも）、オーケストレーターが利用者の承認を得て feature ブランチで反映する（PJR-SAZC・PJR-EPQ3）。

## 8. 別の project との分担

- prj-0002（LP と assets）は `../specdojo-prj-0002` の作業ツリーで、そちらのオーケストレーターが進める。prj-0001 のオーケストレーターは、prj-0002 の作業を代わりに流さない。
- 別の project の登録簿へ起票するときは、0.4.2 以降の `register add --project <project-id> --commit` を使う。起票の元は `--from <project-id>:PJR-XXXX` で指す。close などの状態遷移は、その project の作業ツリーで行う。
- prj-0002 の作業ツリーを新しい版に合わせるときは、prj-0002 の develop に main を取り込み、その作業ツリーで `npm ci` と `npm run build` をしてから使う。

## 9. リリースの手順

0.4.1 と 0.4.2 で行った手順である。PJR-EPQ3 以降は、各項目が `CHANGELOG.md` を書かず個票の申し送りから集めるため、下記の手順で集めて書く。旧来の行は `## [Unreleased]` に書かれたまま残り、リリースでそのまま版の節へ移す。

1. 範囲の項目がすべて close されていることを確かめ、リリースの todo を起票する。
2. 集める範囲をきめる。前のリリースの `## [<直近の版>] - <日付>` の日時から、このリリースの todo が `close` される直前までに `close`（register event で `close` / `complete` が記録）された項目をすべて対象とする。登録簿の一覧または register event を日時の順で読み、close の記録から項目を引く。
3. 各対象の個票の対応結果から、見出しの文言「CHANGELOG に書く事項」（Markdown の連番ルールにより `### <n>.<m>. CHANGELOG に書く事項` のように書かれている）を探して集め、区分（追加・変更・不具合修正など）と行の文案を、CHANGELOG の `## [<版>] - <日付>` の節へまとめる。影響が『なし』と残った項目は対象から外す。個別に `## [Unreleased]` へ書かれていた行（旧方）もここへ取り込み、取り込んだ分は `## [Unreleased]` から消す。
4. 漏れを確かめる。手順 2 で決めた範囲の close 済み項目の個票について、register event の `close` 件数と集めた個票の件数を照合し、未確認の項目が残っていないかを確かめる。また、「なし」以外の文案が書かれた項目がすべて手順 3 の節に漏れなく取り込まれていることを確かめてから、手順 5 の feature ブランチへの commit に進む。
5. feature ブランチ（`feature/prj-0001/release-v<版>`）で `npm version <版> --no-git-tag-version --ignore-scripts` と、手順 3 でまとめた `## [<版>] - <日付>` の節を commit する。docs-lint に変更があれば、その版も上げる。
6. そのブランチで `npm ci`（`packages/*` も）をしてから `npm run check` を流す。`npm audit --omit=dev --audit-level=high` も流し、公開の workflow の関門で止まらないことを先に確かめる（「依存とコードのセキュリティ検査」）。
7. `npm pack` した tarball を空のリポジトリに入れ、`init` と、その版で変えた機能（lefthook、名簿の雛形など）、`register add` と `exec run --register` を確かめる。
8. feature ブランチを develop へ `--no-ff` で取り込み、PR の本文を作って、push と PR 作成のコマンドを利用者に渡す。
9. 利用者が PR を merge commit でマージし、タグを付けて push し、`npm stage` で公開を承認する。
10. npm の `latest`、タグで起動した workflow の結果、npm から入れた版での導入を確かめ、リリースの todo を close する。

## 10. 依存とコードのセキュリティ検査

PJR-P318 で入れた定期の検査と、その扱いである。workflow の定義（`security-audit.yml`・`codeql.yml`）は保護された設定のため、変えるときは利用者の承認のもと feature ブランチで行う。

### 10.1. 検査の一覧

| 検査                      | 設定                                   | いつ流れるか                      | 止めるか                                                   |
| ------------------------- | -------------------------------------- | --------------------------------- | ---------------------------------------------------------- |
| 依存の版の更新            | `.github/dependabot.yml`               | 毎週月曜 9:00（Asia/Tokyo）       | 止めない。PR が届く                                        |
| 脆弱性の修正              | リポジトリの設定（security updates）   | advisory が出たとき               | 止めない。依存ごとの PR が届く                             |
| 配る依存の audit          | `.github/workflows/security-audit.yml` | PR と `publish-specdojo.yml` の前 | ルートの `npm audit --omit=dev` に high 以上があれば止める |
| 開発用・packages の audit | 同上                                   | 同上                              | 止めない。結果を workflow の summary に出す                |
| CodeQL                    | `.github/workflows/codeql.yml`         | PR、`main` への push、毎週月曜    | 止めない。結果は Security タブの code scanning に出る      |

### 10.2. Dependabot の PR の扱い

- PR は既定のブランチ（`main`）へ届く。中身を確かめたら、PR を merge せず、同じ変更を develop 系の feature ブランチで取り込んでから通常の昇格に乗せる。取り込んだ PR は閉じる。
- 開発用の依存はディレクトリごとに 1 本の PR、GitHub Actions は 1 本の PR にまとまる。配る依存（`dependencies`）の版の更新と脆弱性の修正は依存ごとに届く。
- `package.json`・`package-lock.json` は保護された設定のため、取り込みは agent の run ではなく orchestrator が行う。取り込んだ後に `npm run check` と `npm audit --omit=dev --audit-level=high` を流す。

### 10.3. audit の関門の例外

上流が直すまで関門が止まり続ける場合だけ、期限付きの例外を足す。

1. 該当の advisory を扱う登録簿項目を起票する（上流の追跡先と、期限までにすることを書く）。
2. `security-audit.yml` の `AUDIT_EXCEPTIONS` に 1 行足す。書式は `<GHSA-id> <YYYY-MM-DD> <PJR-ID>` で、期限は長くても 30 日とする。
3. 期限を過ぎると関門は再び止まる。延ばすときは登録簿項目に理由を書き、期限を書き換える。直ったら行を消す。

### 10.4. GitHub の設定（利用者が行う）

リポジトリの Settings の Advanced Security（Code security）で、次を有効にする。

- Dependabot alerts と Dependabot security updates（脆弱性の修正の PR）。grouped security updates は無効のままにし、修正を依存ごとに届かせる。
- Secret scanning と push protection。push protection で止まった push は、秘密を消してから push し直す。誤検知の場合だけ理由を選んで通す。
- Private vulnerability reporting（外から脆弱性を知らせてもらう窓口）。
- CodeQL の default setup は有効にしない。`codeql.yml`（advanced setup）と並べて使えない。

### 10.5. npm publish の provenance

- 公開の workflow は Trusted Publishing（`id-token: write`）を使う。公開リポジトリから Trusted Publishing で公開すると、provenance は自動で付く。
- staged publishing（`npm stage publish`）でも付くかは確かめていない。公開した版の npm のページに provenance の表示があるかを確かめ、無ければ `npm stage publish` に `--provenance` を足す。
