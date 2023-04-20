var express = require('express');
const path = require("path");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //render, 화면에 출력하다.
  // res.render('index', { title: 'Standout' });

  //__dirname 현재 파일의 절대 경로를 확인
  res.sendFile(path.join(__dirname, '/hello.html'));
});

module.exports = router;
