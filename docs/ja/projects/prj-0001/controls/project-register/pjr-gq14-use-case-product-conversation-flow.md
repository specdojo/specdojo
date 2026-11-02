---
specdojo:
  id: prj-0001:pjr-gq14-use-case-product-conversation-flow
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: BA
  registered_at: "2026-11-02T12:13:16Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-V5AZ
---

# PJR-GQ14 ユースケース別ガイドを具体的なプロダクト作成の対話フローに改訂する

## 1. 概要

use-case-guide.md を LP・Next.js の Web サービス・Unity のゲームという作りたいもの別に再構成し、相談から成果物作成・検証・運用までの対話フローを示す。PJR-RTD5 の用途別ひな型は提供後に使い方を追記する。

対象は `docs/ja/specdojo/guides/use-case-guide.md`。Quick Start は共通操作を一巡する体験、本ガイドは作りたいものに応じた適用手順を担う。担当は BA、期限は 2026-11-30 と合意した。

### 1.1. 入力とひな型との関係

- LP、Next.js の Web サービス、Unity のゲームという具体的なプロダクトを入口とする構成を利用者と合意した。
- PJR-RTD5 は、`project/prj-0001/develop` 上の個票で `decided` を確認した。ひな型は生成・追加の設定・SpecDojo の 3 層とし、GitHub の template repository を主な入口にする。最初は LP、次に Next.js と Cloudflare を作る方針である。
- ガイドの構成変更はひな型の完成を待たずに進める。決定済みであることと、ひな型が利用可能であることを区別する。
- ひな型が提供された後に、実物を確認して複製・初期化・オーケストレーターとの対話開始・動作確認の使い方を追記する。未提供のひな型や CLI オプションの存在を仮定しない。
- 本項目はガイドの改訂を扱い、ひな型の実装や提供順序の変更は扱わない。

## 2. 完了条件

- LP、Next.js の Web サービス、Unity のゲームを作りたい読者が、自分のケースを選べる見出しと導線になっている。
- 各ケースに、完成イメージと前提、最初の相談、確認・判断する事項、必要な成果物と作成順序、register・schedule による進行、完成確認と変更・運用への流れを記載している。
- 対話例は不足事項の確認と提案・承認・実行を示し、担当・期限・判断などの未確定事項を勝手に確定しない。
- コマンドと設定差分は必要な箇所で折りたたむ。共通の導入・操作は Quick Start、詳細は専門ガイドへリンクし、説明の重複を抑える。
- 現行ガイドの共通運用情報を整理し、必要な情報へ各ケースから到達できる。既存の参照元、文書内リンクと早見図を構成変更に合わせて確認する。
- PJR-RTD5 の方針との整合を確認し、提供済みのひな型があれば実物に基づいて使い方を記載する。未提供なら、ひな型を前提としない手順を示し、提供後の追記対象と確認事項を対応結果に残す。この初回改訂の完了は、未提供のひな型の完成を条件にしない。
- Markdown lint と適用される親の文書検証を通し、実施内容・検証結果・ひな型提供後の後続作業を対応結果へ記録する。

## 3. 作業内容

| No  | 作業                                                                 | 担当 | 状態 | メモ                                 |
| --- | -------------------------------------------------------------------- | ---- | ---- | ------------------------------------ |
| 1   | Quick Start、専門ガイド、PJR-RTD5 と実際のひな型の提供状況を確認する | BA   | open | 方針決定と実装完了を区別する         |
| 2   | 作りたいもの別に構成し、具体的な対話と成果物作成の流れを書く         | BA   | open | LP、Next.js、Unity                   |
| 3   | 共通運用情報とリンク・早見図を整理し、文書検証を行う                 | BA   | open | -                                    |
| 4   | ひな型の使い方を確認し、未提供分の追記対象と確認事項を対応結果へ残す | BA   | open | 提供後に後続の追記作業として引き継ぐ |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[specdojo:use-case-guide]]
- [[specdojo:quick-start-guide]]
- [[specdojo:orchestrator-operation-guide]]
- [[prj-0001:pjr-v5az-quick-start-conversation-flow]]
- PJR-RTD5（用途別のひな型の方針。起票時点では develop 上の `docs/ja/projects/prj-0001/controls/project-register/pjr-rtd5-starter-templates.md` を参照）
