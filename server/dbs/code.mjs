import { sequelize } from "./connect.mjs";
import { DataTypes } from 'sequelize'
import logger from '../logger.mjs'
const Code = sequelize.define('Code', {
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    discount: {
        type: DataTypes.STRING,
        allowNull: false
    },
    number: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {});
const createCode = async (code, discount, number) => {
    let res = null;
    try {
        res = await Code.create({
            code: code,
            discount: discount,
            number
        }, { fields: ['code', 'discount', 'number'] })
    } catch (err) {
        logger.error(err)
    }
    return res;
}


const findAllCode = async (value, field) => {
    let res = null;
    try {
        res = await Code.findAll({}
        )
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}

const findCode = async (value, field) => {
    let res = null;
    try {
        res = await Code.findOne({
            where: { "code": value }
        }
        )
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}
const findCodeById = async (value, field) => {
    let res = null;
    try {
        res = await Code.findOne({
            where: { "id": value }
        }
        )
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}
const deleteCode = async (value, field) => {
    let res = null;
    try {
        res = await Code.destroy(
            {
                where: { "id": value },
            }
        )
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}

export const codeDb = {
    createCode,
    findAllCode,
    findCode,
    findCodeById,
    deleteCode
}
