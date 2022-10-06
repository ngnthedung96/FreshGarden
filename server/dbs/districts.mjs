import { sequelize } from "./connect.mjs";
import { DataTypes } from 'sequelize'
import logger from '../logger.mjs'
const districts = sequelize.define('Districts', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    citi_code: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    district_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    best_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    region_dis: {
        type: DataTypes.STRING,
        allowNull: false
    },
    region: {
        type: DataTypes.STRING,
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

const findDistricts = async (value, field) => {
    let res = null;
    try {
        console.log(value)
        res = await districts.findAll({
            where: {
                "citi_code": Number(value)
            }
        })
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}


export const districtsDb = {
    findDistricts
}
