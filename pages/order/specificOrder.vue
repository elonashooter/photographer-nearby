<template>
	<view class="u-page">
		<view class="u-demo-block">
			<text class="u-demo-block__title">完善预约信息</text>
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
				<u-button
					type="primary"
					:text="SubmitButtonText"
					customStyle="margin-top: 50px"
					@click="submit"
				></u-button>
				<!-- 选择拍摄时间的日期弹出组件 -->
				<u-datetime-picker
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
									<u--text text="价格可以与摄影师协商,\n双方达成共识后支付" type="warning"></u--text>
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
			<u-empty
				mode="message"
				icon="/static/history.png">
			</u-empty>
			
						
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				fileList1: [],
				showTime: false,
				showPopup:false,
				SubmitButtonText:'',
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
					userId:this.$store.state.user.info._id
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
		onLoad() {
			this.checkPhoer()
			this.init()
			this.SubmitButtonText=this.agreed._id?"修改":"提交"
			this.setDefaultValue()
		},
		methods: {
			checkPhoer(){
				
			},
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
					if(this.agreed._id){
						
					}
					else{
						this.odb.add(this.agreed).then((res) => {
							// console.log("res here");
							// console.log(res);
						  uni.showToast({
						    icon: 'none',
						    title: '提交成功'
						  })
						  // debugger
						  this.getOpenerEventChannel().emit('refreshData')
						  // setTimeout(() => uni.navigateBack(), 500)
						  
						  //提交成功后跳转至订单列表页面
						  uni.navigateTo({
						  	url:'/pages/home/orderList?order'
						  })
						}).catch((err) => {
						  uni.showModal({
						    content: err.message || '请求服务失败',
						    showCancel: false
						  })
						})
					}
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
			init(){ //初始化
				this.odb.get().then(res=>{
					if(res._id){
						this.agreed={...res}
					}
					else{
						
					}
				})
			},
		},
	}
</script>

<style lang="scss">
	.text-item {
		margin-right: 10px;
		flex: 1;
	}

</style>
