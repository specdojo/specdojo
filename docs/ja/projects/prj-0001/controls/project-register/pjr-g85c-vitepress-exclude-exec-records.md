---
specdojo:
  id: prj-0001:pjr-g85c-vitepress-exclude-exec-records
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-11T22:10:30Z"
  completed_at: "2026-10-21T22:48:10Z"
  conclusion: plan と result をドキュメントサイトのビルド対象から外し、リンクを GitHub のファイル表示へ置き換えた（PJR-98P8）。手元の docs:build がメモリの上限を広げずに約 113 秒で通る
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

- 調査を実施し、以下の事実と影響を確認した。
  - ページ数内訳: 全 Markdown 3,201 ページのうち、exec の plan が 917 ページ、result が 929 ページで計 1,846 ページ（全体の約 57.7%）を占めている。
  - ビルド時間とメモリへの影響:
    - 現行（除外なし）: ページレンダリング時に Node.js の既定ヒープ上限（約 2GB）を超過し、4 分 11 秒で `FATAL ERROR: JavaScript heap out of memory` によるクラッシュが発生する。
    - 一時的除外テスト（`srcExclude` に `execution/exec/(plans|results)/**` を指定）: VitePress ビルドが 63.66 秒（全体実時間 1 分 25 秒）で正常完了し、メモリ不足も解消される。
  - リンク参照とデッドリンク検査への影響:
    - plan / result へのリンクは、`execution/generated/exec-records.md` からの相対 Markdown リンクが 1,844 件、個票からの wikilink が 9 件、result 相互の wikilink が 36 件存在する（dashboard からの直接リンクは無く `exec-records.md` を経由）。
    - 単に `srcExclude` に追加すると、VitePress の dead link 検査により 1,855 件のリンク切れが検出されてビルドが中断する。
  - 外し方の比較:
    - 案1（全体から除外）: ビルド時間・メモリを大幅削減できるが、リンク切れ（404）への対処が必要。
    - 案2（dev 時のみ除外）: 本番ビルド時の OOM クラッシュと時間増大を解決できず不適。
    - 案3（全体から除外 + リンク先を GitHub blob URL へ置換）: ドキュメントサイトの肥大化・OOM を解消しつつ、閲覧動線とデッドリンク検査の整合性を両立できる最善策。
- 結論として「案3」を推奨し、実装変更は別タスクで実施する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-qqxp-docs-search-index-scope|PJR-QQXP ドキュメントサイトのローカル検索対象から実行記録を除外]]
- [[prj-0001:pjr-ca0s-docs-site-output-in-node-modules]]
- [[prj-0001:pjr-9s8f-split-docs-site-package|PJR-9S8F 文書サイト機能を別パッケージへ分離する]]
- [[specdojo:pjr-rulebook|プロジェクト登録簿 作成ルール]]
- `packages/docs-site/.vitepress/config.mts`
- `docs/ja/projects/prj-0001/execution/generated/exec-records.md`
- `src/dashboard.ts`
