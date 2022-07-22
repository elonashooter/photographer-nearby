1.用户使用流程v0.1(未包含支付):
格式说明:操作主语默认为句首(如order增即为 一般用户在order页面的数据库增操作) ；
“增”为order页面只填写下单者信息 “增2”为填写完整下单者与摄影师信息
“确认”为标志流程结束的改操作
一般用户发布预约  home > order增 > 摄影师orderlist查 > 摄影师order增2+确认 > orderlist可查看&&摄影师orderlist可查看 > order完成

一般用户定向预约  home > phoerList查 > phoer查by phoerId > order增+增2 > 摄影师order确认 >  orderlist可查看&&摄影师orderlist可查看 > order完成

一般用户申请成为摄影师 home > phoer增 > lyy审核 > phoer改(页面显示审核中or phoer信息)

一般用户查/删/改单  home > orderlist 查/删/改

摄影师接普通单  home > orderlist查 > order增2确认

摄影师接定向单  home > orderlist查 > order增2确认

摄影师编辑信息  home > phoer改

2.基于以上用户使用流程，页面设计要点
进入 home 页面 
进入 order页面 
进入 phoer页面 