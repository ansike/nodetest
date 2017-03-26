var user = {
    insert: 'INSERT INTO staff(name,age,sex,address,depart,worklen,wage) VALUES(?,?,?,?,?,?,?)',
    update:'update staff set name=?,age=?,sex=?,address=?,depart=?,worklen=?,wage=? where id=?',
    delete:'delete from staff where id=?',
    queryById:'select * from staff where id=?',
    queryAll:'select * from staff',
}
module.exports = user;
