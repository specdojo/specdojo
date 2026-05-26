export const specdojoSidebarItems = [
  {
    text: 'ガイドライン',
    collapsed: false,
    items: [
      { text: 'ドキュメントの構成', link: '/ja/specdojo/guides/docs-structure-guide' },
      { text: 'ドキュメントのフェーズ概要', link: '/ja/specdojo/guides/docs-phases-overview' },
      { text: 'ドキュメントの内容', link: '/ja/specdojo/guides/docs-contents-guide' },
      { text: 'ドキュメントの書き方', link: '/ja/specdojo/guides/docs-editing-guide' },
      {
        text: 'プロジェクトマネジメント',
        collapsed: false,
        items: [
          {
            text: 'プロジェクトドキュメント',
            link: '/ja/specdojo/guides/specdojo-project-docs-guide',
          },
          { text: 'WBS設計', link: '/ja/specdojo/guides/specdojo-wbs-design-guide' },
          {
            text: '定義からタスクの生成アルゴリズム',
            link: '/ja/specdojo/guides/specdojo-definition-to-task-algorithm-guide',
          },
        ],
      },
    ],
  },
  {
    text: 'ルール',
    items: [
      {
        text: '共通',
        collapsed: true,
        items: [
          {
            text: 'ドキュメントID命名ルール',
            link: '/ja/specdojo/rulebooks/meta-id-and-file-naming-rulebook',
          },
          {
            text: 'メタ情報記述ルール',
            link: '/ja/specdojo/rulebooks/meta-document-metadata-rulebook',
          },
        ],
      },
      {
        text: 'プロジェクト',
        collapsed: true,
        items: [
          {
            text: 'プロジェクト概要',
            link: '/ja/specdojo/rulebooks/prj-overview-rulebook',
          },
          {
            text: 'プロジェクトスコープ',
            link: '/ja/specdojo/rulebooks/prj-scope-rulebook',
          },
          {
            text: 'プロジェクト課題と解決アプローチ',
            link: '/ja/specdojo/rulebooks/prj-issues-and-approach-rulebook',
          },
        ],
      },
      {
        text: '業務仕様',
        collapsed: true,
        items: [
          {
            text: '概念データフロー図',
            link: '/ja/specdojo/rulebooks/cdfd-rulebook',
            collapsed: true,
            items: [
              { text: '図の記法ルール', link: '/ja/specdojo/rulebooks/cdfd-mermaid-rulebook' },
            ],
          },
          {
            text: 'データモデル',
            collapsed: true,
            items: [
              { text: '業務データ辞書', link: '/ja/specdojo/rulebooks/bdd-rulebook' },
              { text: '概念データストア定義', link: '/ja/specdojo/rulebooks/cdsd-rulebook' },
              { text: '保管場所定義', link: '/ja/specdojo/rulebooks/sld-rulebook' },
              { text: 'ステータス定義', link: '/ja/specdojo/rulebooks/stsd-rulebook' },
              { text: '分類定義', link: '/ja/specdojo/rulebooks/cld-rulebook' },
              { text: '概念クラス図', link: '/ja/specdojo/rulebooks/ccd-mermaid-rulebook' },
              { text: '概念状態遷移図', link: '/ja/specdojo/rulebooks/cstd-rulebook' },
            ],
          },
          {
            text: '業務モデル',
            collapsed: true,
            items: [
              { text: '業務プロセス仕様', link: '/ja/specdojo/rulebooks/bps-rulebook' },
              { text: 'ビジネスルール', link: '/ja/specdojo/rulebooks/br-rulebook' },
              { text: '業務イベント一覧', link: '/ja/specdojo/rulebooks/bes-index-rulebook' },
              { text: '業務イベント仕様', link: '/ja/specdojo/rulebooks/bes-rulebook' },
            ],
          },
          {
            text: 'インターフェースモデル',
            collapsed: true,
            items: [
              { text: '画面仕様', link: '/ja/specdojo/rulebooks/uis-rulebook' },
              { text: '帳票仕様', link: '/ja/specdojo/rulebooks/bds-rulebook' },
            ],
          },
          {
            text: '共通',
            collapsed: true,
            items: [
              { text: 'システム化機能一覧', link: '/ja/specdojo/rulebooks/sf-rulebook' },
              { text: '用語集', link: '/ja/specdojo/rulebooks/gl-rulebook' },
            ],
          },
        ],
      },
      {
        text: '外部I/F仕様',
        collapsed: true,
        items: [
          { text: '外部システムI/F一覧', link: '/ja/specdojo/rulebooks/ifx-rulebook' },
          { text: '外部API仕様', link: '/ja/specdojo/rulebooks/ifx-api-rulebook' },
          { text: '外部ファイル仕様', link: '/ja/specdojo/rulebooks/ifx-file-rulebook' },
          { text: '外部メッセージ仕様', link: '/ja/specdojo/rulebooks/ifx-msg-rulebook' },
        ],
      },
      {
        text: 'アーキテクチャ',
        collapsed: true,
        items: [
          {
            text: 'C4',
            items: [
              {
                text: 'コンテキスト図',
                link: '/ja/specdojo/rulebooks/cxd-rulebook',
                collapsed: true,
                items: [
                  { text: '図の記法ルール', link: '/ja/specdojo/rulebooks/cxd-mermaid-rulebook' },
                ],
              },
              {
                text: 'コンテナ図',
                link: '/ja/specdojo/rulebooks/cnd-rulebook',
                collapsed: true,
                items: [
                  { text: '図の記法ルール', link: '/ja/specdojo/rulebooks/cnd-mermaid-rulebook' },
                ],
              },
              {
                text: 'コンポーネント図',
                link: '/ja/specdojo/rulebooks/cpd-rulebook',
                collapsed: true,
                items: [
                  { text: '図の記法ルール', link: '/ja/specdojo/rulebooks/cpd-mermaid-rulebook' },
                ],
              },
            ],
          },
          {
            text: 'インフラ・技術選定',
            items: [
              {
                text: 'インフラ構成図',
                link: '/ja/specdojo/rulebooks/ifd-mermaid-rulebook',
                collapsed: true,
                items: [
                  { text: '図の記法ルール', link: '/ja/specdojo/rulebooks/ifd-mermaid-rulebook' },
                ],
              },
              { text: '技術スタック一覧', link: '/ja/specdojo/rulebooks/tsd-rulebook' },
            ],
          },
        ],
      },
      { text: 'システム設計' },
      { text: '業務受入条件', link: '/ja/specdojo/rulebooks/bac-rulebook' },
      { text: '非機能要件', link: '/ja/specdojo/rulebooks/nfr-index-rulebook' },
      { text: 'システム受入条件', link: '/ja/specdojo/rulebooks/sac-rulebook' },
      {
        text: 'テスト',
        collapsed: true,
        items: [
          {
            text: '各ドキュメントのスコープ',
            link: '/ja/specdojo/rulebooks/meta-test-document-scope-rulebook',
          },
          { text: 'テスト戦略・方針', link: '/ja/specdojo/rulebooks/tsp-index-rulebook' },
          {
            text: '単体テスト',
            collapsed: true,
            items: [
              {
                text: '単体テストカタログ 概要',
                link: '/ja/specdojo/rulebooks/utc-index-rulebook',
              },
              { text: '単体テストカタログ 対象別', link: '/ja/specdojo/rulebooks/utc-rulebook' },
            ],
          },
          {
            text: '内部結合テスト',
            collapsed: true,
            items: [
              {
                text: '内部結合テストカタログ 概要',
                link: '/ja/specdojo/rulebooks/itc-index-rulebook',
              },
              {
                text: '内部結合テストカタログ 対象別',
                link: '/ja/specdojo/rulebooks/itc-rulebook',
              },
            ],
          },
          {
            text: '外部結合テスト',
            collapsed: true,
            items: [
              {
                text: '外部結合テストカタログ 概要',
                link: '/ja/specdojo/rulebooks/etc-index-rulebook',
              },
              {
                text: '外部結合テストカタログ 対象別',
                link: '/ja/specdojo/rulebooks/etc-rulebook',
              },
            ],
          },
          {
            text: '総合テスト',
            collapsed: true,
            items: [
              {
                text: '総合テストカタログ 概要',
                link: '/ja/specdojo/rulebooks/stc-index-rulebook',
              },
              { text: '総合テストカタログ 対象別', link: '/ja/specdojo/rulebooks/stc-rulebook' },
            ],
          },
          {
            text: '受入テスト',
            collapsed: true,
            items: [
              {
                text: '受入テストカタログ 概要',
                link: '/ja/specdojo/rulebooks/atc-index-rulebook',
              },
              { text: '受入テストカタログ 対象別', link: '/ja/specdojo/rulebooks/atc-rulebook' },
            ],
          },
        ],
      },
      {
        text: '移行',
        collapsed: true,
        items: [
          { text: '移行計画', link: '/ja/specdojo/rulebooks/mip-index-rulebook' },
          { text: 'データ移行設計', link: '/ja/specdojo/rulebooks/dmd-rulebook' },
          { text: '移行テスト計画', link: '/ja/specdojo/rulebooks/mtp-rulebook' },
          { text: 'カットオーバー計画', link: '/ja/specdojo/rulebooks/cop-rulebook' },
          { text: '運用切替計画', link: '/ja/specdojo/rulebooks/otp-rulebook' },
        ],
      },
      {
        text: '運用',
        collapsed: true,
        items: [
          { text: '運用方針・設計', link: '/ja/specdojo/rulebooks/opd-rulebook' },
          { text: '運用手順', link: '/ja/specdojo/rulebooks/opr-rulebook' },
        ],
      },
    ],
  },
  {
    text: '指示テンプレート',
    collapsed: true,
    items: [
      { text: 'プロジェクト' },
      {
        text: '業務仕様',
        collapsed: true,
        items: [
          { text: '概念データフロー図', link: '/ja/specdojo/instructions/cdfd-instruction' },
          {
            text: 'データモデル',
            collapsed: true,
            items: [
              { text: '業務データ辞書', link: '/ja/specdojo/instructions/bdd-instruction' },
              {
                text: '概念データストア一覧',
                link: '/ja/specdojo/instructions/cdsd-instruction',
              },
              { text: '保管場所一覧', link: '/ja/specdojo/instructions/sld-instruction' },
              { text: 'ステータス一覧', link: '/ja/specdojo/instructions/stsd-instruction' },
              { text: '分類一覧', link: '/ja/specdojo/instructions/cld-instruction' },
              {
                text: '概念クラス図',
                link: '/ja/specdojo/instructions/ccd-mermaid-instruction',
              },
              { text: '概念状態遷移図', link: '/ja/specdojo/instructions/cstd-instruction' },
            ],
          },
          {
            text: '業務モデル',
            collapsed: true,
            items: [
              { text: '業務プロセス仕様', link: '/ja/specdojo/instructions/bps-instruction' },
              { text: 'ビジネスルール', link: '/ja/specdojo/instructions/br-instruction' },
              { text: '業務イベント一覧', link: '/ja/specdojo/instructions/bes-index-instruction' },
              { text: '業務イベント仕様', link: '/ja/specdojo/instructions/bes-instruction' },
            ],
          },
          {
            text: 'インターフェースモデル',
            collapsed: true,
            items: [
              { text: '画面仕様', link: '/ja/specdojo/instructions/uis-instruction' },
              { text: '帳票仕様', link: '/ja/specdojo/instructions/bds-instruction' },
            ],
          },
          {
            text: '共通',
            collapsed: true,
            items: [
              { text: 'システム化機能一覧', link: '/ja/specdojo/instructions/sf-instruction' },
              { text: '用語集', link: '/ja/specdojo/instructions/gl-instruction' },
            ],
          },
        ],
      },
      {
        text: '外部I/F仕様',
        collapsed: true,
        items: [
          { text: '外部システムI/F一覧', link: '/ja/specdojo/instructions/ifx-instruction' },
          { text: '外部API仕様', link: '/ja/specdojo/instructions/ifx-api-instruction' },
          { text: '外部ファイル仕様', link: '/ja/specdojo/instructions/ifx-file-instruction' },
          { text: '外部メッセージ仕様', link: '/ja/specdojo/instructions/ifx-msg-instruction' },
        ],
      },
      {
        text: 'アーキテクチャ',
        collapsed: true,
        items: [
          {
            text: 'C4',
            items: [
              { text: 'コンテキスト図', link: '/ja/specdojo/instructions/cxd-instruction' },
              { text: 'コンテナ図', link: '/ja/specdojo/instructions/cnd-instruction' },
              { text: 'コンポーネント図', link: '/ja/specdojo/instructions/cpd-instruction' },
            ],
          },
          {
            text: 'インフラ・技術選定',
            items: [
              { text: 'インフラ構成図', link: '/ja/specdojo/instructions/ifd-mermaid-instruction' },
              { text: '技術スタック一覧', link: '/ja/specdojo/instructions/tsd-instruction' },
            ],
          },
        ],
      },
      { text: 'システム設計' },
      { text: '業務受入条件', link: '/ja/specdojo/instructions/bac-instruction' },
      { text: '非機能要件', link: '/ja/specdojo/instructions/nfr-index-instruction' },
      { text: 'システム受入条件', link: '/ja/specdojo/instructions/sac-instruction' },
      {
        text: 'テスト',
        collapsed: true,
        items: [
          { text: 'テスト戦略・方針', link: '/ja/specdojo/instructions/tsp-index-instruction' },
          { text: 'テスト観点・条件' },
          {
            text: '単体テスト',
            collapsed: true,
            items: [
              { text: '単体テスト仕様', link: '/ja/specdojo/instructions/utc-index-instruction' },
              {
                text: '単体テスト個別仕様',
                link: '/ja/specdojo/instructions/utc-instruction',
              },
              { text: '単体テスト設計' },
              { text: '単体テスト個別設計' },
            ],
          },
          {
            text: '内部結合テスト',
            collapsed: true,
            items: [
              {
                text: '内部結合テスト仕様',
                link: '/ja/specdojo/instructions/itc-index-instruction',
              },
              {
                text: '内部結合テスト個別仕様',
                link: '/ja/specdojo/instructions/itc-instruction',
              },
              { text: '内部結合テスト設計' },
              { text: '内部結合テスト個別設計' },
            ],
          },
          {
            text: '外部結合テスト',
            collapsed: true,
            items: [
              {
                text: '外部結合テスト仕様',
                link: '/ja/specdojo/instructions/etc-index-instruction',
              },
              {
                text: '外部結合テスト個別仕様',
                link: '/ja/specdojo/instructions/etc-instruction',
              },
              {
                text: '外部結合テスト設計',
                link: '/ja/specdojo/instructions/etd-index-instruction',
              },
              {
                text: '外部結合テスト個別設計',
                link: '/ja/specdojo/instructions/etd-instruction',
              },
            ],
          },
          {
            text: '総合テスト',
            collapsed: true,
            items: [
              { text: '総合テスト仕様', link: '/ja/specdojo/instructions/stc-index-instruction' },
              {
                text: '総合テスト個別仕様',
                link: '/ja/specdojo/instructions/stc-instruction',
              },
              { text: '総合テスト設計' },
              { text: '総合テスト個別設計' },
            ],
          },
          {
            text: '受入テスト',
            collapsed: true,
            items: [
              { text: '受入テスト仕様', link: '/ja/specdojo/instructions/ats-index-instruction' },
              {
                text: '受入テスト個別仕様',
                link: '/ja/specdojo/instructions/ats-instruction',
              },
              { text: '受入テスト設計', link: '/ja/specdojo/instructions/atd-index-instruction' },
              {
                text: '受入テスト個別設計',
                link: '/ja/specdojo/instructions/atd-instruction',
              },
            ],
          },
        ],
      },
      { text: '移行' },
      { text: '運用' },
    ],
  },
]
