import e from 'express';
import { check, body } from 'express-validator';
import { adminDb } from '../dbs/index.mjs'
import { itemsDb } from '../dbs/index.mjs'
import { codeDb } from '../dbs/index.mjs'
import { userDb } from '../dbs/index.mjs'

const validate = (method) => {
  let err = [];
  switch (method) {
    case 'register': {
      err = [
        body('email', 'Email không hợp lệ').exists().isEmail().custom(value => {
          return adminDb.findByEmail(value, 'email').then(admin => {
            if (admin) {
              return Promise.reject('Email đã được sử dụng');
            }
          });
        })
      ]
    }
      break;
    case 'login': {
      var a
      err = [
        body('email', 'Email không hợp lệ').exists().isEmail().custom(value => {
          return adminDb.findByEmail(value, 'email').then(admin => {
            if (!admin) {
              return Promise.reject('Sai email');
            }
            else {
              a = admin.dataValues.password
            }
          });
        }),
        body('password', 'password không hợp lệ').exists().custom(password => {
          if (password === a) {
            return true
          }
          else {
            throw new Error('Sai mật khẩu')
          }
        })
      ]
    }
      break;
    case 'update': {
      err = [
        body('email', 'Email không hợp lệ').exists().isEmail().custom(value => {
          return adminDb.findByEmail(value, 'email').then(admin => {
            if (admin) {
              return Promise.reject('Email đã được sử dụng');
            }
          });
        })
      ]
    }
      break;
    case 'addItem': {
      err = [
        body('name', 'Name không hợp lệ').exists().custom(value => {
          return itemsDb.findItemByName(value, 'name').then(item => {
            if (item) {
              return Promise.reject('Name đã được sử dụng');
            }
          });
        }),
        body('img').exists(),
        body('name').exists(),
        body('price').exists()
      ]
    }
      break;
    case 'addSale': {
      err = [
        body('code', 'Code không hợp lệ').exists().custom(value => {
          return codeDb.findCode(value, 'name').then(code => {
            if (!code) {
              return Promise.reject('Code không tồn tại');
            }
            else if (Number(code.number) === 0) {
              return Promise.reject('Code đã sử dụng hết ');
            }
          });
        }),
        body('user_id', 'ID khách hàng không hợp lệ').exists().custom(value => {
          return userDb.findById(value, 'id').then(user => {
            if (!user) {
              return Promise.reject('Khách hàng không tồn tại');
            }
          });
        })
      ]
    }
      break;
  }

  return err;
}

export default validate;