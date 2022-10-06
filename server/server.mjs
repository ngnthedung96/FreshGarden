import express from 'express';
import cors from 'cors';
import routes from './routes/index.mjs'
import { sequelize } from './dbs/index.mjs'
import logger from './logger.mjs'
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser'
const __dirname = dirname(fileURLToPath(
    import.meta.url));

var corsOptions = {
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const app = express()
app.use(cookieParser())
app.use(cors())
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.static('public'))
const port = 3333

app.get('/', (req, res) => {
    var options = {
        root: path.join(__dirname, 'public'),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    }

    res.sendFile('./index.html', options, function (err) {
        if (err) {
            next(err)
        }
    })
})

// điều hướng routes bắt đầu bằng /api/...
app.use('/api', routes)

app.listen(port, () => {
    console.log('Server listening on port: ', port)
    sequelize.authenticate()
        .then(async () => {
            console.log('database connect successfully!');
            logger.info('Connection has been established successfully.');
            // await sequelize.sync({ alter: true });
        })
        .catch(err => {
            console.log('database connect err!');
            logger.error(err)
        })
})