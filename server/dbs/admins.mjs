import { sequelize } from "./connect.mjs";
import { DataTypes } from 'sequelize'
import logger from '../logger.mjs'

// define tables
const Admins = sequelize.define('Admins', {
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
    res = await Admins.findOne({
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
    res = await Admins.findOne({
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
const findAll = async (value, field) => {
  let res = null;
  try {
    res = await Admins.findAll({

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
    res = await Admins.findOne({
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
    res = await Admins.create({
      email: email,
      password: password
    }, { fields: ['email', 'password'] });
  } catch (err) {
    logger.error(err)
  }
  return res;
}
export const adminDb = {
  register,
  findByEmail,
  findByPassword,
  findById,
  findAll
}