import { Sequelize, Op, Model, DataTypes } from 'sequelize'
import Config from '../config.mjs'
import logger from '../logger.mjs'

// connect db mariadb
export const sequelize = new Sequelize(Config.database, Config.user, Config.password, {

    host: Config.host,
    dialect: Config.dialect,
    logging: (msg) => logger.info(msg),
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        freezeTableName: true
    }
});