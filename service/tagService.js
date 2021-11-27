const db = require('../db')

class TagService {

    async createTag(uid, nameItem, sortOrder = 0){

        const tagFound = await db.query(`SELECT * FROM tags where name = $1`, [nameItem])
        if (tagFound.rows[0]){
            throw ApiError.BadRequest(`${nameItem} уже существует в базе`) 
        }

        const tagCreate = await db.query(`INSERT INTO tags (creator, name, sortorder) values ($1, $2, $3) RETURNING *`,
            [uid, nameItem, sortOrder])

        const {name, sortorder} = tagCreate.rows[0]

        return {name, sortorder}
    }

    async getOne(id){

        const tagFound = await db.query(`SELECT name, sortorder, users.uid, users.nickname FROM tags
                                        INNER JOIN users on creator = users.uid
                                        WHERE id = $1`, [id])
        const {name, sortorder} = tagFound.rows[0]

        return {name, sortorder}
    }

    async getAllWithSort(sortByOrder = false, sortByName = false, page = 10, pageSize = 10){

        let query = `SELECT name, sortorder, users.uid, users.nickname FROM tags
                     INNER JOIN users on creator = users.uid`
        
        if(sortByOrder){
            query =+ `\nORDER BY sortorder`
        }

        if(sortByName){

            if (query.includes('ORDER BY')){
                query =+ ` ,name`
            } else {
                query =+ `\nORDER BY name`
            }
        }

        const userSorted = await db.query(query)
        return userSorted.rows[0]
 
    }

    async updateTag(){

    }

    async deleteTag(){
        
    }
 
}

module.exports = new TagService()