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
								<view class="uni-uploader-title">个人形象</view>
							</view>
							<view class="uni-uploader-body">
								<view class="uni-uploader__files">
									<block v-for="(image,index) in phoerInfo.phoerShow" :key="index">
										<view class="uni-uploader__file">
											<image class="uni-uploader__img" :src="image" mode="aspectFill" :data-src="image" @tap="previewPhoerShow"></image>
										</view>
									</block>
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
					</u-form-item>
					<view class="uni-uploader" v-if="phoerInfo.phoerShow[0]!==undefined">
						<view class="uni-uploader-head">
							<view class="uni-uploader-title">点击可预览选好的图片</view>
							<view class="uni-uploader-info">{{symbols.length}}/9</view>
						</view>
						<view class="uni-uploader-body">
							<view class="uni-uploader__files">
								<block v-for="(image,index) in symbols" :key="index">
									<view class="uni-uploader__file">
										<!-- 注：uni.preview函数写在这只能是不加括号的，不然会报错 -->
										<image class="uni-uploader__img" mode="aspectFill" :src="image" :data-src="image" @tap="previewSymbols"></image>
									</view>
								</block>
							</view>
						</view>
					</view>
					<view style="margin: 20rpx 10rpx;" >
						<u--text
							:text="'作品名:  '+phoerInfo.symbolsTag"
							type="warning"
						></u--text>
					</view>
					<u-line></u-line>
				</u--form>
				<u-button
					type="success"
					text="通过"
					customStyle="margin-top: 30px;width:600rpx"
					@click="submit"
				></u-button>
				<u-button
					type="error"
					text="驳回"
					customStyle="margin-top: 10px;width:600rpx"
					@click="popupOpen()"
				></u-button>
			</view>
			
			
		
			<!-- 提交提示弹出框 -->
			<u-modal
				:show="showModal"
				title="确认信息填写无误"
				content="提交成功后,直到审核通过或驳回之前无法修改"
				showCancelButton
				closeOnClickOverlay
				@confirm="modalConfirm()"
				@cancel="() => showModal = false"
			></u-modal>
			<!-- 驳回信息弹出框 -->
			<u-popup
				mode="bottom"
				:show="showPopup"
				round="0"
				@close="popupClose()"
				@open="popupOpen()"
			>
				<view class="u-page">
					<view class="u-demo-block">
						<text class="u-demo-block__title">填写驳回理由</text>
						<u-textarea
						v-model="rejectReason"
						placeholder="若只是希望小改一些信息,仍希望让此人加入,可以先通过,后再修改"
						confirmType="done"
						></u-textarea>
						<u-button
							text="确认驳回"
							type="error"
							size="normal"
							@click="reject()"
							customStyle="margin-top:10rpx"
						></u-button>
					</view>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showModal:false,//提交确认框
				showPopup:false,//驳回信息弹出框
				inputDisable:'',
				phoerInfo: {
					name: '',
					phoneNumber: '',
					intro: '',
					symbolsTag:'',//作品名称
					symbolsUrl:[],
					phoerShow:[],//摄影师形象对象  本来可以直接用字符串的，但uni.preview的预览参数格式为uni.chooseimage返回的数组请求体格式
					phoerShowUrl:"",//摄影师形象连接
					userId:this.$store.state.user.info._id,
				},
				rejectReason:'',
				phoerShowName:'',
				symbolsUploadMsg:[],
				symbols:[],//作品对象
				phoerId:'',//从phoerList点进来传来的参数
				rules: {
					'name': [{
						type: 'string',
						required: true,
						message: '请填写姓名',
						trigger: ['blur', 'change']
					}, ],
					intro: {
						type: 'string',
						min: 3,
						required: true,
						message: '不低于3个字',
						trigger: ['change']
					},
				},
			}
		},
		onReady() {
			// 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
			this.$refs.form1.setRules(this.rules)
		},
		onLoad(e) {		//根据传来的参数确定是什么角色点进来的
			// 只有管理员
			console.log("onload get an e");
			console.log(e);
			if(e._id){
				
				this.phoerId=e._id  //其他页面传过来的请求id
				this.ppdb.doc(e._id).get().then(res=>{
					// this.phoerInfo={...res}
					// console.log("ppdb");
					console.log(res.result.data);
					this.phoerInfo=res.result.data[res.result.data.length-1] //最新数据
					this.symbols=this.phoerInfo.symbolsUrl
				})
			}else{

			}
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
			openModal(){
				this.showModal=true
			},
			modalConfirm(){
				this.showModal=false
				this.getImgUrlAndUpload()
			},
			navigateBack() {
				uni.navigateBack()
			},
			async submit() {
				//pre-phoer状态为已完成  新增一个摄影师
				await this.ppdb.doc(this.phoerId).update({
					AuditStatus:1 ,//1即为通过
					rejectReason:'',
					requestTimes:this.phoerInfo.requestTimes+1
				})
				let pdbMsg=this.phoerInfo
				// 删除审核状态字段和拒绝理由字段
				delete pdbMsg._id
				delete pdbMsg.AuditStatus
				delete pdbMsg.rejectReason
				if(this.phoerInfo.requestTimes>0){
					await this.pdb.doc(this.phoerId).update(pdbMsg)
				}else{
					await this.pdb.add(pdbMsg)
					uniCloud.database().collection('uni-id-users').where({
						_id:this.phoerInfo.userId
					}).update({
						role:['photographer']
					})
				}
				uni.navigateBack()
				

			},
			reject(){
				this.ppdb.doc(this.phoerInfo._id).update({
					AuditStatus:2,//2即为驳回
					rejectReason:this.rejectReason
				}).then(e=>{
					uni.showToast({
					  icon: 'none',
					  title: '驳回操作完成'
					})
					setTimeout(()=>{
						uni.navigateBack()
					},1000)
				}).catch(e=>{
					console.log("reject fail");
					console.log(e);
				})
			},
			// 代表作导入并预览  start
			previewPhoerShow: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.phoerInfo.phoerShow
				})
			},
			previewSymbols: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.symbols
				})
			},
			
			phoneCall(){
				console.log("phoneCall");
				// #ifdef APP-PLUS
				uni.makePhoneCall({
					phoneNumber:this.phoerInfo.phoneNumber
				})
				// #endif
			}
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
	position: relative;
	margin: 10rpx;
	width: 210rpx;
	height: 210rpx;
}
.uni-uploader__img{
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
.close{
	position: absolute;
	right: 0;
	background-color: rgba(0, 0, 0, .4);
	color:#fff;
	z-index:10
}	
</style>
