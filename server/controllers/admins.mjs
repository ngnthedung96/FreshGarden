import { adminDb, userDb } from '../dbs/index.mjs'
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken"
import { resolve } from 'path';

const register = async (req, res, next) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    try {
        const admin = await adminDb.register(email, password);
        res.status(200).json({
            status: true,
            msg: 'Đăng ký thành công',
            data: {
                uid: admin.id,
                email: admin.email
            }
        });

        next()
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}

const generateAccessToken = (admin) => {
    const adminId = admin.dataValues.id
    return jwt.sign({
        id: adminId
    },
        "secretAdminKey")
}
const generateRefreshToken = (admin) => {
    const adminId = admin.dataValues.id
    return jwt.sign({
        id: adminId
    },
        "secretAdminKey",
        {
            expiresIn: "365d"
        })
}

const login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }
    try {
        const admin = await adminDb.findByEmail(req.body.email, 'email')
        generateAccessToken(admin)
        generateRefreshToken(admin)
        res.cookie("refreshToken", generateRefreshToken(admin), {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict"
        })
        res.status(200).json({
            status: true,
            msg: 'Đăng nhập thành công',
            accesstoken: generateAccessToken(admin)
        });
        next()
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}
const reqRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken // lay ra token
    if (!refreshToken) {
        res.status(401), json("ban chua dang nhap")
    }
    else {
        //create new accesstoken, refresh token
        const newAccessToken = generateAccessToken(user)
        const newRefreshToken = generateRefreshToken(user)
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict"
        })
        //can push newrefresh vao db
        res.status(200).json({
            accessToken: newAccessToken
        })
    }
}
const home = async (req, res, next) => {
    try {
        if (req.admin) {
            const admin = await adminDb.findById(req.admin.id, 'id')
            res.json({
                status: true,
                admin
            })
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}
const logOut = async (req, res, next) => {
    try {
        res.clearCookie("refreshToken")
        res.json({
            status: true,
            msg: 'Đăng xuất thành công'
        })
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}

const getInfor = async (req, res, next) => {
    try {
        const admin = await adminDb.findById(req.params.id, 'id')
        res.json({
            status: true,
            admin
        })
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}

const getAdmin = async (req, res, next) => {
    try {
        if (req.admin) {
            const admin = await adminDb.findById(req.admin.id, 'id')
            res.json({
                status: true,
                admin
            })
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}

const getAdmins = async (req, res, next) => {
    try {
        if (req.admin) {
            const admins = await adminDb.findAll()
            res.json({
                status: true,
                admins
            })
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}

const updateInfor = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }
    try {
        if (req.admin) {
            const admin = await adminDb.findById(req.user.id, 'id')
            await admin.update({
                email: req.body.email,
                password: req.body.password
            })
            await admin.save()
            res.json({
                status: true,
                msg: 'Thay đổi thông tin thành công',
                admin
            })
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}
const getUser = async (req, res, next) => {
    try {
        if (req.admin) {
            const user = await userDb.findById(req.params.id, 'id')
            res.json({
                status: true,
                user
            })

        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}


export const adminController = {
    register,
    login,
    home,
    getInfor,
    updateInfor,
    logOut,
    getAdmin,
    getAdmins,
    getUser
}