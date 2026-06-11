type SidebarItem = {
  text: string
  link?: string
  collapsed?: boolean
  items?: SidebarItem[]
}

const specdojoLink = (dir: string, id: string) => `/ja/specdojo/${dir}/${id}`
const guide = (text: string, id: string): SidebarItem => ({
  text,
  link: specdojoLink('guides', id),
})
const standard = (text: string, id: string): SidebarItem => ({
  text,
  link: specdojoLink('standards', id),
})
const rulebook = (text: string, id: string, items?: SidebarItem[]): SidebarItem => ({
  text,
  link: specdojoLink('rulebooks', `${id}-rulebook`),
  ...(items ? { collapsed: true, items } : {}),
})
const instruction = (text: string, id: string, items?: SidebarItem[]): SidebarItem => ({
  text,
  link: specdojoLink('instructions', `${id}-instruction`),
  ...(items ? { collapsed: true, items } : {}),
})
const group = (text: string, items: SidebarItem[], collapsed = true): SidebarItem => ({
  text,
  collapsed,
  items,
})

const projectDefinitionRulebooks = [
  rulebook('プロジェクト概要', 'prj-overview'),
  rulebook('ステークホルダー登録簿', 'prj-stakeholder-register'),
  rulebook('プロジェクト憲章', 'prj-charter'),
  rulebook('プロジェクトスコープ', 'prj-scope'),
  rulebook('成功基準と受入条件', 'prj-success-criteria-and-acceptance-criteria'),
  rulebook('プロジェクト課題と解決アプローチ', 'prj-issues-and-approach'),
  rulebook('前提・制約・依存関係', 'prj-assumptions-constraints-dependencies'),
  rulebook('代替案の比較', 'prj-comparison-of-alternatives'),
]

const projectManagementRulebooks = [
  group('成果物カタログ', [
    rulebook('成果物カタログの索引', 'dct-index'),
    rulebook('成果物カタログ', 'dct'),
  ]),
  group('管理計画', [
    rulebook('プロジェクト管理計画', 'pm-plan'),
    rulebook('コミュニケーション計画', 'pm-communication-plan'),
    rulebook('品質管理計画', 'pm-quality-management-plan'),
  ]),
  group('組織体制', [
    rulebook('組織とロールの定義', 'pm-organization'),
    rulebook('ロール定義', 'pm-roles'),
    rulebook('メンバー定義', 'pm-members'),
    rulebook('組織体制とRACI', 'pm-raci'),
  ]),
  group('管理台帳・管理ビュー', [
    rulebook('プロジェクト登録簿', 'pjr-index'),
    rulebook('リスク登録簿', 'pm-risk-register'),
    rulebook('課題ログ', 'pm-issue-log'),
    rulebook('変更要求ログ', 'pm-change-request-log'),
    rulebook('意思決定ログ', 'dec'),
  ]),
  rulebook('スケジュール', 'sch'),
  rulebook('進捗報告', 'pr'),
  rulebook('議事録', 'mm'),
]

const businessSpecificationRulebooks = [
  rulebook('概念データフロー図', 'cdfd', [rulebook('図の記法ルール', 'cdfd-mermaid')]),
  group('データモデル', [
    rulebook('業務データ辞書', 'bdd'),
    rulebook('概念データストア定義', 'cdsd'),
    rulebook('保管場所定義', 'sld'),
    rulebook('ステータス定義', 'stsd'),
    rulebook('分類定義', 'cld'),
    rulebook('概念クラス図', 'ccd-mermaid'),
    rulebook('概念状態遷移図', 'cstd', [rulebook('図の記法ルール', 'cstd-mermaid')]),
  ]),
  group('業務モデル', [
    rulebook('業務プロセス仕様', 'bps'),
    rulebook('ビジネスルール', 'br'),
    rulebook('業務イベント一覧', 'bes-index'),
    rulebook('業務イベント仕様', 'bes'),
  ]),
  group('インターフェースモデル', [rulebook('画面仕様', 'uis'), rulebook('帳票仕様', 'bds')]),
  group('共通', [
    rulebook('システム化機能一覧', 'sf-index'),
    rulebook('システム化機能', 'sf'),
    rulebook('用語集', 'gl'),
  ]),
]

const externalIfRulebooks = [
  rulebook('外部システムI/F一覧', 'ifx-index', [rulebook('外部システムIF一覧（YAML）', 'ifx')]),
  rulebook('外部API仕様', 'ifx-api'),
  rulebook('外部ファイル仕様', 'ifx-file'),
  rulebook('外部メッセージ仕様', 'ifx-msg'),
]

const architectureRulebooks = [
  group('C4', [
    rulebook('コンテキスト図', 'cxd', [rulebook('図の記法ルール', 'cxd-mermaid')]),
    rulebook('コンテナ図', 'cnd', [rulebook('図の記法ルール', 'cnd-mermaid')]),
    rulebook('コンポーネント図', 'cpd', [rulebook('図の記法ルール', 'cpd-mermaid')]),
  ]),
  group('インフラ・技術選定', [
    rulebook('インフラ構成図', 'ifd-mermaid'),
    rulebook('技術スタック一覧', 'tsd-index'),
    rulebook('技術スタック', 'tsd'),
  ]),
]

const systemDesignRulebooks = [
  rulebook('システム設計 全体構成', 'sysd-index'),
  rulebook('重要フロー', 'sysd-critical-flows'),
  rulebook('横断ルール', 'sysd-cross-cutting-policy'),
]

const nonFunctionalRequirementRulebooks = [
  rulebook('非機能要件 全体構成', 'nfr-index'),
  rulebook('信頼性', 'nfr-reliability'),
  rulebook('可用性', 'nfr-availability'),
  rulebook('保守性', 'nfr-maintainability'),
  rulebook('完全性', 'nfr-integrity'),
  rulebook('機密性・安全性', 'nfr-security-safety'),
  rulebook('性能', 'nfr-performance'),
  rulebook('運用', 'nfr-operations'),
  rulebook('操作性', 'nfr-usability'),
]

const testingRulebooks = [
  rulebook('テスト戦略・方針', 'tsp-index'),
  group('単体テスト', [
    rulebook('単体テストカタログ 概要', 'utc-index'),
    rulebook('単体テストカタログ 対象別', 'utc'),
  ]),
  group('内部結合テスト', [
    rulebook('内部結合テストカタログ 概要', 'itc-index'),
    rulebook('内部結合テストカタログ 対象別', 'itc'),
  ]),
  group('外部結合テスト', [
    rulebook('外部結合テストカタログ 概要', 'etc-index'),
    rulebook('外部結合テストカタログ 対象別', 'etc'),
  ]),
  group('総合テスト', [
    rulebook('総合テストカタログ 概要', 'stc-index'),
    rulebook('総合テストカタログ 対象別', 'stc'),
  ]),
  group('受入テスト', [
    rulebook('受入テストカタログ 概要', 'atc-index'),
    rulebook('受入テストカタログ 対象別', 'atc'),
  ]),
]

const migrationRulebooks = [
  rulebook('移行計画', 'mip-index'),
  rulebook('データ移行設計 全体構成', 'dmd-index'),
  rulebook('データ移行設計', 'dmd'),
  rulebook('移行テスト計画', 'mtp'),
  rulebook('カットオーバー計画 全体構成', 'cop-index'),
  rulebook('カットオーバー計画', 'cop'),
  rulebook('運用切替計画 全体構成', 'otp-index'),
  rulebook('運用切替計画', 'otp'),
]

const operationsRulebooks = [
  rulebook('運用方針・設計 全体構成', 'opd-index'),
  rulebook('運用方針・設計', 'opd'),
  rulebook('運用手順 全体構成', 'opr-index'),
  rulebook('運用手順', 'opr'),
]

const productChangeRulebooks = [
  group('影響調査', [
    rulebook('業務影響', 'imp-business'),
    rulebook('データ影響', 'imp-data'),
    rulebook('インターフェース影響', 'imp-interface'),
    rulebook('テスト影響', 'imp-test'),
    rulebook('運用影響', 'imp-operations'),
  ]),
  group('トレーサビリティ', [
    rulebook('要求と仕様のトレース', 'trc-requirements-to-specs'),
    rulebook('要求とテストのトレース', 'trc-requirements-to-tests'),
  ]),
  group('移行', migrationRulebooks),
]

const projectDefinitionInstructions = [
  instruction('ステークホルダー登録簿', 'prj-stakeholder-register'),
  instruction('プロジェクト憲章', 'prj-charter'),
  instruction('プロジェクトスコープ', 'prj-scope'),
  instruction('成功基準と受入条件', 'prj-success-criteria-and-acceptance-criteria'),
  instruction('プロジェクト課題と解決アプローチ', 'prj-issues-and-approach'),
  instruction('前提・制約・依存関係', 'prj-assumptions-constraints-dependencies'),
  instruction('代替案の比較', 'prj-comparison-of-alternatives'),
]

const projectManagementInstructions = [
  group('成果物カタログ', [
    instruction('成果物カタログの索引', 'dct-index'),
    instruction('成果物カタログ', 'dct'),
  ]),
  group('管理計画', [
    instruction('プロジェクト管理計画', 'pm-plan'),
    instruction('コミュニケーション計画', 'pm-communication-plan'),
    instruction('品質管理計画', 'pm-quality-management-plan'),
  ]),
  group('組織体制', [
    instruction('組織とロールの定義', 'pm-organization'),
    instruction('ロール定義', 'pm-roles'),
    instruction('メンバー定義', 'pm-members'),
    instruction('組織体制とRACI', 'pm-raci'),
  ]),
  group('管理台帳・管理ビュー', [
    instruction('リスク登録簿', 'pm-risk-register'),
    instruction('課題ログ', 'pm-issue-log'),
    instruction('変更要求ログ', 'pm-change-request-log'),
    instruction('意思決定ログ', 'dec'),
  ]),
  instruction('スケジュール', 'sch'),
  instruction('進捗報告', 'pr'),
  instruction('議事録', 'mm'),
]

const businessSpecificationInstructions = [
  instruction('概念データフロー図', 'cdfd', [instruction('図の記法', 'cdfd-mermaid')]),
  group('データモデル', [
    instruction('業務データ辞書', 'bdd'),
    instruction('概念データストア定義', 'cdsd'),
    instruction('保管場所定義', 'sld'),
    instruction('ステータス定義', 'stsd'),
    instruction('分類定義', 'cld'),
    instruction('概念クラス図', 'ccd-mermaid'),
    instruction('概念状態遷移図', 'cstd', [instruction('図の記法', 'cstd-mermaid')]),
  ]),
  group('業務モデル', [
    instruction('業務プロセス仕様', 'bps'),
    instruction('ビジネスルール', 'br'),
    instruction('業務イベント一覧', 'bes-index'),
    instruction('業務イベント仕様', 'bes'),
  ]),
  group('インターフェースモデル', [instruction('画面仕様', 'uis'), instruction('帳票仕様', 'bds')]),
  group('共通', [
    instruction('システム化機能一覧', 'sf-index'),
    instruction('システム化機能', 'sf'),
    instruction('用語集', 'gl'),
  ]),
]

const externalIfInstructions = [
  instruction('外部システムI/F一覧', 'ifx-index', [
    instruction('外部システムIF一覧（YAML）', 'ifx'),
  ]),
  instruction('外部API仕様', 'ifx-api'),
  instruction('外部ファイル仕様', 'ifx-file'),
  instruction('外部メッセージ仕様', 'ifx-msg'),
]

const architectureInstructions = [
  group('C4', [
    instruction('コンテキスト図', 'cxd', [instruction('図の記法', 'cxd-mermaid')]),
    instruction('コンテナ図', 'cnd', [instruction('図の記法', 'cnd-mermaid')]),
    instruction('コンポーネント図', 'cpd', [instruction('図の記法', 'cpd-mermaid')]),
  ]),
  group('インフラ・技術選定', [
    instruction('インフラ構成図', 'ifd-mermaid'),
    instruction('技術スタック一覧', 'tsd-index'),
    instruction('技術スタック', 'tsd'),
  ]),
]

const systemDesignInstructions = [
  instruction('システム設計 全体構成', 'sysd-index'),
  instruction('重要フロー', 'sysd-critical-flows'),
  instruction('横断ルール', 'sysd-cross-cutting-policy'),
]

const nonFunctionalRequirementInstructions = [
  instruction('非機能要件 全体構成', 'nfr-index'),
  instruction('信頼性', 'nfr-reliability'),
  instruction('可用性', 'nfr-availability'),
  instruction('保守性', 'nfr-maintainability'),
  instruction('完全性', 'nfr-integrity'),
  instruction('機密性・安全性', 'nfr-security-safety'),
  instruction('性能', 'nfr-performance'),
  instruction('運用', 'nfr-operations'),
  instruction('操作性', 'nfr-usability'),
]

const testingInstructions = [
  instruction('テスト戦略・方針', 'tsp-index'),
  group('単体テスト', [
    instruction('単体テストカタログ 概要', 'utc-index'),
    instruction('単体テストカタログ 対象別', 'utc'),
  ]),
  group('内部結合テスト', [
    instruction('内部結合テストカタログ 概要', 'itc-index'),
    instruction('内部結合テストカタログ 対象別', 'itc'),
  ]),
  group('外部結合テスト', [
    instruction('外部結合テストカタログ 概要', 'etc-index'),
    instruction('外部結合テストカタログ 対象別', 'etc'),
  ]),
  group('総合テスト', [
    instruction('総合テストカタログ 概要', 'stc-index'),
    instruction('総合テストカタログ 対象別', 'stc'),
  ]),
  group('受入テスト', [
    instruction('受入テストカタログ 概要', 'atc-index'),
    instruction('受入テストカタログ 対象別', 'atc'),
  ]),
]

const migrationInstructions = [
  instruction('移行計画', 'mip-index'),
  instruction('データ移行設計 全体構成', 'dmd-index'),
  instruction('データ移行設計', 'dmd'),
  instruction('移行テスト計画', 'mtp'),
  instruction('カットオーバー計画 全体構成', 'cop-index'),
  instruction('カットオーバー計画', 'cop'),
  instruction('運用切替計画 全体構成', 'otp-index'),
  instruction('運用切替計画', 'otp'),
]

const operationsInstructions = [
  instruction('運用方針・設計 全体構成', 'opd-index'),
  instruction('運用方針・設計', 'opd'),
  instruction('運用手順 全体構成', 'opr-index'),
  instruction('運用手順', 'opr'),
]

const productChangeInstructions = [
  group('影響調査', [
    instruction('業務影響', 'imp-business'),
    instruction('データ影響', 'imp-data'),
    instruction('インターフェース影響', 'imp-interface'),
    instruction('テスト影響', 'imp-test'),
    instruction('運用影響', 'imp-operations'),
  ]),
  group('トレーサビリティ', [
    instruction('要求と仕様のトレース', 'trc-requirements-to-specs'),
    instruction('要求とテストのトレース', 'trc-requirements-to-tests'),
  ]),
  group('移行', migrationInstructions),
]

export const specdojoSidebarItems = [
  {
    text: 'ガイドライン',
    collapsed: false,
    items: [
      guide('ドキュメントの構成', 'docs-structure-guide'),
      guide('ドキュメントのフェーズ概要', 'docs-phases-overview'),
      guide('ドキュメントの内容', 'docs-contents-guide'),
      guide('ドキュメントの書き方', 'docs-editing-guide'),
      guide('ドキュメンテーションポリシー', 'specdojo-documentation-policy-guide'),
      guide('参考資料の扱い', 'specdojo-reference-materials-guide'),
      guide('コマンド利用', 'specdojo-command-usage-guide'),
      guide('レビュー', 'specdojo-review-guide'),
      group(
        'プロジェクトマネジメント',
        [
          guide('スケジュールと実行', 'specdojo-schedule-and-exec-guide'),
          guide('成果物からスケジュールへ', 'specdojo-deliverables-to-schedule-guide'),
          guide('実行戦略', 'specdojo-exec-strategy-guide'),
        ],
        false
      ),
    ],
  },
  {
    text: '標準',
    collapsed: true,
    items: [
      standard('ドキュメントID・ファイル命名', 'id-and-file-naming-standard'),
      standard('ドキュメントメタ情報', 'document-metadata-standard'),
      standard('成果物メタ情報', 'deliverable-metadata-standard'),
      standard('ルールブックメタ情報', 'rulebook-metadata-standard'),
      standard('ルールブック構造', 'rulebook-structure-standard'),
      standard('指示テンプレートメタ情報', 'instruction-metadata-standard'),
      standard('人・組織定義', 'people-and-organization-definition-standard'),
      standard('テスト文書スコープ', 'test-document-scope-standard'),
    ],
  },
  {
    text: 'ルール',
    collapsed: true,
    items: [
      group('プロジェクト', [
        group('プロジェクト定義', projectDefinitionRulebooks),
        group('プロジェクトマネジメント', projectManagementRulebooks),
        group('プロダクト変更', productChangeRulebooks),
      ]),
      group('業務仕様', businessSpecificationRulebooks),
      group('外部I/F仕様', externalIfRulebooks),
      group('アーキテクチャ', architectureRulebooks),
      group('システム設計', systemDesignRulebooks),
      rulebook('業務受入条件', 'bac'),
      group('非機能要件', nonFunctionalRequirementRulebooks),
      rulebook('システム受入条件', 'sac'),
      group('テスト', testingRulebooks),
      group('移行', migrationRulebooks),
      group('運用', operationsRulebooks),
    ],
  },
  {
    text: '指示テンプレート',
    collapsed: true,
    items: [
      group('プロジェクト', [
        group('プロジェクト定義', projectDefinitionInstructions),
        group('プロジェクトマネジメント', projectManagementInstructions),
        group('プロダクト変更', productChangeInstructions),
      ]),
      group('業務仕様', businessSpecificationInstructions),
      group('外部I/F仕様', externalIfInstructions),
      group('アーキテクチャ', architectureInstructions),
      group('システム設計', systemDesignInstructions),
      instruction('業務受入条件', 'bac'),
      group('非機能要件', nonFunctionalRequirementInstructions),
      instruction('システム受入条件', 'sac'),
      group('テスト', testingInstructions),
      group('移行', migrationInstructions),
      group('運用', operationsInstructions),
    ],
  },
]
