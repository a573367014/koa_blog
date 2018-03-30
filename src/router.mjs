import KoaRouter from 'koa-router';
import index from './controllers/index';
import login from './controllers/login';
const router = new KoaRouter();
const methods = ['get', 'post', 'put', 'del', 'all'];
[
   index,
   login
].forEach(module => {
   for (let k in module) {
      const results = k.split(' ');
      if (methods.indexOf(results[0]) === -1) {
         console.error(`方法名必须是 ['get', 'post', 'put', 'del', 'all'] 中的一个`, k);
      } else {
         router[results[0]](results[1], module[k]);
      }
   }
});

export default router;
