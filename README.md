1.用户使用流程v0.1(未包含支付):
格式说明:操作主语默认为句首(如order增即为 一般用户在order页面的数据库增操作) ；
“增”为order页面只填写下单者信息 “增2”为填写完整下单者与摄影师信息
“确认”为标志流程结束的改操作
一般用户发布预约  home > order增 > 摄影师orderlist查 > 摄影师order增2+确认 > orderlist可查看&&摄影师orderlist可查看 > order完成

一般用户定向预约  home > phoerList查 > phoer查by phoerId > order增+增2 > 摄影师order确认 >  orderlist可查看&&摄影师orderlist可查看 > order完成

一般用户申请成为摄影师 home > pre-phoer增 > lyy审核 > pre-phoer改 phoer增(页面显示审核中or phoer信息)

一般用户查/删/改单  home > orderlist 查/删/改

摄影师接普通单  home > orderlist查 > order增2确认

摄影师接定向单  home > orderlist查 > order增2确认

摄影师编辑信息  home > phoer改

2.基于以上用户使用流程，页面设计要点
进入 home 页面 

进入 order页面 

进入pre-phoer页面
order(未发起) 进入  表格可修改 不可见“审核中”  v-if为提交按钮
order(已发起) 进入  表格不可修改  全可见  判断是否已发起：查表有数据且AuditStatus=false
phoer 进入  表格可修改  v-if为修改按钮	判断进入身份:登陆该表全局变量character
manager 进入   以下设为不可见“代表作名称” “说明” “作品名称” “作品删除键” “用户查看到的效果”

进入 phoer页面 
预约用户进入  表格不可修改  以下设为不可见“代表作名称” “说明” “作品名称” “作品删除键” “用户查看到的效果” v-if为预约按钮 判定标准
审核中(包括摄影师修改与普通用户申请)进入  表格不可修改  全可见
