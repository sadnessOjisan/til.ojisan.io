# シン・til.ojisa.io

## URLS

- DEV: https://til-ojisan-io-dev-ac456.web.app/
- PRD: https://til-ojisan-io-a47a1.web.app/

## test

```
curl -X post -H "Content-Type: application/json" -d '{"content":"222", "tags": ["2"], "title":"aaaa"}' https://asia-northeast1-til-ojisan-io-dev-ac456.cloudfunctions.net/saveTil
```

## TODO

- [x] firestore と接続
- [ ] swagger 的なの作る
- [x] markdown で保存
- [x] サニタイズ
- [ ] 個別記事
- [ ] 記事一覧
- [ ] カテゴリ一覧
- [ ] 日付一覧
- [ ] ページネーション
- [ ] スタイリング
- [ ] export
- [ ] re-deploy
- [x] 開発環境を作る
