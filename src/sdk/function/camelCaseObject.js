var camelCase=require("./camelCase"),$=require("../jquery");function camelCaseObject(e){var a=$.isArray(e)?[]:{};return $.each(e,function(e,r){($.isPlainObject(r)||$.isArray(r))&&(r=camelCaseObject(r)),a[camelCase(e)]=r}),a}module.exports=camelCaseObject;