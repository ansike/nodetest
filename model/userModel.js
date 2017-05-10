var user = {
    insert: 'INSERT INTO user_t(name,pwd) VALUES(?,?)',
    update:'update user_t set ',
    delete:'delete from user_t where id=?',
    queryById:'select * from user_t where id=?',
    queryAll:'select * from user_t',
    queryByName:'select * from user_t where name=?'
}
module.exports = user;
