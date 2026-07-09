// VitePress サイドバーの固定データ（手動メニュー構成・表示名・表示順）を集約する。
// 変換ロジック（transformSidebar 等）は config.mts 側に置く。

export type SidebarItem = {
  text?: string;
  link?: string;
  collapsed?: boolean;
  items?: SidebarItem[];
};

const specdojoLink = (dir: string, id: string) => `/ja/specdojo/${dir}/${id}`;
const guide = (text: string, id: string): SidebarItem => ({
  text,
  link: specdojoLink("guides", id),
});
const standard = (text: string, id: string): SidebarItem => ({
  text,
  link: specdojoLink("standards", id),
});
const rulebook = (text: string, id: string, items?: SidebarItem[]): SidebarItem => ({
  text,
  link: specdojoLink("rulebooks", `${id}-rulebook`),
  ...(items ? { collapsed: true, items } : {}),
});
const group = (text: string, items: SidebarItem[], collapsed = true): SidebarItem => ({
  text,
  collapsed,
  items,
});

const projectDefinitionRulebooks = [
  rulebook("プロジェクト概要", "prj-overview"),
  rulebook("ステークホルダー登録簿", "prj-stakeholder-register"),
  rulebook("プロジェクト憲章", "prj-charter"),
  rulebook("プロジェクトスコープ", "prj-scope"),
  rulebook("成功基準と受入条件", "prj-success-criteria-and-acceptance-criteria"),
  rulebook("プロジェクト課題と解決アプローチ", "prj-issues-and-approach"),
  rulebook("前提・制約・依存関係", "prj-assumptions-constraints-dependencies"),
  rulebook("代替案の比較", "prj-comparison-of-alternatives"),
];

const projectManagementRulebooks = [
  group("成果物カタログ", [
    rulebook("成果物カタログの索引", "dct-index"),
    rulebook("成果物カタログ", "dct"),
  ]),
  group("管理計画", [
    rulebook("プロジェクト管理計画", "pm-plan"),
    rulebook("コミュニケーション計画", "pm-communication-plan"),
    rulebook("品質管理計画", "pm-quality-management-plan"),
  ]),
  group("組織体制", [
    rulebook("組織とロールの定義", "pm-organization"),
    rulebook("ロール定義", "pm-roles"),
    rulebook("メンバー定義", "pm-members"),
    rulebook("組織体制とRACI", "pm-raci"),
  ]),
  group("管理台帳・管理ビュー", [
    rulebook("プロジェクト登録簿", "pjr-index"),
    rulebook("リスク登録簿", "pm-risk-register"),
    rulebook("課題ログ", "pm-issue-log"),
    rulebook("変更要求ログ", "pm-change-request-log"),
    rulebook("意思決定ログ", "dec"),
  ]),
  rulebook("スケジュール", "sch"),
  rulebook("進捗報告", "pr"),
  rulebook("議事録", "mm"),
];

const businessSpecificationRulebooks = [
  rulebook("概念データフロー図", "cdfd", [rulebook("図の記法ルール", "cdfd-mermaid")]),
  group("データモデル", [
    rulebook("業務データ辞書", "bdd"),
    rulebook("概念データストア定義", "cdsd"),
    rulebook("保管場所定義", "sld"),
    rulebook("ステータス定義", "stsd"),
    rulebook("分類定義", "cld"),
    rulebook("概念クラス図", "ccd-mermaid"),
    rulebook("概念状態遷移図", "cstd", [rulebook("図の記法ルール", "cstd-mermaid")]),
  ]),
  group("業務モデル", [
    rulebook("業務プロセス仕様", "bps"),
    rulebook("ビジネスルール", "br"),
    rulebook("業務イベント一覧", "bes-index"),
    rulebook("業務イベント仕様", "bes"),
  ]),
  group("インターフェースモデル", [rulebook("画面仕様", "uis"), rulebook("帳票仕様", "bds")]),
  group("共通", [
    rulebook("システム化機能一覧", "sf-index"),
    rulebook("システム化機能", "sf"),
    rulebook("用語集", "gl"),
  ]),
];

const externalIfRulebooks = [
  rulebook("外部システムI/F一覧", "ifx-index", [rulebook("外部システムIF一覧（YAML）", "ifx")]),
  rulebook("外部API仕様", "ifx-api"),
  rulebook("外部ファイル仕様", "ifx-file"),
  rulebook("外部メッセージ仕様", "ifx-msg"),
];

const architectureRulebooks = [
  group("C4", [
    rulebook("コンテキスト図", "cxd", [rulebook("図の記法ルール", "cxd-mermaid")]),
    rulebook("コンテナ図", "cnd", [rulebook("図の記法ルール", "cnd-mermaid")]),
    rulebook("コンポーネント図", "cpd", [rulebook("図の記法ルール", "cpd-mermaid")]),
  ]),
  group("インフラ・技術選定", [
    rulebook("インフラ構成図", "ifd-mermaid"),
    rulebook("技術スタック一覧", "tsd-index"),
    rulebook("技術スタック", "tsd"),
  ]),
];

const systemDesignRulebooks = [
  rulebook("システム設計 全体構成", "sysd-index"),
  rulebook("重要フロー", "sysd-critical-flows"),
  rulebook("横断ルール", "sysd-cross-cutting-policy"),
];

const nonFunctionalRequirementRulebooks = [
  rulebook("非機能要件 全体構成", "nfr-index"),
  rulebook("信頼性", "nfr-reliability"),
  rulebook("可用性", "nfr-availability"),
  rulebook("保守性", "nfr-maintainability"),
  rulebook("完全性", "nfr-integrity"),
  rulebook("機密性・安全性", "nfr-security-safety"),
  rulebook("性能", "nfr-performance"),
  rulebook("運用", "nfr-operations"),
  rulebook("操作性", "nfr-usability"),
];

const testingRulebooks = [
  rulebook("テスト戦略・方針", "tsp-index"),
  group("単体テスト", [
    rulebook("単体テストカタログ 概要", "utc-index"),
    rulebook("単体テストカタログ 対象別", "utc"),
  ]),
  group("内部結合テスト", [
    rulebook("内部結合テストカタログ 概要", "itc-index"),
    rulebook("内部結合テストカタログ 対象別", "itc"),
  ]),
  group("外部結合テスト", [
    rulebook("外部結合テストカタログ 概要", "etc-index"),
    rulebook("外部結合テストカタログ 対象別", "etc"),
  ]),
  group("総合テスト", [
    rulebook("総合テストカタログ 概要", "stc-index"),
    rulebook("総合テストカタログ 対象別", "stc"),
  ]),
  group("受入テスト", [
    rulebook("受入テストカタログ 概要", "atc-index"),
    rulebook("受入テストカタログ 対象別", "atc"),
  ]),
];

const migrationRulebooks = [
  rulebook("移行計画", "mip-index"),
  rulebook("データ移行設計 全体構成", "dmd-index"),
  rulebook("データ移行設計", "dmd"),
  rulebook("移行テスト計画", "mtp"),
  rulebook("カットオーバー計画 全体構成", "cop-index"),
  rulebook("カットオーバー計画", "cop"),
  rulebook("運用切替計画 全体構成", "otp-index"),
  rulebook("運用切替計画", "otp"),
];

const operationsRulebooks = [
  rulebook("運用方針・設計 全体構成", "opd-index"),
  rulebook("運用方針・設計", "opd"),
  rulebook("運用手順 全体構成", "opr-index"),
  rulebook("運用手順", "opr"),
];

const productChangeRulebooks = [
  group("影響調査", [
    rulebook("業務影響", "imp-business"),
    rulebook("データ影響", "imp-data"),
    rulebook("インターフェース影響", "imp-interface"),
    rulebook("テスト影響", "imp-test"),
    rulebook("運用影響", "imp-operations"),
  ]),
  group("トレーサビリティ", [
    rulebook("要求と仕様のトレース", "trc-requirements-to-specs"),
    rulebook("要求とテストのトレース", "trc-requirements-to-tests"),
  ]),
  group("移行", migrationRulebooks),
];

export const specdojoSidebarItems = [
  {
    text: "ガイドライン",
    collapsed: false,
    items: [
      guide("ドキュメントの構成", "docs-structure-guide"),
      guide("ドキュメントの作成順", "docs-authoring-order-guide"),
      guide("ドキュメントのフェーズ概要", "docs-phases-overview"),
      guide("ドキュメントの内容", "docs-contents-guide"),
      guide("ドキュメントの書き方", "docs-editing-guide"),
      guide("ドキュメンテーションポリシー", "specdojo-documentation-policy-guide"),
      guide("参考資料の扱い", "specdojo-reference-materials-guide"),
      guide("レビュー", "specdojo-review-guide"),
      group(
        "CLIツール",
        [
          guide("CLI概要", "specdojo-cli-overview-guide"),
          guide("コマンドリファレンス", "specdojo-command-reference-guide"),
        ],
        false,
      ),
      group(
        "スケジュールと実行",
        [
          guide("成果物からスケジュールへ", "specdojo-deliverables-to-schedule-guide"),
          guide("スケジュール設計", "specdojo-schedule-design-guide"),
          guide("実行運用", "specdojo-exec-operation-guide"),
          guide("実行設定", "specdojo-exec-config-guide"),
          guide("plan/resultライフサイクル", "specdojo-plan-result-lifecycle-guide"),
          guide("worktree運用", "specdojo-exec-worktree-guide"),
        ],
        false,
      ),
    ],
  },
  {
    text: "標準",
    collapsed: true,
    items: [
      standard("ドキュメントID・ファイル命名", "id-and-file-naming-standard"),
      standard("ドキュメントメタ情報", "document-metadata-standard"),
      standard("ルールブック記述", "rulebook-authoring-standard"),
      standard("レシピ記述", "recipe-authoring-standard"),
      standard("サンプル記述", "sample-authoring-standard"),
      standard("テンプレート記述", "template-authoring-standard"),
      standard("ガイド記述", "guide-authoring-standard"),
      standard("標準記述", "standard-authoring-standard"),
      standard("人・組織定義", "people-and-organization-definition-standard"),
      standard("テスト文書スコープ", "test-document-scope-standard"),
    ],
  },
  {
    text: "ルール",
    collapsed: true,
    items: [
      group("プロジェクト", [
        group("プロジェクト定義", projectDefinitionRulebooks),
        group("プロジェクトマネジメント", projectManagementRulebooks),
        group("プロダクト変更", productChangeRulebooks),
      ]),
      group("業務仕様", businessSpecificationRulebooks),
      group("外部I/F仕様", externalIfRulebooks),
      group("アーキテクチャ", architectureRulebooks),
      group("システム設計", systemDesignRulebooks),
      rulebook("業務受入条件", "bac"),
      group("非機能要件", nonFunctionalRequirementRulebooks),
      rulebook("システム受入条件", "sac"),
      group("テスト", testingRulebooks),
      group("移行", migrationRulebooks),
      group("運用", operationsRulebooks),
    ],
  },
];

export const PROJECTS_SEGMENT_TEXT: Record<string, string> = {
  projects: "プロジェクト",
  "010-deliverables-catalog": "成果物カタログ",
  "020-project-definition": "プロジェクト定義",
  "030-project-management": "プロジェクトマネジメント",
  "040-product-change": "プロダクト変更",
  "010-management-plan": "管理計画",
  "020-organization": "組織体制",
  controls: "管理台帳・管理ビュー",
  "project-register": "プロジェクト登録簿",
  reporting: "レポート",
  "progress-reports": "進捗報告",
  "meeting-minutes": "議事録",
  execution: "実行管理",
  exec: "実行ワークスペース",
  events: "イベントログ",
  plans: "実行プラン",
  results: "実行結果",
  generated: "生成物",
  reviews: "レビュー",
  schedule: "スケジュール",
  "010-as-is": "現状定義",
  "010-business-specifications": "業務仕様",
  "020-impact-analysis": "影響調査",
  "030-traceability": "トレーサビリティ",
  "040-migration": "移行",
};

export const PROJECTS_FILE_TEXT: Record<string, string> = {
  index: "一覧",
  "task-catalog": "タスクカタログ",
};

// プロジェクト配下の既知ファイルのメニュー表示（標準成果物と生成ビュー）。
// text: H1 の「タイトル: <プロジェクト名>」形式や英語 H1 より短い固定表示名（H1 より優先）。
// order: 同一ディレクトリ内での表示順。ファイル名順ではなく作成順・検討順
// （docs-authoring-order-guide）や参照頻度に合わせる。未登録ファイルはファイル名順で後続に並ぶ。
// order を省略したファイルは既定の並び（README は先頭）に従う。
export const PROJECTS_FILE_MENU: Record<string, { text: string; order?: number }> = {
  README: { text: "概要" },
  // 010-deliverables-catalog
  "dct-index": { text: "成果物カタログの索引", order: 10 },
  "dct-project-definition": { text: "成果物カタログ（プロジェクト定義）", order: 20 },
  "dct-project-management": { text: "成果物カタログ（プロジェクトマネジメント）", order: 30 },
  // 020-project-definition
  "prj-overview": { text: "プロジェクト概要", order: 10 },
  "prj-stakeholder-register": { text: "ステークホルダー登録簿", order: 20 },
  "prj-charter": { text: "プロジェクト憲章", order: 30 },
  "prj-scope": { text: "プロジェクトスコープ", order: 40 },
  "prj-success-criteria-and-acceptance-criteria": { text: "成功基準と受入条件", order: 50 },
  "prj-issues-and-approach": { text: "課題と解決アプローチ", order: 60 },
  "prj-assumptions-constraints-dependencies": { text: "前提・制約・依存関係", order: 70 },
  "prj-comparison-of-alternatives": { text: "代替案の比較", order: 80 },
  // 030-project-management / 010-management-plan
  "pm-plan": { text: "プロジェクト管理計画", order: 10 },
  "pm-communication-plan": { text: "コミュニケーション計画", order: 20 },
  "pm-quality-management-plan": { text: "品質管理計画", order: 30 },
  // 030-project-management / 020-organization
  "pm-organization": { text: "組織とロールの定義", order: 10 },
  "pm-raci": { text: "組織体制とRACI", order: 20 },
  // 030-project-management / controls
  "pjr-index": { text: "プロジェクト登録簿", order: 10 },
  "pm-risk-register": { text: "リスク登録簿", order: 10 },
  "pm-issue-log": { text: "課題ログ", order: 20 },
  "pm-change-request-log": { text: "変更要求ログ", order: 30 },
  "pm-decision-log": { text: "意思決定ログ", order: 40 },
  // 030-project-management / execution / generated（進捗ビュー）
  ready: { text: "着手可能タスク", order: 10 },
  timeline: { text: "タイムライン", order: 20 },
  "critical-path": { text: "クリティカルパス", order: 30 },
  cpm: { text: "クリティカルパス分析", order: 40 },
  "schedule-diff": { text: "スケジュール差分", order: 50 },
};

// グループ（リンクなし）の表示順。メニュー表示名（変換後）をキーにする。
// 既定では同一階層の先頭に並ぶため、後ろへ動かしたいグループのみ登録する。
// 実行プラン・実行結果は大量の項目を含むため、進捗ビューの後ろに置く。
export const PROJECTS_GROUP_ORDER: Record<string, number> = {
  実行プラン: 90,
  実行結果: 95,
};

// グループ化せず、子を親と同一階層へ展開するグループ（メニュー表示名）。
// 「生成物」（generated フォルダ）は一覧性のため、「実行ワークスペース」（exec フォルダ）は
// VitePress サイドバーの描画深さ上限を超えて実行プラン・実行結果が表示されなくなるのを防ぐため。
export const FLATTENED_GROUP_TEXTS = new Set(["生成物", "実行ワークスペース"]);
