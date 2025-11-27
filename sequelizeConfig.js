
require('dotenv').config(); 

const dialectOptions = {
    ssl: {
        require: true,
        rejectUnauthorized: false 
    }
};

module.exports = {
  development: {
    url: process.env.DATABASE_URL, 
    dialect: 'postgres',           
    dialectOptions: dialectOptions, 
    migrationsPath: 'src/migrations',
    modelsPath: 'src/models',
    logging: console.log, 
  }
};