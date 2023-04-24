// var createError = require('http-errors');
const express = require('express');
const path = require('path');
// var cookieParser = require('cookie-parser');
// const session = require('express-session');

//.env파일의 환경변수들을 읽어와서 process.env객체로 만든다.
//코드에서 사용되는 중요한 정보를 소스코드에 하드코딩하지않고 외부파일에 저장한다.
//보안성과 유지보수를 용이하게 하기 위함
// const dotenv = require('dotenv');
const morgan = require('morgan');

//요청의 본문에 있는 데이터를 해석해 req.body 객체로 만들어주는 미들웨어
//보통 ajax 데이터를 처리하나 멀티파트 데이터를 처리하진 못한다.
// const bodyParser = require('body-parser');

//html, js 문법을 사용, pug의 html 문법 변화에 적응하기 힘든 사람에게 적합한 엔진
const nunjucks = require('nunjucks');

const { sequelize } = require('./models');

const indexRouter = require('./routes');
const usersRouter = require('./routes/users');
const commentsRouter = require('./routes/comments');

// dotenv.config();


//익스프레스 내부에 http module이 내장되어있어 서버역할을 함.
const app = express();

app.set('port', process.env.PORT || "3002");

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
app.set('view engine', 'html');


//nunjucks
//watch:true html파일이 변경될때까지 템플릿 엔진을 다시 렌더링
nunjucks.configure('views', {
    express:app,
    watch:true,
});

//sync 메서드를 사용해 서버 실행시 mysql과 연동
//true로 설정시 서버 실행마다 테이블을 재생성해 table을 잘못만든 경우에 true을 사용하면 좋다.
sequelize.sync({force:false})
    .then(
        () =>{
            console.log("데이터 연결 성공");
        }
    )
    .catch(
        (err) =>{
            console.error(err);
        }
    );

//app.use 미들웨어
//app.use() 모든요청에 실행됨
//next 다음 미들웨어로 넘어가는 함수.
// app.use(
//     (req, res, next) =>{
//       console.log("모든요청에서 실행됩니다.");
//       next();
//     }
// );

// app.use(bodyParser.raw());
// app.use(bodyParser.test());

//app.use 미들웨어 , 요청과응답의 중간

//dev외에도 combined, common, short, tiny
//개발환경에서는 dev, 배포환경에서는 combined를 사용한다.
app.use(morgan('dev'));

//static 미들웨어
//정적인 파일들을 제공하는 라우터 역할
//public 폴더안의 파일들을 사용할 수 있다.
app.use(express.static(path.join(__dirname, 'public')));

//json 형태의 데이터 전달방식
app.use(express.json());

//주소형식으로 데이터를 보내는 방식
//false 노드의 querystring 모듈을 사용해 쿼리 스트링을 해석
//true qs 모듈을 사용하여 쿼리 스트링을 해석,
//qs모듈은 npm패키지, querystring기능을 좀 더 확장한 모듈
app.use(express.urlencoded({ extended: false }));

// app.use(cookieParser());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status=404;
    next(error);
});

// error handler 에러처리 미들웨어
// 매개변수가 반드시 4개, 가장 아래에 위치하도록 함.
// err: 에러정보
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};

  // 직접연결하지않아도 express가 자동지정하나, 실무에서는 직접처리하는것이 좋다.
  res.status(err.status || 500); //http 상태코드 지정
  res.render('error');
});


//app.get('url',()) url+get 요청일 경우 실행됨
// app.get('/hello', (req, res) => {
//   res.send('Hello, Express');
// });

app.listen(app.get('port'), () =>{
  console.log(app.get('port'), '번 포트에서 대기중');
});

module.exports = app;