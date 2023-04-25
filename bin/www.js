#!/usr/bin/env node

/** node.js서버를 만들기 위한 모듈 */
var app = require('../app');

/** 디버깅을 위한 모듈 */
var debug = require('debug')('snspjt:server');

/** http서버를 만들기 위한 모듈*/
var http = require('http');





/** 포트정규화, 기본값으로 3000번 포트사용
 * app.set 메서드를 사용해 express 애플리케이션에서 포트번호를 참조할때 app.get('port')로 가져올 수 있도록 함*/
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);





/** http 모듈을 사용해 createServer()메소드를 호출해 서버생성
 * 서버는 listen()메서드를 사용하여 클라이언트 요청을 대기하게된다.*/
var server = http.createServer(app);

/** 서버가 지정된 포트로 들어오는 연결요청을 수신하도록함*/
server.listen(port);

/** 서버가 에러를 만났을때 실행되는 이벤트 리스너*/
server.on('error', onError);

/** 서버가 연결수신/실행중일때 실행되는 이벤트 리스너*/
server.on('listening', onListening);




/** normalizePort 메소드 */
/** 정규화 함수, 인자로 받은 val값을 파싱해 포트번호로 변환
 * 보통 환경변수를 통해 설정된 포트번호를 사용할때 지정된 값이 문자열이거나 잘못된 값일 수 있기때문에
 * 아래절차를 거쳐 보다 안전하게 서버를 구동할 수 있도록 함.*/
function normalizePort(val) {
  var port = parseInt(val, 10);

  /** nan이면 해당값 반환*/
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  /** 포트번호가 양수이면 해당값 반환*/
  if (port >= 0) {
    // port number
    return port;
  }
  /** 외의 경우 false를 반환*/
  return false;
}




/** 에러메소드 */
function onError(error) {
  /** syscall속성이 listen이 아니면 예외발생*/
  if (error.syscall !== 'listen') {
    throw error;
  }
  /** listen일경우*/
  /** port또는 pipe를 bind 변수에 항당*/
  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  /** error.code 속성을 사용하여 특정 에러유형을 처리하고
   * 사용자 친화적인 메세지를 출력한다.
   * EACCES: 권한부족
   * EADDRINUSE: 포트나 파이트가 이미 사용중*/
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}





/** 서버가 연결된 후에 호출되는 함수*/
function onListening() {
  /** 현재의 서버 주소를 가져옴*/
  var addr = server.address();

  /** type이 string인경우 서버가 유닉스 도메인 소켓에 바인드 되어있는것임으로 파이프와 해당주소를 출력
   * 그렇지않은경우 서버가 ip주소와 포트번호에 바인드되어있는 것으로 port와 해당포트 번호를 출력*/
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
