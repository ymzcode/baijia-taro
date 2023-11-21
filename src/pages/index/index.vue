<template>
  <view class="index">
    <text>{{ msg }}</text>

    <navigator url="/pages/index/loading">
      <button>loading</button>
    </navigator>
  </view>
</template>

<script setup>
import {ref} from "vue";

const msg = ref("Hello World");
</script>


<script>
definePageConfig({
  navigationBarTitleText: '首页'
})
</script>
