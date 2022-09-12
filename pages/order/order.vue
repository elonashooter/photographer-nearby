<template>
	<view class="u-page">
		<view class="u-demo-block">
			<text class="u-demo-block__title" v-if="agreed.orderStatus===''">完善预约信息</text>
			<text class="u-demo-block__title" v-else>订单信息</text>
			<u--text
				text='订单状态:已发布,待摄影师接收'
				type="warning"
				v-if="orderStatus===0"
			></u--text>
			<u--text
				text='订单状态:等待下单方同意约拍'
				type="primary"
				v-if="orderStatus===1"
			></u--text>
			<u--text
				text='订单状态:等待摄影方同意约拍'
				type="primary"
				v-if="orderStatus===101"
			></u--text>
			<text style="color: lightsalmon" v-if="orderStatus===2">订单进行中,记得按时到场昂</text>
			<u--text
				text='订单状态:已完成'
				type="success"
				v-if="orderStatus===3"
			></u--text>
			<view class="u-demo-block__content">
				<!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
				<u--form labelPosition="left" :model="agreed" ref="form1">
					<u-form-item
						label="姓名"
						prop="userInfo.name"
						borderBottom
						ref="item1"
					>
						<u--input
							:disabled="disabled"
							v-model="agreed.userInfo.name"
							border="none"
							placeholder="下单者姓名或昵称"
							prefixIcon="account-fill"
							prefixIconStyle="font-size: 22px;color: #909399"
						></u--input>
					</u-form-item>

					<u-form-item
						label="电话"
						prop="userInfo.phoneNumber"
						borderBottom
						ref="item2"
					>
						<u--input
							:disabled="disabled"
							v-model="agreed.userInfo.phoneNumber"
							border="none"
							placeholder="联系电话"
							prop="userInfo.phoneNumber"
							prefixIcon="phone"
							prefixIconStyle="font-size: 22px;color: #909399"
						></u--input>
					</u-form-item>
					<u-form-item
						label="类型"
						borderBottom
						ref="item3"
					>
						<u-radio-group v-model="agreed.type">
							<u-radio
								:disabled="disabled"
								:customStyle="{marginRight: '16px'}"
								v-for="(item, index) in radiolist1"
								:key="index"
								:label="item.name"
								:name="item.name"
							>
							</u-radio>
						</u-radio-group>
					</u-form-item>
					<u-form-item
						label="预算"
						prop="price"
						ref="item4"
						borderBottom
					>				
						<u--input
							:disabled="disabled"
							v-model.number="agreed.price"
							border="none"
							placeholder="可为0,愿者上钩"
							prefixIcon="rmb-circle"
							prefixIconStyle="font-size: 22px;color: #909399"
						>
							<template slot="suffix">
								<u-button
									text="参考价位"
									type="warning"
									size="small"
									@click="popupOpen()"
								></u-button>
							</template>
						</u--input>
					</u-form-item>
<!-- 					<u-slider
					    v-model="agreed.price"
						showValue
					    min="0"
					    max="200"
						step="10"
					></u-slider>
					<u-line></u-line> -->
					<u-form-item
						label="地点"
						prop="place"
						borderBottom
						ref="item5"
					>
						<u--input
							:disabled="disabled"
							v-model="agreed.place"
							border="none"
							placeholder="在哪拍摄  非必填"
							prefixIcon="photo-fill"
							prefixIconStyle="font-size: 22px;color: #909399"
						></u--input>
					</u-form-item>

					<u-form-item
						label="备注"
						prop="intro"
						borderBottom
						ref="item6"
					>
						<u--input
							:disabled="disabled"
							v-model="agreed.intro"
							border="none"
							placeholder="如请先加我微信等  非必填"
							prefixIcon="edit-pen"
							prefixIconStyle="font-size: 22px;color: #909399"
						></u--input>
					</u-form-item>
					<u-form-item
						label="时间"
						prop="time"
						borderBottom
						@click="showTime = true; hideKeyboard()"
						ref="item7"
					>
						<u--input
							:disabled="disabled"
							v-model="agreed.time"
							disabled
							disabledColor="#ffffff"
							placeholder="拍摄时间"
							border="none"
							prefixIcon="play-right"
							prefixIconStyle="font-size: 22px;color: #909399"
						></u--input>
						<u-icon
							slot="right"
							name="arrow-right"
						></u-icon>
					</u-form-item>
				</u--form>
				<!-- 提交按钮 -->
				<u-button
					v-if="!phoerMsg._id&&!agreed._id"
					type="primary"
					text="提交"
					customStyle="margin-top: 50px"
					@click="submit"
				></u-button>
				<!-- 用户从在线摄影师预约跳过来的 -->
				<u-button
					v-else-if="phoerMsg._id&&!agreed._id"
					type="primary"
					text="预约"
					customStyle="margin-top: 50px"
					@click="yuyue"
				></u-button>
				<u-button
					v-else-if="phoerMsg._id&&agreed.orderStatus===0"
					type="success"
					text="接单"
					customStyle="margin-top: 50px"
					@click="takeOrder"
				></u-button>
				<u-button
					v-else-if="agreed.orderStatus===1"
					type="success"
					text="等待下单方同意"
					customStyle="margin-top: 50px"
				></u-button>
				<u-button
					v-else-if="agreed.orderStatus===101"
					type="success"
					text="等待摄影师同意"
					customStyle="margin-top: 50px"
				></u-button>
				<u-button
					v-else-if="phoerMsg._id&&agreed.orderStatus===2"
					type="success"
					text="记得如约到场拍摄昂"
					customStyle="margin-top: 50px"
				></u-button>
				<u-button
					v-if="!phoerMsg._id&&agreed.orderStatus===2"
					type="success"
					text="拍摄完毕后点此完成"
					customStyle="margin-top: 50px"
					@click="completeOrder"
				></u-button>
				<u-button
					v-if="agreed._id&&agreed.orderStatus===0&&!phoerMsg._id"
					type="success"
					text="修改"
					customStyle="margin-top: 50px"
					@click="editOrder"
				></u-button>
				<u-button
					v-if="agreed.orderStatus===3"
					type="success"
					text="已完成"
					customStyle="margin-top: 50px"
				></u-button>
				<u-button
					v-if="agreed._id&&agreed.orderStatus===0&&!phoerMsg._id"
					type="error"
					text="删除"
					customStyle="margin-top: 20px"
					@click="deleteOrder"
				></u-button>
				<!-- 选择拍摄时间的日期弹出组件 -->
				<u-datetime-picker
					v-if="!disabled"
					:show="showTime"
					:value="agreed.time"
					mode="datetime"
					closeOnClickOverlay
					@confirm="TimeConfirm"
					@cancel="TimeClose"
					@close="TimeClose"
					:minDate="Date.now()" 
				></u-datetime-picker>
				<!-- 参考价格弹出组件 -->
				<u-popup
					mode="right"
					:show="showPopup"
					round="0"
					@close="popupClose()"
					@open="popupOpen()"
				>
					<view class="u-page">
						<view class="u-demo-block">
							<text class="u-demo-block__title">个人照</text>
							<view class="u-demo-block__content">
								<view class="text-item">
									<u--text text="25元每组，每组10张"></u--text>
								</view>
							</view>
						</view>
						<view class="u-demo-block">
							<text class="u-demo-block__title">宿舍集体照</text>
							<view class="u-demo-block__content">
								<view class="text-item">
									<u--text text="150元每组，每组10张"></u--text>
								</view>
							</view>
						</view>
						<view class="u-demo-block">
							<text class="u-demo-block__title">情侣照</text>
							<view class="u-demo-block__content">
								<view class="text-item">
									<u--text text="60元每组，每组10张">60元每组，每组10张</u--text>
								</view>
							</view>
						</view>
						<view class="u-demo-block">
							<text class="u-demo-block__title">班级集体照</text>
							<view class="u-demo-block__content">
								<view class="text-item">
									<u--text text="500元每组，每组5张"></u--text>
								</view>
							</view>
						</view>
						<view class="u-demo-block">
							<text class="u-demo-block__title">tip:</text>
							<view class="u-demo-block__content">
								<view class="text-item">
									<u--text text="价格可以与摄影师协商," type="warning"></u--text>
									<u--text text="双方达成共识后支付" type="warning"></u--text>
								</view>
								<u-button
									type="warning"
									text="点我关闭"
									customStyle="width: 200rpx;margin-top:10rpx"
									@click="popupClose()"
								></u-button>
							</view>
						</view>
					</view>
				</u-popup>
			</view>
<!-- 			<u-empty
				mode="message"
				icon="/static/history.png">
			</u-empty> -->
			<view style="margin-top: 25rpx;" v-if='agreed.phoerId'>
				对接摄影师：
					<u-cell
						:title="agreed.phoerName"
						:value="agreed.phoerIntro"
						center
						:label="agreed.phoerPhoneNumber"
					>
						<u-avatar
							slot="icon"
							shape="square"
							size="70"
							:src="agreed.phoerShowUrl"
							customStyle="margin: -3px 5px -3px 0"
							mode="aspectFill"
						></u-avatar>
					</u-cell>
			</view>
						
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				disabled:false,
				orderId:'',
				orderStatus:'',
				fileList1: [],
				showTime: false,
				showPopup:false,
				agreed: {  //约定拍摄的时间、地点等信息
					userInfo: {
						name: '',
						phoneNumber: ''
					},
					type:'个人照',
					intro: '',
					place:'',
					price:'',
					time:'',
					userId:this.$store.state.user.info._id,
					phoerId:'',
				},
				phoerMsg:{
					phoerShow:'',
					name:'',
					intro:'',
					phoerNumber:'',
				},
				radiolist1: [{
						name: '个人照',
						disabled: false
					},
					{
						name: '情侣照',
						disabled: false
					},
					{
						name: '集体照',
						disabled: false
					}
				],
				rules: {
					'userInfo.name': [{
						type: 'string',
						required: true,
						message: '请填写姓名',
						trigger: ['blur', 'change']
					}, {
						// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
						validator: (rule, value, callback) => {
							// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
							return uni.$u.test.chinese(value);
						},
						message: "姓名必须为中文",
						// 触发器可以同时用blur和change，二者之间用英文逗号隔开
						trigger: ["change", "blur"],
					}],
					"intro": {
						type: 'string',
						required: false,
						message: '',
						trigger: ['change']
					},
					'time': {
						type: 'string',
						required: true,
						message: '请选择拍摄时间',
						trigger: ['change']
					},
					'price':[{
						type: 'number',
						required: true,
						message: '请填写预算数字',
						trigger: ['change']
					},{
						validator: (rule, value, callback) => {
							return uni.$u.test.digits(value);
						},
						message: "预算必须为数字",
						// 触发器可以同时用blur和change，二者之间用英文逗号隔开
						trigger: ["change", "blur"],
					}],
					"userInfo.phoneNumber":[{
						type: 'string',
						required: true,
						message: '请填写手机号',
						trigger: ['blur', 'change']
					}, {
						validator: (rule, value, callback) => {
							return uni.$u.test.mobile(value);
						},
						message: "请填写正确手机号",
						// 触发器可以同时用blur和change，二者之间用英文逗号隔开
						trigger: ["change", "blur"],
					}]
				},
			}
		},
		onReady() {
			// 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
			this.$refs.form1.setRules(this.rules)
		},
		onLoad(e) {
			//用户下单过来的
			if(e.orderMsg){
				console.log("orderMsg get success");
				console.log(e.orderMsg);
				this.agreed=JSON.parse(decodeURIComponent(e.orderMsg))
				this.orderStatus=this.agreed.orderStatus
			}
			//摄影师接单点过来的
			else if(e.phoerChoiceOrder){
				console.log("PCO");
				console.log(JSON.parse(decodeURIComponent(e.phoerChoiceOrder)));
				let pCO=JSON.parse(decodeURIComponent(e.phoerChoiceOrder))
				this.agreed=pCO
				this.getDataByPhoerId(pCO.phoerId)
				this.disabled=true
			}
			else if(e.orderChoicePhoer){
				//用户预约跳转填写订单信息
				phoerMsg=e.orderChoicePhoer
				this.agreed={
					phoerId:this.phoerMsg.userId,
					phoerPhoneNumber:this.phoerMsg.phoneNumber,
					phoerName:this.phoerMsg.name,
					phoerShowUrl:this.phoerMsg.phoerShow[0],
					phoerIntro:this.phoerMsg.intro,
					...agreed
				}
			}else{
				//用户新建
				this.setDefaultValue()
			}
			
		},
		methods: {
			afterRead(event) {
				this.fileList1.push({
					url: event.file,
					status: 'uploading',
					message: '上传中'
				})
			},

			navigateBack() {
				uni.navigateBack()
			},

			TimeClose() {
				this.showTime = false
				this.$refs.form1.validateField('agreed.time')
			},
			TimeConfirm(e) {
				this.showTime = false
				this.agreed.time = uni.$u.timeFormat(e.value, 'yyyy-mm-dd hh:MM')
				this.$refs.form1.validateField('agreed.time')
			},
			popupOpen() {
				// console.log('open');
				this.showPopup = true
			},
			popupClose() {
				this.showPopup = false
				// console.log('close');
			},
			submit() {
				// 校验表单  如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true
				this.$refs.form1.validate().then(res => {
					uni.$u.toast('校验通过')
					//有传来订单id则为修改  否则为上传
					this.odb.add(this.agreed).then((res) => {
						// console.log("res here");
						// console.log(res);
					  uni.showToast({
					    icon: 'none',
					    title: '提交成功'
					  })
					  // debugger
					  this.getOpenerEventChannel().emit('refreshData')
					  setTimeout(() => uni.reLaunch({
					  	url:"/pages/home/home"
					  }), 500)
					  
					  //提交成功后跳转至订单列表页面
					}).catch((err) => {
					  uni.showModal({
					    content: err.message || '请求服务失败',
					    showCancel: false
					  })
					})
					
				}).catch(errors => {
					uni.$u.toast('请完整填写数据')
				})
				// console.log(typeof(this.agreed.price));
				
				
			},
			hideKeyboard() {
				uni.hideKeyboard()
			},
			setDefaultValue(){
				this.agreed.userInfo={
					name:this.$store.state.user.info.nickname,
					phoneNumber:this.$store.state.user.info.mobile
				}
			},
			getDataByPhoerId(phoerId){
				this.pdb.where({
					userId:phoerId
				}).get().then(res=>{
					if(res.result.data.length>0){
						this.agreed.phoerId=res.result.data[0].userId
						this.phoerMsg=res.result.data[0]
						this.agreed={
							phoerId:this.phoerMsg.userId,
							phoerPhoneNumber:this.phoerMsg.phoneNumber,
							phoerName:this.phoerMsg.name,
							phoerShowUrl:this.phoerMsg.phoerShow[0],
							phoerIntro:this.phoerMsg.intro,
							...this.agreed
						}
					}
					else{
						
					}
				})
			},
			//接单
			takeOrder(){
				this.odb.doc(this.agreed._id).update({
					phoerId:this.phoerMsg.userId,
					phoerPhoneNumber:this.phoerMsg.phoneNumber,
					phoerName:this.phoerMsg.name,
					phoerShowUrl:this.phoerMsg.phoerShow[0],
					phoerIntro:this.phoerMsg.intro,
					orderStatus:1
				}).then(res=>{
					console.log("takeOrder success");
					console.log(res);
					// uniCloud.callFunction({
					// 	name:"push2",
					// 	data:{
					// 		uid:this.agreed.userId,
					// 		title:"预约有响应",
					// 		content:"有摄影师接了你的单",
					// 		payload:{
					// 			fabShowText:"摄影师"+this.phoerMsg.name+"响应了你的订单",
					// 			url:'/pages/order/verifyOrder',
					// 			phoerMsg:this.phoerMsg,
					// 			orderMsg:this.agreed
					// 		}
					// 	}
					// })
					uni.showModal({
						content:"接单操作完成，等待对方同意即可"
					})
					setTimeout(() => uni.navigateBack({
						delta: 2
					}), 1500)
				})
			},
			editOrder(){
				this.odb.doc(this.agreed._id).update({
					userInfo:this.agreed.userInfo,
					type:this.agreed.type,
					price:this.agreed.price,
					place:this.agreed.place,
					intro:this.agreed.intro,
					time:this.agreed.time
				}).then(res=>{
					uni.showToast({
						title:"修改成功"
					})
					setTimeout(() => uni.navigateBack({
						delta: 2
					}), 500)
					
				})
			},
			deleteOrder(){
				this.odb.doc(this.agreed._id).remove().then(res=>{
					uni.showToast({
						title:"删除完成"
					}),
					setTimeout(() => uni.navigateBack({
						delta: 2
					}), 500)
				})
			},
			completeOrder(){
				this.odb.doc(this.agreed._id).update({
					orderStatus:3
				}).then(res=>{
					uni.showToast({
						title:"操作完成，感谢支持！"
					})
					setTimeout(() => uni.navigateBack({
						delta: 2
					}), 500)
					
				})
			},
			yuyue(){
				this.$refs.form1.validate().then(res => {
					// uni.$u.toast('校验通过')
					this.odb.add(this.agreed).then((res) => {
					  uni.showToast({icon: 'none',title: '预约发起成功'})
					 //  uniCloud.callFunction({
					 //  	name:"push2",
						// data:{
						// 	uid:this.agreed.phoerId,
						// 	title:"有新的预约订单",
						// 	content:"有用户找你约拍啦",
						// 	payload:{
						// 		fabtext:"用户"+this.agreed.userInfo.name+"找你预约了以下订单",
						// 		orderMsg:this.agreed
						// 	}
						// }
					 //  }).finish(()=>{
						  setTimeout(() => uni.reLaunch({
						  	url:"/pages/home/home"
						  }), 500)
					  // })

					}).catch((err) => {
					  uni.showModal({
					    content: err.message || '请求服务失败',
					    showCancel: false
					  })
					})
					
				}).catch(errors => {
					uni.$u.toast('请完整填写数据')
				})
			}
		},
	}
</script>

<style lang="scss">
	.text-item {
		margin-right: 10px;
		flex: 1;
	}

</style>
