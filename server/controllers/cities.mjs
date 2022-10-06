import { citiesDb } from '../dbs/index.mjs'
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken"
import { resolve } from 'path';



const showCities = async (req, res, next) => {
    try {
        const cities = await citiesDb.findAllCities()
        res.json({
            status: true,
            cities
        })
    }
    catch (err) {
        console.log(err)
    }
}
export const citiesController = {
    showCities
}
