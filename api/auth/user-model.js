const db = require('../../data/dbConfig')


/** 
 * @param password already hashed version of the password 
 * Input validation should happen prior to this step also
 * */
const createUser = ({username,password}) => {
   return db('users').insert({username,password})
}

const getUserByUsername = (username) => { 
    return db('users').where('username',username).first()
}

module.exports = {
    createUser,
    getUserByUsername,
}