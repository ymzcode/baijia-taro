<template>
  <view class="index">
    <text>{{ msg }}</text>
    <baijia-loading class="loading-wrapper">
    </baijia-loading>
  </view>
</template>

<script setup>
import {ref} from "vue";
import {useLoad} from "@tarojs/taro";

const msg = ref("Hello World");


var util = require('../../utils.js');
var bjy = require('../../sdk/bjy');

useLoad(() => {
  util.init()
})


</script>


<script>
definePageConfig({
  navigationBarTitleText: '首页',
  "usingComponents": {
    "baijia-loading": "../../sdk/component/loading/loading"
  },
})
</script>
