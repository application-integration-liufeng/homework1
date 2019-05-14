# 应用集成作业一

---

## 初始化项目
```shell
> npm install
```

## 启动项目, 监听3000接口
```shell
> npm start
```

## 部署数据库
- 修改config.js中的数据库配置
```
{
    host: 'localhost',
    port: 3306,
    user: '数据库用户名',
    db: '数据库名',
    pass: '数据库密码',
    char: 'utf8mb4'
}

```
- 修改tools / initdb.sql, 写入建表语句
- 根目录下执行指令
```shell
> npm run initdb
```
