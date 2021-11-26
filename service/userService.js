const bcrypt = require('bcrypt')
const db = require('../db')
const tokenService = require('./tokenService')
const ApiError = require('../exceptions/apiError')
const uuid = require('uuid')

class UserService {

    async signin(email, password, nickname){

        const candidate = await db.query(`SELECT * FROM users where email = $1`, [email])
        if (candidate.rows[0]){
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`) 
        }

        const hashPassword = await bcrypt.hash(password, 5)

        const user = await db.query(`INSERT INTO users (uid, email, nickname, password) values ($1, $2, $3, $4) RETURNING *`, 
            [uuid.v4() ,email, nickname, hashPassword])

        return await tokenService.createToken(user.rows[0])
    }

    async login(email, password){

        const user = await db.query(`SELECT * FROM users where email = $1`, [email])

        if (!user.rows[0]){
            throw ApiError.BadRequest('Пользователь с таким email не был найден')
        }

        let comparePassword = bcrypt.compareSync(password, user.rows[0].password)
        if (!comparePassword) {
            throw ApiError.BadRequest('Указан неверный пароль')
        }

        return await tokenService.createToken(user.rows[0])

    }

    async logout(refreshToken){
        return await tokenService.removeToken(refreshToken)
    }

    async getUser(uid){
       return await db.query(`SELECT * FROM users where uid = $1`, [uid]) 
    }

    async updateUser(uid, email, password, nickname){

         userChanged = await db.query(`SELECT * FROM users  
                                                SET (email, password, nickname) WHERE uid = $4`, 
                                            [email, password, nickname, uid])
        return userChanged.rows[0]
    }

    async delete(uid){
        return await db.query(`DELETE FROM users
                        WHERE uid = &1`, [uid])
    }
}

module.exports = new UserService()