---
specdojo:
  id: prj-0001:pjr-dh8e-rate-limit-on-non-critical-unused
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: low
  registered_at: "2026-11-12T13:24:54Z"
---

# PJR-DH8E exec-defaults の `rate_limit_policy.on_non_critical` が、今の振る舞いに使われていない

## 1. 課題内容

schema は `on_non_critical.action: skip` を必須にしているが、`runWithRetry` はクリティカルパスの内外にかかわらず次の候補へ切り替えて再試行し、この項目を読まない。

## 2. 入力

- 2026-11-12 の用語集 gl-setup の review（grade needs-work 87）で、利用枠制限時の方針の説明が exec 設定ガイドと実装に食い違うと指摘された。調べると schema の `on_non_critical` が実装（`src/exec/run/agent.ts` の `runWithRetry`、`src/exec/agent-config.ts` の型）から読まれていなかった
- 用語集は今の振る舞いに合わせて直した。schema の項目を消すか意味を書き直すかは、既存の設定ファイルへの影響があるため 0.8.0 では扱わず、次の版の候補とする（indie が 2026-11-12 に承認）

## 3. 影響範囲

| 観点         | 影響                                                               |
| ------------ | ------------------------------------------------------------------ |
| スコープ     | schema の説明、設定ガイド、初期設定テンプレート、型のコメント      |
| スケジュール | 0.8.0 で受理形式と実行挙動を維持し、項目の廃止・再設計は次版で検討 |
| コスト       | 実 agent の起動や利用枠の消費は不要                                |
| 品質         | 未使用の必須項目を実効性のある設定と誤解しないようにする           |
| 関係者       | exec 設定の利用者・保守者                                          |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                        |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 全タスク共通の候補切替・再試行へ変わった後も、schema に非クリティカルタスクをスキップするという説明が残った                                                                                 |
| 対応策   | `on_non_critical` を互換用の未使用項目と明記し、`on_critical.retry` の適用範囲を実装に合わせる。必須指定・許容値・実行処理は維持する                                                        |
| 依存事項 | [[specdojo:exec-config-guide\|exec設定ガイド]] と `runWithRetry` の現行動作を正とし、入力にある 0.8.0 の互換性方針に従う                                                                    |
| 完了条件 | 仮説: schema・型・設定例・ガイドが未使用であることと全タスク共通の再試行を説明し、既存設定の受理形式と実行挙動を変えない。個票に対応結果と CHANGELOG 文案を残し、適用される整形・検査を通す |

### 4.1. 作業内容

| No  | 作業                                       | 状態 | メモ                                                                                      |
| --- | ------------------------------------------ | ---- | ----------------------------------------------------------------------------------------- |
| 1   | schema と実装・設計の差分を確認する        | done | `runWithRetry` にクリティカルパス区分の引数・分岐がなく、共通の再試行を使うことを確認した |
| 2   | schema・型・設定例・ガイドの説明を合わせる | done | 必須キーと `skip` の許容値は維持し、実行時に参照しないことを明記した                      |
| 3   | 整形・検査と対応結果の記録を行う           | done | Prettier・設定例の schema 検証・履歴リンク・カタログ検証を通し、結果を記録した            |

## 5. 対応結果

### 5.1. 変更内容と互換性

- 完了条件が未定義だったため、4 節の仮説を今回の基準とした。入力の承認済み方針に沿い、0.8.0 では設定の削除・省略可能化・実行時のスキップ導入を行わず、現状の説明を修正した。
- `docs/specdojo/schemas/v1/exec-defaults.schema.yaml` の説明を、`on_non_critical` は互換用の必須項目で実行時には未使用、`on_critical.retry` は自動選択の全タスクに適用、という実装に合わせた。schema の検証制約は変えていない。
- `src/exec/agent-config.ts`、`templates/init-exec-defaults.yaml`、[[specdojo:exec-config-guide|exec設定ガイド]] に互換用項目の扱いを明記した。provider 別の設定にも同じ制約が適用される。
- 保護対象の `.specdojo/exec-defaults.yaml` は変更不要。既存の設定をそのまま使用できる。項目の廃止・再設計は次版の検討事項として残す。

### 5.2. 検証

- 変更した 5 ファイルを Prettier で整形した。
- `npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/exec-defaults.schema.yaml --data templates/init-exec-defaults.yaml`、`npm run validate:history-links`、`node --import tsx tools/catalog-validate-if-configured.mjs` は成功した。カタログには変更対象外の再エクスポート参照・移動前の文書パスについて警告がある。
- hook に対応する `node --import tsx src/specdojo.ts register build` は成功し、非追跡の派生ビューを生成した。
- 実行処理・型定義・schema の検証制約・テンプレートの設定値は変更していない。説明の変更だけのため、追加テストは作成しなかった。型検査・単体テスト・統合テスト・共通 lint・schema 全体検証は親 runner が実行する。

### 5.3. CHANGELOG に書く事項

- 区分: 変更。
- 文案: exec 設定の `rate_limit_policy.on_non_critical` が互換用の必須項目で実行時には未使用であることを、schema・設定ガイド・初期設定例に明記した。設定の受理形式と実行挙動は変更していない。
- `CHANGELOG.md` は変更せず、リリース時の集約へ申し送る。

## 6. 関連ドキュメント

- [[specdojo:exec-config-guide|exec設定ガイド]]: 自動選択時の再試行と設定の正本。
- [[prj-0001:pjr-bhmh-pinned-agent-rate-limit-policy|PJR-BHMH 指名 agent の利用枠制限方針]]: 指名時と自動選択時の動作を分けた経緯。
