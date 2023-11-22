<script setup>
import {useLoad, useUnload} from "@tarojs/taro";
import {reactive} from "vue";

var util = require('../../utils.js');
var bjy = require('../../sdk/bjy.js');

const data = reactive({
  optValue: '变大',
  drawing: false,
  drawOptValue: '开启画笔'
})

useLoad(() => {
  util.init()
})

useUnload(() => {
  bjy.exit()
})

const onOptTap = () => {
  if (data.optValue === '变大') {
    data.size = {
      width: 400,
      height: 300
    }
    data.optValue = '变小'
  } else {
    data.size = {
      width: 200,
      height: 150
    }
    data.optValue = '变大'
  }
}

const onDrawTap = () => {
  data.drawing = !data.drawing
  if (data.drawing) {
    data.drawOptValue = '关闭画笔'
  } else {
    data.drawOptValue = '开启画笔'
  }
}

</script>

<template>
  <view>
    <baijia-whiteboard id="whiteboard" :hidePageCount="true" :showClear="true" :size="{
            width: 400,
            height: 300
        }" :drawing="data.drawing" ></baijia-whiteboard>


    <button @tap="onOptTap">{{ data.optValue }}</button>
    <button @tap="onDrawTap">{{ data.drawOptValue }}</button>
  </view>
</template>

<style scoped>

</style>

<script>
definePageConfig({
  navigationBarTitleText: '首页',
  usingComponents: {
    "baijia-whiteboard": "../../sdk/component/whiteboard/whiteboard"
  },
})
</script>
