---
specdojo:
  id: prj-0001:pjr-jt5j-exec-run-record-layout-check
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-06T15:06:36Z"
  due_on: null
  derived_from:
    - PJR-VH8D
  depends_on:
    - PJR-9BY9
---

# PJR-JT5J 実行記録の置き場所を validate と CI で検査し、ガイドと照らす

## 1. 概要

決まった場所の外のファイルや run のディレクトリの欠けを exec validate と CI で検出し、ガイドの構成図をモジュールと照らすテストを置き、lock・controls/reviews・assessments の置き場所をそろえる（R3・R4、VH8D の #9・#11・#13）

## 2. 入力

- PJR-VH8D の決定（2026-11-07 indie）: 実行記録は run 単位のディレクトリ execution/runs/`<出どころ>`/`<項目 ID>`/`<run ID>`/ に plan.md・result.md・evidence.json・ログを置く（R1）。出どころは register・schedule・job。置き場所を決める処理はコードの 1 つのモジュールにまとめる（R2）。exec validate と CI で置き場所を検査する（R3）。ガイドの構成図をモジュールと照らすテストを置く（R4）。grade/results と jobs/ の定義は外に残す。既存は git mv で移し、パスの欄だけ書き換える

## 3. 完了条件

- `exec validate` が、実行記録の置き場所の外にあるファイル、run のディレクトリで欠けているファイル（plan・result・evidence）、Git の無視の対象になっていない lock を検出し、場所と理由を出す。既存の正常な記録では何も出ない。
- CI で同じ検査を流す workflow の案がある（`.github/workflows/` は保護された設定のため、案を個票の対応結果に書く）。
- ガイドの構成図（docs-structure-guide・plan-result-lifecycle-guide）に書いたディレクトリと、PJR-Z0XR のモジュールが返すディレクトリを照らす単体テストがあり、食い違うと失敗する。
- `routines/.locks/` の扱いを exec の `.locks/` とそろえている（PJR-PZBP で済んでいればそれを確かめる）。ガイドの `controls/reviews/` を実物の `controls/generated/` に直している。`schedule/assessments/generated/` をほかの横断ディレクトリと同じ深さにそろえ、参照するコードとガイドを合わせている。
- 単体テストで、置き場所の外のファイル・欠けたファイル・無視されていない lock の検出を確かめている。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` が通り、親の検証（`test-integration` を含む）が通っている。
- CHANGELOG は未公開の版の節に書き、公開済みの版の節を変えていない。
- 保護された設定（`package.json`・`lefthook.yml`・`.github/workflows/`・`.specdojo/` の設定・agent の定義・`.gitignore` が保護されている場合はそれも）を変える必要があるときは、変えずに案を個票の対応結果に書き、pipeline では報告の `handoff` にも書いている。反映は利用者の承認のもと行う。
- 未決の点は executor が決め、決めた内容と理由を個票の対応結果に書き、pipeline では報告の `handoff` にも書いている。

## 4. 作業内容

| No  | 作業                                   | 担当 | 状態 | メモ                                                            |
| --- | -------------------------------------- | ---- | ---- | --------------------------------------------------------------- |
| 1   | validate に置き場所の検査を足す        | DEV  | done | 共通検査と `--records-only`、CI 案を追加                        |
| 2   | ガイドとモジュールを照らすテストを足す | DEV  | done | 2 ガイドの構成図の親子関係まで照合                              |
| 3   | 細かい置き場所をそろえる               | DEV  | done | controls の説明を修正。routine の移行と assessment の廃止を確認 |

## 5. 対応結果

### 実装と判断

- `src/exec/validate-records.ts` を追加し、`exec validate` の通常実行と `--records-only` で同じ検査を使うようにした。`src/shared/run-records.ts` の配置ポリシーで出どころ・項目・run の階層を判定し、旧配置、run 外の記録、不正な深さ、必須ファイルの欠落を、リポジトリ相対パス・理由コード・説明で報告する。違反があれば終了コード 1 とし、書き換えや補完はしない。
- 再開時の修正: 前回の親 integration 検証で失敗した19件は、`exec run` が project lock を取得してから配置を含む検証を呼ぶ経路だった。事前検証を `exec validate --schedule-only` に限定し、`exec cycle` も同じ呼び出しと表示にそろえた。判断: 記録が生成途中や中断中でも実行・再開できるよう、保存時点の配置検査と着手可否の検証を分ける。通常の `exec validate` と CI 用の `--records-only` は引き続き欠落と lock を検出する。両限定オプションは併用を拒否する。
- runtime lock は実物を列挙し、Git の `check-ignore` を一括実行して無視と追跡の状態を調べる。追跡済み lock も検出するため `--no-index` は使わない。Git の確認が失敗した場合もエラーにする。設定された routine の旧 `.locks/` も対象とする。
- 判断: agent run には plan・result・evidence を必須とし、`execution: human` を明記した result だけは単独で正常とする。実行段ごとに有無が変わる checkpoint・ログは任意とする。進行中、plan 単独生成、明示削除、移行時の欠落も報告し、履歴の黙認リストは設けない。これは R3 の欠落検出と既存の human の生成規則を両立するためである。
- 判断: grade の結果、job の状態 JSON、exec event、比較実験、規約の版、生成物、routine の失敗記録は独立した形式として除外する。PJR-VH8D・[[prj-0001:pjr-9by9-exec-run-record-migration|移行の対応結果]]・[[prj-0001:pjr-pzbp-routine-state-outside-git|routine の移行結果]] に従う。ログ・evidence・checkpoint の内容は読まず、human の判別に result のメタデータだけを使う。
- `tests/src/exec/validate-records.test.ts` に正常な3出どころ、human、欠落、空ディレクトリ、旧配置、不正な出どころ・深さ、symlink、無視されない／追跡済み lock、Git 確認不能、CLI の通常実行と配置限定の終了コードのテストを追加した。`tests/src/exec/run-records.test.ts` は2ガイドの構成図を字下げからパスへ復元し、全出どころの配置モジュールの戻り値と照合するよう強化した。名前が同じでも親ディレクトリが違えば失敗する。
- `docs-structure-guide` の `controls/reviews/` を実物の `controls/generated/` に直し、横断領域直下の生成物と lock の置き場所を記載した。`plan-result-lifecycle-guide` と command reference に検査範囲・例外・終了コードを記載し、CHANGELOG の Unreleased だけに追記した。
- routine lock は PJR-PZBP の `src/routine/storage.ts` で端末側の状態ディレクトリへ移行済みであり、prj-0001 の旧 `.locks/` は存在しない。exec lock は既存の Git 除外規則で無視されるため、設定変更は不要。
- 判断: `schedule/assessments/generated/` は移動しない。[[prj-0001:pjr-jftc-sch-assessment-retirement|PJR-JFTC の廃止決定]] により CLI・schema・実データ・専用テストが既に削除されている。現行の実装・テスト・ガイドに残存参照はなく、実データも存在しない。現行生成物は `schedule/generated/` にあり、ガイドをその状態に合わせた。廃止機能の再導入や履歴の書き換えは不要と判断した。

### CI の保護設定変更案

`.github/workflows/check-run-record-layout.yml` の追加案を次に示す。保護設定は編集していない。利用者の承認を得て反映する。

```yaml
name: Check execution record layout
on:
  push:
    branches:
      - "**"
  pull_request:
  workflow_dispatch:
permissions:
  contents: read
jobs:
  layout:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - name: Check execution record layout and locks
        run: node --import tsx src/specdojo.ts exec validate --project prj-0001 --records-only
      - name: Check guide trees and layout regressions
        run: npm run test:unit -- tests/src/exec/run-records.test.ts tests/src/exec/validate-records.test.ts
```

### 検証と申し送り

- 実データの読み取り検査では499ディレクトリに欠落 645 件（plan 141・result 138・evidence 366）を検出し、配置外ファイルと lock の違反は 0 件だった。旧 evidence の不在や、移行時に plan/result の対を最新試行へ寄せた先行試行を含む。これは正常判定ではないため、上の CI 案をそのまま導入すると失敗する。履歴の捏造・変更は行わず、反映前に利用者が欠落履歴の扱いを決める。検査範囲と例外はガイドに明記した。
- 一時リポジトリで CLI の通常実行と `--records-only` を確認し、正常な記録では終了コード 0、evidence の欠落と旧配置の plan ではパス・理由を表示して終了コード 1 になることを確認した。lock の stdin を使う Git 確認は sandbox 内で応答が完了しなかったため、10秒で確認不能を返すようにした。lock の正常・異常系は追加した単体テストを親 runner で検証する。
- 再開後の CLI smoke では3出どころの正常配置が成功し、通常／配置限定の検査が evidence 欠落を検出すること、`--schedule-only` が欠落を除外しても不正な event JSON は拒否すること、限定オプションの併用を拒否することを確認した。同じ観点と取得中の lock を単体テストにも追加した。sandbox は Node 子プロセス起動を `EPERM` で拒否するため、worktree の実行・再開と auto dry-run の統合経路は親 runner の再検証に委ねる。前回の19件は成功扱いにしていない。
- 変更ファイルの Prettier、履歴リンク検査、カタログ検査、register の派生ビュー生成、ステージ上の実行記録の秘密情報スキャン、`git diff --check` は成功した。カタログには既存の未作成文書・re-export 参照の警告がある。秘密情報スキャンは対象 0 件・検出 0 件であり、新規実装全体のスキャンを意味しない。
- lint・型検査・単体／統合テスト・schema の全件検査は親 runner が実行する。executor の整形・その他の検査結果は最終 evidence で報告する。
- CI 案の承認と反映、既存欠落履歴の扱いの判断、統合後の [[prj-0001:pm-orchestrator-playbook|運用メモ]] に従う PJR-JSEY での実 CLI 確認を申し送る。個票のステータス、登録簿、result は変更していない。

## 6. 関連ドキュメント

- [[prj-0001:pjr-vh8d-execution-records-layout]]: 配置の決定
- [[specdojo:docs-structure-guide]]: 構成図の正本
