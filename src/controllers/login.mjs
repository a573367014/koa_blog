import validator from 'validator';
import {JWT_SECRET, JWT_EXT_DATE} from '../config';
import {resultFormat} from '../utils/index';
import jwt from 'jwt-simple';

export default {
   'get /login': async (ctx, next) => {
      // const results = await ctx.$db.query('select * from b_tag');
      ctx.body = `
         <form action="/login" method="POST">
            <input type="text" name="user" />
            <input type="text" name="password" />
            <input type="submit" value="提交"/>
         </form>
      `;
   },
   'post /login': async (ctx, next) => {
      const {user, password} = ctx.request.body;
      // 数据验证
      if (validator.isEmpty(user) || validator.isEmpty(password)) {
         ctx.status = 401;
         ctx.body = resultFormat('账号、密码不能为空');
         return;
      }

      // 数据库验证
      const {rows} = await ctx.$db.query(
         'select id,user from b_user where user=? and password=MD5(?) and is_admin=1',
         [user, password]
      );

      if (rows && rows.length) {
         ctx.body = resultFormat('登录成功', {
            token: jwt.encode({
               iss: rows[0].id,
               ext: new Date().getTime() + JWT_EXT_DATE
            }, JWT_SECRET)
         });
      } else {
         ctx.status = 401;
         ctx.body = resultFormat('账号或密码错误');
      }
   }
};
