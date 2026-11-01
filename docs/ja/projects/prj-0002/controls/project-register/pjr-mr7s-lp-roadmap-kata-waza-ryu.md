---
specdojo:
  id: prj-0002:pjr-mr7s-lp-roadmap-kata-waza-ryu
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: BA
  registered_at: "2026-11-01T12:32:06Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-7T8X
---

# PJR-MR7S LP の「これから」に Kata・Waza・Ryu の役割を追記する

## 1. 概要

LP 末尾の「これから」に、型（Kata）・技（Waza）・流（Ryu）の役割と仕事の回し方との関係を、平易な言葉で紹介する。既存の PDCA 表との関係および提供状況の表示を整合させる。

## 2. 入力

- 利用者から、LP 末尾の「これから」には register・schedule・routine + Job の記載がある一方、kata・waza・ryu の記載がないとの指摘があり、これらを記述する todo の起票を依頼された。担当 BA、期限 2026年11月末。
- 会話で提示した案：既存の PDCA 表に行を足すより、「これから」に「作り方も、磨いていく」という短い説明を添える。型（Kata）は規約・作り方・完成例・雛形で成果物の品質を支え、技（Waza）は記録・実行・評価をつなぎ、流（Ryu）は目的や型の整備状況に合わせて進め方を選ぶことを紹介する。具体的な文言は提案として扱う。
- 締めの文案：「仕事を回すだけでなく、作り方も磨いていく。型を整え、技で実行し、目的に合った流れで成果物を育てていきます。」提供状況の表示は既存の「いま使える／準備中」と整合させて決める。
- 既存の PJR-7T8X では導入時の分かりやすさを優先して Kata・Waza・Ryu の語を使わない方針だった。今回はこの紹介範囲を見直す。用語や体系の再設計、公開時期の決定まで範囲を広げない。
- 利用者の追加依頼（2026-11-01）：LP 内の routine + Job の表記を routine + job に統一する。src/components/sections/Roadmap.astro の行名と Waza の説明文の2か所が対象。LP の表示だけを修正し、設計書の概念名や既存の実行履歴は書き換えない。対応結果に修正内容と検証結果を記録する。

## 3. 完了条件

- LP 末尾の「これから」に、型（Kata）・技（Waza）・流（Ryu）の役割を平易な言葉で紹介している。
  - Kata は規約・作り方・完成例・雛形で成果物の品質を支えることを説明する。
  - Waza は記録・実行・評価をつないで仕事を進めることを説明する。
  - Ryu は目的や型の整備状況に合わせて進め方を選ぶことを説明する。
- 既存の register・schedule・routine + Job の PDCA 表との関係が分かり、「いま使える／準備中」の表示と矛盾していない。公開時期を新たに約束しない。
- PC とスマホの表示で、追加した説明と既存の PDCA 表が読みやすく表示されることを確認し、確認結果を対応結果に記録している。
- `specdojo-lp` で `npm run build` が成功し、検証結果を対応結果に記録している。

## 4. 作業内容

| No  | 作業                                                 | 担当 | 状態 | メモ                                                                                        |
| --- | ---------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------------------------- |
| 1   | 関連ガイドと既存 LP を確認し、追記する文言をまとめる | BA   | done | 四つの関連ガイドと PJR-7T8X の従来方針を確認した                                            |
| 2   | 「これから」に三つの役割と PDCA 表との関係を追記する | BA   | done | 組み合わせた成果物づくりの仕組みを「準備中」と表示した                                      |
| 3   | PC・スマホの表示とビルドを確認し、結果を記録する     | BA   | done | executor がビルドを確認し、specdojo-orchestrator が sandbox 外で PC・スマホの表示を確認した |

## 5. 対応結果

### 5.1. 実施内容

- `specdojo-lp:src/components/sections/Roadmap.astro` の既存 PDCA 表の下に「作り方も、磨いていく」を追加した。
- 型（Kata）は規約・作り方・完成例・雛形で成果物の品質を支え、技（Waza）は記録・実行・評価をつなぎ、流（Ryu）は目的や型の整備状況に合わせて進め方と型の参照範囲を選ぶことを説明した。
- PDCA は仕事を回す流れ、register・schedule・routine + Job は技による回し方であることを示した。「いま使える register」を入口に三つを組み合わせて成果物づくりを支える仕組みを「準備中」とした。既存の各行の提供状況は維持し、公開時期や準備中の機能へのリンクは追加していない。
- PJR-7T8X の用語を出さない方針は、本項目の指示に従って「これから」の追加説明に限って見直した。用語・体系や関連ガイドは変更していない。
- 追加した三つの説明は PC では 3 列、スマホでは縦並びとし、既存の Material 3 テーマの class を使用した。

### 5.2. 検証結果

- `specdojo-lp` の `npm run build` は、Astro の telemetry が sandbox 外の設定ディレクトリを作成しようとして失敗した。設定ファイルを変更せず、`ASTRO_TELEMETRY_DISABLED=1 npm run build` で再実行し成功した。静的な `dist/index.html` と CSS が生成された。
- `specdojo-lp` の `npx --no-install prettier --write src/components/sections/Roadmap.astro` と `npx --no-install prettier --check src/components/sections/Roadmap.astro` が成功した。
- 生成 HTML で追加見出し・三つの役割・提供状況の表示を確認した。生成 CSS には 48rem 以上で適用される 3 列の指定があり、既存の PC 用 PDCA 表とスマホ用カードの切り替え指定も維持されている。これは生成物の静的確認であり、実画面の読みやすさの確認ではない。
- `node --import tsx src/specdojo.ts register build --project prj-0002` が成功し、個票とイベントの整合性検証および生成ビューの再生成が完了した。
- 個票を `npx --no-install prettier --write docs/ja/projects/prj-0002/controls/project-register/pjr-mr7s-lp-roadmap-kata-waza-ryu.md` で整形した。project と `specdojo-lp` の `git diff --check` は成功した。
- PC・スマホの実画面を確認するため Chromium とローカル HTTP サーバーの起動を試したが、sandbox がソケット操作を `Operation not permitted` で拒否した。通信を使わずローカル HTML を直接開く Chromium の起動も同様に失敗したため、実画面の確認は未実施である。
- prj-0002 は `catalog_path` 未設定のためカタログ検証は適用外。YAML ファイルの変更がないため個別 schema 検証は適用外。親 runner に設定された lint・型検査・テスト等は executor では重複実行しない。

### 5.3. 申し送り

- PC・スマホの実画面確認は `requires_human`。sandbox 外で LP を起動し、PC（例: 1440px 幅）では既存 PDCA 表と追加した 3 列の説明、スマホ（例: 390px 幅）では既存の回し方ごとのカードと追加した縦並びの説明を確認する。折り返し、横はみ出し、重なり、提供状況のラベルの読みやすさを確認し、本個票の確認結果と作業 No. 3 を更新する。
- result は executor/reporter pipeline の後続ステージが記入する。実施内容・変更ファイル・検証結果、および実画面確認が未実施である理由と次のアクションを result に反映する。個票のステータス項目と登録簿の一覧は変更していない。

### 5.4. 統合後の確認（specdojo-orchestrator、2026-11-01）

- sol-executor と gemma-reporter の実行が成功し、LP は `develop` の `0e4e0039640e`、プロジェクトの実行記録は `project/prj-0002/develop` の `579ad7446` に統合された。
- runner の親検証 8 種（lint-ts・lint-fm・lint-md・lint-mermaid・test-integration・validate-schema・typecheck・test-unit）はすべて成功した。
- executor の申し送りを受け、specdojo-orchestrator が sandbox 外で一時的なローカル HTTP サーバーと headless Chromium を起動し、生成された LP の PC（1440px）・スマホ（390px）のスクリーンショットを確認した。PC は既存 PDCA 表と追加説明の 3 列、スマホは既存カードと追加説明の縦並びを確認し、文字の重なり・横はみ出し・ラベルの読みにくさはなかった。両幅ともページ幅は画面幅と一致し、対象節で画面外にはみ出す要素は 0 件だった。
- 表示確認の対象コンポーネントと統合後のコンポーネントの Git blob は `fc847b12980c96b1df82df20ca1e7896ccc582d5` で一致した。スクリーンショットは一時確認用の `/tmp/pjr-mr7s-roadmap-1440.png` と `/tmp/pjr-mr7s-roadmap-390.png` に保存した。
- 完了条件を個票・result・実際の差分に照らして確認した。LP の変更は `src/components/sections/Roadmap.astro` の追記のみで、既存の PDCA 表・提供状況は維持され、公開時期の約束や保護された設定への変更はない。
- 5.2・5.3 の実画面確認待ちはこの追加確認で解消した。個票は利用者による close 判断まで `review` として残す。

## 6. 関連ドキュメント

- [[prj-0002:pjr-7t8x-lp-roadmap-pdca-matrix]]: 既存の「これから」と PDCA 表の方針。
- [[specdojo:specdojo-overview-guide]]: Kata・Waza・Ryu と成果物・実行管理の関係。
- [[specdojo:kata-guide]]: 実践の型の役割。
- [[specdojo:waza-guide]]: 遂行の技の役割。
- [[specdojo:ryu-guide]]: 目的や型の整備状況に応じた進め方。
