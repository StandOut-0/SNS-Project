'use strict';
//use strict, 엄격모드 활성화 제한적인 규칙들이 추가되어 오류를 미리 방지

// const fs = require('fs');
// const path = require('path');

//sequelize
//모델(객체,데이터)과 mysql테이블을 연결 시켜주는것.
//시퀄라이즈는 기본적으로 모델이름은 단수형, 테이블은 복수형으로 표현함.
const Sequelize = require('sequelize');

// const process = require('process');
// const basename = path.basename(__filename);

const User = require('./user');
const Comment = require('./comment');

//config.json의 development의 정보를 사용하여 실행한다.
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

//연결 객체를 재사용하기 위해 넣어놓는다.
const sequelize = new Sequelize(config.database, config.username, config.password, config);
db.sequelize = sequelize;
db.Sequelize = Sequelize;


//db라는 객체에 user와 comment 모델을 담는다.
//앞으로 db객체를 require하여 user와 comment 모델에 접근할 수 있다.
db.User = User;
db.Comment = Comment;

//각각의 모델의 static.init 메서드를 호출
//init가 실행되어 테이블이 모델로 연결됨
User.init(sequelize);
Comment.init(sequelize);

//associate
//다른 테이블과의 관계를 연결
User.associate(db);
Comment.associate(db);


// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js' &&
//       file.indexOf('.test.js') === -1
//     );
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });
//
// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

module.exports = db;