// 型のメニュー（ルール・レシピ・サンプル・テンプレート）の手書き設定（PJR-C8J8）。
// メニューの項目は sidebar-kata.ts が docs/ja/specdojo/ の型の文書から組み立てる。
// ここには分類の名前と並び、分類の中の並び、表示名の上書きだけを書く。
// 既にある分類へ型を足すだけなら、このファイルは触らない（rulebook の deliverable_type で
// 分類に入り、表示名は H1 から作られる）。並びや表示名を変えたいときだけ書き足す。

// 分類（グループ）。items に書いた順に並べ、items に書いていない rulebook のうち
// deliverableTypes に当たるものを末尾へファイル名順で足す。
export type KataMenuGroup = {
  text: string;
  deliverableTypes?: readonly string[];
  items: readonly KataMenuEntry[];
};

// 文字列は rulebook のファイル名から `-rulebook` を除いた名前（例: `cxd`）。
// rulebook から辿れない型の文書は、拡張子を除いたファイル名（例: `exec-human-finalize-recipe`）で書く。
export type KataMenuEntry = string | KataMenuGroup;

export type KataMenuConfig = {
  menu: readonly KataMenuEntry[];
  // 表示名の上書き。キーは menu と同じ名前（rulebook は `-rulebook` なし、ほかはファイル名）。
  // rulebook の表示名は、その rulebook から辿れる recipe・sample・template の表示名にも使う。
  labels: Readonly<Record<string, string>>;
  // rulebook の下に並べる子（2 件目以降の sample や、rulebook から辿れない template）の並び。
  // 書いていない子は後ろへファイル名順で並ぶ。
  children: Readonly<Record<string, readonly KataMenuEntry[]>>;
  // frontmatter の rulebook からもファイル名の接頭辞からも辿れない型の文書の置き場所（rulebook 名）。
  attach: Readonly<Record<string, string>>;
  // どの分類にも当たらない型を入れる分類の名前。
  fallbackGroupText: string;
};

export const kataMenuConfig: KataMenuConfig = {
  menu: [
    {
      text: "プロジェクト",
      deliverableTypes: ["project"],
      items: [
        {
          text: "プロジェクト定義",
          items: [
            "prj-overview",
            "prj-stakeholder-register",
            "prj-charter",
            "prj-scope",
            "prj-success-criteria-and-acceptance-criteria",
            "prj-issues-and-approach",
            "prj-assumptions-constraints-dependencies",
            "prj-comparison-of-alternatives",
          ],
        },
        {
          text: "プロジェクトマネジメント",
          items: [
            { text: "成果物カタログ", items: ["dct-index", "dct"] },
            {
              text: "管理計画",
              items: ["pm-plan", "pm-communication-plan", "pm-quality-management-plan"],
            },
            {
              text: "組織体制",
              items: [
                "pm-organization",
                "pm-roles",
                "pm-members",
                "agent-members-template",
                "pm-raci",
              ],
            },
            {
              text: "管理台帳・管理ビュー",
              items: ["pjr", "pm-risk-register", "pm-issue-log", "pm-change-request-log", "dec"],
            },
            "sch",
            "pr",
            "mm",
          ],
        },
        {
          text: "プロダクト変更",
          items: [
            {
              text: "影響調査",
              items: ["imp-business", "imp-data", "imp-interface", "imp-test", "imp-operations"],
            },
            {
              text: "トレーサビリティ",
              items: ["trc-requirements-to-specs", "trc-requirements-to-tests"],
            },
          ],
        },
      ],
    },
    {
      text: "業務仕様",
      deliverableTypes: ["flow", "data", "rule", "requirement", "ui", "glossary"],
      items: [
        {
          text: "概念データフロー図",
          items: ["cdfd-overview", "cdfd-uc", "cdfd", "cdfd-mermaid", "cdfd-d2"],
        },
        { text: "データモデル", items: ["bdd", "cdsd", "sld", "stsd", "cdt", "ccd-mermaid"] },
        { text: "業務モデル", items: ["bps", "br", "bes-index", "bes"] },
        { text: "インターフェースモデル", items: ["uis", "clis", "bds"] },
        { text: "共通", items: ["sf-index", "sf", "gl"] },
      ],
    },
    {
      text: "外部I/F仕様",
      deliverableTypes: ["api"],
      items: ["ifx-index", "ifx-api", "ifx-cmd", "ifx-file", "ifx-msg"],
    },
    {
      text: "アーキテクチャ",
      deliverableTypes: ["architecture"],
      items: [
        { text: "C4", items: ["cxd", "cnd", "cpd"] },
        { text: "インフラ・技術選定", items: ["ifd-mermaid", "tsd-index", "tsd"] },
      ],
    },
    {
      text: "システム設計",
      items: ["sysd-index", "sysd", "sysd-critical-flows", "sysd-cross-cutting-policy", "dss"],
    },
    "bac",
    {
      text: "非機能要件",
      items: [
        "nfr-index",
        "nfr-reliability",
        "nfr-availability",
        "nfr-maintainability",
        "nfr-integrity",
        "nfr-security-safety",
        "nfr-performance",
        "nfr-operations",
        "nfr-usability",
      ],
    },
    "sac",
    {
      text: "テスト",
      deliverableTypes: ["test"],
      items: [
        "tsp-index",
        { text: "単体テスト", items: ["utc-index", "utc"] },
        { text: "内部結合テスト", items: ["itc-index", "itc"] },
        { text: "外部結合テスト", items: ["etc-index", "etc"] },
        { text: "総合テスト", items: ["stc-index", "stc"] },
        { text: "受入テスト", items: ["atc-index", "atc"] },
      ],
    },
    {
      text: "移行",
      items: [
        "mip-index",
        "dmd-index",
        "dmd",
        "mtp",
        "ntp",
        "cop-index",
        "cop",
        "otp-index",
        "otp",
      ],
    },
    {
      text: "運用",
      deliverableTypes: ["operations"],
      items: ["opd-index", "opd", "opr-index", "opr"],
    },
    { text: "実行", items: ["exec-human-finalize-recipe"] },
  ],
  // 表示名は H1 から作るが、グループ配下で種別や分類が自明な接頭辞（「C4」「非機能要件 /」など）を
  // 落として短くしたいものだけをここに書く。
  labels: {
    "prj-comparison-of-alternatives": "代替案の比較",
    "dct-index": "成果物カタログの索引",
    dct: "成果物カタログ",
    "pm-organization": "組織とロールの定義",
    "pm-members": "メンバー定義",
    "pm-raci": "組織体制とRACI",
    dec: "意思決定ログ",
    "imp-business": "業務影響",
    "imp-data": "データ影響",
    "imp-interface": "インターフェース影響",
    "imp-test": "テスト影響",
    "imp-operations": "運用影響",
    "trc-requirements-to-specs": "要求と仕様のトレース",
    "trc-requirements-to-tests": "要求とテストのトレース",
    "cdfd-overview": "全体概要",
    "cdfd-uc": "ユースケース別",
    cdfd: "プロセスグループ別",
    "cdfd-mermaid": "図の記法ルール（Mermaid）",
    "cdfd-d2": "図の記法ルール（D2）",
    sld: "保管場所定義",
    "stsd-mermaid": "状態遷移図（Mermaid）",
    "ccd-mermaid": "概念クラス図",
    "sf-index": "システム化機能一覧",
    sf: "システム化機能",
    "ifx-file": "外部ファイル仕様",
    cxd: "コンテキスト図",
    "cxd-mermaid": "図の記法ルール",
    cnd: "コンテナ図",
    "cnd-mermaid": "図の記法ルール",
    cpd: "コンポーネント図",
    "cpd-mermaid": "図の記法ルール",
    "ifd-mermaid": "インフラ構成図",
    tsd: "技術スタック",
    "sysd-index": "システム設計 全体構成",
    "sysd-critical-flows": "重要フロー",
    "sysd-cross-cutting-policy": "横断ルール",
    "nfr-index": "非機能要件 全体構成",
    "nfr-reliability": "信頼性",
    "nfr-availability": "可用性",
    "nfr-maintainability": "保守性",
    "nfr-integrity": "完全性",
    "nfr-security-safety": "機密性・安全性",
    "nfr-performance": "性能",
    "nfr-operations": "運用",
    "nfr-usability": "操作性",
    sac: "システム受入条件",
    "utc-index": "単体テストカタログ 概要",
    "itc-index": "内部結合テストカタログ 概要",
    "etc-index": "外部結合テストカタログ 概要",
    "dmd-index": "データ移行設計 全体構成",
    "cop-index": "カットオーバー計画 全体構成",
    "otp-index": "運用切替計画 全体構成",
    "exec-human-finalize-recipe": "humanタスクの確定",
    "agent-members-template": "保護された agent 定義",
    "dct-project-definition-template": "プロジェクト定義",
    "dct-project-management-template": "プロジェクト管理",
    "dct-business-model-bps-template": "業務プロセス仕様",
    "dct-business-model-br-template": "ビジネスルール",
    "dct-business-model-bes-template": "業務イベント仕様",
    "dct-data-flow-template": "データフロー",
    "dct-data-model-bdd-template": "業務データ辞書",
    "dct-data-model-cdsd-template": "概念データストア定義",
    "dct-data-model-sld-template": "保管場所定義",
    "dct-data-model-stsd-template": "ステータス定義・状態遷移",
    "dct-data-model-cdt-template": "分類一覧",
    "dct-data-model-ccd-template": "概念クラス図",
    "dct-user-interface-model-template": "ユーザーインターフェースモデル",
    "dct-system-functions-template": "システム化機能",
    "dct-glossary-template": "用語集",
    "dct-external-interface-specs-template": "外部IF仕様",
    "dct-architecture-template": "アーキテクチャ",
    "dct-system-design-template": "システム設計",
    "dct-business-acceptance-criteria-template": "業務受入基準",
    "dct-non-functional-requirements-template": "非機能要件",
    "dct-system-acceptance-criteria-template": "システム受入基準",
    "dct-test-specs-template": "テスト",
    "dct-impact-analysis-template": "影響調査",
    "dct-migration-planning-template": "移行計画",
    "dct-operations-template": "運用",
    "pjr-todo-template": "TODO",
    "pjr-issue-template": "課題",
    "pjr-risk-template": "リスク",
    "pjr-change-request-template": "変更要求",
    "pjr-decision-template": "意思決定",
    "pjr-note-template": "ノート",
    "pjr-question-template": "質問",
    "pjr-epic-template": "EPIC",
  },
  children: {
    // 成果物カタログの物理分割テンプレートは、成果物カタログの索引（dct-index.yaml）の宣言順に並べる。
    dct: [
      "dct-project-definition-template",
      "dct-project-management-template",
      "dct-business-model-bps-template",
      "dct-business-model-br-template",
      "dct-business-model-bes-template",
      "dct-data-flow-template",
      "dct-data-model-bdd-template",
      "dct-data-model-cdsd-template",
      "dct-data-model-sld-template",
      "dct-data-model-stsd-template",
      "dct-data-model-cdt-template",
      "dct-data-model-ccd-template",
      "dct-user-interface-model-template",
      "dct-system-functions-template",
      "dct-glossary-template",
      "dct-external-interface-specs-template",
      "dct-architecture-template",
      "dct-system-design-template",
      "dct-business-acceptance-criteria-template",
      "dct-non-functional-requirements-template",
      "dct-system-acceptance-criteria-template",
      "dct-test-specs-template",
      "dct-impact-analysis-template",
      "dct-migration-planning-template",
      "dct-operations-template",
    ],
    pjr: [
      "pjr-index-template",
      "pjr-views-by-status-template",
      "pjr-views-by-priority-template",
      "pjr-views-by-owner-template",
      "pjr-dependent-items-template",
      "pjr-derived-items-template",
      "pjr-epic-items-template",
      {
        text: "登録項目",
        items: [
          "pjr-todo-template",
          "pjr-issue-template",
          "pjr-risk-template",
          "pjr-change-request-template",
          "pjr-decision-template",
          "pjr-note-template",
          "pjr-question-template",
          "pjr-epic-template",
        ],
      },
    ],
  },
  attach: {
    "pm-decision-log-template": "dec",
  },
  fallbackGroupText: "その他",
};
