# シン・til.ojisa.io

|          | 本番環境                    | 開発環境                              |
| -------- | --------------------------- | ------------------------------------- |
| TIL      | https://til.ojisan.io       | https://dev.til.ojisan.io             |
| 管理画面 | https://admin.til.ojisan.io | https://{id}.til-ojisan-io.pages.dev/ |

※ 開発環境の管理画面をみたい場合は [cloudflare pages](https://dash.cloudflare.com/) からアクセスする

## 構成

### Repository

モノレポ構成

| パッケージ名 | 説明                                                                   |
| ------------ | ---------------------------------------------------------------------- |
| admin        | til を入稿するサービス                                                 |
| api          | til の CRUD を担う API                                                 |
| endpoint     | admin-api-media 間でエンドポイントを共有するのでその定義だけ切り出した |
| media        | til を静的に吐き出すサービス。ユーザーにとってはこれが実体。           |

### Infra

- admin: cloudflare pages
- api: cloud functions
- media: firebase hosting

## Build & deploy

CI は GitHub, CD は admin は fullmanaged で実行、それ以外は GitHub からのデプロイ.

### Admin

build

```sh
# dev
BUILD_ENV=development yarn run admin build

# prd
BUILD_ENV=production yarn run admin build
```

#### env

入稿者を Firebase Auth で Admin からしかできないようにしている。

- admin_user_id
  - plese check your firebase auth users, if you forget

```sh
# check current env
npx firebase use

# set env
npx firebase functions:config:set admin.user_id="HOGEHOGE"

# get env
npx firebase functions:config:get
```

### Media

build

```sh
# dev
BUILD_ENV=development yarn run media build

# prd
BUILD_ENV=production yarn run media build
```
