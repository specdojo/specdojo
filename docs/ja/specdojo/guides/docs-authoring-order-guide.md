---
specdojo:
  id: docs-authoring-order-guide
  type: guide
  status: draft
---

# ドキュメント作成順ガイド

Document Authoring Order Guide

SpecDojoで扱うドキュメントの作成順・検討順について、以下のガイドラインを示します。
ドキュメントの分類・ディレクトリ構成については [ドキュメント構成ガイド](docs-structure-guide.md) を参照してください。

## 1. 作成順・検討順のガイドライン

> ここで示すドキュメントの関係は、作成順・検討順を表します。
> Frontmatter の `based_on` とは直接の関係はありません。
> Frontmatter の `based_on` は各文書を作成する際に直接根拠として参照した文書のみを記載するため、
> 本図の矢印と `based_on` が一致するわけではありません。

- 成果物カタログ（`dct-<domain>.yaml`）は、
  プロジェクトで管理対象とする成果物の単一の正本（SSOT）であり、各成果物の作成・更新・管理の起点となる。
  各類型（プロジェクト定義、プロジェクトマネジメント、プロダクト変更等）の成果物は、
  本カタログに登録された単位で管理されます。
- 成果物の類型は次の5つに大別されます。
  - A. 立ち上げ
  - B. プロジェクト定義
  - C. プロジェクトマネジメント
  - D. プロダクト変更
  - E. プロダクト成果物（更に詳細な類型に分類）
- 成果物の作成順は、`A → (C + B) → D → E` が基本になりますが、プロジェクトの状況に応じて柔軟に対応します。
  特に、`A. 立ち上げ`の成果物（概要・ステークホルダー・憲章）を起点として、
  `B. プロジェクト定義`（何を作るか）と `C. プロジェクトマネジメント`（どう進めるか）は並行して作成されることが多いです。
- 図中の成果物カタログ（`dct-<domain>.yaml`）は同一種類の正本文書を表し、各サブグラフでは当該類型に関する登録範囲を示しています。
- プロジェクトのGO/NOT GOの判断は、以下の３つのゲートを設けることを推奨します;
  1. **TO-BEの明確化（`A`, `B`, `C`が完了）**: 将来構想が固まった段階
  2. **TO-BEの実現性が明確化（`D`が完了）**: 将来構想と現状とのギャップと対応策が明確になった段階
  3. **負荷・期間が明確化（`E`が完了）**: 将来構想を実現するための負荷と工期が明確になった段階

## 2. 作成順・検討順の全体図

図中の色分けの意味は [ドキュメント構成ガイド](docs-structure-guide.md) の `凡例` を参照してください。

```mermaid
flowchart TB
  subgraph INIT["A. 立ち上げ"]
  direction LR
    OV["prj-overview<br/>プロジェクト概要"]
    SR["prj-stakeholder-register<br/>ステークホルダー登録簿"]
    CH["prj-charter<br/>プロジェクト憲章"]
    ORG["pm-organization<br/>体制・ロール"]
    RL["pm-roles<br/>ロール定義"]
    MEM["pm-members<br/>メンバー"]
    RAC["pm-raci<br/>RACI"]
    OV --> ORG
    OV -.必要時.-> SR -.必要時.-> CH
    ORG -.必要時.-> CH
    SR -.必要時.-> ORG --> RL --> MEM
    ORG --> MEM
    ORG -.必要時.-> RAC
  end


  subgraph PM["C. プロジェクトマネジメント"]
  direction LR
    PM_DC["dct-&lt;domain&gt;.yaml<br/>成果物カタログ<br/>（プロジェクトマネジメント用）"]
    PM_EXE(["実行・管理"])
    PL["pm-plan<br/>プロジェクト管理計画"]
    CP["pm-communication-plan<br/>コミュニケーション計画"]
    QMP["pm-quality-management-plan<br/>品質管理計画"]
    PM_DC --> PM_EXE --> PL
    PL --> CP
    PL --> QMP
  end

  subgraph PD["B. プロジェクト定義"]
  direction LR
    PD_DC["dct-&lt;domain&gt;.yaml<br/>成果物カタログ<br/>（プロジェクト定義用）"]
    PD_EXE(["実行・管理"])
    PS["prj-scope<br/>スコープ"]
    SC_AC["prj-success-criteria-and-acceptance-criteria<br/>成功基準と受入条件"]
    ACD["prj-assumptions-constraints-dependencies<br/>前提・制約・依存関係"]
    IA["prj-issues-and-approach<br/>課題とアプローチ"]
    CA["prj-comparison-of-alternatives<br/>代替案の比較<br/>（必要時）"]
    PD_DC --> PD_EXE --> PS
    PS --> SC_AC
    PS --> ACD
    PS --> IA
    PS --> CA
    ACD --> IA
    IA --> CA
  end

  GT1{"GO/NOT GO"}
  PD --> GT1 --> PC

  subgraph PC["D. プロダクト変更"]
  direction LR
    PC_DC["dct-&lt;domain&gt;.yaml<br/>成果物カタログ<br/>（プロダクト変更用）"]
    PC_EXE(["実行・管理"])
    AS_IS["As-Is<br/>現状定義"]
    IMP["Impact<br/>影響範囲"]
    TRC["Traceability<br/>トレーサビリティ"]
    MIG["Migration<br/>移行"]
    PC_DC --> PC_EXE --> AS_IS
    AS_IS --> IMP
    AS_IS --> TRC
    IMP --> TRC
    TRC --> MIG
  end

  GT2{"GO/NOT GO"}
  PC --> GT2 --> DEL

  subgraph DEL["E. プロダクト成果物"]
  direction LR
    DEL_DC["dct-&lt;domain&gt;.yaml<br/>成果物カタログ<br/>（プロダクト成果物用）"]
    DEL_EXE(["実行・管理"])
    DE["deliverables<br/>成果物"]
    DEL_DC --> DEL_EXE --> DE
  end

  INIT --> PM
  INIT --> PD
  PM <--> PD

  classDef projectWise fill:#fff3bf,stroke:#f08c00,color:#000;
  classDef productSpec fill:#d0ebff,stroke:#1c7ed6,color:#000;

  class OV,SR,CH,ORG,MEM,RAC,RL projectWise;
  class PM_DC,PM_EXE,PL,CP,QMP projectWise;
  class PD_DC,PD_EXE,PS,SC_AC,ACD,IA,CA projectWise;
  class PC_DC,PC_EXE,AS_IS,IMP,TRC,MIG projectWise;
  class DEL_DC,DEL_EXE projectWise;
  class DE productSpec;

  GT3{"GO/NOT GO"}
  DEL --> GT3


```

## 3. 実行・管理の流れ

`作成順・検討順の全体図`中の成果物カタログからプロジェクトドキュメントを作成する`実行・管理`の流れは以下になります。

```mermaid
flowchart LR

  PJR["pjr-index / pjr-&lt;NNNN&gt;-&lt;term&gt;<br/>プロジェクト登録簿"]
  DC["dct-&lt;domain&gt;.yaml<br/>成果物カタログ"]
  SCH["sch-track-&lt;track&gt;.yaml<br/>スケジュール"]
  EXE["execution / reporting / controls<br/>実行 / 報告 / 管理"]
  PV["pjr-views<br/>台帳ビュー（状態別・優先度別・担当者別）"]
  PRR["pm-risk-register<br/>リスク登録簿"]
  PL["pm-issue/change-request/decision-log<br/>課題/変更要求/意思決定<br/>ログ"]

  PJR --> DC --> SCH --> EXE
  PJR --> PV
  PJR --> PRR
  PJR --> PL

  classDef projectWise fill:#fff3bf,stroke:#f08c00,color:#000;
  class PJR,DC,SCH,EXE,PV,PRR,PL projectWise;
```
