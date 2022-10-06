import { communesDb } from '../dbs/index.mjs'
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken"
import { resolve } from 'path';



const showCommunes = async (req, res, next) => {
    try {
        const communes = await communesDb.findCommunes(req.params.districtid)
        res.json({
            status: true,
            communes
        })
    }
    catch (err) {
        console.log(err)
    }
}
export const communesController = {
    showCommunes
}
