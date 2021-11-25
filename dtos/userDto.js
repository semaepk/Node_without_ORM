module.exports = class UserDto {
    email
    uid

    constructor(model){
        this.email = model.email
        this.uid = model.uid
    }
}