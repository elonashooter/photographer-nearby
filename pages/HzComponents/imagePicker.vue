<template>
	<view class="uni-uploader__files">
		<block v-for="(image,index) in images" :key="index">
			<view class="uni-uploader__file">
				<uni-icons type="closeempty" class="close" size="20" @click="DelImg(index)"></uni-icons>
				<image class="uni-uploader__img" mode="aspectFill" :src="image" :data-src="image" @tap="previewSymbols"></image>
			</view>
		</block>
		<view class="uni-uploader__input-box">
			<view class="uni-uploader__input" @tap="chooseImages()"></view>
		</view>
	</view>
</template>

<script>
	let imagesUploadMsg=[]
	let images_online=[]
	export default{
		props:{
			images:{
				type:Array
			},
			imageName:{
				type:String
			},
			count:{
				type:Number
			}
		},
		data(){
			return{
				
			}
		},
		methods:{
			chooseImages(){
				uni.chooseImage({
					sizeType:'compressed',
					count: this.count,
					success: (res) => {
						console.log(res);
						this.images=this.images.concat(res.tempFilePaths)
						for(let i=0;i<res.tempFilePaths.length;i++){
							imagesUploadMsg.push({  //增删新图
								name:this.imageName+this.$store.state.user.info._id+" "+imagesUploadMsg.length.toString(),
								url:res.tempFilePaths[i]
							})
						}
					},
				})
			},
			DelImg(index){
				if(images_online.includes(this.images[index])){
					this.$emit('delImg',this.images[index])
					// this.phoerInfo.symbolsUrl=this.phoerInfo.symbolsUrl.filter((x)=>x!=this.images[index])
				}else{
					imagesUploadMsg.filter((x)=>x.url!=this.images[index])//增删新图
				}
				this.images.splice(index,1)
			
			},
		}
	}
</script>

<style>
	.uni-uploader__files {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
</style>