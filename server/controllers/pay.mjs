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
  var { user_id, note, shipFee, oldPrice, price, code, date, time, detail } = req.body;
  var rate = ""
  var staffFee = handlePriceToshow(Math.round(handlePriceToCal(oldPrice) * 10 / 100))
  var checkCode = "false"
  var details = []

  for (var i of detail) {
    details.push(JSON.stringify(i))
  }
  try {
    if (!note) {
      note = ""
    }
    else if (!code) {
      code = ""
    }

    // add code

    //------------------price---------------
    if ((handlePriceToCal(oldPrice) - handlePriceToCal(shipFee)) > 100000) {
      await saleDb.createSale("GIAM10", user_id)
    }


    //---------------member----------------
    var ordersOfUser = await payDb.findOrders(user_id)
    var ordersContainer = null
    for (var i = 0; i < ordersOfUser.length; i++) {
      if (ordersOfUser[i].dataValues.checkCode === "checked") {
        ordersContainer = ordersOfUser.slice(i + 1, ordersOfUser.length)
      }
    }
    if (ordersContainer) {
      var count = 0
      for (var orderBlock of ordersContainer) {
        for (var numberOrder of JSON.parse(orderBlock.detail)) {
          for (var numberProduct of numberOrder.number) {
            count += Number(numberProduct)
          }
        }
      }
      if (count >= 4) {
        await saleDb.createSale("GIAM10", user_id)
        checkCode = 'checked'
      }
    }
    else {
      var count = 0
      if (ordersOfUser.length <= 1) {
        for (var numberOfProduct of detail) {
          count += numberOfProduct.number
        }
      }
      else {
        for (var orderBlock of ordersOfUser) {
          if (orderBlock.checkCode === "checked") {
            break
          }
          else {
            for (var numberOrder of JSON.parse(orderBlock.detail)) {
              for (var numberProduct of numberOrder.number) {
                // console.log(numberProduct)
                count += Number(numberProduct)
              }
            }
          }
        }
      }
      if (count >= 4) {
        await saleDb.createSale("GIAM10", user_id)
        checkCode = 'checked'
      }
    }

    // add order
    const order = await payDb.createOrder(user_id, note, price, code, date, time, checkCode, shipFee, staffFee, rate, details)
    for (var i of detail) {
      const item = await itemsDb.findItem(i.item_id)
      await item.update({
        number: item.dataValues.number - Number(i.number),
      })
      await item.save()
      await saleDb.deleteSale(code)
      // // delete cart
      await cartDb.deleteAll()
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