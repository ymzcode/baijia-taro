var bjy = require('./sdk/bjy.js');
var eventEmitter = bjy.eventEmitter;

function init(str) {
  bjy.init({
    env: 'test',
    apiOrigin: "https://wangrongchen.at.baijiayun.com/",
    sign: "b38c922461439b7f6617bf9f8e755aa6",
    hasDefaultTip: true,
    class: {
      id: 19050693722004,
      name: '123',
      startTime: 1517969460000,
      endTime: 1833502260000
    },
    user: {
      number: new Date().getTime(),
      avatar: '',
      name: '微信demo',
      type: 0
    }
  });
  // 等待服务器连接完成后监听事件回调
  eventEmitter
    .on(
      eventEmitter.ROOM_SERVER_LOGIN_SUCCESS,
      function () {
        // 监听打开弹窗事件
        bjy.broadcast.messageTypes['custom_webpage'] = function (fromId, data, fromCache) {
          if (data.url) {
            console.log('打开弹窗：' + data.url);
          } else {
            console.log('关闭弹窗');
          }
        }

        bjy.broadcast.messageTypes['custom_webpage'] = function (fromId, data, fromCache) {
          if (data.url) {
            console.log('打开弹窗：' + data.url);
          } else {
            console.log('关闭弹窗');
          }
        }
        // 获取打开弹窗缓存
        bjy.broadcast.get('custom_page');
        bjy.api.init();
        // 接收自定义广播信令
        bjy.api.onReceiveBroadcast('student_open_time', function (fromId, data, cache) {
          console.log(data);
        })
        bjy.api.getCachedBroadcast('student_open_time');
      })
}
module.exports.init = init;
