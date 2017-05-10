var cate={
	insert:'insert into cate (name,pid) values(?,?)',
	queryById:'select * from cate where id=?',
	queryAll:'select * from cate '
}
module.exports=cate;