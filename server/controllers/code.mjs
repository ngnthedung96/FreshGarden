import { codeDb, saleDb } from '../dbs/index.mjs'
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken"
import { resolve } from 'path';



const showCode = async (req, res, next) => {
    try {
        if (req.admin) {
            const codes = await codeDb.findAllCode()
            res.json({
                status: true,
                codes,
                id: req.admin.id
            })
        }
    }
    catch (err) {
        console.log(err)
    }
}
const findCode = async (req, res, next) => {
    try {
        if (req.user) {

            const { code } = req.params
            const findedCode = await codeDb.findCode(code)
            res.json({
                status: true,
                findedCode
            })
        }
    }
    catch (err) {
        console.log(err)
    }
}


const createCode = async (req, res, next) => {
    var { code, discount, number } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }
    try {
        if (req.admin) {
            var code = await codeDb.createCode(code, discount, number);
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

const editCode = async (req, res, next) => {
    const { id, code, discount, number } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }
    try {
        if (req.admin) {
            var checkcode = await codeDb.findCodeById(id);
            if (checkcode) {
                await checkcode.update({
                    code: code,
                    discount: discount,
                    number: Number(number)
                })
                await checkcode.save()
                res.status(200).json({
                    status: true,
                    msg: 'Cập nhật code thành công'
                });
            }
            else {
                res.status(500).json({
                    status: true,
                    msg: 'Cập nhật code không thành công'
                });
            }

        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}
const deleteCode = async (req, res, next) => {
    const { id } = req.params;
    try {
        if (req.admin) {
            const code = await codeDb.findCodeById(id)
            await saleDb.deleteSaleByCode(code.dataValues.code)
            await codeDb.deleteCode(id);
            res.status(200).json({
                status: true,
                msg: 'Xóa code thành công'
            });

        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}



export const codesController = {
    showCode,
    createCode,
    findCode,
    editCode,
    deleteCode
}