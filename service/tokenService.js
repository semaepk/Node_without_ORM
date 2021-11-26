const jwt = require('jsonwebtoken')
const jwtDecode = require('jwt-decode')
const db = require('../db')
const UserDto = require('../dtos/userDto')

class TokenService {

    generateToken(payload){
        const token = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {expiresIn:'30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {expiresIn:'30d'})

        return {
            token,
            refreshToken
        }
    }

    async createToken(user){
        
        const userDto = new UserDto(user)
        const tokens = new TokenService().generateToken({...userDto})
        await new TokenService().saveToken(userDto.uid, tokens.refreshToken) 

        const {exp, iat} = jwtDecode(tokens.token) 
        const expire = exp - iat
        
        return {...tokens, expire}
    }

    validateAccessToken(token){
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_KEY)
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token){
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_KEY)
        } catch (e) {
            return null
        }
    }

    async saveToken(userId, refreshToken){
       
        const tokenData = await db.query(`SELECT * FROM tokens where userId = $1`, [userId])
        if (tokenData.rows[0]){

            await db.query(`UPDATE tokens
	        SET refreshToken = $1
	        where userId = $2`, [refreshToken, userId])

            return tokenData
        }

        return await db.query(`INSERT INTO tokens (userId, refreshToken) values ($1, $2) RETURNING *`, 
        [userId, refreshToken])
    }

    async removeToken(refreshToken){
        return await db.query(`DELETE FROM tokens
        WHERE refreshToken = $1`, [refreshToken])
    }

    async findToken(refreshToken){
        
        const foundedToken = await db.query(`SELECT * FROM tokens where refreshToken = $1`, [refreshToken])
        return foundedToken.rows[0]
    }
 
}

module.exports = new TokenService()