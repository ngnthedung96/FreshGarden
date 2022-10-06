import { sequelize } from "./connect.mjs";
import { DataTypes } from 'sequelize'
import logger from '../logger.mjs'
const communes = sequelize.define('Communes', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dis_code: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    best_id: {
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
    code_ghn: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {});

const findCommunes = async (value, field) => {
    let res = null;
    try {
        res = await communes.findAll({
            where: {
                "dis_code": Number(value)
            }
        })
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}


export const communesDb = {
    findCommunes
}
