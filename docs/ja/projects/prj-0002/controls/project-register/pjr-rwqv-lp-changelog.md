---
specdojo:
  id: prj-0002:pjr-rwqv-lp-changelog
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: BA
  registered_at: "2026-11-02T06:36:50Z"
  due_on: "2026-11-30"
---

# PJR-RWQV specdojo-lp に CHANGELOG.md と更新ルールを整える

## 1. 概要

LP 独自の CHANGELOG.md を作成し、確認できる直近の変更を Unreleased に記載する。develop への統合時に追記し、本番公開時に公開日付きの節へ移す運用を README に記載する。

## 2. 入力

- 利用者は specdojo-lp の develop を push 済みと述べ、CHANGELOG.md の作成を希望した。提案した todo の起票と実行を依頼し、担当 BA、期限 2026年11月末を指定した。
- 合意した方針：develop に統合した変更は Unreleased に記載し、main から本番公開する際に公開日付きの節へ移す。SpecDojo 本体の変更履歴とは分け、当面は日付で管理する。過去の変更をすべて復元せず、確認できる直近の変更から始める。
- README の運用では main が本番公開状態、develop はプレビューの統合先。develop への push を本番公開として記録しない。Git の main..develop と実際の差分を確認し、公開日を推測せず、公開済みの変更を未公開と誤記しない。

## 3. 完了条件

- `specdojo-lp` のルートに `CHANGELOG.md` があり、日本語で LP 独自の変更要点を記録している。`Unreleased` の節を用意し、必要な分類（追加・変更・修正・開発環境など）に分ける。空の分類を機械的に並べない。
- `main..develop` の履歴と実際の差分から確認できる直近の未公開変更を `Unreleased` にまとめ、単なる commit の羅列にしない。対象範囲と確認した根拠を個票の対応結果に残す。過去の全履歴の復元や SpecDojo 本体の変更履歴の転記は行わず、公開日・公開済みの版を推測して作らない。
- `README.md` から `CHANGELOG.md` へ相対リンクで案内し、次の運用を記載する。
  - `develop` への統合時に変更要点を `Unreleased` へ追記する。
  - `main` から本番公開する際に、人が公開日を確認して `YYYY-MM-DD` の節へ移し、次の `Unreleased` を残す。
  - プレビューへの反映と本番公開を区別し、当面は LP 独自の日付で管理する。SpecDojo 本体の版や `package.json` の版とは同期させない。
- 変更は `specdojo-lp` の `CHANGELOG.md`・`README.md` と本個票の対応結果に限定する。設定・依存関係・画面・既存の公開済み履歴は変更しない。`main` への統合・公開・`git push`・PR 作成は行わない。
- `specdojo-lp` で `npm run lint:md` と、変更した Markdown 2件を対象にした Prettier の整形確認が成功する。runner に設定された親検証も成功し、実施内容・検証結果・残課題を個票の対応結果に記録し、pipeline の `handoff` にも必要な申し送りを残す。

## 4. 作業内容

| No  | 作業                                                   | 担当 | 状態 | メモ                                |
| --- | ------------------------------------------------------ | ---- | ---- | ----------------------------------- |
| 1   | LP の README と Git 履歴・差分を確認し、記載対象を選ぶ | BA   | open | 公開済みと未公開を区別する          |
| 2   | CHANGELOG.md と README の案内・更新ルールを整える      | BA   | open | LP 独自の変更要点を日本語で記載する |
| 3   | Markdown の検査と親検証を通し、対応結果を残す          | BA   | open | 根拠と検証結果を記録する            |

## 5. 対応結果

-

## 6. 関連ドキュメント

- `specdojo-lp:README.md`: develop と main、および本番公開の運用。
- [[prj-0002:pjr-8v7t-product-repo-develop-branch]]: プロダクトリポジトリのブランチ運用。
- [[prj-0002:pjr-mr7s-lp-roadmap-kata-waza-ryu]]: 直近の LP 説明追加と表記統一。
