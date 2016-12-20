exports= module.exports = function (app, conf) {
  require('./data')(app, conf);
  require('./changePassword')(app, conf);  
};