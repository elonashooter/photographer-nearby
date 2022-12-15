# 本应用各功能执行逻辑及其关键函数  

### uniStarter自带的路由控制跳转到登录页，并记录用户角色
0. 通过路由跳转跳转到登录页
1. 登陆成功loginSuccess.js触发跳转到首页home
2. 首页 pages/home/home-onShow 执行:登陆成功获取user数据role字段确认用户角色为“普通用户”、“摄影师”or“应用管理员”(应用管理员角色只能通过改数据库or在admin设置角色设置)并在store里记录角色字段  

**下文中的"角色"若无特殊说明，均指store内记录的角色**  

## 推送
基于uniPush 2.0  
推送函数：云函数push-chatMsg  
接收及其返回：APP.vue-uni.onPushMessage  
**下文中的“推送”均指此项**
## 首次打开app的提示
插件cms-easy-guide
## GPS定位
uni.getLocation获取+uni.setStorage储存获取记录避免重复获取
## 用户发布预约需求
db.collection('order')增删查改  
操作入口pages/home/home 发布预约  
根据角色不同 页面中<input disable不同> 页面底部的button也不同  
>判断角色的方式为跳转到此页面时的跳转参数，不同参数代表的对应角色都有注释

## 用户直接预约摄影师
操作入口pages/home/home 在线摄影师或轮播图 
* db.collection('photographer')查  
* db.collection('order')增  
* 推送预约信息给摄影师  
注:云操作action对返回的摄影师信息进行了一次AES加密

## 用户申请成为摄影师
操作入口pages/ucenter/ucenter 加入湾拍 
* db.collection('pre-photographer')增、查；
>同一userId用户首次发起申请为增，申请通过后再次发起也为增，记为两条申请数据以用于保留申请记录；查最后一次的申请记录填充申请界面  

* 推送申请结果给发起申请的用户  
* 申请通过后重新登陆  

## 摄影师编辑信息
操作入口pages/ucenter/ucenter 编辑自己(原加入湾拍位置)

* db.collection('pre-photographer')增、查；查最后的申请记录填充申请界面  

<h2 id="1">应用管理员审核用户成为摄影师的申请</h2>
操作入口pages/ucenter/ucenter Wpage组件 摄影师管理，仅角色含“应用管理员”用户可见  
* db.collection('pre-photographer')查；  
>若通过，则删除部分字段，删除后的数据作为photographer的新增或修改数据  

* db.collection('photographer')增或改；
>同一userId用户首次通过为增，申请通过后再次通过为改  


## 摄影师获取设备识别码
操作入口pages/home/home 点击卡通人物形象 ***项目开源但此人物形象不开源***  
* db.collection('photographer')改 修改摄影师设备识别码  
* db.collection('chatMatch')改 修改当前摄影师id的聊天匹配信息的摄影师设备识别码  
* 获取识别码后聊天和推送都会推送到当前设备  

## 摄影师主动接单
操作入口pages/ucenter/ucenter 已接
* db.collection('order')改 将此单负责摄影师改为接单摄影师uid  
* 推送接单信息给发布用户  

## 摄影师辞职
操作入口pages/ucenter/ucenter 润 
* db.collection('pre-photographer')改 将“是否在岗”改为false  
* db.collection('photographer')改 将“是否在岗”改为false;将“处于接单状态”改为false  
* db.collection('uni-id-users')改 将角色权限“摄影师”删除  
* 辞职后重新登陆  
 
## 聊天功能
操作入口：pages/photographer/phoer 左上角聊天标志；pages/home/home右上角聊天标志  
* 推送聊天信息  
* 接收返回新增或修改store数据  
>聊天页面chat和personChat都用mapgetter+computed+watch监听聊天消息  

* uni.setStorage("chatHistory")缓存聊天数据  
* db.collection('chatMatch')增  
* db.collection('chatMsg')增  
chat页面的刷新按钮：chatMatch表与chatMsg表联查  
*personChat页面-onBackPress清除未读  

## 应用管理员的预约管理、摄影师管理、收集用户反馈、清除云数据库指定时间前的图片
操作入口pages/ucenter/ucenter Wpage组件 仅角色含“应用管理员”用户可见
* db.collection('order')查
* db.collection('pre-photographer')查
* db.collection('photographer')查、改  
>见上文“[应用管理员审核用户成为摄影师的申请](#1)”；将摄影师是否为平台认证摄影师设为true or false
* db.collection('opendb-feedback')查


## 使用调试数据时需要注意的点  
0. db_init.json已在项目根目录
1. chatmatch删完就要删photographer的workeduserid
2. photographer删完就要删user的role-photographer  
3. 和prephotographer
  