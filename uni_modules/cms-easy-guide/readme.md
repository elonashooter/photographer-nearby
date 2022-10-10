# Easy-Guide 图片抠图引导组件

1. uni_modules方式引入无需import 直接使用```<cms-easy-guide ref="easyGuide" />``` 即可。
2. 本组件目前只支持图片形式的引导
**3. 只能查询组件的父级元素的定位**



### 事件

| 事件名称      | 描述               |
| ------------- | ------------------ |
| @guideOver    | 引导结束           |
| @guideProcess | 引导进度 返回Index |

### 参数

| 参数                | 描述                         | 是否必填 | 默认值 |
| ------------------- | ---------------------------- | -------- | ------ |
| queryClass          | 引导元素的类名不要重复       | Y        | ''     |
| canMaskJump         | 是否允许点击黑色遮罩跳过引导 | N        | false  |
| imgs[]>width        | 图片宽(rpx\|%)               | Y        | ''     |
| imgs[]>height       | 图片高(rpx\|%)               | Y        | ''     |
| imgs[]>left         | 以引导元素左上角定位         | Y        | ''     |
| imgs[]>top          | 以引导元素左上角定位         | Y        | ''     |
| imgs[]>src          | 图片的地址                   | Y        | ''     |
| imgs[]>clickEvent   | 图片点击事件 @clickEvent     | N        | null   |
| imgs[]>isNextButton | 是否需点击元素进行下一个引导 | N        | false  |

### 示例demo如下

```vue
<template>
	<view>
		<cms-easy-guide ref="easyGuide" />

		<view class="guide guide1">引导块1</view>
		<view class="guide guide2">引导块2</view>
		<view class="guide guide3">引导块3</view>
		<view class="guide guide4">引导块4</view>

		<button type="primary" @click="startProcess" size="default" >开始引导</button>
	</view>
</template>


<script>
	export default {
		methods: {
			startProcess() {
				this.$refs.easyGuide.startGuide([
					
					// 引导元素1
					{
						queryClass: '.guide1', // 针对那块元素进行引导
						// canMaskJump: true, // 是否可以通过点击mask遮罩下一步
						imgs: [{ // imgs 引导图片
							width: '569rpx',				// 图片宽
							height: '183rpx',				// 图片高
							left: '-60rpx',					// 以引导元素左上角定位
							top: '-100rpx',					// 以引导元素左上角定位
							src: '/static/tips2.png',		// 图片连接
							clickEvent:()=>{				// 点击事件
								console.log('clickEvent')
							}
						}, {
							width: '223rpx',				// 图片宽
							height: '116rpx',				// 图片高
							left: '200rpx',					// 以引导元素左上角定位
							top: '200rpx',					// 以引导元素左上角定位
							src: '/static/tips2-btn.png',	// 图片连接
							isNextButton: true,				// 是否需点击元素进行下一个引导
							clickEvent:()=>{				// 点击事件
								console.log('clickEvent')
							}
						}]
					},
					
					// 引导元素2
					{
						queryClass: '.guide2', // 针对那块元素进行引导
						// canMaskJump: true, // 是否可以通过点击mask遮罩下一步
						imgs: [{ // imgs 引导图片
							width: '569rpx',				// 图片宽
							height: '183rpx',				// 图片高
							left: '-60rpx',					// 以引导元素左上角定位
							top: '-100rpx',					// 以引导元素左上角定位
							src: '/static/tips2.png',		// 图片连接
							clickEvent:()=>{				// 点击事件
								console.log('clickEvent')
							}
						}, {
							width: '223rpx',				// 图片宽
							height: '116rpx',				// 图片高
							left: '200rpx',					// 以引导元素左上角定位
							top: '200rpx',					// 以引导元素左上角定位
							src: '/static/tips2-btn.png',	// 图片连接
							isNextButton: true,				// 是否需点击元素进行下一个引导
							clickEvent:()=>{				// 点击事件
								console.log('clickEvent')
							}
						}]
					},
					
					// 引导元素3
					{
						queryClass: '.guide3', // 针对那块元素进行引导
						// canMaskJump: true, // 是否可以通过点击mask遮罩下一步
						imgs: [{ // imgs 引导图片
							width: '563rpx',				// 图片宽
							height: '186rpx',				// 图片高
							left: '-200rpx',					// 以引导元素左上角定位
							top: '-200rpx',					// 以引导元素左上角定位
							src: '/static/tips3.png',		// 图片连接
							clickEvent:()=>{				// 点击事件
								console.log('clickEvent')
							}
						}, {
							width: '223rpx',				// 图片宽
							height: '116rpx',				// 图片高
							left: '0',					// 以引导元素左上角定位
							top: '200rpx',					// 以引导元素左上角定位
							src: '/static/tips2-btn.png',	// 图片连接
							isNextButton: true,				// 是否需点击元素进行下一个引导
							clickEvent:()=>{				// 点击事件
								console.log('clickEvent')
							}
						}]
					},
					
					// 引导元素4
					{
						queryClass: '.guide4', // 针对那块元素进行引导
						// canMaskJump: true, // 是否可以通过点击mask遮罩下一步
						imgs: [{ // imgs 引导图片
							width: '563rpx',				// 图片宽
							height: '186rpx',				// 图片高
							left: '-200rpx',					// 以引导元素左上角定位
							top: '-200rpx',					// 以引导元素左上角定位
							src: '/static/tips3.png',		// 图片连接
							clickEvent:()=>{				// 点击事件
								console.log('clickEvent')
							}
						}, {
							width: '223rpx',				// 图片宽
							height: '116rpx',				// 图片高
							left: '200rpx',					// 以引导元素左上角定位
							top: '200rpx',					// 以引导元素左上角定位
							src: '/static/tips2-btn.png',	// 图片连接
							isNextButton: true,				// 是否需点击元素进行下一个引导
							clickEvent:()=>{				// 点击事件
								console.log('clickEvent')
							}
						}]
					},
					
					
				])
			}
		}
	}
</script>

<style scoped lang="scss">
	.guide {
		position: absolute;
		padding: 50rpx;
		color: #222;
		font-size: 30rpx;
		display: inline-block;
		border: 1rpx solid #000;
	}

	.guide1 {
		top: 20%;
		left: 20%;
		background-color: rgba(130, 225, 100, 0.1);
	}

	.guide2 {
		left: 20%;
		    top: 50%;
		background-color: rgba(178, 36, 225, 0.1);
	}

	.guide3 {
		left: 50%;
		bottom: 50%;
		background-color: rgba(225, 139, 200, 0.1);
	}

	.guide4 {
		right: 30%;
		top: 70%;
		background-color: rgba(225, 67, 36, 0.1);
	}

	button {
		position: absolute;
		width: 100%;
		font-size: 36rpx;
		left: 0;
		bottom: 5%;
	}
</style>

```

