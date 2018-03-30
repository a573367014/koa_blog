module.exports = {
   apps: [{
      name: 'BLOG_DEV',
      script: './src/app.mjs',
      node_args: '--experimental-modules',
      watch: true,
      env: {
         'NODE_ENV': 'development'
      }
      // env_production: {
      //    'NODE_ENV': 'production'
      // }
   }]
};
