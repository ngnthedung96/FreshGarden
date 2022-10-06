import { sequelize } from "./connect.mjs";
import { DataTypes } from 'sequelize'
import logger from '../logger.mjs'

// define tables
const Users = sequelize.define('Users', {
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING
        // allowNull defaults to true
    }
}, {});
const findByPassword = async (value, field) => {
    let res = null;
    try {
        res = await Users.findOne({
            where: {
                'password': value,
            }
        });
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}
const findById = async (value, field) => {
    let res = null;
    try {
        res = await Users.findOne({
            where: {
                'id': value,
            }
        });
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}
const findByEmail = async (value, field) => {
    let res = null;
    try {
        res = await Users.findOne({
            where: {
                'email': value,
            }
        });
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}

const register = async (email, password) => {
    let res = null;
    try {
        // Create a new user
        res = await Users.create({
            email: email,
            password: password
        }, { fields: ['email', 'password'] });
    } catch (err) {
        logger.error(err)
    }
    return res;
}

const findUsers = async (value, field) => {
    let res = null;
    try {
        res = await Users.findAll()
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}

export const userDb = {
    register,
    findByEmail,
    findByPassword,
    findById,
    findUsers
}