---
specdojo:
  id: prj-0001:pjr-pz6h-cdfd-overview-seven-section-flows
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
  registered_at: "2026-11-02T03:27:02Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-03T00:19:07Z"
  conclusion: 全体概要の図を、7 区分と一対一のノードでトランザクションデータとマスタ・構成データの 2 つに作り直した
  derived_from:
    - PJR-GEZN
---

# PJR-PZ6H 全体概要の図を 7 区分の関係を表す 2 つの図に作り直す

## 1. 概要

cdfd-overview の第 5 章の 3 つの図を、第 3 章の 7 区分と一対一のノードで、トランザクションデータの流れとマスタ・構成データの流れの 2 つの図に作り直す

## 2. 入力

- 利用者は VitePress で新しい体系を確かめ、全体的に分かりにくいと判断した。まず cdfd-overview を見直し、概念データフロー図は 3.1〜3.7 の関係を表すべきだと考えている（2026-11-02）
- 今の第 5 章の 3 つの図は、P-01・P-12・P-13 を個別のノードにし、3 系統は実行サイクルを含めた 1 つのノードにしていて、第 3 章の 7 区分と一対一になっていない。実行サイクルと文書の廃棄は独立したノードとして出てこない
- 7 区分と 15 のデータストアを 1 つの図にすると 22 ノードで rulebook の目安（16）を超えるため、同じ 7 つのノードでトランザクションデータ（16 ノード）とマスタ・構成データ（13 ノード）の 2 つの図に分ける案を利用者が承認した（2026-11-02）
- orchestrator が描いたトランザクションデータの図の下書きでは、3.1 と 3.4 はほとんど線がなく、主にマスタ・構成データを扱うことが分かった。下書きは routine 系から Job の実行を経て実行記録に至る流れなどが抜けている

## 3. 完了条件

- [[prj-0001:cdfd-overview]] の「概念データフロー（概要）」の図が、「トランザクションデータの流れ」と「マスタ・構成データの流れ」の 2 つになっている。今の 3 つの図（構成の構築・管理と文書の廃棄と 3 系統、epic・track・Job による系統間の接続、共用する実行計画・成果物・実行記録）は置き換える
- 2 つの図とも、プロセスのノードは「プロセス領域」の章の 7 区分（3.1〜3.7）と一対一で、ノードの名前は節の題と同じである。各ノードに含む領域 ID を添える。ノードの位置は 2 つの図でそろえ、上から 3.1 と 3.7、3.2〜3.4、3.5、3.6 の順に並べる。並びの制御は [[specdojo:cdfd-d2-rulebook]] に従い、`a <- b` と、必要な場合だけ透明度 0 の線を使う
- データストアのノードは「データストア」の章の表と一対一で、トランザクションデータの図には 4.2 の 9 つ、マスタ・構成データの図には 4.1 の 6 つを置く
- 今の 3 つの図の受け渡しは、7 区分の単位に置き換えて残す。どの区分がどのデータストアを作り、どの区分が使うかが線で読める。routine 系が Job を通じて実行を動かす関係と、register 系と schedule 系が epic と track でつながる関係を含める。今の線との対応（残した線、まとめた線、区分の単位に直した線）を個票の対応結果に表で記録する
- 「概念データフロー（概要）」の導入と各図の説明は、それぞれ 1 文までとする。凡例と重なる注記は繰り返さない
- 「プロセス領域」と「データストア」の表、「詳細 CDFD 一覧」、「凡例（本プロダクト共通）」は変えない。文書の status は変えない（draft のまま）。詳細の CDFD の文書は変えない
- 2 つの図を `d2 --layout elk` で SVG に出力し、7 区分のノードの上下の並びが上の順になっていることを確かめ、個票の対応結果に記録する
- `npm run lint:md`・`npm run lint:d2` と親の検証が通る

## 4. 作業内容

| No  | 作業                                                    | 担当 | 状態 | メモ                                      |
| --- | ------------------------------------------------------- | ---- | ---- | ----------------------------------------- |
| 1   | 7 区分のノードでトランザクションデータの流れの図を描く  | BA   | done | 7 区分と 4.2 の 9 ストア、計 16 ノード    |
| 2   | 同じ 7 区分のノードでマスタ・構成データの流れの図を描く | BA   | done | 7 区分と 4.1 の 6 ストア、計 13 ノード    |
| 3   | 今の線との対応と、SVG での並びを対応結果に記録する      | BA   | done | 下表に旧線の移し先と ELK の描画結果を記録 |

## 5. 対応結果

[[prj-0001:cdfd-overview|全体概要]] の第 5 章を「トランザクションデータの流れ」と「マスタ・構成データの流れ」の 2 図へ置き換えた（2026-11-02）。両図に第 3 章と同名・同じ領域 ID の 7 区分を置き、データストアは第 4 章の各表と一対一にした。章の導入と各図の説明はそれぞれ 1 文とし、説明は各図の直後に置いた。

### 5.1. 旧図の線との対応

旧図の「register 系」「schedule 系」「routine 系」に含まれていた P-07・P-08・P-11 の責務を「実行サイクル」へ移した。以下の T は新 5.1、M は新 5.2 を指し、矢印は情報の向きを表す（図のソースでは戻りの線を `<-` で記述）。

<!-- prettier-ignore -->
| 旧図と受け渡し | 対応 | 新図での受け渡し |
| --- | --- | --- |
| 旧 5.1: Kata → Onboarding（provider 別雛形） | 区分の単位に変更 | M: Kata → プロジェクト構成の構築・管理（provider 別雛形） |
| 旧 5.1: Onboarding → Kata（配置）、稼働構成管理 → Kata（バージョン更新） | 統合 | M: プロジェクト構成の構築・管理 → Kata（配置・バージョン更新） |
| 旧 5.1: Onboarding → 稼働構成（初期状態）、稼働構成管理 → 稼働構成（承認済み構成変更） | 統合 | M: プロジェクト構成の構築・管理 → 稼働構成（初期状態・承認済み構成変更） |
| 旧 5.1: 稼働構成 → Orchestrator | 維持 | M: 稼働構成 → Orchestrator（agent 定義・実行既定値） |
| 旧 5.1: Kata → register 系・schedule 系・routine 系 | 責務を分離 | M: Kata → 各系統（起票・計画・定義の型）、Kata → 実行サイクル（実行・検証の型・rubric） |
| 旧 5.1: 稼働構成 → register 系・schedule 系・routine 系 | 責務を分離 | M: 稼働構成 → 各系統（メンバー・ロール・agent 定義・権限等）、稼働構成 → 実行サイクル（権限・実行既定値等） |
| 旧 5.1: 非推奨化保管 → 成果物・保管庫 | 区分の単位に変更 | T: 文書の廃棄 → 成果物（人間の判断に基づく非推奨化文書）、文書の廃棄 → 保管庫（保管した文書） |
| 旧 5.2: Orchestrator → register 系・schedule 系（計画・実行・評価・完了要求） | 責務を分離 | T・M: Orchestrator → 各系統（登録・計画等の要求）、Orchestrator → 実行サイクル（実行・評価・完了要求） |
| 旧 5.2: register 系・schedule 系 → Orchestrator（実行状態・判断依頼・結果） | 責務を分離・統合 | T: 各系統 → Orchestrator（登録結果・計画・進捗・判断依頼）、実行サイクル → Orchestrator（実行状態・判断依頼・結果） |
| 旧 5.2: Orchestrator → routine 系（定義・Job 実行要求）、routine 系 → Orchestrator（Job 実行状態・判断依頼） | 責務を分離 | T・M: Orchestrator → routine 系（定義要求）、Orchestrator → 実行サイクル（Job を含む実行要求）；T: 実行サイクル → Orchestrator（状態・判断依頼・結果） |
| 旧 5.2: routine・job・スケジュール戦略・成果物カタログ → Orchestrator | 維持 | M: 同じ 4 ストア → Orchestrator（時期・条件・対象 Job、手順・成功条件、phase の作業要件、`done_criteria`・`evidence_refs`） |
| 旧 5.2: register 系 → 登録簿（登録項目・決定・完了記録） | 責務を分離 | T: register 系 → 登録簿（登録項目・決定記録）、実行サイクル → 登録簿（対応内容・決定・完了記録） |
| 旧 5.2: 登録簿 → schedule 系、Schedule → register 系 | 維持 | T: 登録簿 → schedule 系（epic と track の対応）、Schedule → register 系（track 計画・epic 対応） |
| 旧 5.2: schedule 系 → 成果物カタログ・スケジュール戦略・Schedule | 維持 | M: schedule 系 → 成果物カタログ・スケジュール戦略（定義・条件・戦略）；T: schedule 系 → Schedule（タスク・担当・依存） |
| 旧 5.2: routine 系 → routine・job | 維持 | M: routine 系 → routine（周期・条件・対象 Job）、routine 系 → job（実行手順・委譲先・成功条件） |
| 旧 5.2: job → register 系・schedule 系（登録項目の実行要求、タスク実行・成果物評価要求） | 共用実行を経由 | M: job → 実行サイクル（実行手順・委譲先・成功条件）；T: 実行サイクル → register 系・schedule 系（Job からの各要求） |
| 旧 5.3: 実行計画 → Orchestrator | 維持 | T: 実行計画 → Orchestrator（対象・手順・完了条件） |
| 旧 5.3: 実行記録 → Orchestrator、Orchestrator → 実行記録 | 維持 | T: 実行記録 → Orchestrator（記録済みの実行状態・Job 実行結果）、Orchestrator → 実行記録（サイクルの実行記録） |
| 旧 5.3: register 系・schedule 系 → 実行計画 | 区分の単位に変更 | T: schedule 系 → 実行計画（実行計画）、実行サイクル → 実行計画（Job の実行計画）；P-02 は計画を生成せず、既存計画の生成は schedule 系、Job の具体化は P-07 とする詳細 CDFD に整合 |
| 旧 5.3: register 系・schedule 系 → 成果物 | 統合 | T: 実行サイクル → 成果物（作成・更新した成果物、作成・更新を行う Job も同じ P-07 を利用） |
| 旧 5.3: register 系・schedule 系・routine 系 → 実行記録 | 統合 | T: 実行サイクル → 実行記録（実行状態・実行結果・完了記録、Job を含む） |
| 旧 5.3: register 系・schedule 系・routine 系 → 評価結果 | 統合 | T: 実行サイクル → 評価結果（grade・finding） |
| 旧 5.3: schedule 系 → 進捗報告・派生ビュー・索引 | 維持 | T: schedule 系 → 進捗報告、schedule 系 → 派生ビュー・索引 |

読み手が利用先も追えるよう、T には Schedule・実行計画 → 実行サイクル、実行記録・評価結果・成果物 → schedule 系、進捗報告 → 実行サイクル、評価結果 → Orchestrator を補った。M には成果物カタログ・スケジュール戦略 → 実行サイクルを補い、実行・評価・完了の基準の利用先を明示した。

routine 系からの経路は、M の「routine 系 → ジョブ定義 → 実行サイクル」と「routine 系 → 定期実行定義 → Orchestrator → 実行サイクル」、T の「実行サイクル → 実行記録 → Orchestrator」で接続する。Job による両系統への要求も実行サイクルから引き渡し、P-05・P-06 自身に実行記録や評価結果の生成を割り当てない。

### 5.2. SVG 出力と配置の確認

第 5 章のコードブロックを一時 D2 ファイルに取り出し、次のコマンドで D2 0.9.0・ELK による SVG を生成した。

```bash
d2 --layout elk tmp/pjr-pz6h/transaction.d2 tmp/pjr-pz6h/transaction.svg
d2 --layout elk tmp/pjr-pz6h/master.d2 tmp/pjr-pz6h/master.svg
```

SVG の各プロセスの文字位置（左上原点、y は上段の表示文字座標）を確認し、両図で次の上下順と中段の左から register・schedule・routine の順が一致した。

| 区分                                 | T の y | M の y |
| ------------------------------------ | ------ | ------ |
| 3.1 プロジェクト構成の構築・管理     | 50.5   | 50.5   |
| 3.7 Orchestrator                     | 202.5  | 262.5  |
| 3.2 register 系                      | 715.5  | 665.5  |
| 3.3 schedule 系                      | 715.5  | 665.5  |
| 3.4 routine 系                       | 715.5  | 665.5  |
| 3.5 実行サイクル（実行・評価・完了） | 1727.5 | 1327.5 |
| 3.6 文書の廃棄（非推奨化・保管）     | 2429.5 | 1589.5 |

戻りの受け渡しは `<-` とし、業務の線だけでは順が決まらない箇所に限って `style.opacity: 0` の線を使った。透明な線には、受け渡しではなく配置制御用であることを直前のコメントで明記した。T の構成管理と M の文書廃棄は、その図の区分のデータストアを読み書きしないため、業務の線を追加していない。

第 3・4・6・7 章、Frontmatter、詳細 CDFD は変更していない。残課題・未決事項はない。SVG と検証用ファイルは一時生成物として削除し、再出力できる D2 コードを成果物の正本とする。`lint:md`・`lint:d2` を含む親検証の結果は runner が evidence と result へ追記する。

### 5.3. executor の検証結果

- 変更した 2 文書を Prettier で整形した。
- `node --import tsx tools/catalog-validate-if-configured.mjs` は終了コード 0（未作成文書の参照に関する警告あり、検証エラーなし）。
- `node --import tsx src/specdojo.ts register build` は終了コード 0 で派生ビューを生成した。
- 一時スクリプトで 2 図のノード数・名称・領域 ID と第 3・4 章の対応、SVG の上下順・中段の左右順、第 5 章以外と両文書の Frontmatter の不変を確認した。
- `git diff --check` は問題なし。

## 6. 関連ドキュメント

- [[prj-0001:cdfd-overview]]
- [[specdojo:cdfd-overview-rulebook]]
- [[specdojo:cdfd-d2-rulebook]]
