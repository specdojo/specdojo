---
specdojo:
  id: prj-0001:pjr-3mts-uis-open-document-by-id
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  difficulty: medium
  owner: BA
  registered_at: "2026-11-17T14:21:19Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-17T23:28:50Z"
  conclusion: uis の代表の画面仕様（uis-open-document-by-id）を実装の文言と分岐に合わせて書き、uis-rulebook を 74%・uis-sample を 70% に簡潔にした。grade は 3 件とも pass で major なし
  derived_from:
    - PJR-MNM5
  commit_type: docs
  commit_scope: kata
---

# PJR-3MTS uis の代表の画面仕様を書き、uis の rulebook と sample から運用の記述を外す

## 1. 概要

カタログに足した uis-open-document-by-id（VS Code の ID で文書を開く入力）を書き、kata-slim と同じ一覧で uis-rulebook と uis-sample を簡潔にする

## 2. 入力

- uis はカタログに代表の成果物がなかったため kata-slim の track に入らなかった。利用者が 2026-11-17 に、VS Code 拡張の「SpecDojo: Open Document by ID」を代表の画面にする案（A）を選び、orchestrator が dct-user-interface-model に uis-open-document-by-id を足した
- 実装は packages/vscode-specdojo/src/extension.ts の specdojo.openById。入力欄（prompt「Enter a SpecDojo document ID」）、索引がないときの警告「SpecDojo index not found. Run: specdojo index build」、ID が見つからないときの警告「ID not found: `<id>`」、索引の行番号つきの文書を開く処理がある

## 3. 完了条件

- カタログの `uis-open-document-by-id` を、[[specdojo:uis-rulebook|uis-rulebook]] に沿って `docs/ja/product/010-business-specs/040-user-interface-model/uis-open-document-by-id.md` に書く。表示項目・操作・遷移・入力の検証・警告の表示と利用者の次の手を、実装（`specdojo.openById`）の文言と分岐に合わせる。実装にない振る舞いは書かず、決まっていない点は `_UNDECIDED_` で残す。
- uis-rulebook から、どの成果物にも共通する文書の運用の記述を外し、共通の正本への参照にする。手本は [[prj-0001:pjr-8s4t-sld-kata-slim-pilot|PJR-8S4T]] の対応結果の「他の型へ広げるときの一覧」と、改訂済みの sld-rulebook である。大きさは、空白を除いた文字数で今の 8 割以下を目安にする。
- uis-sample から、文書の運用の記述と同じ判断の言い直しを外す。結論（表示・操作・検証・エラーの判断）は変えない。大きさは、空白を除いた文字数で今の 7 割以下を目安にする。
- 前後の文字数を個票の対応結果に書く。
- 型の grade と成果物の grade は、統合の後に orchestrator が流す。executor は grade を実行せず、作業内容の該当の行を open のまま残す。完了条件の外の指摘は記録だけにする。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く（PJR-EPQ3）。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:catalog` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                            | 担当         | 状態 | メモ                                                                          |
| --- | ----------------------------------------------- | ------------ | ---- | ----------------------------------------------------------------------------- |
| 1   | 代表の画面仕様（uis-open-document-by-id）を書く | BA           | done | `specdojo.openById` の文言と分岐に合わせて書いた。未決の 2 点は `_UNDECIDED_` |
| 2   | uis-rulebook から運用の記述を外す               | BA           | done | 6,025 字から 4,472 字（74%）                                                  |
| 3   | uis-sample から運用の記述と言い直しを外す       | BA           | done | 8,493 字から 5,945 字（70%）                                                  |
| 4   | 統合の後に型と成果物を grade し、結果を書く     | orchestrator | done | 2026-11-18 に grade した。結果は対応結果の「grade の結果」                    |

## 5. 対応結果

### 5.1. 実施内容

- 画面仕様: [[uis-open-document-by-id]] を書いた。入力欄の案内文と入力例、取り消し（Esc・空の確定）、索引の有無を先に確かめてから ID を照合する順序、索引の行番号つきの項目を行で開く処理、警告 2 種の文言と次の手を、`packages/vscode-specdojo/src/extension.ts` の `specdojo.openById` に合わせた。名前空間のない ID を読み替えない点（wikilink との違い）、前後の空白を補わない完全一致の照合、1 つ目のワークスペースフォルダだけを見る点も実装どおりに書いた。
- 実装にない振る舞いは書かず、次を `_UNDECIDED_` で残した: 索引にある ID のファイルがないときの表示（拡張は捕まえず、VS Code のコマンド失敗の表示に任せている）、索引のファイルを消しても読み込み済みの索引を使い続ける点を許すか。
- uis-rulebook: 1.1 節の利用者の表（役割）、Frontmatter の表の `status` の作成・承認の指定と未定義項目の禁止の行、メタ情報の良い例・悪い例の節を外した。全体方針に「共通の運用」を 1 項目置き、役割はメンバー定義、`status`・承認・改訂と廃止・未決事項の引き継ぎは [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] を参照する形にした。Frontmatter は sld-rulebook と同じく正本を参照し、uis 固有の値（`type: ui`、`part_of`・`based_on` の書き方）だけを残した。「メモ / 将来課題」は論点と影響を書き、管理台帳の区分・担当・判断時期の列は求めないこととした。同じ判断を 1 か所に書く方針（入力の条件は「バリデーション」、回復は「エラー表示と利用者の次の手」を正とする）を全体方針と禁止事項に足した。記述ガイドは sld-rulebook の判断基準・良い例・悪い例の形にそろえた。
- uis-sample: 8.3 節の同梱 sample の承認と公開前確認（PO の承認、agent の扱い、QE の lint・grade 確認）を外した。8.1 節・8.2 節の確認担当・判断時点・報告先の列と PM の登録の段落を外し、仮定と将来の拡張を論点と影響の箇条にした。言い直しの除去: バリデーションの「違反時の扱い」をエラーの表の「状態の扱い」へ寄せて対応エラーの名前だけにし、エラーの表の入力違反の発生条件はバリデーションの行を参照する形にした。操作の表の「取引中止」「再ログイン」の行は遷移の表と同じ内容のため外して参照にし、会計処理中の連打の文（状態と操作可否と同じ）、権限のない利用者の文（エラーの「権限不足」と同じ）、1.1 節と 8 章の仮定の二重の説明をまとめた。
- 結論（表示値と税の計算、操作可否、遷移、入力の境界、エラーごとの表示要点と回復）は変えていない。

### 5.2. 大きさ

測り方は PJR-8S4T と同じで、空白（改行を含む）を除いた文字数から表の区切り行を除いた数。括弧内は区切り行を含む文字数とバイト数。

| 文書                    | 前                              | 後                             | 比  |
| ----------------------- | ------------------------------- | ------------------------------ | --- |
| uis-rulebook            | 6,025 字（7,298 字・19,016 B）  | 4,472 字（4,775 字・12,787 B） | 74% |
| uis-sample              | 8,493 字（10,885 字・35,063 B） | 5,945 字（7,344 字・25,023 B） | 70% |
| uis-open-document-by-id | なし（新規）                    | 約 2,700 字                    | -   |

### 5.3. 迷った点と決めた内容

- ファイル名の規則: rulebook は `uis-<番号>-<短い日本語名>.md` を求めていたが、カタログの path は `uis-open-document-by-id.md` で、ID 規則（`uis-<kebab-case>`）とも合わない。カタログに合わせ、rulebook の規則を `uis-<term>.md`（sld と同じ形）に改めた。ほかに `uis-` の成果物はなく、影響はこの 1 件に閉じる。
- 文書 ID: 同じディレクトリの `bds-progress-report`・`clis-exec-commands` に合わせ、名前空間のない `uis-open-document-by-id` にした。
- 「画面」の範囲: rulebook の対象に「エディタ拡張の入力欄」を足した。VS Code のコマンドの入力欄を UIS で扱うのは利用者の選んだ案 A によるため。
- 索引がないときの次の手: 警告の文言どおり `specdojo index build` を案内する。索引の作成は拡張ではなく CLI が担うため、画面仕様では手順を書かない。
- 共通の正本への追記: 不要と判断した。外した記述はドキュメントメタ情報標準で賄える（PJR-8S4T と同じ判断）。
- 保護された設定の変更は不要だった。

### 5.4. CHANGELOG に書く事項

- 区分: 追加。文案: VS Code 拡張の「SpecDojo: Open Document by ID」の画面仕様（uis-open-document-by-id）を追加しました（PJR-3MTS）。
- 区分: 変更。文案: 画面仕様（uis）の rulebook と sample から、役割・承認・公開前確認など共通の運用の記述を外し、ドキュメントメタ情報標準への参照にしました。入力の条件はバリデーション、回復はエラーの表を正とし、sample を約 3 割小さくしました。ファイル名の規則を `uis-<term>.md` に改めました（PJR-3MTS）。

### 5.5. grade の結果

2026-11-18 に orchestrator が型（run-id `grade-kata-slim-20261118`）と成果物（run-id `grade-uis-open-document-by-id-20261118`）を `sol-review-executor` で grade した。

| 文書                    | 判定 | 点数 | major |
| ----------------------- | ---- | ---- | ----- |
| uis-rulebook            | pass | 97   | 0     |
| uis-sample              | pass | 91   | 0     |
| uis-open-document-by-id | pass | 93   | 0     |

minor の指摘は grade の結果に記録した。利用者の方針（2026-11-17）により直さない。

### 5.6. 残課題

- 完了条件の外の気づき（記録のみ）: `specdojo.openById` は索引にあるファイルが開けないときの扱いを持たず、索引のファイルの削除でも読み直さない。直すかは画面仕様の `_UNDECIDED_` が決まってから判断する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-mnm5-kata-slim]]
- [[prj-0001:pjr-8s4t-sld-kata-slim-pilot]]
