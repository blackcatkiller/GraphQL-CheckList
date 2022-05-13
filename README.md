# GraphQL CheckList

这是一个利用Apollo和react制作的todoList

## 安装

```
npm install
```



为了使这个应用可以正常运行，你需要注册一个Hasura账户，如果你在中国大陆使用，你可能需要一些科学上网工具。

注册完成后你可以在`src/index.js`中使用你的uri和`x-hasura-admin-secret`

![image-20220513191958651](https://github.com/blackcatkiller/GraphQL-CheckList/blob/master/readme_img/image-20220513191958651.png?raw=true)

`src/index.js`

```js
const client = new ApolloClient({
  uri: 'your uri',
  cache: new InMemoryCache(),
  headers: {
    "content-type": "application/json",
    "x-hasura-admin-secret": "your x-hasura-admin-secret",
  }
})

```

## 运行

```
npm start
```

![image-20220513192342024](C:\Users\blackcatkiller\AppData\Roaming\Typora\typora-user-images\image-20220513192342024.png)

使用远程数据库，对国内用户来说会有明显的延迟，这个问题尚未解决，作者也不清楚如何在promise 的pending状态时加上loading效果，希望能在这里得到解答。
