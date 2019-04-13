# Knowledge

## 目次

- [CentOS7への各種ソフトウェア(最新バージョン)の導入方法](#CentOS7への各種ソフトウェア(最新バージョン)の導入方法)
	- [Node.js](#Node.js)
		- [手順](#手順)
	- [MongoDB](#MongoDB)
		- [手順](#手順)
- [エラーの対処法](#エラーの対処法)
	- [npmでモジュールをインストールする際エラーメッセージが出る](#npmでモジュールをインストールする際エラーメッセージが出る)
	- [MongoDBが起動しない](#MongoDBが起動しない)
	- [Express入門においてdotinstallの方法で実施するとエラーが発生する](#Express入門においてdotinstallの方法で実施するとエラーが発生する)
		- [&#35;20&nbsp;CSRF対策を施そう](#&#35;20&nbsp;CSRF対策を施そう)

---

## CentOS7への各種ソフトウェア(最新バージョン)の導入方法

### Node.js

以下のサイトを参考に、現在の安定バージョンである「10.15.3」をインストールする。

参考URL：CentOS 7 Node.js のインストール手順 (yum を利用) - Qiita  
https://qiita.com/daskepon/items/16a77868d38f8e585840

#### 手順

1. yumに対してNode.jsが配布されているリポジトリを追加
    ```
	# 参考ページでは当時の安定バージョン「8.x」系を使用していたため、
	#     https://rpm.nodesource.com/setup_8.x
	# となっていたが、今回は「10.x」系を使用するため、
	#     https://rpm.nodesource.com/setup_10.x
	# とする
	$ curl -sL https://rpm.nodesource.com/setup_10.x | sudo bash -
	```

2. インストール
	```
	$ sudo yum install nodejs
	```

3. バージョン確認
	```
	$ node -v
	```

---

### MongoDB

以下のサイトを参考に、現在の安定バージョンである「4.0.3」をインストールする。

参考URL：Install MongoDB Community Edition on Red Hat Enterprise or CentOS Linux — MongoDB Manual  
https://docs.mongodb.com/manual/tutorial/install-mongodb-on-red-hat/

#### 手順

1. yumに対してMongoDBが配布されているリポジトリの情報を追加する  
`/etc/yum.repos.d/mongodb-org-4.0.repo`というファイルを作成し(root権限のファイル)、リポジトリ情報を書き込む

	sudoで管理者権限でviエディタを開く
    ```
	$ sudo vi /etc/yum.repos.d/mongodb-org-4.0.repo
	```

	リポジトリ情報（`i`キーで挿入モードにし入力。入力完了後、`ESC`キーでコマンドモードにし`:wq`で書き込み終了する）
    ```
	[mongodb-org-4.0]
	name=MongoDB Repository
	baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/4.0/x86_64/
	gpgcheck=1
	enabled=1
	gpgkey=https://www.mongodb.org/static/pgp/server-4.0.asc
	```

2. インストール
	```
	$ sudo yum install mongodb-org
	```

3. バージョン確認
	```
	$ mongodb --version
	```

---

## エラーの対処法

### npmでモジュールをインストールする際エラーメッセージが出る

npmでは`package.json`というファイルを用いて、リポジトリ全体の外部モジュールとの依存関係や、リポジトリの各種情報を記録している。  
しかしdotinstallの学習内では`package.json`を生成していないため、npmが「管理用ファイルがないよ」とキレている結果、このエラーメッセージが出ている。  

対処法としてはパッケージのルートディレクトリ(`npm_modules`ディレクトリが生成されるディレクトリ)で、事前に以下のコマンドで`package.json`を作成しておくことで解決する。

```
$ npm init
```

### dotinstallの方法でMongoDBが起動しない

「`mongod`デーモンが起動していないため、アクセスできない」というエラーである。  
従って、以下のコマンドで`mongod`デーモンを起動させてあげる。

```
$ sudo service mongod start
```

### Express入門においてdotinstallの方法で実施するとエラーが発生する

現在Express.jsの最新バージョンが「4.x」であるが、「3.x」で記述が変わっている個所があるので記述しておく。以下のサイトを参考にするとよい。

参考URL：ドットインストール Express入門 Express 4.x でやる時のちがいまとめ。 - かもメモ
https://chaika.hatenablog.com/entry/2015/10/08/171338

また上記URLでも触れていない個所について追記しておく。

#### #20 CSRF対策を施そう

上記サイトでは以下のように修正するよう指摘されているが...

```
...

app.use(cookieParser());
app.use(expressSession({secret: 'secret_key'}));
app.use(csrf());
```

コンソール上に以下のような警告が出てくる。

```
...

Sat, 13 Apr 2019 23:30:00 JST express-session deprecated pass resave option; default value will change at lib\config\express.js:55:11
Sat, 13 Apr 2019 23:30:00 JST express-session deprecated pass saveUninitialized option; default value will change at lib\config\express.js:55:11
```

どうやら省略可能のパラメータ`resave`と`saveUninitialized`のデフォルト値が近々変わると言っている。  
そのため、以下のように`resave`と`saveUninitialized`を設定してあげることで警告が消える。

追加したパラメータの意味は以下の通り。
* `resave`: セッションにアクセスすると上書きされるオプション
* `saveUninitialized`: 未初期化状態のセッションも保存するようなオプション

```
...

app.use(cookieParser());
app.use(expressSession({
	secret: 'secret_key',
	resave: true,			// ← ここ
	saveUninitialized: true		// ← ここ
}));
app.use(csrf());
```