const userService = require('../service/userService')
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/apiError')

class UserController {
    
    async signin(req, res, next) {

        try {

            const errors = validationResult(req)
            if (!errors.isEmpty()){

                let arrayMessage = []
                errors.array().forEach(item => arrayMessage.push(item.msg + `, поле: ${item.param}`))
                return next(ApiError.BadRequest('Ошибка при валидации', arrayMessage))
            }

            const {email, password, nickname} = req.body
            const userData = await userService.signin(email, password, nickname) 
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)

        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {

        try {
            const {email, password} = req.body
            const userData = await userService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
 
         } catch (e) {
             next(e)
         }

    }

    async logout(req, res) {

        
    }

    async check(req, res) {
        const token = generateJwt(req.user.uid, req.user.email, req.user.nickname)
        return res.json({token})
    }

    async updateUser(req, res) {

        const id = req.params.id
        const user = await db.query(`SELECT * FROM users where email = $1`, [email]).row[0]

        const token = generateJwt(req.user.uid, req.user.email, req.user.nickname)
        return res.json({token})
    }

    async delete(req, res) {

        const id = req.params.id
        const user = await db.query(`SELECT * FROM users where email = $1`, [email]).row[0]

        const token = generateJwt(req.user.uid, req.user.email, req.user.nickname)
        return res.json({token})
    }
}

module.exports = new UserController()
