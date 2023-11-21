<script setup>

import {useLoad} from "@tarojs/taro";
import {reactive} from "vue";

var util = require('../../utils.js');
var bjy = require('../../sdk/bjy.js');

const data  = reactive({
  options: {
    activeColor: 'red',
    strokeWidth: '10',
    backgroundColor: 'blue'
  }
})

useLoad(() => {
  util.init()
})
</script>

<template>
  <view>
    <baijia-loading :styleInfo="data.options"></baijia-loading>
  </view>
</template>

<script>
definePageConfig({
  navigationBarTitleText: '首页',
  usingComponents: {
    "baijia-loading": "../../sdk/component/loading/loading"
  },
})
</script>

<style>

</style>
