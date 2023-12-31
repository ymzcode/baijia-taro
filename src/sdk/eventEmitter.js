var util = require("./util"), logger = require("./logger"), guid = 0, CHAR_BLANK = "";

function parseType(e, _) {
  var t = {name: e, space: ""};
  if (_) {
    var r = indexOf$1(e, ".");
    r >= 0 && (t.name = slice(e, 0, r), t.space = slice(e, r + 1))
  }
  return t
}

function indexOf$1(e, _) {
  return e.indexOf(_)
}

var execute = function (e, _, t) {
  if (util.is.func(e)) return util.is.array(t) ? e.apply(_, t) : e.call(_, t)
};

function slice(e, _, t) {
  return util.is.number(t) ? e.slice(_, t) : e.slice(_)
}

var Emitter = function () {
  function e(_) {
    util.classCallCheck(this, e), this.namespace = _, this.listeners = {}
  }

  return e.prototype.fire = function (e, _, t) {
    var r = this.namespace, s = this.listeners, E = parseType(e, r), o = E.name, p = E.space, R = !0, i = s[o];
    if (i) {
      for (var a, n, S, T = util.is.array(_) ? _[0] : _, c = Event.is(T), A = guid++, x = -1; n = i[++x];) if (n.id = A, !p || !n.space || p === n.space) {
        if (S = execute(n.func, util.is.isDef(t) ? t : n.context, _), n.count > 0 ? n.count++ : n.count = 1, n.count === n.max && i.splice(x, 1), c && (!1 === S ? T.prevent().stop() : T.isStoped && (S = !1)), !1 === S) return !1;
        if (x >= 0 && n !== i[x]) {
          for (a = x; n = i[x];) n.id !== A && (a = x), x--;
          x = a - 1
        }
      }
      i.length || delete s[o]
    }
    return R
  }, e.prototype.has = function (e, _) {
    var t = this.namespace, r = this.listeners, s = parseType(e, t), E = s.name, o = s.space, p = !0, R = function (e) {
      return util.array.each(e, function (e, t) {
        if (!(o && o !== e.space || _ && _ !== e.func)) return p = !1
      }), p
    };
    if (E) {
      var i = r[E];
      i && R(i)
    } else o && util.each$1(r, R);
    return !p
  }, e
}();

function on(e) {
  return function (_, t) {
    var r = this.namespace, s = this.listeners, E = function (_, t) {
      if (util.is.func(_) && (_ = {func: _}), util.is.object(_) && util.is.func(_.func)) {
        e && util.extend(_, e);
        var E = parseType(t, r), o = E.name, p = E.space;
        _.space = p, util.push(s[o] || (s[o] = []), _)
      }
    };
    util.is.object(_) ? util.each$1(_, E) : util.is.string(_) && E(t, _)
  }
}

util.extend(Emitter.prototype, {
  on: on(), once: on({max: 1}), off: function (e, _) {
    if (null == e) this.listeners = {}; else {
      var t = parseType(e, this.namespace), r = t.name, s = t.space, E = function (e, t) {
        each(e, function (t, r) {
          s && s !== t.space || _ && _ !== t.func || e.splice(r, 1)
        }, TRUE), e.length || delete o[t]
      }, o = this.listeners;
      if (r) {
        var p = o[r];
        p && E(p, r)
      } else s && util.each$1(o, E)
    }
  }
});
var Event = function () {
  function e(_) {
    util.classCallCheck(this, e), _.type ? (this.type = _.type, this.originalEvent = _) : this.type = _
  }

  return e.prototype.prevent = function () {
    if (!this.isPrevented) {
      var e = this.originalEvent;
      e && (util.is.func(e.prevent) ? e.prevent() : util.is.func(e.preventDefault) && e.preventDefault()), this.isPrevented = !0
    }
    return this
  }, e.prototype.stop = function () {
    if (!this.isStoped) {
      var e = this.originalEvent;
      e && (util.is.func(e.stop) ? e.stop() : util.is.func(e.stopPropagation) && e.stopPropagation()), this.isStoped = !0
    }
    return this
  }, e
}();
Event.is = function (e) {
  return e instanceof Event
};
var emitterInstance = new Emitter(!0);
module.exports.trigger = function (e, _) {
  var t = e;
  util.is.string(e) && (t = new Event(e));
  t.target || (t.target = this);
  var r = [t];
  return util.is.object(_) && util.push(r, _), emitterInstance.fire(t.type, r, this)
}, module.exports.on = function (e, _) {
  return e ? emitterInstance.on(e, _) : logger.warn("eventEmitter.on(name) name is undefined"), module.exports
}, module.exports.one = function (e, _) {
  return e ? emitterInstance.once(e, _) : logger.warn("eventEmitter.one(name) name is undefined"), exports
}, module.exports.off = function (e, _) {
  return emitterInstance.off(e, _), exports
}, module.exports.has = function (e) {
  return emitterInstance.has(e)
}, module.exports.emit = function (e, _) {
  var t = new Event(e);
  return _ ? emitterInstance.fire(t, _) : emitterInstance.fire(t), t
}, exports.CLASSROOM_CONNECT_TRIGGER = "classroom_connect_trigger", exports.NETWORK_RECONNECT = "network_reconnect", exports.CLASSROOM_CONNECT_TIMEOUT = "classroom_connect_timeout", exports.CLASSROOM_CONNECT_SUCCESS = "classroom_connect_success", exports.CLASSROOM_CONNECT_FAIL = "classroom_connect_fail", exports.CLASSROOM_CONNECT_START = "classroom_connect_start", exports.CLASSROOM_CONNECT_END = "classroom_connect_end", exports.CLASSROOM_CONNECT_DEBUG = "classroom_connect_debug", exports.CLASSROOM_EXIT_TRIGGER = "classroom_exit_trigger", exports.CLASSROOM_ENTER_TRIGGER = "classroom_enter_trigger", exports.CLASSROOM_EXIT_START = "classroom_exit_start", exports.CLASSROOM_EXIT_END = "classroom_exit_end", exports.INTERFACE_FETCH_SUCCESS = "interface_fetch_success", exports.INTERFACE_FETCH_FAIL = "interface_fetch_fail", exports.ROOM_SERVER_OFFLINE = "room_server_offline", exports.CHAT_SERVER_OFFLINE = "chat_server_offline", exports.LINK_TYPE_INIT = "link_type_init", exports.WEBSOCKET_SEND = "websocket_send", exports.WEBSOCKET_RECEIVE = "websocket_receive", exports.WEBSOCKET_CLOSE = "websocket_close", exports.MASTER_SERVER_CONNECT_SUCCESS = "master_server_connect_success", exports.MASTER_SERVER_CONNECT_FAIL = "master_server_connect_fail", exports.MASTER_SERVER_CONNECT_TIMEOUT = "master_server_connect_timeout", exports.CHAT_SERVER_CONNECT_TRIGGER = "chat_server_connect_trigger", exports.CHAT_SERVER_CONNECT_SUCCESS = "chat_server_connect_success", exports.CHAT_SERVER_CONNECT_FAIL = "chat_server_connect_fail", exports.CHAT_SERVER_LOGIN_SUCCESS = "chat_server_login_success", exports.CHAT_SERVER_LOGIN_FAIL = "chat_server_login_fail", exports.ROOM_SERVER_CONNECT_SUCCESS = "room_server_connect_success", exports.ROOM_SERVER_CONNECT_FAIL = "room_server_connect_fail", exports.ROOM_SERVER_LOGIN_SUCCESS = "room_server_login_success", exports.ROOM_SERVER_LOGIN_FAIL = "room_server_login_fail", exports.ROOM_SERVER_LOGIN_OVERFLOW = "room_server_login_overflow", exports.ROOM_SERVER_LOGIN_KICKED_OUT = "room_server_login_kicked_out", exports.LOGIN_CONFLICT = "login_conflict", exports.SERVER_INFO_FETCH_SUCCESS = "server_info_fetch_success", exports.SERVER_INFO_FETCH_FAIL = "server_info_fetch_fail", exports.CLASS_START = "class_start", exports.CLASS_END = "class_end", exports.UPDATE_SPEAK_STATE = "update_speak_state", exports.CLASS_START_TRIGGER = "class_start_trigger", exports.CLASS_END_TRIGGER = "class_end_trigger", exports.USER_SEARCH_REQ = "user_search_req", exports.USER_SEARCH_RES = "user_search_res", exports.USER_ACTIVE_REQ = "user_active_req", exports.USER_ACTIVE_RES = "user_active_res", exports.USER_ADD = "user_add", exports.USER_REMOVE = "user_remove", exports.USER_UPDATE = "user_update", exports.TEACHER_ADD = "teacher_add", exports.TEACHER_REMOVE = "teacher_remove", exports.TEACHER_UPDATE = "teacher_update", exports.ASSISTANT_ADD = "assistant_add", exports.ASSISTANT_REMOVE = "assistant_remove", exports.ASSISTANT_UPDATE = "assistant_update", exports.STUDENT_ADD = "student_add", exports.STUDENT_REMOVE = "student_remove", exports.STUDENT_UPDATE = "student_update", exports.GUEST_ADD = "guest_add", exports.GUEST_REMOVE = "guest_remove", exports.GUEST_UPDATE = "guest_update", exports.USER_IN = "user_in", exports.USER_OUT = "user_out", exports.USER_MORE_REQ = "user_more_req", exports.USER_MORE_RES = "user_more_res", exports.DOC_ALL_REQ = "doc_all_req", exports.DOC_ALL_RES = "doc_all_res", exports.DOC_ATTACH_REQ = "doc_attach_req", exports.DOC_ATTACH_RES = "doc_attach_res", exports.DOC_DETACH_REQ = "doc_detach_req", exports.DOC_DETACH_RES = "doc_detach_res", exports.DOC_LIBRARY_LIST_REQ = "doc_library_list_req", exports.DOC_LIBRARY_LIST_RES = "doc_library_list_res", exports.DOC_ADD_TRIGGER = "doc_add_trigger", exports.DOC_ADD = "doc_add", exports.DOC_UPDATE_TRIGGER = "doc_update_trigger", exports.DOC_UPDATE = "doc_update", exports.DOC_REMOVE_TRIGGER = "doc_remove_trigger", exports.DOC_REMOVE = "doc_remove", exports.USER_UPDATE_RES = "user_update_res", exports.PAGE_AUTH_CHANGE = "page_auth_change", exports.PAINT_AUTH_CHANGE = "paint_auth_change", exports.SHAPE_ALL_REQ = "shape_all_req", exports.SHAPE_ALL_RES = "shape_all_res", exports.SHAPE_ADD_TRIGGER = "shape_add_trigger", exports.SHAPE_ADD = "shape_add", exports.SHAPE_REMOVE_TRIGGER = "shape_remove_trigger", exports.SHAPE_REMOVE = "shape_remove", exports.SHAPE_UPDATE_TRIGGER = "shape_update_trigger", exports.SHAPE_UPDATE = "shape_update", exports.SHAPE_LASER_TRIGGER = "shape_laser_trigger", exports.SHAPE_LASER = "shape_laser", exports.MESSAGE_SEND = "message_send", exports.MESSAGE_RECEIVE = "message_receive", exports.WHISPER_TO = "whisper_to",exports.MESSAGE_PULL_REQ = "message_pull_req",exports.MESSAGE_PULL_RES = "message_pull_res",exports.WINDOW_RESIZE = "window_resize",exports.PAGE_CHANGE_TRIGGER = "page_change_trigger",exports.PAGE_CHANGE_START = "page_change_start",exports.PAGE_CHANGE_END = "page_change_end",exports.SERVER_PAGE_CHANGE = "server_page_change",exports.CLIENT_PAGE_CHANGE = "client_page_change",exports.MAX_PAGE_CHANGE = "max_page_change",exports.SPEAK_APPLY_REQ_TRIGGER = "speak_apply_trigger",exports.SPEAK_APPLY_RES_TRIGGER = "speak_apply_res_trigger",exports.SPEAK_APPLY_REQ = "speak_apply_req",exports.SPEAK_APPLY_RES = "speak_apply_res",exports.MEDIA_SWITCH_TRIGGER = "media_switch_trigger",exports.ASSIST_MEDIA_SWITCH_TRIGGER = "assist_media_switch_trigger",exports.MEDIA_REPUBLISH_TRIGGER = "media_republish_trigger",exports.ASSIST_MEDIA_REPUBLISH_TRIGGER = "media_republish_ext_trigger",exports.MEDIA_REPUBLISH = "media_republish",exports.ASSIST_MEDIA_REPUBLISH = "media_republish_ext",exports.MEDIA_PUBLISH_TRIGGER = "media_publish_trigger",exports.ASSIST_MEDIA_PUBLISH_TRIGGER = "media_publish_ext_trigger",exports.MEDIA_PUBLISH = "media_publish",exports.ASSIST_MEDIA_PUBLISH = "media_publish_ext",exports.MEDIA_REMOTE_CONTROL_TRIGGER = "media_remote_control_trigger",exports.MEDIA_CONTROL_TRIGGER = "media_remote_control",exports.COMMAND_SEND = "command_send",exports.COMMAND_RECEIVE = "command_receive",exports.BROADCAST_SEND = "broadcast_send",exports.BROADCAST_RECEIVE = "broadcast_receive",exports.BROADCAST_CACHE_RES = "broadcast_cache_res";
exports.CUSTOMCAST_RECEIVE = "customcast_receive";
exports.CUSTOMCAST_CACHE_RES = "customcast_cache_res";
exports.TRACE_LOG = "trace_log", exports.NOTICE_REQ = "notice_req", exports.NOTICE_RES = "notice_res", exports.NOTICE_CHANGE_TRIGGER = "notice_change_trigger", exports.NOTICE_CHANGE = "notice_change";
exports.STICKY_NOTICE_REQ = "sticky_notice_req";
exports.STICKY_NOTICE_RES = "sticky_notice_res";
exports.STICKY_NOTICE_CHANGE_TRIGGER = "sticky_notice_change_trigger";
exports.STICKY_NOTICE_CHANGE = "sticky_notice_change";
exports.MY_GIFT_REQ = "my_gift_req", exports.MY_GIFT_RES = "my_gift_res", exports.GIFT_SEND = "gift_send", exports.GIFT_RECEIVE = "gift_receive", exports.MESSAGE_SEND_FORBID_TRIGGER = "message_send_forbid_trigger", exports.MESSAGE_SEND_FORBID = "message_send_forbid", exports.MESSAGE_SEND_FORBID_ALL_CHANGE_TRIGGER = "message_send_forbid_all_change_trigger", exports.MESSAGE_SEND_FORBID_ALL_CHANGE = "message_send_forbid_all_change", exports.SPEAK_APPLY_FORBID_ALL_CHANGE_TRIGGER = "speak_apply_forbid_all_change_trigger", exports.SPEAK_APPLY_FORBID_ALL_CHANGE = "speak_apply_forbid_all_change", exports.USER_COUNT_CHANGE = "user_count_change", exports.TOTAL_USER_COUNT_CHANGE = "total_user_count_change", exports.SURVEY_PREV_REQ = "survey_prev_req", exports.SURVEY_PREV_RES = "survey_prev_res", exports.SURVEY_QUESTION_SEND = "survey_question_send", exports.SURVEY_QUESTION_RECEIVE = "survey_question_receive", exports.SURVEY_ANSWER_SEND = "survey_answer_send", exports.SURVEY_ANSWER_COUNT = "survey_answer_count", exports.SURVEY_ANSWER_USER = "survey_answer_user", exports.STUDENT_LIST_REQ = "student_list_req", exports.STUDENT_LIST_RES = "student_list_res", exports.CLOUD_RECORD_END_TRIGGER = "cloud_record_end_trigger", exports.BLOCK_TASK_CREATE = "block_task_create", exports.USER_STATE_REQ = "user_state_req", exports.USER_STATE_RES = "user_state_res", exports.GROUP_SIZE_REQ = "group_size_req", exports.GROUP_SIZE_RES = "group_size_res", exports.CALL_CUSTOM_SERVICE_TRIGGER = "call_custom_service_trigger", exports.LOTTERY_COMPLETE_REQ = "lottery_complete_req", exports.LOTTERY_COMPLETE_RES = "lottery_complete_res", exports.LOTTERY_SEND = "lottery_send", exports.LOTTERY_RECEIVE = "lottery_receive", exports.LOTTERY_DRAW_REQ = "lottery_draw_req", exports.LOTTERY_DRAW_RES = "lottery_draw_res", exports.LOTTERY_RESULT_REQ = "lottery_result_req", exports.LOTTERY_RESULT_RES = "lottery_result_res", exports.VIEW_RENDER_TRIGGER = "view_render_trigger", exports.CLOUD_RECORD_START_TRIGGER = "cloud_record_start_trigger", exports.CLOUD_RECORD_START = "cloud_record_start", exports.CLOUD_RECORD_END = "cloud_record_end", exports.CLOUD_RECORD_COMMAND_SEND = "cloud_record_command_send", exports.CLOUD_RECORD_COMMAND_ACCEPT = "cloud_record_command_accept", exports.ROLL_CALL_TRIGGER = "roll_call_trigger", exports.ROLL_CALL = "roll_call", exports.ROLL_CALL_RES = "roll_call_res", exports.ROLL_CALL_FINISH = "roll_call_finish", exports.ROLL_CALL_RESULT = "roll_call_result", exports.SPEAK_INVITE_REQ_TRIGGER = "speak_invite_req_trigger", exports.SPEAK_INVITE_REQ = "speak_invite_req", exports.SPEAK_INVITE_RES_TRIGGER = "speak_invite_res_trigger", exports.SPEAK_INVITE_PENDING_LIST = "speak_invite_pending_list", exports.SPEAK_INVITE_RES = "speak_invite_res", exports.PRESENTER_CHANGE_TRIGGER = "presenter_change_trigger", exports.PRESENTER_CHANGE = "presenter_change", exports.SPEAK_ENABLE = "speak_enable", exports.SPEAK_DISABLE = "speak_disable", exports.FULLSCREEN_ENTER = "fullscreen_enter", exports.FULLSCREEN_EXIT = "fullscreen_exit", exports.FULLSCREEN_EXIT_TRIGGER = "fullscreen_exit_trigger", exports.FULLSCREEN_ENTER_TRIGGER = "fullscreen_enter_trigger", exports.VIDEO_RESOLUTION_CHANGE_TRIGGER = "video_resolution_change_trigger", exports.VIDEO_RESOLUTION_CHANGE = "video_resolution_change", exports.UPLINK_LINK_TYPE_CHANGE = "uplink_link_type_change", exports.DOWNLINK_LINK_TYPE_CHANGE = "downlink_link_type_change", exports.DEVICE_SETTINGS_OPEN = "device_settings_open", exports.DEVICE_SETTINGS_START = "device_settings_start", exports.KICK_OUT_TRIGGER = "kick_out_trigger", exports.KICK_OUT = "kick_out", exports.SPEAK_RAISE_TRIGGER = "speak_raise_trigger", exports.SPEAK_RAISE = "speak_raise", exports.SPEAK_LAY_TRIGGER = "speak_lay_trigger", exports.SPEAK_LAY = "speak_lay", exports.CLASS_SWITCH_TRIGGER = "class_switch_trigger", exports.CLASS_SWITCH = "class_switch", exports.MEDIA_PUBLISH_DENY = "media_publish_deny", exports.MEDIA_REPUBLISH_DENY = "media_republish_deny", exports.MEDIA_PUBLISH_EXT_DENY = "media_publish_ext_deny", exports.MEDIA_REPUBLISH_EXT_DENY = "media_republish_ext_deny", exports.SPEAK_APPLY_DENY = "speak_apply_deny", exports.SPEAK_INVITE_DENY = "speak_invite_deny", exports.RECORD_SHAPE_CLEAN = "record_shape_clean", exports.SCREEN_SHARE_START_BROADCAST = "screen_share_start_broadcast", exports.SCREEN_SHARE_STOP_BROADCAST = "screen_share_stop_broadcast", exports.RECORD_START_BROADCAST = "record_start_broadcast", exports.RECORD_STOP_BROADCAST = "record_stop_broadcast", exports.WHITEBOARD_RESIZE = "ppt_video_switch", exports.SEND_HEARTBEAT = "send_heart_beat", exports.CLEAR_CANVAS = "clear_canvas", exports.SWITCH_CAMERA = "switch_camera", exports.SPEAK_APPLY_RESULT_TIMEOUT = "speak_apply_result_timeout", exports.SPEAK_APPLY_RESULT_CANCEL = "speak_apply_result_cancel", exports.SPEAK_APPLY_RESULT_ACCEPT = "speak_apply_result_accept", exports.SPEAK_STOP_TRIGGER = "speak_stop_trigger", exports.SPEAK_START_TRIGGER = "speak_start_trigger", exports.SPEAK_CANCEL_TRIGGER = "speak_cancel_trigger", exports.SPEAK_APPLY_RESULT_REJECT = "speak_apply_result_reject", exports.SPEAK_INVITE_CONFIRM = "speak_invite_confirm", exports.SPEAK_INVITE_RESULT_FORCE = "speak_invite_result_force", exports.SPEAK_INVITE_RESULT_CANCEL = "speak_invite_result_cancel", exports.SPEAK_INVITE_RESULT_TIMEOUT = "speak_invite_result_timeout", exports.SPEAK_INVITE_RESULT_ACCEPT = "speak_invite_result_accept",exports.SPEAK_INVITE_RESULT_REJECT = "speak_invite_result_reject",exports.SPEAK_APPLYING_ADD = "speak_applying_add",exports.SPEAK_APPLYING_REMOVE = "speak_applying_remove",exports.SPEAK_INVITING_ADD = "speak_inviting_add",exports.SPEAK_INVITING_REMOVE = "speak_inviting_remove",exports.SPEAK_STATE_CHANGE = "speak_state_change",exports.WHITEBOARD_DRAWING_CHANGE = "whiteboard_drawing_change",exports.PAGE_HIDE = "page_hide",exports.DOWNLINK_SERVER_CHANGE_TRIGGER = "downlink_server_change_trigger",exports.STANDARD_LOTTERY_END = "standard_lottery_end",exports.COMMAND_LOTTERY_BEIGIN = "command_lottery_begin",exports.COMMAND_LOTTERY_ABORT = "command_lottery_abort",exports.COMMAND_LOTTERY_STATUS_REQ = "command_lottery_status_req",exports.COMMAND_LOTTERY_STATUS_RES = "command_lottery_status_res",exports.COMMAND_LOTTERY_HIT_REQ = "command_lottery_hit_req",exports.COMMAND_LOTTERY_HIT_RES = "command_lottery_hit_res",exports.LOTTERY_BOX_CLICKED = "lottery_box_clicked",exports.QUIZ_START = "quiz_start",exports.QUIZ_SUBMIT_END = "quiz_submit_end",exports.QUIZ_END = "quiz_end",exports.QUIZ_SOLUTION = "quiz_solution",exports.QUIZ_RES = "quiz_res",exports.WEBRTC_MIX_MEDIA_PUBLISH = "webrtc_mix_media_publish",exports.PAGE_ADD_TRIGGER = "page_add_trigger",exports.PAGE_ADD = "page_add",exports.PAGE_DELETE_TRIGGER = "page_delete_trigger",exports.PAGE_DELETE = "page_delete",exports.ANSWER_START_TRIGGER = "answer_start_trigger",exports.START_ANSWER = "start_answer",exports.ANSWER_END_TRIGGER = "answer_end_trigger",exports.END_ANSWER = "end_answer",exports.ANSWER_SUBMIT_TRIGGER = "answer_submit_trigger",exports.ANSWER_UPDATE = "answer_update",exports.ANSWER_PULL_REQ = "answer_pull_req",exports.ANSWER_PULL_RES = "answer_pull_res",exports.ANSER_RESULT_SHOW = "answer_result_show";
