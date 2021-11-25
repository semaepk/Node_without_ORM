const bcrypt = require('bcrypt')
const db = require('../db')
const tokenService = require('./tokenService')
const ApiError = require('../exceptions/apiError')

class UserService {

    async signin(email, password, nickname){

        const candidate = await db.query(`SELECT * FROM users where email = $1`, [email])
        if (candidate.rows[0]){
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`) 
        }

        const hashPassword = await bcrypt.hash(password, 5)

        const user = await db.query(`INSERT INTO users (email, nickname, password) values ($1, $2, $3) RETURNING *`, 
            [email, nickname, hashPassword])

        return await tokenService.createToken(user.rows[0])
    }

    async login(email, password){

        const user = await db.query(`SELECT * FROM users where email = $1`, [email]).row[0]

        if (!user){
            throw ApiError.BadRequest('Пользователь с таким email не был найден')
        }

        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            throw ApiError.BadRequest('Указан неверный пароль')
        }

        return await tokenService.createToken(user)

    }

    async logout(refreshToken){
        return await tokenService.removeToken(refreshToken)
    }

    async refresh(refreshToken){

        if(!refreshToken){
            throw ApiError.UnauthorizedError()
        }

        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDB = await tokenService.findToken(refreshToken)
        
        if(!userData || !tokenFromDB){
            throw ApiError.UnauthorizedError()
        }

        const user = await User.findOne({where:{id: userData.id}})

        return await tokenService.createToken(user)
    }

    async getAllUsers(){
        return await User.findAll()
    }
}

module.exports = new UserService()