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
