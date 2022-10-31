const getUser = "select * from users";
const getUserById = "select * from users where user_id = $1";
const checkIdExists = "select s from users s where s.user_id = $1";
const addUser = "insert into users (name, user_id, email, password) values ($1, $2, $3, $4)";
const removeUser = "delete from users where user_id = $1";
const updateUser = "update users set name = $1 where user_id = $2";



module.exports = {
    getUser,
    getUserById,
    checkIdExists,
    addUser,
    removeUser,
    updateUser,
};
