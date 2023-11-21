var docData=require("../../../data/doc"),pageData=require("../../../data/page"),eventEmitter=require("../../../eventEmitter"),$=require("../../../jquery"),info=require("../../../info"),language=require("../../../language/main")();$.extend(eventEmitter,require("../eventEmitter")),Component({properties:{pageInfo:{type:Object,value:{},observer:function(e,t){e.url&&t.url&&e.url==t.url&&e.width==t.width&&e.height==t.height&&eventEmitter.trigger(eventEmitter.CURRENT_DOC_IMAGE_LOAD_SUCCESS,{docId:e.docId,page:e.page,docPage:e.docPage,rawUrl:e.url})}}},data:{},methods:{imgError:function(e){var t=e.target.dataset;eventEmitter.trigger(eventEmitter.DOC_IMAGE_LOAD_FAIL,{docId:t.docid,page:t.page}),eventEmitter.trigger(eventEmitter.PAGE_CHANGE_END,{docId:t.docid,page:t.page}),this.triggerEvent("pageImageLoaded",e)},imgLoaded:function(e){var t=e.target.dataset;eventEmitter.trigger(eventEmitter.CURRENT_DOC_IMAGE_LOAD_SUCCESS,{docId:t.docid,page:t.page,docPage:t.docpage,rawUrl:t.url}),eventEmitter.trigger(eventEmitter.PAGE_CHANGE_END),this.triggerEvent("pageImageLoaded",e)},setPage:function(e,t,r){var a=e.page,g=docData.getComplexPage(e.page);g||eventEmitter.trigger(eventEmitter.DOC_IMAGE_NOT_FOUND,{page:a});g.page;return g=docData.getDocumentById(g.docId),{page:a}}},ready:function(){eventEmitter.on(eventEmitter.DOC_IMAGE_LOAD_FAIL,function(e,t){t.page===pageData.getClientPage()&&(info.tip(language.IMAGE_LOAD_FAIL),eventEmitter.trigger(eventEmitter.CURRENT_DOC_IMAGE_LOAD_FAIL,t))})}});