---
specdojo:
  id: prj-0001:pjr-vqb5-agent-grade-comparison
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: note
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-08-29T13:44:25Z"
  due_on: "2026-09-30"
---

<!-- markdownlint-disable no-chinese-glyphs -->

# PJR-VQB5 grade 判定の agent 比較結果

## 1. メモ

同一の grade plan を6つの agent へ渡し、判定結果を比較した実測記録である。kata 285 件の定期評価にどの agent を使うかを判断するために行った。

### 1.1. 実行条件

| 項目           | 内容                                                       |
| -------------- | ---------------------------------------------------------- |
| 対象文書       | `dec-rulebook.md`（60 行）、`opr-batch-sample.md`（22 行） |
| plan           | 1文書単位・パス参照。9,165 文字と 9,865 文字               |
| 判定 viewpoint | 8 件（決定的観点は CLI が判定するため plan に含まれない）  |
| 実行日         | 2026-08-30                                                 |

`opr-batch-sample.md` は 483 行の `opr-rulebook.md` に対応する 22 行の sample であり、規範に対して完成例が大きく不足している。良い文書と問題のある文書を区別できるかを見る材料として選んだ。

### 1.2. 総合比較

`opr-batch-sample.md` に対する判定である。平均 level が低いほど厳格な評価を意味する。

| agent                    | 平均 level | finding | 出力形式       | 判定                   |
| ------------------------ | ---------- | ------- | -------------- | ---------------------- |
| `claude-expert-executor` | 1.88       | 19      | コードフェンス | 最も厳格かつ網羅的     |
| `codex-expert-executor`  | 2.38       | 7       | 素の JSON      | 網羅性と均衡が良い     |
| `codex-executor`         | 2.62       | 5       | 素の JSON      | 判定と根拠が不釣り合い |
| `gemma-expert-executor`  | 2.88       | 4       | コードフェンス | 弁別能力が最も高い     |
| `qwen-expert-executor`   | 3.25       | 5       | 前置きあり     | 甘めだが安定           |
| `claude-executor`        | 3.75       | 1       | コードフェンス | 検出できていない       |

### 1.3. 弁別能力

良い文書と問題のある文書をどれだけ区別できるかを示す。`dec-rulebook.md` と `opr-batch-sample.md` の平均 level の差である。

| agent                    | dec-rulebook | opr-batch-sample | 差       |
| ------------------------ | ------------ | ---------------- | -------- |
| `gemma-expert-executor`  | 4.00         | 2.88             | **1.12** |
| `claude-expert-executor` | 2.62         | 1.88             | 0.74     |
| `codex-expert-executor`  | 2.75         | 2.38             | 0.37     |
| `qwen-expert-executor`   | 3.62         | 3.25             | 0.37     |
| `codex-executor`         | 2.50         | 2.62             | -0.12    |
| `claude-executor`        | 3.50         | 3.75             | -0.25    |

`gemma` は差が最も大きいが、`dec-rulebook.md` を全観点 level 4 と判定しており、中程度の問題を見落とす。他の5 agent はいずれも `dec-rulebook.md` に問題を検出している。

`codex-executor` と `claude-executor` は差が負であり、問題のある文書ほど高い level を付けている。品質評価として成立していない。

### 1.4. proficiency による差

同一 provider で proficiency だけが異なる組み合わせを比較する。

| 組み合わせ                 | expert の平均 level | normal の平均 level | expert の finding | normal の finding |
| -------------------------- | ------------------- | ------------------- | ----------------- | ----------------- |
| claude（opr-batch-sample） | 1.88                | 3.75                | 19                | 1                 |
| codex（opr-batch-sample）  | 2.38                | 2.62                | 7                 | 5                 |

**proficiency の差は provider 間の差より大きい。** claude は expert と normal で平均 level が 1.87、finding が 18 件も違う。grade には expert が必要である。

`codex-executor` は `dec-rulebook.md` の3観点へ level 1 を付けながら finding は各1件であり、重い判定に対して根拠が薄い。

### 1.5. 全 agent が検出した不整合

`opr-batch-sample.md` の Frontmatter が `rulebook: specdojo:opd-rulebook`（運用方針）を指す一方、本文は `../rulebooks/opr-rulebook.md`（運用手順）を参照している。系統が食い違う実在の不整合であり、6 agent すべてが検出した。

明白な不整合は agent を問わず捉えられる。差が出るのは網羅性である。

### 1.6. 出力形式

| provider | 形式                                   |
| -------- | -------------------------------------- |
| codex    | 素の JSON。4回すべてで契約を守った     |
| claude   | コードフェンスで囲む                   |
| opencode | コードフェンス、または作業経過の前置き |

契約で「JSON だけを出力する」と指示しても、codex 以外は付加物を伴う。PJR-AKJ4 で実装した抽出処理により、いずれの形式でも受理できる。

出力形式の安定性は agent により異なる。qwen は同一の plan に対して、正常な JSON を返す場合と、閉じ括弧が過剰で構文として成立しない JSON を返す場合があった。後者は抽出処理でも救済できず、`grade apply` が拒否する。壊れた結果が記録されることは防げているが、評価そのものが失敗するため再実行が必要になる。

本記録の総合比較にある「甘めだが安定」という qwen の評価は判定内容についてのものであり、出力形式の安定性は別である。定期実行で用いる場合、失敗時の再試行を運用へ組み込む必要がある。codex は 4 回の実行すべてで素の JSON を返しており、この点では最も安定している。

### 1.12. 出力形式と判定能力は独立している

qwen の構文破損を受けて `muse-glimmer:30b-mlx` を検証した。同一の plan で `opr-batch-sample.md` を評価している。

| 項目         | muse       | codex-expert | gemma          | qwen   |
| ------------ | ---------- | ------------ | -------------- | ------ |
| 出力形式     | 素の JSON  | 素の JSON    | フェンス       | 前置き |
| 構文破損     | なし       | なし         | なし           | あり   |
| 平均 level   | 3.12       | 2.38         | 2.88           | 3.25   |
| finding 件数 | 7          | 7            | 4              | 5      |
| severity     | minor のみ | major 中心   | blocker を含む | 混在   |

muse はローカルモデルで唯一、前置きもコードフェンスもない素の JSON を返した。出力形式の安定性では最良である。

一方で判定は 8 観点中 7 つが level 3、finding 1 件という均一な結果となり、深刻度に応じた差が付かなかった。必須章の欠落という最も深刻な問題（codex は level 1、gemma は level 0）も level 3 の `minor` としている。`major` と `blocker` を一度も出していない。

出力形式の安定性と判定能力は独立した軸である。qwen は判定能力が高く出力形式が不安定、muse はその逆であった。grade の目的は品質のばらつきを検出することであるため、判定能力を優先する。

この独立性は、PJR-ANKR による executor と reporter の分離につながった。分離後は分析用と構造化用を別々に選べるため、出力形式の不安定さを理由に判定能力の高い agent を外す必要がなくなる。

### 1.14. 2段構成による評価の変化

PJR-ANKR で executor と reporter を分けた後、`qwen-expert-executor` を executor、`gemma-reporter` を reporter として `dec-rulebook.md` を評価した。

| 項目                | 1段構成         | 2段構成  |
| ------------------- | --------------- | -------- |
| executor の所要時間 | 18 分から 27 分 | 5 分     |
| 全体の所要時間      | 18 分から 27 分 | 6.5 分   |
| 構文破損            | 発生する        | 起きない |
| 忠実性の検証        | なし            | 通過     |

executor が JSON 構造を生成しなくなったため、所要時間が大きく短縮され構文破損も解消した。marker 形式での申告は軽量だが、指摘内容は従来と同等である。

この結果により、本記録の用途別推奨は見直しが必要である。qwen は出力形式の不安定さから補助的な位置づけとしていたが、2段構成では主力として使える。ローカルモデルのみで grade を回せるため、API コストなしで定期評価を運用できる。

### 1.15. rulebook 9 件による実測

executor とリファレンスの有無を変えて、同じ rulebook 9 件を評価した。対象は分量を分散させて選んでいる。各実験の前に対象文書を復元し、前回 finding の引き継ぎが混入しないようにした。

| 実験 | 構成                            | 完了  | ERROR       | pass | needs-work | score 平均 | score 最低 |
| ---- | ------------------------------- | ----- | ----------- | ---- | ---------- | ---------- | ---------- |
| A    | qwen → gemma、リファレンスなし  | 7 / 9 | 2 件（22%） | 3    | 4          | 89.4       | 71         |
| B    | gemma → gemma、リファレンスなし | 8 / 9 | 1 件（11%） | 3    | 5          | 91.0       | 80         |
| C    | gemma → gemma、リファレンスあり | 6 / 9 | 3 件（33%） | 3    | 3          | 83.2       | 66         |

### 1.16. executor を gemma へ変えた効果

実験 A と B の差は executor だけである。

| 指標         | A（qwen） | B（gemma） |
| ------------ | --------- | ---------- |
| ERROR 率     | 22%       | 11%        |
| major を含む | 4 件      | 5 件       |

失敗が半減し、検出も増えた。失敗の原因も異なる。qwen は 2.4 KB と 4.3 KB の文書で判定を出力しきれず、gemma は 22 KB の文書だけで失敗した。gemma の失敗は分量に起因するため、文書の分割（PJR-ZYFZ）が進めば解消しうる。

`ntp` は qwen が `pass` 98 としたのに対し、gemma は major 2 件を検出して `needs-work` 86 とした。弁別能力の差が現れている。

### 1.17. リファレンスの効果

実験 B と C の差はリファレンスの有無だけである。リファレンスは `prj-overview-rulebook.md` に固定した。

| 対象        | なし          | あり          | 差  |
| ----------- | ------------- | ------------- | --- |
| `ntp`       | needs-work 86 | needs-work 67 | -19 |
| `sf-index`  | needs-work 83 | needs-work 66 | -17 |
| `opd-index` | needs-work 91 | needs-work 79 | -12 |
| `mm`        | pass 96       | pass 91       | -5  |
| `gl`        | needs-work 94 | pass 96       | +2  |
| `ifx-index` | pass 100      | pass 100      | 0   |

比較できた 5 件のうち 4 件で score が下がり、閾値 70 を下回る文書が 2 件現れた。リファレンスなしでは最低が 80 であり、抽象的な rubric だけでは記載水準を判断できていなかったことになる。

`gl` だけは逆に緩和された。リファレンスと比較した結果、major としていた指摘が軽微と再評価されたと見られる。各実験で文書を復元しているため severity の維持が働かない条件であり、累積運用では生じない。

`ifx-index` は両方で score 100、finding 0 件だった。リファレンスがあっても問題を検出できない文書が存在する。二段階フィルタ（PJR-25F4）で高性能 agent が確認すべき対象にあたる。

### 1.18. 精度と安定性は逆方向に動く

リファレンスを付けると ERROR 率が 11% から 33% へ悪化した。失敗した文書は 2 KB、6.6 KB、22 KB であり、分量の小さいものも含む。リファレンス（12.5 KB）の読み込みが加わって executor の負荷が上がったためと考えられる。

| 構成             | 精度 | 安定性 |
| ---------------- | ---- | ------ |
| リファレンスなし | 低い | 高い   |
| リファレンスあり | 高い | 低い   |

どちらも単独では不十分である。運用では、リファレンスを全文でなく抜粋にする、分量の小さい文書にだけ付ける、失敗時に再試行するといった対処を検討する。

### 1.19. 分量と検出率の相関

実験 A では分量による差がはっきり出た。

| サイズ帯     | 結果                       |
| ------------ | -------------------------- |
| 1.9 - 2.5 KB | pass 3 件（score 87 - 98） |
| 3.8 - 6.6 KB | needs-work 3 件（87 - 95） |
| 22 KB        | needs-work（score 71）     |

薄い文書ほど `pass` になりやすい。内容が少ないため指摘も出にくいと考えられるが、薄いこと自体が問題として検出されていない可能性もある。実験 C では `ntp`（2.3 KB）が 67 まで下がっており、リファレンスがあれば薄い文書の問題も検出できることを示している。

### 1.13. Ollama の構造化出力

Ollama のネイティブ API（`/api/chat`）へ `format` として JSON Schema を渡すと、前置きのない純粋な JSON が返る。しかし opencode は `@ai-sdk/openai-compatible` を用いて OpenAI 互換の `/v1` へ接続しており、ネイティブ API の `format` を送る手段がない。

`/v1` の `response_format` は転送される。opencode.json のモデル単位 `options` へ `response_format` を設定して実行したところ、直接 `/v1` を呼んだ場合と同じ応答が得られた。PJR-G2F4 が懸念していた「options が転送されない可能性」は本環境では該当しない。

ただし効果は逆であった。`response_format: json_object` を指定すると応答の先頭に `json` という文字列が混入し、指定しない場合の素の JSON より汚れる。`json_schema` を指定した場合も別の文字列が混入した。Ollama の OpenAI 互換レイヤーがコードフェンスを生成しようとした残骸と見られる。構造化出力の指定は採用しない。

### 1.7. gemma の評価が変わった経緯

初回の比較では gemma を不採用と判断した。finding の `message` がすべて空で `grade apply` に拒否され、prompt を 46,673 文字から 7,271 文字へ縮小しても解消しなかったため、限界は言語化能力にあると結論づけた。

この結論は誤りだった。PJR-AKJ4 で plan へ最終応答契約を明示した後に再測定したところ、`message` が記述され apply も受理された。原因は能力ではなく plan の指示不足だった。唯一 `blocker` severity を出した agent でもある。

agent の評価は plan の指示品質に強く依存する。指示を改善せずに agent の能力を判断すると誤った結論に至る。

### 1.8. 指示の強化では出力形式を保証できない

gemma の agent 定義へ qwen と同等の契約優先の記述を追加し、同一 plan で再測定した。追加した記述は Markdown コードフェンスを加えないことを明示している。

結果は変わらなかった。gemma は agent 定義と plan の両方でコードフェンスを禁じられているにもかかわらず、コードフェンスで囲んだ応答を返し続けた。qwen では同じ記述の追加により JSON を出力するようになったのとは対照的である。

指示の遵守能力はモデルごとに異なり、指示を強化しても出力形式は保証できない。応答から JSON を抽出する処理を受け側に置く設計が妥当であることを裏づける。効果がないため、gemma の agent 定義は元の記述へ戻した。

### 1.9. 判定の再現性

同一 plan に対する gemma の判定を2回測定した。agent 定義の変更は出力形式に関するもので、判定基準には触れていない。

| 対象                  | 1回目の平均 level | 2回目の平均 level | 一致した判定 |
| --------------------- | ----------------- | ----------------- | ------------ |
| `dec-rulebook.md`     | 4.00              | 4.00              | 8 / 8        |
| `opr-batch-sample.md` | 2.88              | 2.88              | 8 / 8        |

16 判定すべてで level と finding 件数が完全に一致した。ローカルモデルは温度設定が低いか決定的であることが再現性に寄与していると考えられる。API 経由の agent で同様かは測定していない。

### 1.10. 複数 agent を重ねると精度が上がる

単独実行では agent ごとに網羅性が大きく異なるが、前回の指摘を引き継げば結果が変わる。最も甘い `claude-executor` へ `gemma-expert-executor` の finding 4 件を前回の指摘として渡し、`opr-batch-sample.md` を再評価した。level と score は渡していない。

| 指標         | claude-executor 単独 | 前回指摘つき | gemma-expert-executor 単独 |
| ------------ | -------------------- | ------------ | -------------------------- |
| 平均 level   | 3.75                 | 2.75         | 2.88                       |
| finding 件数 | 1                    | 5            | 4                          |

引き継いだ 4 件をいずれも未解消と正しく判定し、gemma 単独を上回った。さらに gemma が出していない指摘を 1 件追加している。再実行上限の判断基準が未定義であるという内容で、`claude-expert-executor` も単独で指摘していた問題である。前回指摘の確認に埋没せず、独立検出が機能した。

この性質により、単一の agent の網羅性が運用品質の上限を決めるわけではなくなる。安価な agent で繰り返しても、指摘が積み上がることで網羅性が向上する。引き継ぎの実装は PJR-X40M で完了している。

### 1.11. 複数 agent を組み合わせる運用

指摘が累積するため、性質の異なる agent を順に回す運用が成立する。

| 順序の例                             | 狙い                                                                       |
| ------------------------------------ | -------------------------------------------------------------------------- |
| qwen の後に gemma                    | ローカルで完結する。qwen は指摘が安定し、gemma は弁別と blocker 判定に強い |
| ローカルの後に codex                 | ローカルで積み上げた指摘を API 系が確認し、網羅性を補う                    |
| 定期は同一 agent、随時 claude-expert | 通常は安価に回し、重要な kata のみ精査する                                 |

qwen と gemma は指摘の重複が少ない。qwen は Frontmatter の矛盾とエスカレーション条件の曖昧さを、gemma は必須章の欠落を `blocker` として指摘しており、着目点が異なる。両者を重ねれば単独より広い範囲を覆える。

順序については、厳格な agent を先に置くと以降の実行でもその水準が保たれることを確認した。`codex-expert-executor` で評価した後に `gemma-expert-executor` で再評価したところ、major 8 件と verdict、score のいずれも変化しなかった。未解消の指摘は severity を維持する仕組み（PJR-Z8T1）が働くため、後続の agent が甘く判定しても水準が下がらない。

したがって1段目には厳格な agent を置くことが望ましい。`codex-expert-executor` は major を 8 件出しており、`qwen-expert-executor` の 5 件より厳格である。ただし解消されない指摘が世代を越えて蓄積し続ける可能性があり、その扱いは PJR-X40M の論点として残っている。

### 1.20. 定期実行で観測した事象（2026-09-10）

routine による無人実行（16:00 JST）で、3 段目の codex が忠実性検証に拒否された。1 件である。

```text
$analysis.documents[0]: missing agent viewpoint: vp-arc-conciseness
$analysis.documents[0]: missing agent viewpoint: vp-arc-single-responsibility
$analysis.documents[0]: missing agent viewpoint: vp-qe-verifiability
$analysis.documents[0]: missing agent viewpoint: vp-qe-omissions-consistency
$analysis.documents[0]: missing agent viewpoint: vp-qe-kata-conformance
$analysis.documents[0]: missing agent viewpoint: vp-ux-readability
$analysis.documents[0]: missing agent viewpoint: vp-ux-language-consistency
```

#### 1.20.1. 出力が思考の途中で打ち切られている

rate limit ではない。出力は生成されているが 11 行で終わっている。

| 文書                             | 出力行数 | 結果          |
| -------------------------------- | -------: | ------------- |
| `pjr-views-by-priority-template` |   **11** | failed        |
| `pjr-views-by-status-template`   |       44 | needs-work 86 |
| `pm-decision-log-template`       |       43 | needs-work 79 |

1 観点目から思考の断片が判定文へ混入している。

```text
[VIEWPOINT vp-arc-cross-document-consistency]
LEVEL: 2
生成処理、`pjr-rulebook`、`pjr-index-template` は `pjr-gant...` no. Need exact. Let's craft.
FINDING major line=1: ...
[END VIEWPOINT]
```

`no. Need exact. Let's craft.` が判定文へ入り、`FINDING` の内容が `...` のままである。末尾も
推敲の途中で終わる。

```text
Need no typo. Let's write. Ensure message single physical line.
Japanese natural. `pjr-viewsilho` etc.
Let's produce.
```

#### 1.20.2. 評価

忠実性検証は正しく働いた。このまま通せば、中身のない finding と 7 観点が欠けた grade が記録
されていた。破損データの混入を防げている。

この型の失敗は 3 段目で初めて観測した。1 段目の gemma では同じ実行で 5 件中 2 件が失敗しており、
発生率は 40% で前回と同じである。

| 段  | agent | 観測された失敗                       |
| --- | ----- | ------------------------------------ |
| 1   | gemma | severity の範囲逸脱、観点欠落（40%） |
| 3   | codex | 観点欠落（本件）                     |

ローカルモデル固有の問題ではなく、LLM 出力一般の揺れと捉えるべきである。

#### 1.20.3. 自動的に回復する

失敗した文書は `content_hash` が更新されないため、次回の `--changed-only` で再び選択される。
放置しても再試行される設計である。

ただし同じ文書で繰り返し失敗する場合は、その文書固有の要因（長さ、複雑さ）を疑う必要がある。
1 件では傾向を判断できないため、再発の有無を観測する。

#### 1.20.4. 判定の乖離が再現した

同じ実行で、gemma が 100 とした文書を codex が 86 と 79 に判定した。

| 文書                           | 1 段（gemma） | 2 段（gemma） | 3 段（codex） |
| ------------------------------ | ------------- | ------------- | ------------- |
| `pjr-views-by-status-template` | pass 100      | pass 100      | needs-work 86 |
| `pm-decision-log-template`     | pass 100      | pass 100      | needs-work 79 |

`br-rulebook`（98 → 79）でも観測しており、ローカルモデルが甘く判定する傾向が再現している。
3 段構成の意図どおり、codex が最終的な厳格さを担保している。

### 1.21. 所要時間の実測（2026-09-11）

cron 経由の無人実行（0 時 JST）で template 8 件を評価した。

| 項目         | 値                     |
| ------------ | ---------------------- |
| 開始         | `2026-09-10T15:07:47Z` |
| 終了         | `2026-09-10T17:42:02Z` |
| 経過         | **2 時間 34 分**       |
| 処理した文書 | 8 件                   |
| 実行した段   | 24 段のうち 20 段      |
| 1 段の平均   | 405 秒                 |

#### 1.21.1. ローカルモデルのほうが遅い

| 段  | agent |       平均 |
| --- | ----- | ---------: |
| 1   | gemma | **540 秒** |
| 2   | gemma | **522 秒** |
| 3   | codex | **306 秒** |

codex が約 1.7 倍速い。gemma は 1 段で 9 分前後かかる。

#### 1.21.2. 運用方針

速度と判定の甘さは、夜間の無人実行では問題にしない。gemma を使う目的は API コストの抑制で
あり、時間は制約にならない。3 段構成は維持する。

ただし 1 回あたりの件数には上限がある。cron の間隔は 8 時間である。

| 件数         | 所要見込み      |
| ------------ | --------------- |
| 8 件（実績） | 2 時間 34 分    |
| 10 件        | 約 3 時間 12 分 |

`limit: 10` は間隔内に収まるが余裕は小さい。`overlap: skip` により重複は防げるが、処理が
長引けば次回が飛ばされる。件数を増やす場合はこの制約を確認する。

#### 1.21.3. 判定の乖離は 3 回目

| 文書                           | gemma |  codex |
| ------------------------------ | ----: | -----: |
| `pm-plan-template`             |   100 | **73** |
| `pjr-views-by-status-template` |   100 |     86 |
| `br-rulebook`                  |    98 |     79 |

一貫してローカルモデルが甘い。1 段目と 2 段目の判定を単独では信頼できない。3 段目の codex が
最終的な厳格さを担保する構成が機能している。

#### 1.21.4. 1 段目の失敗率は改善した

今回は 8 件中 1 件（12.5%）で、前回の 40% から下がった。忠実性検証による拒否であり、2 段目で
回復している。

### 1.22. agy・ornith を加えた比較（2026-10-03）

oMLX の Ornith（`ornith-*`）を追加し、未評価だった agy（`agy-*`）と合わせて、同じ plan で5系統を比較した。各系統の expert executor と reporter を組にしている。

#### 1.22.1. 実行条件

| 項目     | 内容                                                                                                                        |
| -------- | --------------------------------------------------------------------------------------------------------------------------- |
| 対象文書 | `trc-requirements-to-tests-rulebook`、`imp-business-rulebook`、`stsd-mermaid-rulebook`（いずれも 6〜9 KB）                  |
| 参考     | codex の保存済み grade（v1 rubric）は 55、85、100 であり、良否の差がある文書を選んだ                                        |
| plan     | `grade plan` の出力から「前回の指摘」だけを空にした。前回の codex の finding を引き継がせず、独立した判定を比べるためである |
| 記録     | executor、reporter、`grade apply --dry-run` を本番と同じ順で実行した。reporter は検証に失敗した場合に1回だけ再実行した      |
| score    | grade-rubric-v2 の重みで、agent が判定する観点だけから算出した。決定的観点は全 agent で共通のため除いている                 |

#### 1.22.2. 結果

| 組み合わせ      | trc  | imp  | stsd | executor 平均 | reporter 平均 | 検証 |
| --------------- | ---- | ---- | ---- | ------------: | ------------: | ---- |
| agy → agy       | 92   | 95   | 95   |        101 秒 |         15 秒 | 3/3  |
| ornith → ornith | 98   | 失敗 | 100  |        445 秒 |         36 秒 | 2/3  |
| gemma → gemma   | 100  | 100  | 100  |        469 秒 |        151 秒 | 3/3  |
| qwen → qwen     | 93   | 92   | 97   |      1,150 秒 |        174 秒 | 3/3  |
| codex → codex   | 失敗 | 失敗 | 失敗 |             - |             - | 0/3  |

ornith の reporter 平均は成功した2件の値である。失敗した件は再実行を含めて 163 秒かかった。qwen の executor は 707〜1,952 秒と幅があり、中央値は 792 秒である。

#### 1.22.3. agent 別の所見

- agy は最も速く、major を出した唯一の agent である。codex が最も低く評価した trc を3件中で最も低く判定し、良否の順序が codex と一致した。reporter も3件とも1回で検証を通過した。
- ornith の reporter はローカルモデルで最速である（gemma の約4分の1）。executor は対象外の標準やスキーマまで読みに行き、tool call が 12〜26 回に及ぶ。
- ornith の imp は、thinking が本文に混入して出力の上限で途切れ、`[VIEWPOINT ...]` marker が1つもなかった。ornith-reporter は判定がないにもかかわらず全観点 level 4 の JSON を生成し、忠実性検証が拒否した。同じ状況で codex-reporter は生成できない旨のエラーを返している。根拠のない JSON を作る reporter は、検証がなければ誤った grade を記録しうる。
- gemma は3件とも 100、finding 0 件であり、良否を区別できていない。[[prj-0001:pjr-w5jt-grade-single-stage-nightly]] で gemma を門番から外した判断と一致する。
- qwen は minor だけを出し、良否の順序が codex と一致しない。最も遅い。
- codex は3件とも、sandbox の起動に失敗して判定前に終了した。比較データは得られていない（[[prj-0001:pjr-27z9-codex-bwrap-proc-mount]]）。

#### 1.22.4. 評価

今回の5系統では agy が grade に最も適している。ローカルモデルの3系統はいずれも判定が甘く、単独では門番にならない。文書3件・各1回の結果であり、傾向の把握にとどまる。agy の priority と proficiency の確定は [[prj-0001:pjr-me20-antigravity-codex-trial]] で行う。

ornith と qwen の executor が遅い要因として、thinking が各応答に入り tool call の回数分だけ積み上がることが考えられる。thinking を切った場合の所要時間と判定の質は未測定である。

### 1.23. ornith の executor の改善（2026-10-04）

「agy・ornith を加えた比較（2026-10-03）」の ornith を対象に、thinking、パラメータ、prompt、plan を変えて同じ3文書を評価した。⑤以降は reporter を通さず、executor の marker から GradeSubmission を機械的に生成して検証した（[[prj-0001:pjr-e9h3-grade-deterministic-reporter]] の再現）。

#### 1.23.1. 条件と結果

| 条件                                                                                                   | 検証通過 | executor 平均 | 主な失敗                                               |
| ------------------------------------------------------------------------------------------------------ | -------: | ------------: | ------------------------------------------------------ |
| ① thinking ON                                                                                          |      2/3 |        445 秒 | thinking が本文へ混入し出力上限で途切れた              |
| ② thinking OFF                                                                                         |      2/3 |         70 秒 | reporter の書き写し誤り                                |
| ③ ②＋AGENTS.md の Language 改訂＋`min_p` 0.05                                                          |      2/3 |         55 秒 | `[END VIEWPOINT]` を書かない                           |
| ④ ③＋executor の temperature 0.3・top_p 0.8＋形式規則＋字体の置換例                                    |      2/6 |         49 秒 | marker の太字囲み、文中の `FINDING`、書き写し誤り      |
| ⑤ ④の形式規則を改訂、reporter を機械変換に置換                                                         |      4/6 |         65 秒 | `[END VIEWPOINT]` 欠落、level 3 で `FINDING` なし      |
| ⑥ ⑤＋判定例を agent に提示＋本文を plan に埋め込み                                                     |      5/6 |         62 秒 | 英語の分析だけを出力し marker がない                   |
| ⑦ ⑥＋「最初の行から marker で始める」規則                                                              |      3/6 |         50 秒 | 英語の分析だけを出力（2件）、level 3 で `FINDING` なし |
| ⑧ ⑥の構成で thinking ON（budget 2048）、サンプリングはサーバー既定（0.6 / 0.95）、`limit.output` 16384 |      3/6 |        181 秒 | level 3 で `FINDING` なし（2件）、観点の欠落           |

①〜③は各文書1回、④〜⑧は各文書2回の実行である。⑦の規則は守られず（6回中5回が英語の前置きで始まった）、通過率も下がったため、規則を外して⑥の構成へ戻した。⑥と⑦は1つの規則以外は同じ条件であり、合わせると 8/12 である。1条件あたり6回では、⑥の 5/6 と⑦の 3/6 の差を偶然と区別できない。

⑧は、⑥⑦で最も多かった「英語の分析だけを出力して marker がない」失敗が thinking で解消するかを見るために行った。その失敗は出なかったが、通過率は 3/6 にとどまり、executor は約3倍遅くなった。埋め込みにもかかわらずファイルを読みに行き（tool call 2〜5 回）、major を1件も出さず、中国語の字体は6回中4回に現れた。thinking ON は改善にならないため、⑥の構成（thinking OFF）へ戻した。

#### 1.23.2. 施策ごとの効果

- thinking OFF は executor を約6倍速くし、対象外のファイルを読みに行く動きを止めた。一方で形式の崩れが増えた。
- 崩れ方を具体的に禁じた規則は、禁じた崩れ方（太字囲み、文中の `FINDING`）だけを消した。別の崩れ方が残る。
- 本文の埋め込み（⑥）で tool call が 0〜1 回になり、2回実行した score の差が 1〜3 点に縮まった。[[prj-0001:pjr-26k4-grade-plan-embed-documents]] で起票した。
- 判定例の提示（⑥）で指摘が増え、trc にも major を出した。ただし codex が最も低く評価した trc（55）を imp より高く評価しており、良否の弁別は不十分である。
- 中国語の字体（为・时・问题・这个 など）は、AGENTS.md の指示、置換例、`min_p`、低い temperature のいずれでも消えなかった。4bit 量子化の影響を疑っているが未検証である。

#### 1.23.3. 評価

ornith の executor は1回1分前後と最速だが、厳密な行形式を安定して守れず、判定も codex より甘い。reporter を機械変換に置き換え（[[prj-0001:pjr-e9h3-grade-deterministic-reporter]]）、本文を埋め込み、失敗時に executor を再実行する構成なら、高速な一次評価には使える。門番（最終判定）には使わない。 thinking を ON に戻しても改善しない（⑧）。

### 1.24. qwen と gemma の推奨サンプリング（2026-10-04）

[[prj-0001:pjr-4rr8-ollama-sampling-recommended-params]] で、qwen と gemma の expert executor を公式推奨のサンプリング（qwen: temperature 0.6 / top_p 0.95 / repeat_penalty 1.0、gemma: temperature 1.0 / top_p 0.95 / top_k 64）にした派生モデルで試した。plan は「ornith の executor の改善（2026-10-04）」と同じ本文埋め込みの plan とし、GradeSubmission は marker から機械的に生成した。見込みを先に確かめるため、推奨値で各文書1回だけ実行した。

| agent                | trc                          | imp              | stsd                       | executor 平均 | 検証通過 |
| -------------------- | ---------------------------- | ---------------- | -------------------------- | ------------: | -------: |
| qwen（推奨値）       | 失敗（END VIEWPOINT の欠落） | 96（minor 2）    | 失敗（marker なし）        |      1,099 秒 |      1/3 |
| qwen（現行値、参考） | 88（minor 10）               | -                | -                          |      1,151 秒 |      1/1 |
| gemma（推奨値）      | 100（finding 0）             | 100（finding 0） | 失敗（VIEWPOINT の入れ子） |        495 秒 |      2/3 |

qwen は推奨値でも速くならず（同じ trc で 1,362 秒と 1,151 秒）、marker の形式が崩れた。gemma は推奨値でも良否を区別できず、形式も崩れた。温度を上げると形式が崩れやすいという懸念どおりで、grade の用途には現行の低い温度が合う。改善の兆しがないため、現行値との本格的な比較は行わずに打ち切り、現行値を維持した。

### 1.25. gemma4 26B（MoE）（2026-10-04）

[[prj-0001:pjr-wjpx-gemma4-26b-moe-evaluation]] で、gemma4 26B-A4B（全 25.2B・動作 3.8B）の expert executor を、「ornith の executor の改善（2026-10-04）」と同じ本文埋め込みの plan で計測した。GradeSubmission は marker から機械的に生成した。

| 条件                                                        | 検証通過 | executor 平均 | 判定                          | 中国語の字体 |
| ----------------------------------------------------------- | -------: | ------------: | ----------------------------- | -----------: |
| gemma4 26B（64K）、3文書×2回                                |      4/6 |        146 秒 | 通過分はすべて 100、finding 0 |          0/6 |
| gemma4 31B（64K）、3文書×1回                                |      3/3 |        474 秒 | すべて 100、finding 0         |          0/3 |
| gemma4 26B、参考資料付き（64K）、3文書×1回                  |      1/3 |        188 秒 | trc 98（minor 4）             |          0/3 |
| gemma4 26B、参考資料付き（128K）、3文書×1回                 |      1/3 |        173 秒 | stsd 100                      |          0/3 |
| gemma4 26B、判定の規則・例・問題を先に挙げる手順、3文書×2回 |      5/6 |        132 秒 | 通過分はすべて 100、finding 0 |          0/6 |

26B は 31B の約3倍速く、すべての実行で中国語の字体が混ざらなかった（Ornith は同じ条件で 12 回中 7 回）。判定は 31B と同じく良否を区別できず、参考資料・128K・判定の規則と例のいずれでも厳しくならなかった。規則と例を加えた版は、本文の良い点だけを根拠に挙げて level 4 を付けており、問題を探す振る舞いが出なかった。Ornith で判定例が効いたのと対照的で、判定の甘さはモデルの性質と考えられる。

参考資料を付けると入力が長くなり、marker の形式の崩れが増えた（4/6 → 2/6）。plan は約2万トークンで 64K に収まっており、128K にしても精度・時間・メモリに差はなかった。

26B は grade の判定には使わず、判定を伴わない reporter の文章要約（[[prj-0001:pjr-gbev-exec-reporter-machine-facts]] で reporter の役割を要約だけに絞った）に使う。

### 1.26. ornith の英語での判定（2026-10-04）

ornith-expert-executor（⑥の構成）に、grade の根拠と finding を英語で書かせて計測した。plan と方法は「ornith の executor の改善（2026-10-04）」と同じ（本文埋め込み、3文書×2回、機械変換）。

| 条件                                           | 検証通過 | score   | major が出た回 | 中国語の字体 | 平均時間 |
| ---------------------------------------------- | -------: | ------- | -------------: | -----------: | -------: |
| 日本語（⑥⑦）                                   |     8/12 | 86〜100 |           一部 |    12 回中 7 |    56 秒 |
| 英語（AGENTS.md の日本語の指示と矛盾したまま） |      3/6 | 78〜90  |            4/6 |          0/6 |    86 秒 |
| 英語（AGENTS.md に出力言語の例外を加えた後）   |      5/6 | 80〜92  |            3/6 |          0/6 |    55 秒 |

英語で書かせると、日本語のときより判定が一貫して厳しくなり（満点が出ない）、中国語の字体が混ざらなかった。`.opencode/AGENTS.md` の「必ず自然な日本語で回答する」が agent の英語の指示と矛盾していた間は、半数の回が日本語に戻り、その日本語も崩れた（「指引」「マトクス」、韓国語の「는지」）。AGENTS.md に「agent の定義が出力の言語を指定している場合はそれに従う」と加えると、6回中5回が英語で書かれた。

例外を加える前の失敗のうち2件は「major の finding があるのに level 3」で、severity の上限まで level を下げる補正をかけると検証を通った（3/6 → 5/6）。

ornith-expert-executor を英語で出力する版に置き換えた（コミット 4f658a754）。判定の精度は codex に届かないため、用途は速い一次評価とする。日本語の記録へ翻訳する設計は [[prj-0001:pjr-27y0-grade-english-canonical-translation]] で扱う。

### 1.27. 英語正本と日本語表示の pipeline 化（2026-10-06）

[[prj-0001:pjr-27y0-grade-english-canonical-translation]] で、1.26 の英語判定を定期 pipeline へ組み込んだ。一次評価のモデル比較値は 1.26 の 3 文書×2回（補正後の検証通過 5/6）を引き続き基準とし、今回の実装確認では同じ処理順を pipeline fixture で再現した。

| 段階       | 正本・表示の扱い                                                           |
| ---------- | -------------------------------------------------------------------------- |
| 判定       | executor の英語 `message` を正本として保存し、前回指摘の一致にも使う       |
| level 補正 | severity 上限を超えた level だけを下方向へ補正し、補正前後を結果へ記録する |
| 翻訳       | `gemma26-reporter` が英語文だけの配列を日本語化し、`message_ja` へ保存する |
| 検証       | 件数、各訳文の仮名、原文と訳文のインラインコードの完全一致を検証する       |
| 失敗時     | 不合格項目だけを単件で1回再翻訳し、再び不合格なら英語正本を表示にも使う    |

unit test では、英語 finding の正本維持と severity 引き継ぎ、日本語 finding を翻訳入力へ含めないこと、翻訳の件数不一致、仮名の欠落、インラインコードの欠落・追加を検出して英語へフォールバックすること、level の下方向補正を確認した。pipeline fixture では、判定の機械変換と正本保存が完了した後にだけ `gemma26-reporter` と表示更新を起動する順序に加え、不合格項目だけを単件で1回再翻訳することを確認した。翻訳は表示専用であり、1.26 の viewpoint、level、severity、line、score、verdict を変更しない。

### 1.28. oMLX の Qwen3.6 35B-A3B（2026-10-06〜07）

[[prj-0001:pjr-zsjq-qwen36-grade-evaluation]] で、oMLX に導入した Qwen3.6 35B-A3B（4bit）を、「ornith の英語での判定（2026-10-04）」と同じ plan と方法（本文埋め込み、3文書×2回、機械変換）で計測した。agent は `qwen36-expert-executor`（`ornith-expert-executor` と同じ規則・判定例・英語出力の指示）とした。

| 条件                                                                            | 機械変換の通過 | 判定                                        | 英語での出力                               |  平均時間 |
| ------------------------------------------------------------------------------- | -------------: | ------------------------------------------- | ------------------------------------------ | --------: |
| thinking ON（Qwen の推奨値: temperature 0.6、top_p 0.95）                       |            5/6 | 甘い。6回中4回が全観点 level 4（finding 0） | 守られた                                   |    172 秒 |
| thinking OFF（Qwen の推奨値: temperature 0.7、top_p 0.8、presence_penalty 1.5） |            2/6 | 厳しい（level 3 が中心）                    | 崩れた（1回は finding 46件中24件が日本語） | 約 130 秒 |
| thinking OFF（Ornith と同じ値: temperature 0.3、top_p 0.8、presence_penalty 0） |            2/3 | Ornith に近い（major あり）                 | ほぼ守られた（日本語は1件）                |    107 秒 |

- thinking ON は書式を守るが判定が甘い。サンプリングで変わる性質ではないと判断した。
- thinking OFF で presence_penalty 1.5 にすると、`- FINDING` の箇条書き化、`line=57-64` のような範囲指定、日本語への切り替わりが出た。同じ印を23観点ぶん繰り返す grade の出力と相性が悪い。presence_penalty 0 にすると、英語での出力と書式がほぼ守られた。
- oMLX の prefill のメモリの保護（memory guard）に、計測の途中で何度も拒否された。拒否時の見積もりは「現在 19.5〜20.5 GB ＋ KV+SDPA 27〜32 GB」で、上限（dynamic ceiling）は 41.8〜44.7 GB の間で変動した。oMLX を再起動しても、数回で再び拒否された。Ornith の計測では起きていない。Qwen3.6 の出力の上限（32768）が Ornith（8192）より大きいことが関係している可能性があるが、確かめていない。Ornith と同じ値の条件は、このため3回で打ち切った。
- 同じ plan での finding の内容を、trc-requirements-to-tests と imp-business で比べた（Qwen3.6 は Ornith と同じ値の条件）。

| agent          | trc の finding | imp の finding   | 内容                                                                                                                                                                                |
| -------------- | -------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| agy            | 2（major 1）   | 2                | 具体的な欠陥を当てた。imp の「表の途中の空行で表が崩れる」は本文で確認した実在の欠陥                                                                                                |
| Ornith（英語） | 9〜11          | 9〜12（major 1） | 一般的な改善提案が多い。Frontmatter の推奨表の `type: project`（成果物の値）を rulebook 自身の `type: rulebook` と取り違え、両文書で矛盾として指摘した（imp では major）            |
| Qwen3.6        | 17（major 2）  | 7                | 一般的な改善提案が多い。trc の「`一部充足` の判定基準がない」は妥当。imp の2件は「対象外なので finding は不要」と自ら書いた文を minor の finding にしており、指摘として成り立たない |

trc の本文にも表の途中の空行があるが、どの agent も指摘しなかった。Ornith と Qwen3.6 の finding の精度は同程度で、どちらも agy に大きく劣る。

結論として、Qwen3.6 は grade の判定に使わない。Ornith より遅く（約2倍）、精度は同程度で、oMLX のメモリの保護にも拒否されやすい。`qwen36-expert-executor` は名簿で `disabled: true` にし、agent の定義は再現用に残した。計測の記録は `logs/agent-compare-20261003/`（git 管理外）の `runs-qwen36*` にある。

### 1.29. ornith-expert-executor の無効化（2026-10-07）

「oMLX の Qwen3.6 35B-A3B（2026-10-06〜07）」の finding の比較で、Ornith（英語）は実在の欠陥を当てず、一般的な改善提案が多く、Frontmatter の推奨表の `type: project` を rulebook 自身の type と取り違える誤指摘を2文書で繰り返した。score もほぼ 80〜92 に収まり、文書の良し悪しを区別できていない。「ornith の英語での判定（2026-10-04）」で決めた「速い一次評価」の用途も、問題のある文書を拾えなければ選別に使えない。

利用者の判断で、`ornith-expert-executor` を名簿で `disabled: true` にし、grade には使わないことにした。比較は2文書に限られるため、傾向としての判断である。`ornith-executor` と `ornith-reporter` は grade で評価していないため対象外とした。定期の grade は agy が判定している。

## 2. 背景・文脈

kata 285 件を定期評価するにあたり、ローカルモデルで運用できれば API コストなしで全件を回せる。その可否と、どの agent をどの用途に使うかを判断するために比較した。

## 3. フォローアップ

用途別の推奨は次のとおりである。

| 用途                | 推奨 agent                                        | 理由                                                                    |
| ------------------- | ------------------------------------------------- | ----------------------------------------------------------------------- |
| 全 285 件の定期評価 | `codex-expert-executor`                           | 網羅性・弁別・整合性の均衡が良い                                        |
| 重要な kata の精査  | `claude-expert-executor`                          | 最も厳格で網羅的                                                        |
| ローカル無償運用    | `gemma-expert-executor` と `gemma-reporter` の2段 | rulebook 9 件の実測で ERROR 率が qwen の 22% に対し 11%。検出数も上回る |
| 補助的な二次評価    | `qwen-expert-executor`                            | 甘いが安定している                                                      |
| 不採用              | `claude-executor`、`codex-executor`               | 判定と根拠が釣り合わない                                                |

- `graded_by` が agent の自己申告のため値が安定しない。agent 別の傾向分析の前提となるため PJR-6XNJ で扱う。
- 合格閾値 70 の妥当性は未確定である。agent により平均 level が 1.88 から 3.75 まで分かれるため、閾値を agent 別に変える必要があるかを全件評価の分布を見て判断する。
- API 経由の agent における判定の再現性は測定していない。サンプリングにより判定が揺れる場合、同じ文書を再評価するたびにスコアが変動する。運用上の影響を見極める必要がある。
- 複数 agent を重ねる場合の順序による効果の差は測定していない。厳格な agent を先に置くか後に置くかで結果が変わるかを確認する余地がある。
- リファレンスを用いると精度は上がるが ERROR 率が 11% から 33% へ悪化する。全文ではなく抜粋を渡す、分量の小さい文書にだけ付ける、失敗時に再試行するなどの緩和策を検討する。
- 分量の大きい文書は失敗しやすい。22 KB の `opr-rulebook` は3実験すべてで失敗している。文書の分割（PJR-ZYFZ）が進めば解消しうる。

## 4. 関連ドキュメント

- [[prj-0001:pjr-49d2-quality-assessment]]: grade の設計と実装。本比較はその agent 選定にあたる。
- [[prj-0001:pjr-4tz7-grade-per-document]]: 1文書単位の評価と plan 保存。本比較で用いた plan 方式。
- [[prj-0001:pjr-akj4-agent-json-response]]: 最終応答契約と JSON 抽出。gemma の評価が変わった要因。
- [[prj-0001:pjr-6xnj-grade-graded-by]]: `graded_by` の不安定さ。
- [[prj-0001:pjr-zyfz-single-responsibility-viewpoint]]: 判定に用いた文書責務の単一性の観点。
