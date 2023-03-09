const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));

const MongoClient = require('mongodb').MongoClient;

var db;
MongoClient.connect('mongodb+srv://admin:1234@cluster0.mhl7op5.mongodb.net/?retryWrites=true&w=majority', function(에러, client) {
    //연결되면 할일
    if(에러) return console.log(에러)
    db = client.db('todoapp');  // todoapp이라는 database에 연결중요

    db.collection('post').insertOne( {이름 : 'John', 나이 : 20, _id : 100} , function(에러, 결과){
        console.log('저장완료');
    });

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
    response.sendFile(__dirname + '/index.html')
});

app.get('/write', function(request, response) {
    response.sendFile(__dirname + '/write.html')
});

// 어떤 사람이 /add 경로로 POST 요청을 하면...
// ?? 을 해주세요 ~ 
app.post('/add', function(request, response){
    response.send('전송완료');
    console.log(request.body.title);
    console.log(request.body.date);

    db.collection('post').insertOne( {제목 : request.body.title, 날짜 : request.body.date} , function(에러, 결과){
        console.log('(제목, 날짜) 저장완료');
    });

    // DB에 저장해주세요
})

// 어떤 사람이 /add 라는 경로로 post 요청을 하면,
// 데이터 2개 (날짜, 제목)을 보내주는데,
// 이때, 'post'라는 이름을 가진 collection에 두개 데이터를 저장하기

