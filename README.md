# 记录去过地点的个人应用（前端部分）


## 一、环境与运行

### 1、开发环境

> - Node.js
>   - react
>   - antd
>   - axios
>   - http-proxy-middleware
> - 百度地图API v3

### 2、相关配置

#### [百度地图API](http://lbsyun.baidu.com/index.php?title=jspopular3.0)配置

1.在public/index.html中添加百度地图库和应用密钥，
个人密钥申请链接如下，[http://lbsyun.baidu.com/apiconsole/key](http://lbsyun.baidu.com/apiconsole/key)
```
<script type="text/javascript" src="http://api.map.baidu.com/api?v=3.0&ak=应用密钥"></script>
```
2.在React中使用百度地图库，在文件
`` /node_modules/react-scripts/config/webpack.config.js``
中添加以下代码,注意在添加位置
```
module.exports = function(webpackEnv) {
    ...
    // 回调的return位置
    return {
        externals:{
          'BMap':'BMap'
        }, 
     ...   
    }
```
在需要使用百度地图API的组件内导入包
`` import BMap from 'BMap' ``

3.注意当需要使用BMap中一些常量时，需要使用**window获取**，例如
`` window.BMAP_ANCHOR_TOP_LEFT ``。

#### 开发时跨域访问配置

在文件 ``src/setProxy.js`` 中配置需要的跨域链接。
在/api项中设置**travel-memories-backend**项目的部署地址。

### 3.开发相关指令

- ``npm start`` 启动开发服务器
- ``npm run build`` 编译，编译结果在/build文件夹中

### 4. 部署相关内容

React 官方部署文档如下：[https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

## 二、使用手册

### 1.登录 

点击左上角用户图标，在弹出的对话框中填写默认预先注册的用户名和密码。**目前提供注册功能**。


### 2.选择展示不同类型的事件点

在右上角事件点类型按钮中勾选需要显示的事件点类型。目前有两种事件类型：

- <img src="./public/star-empty.png" width="20" hegiht="20" align=center alt='star-empty'/> 未发生事件点
- <img src="./public/star-fill.png" width="20" hegiht="20" align=center alt='star-fill' /> 已发生事件点

### 3.添加事件点

在需要添加事件点的位置右键，在左侧弹出区域中填写事件点各项属性。
**目前在前端中未实现输入验证，若输入信息不合理提示错误**

### 4.修改事件点信息

点击需要修改的事件点，在左侧弹出区域中修改事件点各项属性，并且在下方区域中可以添加事件的文本描述。
当对事件点修改完成后，点击右上角的**同步按钮**，可以上传对事件点的修改。
**目前在前端中未实现输入验证，若输入信息不合理提示错误**

### 5.地图类型切换

点击右下角按钮切换地图类型。


