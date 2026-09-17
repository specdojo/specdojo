---
specdojo:
  id: specdojo:cstd-rulebook
  type: rulebook
  status: deprecated
  recipe: not-needed
  sample: specdojo:cstd-sample
  template: not-needed
  grade:
    rubric: grade-rubric-v1
    target: kata
    verdict: needs-work
    score: 93
    graded_at: "2026-09-17T10:18:31.839Z"
    graded_by: codex-expert-executor
    content_hash: 198058afcfb0299bc4cf21ea4afa95bd0071476ab88f73277edc0cef4cff7e33
    categories:
      consistency: { score: 63 }
      usability: { score: 100 }
      architecture: { score: 100 }
      quality: { score: 100 }
    viewpoints:
      vp-arc-cross-document-consistency: { level: 2, score: 50 }
      vp-arc-conciseness: { level: 4, score: 100 }
      vp-arc-single-responsibility: { level: 4, score: 100 }
      vp-qe-verifiability: { level: 4, score: 100 }
      vp-qe-omissions-consistency: { level: 3, score: 75 }
      vp-qe-kata-conformance: { level: 4, score: 100 }
      vp-ux-readability: { level: 4, score: 100 }
      vp-ux-language-consistency: { level: 4, score: 100 }
      vp-arc-document-structure: { level: 4, score: 100 }
    findings: { blocker: 0, major: 1, minor: 1, note: 0 }
---

# 概念状態遷移図（CSTD）ドキュメント作成ルール（非推奨）

Deprecated Conceptual State Transition Diagram Rulebook

この rulebook は非推奨です。状態一覧と状態遷移図を別文書で管理すると内容が重複するため、後継の [[specdojo:stsd-rulebook|ステータス定義（STSD）作成ルール]] へ統合しました。

## 1. 移行方針

<!-- specdojo:finding id=F001 severity=major rule=vp-arc-cross-document-consistency line=9 新規 CSTD を禁止して STSD へ統合する方針に反し、`templates/generated/dct-data-model-conceptual-template.md` は `cstd-_TERM_` を現行成果物として掲載し、`dct-data-model-dictionary-template.md` も STSD を状態一覧だけの成果物として掲載しているため、削除済み生成元に対応する旧生成ページを除去または再生成して成果物カタログの指示を統一する必要がある。 -->
<!-- specdojo:finding id=F002 severity=minor rule=vp-qe-omissions-consistency line=10 既存 CSTD から内容を移すことだけが規定され、移行後の旧ファイルを削除するのか、履歴保管するのか、非推奨の誘導文として残すのかが未定義なため、各扱いの選択条件と完了状態を明記する必要がある。 -->
- 新しい `cstd-<term>` は作成せず、`stsd-<term>` に状態一覧、状態遷移図、遷移の説明を記載します。
- 既存 CSTD の状態、イベント、条件は、同じ対象の STSD の「状態遷移図」と「遷移の説明」へ移します。
- CDFD などの参照元は CSTD 参照を削除し、統合先の STSD だけを参照します。
