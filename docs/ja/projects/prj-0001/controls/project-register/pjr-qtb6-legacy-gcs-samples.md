---
specdojo:
  id: prj-0001:pjr-qtb6-legacy-gcs-samples
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-17T22:47:12Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-18T11:17:10Z"
  conclusion: mip-index-sample へ反映し、index.md の 2 行を外し、旧 sample を local/legacy-samples/ へ移して git rm した。履歴は消さない
---

# PJR-QTB6 古い駄菓子屋の sample（sample-gcs-*）の中身を specdojo の sample へ反映し、local/ へ移す

## 1. 概要

docs/ja/sample-gcs-product・sample-gcs-projects・sample-gcs-story の古い sample のうち、今の specdojo の sample に足すと役に立つ記述を反映し、ディレクトリを local/ へ移して git の管理から外す。

## 2. 入力

- 利用者の要望（2026-11-18）: docs/ja/sample-gcs-product・sample-gcs-projects・sample-gcs-story は古い sample の文書で、local 以下に移し、git の履歴からも消したい。内容のうち specdojo の sample に反映したほうがよいものは反映したい
- orchestrator の調べ（2026-11-18）: sample-gcs-product は 74 ファイル（業務仕様・外部 IF 仕様・アーキテクチャ、日本語ディレクトリ名の旧構成）、sample-gcs-story は 13 ファイル（物語、484KB）、sample-gcs-projects は .gitkeep の 3 ファイルだけ。参照は docs/ja/index.md の表の 2 行と、過去の登録簿・実行の記録（書き換えない）
- 利用者の決定（2026-11-18）: git の履歴からの削除は履歴の書き換えと強制 push を伴い、記録に書かれた commit の hash が全部変わるため、todo では手順と影響の調べに留めて `_UNDECIDED_` で残す。実施は決めた後に利用者が行う
- 利用者の決定（2026-11-18）: local/ は git の管理外のため、exec の worktree では移せない。反映を exec run で先に行い、統合の後に orchestrator が承認を得て local/ への複製と git rm を行う
- 利用者の決定（2026-11-18）: git の履歴からは消さない。local/ への移動（複製と git rm）は進める

## 3. 完了条件

- `docs/ja/sample-gcs-product/` と `docs/ja/sample-gcs-story/` の文書を、型ごとに今の specdojo の sample（`docs/ja/specdojo/samples/`）と見比べる。今の sample にない、役に立つ記述（具体例・判断・図など）だけを今の sample へ反映する。
- 型ごとに、反映したもの・反映しなかったものと理由を、個票の対応結果に表で書く。
- 今の sample の結論と、kata-slim（[[prj-0001:pjr-mnm5-kata-slim|PJR-MNM5]]）で外した運用の記述や言い直しは戻さない。反映した sample は、その rulebook と `sample-authoring-standard` に合っている。
- `docs/ja/index.md` の表から `sample-gcs-projects/` と `sample-gcs-product/` の 2 行を外す。過去の登録簿と実行の記録にある名前は書き換えない。
- `docs/ja/sample-gcs-*` は executor が消したり移したりしない。`local/` への複製と `git rm` は、統合の後に orchestrator が利用者の承認を得て行う。
- git の履歴から消す件は、executor は履歴の書き換えも push もしない。手順（`git filter-repo` など）と影響を対応結果に書き、やるかどうかは `_UNDECIDED_` で残す。影響には、commit の hash を書いている記録（登録簿のイベント・実行の記録・個票）の数え上げ、worktree とブランチ、clone の作り直しを含める。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く。
- `npm run lint:md`・`npm run docs:build` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                                    | 担当         | 状態 | メモ                                                                                                      |
| --- | ------------------------------------------------------- | ------------ | ---- | --------------------------------------------------------------------------------------------------------- |
| 1   | 古い sample と今の sample を型ごとに見比べる            | BA           | done | 「型ごとの反映の判断」の表                                                                                |
| 2   | 役に立つ記述を今の sample へ反映し、判断を表に書く      | BA           | done | `mip-index-sample` へ反映した                                                                             |
| 3   | `docs/ja/index.md` の表から古い sample の行を外す       | BA           | done | 2 行を外した                                                                                              |
| 4   | 履歴から消す手順と影響を調べて書く                      | BA           | done | 「git の履歴から消す件」の節。履歴からは消さないと決めた                                                  |
| 5   | 統合の後に `local/` へ複製し、`git rm` する（承認の後） | orchestrator | done | 2026-11-18 に orchestrator が `local/legacy-samples/` へ複製し、90 ファイルの一致を確かめて `git rm` した |

## 5. 対応結果

### 5.1. 実施内容

- `docs/ja/sample-gcs-product/` の 74 ファイルと `docs/ja/sample-gcs-story/` の 13 ファイルを読み、型ごとに `docs/ja/specdojo/samples/` の sample と見比べた。`docs/ja/sample-gcs-projects/` は `.gitkeep` の 3 ファイルだけで、見比べる中身がない。
- 古い sample の多くは、rulebook へのリンクだけの README か、駄菓子屋ではない一般の小売例の表で、今の sample のほうが結論も具体例も詳しい。今の sample にない具体例があったのは移行の 3 文書（業務移行方針・データ移行設計・カットオーバー計画）だけで、雛形のままだった [[specdojo:mip-index-sample]] を rulebook の 9 章の構成で書き直して反映した。
- `docs/ja/index.md` の「ドキュメントの主な領域」の表から `sample-gcs-projects/` と `sample-gcs-product/` の 2 行を外した。登録簿と実行の記録の名前は書き換えていない。ほかに `sample-gcs` を参照する文書はない（`git grep` で確認）。
- `docs/ja/sample-gcs-*` は消しても移してもいない。

### 5.2. 型ごとの反映の判断

| 古い sample                                                                                            | 見比べた今の sample                                                          | 判断       | 理由                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 業務移行方針・データ移行設計・カットオーバー計画（サンプル.md）                                        | `mip-index-sample`                                                           | 反映した   | 1 週間の並行記録、前日の最終棚卸、当日午前の取り込みと動作確認・午後の本番利用、移行対象（現在庫・常連客）は今の sample になかった。今の sample のノートの名前・役割名・つけ残高の照合に合わせて書いた |
| 概念データフロー図 4 件（全体・調達・販売・会計）                                                      | `cdfd-overview-sample`・`cdfd-sample`・`cdfd-uc-sample`                      | 反映しない | 今は 10 領域・5 グループ・D2 記法で、旧の 3 グループ・Mermaid・金庫と銀行口座の物理保管と結論が違う。購買の取りやめは詳細 CDFD の範囲にしてある                                                        |
| 全体概念クラス図                                                                                       | `ccd-sample`                                                                 | 反映しない | 今は販売の追跡に対象を絞り、在庫・発注を対象外と明記している。旧のレジ記録・仕入記録・在庫記録を足すと範囲の結論が変わる                                                                               |
| 商品・お金の概念状態遷移図とステータス一覧                                                             | `stsd-sample`（`cstd-sample` は deprecated）                                 | 反映しない | 商品は今の STSD が受入から販売・返品まで遷移 ID 付きで定めている。お金の状態は新しい STSD を 1 本足すことになり反映の範囲を超える。釣銭準備金と母屋金庫の扱いは `sld-sample` にある                    |
| 概念データストア一覧・保管場所一覧                                                                     | `cdsd-sample`・`sld-sample`・`cdfd-overview-sample` のデータストア           | 反映しない | 今の sample が保管先・正本区分・処分の条件まで持つ。銀行口座と会計帳簿は本格会計で、初期リリースの対象外                                                                                               |
| アクセス制御（つけ限度額の変更は店主だけ）                                                             | `opd-access-control-sample`                                                  | 反映しない | 今の sample が駄菓子屋ではない一般例（Ops Lead など）のため、1 行足すと題材が混ざる。書き直しは別の項目にする（申し送り）                                                                              |
| 監査・モニタリング（顧客情報とつけ残高の調整の監査ログ、5 分ごとの死活監視）                           | `opd-monitoring-sample`・`sysd-cross-cutting-policy-sample` の `scp-LOG-001` | 反映しない | `opd-monitoring-sample` は同じく一般例。監査の追跡は `scp-LOG-001` が実行主体・時刻・取引で定めている                                                                                                  |
| エラー処理（「今は記録できません。ノートに書いておいてください」）                                     | `sysd-cross-cutting-policy-sample` の `scp-ERR-001`                          | 反映しない | 今は失敗を未実施・結果不明・警告に分けて次の手を示す結論で、一律にノートへ書かせる旧の方針と違う                                                                                                       |
| 実装データフロー図・実装クラス図・シーケンス図・実装画面仕様・DB 論理/物理設計・バッチ・設定パラメータ | `sysd-*`・`clis-sample`・`uis-sample` など                                   | 反映しない | 旧は Web API と DB の構成で、今の CLI とローカル保存の構成と結論が違う。クラス名・API・物理型は `sample-authoring-standard` が sample に書かない実装詳細にあたる                                       |
| テスト戦略・観点・単体・結合・システム・受け入れテスト                                                 | `utc-sample`・`itc-sample`・`stc-sample`・`atc-sample`                       | 反映しない | 一般の小売例と空のプレースホルダで、駄菓子屋の具体例は観点 1 行だけ。今の sample のほうが詳しい                                                                                                        |
| 業務仕様・外部 IF・アーキテクチャ・受入条件・非機能要件の README                                       | 各型の sample                                                                | 反映しない | rulebook へのリンクと型の説明だけで、sample の中身がない                                                                                                                                               |
| `sample-gcs-story`（あらすじと人物の画像 12 枚）                                                       | `sample-authoring-standard` の「共通サンプル文脈」                           | 反映しない | あらすじ自身が標準を正本と書いており、固有の中身は 1 段落だけ。sample には人物名を書かないため、人物の画像は使わない                                                                                   |

### 5.3. 迷った点と決めたこと

- `opd-access-control-sample` と `opd-monitoring-sample` は共通サンプル文脈に沿っていない。古い sample の 1 行を足すと題材が混ざるため反映せず、駄菓子屋の文脈での書き直しを別の項目にすることを申し送った。
- `mip-index-sample` は雛形のままで rulebook の 9 章を満たしていなかった。古い sample の箇条だけを足すと rulebook に合わないため、9 章の構成で書き直した。切替日は共通サンプル文脈の「リリース日程は未確定」に合わせて `_UNDECIDED_`、午前に作業して午後から本番にする理由は `_ASSUMPTION_` とした。
- 下位の `dmd-index`・`mtp-index`・`cop-index`・`otp-index` は product の成果物 ID としてバッククォートで書いた。同じ型の sample は駄菓子屋の具体例を持たない雛形のため、wikilink にしなかった。
- 古い sample はお金の状態（売上金・レジ現金・保管金・銀行預入金）を持つが、今の sample に STSD を 1 本足すのは「今の sample への反映」を超えるため見送った。

### 5.4. git の履歴から消す件

決定（2026-11-18、利用者）: git の履歴からは消さない。以下の手順と影響は、判断の材料として残す。

手順（案）:

1. 全 worktree の作業を終え、未 merge のブランチと stash（今 4 件）を片付ける。
2. ミラー clone を取り、バックアップとして別の場所に残す。
3. `git filter-repo` を入れる（今の環境には入っていない）。消すパスは今の 3 つと、改名前の `docs/sample-gcs-product-docs/`・`docs/sample-gcs-project-docs/`・`docs/sample-gcs-story/` を合わせた 6 つとする。例: `git filter-repo --invert-paths --path docs/ja/sample-gcs-product --path docs/ja/sample-gcs-projects --path docs/ja/sample-gcs-story --path docs/sample-gcs-product-docs --path docs/sample-gcs-project-docs --path docs/sample-gcs-story`
4. `git log --all -- <消したパス>` が空になったことを確かめ、`origin`（GitHub）の全ブランチとタグへ強制 push する。
5. GitHub の PR の参照とキャッシュに古い commit が残るため、完全に消すには GitHub のサポートへ削除を依頼する。
6. ほかの clone と worktree はすべて作り直す。

影響（2026-11-18 の数え上げ）:

- 書き換わる commit: パスを最初に足した `40bee99f4`（2026-01-02）から後の約 11,540 件で、全 11,703 件のほぼすべての hash が変わる。パスに触れる commit は 37 件。
- commit の hash を書いた記録: 40 桁の hash を含むファイルが、登録簿のイベント 260 件、個票 6 件、`execution/runs` 170 件、`execution/exec` 7 件、`execution/reports` 1 件。9 桁の短い hash らしい文字列を含むファイルが、個票 165 件、ほかの記録 191 件（hex の偶然の一致を含む概数）。`docs/` 外では `tests/src/exec/repo-trace.test.ts` と `docs/ja/specdojo/guides/docs-structure-guide.md` が 40 桁の hash を含む。これらの hash は書き換え後に指す commit がなくなる。記録は書き換えない方針のため、対応の表（旧 hash → 新 hash）を残すかどうかも決める必要がある（`git filter-repo` は `.git/filter-repo/commit-map` に出力する）。
- worktree とブランチ: worktree 18 件、ブランチ 71 件（リモート追跡を含む）、タグ 28 件のすべてが書き換えの対象になり、worktree は作り直しになる。
- clone: 利用者と agent の環境の clone をすべて作り直す。古い clone から push すると、消した履歴が戻る。
- 確認できなかった点: 改名前（`40bee99f4` の前）に別の名前のディレクトリで同じ中身があったかは、executor の権限で木を見られず確かめていない。実施前に orchestrator が確認する。

### 5.5. CHANGELOG に書く事項

- 区分 Changed: 「移行計画の sample（`mip-index-sample`）を rulebook の 9 章の構成で書き直し、駄菓子屋きぬやの並行記録・最終棚卸・切替日のタイムラインの具体例を載せた。」
- 区分 Removed: 「`docs/ja/index.md` の表から古い駄菓子屋の sample（`sample-gcs-projects/`・`sample-gcs-product/`）の行を外した。」

### 5.6. 申し送り

- 作業内容の No.5（`local/` への複製と `git rm`）は、統合の後に orchestrator が利用者の承認を得て行う。
- `opd-access-control-sample` と `opd-monitoring-sample` を共通サンプル文脈で書き直す項目を起票するか、利用者が決める。
- 同じ移行系の `dmd-index-sample`・`mtp-sample`・`cop-index-sample`・`otp-index-sample` も雛形のままで、`mip-index-sample` と合わせて駄菓子屋の具体例にするかを決める。

## 6. 関連ドキュメント

- [[specdojo:sample-authoring-standard]]
- [[prj-0001:pjr-mnm5-kata-slim]]
