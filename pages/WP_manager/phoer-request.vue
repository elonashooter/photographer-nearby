<template>
	<view class="u-page">
		<view class="u-demo-block">
			<text class="u-demo-block__title">摄影师信息编辑</text>
			<view class="u-demo-block__content">
				<!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
				<u--form labelPosition="left" :model="phoerInfo" ref="form1">
					<u-form-item
						label="姓名"
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
						label="自荐"
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
						ref="item5"
					>
					</u-form-item>
					<view class="uni-uploader">
						<view class="uni-uploader-head">
							<view class="uni-uploader-title">点击可预览选好的图片</view>
							<view class="uni-uploader-info">{{imageList.length}}/9</view>
						</view>
						<view class="uni-uploader-body">
							<view class="uni-uploader__files">
								<block v-for="(image,index) in imageList" :key="index">
									<view class="uni-uploader__file">
										<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage"></image>
									</view>
								</block>
								<view class="uni-uploader__input-box">
									<view class="uni-uploader__input" @tap="chooseImage"></view>
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
							v-model="phoerInfo.symbols"
							placeholder="用户可能会根据名字查找照片"
							border="surround"
							shape="circle"
							:disabled="inputDisable"
						></u--input>
					</view>
					<view style="margin: 20rpx 10rpx;" v-else="phoerId!==userId">
						<u--text
							:text="'作品名:  '+phoerInfo.symbols"
							type="warning"
						></u--text>
					</view>
					<u-line></u-line>
				</u--form>
				<u-button
					type="primary"
					text="通过"
					customStyle="margin-top: 30px"
					@click="submit"
				></u-button>
			</view>
			
			
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
				imageList:[],
				inputDisable:'',
				phoerInfo: {
					name: '',
					phoneNumber: '',
					intro: '',
					symbols:'朝花夕拾',//作品名称
				},
				phoerId:'',//从phoerList点进来传来的参数
			}
		},
		onReady() {

		},
		onLoad(e) {	
			// this.phoerId=e.phoerId
			this.init()
		},
		methods: {
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
				this.pdb.where({
						userId:this.phoerId
					}).update({
						WorkStatus:true
					}).then(res=>{
						uni.showToast({
						  icon: 'none',
						  title: '成功通过'
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
				
				
			},
			hideKeyboard() {
				uni.hideKeyboard()
			},
			init(){ //初始化  phoer表有此id的数据则读取，没有数据则默认账户姓名和联系电话
				// this.pdb.where({
				// 	userId:this.phoerInfo.userId
				// }).get().then(res=>{
				// 	if(res._id){
				// 		this.phoerInfo={...res}
				// 	}
				// 	else{

				// 	}
				// })
			},
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
