<template>
	<view class="u-page">
		<view class="u-demo-block">
			<text class="u-demo-block__title">摄影师信息编辑</text>
			<view class="u-demo-block__content">
				<!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
				<u--form labelPosition="left" :model="phoerInfo" ref="form1">
					<u-form-item
						label="姓名"
						prop="name"
						borderBottom
						ref="item1"
					>
						<u--input
							v-model="phoerInfo.name"
							border="none"
							placeholder="中文姓名"
							:disabled="inputDisable"
						></u--input>
						<span style="margin:0ch 1ch;">电话</span>
						<u--input
							v-model="phoerInfo.phoneNumber"
							border="none"
							placeholder="联系电话"
							:disabled="inputDisable"
						>
							<template slot="suffix">
								<u-icon
									size="28"
									name='phone'
									@click="phoneCall()"
								></u-icon>
							</template>
						</u--input>
					</u-form-item>
					<u-form-item
						label=""
						borderBottom
						ref="item2"
					>
						<view class="uni-uploader">
							<view class="uni-uploader-head">
								<view class="uni-uploader-title">个人形象图片</view>
								<view class="uni-uploader-info">								
								<u-button
									text="说明"
									type="warning"
									size="small"
									@click="popupOpen()"
								></u-button></view>
							</view>
							<view class="uni-uploader-body">
								<view class="uni-uploader__files">
									<block>
										<view class="uni-uploader__file">
											<image class="uni-uploader__img" :src="phoerInfo.phoerShow" :data-src="phoerInfo.phoerShow" @tap="previewImage"></image>
										</view>
									</block>
									<view class="uni-uploader__input-box">
										<view class="uni-uploader__input" @tap="chooseImage('phoerInfo.phoerShow')"></view>
									</view>
								</view>
							</view>
						</view>
					</u-form-item>

					<u-form-item
						label="自荐"
						prop="intro"
						borderBottom
						ref="item3"
					>
						<u--textarea
							placeholder="填写擅长的内容，也可当个性签名使用"
							v-model="phoerInfo.intro"
							count
							confirmType="done"
							:disabled="inputDisable"
						></u--textarea>
					</u-form-item>
					<u-form-item
						label="代表作"
						prop="symbols"
						ref="item5"
					>
<!-- 						<u-album
							:urls="urls2"
							multipleSize="68"
						></u-album> -->
					</u-form-item>
					<view class="uni-uploader">
						<view class="uni-uploader-head">
							<view class="uni-uploader-title">点击可预览选好的图片</view>
							<view class="uni-uploader-info">{{phoerInfo.symbols.length}}/9</view>
						</view>
						<view class="uni-uploader-body">
							<view class="uni-uploader__files">
								<block v-for="(image,index) in phoerInfo.symbols" :key="index">
									<view class="uni-uploader__file">
										<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage"></image>
									</view>
								</block>
								<view class="uni-uploader__input-box">
									<view class="uni-uploader__input" @tap="chooseImage()"></view>
								</view>
							</view>
						</view>
					</view>
					<view style="margin: 20rpx 10rpx;" v-if="phoerId==phoerInfo.userId">
						<u--text
							text='作品名称'
							type="warning"
						></u--text>
						<u--input
							v-model="phoerInfo.symbolsTag"
							placeholder="用户可能会根据名字查找照片"
							border="surround"
							shape="circle"
							:disabled="inputDisable"
						></u--input>
					</view>
					<view style="margin: 20rpx 10rpx;" v-else="phoerId!==userId">
						<u--text
							:text="'作品名:  '+phoerInfo.symbolsTag"
							type="warning"
						></u--text>
					</view>
					<u-line></u-line>
				</u--form>
				<u-button
					type="primary"
					:text="SubmitButtonText"
					customStyle="margin-top: 30px"
					@click="submit"
				></u-button>
			</view>
			
			<view class="u-page" v-if="phoerId==phoerInfo.userId">
				用户查看到的效果：
				<u-list>
					<u-list-item>
						<u-cell
							:title="phoerInfo.name"
							:value="phoerInfo.intro"
							center
							:label="phoerInfo.phoneNumber"
						>
							<u-avatar
								slot="icon"
								shape="square"
								size="70"
								src="https://cdn.uviewui.com/uview/album/1.jpg"
								customStyle="margin: -3px 5px -3px 0"
							></u-avatar>
						</u-cell>
					</u-list-item>
				</u-list>
			</view>
			<!-- “个人形象”弹出框 -->
			<u-popup
				mode="right"
				:show="showPopup"
				round="0"
				@close="popupClose()"
				@open="popupOpen()"
			>
				<view class="u-page">
					<view class="u-demo-block">
						<text class="u-demo-block__title">能力审核</text>
						<view class="u-demo-block__content">
							<view class="text-item">
								<u--text text="请提交一张"></u--text>
								<u--text text="最能体现个人摄影水平的\n形象照," type='error'></u--text>
								<u--text text="此照用以确认申请人为本人\n同时确认申请人水平"></u--text>
							</view>
						</view>
					</view>
					<view class="u-demo-block">
						<text class="u-demo-block__title">可使用头像</text>
						<view class="u-demo-block__content">
							<view class="text-item">
								<u--text text="若已将个人形象照设为头像"></u--text>
								<u--text text="可直接点击"></u--text>
								<u-button
									text="同步头像"
									type="success"
									size="normal"
								></u-button>
							</view>
						</view>
					</view>
					<view class="u-demo-block">
						<text class="u-demo-block__title">肖像权</text>
						<view class="u-demo-block__content">
							<view class="text-item">
								<u--text text="此照片仅用于\n让用tong户xue在此app内搜到\n"></u--text>
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
<!-- 			<u-empty
				mode="message"
				icon="/static/history.png">
			</u-empty> -->
						
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showPopup:false,
				SubmitButtonText:'',
				inputDisable:'',
				phoerInfo: {
					name: '',
					phoneNumber: '',
					intro: '',
					symbols:[],//作品对象
					symbolsTag:'朝花夕拾',//作品名称
					userId:this.$store.state.user.info._id,
					symbolsUrl:[],
					phoerShow:"",//摄影师形象对象
					phoerShowUrl:"",//摄影师形象连接
				},
				phoerId:'',//从phoerList点进来传来的参数
				presentCharacter:'',
				testV:"123",
				rules: {
					'name': [{
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
					intro: {
						type: 'string',
						min: 3,
						required: true,
						message: '不低于3个字',
						trigger: ['change']
					},

					// "symbols":{
					// 	type: 'number',
					// 	required: true,
					// 	message: '作品记录会展示给下单的同学',
					// 	trigger: ['change']
					// }
				},
			}
		},
		onReady() {
			// 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则

			//



			this.$refs.form1.setRules(this.rules)
		},
		onLoad(e) {		//根据传来的参数确定是什么角色点进来的
			// 已是摄影师if(e.phoerId&&phoerId==this.phoerInfo.userId)=true  新申请摄影师if(e)=false  预约用户if(e.phoerId)=true
			// console.log(e.phoerId);  //???不知道为什么会执行两次
			if(e.phoerId){
				this.phoerId=e.phoerId  //其他页面传过来的
				this.pdb.where({userId:this.phoerId}).get().then(res=>{
					this.phoerInfo={...res}
				})
				if(e.phoerId==this.phoerInfo.userId){
					//已是摄影师修改
					this.inputDisable=false
					this.presentCharacter="phoer"
					this.SubmitButtonText="修改"
				}else{
					//用户预约
					this.inputDisable=true
					this.presentCharacter="order"
					this.SubmitButtonText="预约"
				}
			}else{
				//新摄影师申请
				this.inputDisable=false
				this.presentCharacter="newPhoer"
				this.SubmitButtonText="提交"
			}

			
			
			this.init()
		},
		methods: {
			popupOpen() {
				// console.log('open');
				this.showPopup = true
			},
			popupClose() {
				this.showPopup = false
				// console.log('close');
			},

			navigateBack() {
				uni.navigateBack()
			},


			submit() {
				// 校验表单  如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true
				this.$refs.form1.validate().then(res => {
					uni.$u.toast('校验通过')
				}).catch(errors => {
					uni.$u.toast('请完整填写数据')
				})
				
				if(this.presentCharacter=="phoer"){
					this.pdb.where({
						userId:this.phoerId
					}).update(this.phoerInfo).then(res=>{
						console.log(res);
					})
				}else if(this.presentCharacter=="order"){
					uni.navigateTo({
						url:'/pages/order/order?phoerInfo='+this.phoerInfo
					})
				}else if(this.presentCharacter=="newPhoer"){
					this.pdb.add(this.phoerInfo).then((res) => {
						// console.log("res here");
						// console.log(res);
					  uni.showToast({
					    icon: 'none',
					    title: '新增成功'
					  })
					  // debugger
					  this.getOpenerEventChannel().emit('refreshData')
					  // setTimeout(() => uni.navigateBack(), 500)
					}).catch((err) => {
					  uni.showModal({
					    content: err.message || '请求服务失败',
					    showCancel: false
					  })
					})
				}
				
			},
			hideKeyboard() {
				uni.hideKeyboard()
			},
			init(){ //初始化  phoer表有此id的数据则读取，没有数据则默认账户姓名和联系电话
				this.pdb.where({
					userId:this.$store.state.user.info._id
				}).get().then(res=>{
					if(res._id){
						this.phoerInfo={...res}
					}
					else{
						this.name=this.$store.state.user.info.nickname,
						this.phoneNumber=this.$store.state.user.info.mobile
					}
				})
			},
			// 代表作导入并预览  start
			previewImage: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.phoerInfo.symbols
				})
			},
			async checkPermission() {
				let status = permision.isIOS ? await permision.requestIOS(sourceType[type][0]) :
					await permision.requestAndroid('android.permission.READ_EXTERNAL_STORAGE');
				if (status === null || status === 1) {
					status = 1;
				} else {
					uni.showModal({
						content: "没有开启权限",
						confirmText: "设置",
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppSetting();
							}
						}
					})
				}
				return status;
			},
			chooseImage(){
				uni.chooseImage({
					count: 9,
					// sourceType: 'album',
					// sizeType: 'original',
					success: (res) => {
						this.phoerInfo.symbols=this.phoerInfo.symbols.concat(res.tempFilePaths)
					},
					fail: (err) => {
						console.log("err: ",err);
						// #ifdef APP-PLUS
						this.checkPermission();
						// #endif
						// #ifdef MP
						if(err.errMsg.indexOf('cancel') !== '-1'){
							return;
						}
						uni.getSetting({
							success: (res) => {
								let authStatus = false;
								authStatus = res.authSetting['scope.album'];
								}
								if (!authStatus) {
									uni.showModal({
										title: '授权失败',
										content: '获取相册图片权限失败，请在设置界面打开相关权限',
										success: (res) => {
											if (res.confirm) {
												uni.openSetting()
											}
										}
									})
								}
							}
						})
						// #endif
					}
				})
			},// 代表作导入并预览  end
			
			
			phoneCall(){
				console.log("phoneCall");
			},
		},
	}
</script>

<style lang="scss">
.uni-uploader {
	flex: 1;
	flex-direction: column;
}
.uni-uploader-head {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
.uni-uploader-info {
	color: #B2B2B2;
}
.uni-uploader-body {
	margin-top: 16rpx;
}
.uni-uploader__files {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}
.uni-uploader__file {
	margin: 10rpx;
	width: 210rpx;
	height: 210rpx;
}
.uni-uploader__img {
	display: block;
	width: 210rpx;
	height: 210rpx;
}
.uni-uploader__input-box {
	position: relative;
	margin:10rpx;
	width: 208rpx;
	height: 208rpx;
	border: 2rpx solid #D9D9D9;
}
.uni-uploader__input-box {
	position: relative;
	margin:10rpx;
	width: 208rpx;
	height: 208rpx;
	border: 2rpx solid #D9D9D9;
}
.uni-uploader__input-box:before,
.uni-uploader__input-box:after {
	content: " ";
	position: absolute;
	top: 50%;
	left: 50%;
	-webkit-transform: translate(-50%, -50%);
	transform: translate(-50%, -50%);
	background-color: #D9D9D9;
}
.uni-uploader__input-box:before {
	width: 4rpx;
	height: 79rpx;
}
.uni-uploader__input-box:after {
	width: 79rpx;
	height: 4rpx;
}
.uni-uploader__input-box:active {
	border-color: #999999;
}
.uni-uploader__input-box:active:before,
.uni-uploader__input-box:active:after {
	background-color: #999999;
}
.uni-uploader__input {
	position: absolute;
	z-index: 1;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
}
</style>
