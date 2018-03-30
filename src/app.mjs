import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import mysql from 'mysql';
import router from './router';
import {JWT_SECRET} from './config';
import koaJwt from 'koa-jwt';
import {dbPromisify} from './utils/index';
const app = new Koa();

const mysqlConfig = {
   host: 'localhost',
   port: 3306,
   user: 'root',
   password: 'root',
   database: 'node_blog'
};

function mysqlHandleError (err) {
   if (err) {
      // 长连接过期重连,过期时间一般为8小时
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
         conectMysql();
      } else {
         console.error(err && err.stack);
      }
   }
};

function conectMysql () {
   db = mysql.createConnection(mysqlConfig);
   db.connect(mysqlHandleError);
   db.on('error', mysqlHandleError);
};

var db;
conectMysql();

app
   .use(function (ctx, next) {
      return next().catch((err) => {
         if (err.status === 401) {
            ctx.status = 401;
            ctx.body = { msg: '请先未登录' };
         } else {
            console.log(err);
            throw err;
         }
      });
   })

   .use(koaJwt({
      cookie: 'token',
      secret: JWT_SECRET,
      isRevoked: (ctx, decodedToken, token) => {
         // token是否过期
         return decodedToken.ext < new Date().getTime()
            ? Promise.resolve(true)
            : Promise.resolve(false);
      }
   }).unless({ path: [/^\/login/] }))

   .use(async (ctx, next) => {
      db.query = dbPromisify(db.query.bind(db));
      ctx.$db = db;
      await next();
   })
   .use(bodyParser())
   .use(router.routes())
   .use(router.allowedMethods());

app.listen(3000);
