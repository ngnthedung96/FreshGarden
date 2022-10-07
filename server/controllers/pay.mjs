import { codeDb, payDb, saleDb } from '../dbs/index.mjs'
import { cartDb } from '../dbs/index.mjs'
import { itemsDb } from '../dbs/index.mjs'
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken"
import { resolve } from 'path';
import { request } from 'http';
import { stringify } from 'querystring';
import { JSONB } from 'sequelize';
import moment from "moment"


const createOrder = async (req, res, next) => {
  var { user_id, note, shipFee, oldPrice, price, code, sale_id, date, time, detail, rate, details, city,
    district,
    commune,
    address } = req.body;
  var rate = ""
  var staffFee = handlePriceToshow(Math.round(handlePriceToCal(oldPrice) * 10 / 100))
  var checkCode = "false"
  var details = []

  for (var i of detail) {
    details.push(JSON.stringify(i))
  }
  try {

    // add code

    //------------------price---------------
    if ((handlePriceToCal(oldPrice) - handlePriceToCal(shipFee)) > 100000) {
      await saleDb.createSale("GIAM10", user_id)
    }
    // add order
    const order = await payDb.createOrder(user_id, note, price, code, sale_id, date, time, shipFee,
      staffFee, rate, details,
      city,
      district,
      commune,
      address)
    for (var i of detail) {
      const item = await itemsDb.findItem(i.item_id)
      await item.update({
        number: item.dataValues.number - Number(i.number),
      })
      await item.save()
      // // delete cart
      await cartDb.deleteAll()
    }
    if (sale_id) {
      await saleDb.deleteSale(sale_id)
    }
    res.json({
      status: "Success",
      msg: "Thanh toán thành công",
      order
    })
  } catch (e) {
    console.log(e.message)
    res.sendStatus(500) && next(e)
  }
}



const showOrders = async (req, res, next) => {
  try {
    if (req.user) {
      const orders = await payDb.findOrders(req.user.id, 'user_id')
      res.json({
        status: true,
        orders
      })
    }
  }
  catch (err) {
    console.log(err)
  }
}
const showAllOrders = async (req, res, next) => {
  try {
    if (req.user) {
      const orders = await payDb.findAllOrders()
      res.json({
        status: true,
        orders,
        id: req.user.id
      })
    }
  }
  catch (err) {
    console.log(err)
  }
}

const showOrdersByPage = async (req, res, next) => {
  try {
    if (req.user) {
      let page = Number(req.params.page) - 1
      let numberOrder = 5
      const orders = await payDb.findAllOrders()
      let numberArr = Math.ceil(orders.length / numberOrder)
      const containerProPage = []
      var i = 0
      while (i < numberArr) {
        containerProPage.push([])
        i++
      }
      var index = 0
      var count = 0
      for (var i = 0; i < orders.length; i++) {
        if (count <= numberOrder - 1) {
          containerProPage[index].push(orders[i])
        }
        else {
          count = 0
          index++
          containerProPage[index].push(orders[i])
        }
        count++
      }
      res.json({
        status: true,
        orders: containerProPage[page],
        id: req.user.id,
        numberPage: numberArr
      })
    }
  }
  catch (err) {
    console.log(err)
  }
}

const updateRate = async (req, res, next) => {
  var { id, rate } = req.body;
  try {
    if (req.user) {
      var rates = []
      for (var i of rate) {
        const rateNumber = Number(i.rate)
        const rateId = Number(i.id)
        const item = await itemsDb.findItem(Number(rateId))
        var starNumber = item.dataValues.rate
        if (starNumber) {
          if (rateNumber === 0) {
            var newStarNumber = ((Number(starNumber)) / 2).toFixed(1)
            await item.update({
              rate: `${newStarNumber}`
            })
          }
          else {
            var newStarNumber = ((Number(starNumber) + rateNumber) / 2).toFixed(1)
            await item.update({
              rate: `${newStarNumber}`
            })
          }
        }
        else {
          if (rateNumber === 0) {
            var newStarNumber = ((rateNumber) / 2).toFixed(1)
            await item.update({
              rate: `${newStarNumber}`
            })
          }
          else {
            var newStarNumber = (rateNumber)
            await item.update({
              rate: `${newStarNumber}`
            })
          }
        }

        rates.push(JSON.stringify(i))
      }
      const order = await payDb.findOrderById(id)
      await order.update({
        rate: `[${rates}]`
      })
      await order.save()
      res.json({
        status: true,
        msg: 'Đánh giá sản phẩm thành công',
        order
      })
    }
  } catch (e) {
    console.log(e.message)
    res.sendStatus(500) && next(e)
  }
}


function handlePriceToshow(price) {
  var container = `${price}`.split('').reverse()
  var b = []
  var count = 0
  for (var i of container) {
    count++
    if (count === 3) {
      count = 0
      b.push(i)
      b.push(',')
    }
    else {
      b.push(i)
    }
  }
  if (b.reverse()[0] === ',') {
    b = (b.slice(1, b.length)).join('') + 'đ'
  }
  else {
    b = b.join('') + 'đ'
  }
  return b
}

function handlePriceToCal(price) {
  var container = []
  for (var j of price.split('')) {
    if (j != "đ" && j != ",") {
      container.push(j)
    }
  }
  return Number(container.join(''))
}





export const payController = {
  createOrder,
  showOrders,
  showAllOrders,
  updateRate,
  showOrdersByPage
}