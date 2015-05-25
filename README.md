# 自选股
基于Express+Mongodb创作的股票行情提示应用。

## 特别鸣谢
该应用使用新浪财经股票API提供的实时数据。

##用户界面

## 算法说明
对于某只个股，系统根据`样点时隔`设置，每N秒更新一次数据。然后根据`取点个数`，取最新的X个点进行计算。符合先升后降走势，或先降后升走势的数据，触发警报。

例如：

	中国重工（601989）
 
	设置为：
		取点个数：5
		样点更新时隔：30
		持续上升/下降百分比：0.5

	在交易时间的第N个30秒，取出点 15.54, 15.55, 15.56, 15.30, 14.90

	1.把点分为两组，A:[15.54, 15.55, 15.56], B:[15.56, 15.30, 14.90]
	2.A组数据符合上升走势，B组数据符合下降走势且下降幅度持续大于0.5%，触发警报。


## 操作说明
1. 在代码栏输入个股代码，进行搜索，然后选中其中一只股票，添加完成。
2. 添加后，在主界面会显示个股的详细信息，当日的实时分时图。
3. 每只个股可编辑其提醒设置。
	1. 提醒设置：开启/关闭个股提醒；
	2. 取点个数：取每N个点进行计算是否符合条件；
	3. 样点更新时隔：每N秒取一次点进行计算，输入数字要求是10的倍数；
	4. 持续上升/下降百分比：拐点后持续的改变幅度；



## 已知问题
1. 由于新浪API只提供了即时的股票数据，所以只能够在打开页面时开始保存数据点。当数据点个数达到预设取点个数后才进行运算。