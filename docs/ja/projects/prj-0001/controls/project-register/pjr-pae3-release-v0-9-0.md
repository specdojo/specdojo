---
specdojo:
  id: prj-0001:pjr-pae3-release-v0-9-0
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  difficulty: medium
  owner: PO
  registered_at: "2026-11-19T12:48:18Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-20T10:56:09Z"
  conclusion: specdojo 0.9.0・docs-lint 0.5.0・docs-site 0.6.0 を provenance 付きで公開し、npm から入れた版の動作を確かめた
  depends_on:
    - PJR-DM9B
    - PJR-8Z71
    - PJR-8NB8
    - PJR-9JN6
    - PJR-C07H
    - PJR-ZK3T
    - PJR-P318
    - PJR-2HT5
    - PJR-PEJS
    - PJR-4YS7
  commit_type: chore
  commit_scope: release
---

# PJR-PAE3 0.9.0 でリリースする

## 1. 概要

0.8.0 の後の完了分（register と exec の不具合修正、exec queue・exec smoke・specdojo git、依存の audit の解消と関門、kata-slim-2 の型の簡素化など）を 0.9.0 として公開する

## 2. 入力

- 範囲（利用者が 2026-11-19 に B 案で決定）: 新しい機能は止め、develop に統合済みで review の項目を確かめて close してから切る。0.8.0 の後に close した項目は CHANGELOG の対象にする。
- 先に close する項目: runner・CLI の DM9B・8Z71・8NB8・9JN6・C07H・ZK3T、CI の P318（リリースの PR の CI で関門と CodeQL を確かめる）、文書サイトの 2HT5・PEJS・4YS7（利用者がブラウザで確かめる）。
- docs-lint は tinyglobby を外し engines を 22.17 に上げ markdownlint-cli を 0.50 に上げたため 0.5.0 にする。kata-slim-2 の rulebook と recipe の簡素化は個票に属さないため、CHANGELOG に 1 行でまとめる。
- 0.9.0 に入れないもの: PJR-6998 の決定、kata-slim-3、SV9G、planning の track の作り直し、kata-slim-2 の後の型の grade。
- 利用者の決定（2026-11-20）: PJR-08EK（opencode の executor がプロダクトの worktree を編集できない）は 0.9.0 に入れず、0.9.1 に回す。
- 手順は pm-orchestrator-playbook の「リリースの手順」に従う。push・PR の merge・タグ・npm の公開の承認は利用者が行う。期限は未定。

## 3. 完了条件

- `depends_on` の 10 件が close されている。利用者の確認が要る 2HT5・PEJS・4YS7 は、確認の結果で close するか、既知の制限として CHANGELOG に書いて次の版に回すかが決まっている。
- 版を変更内容から決め、利用者の確認を得ている。本体は `0.9.0`、`packages/docs-lint` は `0.5.0`。`packages/docs-site` は前の公開（0.5.0）の後に変更があるかを確かめ、版を上げるかを決める。
- `package.json` と `package-lock.json` の版を上げ、`CHANGELOG.md` に `## [0.9.0] - <日付>` の節を作っている。0.8.0 の公開（PJR-PMK6 の close、2026-11-16T11:13:58Z）の後に close した項目の個票の「CHANGELOG に書く事項」を集めて書き、close の件数と集めた件数を照合している。節のない項目のうち利用者に関わるもの（V141・981V・3VJM・ANKZ など）と kata-slim-2 の型の簡素化は、orchestrator が個票の結論から文案を書いている。
- ルートと `packages/*` の `npm ci` が通り、クリーンな作業ツリーで `npm run check` と `npm audit --omit=dev --audit-level=high` が通る。
- `npm pack` の配布物を空の Git リポジトリへ入れ、`init`・`register add`・`exec run --register`（start から review まで）と、この版で変えた機能（`exec queue`・`exec smoke`・`specdojo git`・`register --commit` の `-m` の繰り返し、`kata show` で簡素化した rulebook が読めること）を確かめている。
- 公開候補が PR の merge commit で `main` へ入り、PR の CI で audit の関門と CodeQL が動いている（PJR-P318）。その commit を指すタグから npm の公開 workflow が起動する。push・PR の merge・タグ・npm の公開の承認は利用者が行う。
- 公開後に npm の `latest`、タグで起動した workflow の結果、npm から入れた版の動作を確かめている。

## 4. 作業内容

| No  | 作業                                                          | 担当         | 状態 | メモ                                                     |
| --- | ------------------------------------------------------------- | ------------ | ---- | -------------------------------------------------------- |
| 1   | 先に close する項目を確かめて close する                      | orchestrator | done | P318 だけはリリースの PR の CI で確かめる                |
| 2   | CHANGELOG の節を集めて書き、件数を照合する                    | orchestrator | done | 対応結果のとおり                                         |
| 3   | release ブランチで版を上げ、check・audit・npm pack を確かめる | orchestrator | done | c1c73d8ca、55643298d で develop へ統合                   |
| 4   | push・PR の merge・タグ・npm の公開の承認                     | PO           | done | 利用者が行った（PR #34、タグ 3 つ、npm の stage の承認） |
| 5   | 公開後の確認                                                  | orchestrator | done | 対応結果の「公開と公開後の確認」のとおり                 |

## 5. 対応結果

### 5.1. 先に close した項目

- runner・CLI の DM9B・8Z71・8NB8・9JN6・C07H・ZK3T は、統合の後に `exec smoke` と実際の run で確かめて close した（2026-11-19）。
- 文書サイトの 2HT5・PEJS・4YS7 は、利用者がブラウザで確かめて close した（2026-11-19）。
- P318 は、リリースの PR #34 の CI で audit の関門と CodeQL が動くのを確かめて close した（2026-11-20）。

### 5.2. CHANGELOG の集め方と照合

- 0.8.0 の公開（PJR-PMK6 の close、2026-11-16T11:13:58Z）の後に close した項目は 49 件。そのうち「CHANGELOG に書く事項」に文案のある 36 件を、0.9.0 の節（利用者から見て動きが変わる点・追加機能・変更・不具合修正）へまとめた。
- 節のない 13 件のうち、V141（runner の修正）と 981V（cdr の型の追加）は個票の結論から orchestrator が文案を書いた。3VJM・ANKZ は非推奨にする作業（PJR-HVQZ）が済んでおらず配る型が変わっていないため外した。JSEY は確認用の項目で利用者への影響がない。残りの 8 件は project の成果物の手直しで、配る型を変えない。
- kata-slim-2 の rulebook と recipe の簡素化は個票に属さないため、1 行にまとめた。0.8.0 と比べて変えた 137 ファイルで、空白を除いた文字数は 739,894 から 559,450（約 24% 減）。

### 5.3. release ブランチの確認

- `feature/prj-0001/release-v0.9.0` で specdojo を 0.9.0、`@specdojo/docs-lint` を 0.5.0、`@specdojo/docs-site` を 0.6.0 に上げ、CHANGELOG の 0.9.0 の節を書いた（c1c73d8ca）。55643298d で develop へ統合した。
- ルートと `packages/*` の `npm ci`、`npm run check`、`npm audit --omit=dev --audit-level=high`、`npm run test:integration`、`npm run docs:build` が通った。
- 3 つの tarball を空の Git リポジトリへ入れ、`init --yes --provider claude --exec`、`-m` を 2 つ付けた `register add --commit`（件名と本文で commit され、index は空）、`exec run --register`（claude の executor・reporter で start から review、統合まで）、`kata show`（簡素化した pjr-rulebook、新しい cdr-rulebook）、`exec queue`・`exec smoke` の help、`specdojo git`、`where exec`、`specdojo-docs-lint markdownlint`、`specdojo-docs-site build`（トップのページと project のトップのページが生成された）を確かめた。

### 5.4. リリースの PR で足した対応

- Dependabot alerts を有効にした後、docs-site の配る依存に high 11 件があると分かった。利用者の決定（案 A）で、0.9.0 の前に docs-site の lockfile を `npm audit fix` で直した（PJR-H1PQ、bcca5023f、e43095b63）。残りは H1PQ で 0.9.1 に扱う。
- CodeQL は既存のコードに 8 件の alert を出した。src の 5 件は PJR-A77M で 0.9.1 に直す。テストの 3 件は利用者が「used in tests」で dismiss した。結果の check `CodeQL` は fail のまま merge した（main にブランチの保護は無い）。
- vscode-specdojo の開発用の依存への Dependabot の PR 4 件（#30〜#33）は merge せず、0.9.1 で H1PQ として develop に取り込む。

### 5.5. 公開と公開後の確認（2026-11-20）

- 利用者が PR #34 を merge commit で merge し（e160d8a39）、`v0.9.0`・`docs-lint-v0.5.0`・`docs-site-v0.6.0` のタグを e160d8a39 に付けて push した。
- タグで起動した 4 つの workflow（specdojo・docs-lint・docs-site の公開と、文書サイトの deploy）が成功した。specdojo の公開では `audit` の関門が通ってから stage された。
- 3 つの package は staged publishing で stage され、ログに provenance の署名が出ていた。利用者が npm の stage を承認した。手元の npm 11.12.1 には `npm stage` が無く、`npx npm@^11.15.0` でも手元の token では 401 になったため、利用者は 2FA を通した経路で承認した。
- npm の `latest` は specdojo 0.9.0、`@specdojo/docs-lint` 0.5.0、`@specdojo/docs-site` 0.6.0 になり、3 つとも provenance（`https://slsa.dev/provenance/v1`）が付いている。staged publishing でも provenance は付くため、`--provenance` を足す案は要らない。
- 空の Git リポジトリへ npm から 3 つを入れ、`--version`（0.9.0）、`config init`、`register scaffold`・`add`・`build`、`kata list`（`node_modules` から解決）、`specdojo-docs-lint`・`specdojo-docs-site` の起動を確かめた。`npm audit --omit=dev` は 0 件だった。

## 6. 関連ドキュメント

- [[prj-0001:pjr-pmk6-release-v0-8-0|PJR-PMK6]]（前のリリース）
- [[prj-0001:pm-orchestrator-playbook]]（リリースの手順）
