import { cartDb } from '../dbs/index.mjs'
import { itemsDb } from '../dbs/index.mjs'
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken"
import { resolve } from 'path';


const createProduct = async (req, res, next) => {
  const { item_id, name, price, img } = req.body;
  try {
    if (req.user.id) {
      const user_id = req.user.id
      const check = await cartDb.findProductById(user_id, item_id);
      const item = await itemsDb.findItem(item_id)
      const checkNumber = item.dataValues.number
      if (!check && checkNumber > 0) {
        const product = await cartDb.createProduct(user_id, item_id, name, price, img);
        res.status(200).json({
          status: true,
          msg: 'Chọn sản phẩm thành công',
          data: {
            pid: product.id,
            user_id: user_id,
            product_id: item_id,
            name: name,
            price: price,
          }
        });
        next()
      }
      else if (checkNumber <= 10) {
        res.status(500).json({
          status: false,
          msg: 'Sản phẩm đã hết hàng'
        });
      }
      else {
        res.status(200).json({
          status: true,
          msg: 'Sản phẩm đã có trong giỏ hàng'
        });
      }
    }
  } catch (e) {
    console.log(e.message)
    res.sendStatus(500) && next(e)
  }
}

const showProducts = async (req, res, next) => {
  try {
    if (req.user) {
      const products = await cartDb.findProducts(req.user.id, 'user_id')
      res.json({
        status: true,
        products: products
      })
    }
  }
  catch (err) {
    console.log(err)
  }
}
const showAllProducts = async (req, res, next) => {
  try {
    if (req.user) {
      const products = await cartDb.findAllProducts()
      res.json({
        status: true,
        products: products
      })
    }
  }
  catch (err) {
    console.log(err)
  }
}

const deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await cartDb.deleteProduct(id);
    res.status(200).json({
      status: true,
      msg: 'Xóa sản phẩm thành công',
    });

    next()
  } catch (e) {
    console.log(e.message)
    res.sendStatus(500) && next(e)
  }
}

export const cartController = {
  createProduct,
  showProducts,
  deleteProduct,
  showAllProducts
}