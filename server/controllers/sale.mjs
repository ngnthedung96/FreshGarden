import { codeDb, userDb } from '../dbs/index.mjs'
import { saleDb } from '../dbs/index.mjs'
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken"
import { resolve } from 'path';



const showSales = async (req, res, next) => {
    try {
        if (req.admin) {
            const codes = await saleDb.findAllSale()
            res.json({
                status: true,
                codes
            })

        }
    }
    catch (err) {
        console.log(err)
    }
}

const createSale = async (req, res, next) => {
    var { code, user_id } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }
    try {
        if (req.admin) {
            var sale = await saleDb.createSale(code, user_id);
            res.status(200).json({
                status: true,
                msg: 'Thêm mã thành công',
                data: {
                    cid: sale.id,
                    user_id: user_id
                }
            });
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}


const showSaleOfUser = async (req, res, next) => {
    try {
        if (req.user) {
            const sale = await saleDb.findSaleOfUser(Number(req.user.id), req.params.code)
            var code = null
            if (sale) {
                code = await codeDb.findCode(sale.dataValues.code)
            }
            res.json({
                status: true,
                code
            })

        }
    }
    catch (err) {
        console.log(err)
    }
}


const showSalesOfUser = async (req, res, next) => {
    try {
        if (req.user) {
            const sale = await saleDb.findSalesOfUser(Number(req.user.id))
            res.json({
                status: true,
                sale
            })
        }

    }
    catch (err) {
        console.log(err)
    }
}

export const saleController = {
    showSales,
    createSale,
    showSaleOfUser,
    showSalesOfUser
}