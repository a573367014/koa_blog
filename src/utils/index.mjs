const resultFormat = function (msg, data) {
   return {
      msg,
      data: data || {}
   };
};

const dbPromisify = function (fn) {
   if (typeof fn !== 'function') throw new Error('fn must be a function');

   return function (...rest) {
      return new Promise(function (resolve, reject) {
         fn(...rest, (err, ...rest) => err ? reject(err) : resolve({ rows: rest[0], filds: rest[1] }));
      });
   };
};

export { resultFormat, dbPromisify };
