---
specdojo:
  id: prj-0001:pjr-g85c-vitepress-exclude-exec-records
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-11T22:10:30Z"
---

# PJR-G85C VitePress のビルド対象に exec の plan と result が含まれページ数が増え続ける

## 1. 課題内容

Markdown 2489 ページのうち約 1450 ページが exec の plan と result で、exec の実行ごとに 2 ページ増えてビルド時間が伸び続ける。dashboard や個票からのリンクへの影響を確認し、ビルド対象から外すか dev 時のみ外すかを決める

## 2. 影響範囲

| 観点         | 影響                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------- |
| スコープ     | `packages/docs-site/.vitepress/config.mts`、plan・result を参照する dashboard・個票・result の wikilink |
| スケジュール | 小。今すぐ止まるものはないが、exec の実行ごとにビルドが遅くなる                                         |
| コスト       | ドキュメントサイトのビルド時間（GitHub Pages の deploy と手元の dev）                                   |
| 品質         | 外し方によっては、dashboard や個票からのリンクが切れる                                                  |
| 関係者       | ドキュメントサイトの読者と、docs をビルドする開発者                                                     |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                 |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | VitePress が `docs/` の下の Markdown をすべてページにし、exec の plan と result（2026-10-22 時点で 915 件と 927 件、全 3,214 件の約 6 割）も含まれる |
| 対応策   | まず調査し、外し方（全体から外す、dev のときだけ外す、一覧のページにまとめる、など）を比べて推奨を決める。直すのは方針を決めた後の別の実行とする     |
| 依存事項 | なし                                                                                                                                                 |
| 完了条件 | 下記の完了条件を満たす                                                                                                                               |

### 3.1. 完了条件

- 0.4.2 の範囲とする（2026-10-22、利用者が承認）。この実行は調査だけを行い、ビルドの設定と文書は変えない。
- 次を調べて result に書く。
  - plan と result のページ数と、`npm run docs:build` のうちそれらにかかる時間の目安（外した場合との比較。外して比べるときは作業ツリーの中で一時的に変え、commit しない）。
  - plan と result へのリンク（wikilink・Markdown のリンク）がどこから張られているか（dashboard、個票、ほかの result、ガイドなど）の件数と例。外したときに切れるリンクと、ビルドの dead link の検査への影響。
  - 外し方の案ごとの利点と欠点（少なくとも、全体から外す、dev のときだけ外す、plan・result を GitHub の表示へのリンクに置き換える、の 3 つ）。
- 推奨の案と理由、直すときの完了条件の案を result の申し送りに書く。
- `npm run lint:md` が通る。親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
