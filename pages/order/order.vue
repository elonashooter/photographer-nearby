<template>
	<view class="u-page">
		<view class="u-demo-block">
			<uni-steps :options="stepList" :active="stepActive" activeIcon="download" v-if="stepActive!=3"/>
			<uni-steps :options="stepList" :active="stepActive" activeIcon="checkbox" activeColor='DarkSeaGreen'  v-else/>
			
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
						></u--input>
						<u-button
							text="参考价位"
							type="warning"
							size="small"
							customStyle="width:200rpx"
							@click="popupOpen()"
						></u-button>
					</u-form-item>
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
					type="primary"
					:text="ButtonText"
					customStyle="margin-top: 50px"
					@click="clickButton(ButtonAction)"
				></u-button>
				<u-button
					v-if="ButtonText=='修改'"
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
	let odb=uniCloud.database().collection('photography-order')
	export default {
		data() {
			return {
				disabled:false,
				orderId:'',
				fileList1: [],
				showTime: false,
				showPopup:false,
				ButtonText:'',
				ButtonAction:'',
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
					order_push_clientid:''
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
				stepList:[{
					title: 'A方发起预约'
				}, {
					title: 'B方接受'
				}, {
					title: '到场拍摄'
				}, {
					title: '完成'
				}],
				stepActive:0,
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
					"place": {
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
		created() {
			let inQinZhou=uni.getStorage({
				key:"inQinZhou"
			})
			if(inQinZhou){
				return;
			}else{
				uni.$u.toast('只有钦州的同学下单有效')
			}
		},
		onLoad(e) {
			//用户点列表过来的
			if(e.orderMsg){
				this.agreed=JSON.parse(decodeURIComponent(e.orderMsg))
				if(this.agreed.orderStatus===0){
					this.ButtonText='修改'
					this.ButtonAction='editOrder'
				}
				else if(this.agreed.orderStatus==101){
					this.ButtonText='等待摄影师同意'
					this.ButtonAction=''
					this.disabled=true
				}else if(this.agreed.orderStatus==2){
					this.ButtonText='拍摄完毕后点此完成'
					this.ButtonAction='completeOrder'
					this.disabled=true
				}else if(this.agreed.orderStatus==3){
					this.ButtonText='已完成'
					this.ButtonAction=''
					this.disabled=true
				}
			}
			//摄影师接单点过来的
			else if(e.phoerChoiceOrder){
				this.ButtonText='接单'
				this.ButtonAction='takeOrder'
				this.agreed=JSON.parse(decodeURIComponent(e.phoerChoiceOrder))
				this.getDataByPhoerId(this.agreed.phoerId)
				this.disabled=true
				if(this.agreed.rejectIds.includes(this.$store.state.user.info._id)){
					this.ButtonText='近期被此订单拒绝过'
					this.ButtonAction=''
				}else if(this.agreed.orderStatus===1){
					this.ButtonText='等待下单方同意'
					this.ButtonAction=''
				}else if(this.agreed.orderStatus===101){
					this.ButtonText='返回'
					this.ButtonAction='back'
				}else if(this.agreed.orderStatus==2){
					this.ButtonText='记得如约到场拍摄昂'
					this.ButtonAction=''
				}else if(this.agreed.orderStatus==3){
					this.ButtonText='已完成'
					this.ButtonAction=''
				}
				console.log(this.agreed);
			}
			else if(e.orderChoicePhoer){
				//用户预约跳转填写订单信息
				this.ButtonText='预约'
				this.ButtonAction='yuyue'
				let phoerMsg=JSON.parse(decodeURIComponent(e.orderChoicePhoer))
				this.agreed={
					...this.agreed,
					phoerId:phoerMsg.userId,
					phoerPhoneNumber:phoerMsg.phoneNumber,
					phoerName:phoerMsg.name,
					phoerShowUrl:phoerMsg.phoerShow[0],
					phoerIntro:phoerMsg.intro,
					phoer_push_clientid:phoerMsg.push_clientid
				}
				this.setDefaultValue()
			}else{
				//用户新建
				this.ButtonText='提交'
				this.ButtonAction='submit'
				this.setDefaultValue()
			}
			if(this.agreed.orderStatus!=''){
				this.agreed.orderStatus==101?this.stepActive=1:this.stepActive=this.agreed.orderStatus
			}else{
				this.stepActive=0
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
			clickButton(action){
				if(action=='submit'){
					this.submit()
				}else if(action=='yuyue'){
					this.yuyue()
				}else if(action=='takeOrder'){
					this.takeOrder()
				}else if(action=='completeOrder'){
					this.completeOrder()
				}else if(action=='editOrder'){
					this.editOrder()
				}else if(action=='back'){
					uni.navigateBack()
				}else{
					return;
				}
				
			},
			submit() {
				// 校验表单  如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true
				this.$refs.form1.validate().then(res => {
					uni.$u.toast('校验通过')
					//有传来订单id则为修改  否则为上传
					odb.add(this.agreed).then((res) => {
						// console.log("res here");
						// console.log(res);
					  uni.showToast({
					    icon: 'none',
					    title: '提交成功'
					  })
					  // // debugger
					  // this.getOpenerEventChannel().emit('refreshData')
					  setTimeout(() => uni.reLaunch({
					  	url:"/pages/home/home"
					  }), 500)
					  
					  //提交成功后跳转至订单列表页面
					}).catch(e=>{
						console.log( "odb上传失败");
						console.log(e);
					})
					
				}).catch(errors => {
					console.log("error here")
					console.log(errors);
					uni.$u.toast('请完整填写数据')
				})
				
				
			},
			hideKeyboard() {
				uni.hideKeyboard()
			},
			setDefaultValue(){
				this.agreed.userInfo={
					name:this.$store.state.user.info.nickname,
					phoneNumber:this.$store.state.user.info.mobile
				}
				this.stepActive=-1
				uni.getPushClientId({
						success: (res) => {
							this.agreed.order_push_clientid=res.cid
						},
						fail(err) {
							console.log('获取手机识别码失败')
						}
					})
			},
			getDataByPhoerId(id){
				uniCloud.database().collection('photographer').where({
					userId:id
				}).get().then(res=>{
					if(res.result.data.length>0){
						let phoerMsg=res.result.data[0]
						console.log("pMG here");
						console.log(this.phoerMsg);
						this.agreed={
							...this.agreed,
							phoerId:phoerMsg.userId,
							phoerPhoneNumber:phoerMsg.phoneNumber,
							phoerName:phoerMsg.name,
							phoerShowUrl:phoerMsg.phoerShow[0],
							phoerIntro:phoerMsg.intro,
							phoer_push_clientid:phoerMsg.push_clientid
						}
					}
					else{
						
					}
				})
			},
			//接单
			takeOrder(){
				if(this.agreed.userId==this.$store.state.user.info._id){
					return uni.$u.toast('不能自己接自己单，人不能左脚踩右脚上天')
				}
				let id = this.agreed._id
				let updatedAgreed={...this.agreed,
					phoerId:this.agreed.phoerId,
					phoerPhoneNumber:this.agreed.phoerPhoneNumber,
					phoerName:this.agreed.phoerName,
					phoerShowUrl:this.agreed.phoerShowUrl,
					phoerIntro:this.agreed.phoerIntro,
					orderStatus:1,
					phoer_push_clientid:this.agreed.phoer_push_clientid}
				delete updatedAgreed._id
				
				odb.doc(id).update(updatedAgreed).then(res=>{
					console.log("takeOrder success");
					console.log(res);
					// #ifde APP
					uniCloud.callFunction({
						name:"push2",
						data:{
							cid:this.agreed.order_push_clientid,
							title:"预约有响应",
							content:"有摄影师接了响应了您的预约",
							payload:{
								fabShowText:"摄影师"+this.agreed.phoerName+"响应了你的订单",
								url:'/pages/order/verifyOrder?orderWaitPhoerMsg=',
								msg:{orderWaitPhoer:true,...updatedAgreed,_id:id}
							}
						}
					})
					// #endi
					uni.showModal({
						content:"接单操作完成，等待对方同意即可"
					})
					setTimeout(() => uni.navigateBack({
						delta: 2
					}), 1500)
				}).catch(res=>{
					console.log("update fail");
					console.log(res);
				})
			},
			editOrder(){
				odb.doc(this.agreed._id).update({
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
				odb.doc(this.agreed._id).remove().then(res=>{
					uni.showToast({
						title:"删除完成"
					}),
					setTimeout(() => uni.navigateBack({
						delta: 2
					}), 500)
				})
			},
			completeOrder(){
				odb.doc(this.agreed._id).update({
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
				console.log("yuyue agreed here");
				console.log(this.agreed);
				this.$refs.form1.validate().then(res => {
					// uni.$u.toast('校验通过')
					this.agreed.orderStatus=101
					odb.add(this.agreed).then((res) => {
					// #ifde APP
					//用户预约摄影师
					uniCloud.callFunction({
						name:"push2",
						data:{
							cid:this.agreed.phoer_push_clientid,
							title:"有新的预约",
							content:"有用户找你约拍",
							payload:{
								fabShowText:"用户"+this.agreed.userInfo.name+"找你预约了以下订单",
								url:'/pages/order/verifyOrder?phoerWaitOrderMsg=',
								msg:{phoerWaitOrder:true,...this.agreed,_id:res.result.id},
							}
						}
					}).then(()=>{
						uni.showToast({
							title:"已发起预约"
						})
						setTimeout(() => uni.reLaunch({
							url:"/pages/home/home"
						}), 1000)
					}).catch(e=>{
						console.log("yuyue fail");
						console.log(e);
					})
					// #endi
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
