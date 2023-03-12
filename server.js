const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
const MongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');


app.use('/public', express.static('public'));


var db;
MongoClient.connect('mongodb+srv://admin:1234@cluster0.mhl7op5.mongodb.net/?retryWrites=true&w=majority', function(에러, client) {
    //연결되면 할일
    if(에러) return console.log(에러)
    db = client.db('todoapp');  // todoapp이라는 database에 연결중요

    app.listen(8080, function(){
      console.log('listening on 8080');
    });
});




// 누군가가 /pet 으로 방문을 하면..

app.get('/pet', function(요청, 응답){
    응답.send('펫용품 쇼핑할 수 있는 페이지입니다.');
});

app.get('/beauty', function(request, response) {
    response.send('화장품을 파는 페이지입니다.');
});

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/index.ejs')
    response.render('index.ejs');

});

app.get('/write', function(request, response) {
    response.sendFile(__dirname + '/write.ejs')
    response.render('write.ejs');
});




// insert (작성하기)

// 어떤 사람이 /add 경로로 POST 요청을 하면...
app.post('/add', function(요청, 응답){
    응답.send('전송완료');
    // console.log(request.body.title);
    // console.log(request.body.date);

    // 게시물 갯수 꺼내오기
    db.collection('counter').findOne({name : '게시물갯수'}, function(에러, 결과){
        console.log(결과.totalPost)
        var 총게시물갯수 = 결과.totalPost;

        // 어떤 사람이 /add 라는 경로로 post 요청을 하면,
        // 데이터 2개 (날짜, 제목)을 보내주는데,
        // 이때, 'post'라는 이름을 가진 collection에 두개 데이터를 저장하기
        // { 제목 : '어쩌구', 날짜 : '어쩌구' }
        db.collection('post').insertOne( { _id : 총게시물갯수 + 1, 제목 : 요청.body.title, 날짜 : 요청.body.date }, function(에러, 결과){
            console.log('(제목, 날짜) 저장완료');
            //counter라는 콜렉션에 있는 totalPost 라는 항목도 1 증가시켜야함(수정);
            db.collection('counter').updateOne({name:'게시물갯수'},{ $inc : {totalPost:1} },function(에러, 결과){
                if(에러){return console.log(에러)}

            });
        });
    });
});

// 글 번호 달기



// list (보여주기)

// /list 로 GET요청으로 접속하면 
// 실제 DB에 저장된 데이터들로 예쁘게 꾸며진 HTML을 보여줌
app.get('/list', function(요청, 응답){

    // 1. DB에 저장된 POST라는 collection안의 모든 데이터를 꺼내주세요
    // 2. 찾은걸 ejs파일에 집어넣어주세요
    db.collection('post').find().toArray(function(에러, 결과){
        console.log(결과);
        응답.render('list.ejs', { posts : 결과 });
    });
});

// DELETE (삭제하기)
app.delete('/delete', function(요청, 응답){
    console.log(요청.body);
    요청.body._id = parseInt(요청.body._id);
    // 요청.body에 담겨온 게시물번호를 가진 글을 db에서 찾아서 삭제해주세요
    db.collection('post').deleteOne(요청.body, function(에러, 결과){
        console.log('삭제완료');
        응답.status(200).send({ message : '성공했습니다' });
    })
})

// detail 로 접속하면 detail.ejs 보여줌

app.get('/detail/:id', function(요청, 응답){
    db.collection('post').findOne({ _id : parseInt(요청.params.id)}, function(에러, 결과){
        console.log(결과);
        응답.render('detail.ejs', { data : 결과 });
    })
})


// edit (수정하기)
app.get('/edit/:id', function(요청, 응답){

    db.collection('post').findOne({ _id : parseInt(요청.params.id)}, function(에러, 결과){
        console.log(결과)
        응답.render('edit.ejs', { post : 결과 })
    })
})

app.put('/edit', function(요청, 응답){
    //폼에 담긴 제목데이터, 날짜 데이터를 가지고 
    //db.collection 에다가 업데이트함
    db.collection('post').updateOne({ _id : parseInt(요청.body.id)}, { $set : { 제목 : 요청.body.title, 날짜 : 요청.body.date}}, function(에러,결과){
        console.log('수정완료');
        응답.redirect('/list')
    })
})