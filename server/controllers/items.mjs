import { itemsDb } from '../dbs/index.mjs'
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken"
import { resolve } from 'path';

const showItems = async (req, res, next) => {
  try {
    const items = await itemsDb.findItems()
    res.json({
      status: true,
      items: items
    })
  }
  catch (err) {
    console.log(err)
  }
}

const showItemsToken = async (req, res, next) => {
  try {
    if (req.admin) {
      const items = await itemsDb.findItems()
      res.json({
        status: true,
        items: items,
        id: req.admin.id
      })
    }
  }
  catch (err) {
    console.log(err)
  }
}

const showItem = async (req, res, next) => {
  try {
    const items = await itemsDb.findItem(req.params.id)
    res.json({
      status: true,
      item: items
    })
  }
  catch (err) {
    console.log(err)
  }
}

const deleteItem = async (req, res, next) => {
  try {
    const items = await itemsDb.deleteItem(req.params.id)
    res.json({
      status: true,
      msg: "Xóa sản phẩm thành công",
      item: items,
    })
  }
  catch (err) {
    console.log(err)
  }
}

const createItem = async (req, res, next) => {
  const { name, category, imPrice, price, number, img } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  try {
    var imgs = []
    for (var i of img) {
      imgs.push(JSON.stringify(i))
    }
    if (req.admin) {
      const product = await itemsDb.createItem(name, category, imPrice, price, number, imgs);
      res.status(200).json({
        status: true,
        msg: 'Thêm sản phẩm thành công',
        data: {
          product,
          adminId: req.admin.id,
        }
      });
      next()
    }
  } catch (e) {
    console.log(e.message)
    res.sendStatus(500) && next(e)
  }
}

const updateItem = async (req, res, next) => {
  const { id, name, price, number, imPrice, img } = req.body;
  var imgs = []
  for (var i of img) {
    imgs.push(JSON.stringify(i))
  }
  try {
    if (req.admin) {
      const item = await itemsDb.findItem(id, 'id')
      await item.update({
        name: name,
        price: price,
        imPrice: imPrice,
        number: number,
        img: `[${imgs}]`
      })
      await item.save()
      res.json({
        status: true,
        msg: 'Thay đổi thông tin sản phẩm thành công',
        item
      })
    }
  } catch (e) {
    console.log(e.message)
    res.sendStatus(500) && next(e)
  }
}


const showItemsByCategory = async (req, res, next) => {
  try {
    if (req.params.title == 'home') {
      const items = await itemsDb.findItems()
      res.json({
        status: true,
        items: items,
        category: "Tất cả sản phẩm"
      })
    }
    else {
      const items = await itemsDb.findItemsByCategory(req.params.title)
      res.json({
        status: true,
        items: items,
        category: req.params.title
      })
    }

  }
  catch (err) {
    console.log(err)
  }
}




export const itemsController = {
  showItems,
  showItem,
  showItemsToken,
  createItem,
  deleteItem,
  updateItem,
  showItemsByCategory
}