需求梳理

1. 用户
    a. 未登录
        浏览、搜索、关于、登录
    b. 登录
        1）普通用户
            借书、还书、求购、注销、个人信息管理
        2）管理员
            管理书籍、管理用户 

2. session机制
    a. 服务端生成Session ID
    b. 服务端保存Session ID 和 用户信息, 客户端在cookie中保存Session ID
    c. 从cookie中取出Session ID
    d. 在服务端的hash中取出用户信息

3. 中间件
    express-session
    connect-mongo