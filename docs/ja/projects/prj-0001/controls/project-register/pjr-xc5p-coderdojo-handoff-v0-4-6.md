---
specdojo:
  id: prj-0001:pjr-xc5p-coderdojo-handoff-v0-4-6
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: note
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-25T04:25:17Z"
---

# PJR-XC5P coderdojo-lessons への申し送り：v0.4.6 で直った項目と移行の手順

## 1. メモ

specdojo 0.4.6 を 2026-10-25 に公開した（[[prj-0001:pjr-ntwd-release-v0-4-6|PJR-NTWD]]、npm の dist-tag `latest`）。利用者の project（coderdojo-lessons-specdojo の prj-0001）から報告された次の項目が直っている。

| 項目                                                           | 直ったこと                                                                                                                                                         |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [[prj-0001:pjr-ss72-maintenance-plan-md036\|PJR-SS72]]         | レビュー観点のない project で、kata の見直しの plan が着手の checkpoint の commit で止まらない                                                                     |
| [[prj-0001:pjr-68kr-checkpoint-failure-summary\|PJR-68KR]]     | hook の失敗の要約が、空白を含む step 名でも、失敗した step と最初の error の行を挙げる                                                                             |
| [[prj-0001:pjr-pm2r-external-project-specdojo-repo\|PJR-PM2R]] | `external_projects` で SpecDojo 自身のリポジトリへ起票できる                                                                                                       |
| [[prj-0001:pjr-r1fb-completion-record-destination\|PJR-R1FB]]  | 完了条件の記録の書き先が、個票の対応結果と executor の報告の `handoff` になった。`handoff` は result の申し送りへ転記される                                        |
| [[prj-0001:pjr-84f7-scaffold-slidev\|PJR-84F7]]                | `init --slidev`・`config scaffold --slidev` で Slidev を入れられる。Dev Container の preset `full` では既定で入る                                                  |
| [[prj-0001:pjr-6hs2-kata-companion-files\|PJR-6HS2]]           | kata の付属のファイル（`lsd-slidev-sample.css` など）が別の kata として出ない。`kata eject` で kata と一緒に写る                                                   |
| [[prj-0001:pjr-jjby-update-authoring-revalidation\|PJR-JJBY]]  | kata ができた後も、担当や期限だけの `register update` が通る                                                                                                       |
| [[prj-0001:pjr-50yh-markdownlint-cli2-overrides\|PJR-50YH]]    | `init --lefthook` の基本の設定が `.markdownlintrc` になり、それを読む `.markdownlint-cli2.yaml` も作る。`--slidev` は Slidev 用の規則を `overrides` の先頭に入れる |

## 2. 背景・文脈

- 上の項目はすべて coderdojo-lessons の利用の中で見つかり、本リポジトリへ起票された。
- 利用者の project の側で使う必要のある注意は 2 つある。
  - JJBY の回避策（`--approach - --target - --source -`）で approach を外した個票には、authoring の approach を update で戻せない。kata がすでにあり、authoring の検証で止まるためである。作成済みの kata を直すときは `*-maintenance` の approach を使う。
  - 50YH で、利用者の project が手で入れた markdownlint の構成（`.markdownlintrc` と、それを `config.extends` で読む `.markdownlint-cli2.yaml`）と同じ形を、本家の scaffold が作るようになった。既存の設定は書き換えないため、そのままでよい。本家の生成物にそろえる場合は、`config scaffold --lefthook --slidev --dry-run` で表示される案内に従う。
- 50YH の確認で、markdownlint-cli2 と VS Code の拡張は `.markdownlintignore` を読まないと分かった。VS Code では Slidev の kata が `overrides` の規則で検査され、commit hook と result の検査（markdownlint-cli）では `.markdownlintignore` で外れる。

## 3. フォローアップ

- coderdojo-lessons の側で 0.4.6 へ上げ、上の注意を確かめる。新しい事実（0.4.6 で残った不具合など）が分かった場合は、このメモに追記するか、目的に合う type で起票する。

## 4. 関連ドキュメント

- [[prj-0001:pjr-ntwd-release-v0-4-6]]：v0.4.6 の公開
