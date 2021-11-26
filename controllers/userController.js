const userService = require('../service/userService')
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/apiError')
const jwtDecode = require('jwt-decode')

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
            
            const {token, expire} = userData
            return res.json({token, expire})

        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {

        try {
            const {email, password} = req.body
            const userData = await userService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            
            const {token, expire} = userData

            return res.json({token, expire})
 
         } catch (e) {
             next(e)
         }

    }

    async logout(req, res, next) {

        try {
            const {refreshToken} = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (e) {
            next(e)
        }
        
    }

    async getUser(req, res, next) {

        try {

            const {uid} = jwtDecode(req.cookies.refreshToken)
            const user = await userService.getUser(uid) 
            const {email, nickname} = user.rows[0]

            return res.json({email, nickname})
         } catch (e) {
             next(e) 
         }

    }

    async updateUser(req, res) {

        const {uid} = jwtDecode(req.cookies.refreshToken)
        const user = await userService.updateUser(uid, req.body.email, req.body.password, req.body.nickname)
        const {email, nickname} = user.rows[0]

        return res.json({email, nickname})
    }

    async delete(req, res) {

        try {
            const {refreshToken} = req.cookies
            const {uid} = jwtDecode(refreshToken)

            const token = await userService.logout(refreshToken)
            await userService.delete(uid)
            
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController()
