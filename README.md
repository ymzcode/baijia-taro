# 简介

使用taro3对接百家云的微信小程序原生sdk，解决其sdk报错问题并成功运行。

## 环境

node：v20.0.0
taro: v3.6.18
baijia-sdk: 直接下载源码sdk，非tag里面的版本。（代码库最后一次更新时间：Oct 27, 2022 3:45pm）
微信小程序开发工具（这个也写一下吧）：(1.06.2310080darwin-ARM64)

### *重要！！！*

百家云sdk tag里面的打包项目代码和源码不同！本人第一次引入了tag中的2.0.2包sdk，本项目引入的源码sdk，其报错不同，表现形式也不同。被困扰了好久。推荐使用源码sdk。

1. 2.0.2包sdk使用了app.globalData。如果使用需要兼容其写法。参考：https://docs.taro.zone/docs/come-from-miniapp
2. 代码中其报错大都是因为`export const`和 `exports` 混乱使用导致的！！！CommonJS规范和ES6规范混用。。
3. image资源文件报错，需要配置`config/index.js`中的`copy`字段。参考：https://docs.taro.zone/docs/config-detail#copy
4. 目前`config/index.js`中的`mini.compile.exclude`字段保留配置和去掉其影响dist无差别，对此字段的影响结果还不清楚。
5. 目前项目只引入了loading和whiteboard组件。其他组件的坑后续补充。


## 其他

建议先阅读了解taro3有关原生迁移的兼容问题，参考：https://taro-docs.jd.com/docs/come-from-miniapp 有助于自行解决问题。



