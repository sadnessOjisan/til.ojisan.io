# シン・til.ojisa.io

## URLS

- DEV: https://til-ojisan-io-dev-ac456.web.app/
- PRD: https://til-ojisan-io-a47a1.web.app/

## notes

- admin repository
  - https://github.com/sadnessOjisan/til.ojisan.io-admin

## deploy

```sh
BUILD_ENV=development yarn run admin build

BUILD_ENV=production yarn run admin build
```

## dev

```sh
yarn workspace media install

yarn workspace media run dev
```

## env

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

## TODO

- [x] firestore と接続
- [ ] swagger 的なの作る
- [x] markdown で保存
- [x] サニタイズ
- [x] 個別記事
- [x] 記事一覧
- [ ] カテゴリ一覧
- [ ] 日付一覧
- [ ] ページネーション
- [ ] スタイリング
- [ ] export
- [ ] re-deploy
- [x] 開発環境を作る
