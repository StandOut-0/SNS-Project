const Sequelize = require('sequelize');

/*
MySQL과 시퀄라이즈 비교
VARCHAR(100)   <->   STRING(100)
INT            <->   INTEGER
TINYINT        <->   BOOLEAN
DATETIME       <->   DATE
INT UNSIGNED   <->   INTEGER.UNSIGNED
NOT NULL       <->   allowNull:false
UNIQUE         <->   unique:true
DEFAULT now()  <->   defaultValue: Sequelize.NOW
*/

//User를 정의 후 exports해 다른파일에서 사용할 수 있도록 한다.
module.exports = class Comment extends Sequelize.Model {

  //모델은 크게 static init메서드와 static associate 메서드로 나뉨
  //init 메서드에는 테이블설정, associate 메서드에는 다른모델과의 관계를 적는다.

  static init(sequelize) {
    return super.init({
      comment: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
    }, {
      sequelize,
      timestamps: false,
      modelName: 'Comment',
      tableName: 'comments',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  //시퀄라이즈는 join의 기능을 스스로하며 그러기위해서는 table의 관계를 알려야한다.
  static associate(db) {
    db.Comment.belongsTo(db.User, { foreignKey: 'commenter', targetKey: 'id' });
  }
};

