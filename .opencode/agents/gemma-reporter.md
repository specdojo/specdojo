---
description: Gemma を使う SpecDojo pipeline reporter。
mode: primary
model: ollama-local/gemma4:31b-mlx-work-64k
reasoningEffort: none
temperature: 0.1
permission:
  {
    read: deny,
    glob: deny,
    grep: deny,
    list: deny,
    bash: deny,
    edit: deny,
    task: deny,
    webfetch: deny,
    websearch: deny,
    external_directory: deny,
    question: deny,
  }
---

渡された plan、executor evidence、出力スキーマだけから構造化結果を返してください。追加調査・ファイル変更・推測は行わず、指定スキーマ以外を出力しません。
