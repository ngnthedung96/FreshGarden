import express from 'express'
import { districtsController, userController } from '../controllers/index.mjs'
import { adminController } from '../controllers/index.mjs'
import { cartController } from '../controllers/index.mjs'
import { itemsController } from '../controllers/index.mjs'
import { payController } from '../controllers/index.mjs'
import userValidate from '../validates/users.mjs'
import adminValidate from '../validates/admins.mjs'
import tokenValidate from '../validates/tokenValidate.mjs'
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
    tokenValidate.verifyToken,
    userController.logOut
)

router.get('/users/home',
    tokenValidate.verifyToken,
    userController.home
)

router.get('/users/infor',
    tokenValidate.verifyToken,
    userController.getInfor
)

router.post('/users/updateinfor',
    tokenValidate.verifyToken,
    userValidate('update'), // run valdiate
    userController.updateInfor
)

//---------------------- Cart--------------------------------
router.post('/cart/create',
    tokenValidate.verifyToken,
    cartController.createProduct
)
router.post('/cart/save',
    cartController.createProduct
)
router.get('/cart/show',
    tokenValidate.verifyToken,
    cartController.showProducts
)
router.get('/cart/showAll',
    tokenValidate.verifyToken,
    cartController.showAllProducts
)

router.post('/cart/delete',
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
    tokenValidate.verifyToken,
    payController.showOrders
)

router.get('/pay/showall',
    tokenValidate.verifyToken,
    payController.showAllOrders
)

router.put('/pay/updateRate',
    tokenValidate.verifyToken,
    payController.updateRate
)

//----------------------------------Admin------------------------------------------------
router.post('/admins/register',
    adminValidate('register'), // run valdiate
    adminController.register
)

router.get('/admins/home',
    tokenValidate.verifyToken,
    adminController.getAdmin
)

router.get('/admins/showalladmins',
    tokenValidate.verifyToken,
    adminController.getAdmins
)

router.post('/admins/login',
    adminValidate('login'), // run valdiate
    adminController.login
)


router.get('/admins/showusers',
    tokenValidate.verifyToken,
    userController.showUsers
)
router.get('/admins/infor/:id',
    adminController.getInfor
)

router.get('/admins/showitems',
    tokenValidate.verifyToken,
    itemsController.showItemsToken
)
router.post('/admins/createitem',
    adminValidate('addItem'), // run valdiate
    tokenValidate.verifyToken,
    itemsController.createItem
)

router.delete('/admins/deleteitem/:id',
    tokenValidate.verifyToken,
    itemsController.deleteItem
)

router.put('/admins/updateitem',
    tokenValidate.verifyToken,
    itemsController.updateItem
)

router.post('/admins/logout',
    adminController.logOut
)
router.get('/admins/showorder/:page',
    tokenValidate.verifyToken,
    payController.showOrdersByPage
)
router.get('/admins/showorder',
    tokenValidate.verifyToken,
    payController.showAllOrders
)

router.get('/admins/getuser/:id',
    userController.getUser
)



//-----------------sale----------------------
router.get('/sale/show/:id',
    saleController.showSalesOfUser
)
router.get('/sale/show/:id/:code',
    saleController.showSaleOfUser
)
router.get('/sale/show/',
    saleController.showSales
)
router.get('/code/show',
    tokenValidate.verifyToken,
    codesController.showCode
)




router.post('/sale/create',
    adminValidate('addSale'), // run valdiate
    tokenValidate.verifyToken,
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