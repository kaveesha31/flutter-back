//check the environment whether it is developed or deployed
var env = process.env.NODE_ENV || 'development'

//fetch environent data 
var config = require('./config.json');

var envConfig = config[env];
Object.keys(envConfig).forEach(key => process.env[key] = envConfig[key]);