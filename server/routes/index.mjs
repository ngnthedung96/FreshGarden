import express from 'express'
import { districtsController, userController } from '../controllers/index.mjs'
import { adminController } from '../controllers/index.mjs'
import { cartController } from '../controllers/index.mjs'
import { itemsController } from '../controllers/index.mjs'
import { payController } from '../controllers/index.mjs'
import userValidate from '../validates/users.mjs'
import adminValidate from '../validates/admins.mjs'
import { tokenValidate } from '../validates/tokenValidate.mjs'
import { codesController } from '../controllers/index.mjs'
import { saleController } from '../controllers/index.mjs'
import { citiesController } from '../controllers/index.mjs'
import { communesController } from '../controllers/index.mjs'
const router = express.Router() // create new router

//--------------------user------------------------------------
// create user
router.post('/users/register',
    userValidate('register'), // run valdiate
    userController.register
)
router.post('/users/login',
    userValidate('login'), // run valdiate
    userController.login
)
// router.post('/refreshToken',
//     tokenValidate.verifyToken, // run valdiate
// )
router.post('/users/logout',
    tokenValidate.tokenUserValidate.verifyToken,
    userController.logOut
)

router.get('/users/home',
    tokenValidate.tokenUserValidate.verifyToken,

    userController.home
)

router.get('/users/infor',
    tokenValidate.tokenUserValidate.verifyToken,

    userController.getInfor
)
//---------------------- Cart--------------------------------
router.post('/cart/create',
    tokenValidate.tokenUserValidate.verifyToken,

    cartController.createProduct
)
router.post('/cart/save',
    cartController.createProduct
)
router.get('/cart/show',
    tokenValidate.tokenUserValidate.verifyToken,

    cartController.showProducts
)
router.get('/cart/showAll',
    tokenValidate.tokenUserValidate.verifyToken,

    cartController.showAllProducts
)

router.delete('/cart/delete/:id',
    cartController.deleteProduct
)
// --------------------------items--------------------------
router.get('/item/showitem/:id',
    itemsController.showItem
)
router.get('/item/show/:title',
    itemsController.showItemsByCategory
)
router.get('/item/show',
    itemsController.showItems
)





//------------------------Pay--------------------------
router.post('/pay/create',
    payController.createOrder
)
router.get('/pay/show',
    tokenValidate.tokenUserValidate.verifyToken,

    payController.showOrders
)

router.get('/pay/showall',
    tokenValidate.tokenAdminValidate.verifyToken,
    payController.showAllOrders
)

router.put('/pay/updateRate',
    tokenValidate.tokenUserValidate.verifyToken,

    payController.updateRate
)

//----------------------------------Admin------------------------------------------------
router.post('/admins/register',
    adminValidate('register'), // run valdiate
    adminController.register
)

router.get('/admins/home',
    tokenValidate.tokenAdminValidate.verifyToken,

    adminController.getAdmin
)

router.get('/admins/showalladmins',
    tokenValidate.tokenAdminValidate.verifyToken,

    adminController.getAdmins
)

router.post('/admins/login',
    adminValidate('login'), // run valdiate
    adminController.login
)


router.get('/admins/showusers',
    tokenValidate.tokenAdminValidate.verifyToken,

    userController.showUsers
)
router.get('/admins/infor/:id',
    adminController.getInfor
)

router.get('/admins/showitems',
    tokenValidate.tokenAdminValidate.verifyToken,

    itemsController.showItemsToken
)
router.post('/admins/createitem',
    adminValidate('addItem'), // run valdiate
    tokenValidate.tokenAdminValidate.verifyToken,

    itemsController.createItem
)

router.delete('/admins/deleteitem/:id',
    tokenValidate.tokenAdminValidate.verifyToken,

    itemsController.deleteItem
)

router.put('/admins/updateitem/',
    tokenValidate.tokenAdminValidate.verifyToken,

    itemsController.updateItem
)

router.post('/admins/logout',
    adminController.logOut
)
router.get('/admins/showorder',
    tokenValidate.tokenAdminValidate.verifyToken,

    payController.showAllOrders
)

router.get('/admins/getuser/:id',
    tokenValidate.tokenAdminValidate.verifyToken,
    adminController.getUser
)



//-----------------sale----------------------
router.get('/sale/show/',
    tokenValidate.tokenUserValidate.verifyToken,

    saleController.showSalesOfUser
)
router.get('/sale/showall/',
    tokenValidate.tokenAdminValidate.verifyToken,

    saleController.showSales
)
router.get('/code/show',
    tokenValidate.tokenAdminValidate.verifyToken,

    codesController.showCode
)
router.get('/code/find/:code',
    tokenValidate.tokenUserValidate.verifyToken,

    codesController.findCode
)

router.post('/code/create',
    adminValidate('addCode'), // run valdiate
    tokenValidate.tokenAdminValidate.verifyToken,
    codesController.createCode
)
router.put('/code/edit',
    tokenValidate.tokenAdminValidate.verifyToken,
    codesController.editCode
)
router.put('/code/edit',
    tokenValidate.tokenAdminValidate.verifyToken,
    codesController.editCode
)
router.delete('/code/delete/:id',
    tokenValidate.tokenAdminValidate.verifyToken,
    codesController.deleteCode
)





router.post('/sale/create',

    tokenValidate.tokenAdminValidate.verifyToken,

    saleController.createSale
)
// router.delete('/sale/delete',
//     tokenValidate.verifyToken,
//     saleController.showCode
// )


// address 

router.get('/cities/show',
    citiesController.showCities
)
router.get('/districts/show/:cityid',
    districtsController.showDistricts
)
router.get('/communes/show/:districtid',
    communesController.showCommunes
)


export default router;