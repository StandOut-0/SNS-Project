const express = require('express');
const path = require("path");

const User = require('../models/user');
const router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  //render, 화면에 출력하다.
  // res.render('index', { title: 'Standout' });

  //__dirname 현재 파일의 절대 경로를 확인
  // res.sendFile(path.join(__dirname, '/hello.html'));

  try {
    const users = await User.findAll();
    res.render('sequelize', { users });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
