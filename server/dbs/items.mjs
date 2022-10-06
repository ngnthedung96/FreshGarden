import { sequelize } from "./connect.mjs";
import { DataTypes } from 'sequelize'
import logger from '../logger.mjs'

const Items = sequelize.define('Items', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imPrice: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false
    },
    img: {
        type: DataTypes.STRING,
        allowNull: false
    },
    number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rate: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {});

const findItems = async (value, field) => {
    let res = null;
    try {
        res = await Items.findAll()
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}

const findItemsByCategory = async (value, field) => {
    let res = null;
    try {
        res = await Items.findAll({
            where: {
                "category": value
            }
        }
        )
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}

const findItem = async (value, field) => {
    let res = null;
    try {
        res = await Items.findOne({
            where: { "id": value },
        })
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}

const findItemByName = async (value, field) => {
    let res = null;
    try {
        res = await Items.findOne({
            where: { "name": value },
        })
    }
    catch (err) {
        logger.error(err)
    }
    return res;
}

const createItem = async (name, category, imPrice, price, number, imgs) => {
    let res = null;
    var rate = ''
    console.log(name, category, imPrice, price, number, imgs)
    try {
        res = await Items.create({
            name: `${name}`,
            imPrice: `${imPrice}`,
            category: `${category}`,
            price: `${price}`,
            rate: rate,
            number: Number(number),
            img: `[${imgs}]`
        }, { fields: ['name', 'category', 'imPrice', 'price', 'number', 'img', 'rate'] })
    } catch (err) {
        logger.error(err)
    }
    return res;
}

const deleteItem = async (value, field) => {
    let res = null;
    try {
        res = await Items.destroy(
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

export const itemsDb = {
    findItems,
    findItem,
    findItemByName,
    createItem,
    deleteItem,
    findItemsByCategory
}
