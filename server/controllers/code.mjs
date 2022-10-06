import { codeDb } from '../dbs/index.mjs'
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken"
import { resolve } from 'path';



const showCode = async (req, res, next) => {
    try {
        if (req.user) {
            const codes = await codeDb.findAllCode()
            res.json({
                status: true,
                codes,
                id: req.user.id
            })
        }
    }
    catch (err) {
        console.log(err)
    }
}


const createCode = async (req, res, next) => {
    var { code, discount } = req.body;
    try {
        if (req.user) {
            var code = await codeDb.createCode(code, discount);
            res.status(200).json({
                status: true,
                msg: 'Thêm code thành công',
                data: {
                    cid: code.id,
                    discount: discount
                }
            });
            next()
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}



export const codesController = {
    showCode,
    createCode
}