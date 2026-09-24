---
specdojo:
  id: prj-0001:pjr-f4c9-npm-staged-publishing
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: question
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-09-23T12:18:08Z"
  due_on: "2026-10-24"
---

# PJR-F4C9 npm の公開を staged publishing へ戻すかを決める

## 1. 確認事項

0.2.0 の公開時に trusted publisher の Allowed actions で直接 publish を許可したが、npm は stage-only を推奨している。staged publishing では CI が npm stage publish で保留状態に登録し、maintainer が 2FA 付きで承認して初めて公開される。agent が src を書く本プロジェクトでは公開直前の確認段が有効に働く可能性がある一方、リリースごとに承認操作が増える。次のリリース前に判断する。

## 2. 背景

0.2.0 の公開（[[prj-0001:pjr-7vkr-npm-release]]）で GitHub Actions からの publish が `403 OIDC permission denied` で失敗した。npm の trusted publisher 設定に `Allowed actions` があり、次のように記されていた。

```text
npm stage publish is always allowed.
Choose whether this trusted publisher can also publish directly.

Not recommended. For stronger security, leave this unchecked to require staged publishing for new versions.
```

直接 publish を許可（チェックを入れる）したことで公開が通った。既定は stage-only であり、npm は明示的にそちらを推奨している。

### 2.1. staged publishing の仕組み

CI が `npm stage publish` でパッケージをレジストリへ登録するが、public access できない保留状態に置かれる。maintainer が npmjs.com または CLI から 2FA 付きで承認して初めて公開される。`npm stage publish` 自体は 2FA を要求しないため、CI の自動実行と公開判断の人手を両立できる。

要件は npm CLI 11.15.0 以上、Node 22.14.0 以上である。現行 workflow は Node 24 を使うため Node 側は満たす。npm CLI は同梱版に依存するため、採用する場合は明示的な更新が要る。

### 2.2. 本プロジェクト固有の事情

agent が `src/` を編集し、その成果が develop → main → publish と流れる。人の関与は Pull Request の merge と `npm version` の実行である。

現在も次のゲートが存在する。

| ゲート       | 内容                                                                             |
| ------------ | -------------------------------------------------------------------------------- |
| Pull Request | develop から main への昇格は PR 経由。`protect-main` hook が直接 push を禁止する |
| version bump | 人が `npm version` を実行しない限り workflow は skip する                        |
| 保護設定     | agent は `.github/workflows/` と `package.json` を変更できない                   |

「agent が勝手に公開する」経路は無い。残るのは「agent が書いた `src/` の内容を人が精査せずに merge し、そのまま公開される」経路である。staged publishing はこの経路に対する最後の確認段として働く。

## 3. 回答候補

| 候補 | 内容                                                                   | 利点                                            | 懸念                                                             |
| ---- | ---------------------------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------- |
| A    | 現状維持（直接 publish を許可）                                        | リリースが完全に自動化される。承認操作が不要    | npm の推奨から外れる。公開直前の確認段が無い                     |
| B    | stage-only へ戻し、workflow を `npm stage publish` へ変更する          | 公開前に tarball を確認できる。npm の推奨に沿う | リリースごとに承認操作が増える。npm CLI 11.15.0 以上の保証が要る |
| C    | 当面 A を維持し、リリース頻度が上がるか他者が関わる時点で B へ移行する | 現在の単独運用では手数を増やさない              | 移行の契機を決めておかないと放置される                           |

## 4. 回答・結論

-

## 5. 承認

| 項目     | 内容   |
| -------- | ------ |
| 回答者   | _TODO_ |
| 回答日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は既定で `commit`（`register close` により `decided` へ遷移）を用いる。
- 回答が不可逆・高リスク・framework schema 破壊的変更を伴う場合は `PR` 方式で承認し、証跡に PR URL と merge SHA を記載する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-7vkr-npm-release]]
- [[prj-0001:pjr-wjzd-publish-docs-lint]]
- `.github/workflows/publish-specdojo.yml`
- <https://docs.npmjs.com/staged-publishing/>
- <https://docs.npmjs.com/trusted-publishers/>
