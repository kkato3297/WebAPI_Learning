const mysql = require('mysql2'),
      config = require('./config/mysql.json');

class Util {
    static toLeteralString(value) {
        if (typeof value == 'string') {
            return `'${value}'`;
        } else if (typeof value == 'number' || typeof value == 'boolean') {
            return `${value}`;
        } else if (typeof value == 'array') {
            return '[' + value.map(val => toLeteralString(val)).reduce(',') + ']';
        } else if (typeof value == 'object') {
            return '{' + Object.keys(value).map(key => `'${key}': ` + toLeteralString(value[key])).reduce(',') + '}';
        }
    }
}

module.exports = class MySQLController {
    constructor(dbname) {
        this.connection = mysql.createConnection({
            host: config.HOST,
            user: config.USER,
            password: config.PASSWORD,
            database: dbname
        });

        this.databese = dbname;
    }

    /*
     * データベースに接続する
     */
    connect() {
        this.connection.connect();
    }

    /*
     * 指定されたクエリを処理する
     */
    async query(sql) {
        const doQuery = (sql) => {
            return new Promise((resolve, reject) => {
                const result = this.connection.query(sql, (err, rows, fields) => {
                    if (err)
                        reject(err);
                    resolve(rows);
                });
            });
        };
        return await doQuery(sql);
    }

    /*
     * 指定されたテーブルの情報を取得する
     */
    async select(table) {
        return await this.query(`select * from \`${table}\`;`);
    }

    /*
     * 指定されたテーブルに行を追加
     */
    async insert(table, obj) {
        var sql = `insert into \`${table}\`(`;
        sql += Object.keys(obj).map(key => `\`${key}\``).join(',');
        sql += ') values (';
        sql += Object.keys(obj).map(key => `${Util.toLeteralString(obj[key])}`).join(',');
        sql += ');';

        return await this.query(sql);
    }

    /*
     * 指定されたテーブルを更新
     */
    async update(table, obj) {
        var sql = `update \`${table}\` set `;
        sql += Object.keys(obj.data).map(key => {
            return `${key}=${Util.toLeteralString(obj.data[key])}`;
        }).join(', ');
        sql += ` where ${obj.target.key} ${obj.target.condition} ${Util.toLeteralString(obj.target.value)};`;
        return await this.query(sql);
    }

    /*
     * 指定されたテーブルを検索
     */
    async search(table, obj) {
        var sql = `select * from \`${table}\``;
        sql += ` where ${obj.target.key} ${obj.target.condition} ${Util.toLeteralString(obj.target.value)};`;
        return await this.query(sql);
    }

    /*
     * 指定されたテーブルから削除
     */
    async delete(table, obj) {
        var sql = `delete from \`${table}\` `;
        sql += ` where ${obj.target.key} ${obj.target.condition} ${Util.toLeteralString(obj.target.value)};`;
        return await this.query(sql);
    }

    /*
     * 指定されたテーブルの次回自動採番される際の値を設定
     */
    async setAutoIncrementCounter(table, value = 1) {
        return await this.query(`alter table \`${table}\` auto_increment = ${value};`);
    }

    /*
     * 現在接続中のデータベースを切断する
     */
    disconnect() {
        this.connection.end();
    }
}

