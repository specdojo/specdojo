---
specdojo:
  id: prj-0001:pjr-h2v8-edit-plan-implementation-evidence
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-05T03:42:21Z"
  derived_from:
    - PJR-Q9AW
    - PJR-3APD
---

# PJR-H2V8 書き足す edit の plan で実装の根拠を読めるようにし、未作成の依存で止めない

## 1. 概要

draft・fully-guided・recipe-guided の plan に、カタログの `evidence_refs` を読み取り専用の実装の根拠として載せる。まだない `depends_on` の成果物は未作成と示し、異常終了の理由にしない。

## 2. 入力

- stsd の試行で、fully-guided の executor が、まだない依存の成果物（bdd-exec-state・bdd-exec-event）を「依存未解決」とみなして止まった。同じ「依存未解決」の条件を持つ draft の executor は止まらず、解釈が executor によって分かれた（PJR-Q9AW、2026-11-05）
- fully-guided の plan が読んでよい資料に実装（src/）は含まれず、カタログの `evidence_refs` を plan に載せるのは retrofit だけ（plans-generation.ts の `_IMPLEMENTATION_EVIDENCE_`）。業務仕様は現行の実装をもとに書く方針（2026-11-04）と合わない
- 利用者は案 B（`evidence_refs` を読める資料に加え、未作成の依存は仮置きにして止まらない）を選んだ（2026-11-05）

## 3. 完了条件

- `draft`・`fully-guided`・`recipe-guided` の edit plan に、対象の成果物のカタログの `evidence_refs` を、読み取り専用の実装の根拠として載せている（`retrofit` と同じ展開）。`evidence_refs` がない成果物とカタログのない成果物では、節を載せないか「なし」と示し、異常終了の理由にしない。
- これらの plan の「参照してよい文書」に実装の根拠を加え、実装の根拠と rulebook・`depends_on` が食い違うときの扱い（事実は実装、書き方は rulebook、意図は `depends_on` と個票の入力）を、`retrofit` の考え方に合わせて書いている。実装の根拠は読むだけで、変更許可範囲と commit の対象に入らない。
- plan の `depends_on` の一覧で、まだない成果物を「未作成」と示し、wikilink ではなくインラインコードで書いている。未作成の依存は異常終了の理由にせず、その内容を推測で埋めずに `_TODO_` か `_ASSUMPTION_` で残すと、異常終了の条件と参照の方針の両方に書いている。異常終了の条件の「依存未解決」の言い回しは、何を指すかが読み取れる形に直している。
- `condense` など内容を書き足さない approach と、review の plan は変えていない。変える必要があると判断した場合は、理由を個票の対応結果に書く。
- 単体テストで、`evidence_refs` があるとき・ないとき・カタログがないときの plan の節と、未作成の依存の表示を確かめている。
- 関連するガイド（approach の説明、exec の運用）と CHANGELOG の未公開の版の節を直している。公開済みの版の節は変えない。
- 作業を終える前に `npm run typecheck`、`npm run lint:ts`、`npm run -s lint:md`、`npm run test:unit` を流し、親の検証がすべて通っている。
- 保護された設定（agent の定義・名簿・`exec-defaults.yaml`・`package.json` など）は変えない。変える必要があれば、案を個票の対応結果に書き、報告の `handoff` にも書く。

## 4. 作業内容

| No  | 作業                                                   | 担当 | 状態 | メモ                                                       |
| --- | ------------------------------------------------------ | ---- | ---- | ---------------------------------------------------------- |
| 1   | plan の生成で `evidence_refs` と未作成の依存を扱う     | DEV  | done | 対象の 3 approach の edit に限定                           |
| 2   | 3 つの edit のテンプレートの参照と異常終了の条件を直す | DEV  | done | 根拠の責務と未作成時の仮置きを明記                         |
| 3   | テスト・ガイド・CHANGELOG を直し、検査を通す           | DEV  | done | テスト追加済み。親の検証は executor 終了後に runner が実行 |

## 5. 対応結果

- `plans-generation.ts` で `draft`・`fully-guided`・`recipe-guided` の edit に実装エビデンスを展開し、`evidence_refs` 未指定・カタログなしでは「なし」と表示する。`plans-core.ts` は、この 3 approach から指定した場合だけ未作成の依存をインラインコードと「未作成」で示す。既存の依存は frontmatter の ID による wikilink を維持する。
- 3 つの edit テンプレートに、実装の根拠を読み取り専用とし、`targets`・変更許可範囲・commit 対象へ含めないことを明記した。現在動作の事実は実装、書き方は rulebook、意図は `depends_on` と個票の `入力` で確認し、未承認の乖離は意図を保持して記録する。`recipe-guided` の書き方は既存方針に合わせて recipe を基準とし、rulebook を新たな必須基準にはしない。
- 未作成の依存は止まる理由にせず、推測で補わず仮置きと次のアクションを残すことを、参照方針と異常終了条件の両方へ記載した。「依存未解決」は、実行に必要なツール・パッケージの依存を解決できない場合と具体化した。
- `plan-implementation-evidence.test.ts` に、3 approach の実装の根拠あり・なし、カタログなしの register、既存／未作成／カタログで解決できない依存、プロダクト文書の ID、`targets` の不変を確認するテストを追加した。review と `condense`・`freeform` の参照範囲・表示を維持する回帰テストも追加し、これらのテンプレートは変更していない。
- [[specdojo:ryu-guide|実践の進め方ガイド]]・[[specdojo:exec-operation-guide|exec運用ガイド]]・[[specdojo:plan-result-lifecycle-guide|plan/resultライフサイクルガイド]] と CHANGELOG の Unreleased を更新した。公開済み版の節と保護された設定は変更していない。
- 親 runner が型検査・TypeScript／Markdown などの lint・schema・単体／統合テストを executor 終了後に実行するため、sandbox 内では重複実行していない。結果は親の evidence を正とする。
- executor では変更ファイルの Prettier 整形、`npm run validate:history-links`、`node --import tsx tools/catalog-validate-if-configured.mjs`、`node --import tsx src/specdojo.ts register build` を実行し、すべて成功した。カタログ検査には、未作成文書の `based_on` を確認できない警告がある。変更した YAML 成果物はなく、ファイル単位の schema 検査は非適用。
- 申し送り: 統合後は運用メモに従い、PJR-JSEY で今回の exec 変更の動作を確認する。result への記入と親検証は reporter／runner が担当する。

## 6. 関連ドキュメント

- [[specdojo:ryu-guide]]: approach の定義
- `docs/ja/specdojo/exec-templates/xep-retrofit-template.md`: 実装の根拠の展開と扱いの前例
- `src/exec/plans-generation.ts`・`src/exec/plans-core.ts`: plan の生成
