import { districtsDb } from '../dbs/index.mjs'
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken"
import { resolve } from 'path';



const showDistricts = async (req, res, next) => {
    try {
        const districts = await districtsDb.findDistricts(req.params.cityid)
        res.json({
            status: true,
            districts
        })
    }
    catch (err) {
        console.log(err)
    }
}
export const districtsController = {
    showDistricts
}
