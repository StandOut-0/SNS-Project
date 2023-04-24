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
module.exports= class User extends Sequelize.Model{

    //모델은 크게 static init메서드와 static associate 메서드로 나뉨
    //init 메서드에는 테이블설정, associate 메서드에는 다른모델과의 관계를 적는다.

    static init(sequelize){
        return super.init({

            //테이블 칼럼에 대한 설정
            //시퀄라이즈는 id를 기본키로 자동연결함으로 id칼럼은 적지않아도된다.
            //Mysql과 칼럼내용이 일치해야만 대응됨.
            name : {
                type : Sequelize.STRING(20),
                allowNull : false,
                unique : true
            },
            age : {
                type : Sequelize.INTEGER.UNSIGNED,
                allowNull : false
            },
            married : {
                type : Sequelize.BOOLEAN,
                allowNull : false
            },
            comment : {
                type : Sequelize.TEXT,
                allowNull : true
            },
            created_at : {
                type : Sequelize.DATE,
                allowNull : true,
                defaultValue : Sequelize.NOW
            }
        },{
            //테이블 자체에 대한 설정

            //static init 메서드의 매개변수와 연결되는 옵션
            //db.sequelize 객체를 넣어야 나중에 index.js에서 연결
            sequelize,

            //true일 경우 시퀄라이즈는 createdAt과 updated칼럼을 추가한다.
            timestamps : false,

            //시퀄라이즈는 기본적으로 테이블명과 칼럼명을 camel case로 만듬
            //이를 snake case로 바꾸는 옵션
            underscore : false,

            //모델의 이름을 설정, 노드 프로젝트에서 사용
            modelName : 'User',

            //실제 데이터베이스의 테이블이름, 기본적으로 복수형으로 만듦
            tableName : 'users',

            //true로 설정하면 deletedAt라는 칼럼이 생김
            //row를 삭제할때 완전지 지워지지않고 deletedAt에 지운시각이 기록
            paranoid : false,
            charset : 'utf-8',
            collate : 'utf8_general_ci',
        });
    }

    //시퀄라이즈는 join의 기능을 스스로하며 그러기위해서는 table의 관계를 알려야한다.
    static associate(db){
        db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id' });
    }

}