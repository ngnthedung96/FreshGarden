import { sequelize } from "./connect.mjs";
import { DataTypes } from 'sequelize'
import logger from '../logger.mjs'
const cities = sequelize.define('Cities', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    best_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    region: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    orders: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    vtpost_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    snappy_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code_ghn: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {});

const findAllCities = async (value, field) => {
    let res = null;
    try {
        res = await cities.findAll()
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}


export const citiesDb = {
    findAllCities
}


