var oldNetworkType, language, webServer = require("./server/webServer"), roomServer = require("./server/room"),
  masterServer = require("./server/master"), chatServer = require("./server/chat"),
  liveServer = require("./server/live"), parser = require("./parser"), docData = require("./data/doc"),
  userData = require("./data/user"), pageData = require("./data/page"), classData = require("./data/class"),
  shapeData = require("./data/shape"), serverData = require("./data/server"), command = require("./command"),
  api = require("./api"), broadcast = require("./broadcast"), group = require("./group"),
  eventEmitter = require("./eventEmitter"), info = require("./info"), auth = require("./auth"),
  store = require("./store.js"), storage = require("./storage.js"), config = require("./config.js"),
  util = require("./util.js"), $ = require("./jquery"), device = require("./device"), is = require("./is"),
  deflatePoints = require("./function/deflatePoints"), toTimestamp = require("./function/toTimestamp"),
  userSpeak = require("./userSpeak"), oldNetConnected = !1, camelCaseObject = require("./function/camelCaseObject"),
  roomTip = function (e) {
    store.get("hasDefaultTip", !0) && info.tip(e)
  };

function closeWsConnection() {
  var e = $.Deferred(), t = 0;

  function r() {
    3 == t && e.resolve()
  }

  return masterServer.close().then(function () {
    t++, r()
  }), roomServer.close().then(function () {
    t++, r()
  }), chatServer.close().then(function () {
    t++, r()
  }), e
}

function createUserNumber() {
  var e = (new Date).getTime(), t = Math.pow(10, 3);
  return "" + Math.floor((e + Math.random()) * t)
}

function setData(e) {
  var t = e.partner;
  t ? ((t = camelCaseObject(t)).isLive = 1 === t.industryType, e.partner = t) : e.partner = {};
  var r = e.user;
  if (r.number = r.userNumber, r.type = r.userRole, r.name = r.userName, r.actualName = r.userName, r.avatar = r.userAvatar, r.status = 0, r.endType = config.END_TYPE_WEIXIN_XIAOCHENGXU, "0" == r.number) {
    var n = storage.get("bjy_user_number");
    n || (n = createUserNumber(), storage.set("bjy_user_number", n)), r.number = n
  }
  var o = e.class;
  o.speakState = is.oneToOne(o.type) || is.miniClass(o.type) ? config.SPEAK_STATE_FREE : config.SPEAK_STATE_LIMIT, util.is.boolean(e.exitOnConnectFail) || (e.exitOnConnectFail = !0), store.set(e), auth.isNameMobileNumber() && store.set("user.name", util.formatMobileNumber(r.name))
}

function clearUserData() {
  store.get("user");
  var e = store.get("presenterId");
  $.each(userData.all(), function (t, r) {
    userData.remove(r.id), r.id == e && store.set({presenterId: null, presenter: null})
  }), store.set({"class.userCount": userData.all().length, "class.hasMoreUser": !0})
}

function bindEvents() {
  var e, t, r = 0, n = !1, o = 0, a = !1, s = 0, i = 0, E = !1, u = !1, c = 0, _ = 0, m = function () {
    e && (clearTimeout(e), e = null)
  }, v = function (e) {
    n = !1, eventEmitter.trigger(eventEmitter.CLASSROOM_CONNECT_TIMEOUT), o++ < config.CLASSROOM_TRY_ENTER_COUNT ? setTimeout(function () {
      null, a || eventEmitter.trigger(eventEmitter.CLASSROOM_CONNECT_TRIGGER, {
        reconnect: s > 0,
        isClassSwitching: store.get("isClassSwitching")
      })
    }, config.SERVER_CONNECT_DELAY) : eventEmitter.trigger(eventEmitter.CLASSROOM_CONNECT_FAIL)
  };
  eventEmitter.on(eventEmitter.SERVER_INFO_FETCH_SUCCESS, function (t) {
    t.isPrevented ? masterServer.close() : (n = !1, !0, liveServer.init(), s || eventEmitter.trigger(eventEmitter.LINK_TYPE_INIT), wx.setNavigationBarTitle({title: store.get("class.title")}), masterServer.close().then(function () {
      console.log("roomServer init"), m(), !0, a = !1, roomServer.init(), e = setTimeout(function () {
        closeWsConnection().then(function () {
          !1, e = null, eventEmitter.trigger(eventEmitter.CLASSROOM_CONNECT_TIMEOUT), i++ < config.CLASSROOM_TRY_ENTER_COUNT ? e = setTimeout(function () {
            e = null, a || eventEmitter.trigger(eventEmitter.CLASSROOM_CONNECT_TRIGGER, {reconnect: s > 0})
          }, config.SERVER_CONNECT_DELAY) : eventEmitter.trigger(eventEmitter.CLASSROOM_CONNECT_FAIL)
        })
      }, config.CLASSROOM_CONNECT_TIMEOUT)
    }))
  }).one(eventEmitter.UPLINK_LINK_TYPE_CHANGE, function () {
    var e = store.get("user"), t = liveServer;
    e.linkType = config.LINK_TYPE_TCP, e.publishServer = t.getActiveUplinkServer(), e.publishIndex = 0, userData.add(e), eventEmitter.on(eventEmitter.SERVER_INFO_FETCH_SUCCESS, function () {
      userData.add(store.get("user"))
    });
    var r = store.get("teacher");
    r && userData.add(r)
  }).on(eventEmitter.ROOM_SERVER_LOGIN_SUCCESS, function () {
    var e = s > 0;
    a = !0, !1, s++, m(), store.set("offline", !1);
    eventEmitter.one(eventEmitter.USER_ACTIVE_RES, function () {
      e || (store.get("teacher") ? store.set("teacherIn", !0) : store.set("teacherIn", !1), userData.add(store.get("user")), eventEmitter.trigger(eventEmitter.VIEW_RENDER_TRIGGER)), eventEmitter.trigger(eventEmitter.CLASSROOM_CONNECT_SUCCESS, {
        reconnect: e,
        isClassSwitching: store.get("isClassSwitching")
      }), eventEmitter.trigger(eventEmitter.USER_STATE_REQ, {number: store.get("user").number})
    }).trigger(eventEmitter.USER_ACTIVE_REQ), store.get("noChat", !1) || eventEmitter.trigger(eventEmitter.CHAT_SERVER_CONNECT_TRIGGER)
  }).on(eventEmitter.ROOM_SERVER_OFFLINE, function () {
    console.log("room server offline"), !1, store.get("roomLoading") ? (store.set("offline", !0), roomServer.close(), a = !1, setTimeout(function () {
      a || (console.log("event CLASSROOM_CONNECT_TRIGGER trigger"), eventEmitter.trigger(eventEmitter.CLASSROOM_CONNECT_TRIGGER, {
        reconnect: s > 0,
        offline: !0
      }))
    }, config.SERVER_CONNECT_DELAY)) : console.log("room server can not reconnect for not loading")
  }).on(eventEmitter.CLASSROOM_CONNECT_TRIGGER, function (e, t) {
    if (console.log("in event CLASSROOM_CONNECT_TRIGGER", n), e.isPrevented || n) console.log("CLASSROOM_CONNECT_TRIGGER abort by masterServerConnecting"); else {
      if (m(), t.offline || t.reconnect && a) {
        store.get("user"), store.get("presenterId");
        clearUserData()
      }
      console.log("begin close all ws"), n = !0, closeWsConnection().then(function () {
        if (console.log("close all ws end"), !1, console.log("masterserver init"), t.isClassSwitching) {
          var e = store.get("parentData.token"), n = store.get("token");
          if (e) {
            store.set("parentData.token", n), store.set("token", e), store.get("class.id") === store.get("parentData.class.id") ? store.set("class", store.get("parentData.parentClass")) : store.set("class", store.get("parentData.class"));
            var o = store.get("parentData.user.group", config.NONE_GROUP_ID);
            store.set("parentData.user.group", store.get("user.group")), store.set("user.group", o);
            var a = store.get("parentData.user.type");
            store.set("parentData.user.type", store.get("user.type")), store.set("user.type", a), store.set({
              "user.prevVideoOn": !1,
              "user.prevAudioOn": !1
            }), auth.isWebRTC() ? masterServer.init() : eventEmitter.trigger(eventEmitter.SERVER_INFO_FETCH_SUCCESS)
          }
        } else masterServer.init();
        0 === r && eventEmitter.trigger(eventEmitter.CLASSROOM_CONNECT_START, t), r++
      })
    }
  }).on(eventEmitter.MASTER_SERVER_CONNECT_TIMEOUT, v).on(eventEmitter.MASTER_SERVER_CONNECT_FAIL, v).on(eventEmitter.ROOM_SERVER_LOGIN_OVERFLOW, m).on(eventEmitter.ROOM_SERVER_LOGIN_KICKED_OUT, function () {
    store.get("isClassSwitching") && info.tip(language.TIP_ROOM_SERVER_LOGIN_KICKED_OUT), m()
  }).one(eventEmitter.CLASSROOM_CONNECT_SUCCESS, function (e, t) {
    store.get("parentData") && !auth.isParentClass() && store.get("class.classSwitch") && eventEmitter.trigger(eventEmitter.CLASS_SWITCH)
  }).on(eventEmitter.CLASSROOM_CONNECT_TRIGGER, function (e, t) {
    t.isClassSwitching && userSpeak.stopSpeak()
  }).on(eventEmitter.CLASSROOM_CONNECT_SUCCESS, function (e, t) {
    store.set({
      "user.videoOn": null,
      "user.audioOn": null
    }), shapeData.init(), roomServer.getCachedBroadcast({key: "forbid_all_change"}), roomServer.getCachedBroadcast({key: "forbid_raise_hand_change"}), eventEmitter.trigger(eventEmitter.USER_MORE_REQ), eventEmitter.trigger(eventEmitter.CLASSROOM_CONNECT_END, t)
  }).on(eventEmitter.CLASSROOM_CONNECT_FAIL, function () {
    eventEmitter.trigger(eventEmitter.CLASSROOM_CONNECT_END, {
      reconnect: s > 0,
      isClassSwitching: store.get("isClassSwitching")
    }), store.get("exitOnConnectFail") && exports.dispose("connectFail")
  }).on(eventEmitter.CLASSROOM_CONNECT_START, function (e, t) {
    t.isClassSwitching && info.tip(language.CLASS_SWITCH_ROOM_SERVER_WAITING)
  }).on(eventEmitter.CLASSROOM_CONNECT_END, function (e, t) {
    r = o = i = _ = 0, t && t.isClassSwitching && (store.set("isClassSwitching", !1), eventEmitter.trigger(eventEmitter.DOC_ALL_REQ))
  }).on(eventEmitter.CHAT_SERVER_CONNECT_TRIGGER, function () {
    E || store.get("noChat") || (t && clearTimeout(t), c && chatServer.close(), chatServer.init(), E = !0, u = !1, t = setTimeout(function () {
      chatServer.close(), E = !1, t = null, _++ < config.CLASSROOM_TRY_ENTER_COUNT && (t = setTimeout(function () {
        a && !u && eventEmitter.trigger(eventEmitter.CHAT_SERVER_CONNECT_TRIGGER)
      }, config.SERVER_CONNECT_DELAY))
    }, config.CHAT_SERVER_CONNECT_TIMEOUT))
  }).on(eventEmitter.CHAT_SERVER_LOGIN_SUCCESS, function () {
    u = !0, E = !1, c++, _ = 0, t && (clearTimeout(t), t = null)
  }).on(eventEmitter.CHAT_SERVER_OFFLINE, function () {
    console.log("chat server offline"), store.get("roomLoading") ? (console.log("chat server reconnect"), u = !1, setTimeout(function () {
      u || eventEmitter.trigger(eventEmitter.CHAT_SERVER_CONNECT_TRIGGER)
    }, config.SERVER_CONNECT_DELAY)) : console.log("chat server can not reconnect for not loading")
  }).on(eventEmitter.CLASSROOM_EXIT_TRIGGER, function (e, t) {
    e.isPrevented || (eventEmitter.trigger(eventEmitter.CLASSROOM_EXIT_START, t), roomServer.logout(), closeWsConnection().then(function () {
      a = u = !1, (!t || !t.keepIn) && eventEmitter.trigger(eventEmitter.CLASSROOM_EXIT_END, t), store.get("keepEventOnExit") || eventEmitter.off(), exports.isInit = !1
    }))
  }).on(eventEmitter.LOGIN_CONFLICT, function (e, t) {
    exports.dispose("loginConflict")
  }).on(eventEmitter.VIDEO_RESOLUTION_CHANGE_TRIGGER, function (e, t) {
    roomServer.send({message_type: "video_resolution_change_trigger", width: t.width, height: t.height})
  }).on(eventEmitter.MESSAGE_SEND_FORBID_ALL_CHANGE_TRIGGER, function (e, t) {
    broadcast.send("forbid_all_change", {forbidAll: t.value}, {cache: !0})
  }).on(eventEmitter.SPEAK_APPLY_FORBID_ALL_CHANGE_TRIGGER, function (e, t) {
    broadcast.send("forbid_raise_hand_change", {forbid: t.value}, {cache: !0})
  }).on(eventEmitter.TRACE_LOG, function (e, t) {
    roomServer.trace(t)
  }).on(eventEmitter.USER_ACTIVE_REQ, function (e, t) {
    roomServer.send({message_type: "user_active_req"})
  }).on(eventEmitter.USER_ACTIVE_RES, function (e, t) {
    setTimeout(function () {
      var e = t.userList;
      e.length > 0 && (userData.add(e), $.each(e, function (e, t) {
        var r = t.type;
        auth.isTeacher(r) && store.set("class.hasTeacher", !0), auth.isAssistant(r) && store.set("class.hasAssistant", !0), t.canPlay = !userData.isAudioSpeex(t) || auth.isWebRTC();
        var n = {user: t, linkType: t.linkType};
        if (t.videoOn && (n.videoOn = !0), t.audioOn && (n.audioOn = !0), 1 == t.supportMuteStream && (n.supportMuteStream = !0), 1 == t.supportBlackStream && (n.supportBlackStream = !0), t.width && (n.width = t.width), t.height && (n.height = t.height), eventEmitter.trigger(eventEmitter.MEDIA_PUBLISH, n), t.mediaExt) {
          var o = t.mediaExt[0];
          (t = $.extend(!0, {}, t)).videoOn = o.videoOn, t.audioOn = !1, eventEmitter.trigger(eventEmitter.ASSIST_MEDIA_PUBLISH, {
            user: t,
            width: o.width,
            height: o.height,
            linkType: t.linkType,
            videoOn: o.videoOn,
            audioOn: o.audioOn,
            mediaId: o.id
          })
        }
      }))
    })
  }).on(eventEmitter.USER_IN, function (e, t) {
    var r = t.user;
    userData.add(r);
    var n = r.type;
    auth.isTeacher(n) && (store.set("teacherIn", !0), store.set("class.hasTeacher", !0), roomTip(language.TEACHER_IN)), auth.isAssistant(n) && store.set("class.hasAssistant", !0)
  }).on(eventEmitter.USER_OUT, function (e, t) {
    var r = t.user, n = r.type;
    userData.remove(r.id), auth.isTeacher(n) && (store.set("teacherIn", !1), roomTip(language.TEACHER_OUT), store.set("class.hasTeacher", !1)), userData.hasAssistant() || store.set("class.hasAssistant", !1)
  }).on(eventEmitter.USER_MORE_REQ, function (e, t) {
    store.get("class.hasMoreUser") && roomServer.send({
      message_type: "user_more_req",
      count: t && t.count || config.MORE_USER_COUNT
    })
  }).on(eventEmitter.USER_MORE_RES, function (e, t) {
    store.set("class.hasMoreUser", t.hasMore);
    var r = t.userList;
    r.length > 0 && userData.add(r)
  }).on(eventEmitter.MESSAGE_SEND, function (e, t) {
    if (auth.canSendMessage()) {
      var r = t.content;
      if ($.inArray(r, config.MESSAGE_DEBUG) < 0) {
        var n, o = store.get("user"), a = t.channel, s = "message_send";
        t.to && t.to !== config.MESSAGE_TO_ALL && (s = "message_whisper_send", n = userData.find(t.to));
        var i = {
          message_type: s,
          content: r,
          channel: a,
          to: t.to || config.MESSAGE_TO_ALL,
          from: {
            id: o.id,
            number: o.number,
            type: o.type,
            name: o.name,
            avatar: o.avatar,
            status: o.status,
            group: o.group,
            end_type: o.endType
          }
        };
        t.data && (i.data = t.data), n && (i.to_num = n.number, i.to_user = {
          id: n.id,
          number: n.number,
          type: n.type,
          name: n.name,
          avatar: n.avatar,
          status: n.status,
          end_type: n.endType
        }), chatServer.send(i), $.isFunction(t.callback) && eventEmitter.one(eventEmitter.MESSAGE_RECEIVE, function (e, t) {
          t.from.id == o.id && t.content === r && t.channel === a && t.callback()
        })
      }
    }
  }).on(eventEmitter.MESSAGE_RECEIVE, function (e, t) {
    userData.add(t.from)
  }).on(eventEmitter.MESSAGE_PULL_REQ, function (e, t) {
    var r = {message_type: "message_pull_req", next: util.toNumber(t.next, -1), count: t.count || 10};
    t.channel && (r.channel = t.channel), chatServer.send(r)
  }).on(eventEmitter.DOC_ALL_REQ, function (e, t) {
    roomServer.send({message_type: "doc_all_req"})
  }).on(eventEmitter.DOC_ALL_RES, function (e, t) {
    docData.clear(), docData.add(t.docList)
  }).on(eventEmitter.DOC_ADD_TRIGGER, function (e, t) {
    var r = t.doc;
    roomServer.send({
      message_type: "doc_add_trigger",
      doc: {
        id: r.id,
        ext: r.ext,
        name: r.name,
        number: r.number,
        ppt_url: r.pptUrl,
        page_list: r.pageList,
        page_info: r.pageInfo,
        extra: {visible: 0}
      }
    })
  }).on(eventEmitter.DOC_ADD, function (e, t) {
    docData.add(t.doc)
  }).on(eventEmitter.DOC_UPDATE_TRIGGER, function (e, t) {
    var r = {};
    $.each(t.extra, function (e, t) {
      r[e.replace(/([A-Z])/g, "_$1").toLowerCase()] = t
    }), roomServer.send({message_type: "doc_update_trigger", doc_id: t.docId, extra: r})
  }).on(eventEmitter.DOC_UPDATE, function (e, t) {
    docData.update(t.docId, camelCaseObject(t.extra))
  }).on(eventEmitter.DOC_REMOVE_TRIGGER, function (e, t) {
    roomServer.send({message_type: "doc_del_trigger", doc_id: t.docId})
  }).on(eventEmitter.DOC_REMOVE, function (e, t) {
    t.fromId === store.get("user.id") && eventEmitter.trigger(eventEmitter.PAGE_CHANGE_TRIGGER, {docId: "0", page: 0})
  }).on(eventEmitter.SHAPE_ALL_REQ, function (e, t) {
    roomServer.send({
      message_type: "shape_all_req",
      doc_id: t.docId,
      page: docData.getServerPage(t.docId, t.page),
      layer: t.layer
    })
  }).on(eventEmitter.SHAPE_ADD_TRIGGER, function (e, t) {
    var r = t.shape;
    r.points = deflatePoints(r), roomServer.send({
      message_type: "shape_add_trigger",
      doc_id: t.docId,
      page: docData.getServerPage(t.docId, t.page),
      layer: t.layer,
      shape: r
    })
  }).on(eventEmitter.SHAPE_ADD, function (e, t) {
    shapeData.add(t.docId, t.page, t.shape)
  }).on(eventEmitter.SHAPE_REMOVE_TRIGGER, function (e, t) {
    roomServer.send({
      message_type: "shape_del_trigger",
      doc_id: t.docId,
      page: docData.getServerPage(t.docId, t.page),
      layer: t.layer,
      shape_id: t.shapeId ? t.shapeId : ""
    })
  }).on(eventEmitter.SHAPE_REMOVE, function (e, t) {
    var r = t.docId, n = t.page, o = t.shapeId;
    "" === o ? shapeData.clear(r, n) : $.each(o.split(","), function (e, t) {
      t && shapeData.remove(r, n, t)
    })
  }).on(eventEmitter.SHAPE_UPDATE_TRIGGER, function (e, t) {
    var r = t.shapeList;
    $.each(r, function (e, t) {
      t.points = deflatePoints(t)
    }), roomServer.send({
      message_type: "shape_update_trigger",
      doc_id: t.docId,
      page: docData.getServerPage(t.docId, t.page),
      layer: t.layer,
      shape_list: r
    })
  }).on(eventEmitter.SHAPE_UPDATE, function (e, t) {
    shapeData.update(t.docId, t.page, t.shapeList)
  }).on(eventEmitter.PAGE_CHANGE_TRIGGER, function (e, t) {
    if (console.log("PAGE_CHANGE_TRIGGER"), auth.canPage()) {
      var r = t.docId, n = t.page, o = t.step || 0;
      if (auth.canServerPage() || t.toServer) {
        var a = {message_type: "page_change_trigger", doc_id: r, page: n, step: o};
        docData.isWhiteboardDoc(r) && (a.page = 0, a.page_id = docData.getIdByPage(r, n)), t.event && (a.event = t.event), roomServer.send(a)
      } else eventEmitter.trigger(eventEmitter.CLIENT_PAGE_CHANGE, {docId: r, page: n, step: o})
    }
  }).on(eventEmitter.CLASS_START_TRIGGER, function () {
    roomServer.send({message_type: "class_start_trigger"})
  }).on(eventEmitter.CLASS_START, function () {
    roomTip(language.CLASS_START), store.set("class.started", !0)
  }).on(eventEmitter.CLASS_END_TRIGGER, function () {
    roomServer.send({message_type: "class_end_trigger"})
  }).on(eventEmitter.CLASS_END, function () {
    store.set("class.started", !1), roomTip(language.CLASS_END)
  }).on(eventEmitter.KICK_OUT, function (e, t) {
    info.tip(language.KICK_OUT), setTimeout(function () {
      wx.navigateBack()
    }, config.TOAST_DURATION)
  }).on(eventEmitter.TEACHER_ADD, function () {
    store.set("teacher.in", !0)
  }).on(eventEmitter.TEACHER_REMOVE, function () {
    store.get("playback") || store.set({"teacher.in": !1, "teacher.videoOn": !1, "teacher.audioOn": !1})
  }).on(eventEmitter.SPEAK_APPLY_REQ_TRIGGER, function () {
    var e = store.get("user");
    roomServer.send({
      message_type: "speak_apply_req",
      from: {
        id: e.id,
        number: e.number,
        type: e.type,
        name: e.name,
        avatar: e.avatar,
        status: e.status,
        end_type: e.endType
      }
    })
  }).on(eventEmitter.SPEAK_APPLY_RES_TRIGGER, function (e, t) {
    var r = t.user;
    roomServer.send({
      message_type: "speak_apply_res",
      speak_state: t.speakState,
      user: {
        id: r.id,
        number: r.number,
        type: r.type,
        name: r.name,
        avatar: r.avatar,
        status: r.status,
        end_type: r.endType
      }
    })
  }).on(eventEmitter.MEDIA_PUBLISH_TRIGGER, function (e, t) {
    roomServer.publishMedia(t)
  }).on(eventEmitter.PRESENTER_CHANGE_TRIGGER, function (e, t) {
    auth.canChangePresenter() && roomServer.send({
      message_type: "presenter_change_trigger",
      presenter_id: t.presenterId
    })
  }).on(eventEmitter.ASSIST_MEDIA_PUBLISH_TRIGGER, function (e, t) {
    roomServer.publishAssistMedia(t)
  }).on(eventEmitter.MEDIA_REPUBLISH_TRIGGER, function (e, t) {
    roomServer.republishMedia(t)
  }).on(eventEmitter.ASSIST_MEDIA_REPUBLISH_TRIGGER, function (e, t) {
    roomServer.republishAssistMedia(t)
  }).on(eventEmitter.MEDIA_REMOTE_CONTROL_TRIGGER, function (e, t) {
    var r = t.user;
    roomServer.send({
      message_type: "media_remote_control_trigger",
      video_on: t.videoOn,
      audio_on: t.audioOn,
      speak_state: t.speakState,
      user: {
        id: r.id,
        number: r.number,
        type: r.type,
        name: r.name,
        avatar: r.avatar,
        status: r.status,
        end_type: r.endType
      }
    })
  }).on(eventEmitter.USER_SEARCH_REQ, function (e, t) {
    roomServer.send({message_type: "user_search_req", field: t.field, query: t.query})
  }).on(eventEmitter.NOTICE_REQ, function (e, t) {
    roomServer.send({message_type: "notice_req", group: store.get("user.group", 0)})
  }).on(eventEmitter.NOTICE_CHANGE_TRIGGER, function (e, t) {
    roomServer.send({message_type: "notice_change_trigger", content: t.content, link: t.link})
  }).on(eventEmitter.STICKY_NOTICE_REQ, function (e, t) {
    roomServer.send({message_type: "notice_req", is_sticky: !0})
  }).on(eventEmitter.USER_STATE_REQ, function (e, t) {
    roomServer.send({message_type: "user_state_req", user_number: t.number})
  }).on(eventEmitter.USER_STATE_RES, function (e, t) {
    var r = store.get("user"), n = t.userState, o = !1;
    r.number === t.userNumber && (o = !0, store.set("userState", $.extend({}, store.get("userState"), n)));
    var a = n.forbidSendMessage;
    a && a.duration > 0 && eventEmitter.trigger(eventEmitter.MESSAGE_SEND_FORBID, {
      from: userData.findByNumber(a.from.number),
      to: userData.findByNumber(t.userNumber),
      forbidSelf: o,
      duration: a.duration
    })
  }).on(eventEmitter.MESSAGE_SEND_FORBID_TRIGGER, function (e, t) {
    var r = store.get("user"), n = t.to;
    roomServer.send({
      message_type: "message_send_forbid_trigger",
      from: {id: r.id, number: r.number, type: r.type, name: r.name, avatar: r.avatar, end_type: r.endType},
      to: {id: n.id, number: n.number, type: n.type, name: n.name, avatar: n.avatar, end_type: n.endType},
      duration: t.duration
    })
  }).on(eventEmitter.MESSAGE_SEND_FORBID, function (e, t) {
    var r = t.from, n = t.to, o = t.duration;
    userData.add([r, n]), auth.isSelf(n.id) && (store.get("userState").forbidSendMessage = {from: r, duration: o})
  }).on(eventEmitter.MESSAGE_SEND_FORBID_ALL_CHANGE, function (e, t) {
    var r = "userState.forbidSendMessage.duration";
    store.get(r) > 1 || auth.canForbidAllUserSendMessage() || store.set(r, t.forbidAll ? 1 : 0)
  }).on(eventEmitter.MY_GIFT_REQ, function (e, t) {
    roomServer.send({message_type: "my_gift_req"})
  }).on(eventEmitter.GIFT_SEND, function (e, t) {
    var r = store.get("user"), n = t.to, o = t.gift;
    roomServer.send({
      message_type: "gift_send",
      from: {
        id: r.id,
        number: r.number,
        type: r.type,
        name: r.name,
        avatar: r.avatar,
        status: r.status,
        end_type: r.endType
      },
      to: {
        id: n.id,
        number: n.number,
        type: n.type,
        name: n.name,
        avatar: n.avatar,
        status: n.status,
        end_type: n.endType
      },
      gift: {type: o.type, amount: o.amount}
    })
  }).on(eventEmitter.CALL_CUSTOM_SERVICE_TRIGGER, function (e, t) {
    roomServer.send({message_type: "call_service_req", number: t.number, user_number: t.userNumber})
  }).on(eventEmitter.SURVEY_PREV_REQ, function (e, t) {
    var r = store.get("user");
    roomServer.send({message_type: "survey_prev_req", number: r.number})
  }).on(eventEmitter.SURVEY_QUESTION_SEND, function (e, t) {
    var r = util.copy(t, !0);
    $.each(r.optionList, function (e, t) {
      t.is_answer = t.isAnswer, delete t.isAnswer
    }), roomServer.send({
      message_type: "survey_send",
      survey_list: {order: r.order, question: r.question, answer_count: r.answerCount, option_list: r.optionList}
    })
  }).on(eventEmitter.SURVEY_ANSWER_SEND, function (e, t) {
    var r = store.get("user");
    roomServer.send({
      message_type: "survey_answer_send",
      survey_list: {order: t.order, answer: t.answer, result: t.result, username: r.name, number: r.number}
    })
  }).on(eventEmitter.USER_UPDATE_RES, function (e, t) {
    userData.update(t.user)
  }).on(eventEmitter.COMMAND_LOTTERY_STATUS_REQ, function () {
    roomServer.send({message_type: "command_lottery_status_req"})
  }).on(eventEmitter.COMMAND_LOTTERY_HIT_REQ, function () {
    roomServer.send({message_type: "command_lottery_hit_req", number: store.get("user.number")})
  }).on(eventEmitter.STUDENT_LIST_REQ, function () {
    roomServer.send({message_type: "student_list_req"})
  }).on(eventEmitter.BLOCK_TASK_CREATE, function (e, t) {
    roomServer.send({message_type: "block_task_create", room_no: classData.getClassId(), student: t.studentNumber})
  }).on(eventEmitter.ROLL_CALL_TRIGGER, function (e, t) {
    roomServer.send({message_type: "roll_call_trigger", duration: util.toNumber(t.duration)})
  }).on(eventEmitter.ROLL_CALL_RES, function () {
    roomServer.send({message_type: "roll_call_res"})
  }).on(eventEmitter.ROLL_CALL_FINISH, function () {
    roomServer.send({message_type: "roll_call_finish"})
  }).on(eventEmitter.SPEAK_INVITE_REQ_TRIGGER, function (e, t) {
    roomServer.send({message_type: "speak_invite_req", to: t.to, invite: t.invite})
  }).on(eventEmitter.SPEAK_INVITE_RES_TRIGGER, function (e, t) {
    t.force || roomServer.send({message_type: "speak_invite_res", confirm: t.confirm})
  }).on(eventEmitter.CLASS_SWITCH, function (e, t) {
    if (!t || !t.targetClassId || t.targetClassId === store.get("subRoomId")) {
      if (!store.get("parentData")) return;
      s = 0, store.set("webrtcMixUser.videoOn", !1), store.set("webrtcMixUser.audioOn", !1), store.set("isClassSwitching", !0), setTimeout(function () {
        eventEmitter.trigger(eventEmitter.CLASSROOM_CONNECT_TRIGGER, {reconnect: !0, isClassSwitching: !0})
      }, 1e3 * Math.floor(2 * Math.random() + 2))
    }
  }), store.get("playback") || eventEmitter.on(eventEmitter.USER_ADD, function () {
    store.increase("class.userCount")
  }).on(eventEmitter.USER_REMOVE, function () {
    store.decrease("class.userCount", 1, 1)
  });
  var g = function (e, t) {
    eventEmitter.trigger(eventEmitter.MAX_PAGE_CHANGE, {page: e, step: t})
  };
  if (auth.canServerPage()) {
    var d = function () {
      g(docData.getDocumentCount())
    };
    eventEmitter.on(eventEmitter.DOC_ADD, d).on(eventEmitter.DOC_REMOVE, d).on(eventEmitter.DOC_ALL_RES, d)
  } else eventEmitter.on(eventEmitter.SERVER_PAGE_CHANGE, function (e, t) {
    g(docData.getSimplePage(t.docId, t.page).page, t.step)
  });
  var S = auth.canPaint(), l = auth.canPage();
  eventEmitter.on(eventEmitter.MEDIA_PUBLISH, function (e, t) {
    S !== auth.canPaint() && (S = !S, eventEmitter.trigger(eventEmitter.PAINT_AUTH_CHANGE, {canPaint: S})), l !== auth.canPage() && (l = !l, eventEmitter.trigger(eventEmitter.PAGE_AUTH_CHANGE, {canPage: l}))
  })
}

function resetData() {
  clearUserData(), store.clear(), oldNetConnected = !1, oldNetworkType = ""
}

function onNetworkStatusChange(e) {
  var t = e.isConnected, r = e.networkType;
  console.log("network status change, 参数:"), console.log(e), store.set("netConnected", t), t || t == oldNetConnected ? (console.log("old value ->" + oldNetConnected), !oldNetConnected && t && (console.log("trigger reconnect on network status change"), eventEmitter.trigger(eventEmitter.NETWORK_RECONNECT), eventEmitter.trigger(eventEmitter.CLASSROOM_CONNECT_TRIGGER, {reconnect: !0})), oldNetworkType != r && eventEmitter.trigger(eventEmitter.CLASSROOM_CONNECT_TRIGGER, {reconnect: !0}), "wifi" != r && oldNetworkType != r && info.alert(language.NO_WIFI)) : info.alert(language.NO_NETWORK), oldNetworkType = r, oldNetConnected = t
}

function initNetStatus() {
  getNetStatus(), wx.onNetworkStatusChange(function (e, t) {
    onNetworkStatusChange(e, t)
  })
}

function getNetStatus() {
  wx.getNetworkType({
    success: function (e) {
      var t = e.networkType;
      oldNetConnected = "none" != t, oldNetworkType = t
    }
  })
}

function handleParentClass(e) {
  if (e.parentRoomEnterInfo) {
    var t = e.parentRoomEnterInfo, r = t.classData, n = t.userData, o = null;
    r.id = r.roomId, r.speakState = config.SPEAK_STATE_LIMIT, n.avatar = n.userAvatar, n.number = n.userNumber, n.name = n.userName, n.type = n.userRole, n.group = n.groupId, e.parentId = r.roomId, e.subRoomId = e.class.roomId, o = {
      user: n,
      class: r,
      token: n.token
    }, t.enterUrl ? o.enterUrl = t.enterUrl : o.enterUrl = null, e.parentData = o
  }
  o && (formatClass(o.class), o.parentClass = util.copy(o.class), o.class = util.copy(e.class))
}

function formatClass(e) {
  e.id = "" + e.id, e.hasMoreUser = !0, e.startTime = toTimestamp(e.startTime, 0), e.endTime = toTimestamp(e.endTime, 0), e.mediaType = util.toNumber(e.mediaType, config.MEDIA_TYPE_VIDEO), e.playBuffer = util.toNumber(e.playBuffer, 0), e.speakState = util.toNumber(e.speakState, config.SPEAK_STATE_FREE), e.liveAudioCodec = util.toNumber(e.liveAudioCodec, config.AUDIO_CODEC_AAC), e.recordSignal = util.toNumber(e.recordSignal, 0)
}

exports.dispose = function (e) {
  eventEmitter.trigger(eventEmitter.CLASSROOM_EXIT_TRIGGER, {type: e})
}, exports.isInit = !1, wx.onAppShow(e => {
  exports.isInit && roomServer.socket && !roomServer.socket.isOpen() && setTimeout(function () {
    console.log("CLASSROOM_CONNECT_TRIGGER on app show"), eventEmitter.trigger(eventEmitter.CLASSROOM_CONNECT_TRIGGER, {reconnect: !0})
  }, 100)
}), exports.exit = function () {
  eventEmitter.trigger(eventEmitter.CLASSROOM_EXIT_TRIGGER)
}, exports.init = function (e) {
  function t() {
    resetData(), e.env && store.set("env", "_" + e.env.toUpperCase()), wx.setKeepScreenOn({
      keepScreenOn: !0,
      success: function () {
      }
    }), store.set("noChat", e.noChat), store.set("hasDefaultTip", e.hasDefaultTip), store.set("apiOrigin", e.apiOrigin || config["API_ORIGIN" + store.get("env", "")]), initNetStatus(), webServer.getPartnerInfo({
      data: e, onsuccess: function (t) {
        var r = camelCaseObject(t.data.data);
        r.partner = r.partnerConfig, r.class = r.classData, r.class.id = r.classData.roomId, r.class.type = +r.classData.type, r.user = r.userData, r.user.userName = decodeURIComponent(r.userData.userName), r.user.group = +(e.user && e.user.group || r.userData.groupId), delete r.partnerConfig, delete r.classData, delete r.userData, handleParentClass(r), setData(r), store.set("isLive", 1 == +r.partner.industryType), auth.isWebRTC() && store.set("webrtcMixUser", {
          id: "webrtcMixUser",
          type: 2,
          canPlay: !0,
          number: (new Date).getTime(),
          name: "webrtcMixUser",
          videoOn: !1,
          audioOn: !1,
          avatar: "https://test-img.baijiayun.com/0bjcloud/live/avatar/v2/teacherv3.png"
        }), language = require("./language/main")(), console.log("server data"), console.log(r), parser.init(), serverData.init(), classData.init(), docData.init(), pageData.init(), shapeData.init(), command.init(), broadcast.init(), api.init(), group.init(), userSpeak.init(), bindEvents(), store.set("sysInfo", wx.getSystemInfoSync()), console.log("bjy interface_fetch_success"), eventEmitter.trigger(eventEmitter.INTERFACE_FETCH_SUCCESS), eventEmitter.trigger(eventEmitter.CLASSROOM_CONNECT_TRIGGER, {reconnect: !1}), exports.isInit = !0
      }, onfail: function (e) {
        console.log("class info request fail", e);
        var t = e.data;
        eventEmitter.has(eventEmitter.INTERFACE_FETCH_FAIL) ? (eventEmitter.trigger(eventEmitter.INTERFACE_FETCH_FAIL, {msg: t.msg}), wx.showToast({
          title: t.msg,
          icon: "success",
          duration: 2e3
        })) : info.alert(t.msg), setTimeout(function () {
          wx.navigateBack()
        }, 5e3)
      }
    })
  }

  exports.isInit ? setTimeout(() => {
    closeWsConnection().then(t)
  }, 500) : closeWsConnection().then(t)
}, exports.api = api, exports.broadcast = broadcast, exports.socket = require("./server/WebSocket.js"), exports.info = info, exports.store = store, exports.command = command, exports.camelCaseObect = camelCaseObject, exports.eventEmitter = eventEmitter, exports.auth = auth, exports.config = config, exports.device = device, exports.data = {
  doc: docData,
  user: userData,
  page: pageData,
  class: classData,
  shape: shapeData,
  server: serverData
}, exports.server = {
  master: masterServer,
  room: roomServer,
  chat: chatServer,
  web: webServer
}, exports.checkQuestionnaireAndTurn = function (e) {
  var t, r = $.Deferred();
  return t = e, webServer.checkQuestionnaire({
    roomId: t.roomId,
    token: t.token,
    uuid: t.uuid || storage.get("uuid") || "",
    onsuccess: function (e) {
      r.resolve(e)
    },
    onfail: function () {
      r.resolve(!1)
    }
  }), r
};
