export default {
   'get /': async (ctx, next) => {
      // const results = await ctx.$db.query('select * from b_tag');
      ctx.body = `
         <h1>my is index</h1>
      `;
   }
};
