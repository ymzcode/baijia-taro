var store = require("./store"), config = require("./config"), userData = require("./data/user"), is = require("./is");

function isTeacher(e) {
  return null == e && (e = store.get("user").type), e === config.ROLE_TYPE_TEACHER
}

function isPresenter(e) {
  return store.get("presenterId") === e
}

function isAssistant(e) {
  return null == e && (e = store.get("user").type), e === config.ROLE_TYPE_ASSISTANT
}

function isStudent(e) {
  return null == e && (e = store.get("user").type), e === config.ROLE_TYPE_STUDENT
}

function isGuest(e) {
  return null == e && (e = store.get("user").type), e === config.ROLE_TYPE_GUEST
}

function isSelf(e) {
  return store.get("user.id") === e
}

function isSelfAssist(e) {
  return store.get("user.id2") === e
}

function isVisible(e) {
  var t;
  return e && (t = userData.find(e)), t || (t = store.get("user")), t.status === config.USER_STATUS_ONLINE
}

function canStudentuUseBrush() {
  return !0 === store.get("user.audioOn") && 1 != store.get("partner.liveHideStudentBrush")
}

function isSpeakingDisabled() {
  return !!store.get("partner") && store.get("partner").disableSpeakingRequest
}

function hasSpeakingDisabledReason() {
  return !!store.get("partner") && store.get("partner.disableSpeakingRequestReason")
}

exports.isTeacher = isTeacher, exports.isPresenter = isPresenter, exports.isStudent = isStudent, exports.isAssistant = isAssistant, exports.isGuest = isGuest, exports.isSelf = isSelf, exports.isSelfAssist = isSelfAssist, exports.isVisible = isVisible, exports.canPaint = function () {
  return (isTeacher() || isAssistant() || canStudentuUseBrush()) && isVisible()
}, exports.canServerPage = function () {
  return (isTeacher() || isAssistant()) && isVisible()
}, exports.canPage = function () {
  return !isStudent() && !isGuest() || !canStudentuUseBrush()
}, exports.canUseUdpPush = function () {
  return !1
}, exports.canUseUdpPull = function () {
  return !1
}, exports.canForbidAllUserSendMessage = function () {
  return !1
}, exports.canSendMessage = function () {
  var e = store.get("userState.forbidSendMessage.duration") > 0;
  return isVisible() && !e
}, exports.canChangePresenter = function () {
  return store.get("user.id") === store.get("presenterId") || isTeacher()
}, exports.canCloseUserMedia = function () {
  return (isTeacher() || isAssistant()) && isVisible()
}, exports.canUseDoubleCamera = function () {
  return !1
}, exports.canPublishMixedAudioStream = function () {
  return !1
}, exports.canSetTouchEnable = function () {
  return !1
}, exports.canManageSpeak = function () {
  return (exports.isTeacher() || exports.isAssistant()) && exports.isVisible()
}, exports.canKickOut = function () {
  return (exports.isTeacher() || exports.isAssistant()) && store.get("partner.enableKickOut", !0)
}, exports.canSelectSpeaker = function () {
  return !!store.get("cefApiVersion")
}, exports.isTeacher = function (e) {
  return null == e && (e = store.get("user").type), e === config.ROLE_TYPE_TEACHER
}, exports.isNameMobileNumber = function () {
  return "mobile" == store.get("partner.liveInvitationNameTip")
}, exports.isSpeakingDisabled = function () {
  return isSpeakingDisabled()
}, exports.canApplySpeak = function () {
  return !!is.oneToMany() && (1 != store.get("partner.disableLiveSpeakRequest") && (isSpeakingDisabled() && hasSpeakingDisabledReason() || !isSpeakingDisabled()))
}, exports.canOpenCameraWhenSpeaking = function (e) {
  return null == e && (e = store.get("user.type")), !!exports.canUseCamera() && (exports.isStudent(e) ? store.get("class.speakCameraTurnon") ? +store.get("class.speakCameraTurnon") : null : void 0)
}, exports.canUseCamera = function () {
  return !(exports.isStudent() && exports.isOneToMany() && store.get("partner.liveHideStudentCamera"))
}, exports.isOneToMany = function () {
  return is.oneToMany()
}, exports.canSpeakFree = function () {
  var e = is.oneToOne() || is.miniClass() || exports.isTeacher() || exports.isAssistant();
  return exports.isOneOneTemplate() && exports.isAssistant() && (e = !1), e && exports.isVisible()
}, exports.canPushStream = function () {
  return !!store.get("partner.liveEnableMiniprogramPushStream", "") && !exports.isWebRTC()
}, exports.canUseQuestionAnswer = function () {
  return !is.oneToOne() && !store.get("class.isRtmpPush") && store.get("partner.enableLiveQuestionAnswer")
}, exports.isWebRTC = function () {
  return store.get("class.webrtcType") > 0
}, exports.isParentClass = function () {
  return store.get("parentId") === store.get("class.id")
}, exports.isSubClass = function () {
  return store.get("subRoomId") === store.get("class.id")
};
exports.enableClassEndEvaluation = function () {
  return exports.isStudent() && store.get("partner.classEndEvaluationSwitch") && store.get("class.hasClassEndEvaluation")
};
