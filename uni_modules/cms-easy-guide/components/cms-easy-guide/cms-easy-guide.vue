<template>
	<view v-if="guideState">
		<view class="transparent-mask" @touchmove.stop.prevent @click="maskClick" />
		<view class="rect-shadow" @touchmove.stop.prevent @click="maskClick" :style="{
			width: reactInfo.width,
			height: reactInfo.height,
			left: reactInfo.left,
			top: reactInfo.top,
			borderRadius: reactInfo.borderRadius,
			border: reactInfo.border
		}">
			<image class="rect-img" :src="img.src" v-for="(img,i) of renderItem.imgs" @click.stop="clickImage(img)"
				:style="{
					width: img.self ? reactInfo.width : img.width,
					maxWidth: img.self ? reactInfo.width : img.width,
					height: img.self ? reactInfo.height :img.height,
					left: img.self ? 0 :img.left,
					top: img.self ? 0 :img.top,
					borderRadius: img.borderRadius
				}" />
		</view>

	</view>
</template>

<script>
	/**
	 * @guideOver 引导结束
	 * @guideProcess 引导进度回调
	 * */
	export default {
		data() {
			return {
				// 当前是否在引导状态
				guideState: false,
				guideList: [],
				guideIndex: 0,
				reactInfo: {
					left: 0,
					top: 0,
					width: 0,
					height: 0,
					borderRadius: ''
				}

			};
		},
		computed: {
			renderItem() {
				return this.guideList[this.guideIndex];
			}
		},
		methods: {
			// 开始引导事件
			startGuide(list, startIndex) {
				this.guideList = list;
				this.guideState = true;
				this.guideIndex = startIndex || 0;
				
				this.renderGuideElement(this.guideIndex);
			},
			// 点击image事件
			clickImage(item) {
				if (item.isNextButton) this.clickNextButton();
				item.clickEvent && item.clickEvent();
			},
			// 遮罩点击
			maskClick() {
				// 点击遮罩 && 可以跳过
				if (this.guideList[this.guideIndex].canMaskJump) {
					this.clickNextButton();
				}
			},
			// 用户点击下一个按钮
			clickNextButton() {
				if (this.guideIndex + 1 >= this.guideList.length) {
					this.guideState = false;
					// 引导流程结束
					this.$emit('guideOver');
					return;
				}
				this.$emit('guideProcess',this.guideIndex);
				this.guideIndex++;
				this.renderGuideElement(this.guideIndex);
			},
			// 渲染当前引导元素
			renderGuideElement(index) {
				this.$nextTick(() => {
					this.getReactInfo().then(res => {
						if (res) {
							this.reactInfo = {
								left: this.renderItem.left || res.left + 'px',
								// #ifdef H5
								top: this.renderItem.top || (res.top + 44) + 'px',
								// #endif
								// #ifndef H5
								top: this.renderItem.top || res.top + 'px',
								// #endif
								width: this.renderItem.width || res.width + 'px',
								height: this.renderItem.height || res.height + 'px',
								borderRadius: this.renderItem.borderRadius
							};
						}
					});
				});
			},
			// 获取元素的信息
			getReactInfo() {
				return new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this.$parent);
					query.select(this.renderItem.queryClass).boundingClientRect(data => {
						if (data) {
							resolve(data);
						} else {
							reject();
						}
					}).exec();
				})

			}
		}
	}
</script>

<style scoped lang="scss">
	.transparent-mask {
		position: fixed;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		z-index: 100;
	}

	.rect-shadow {
		position: fixed;
		border-radius: 12px;
		box-shadow: 0 0 0 3000px rgba(0, 0, 0, 0.8);
		z-index: 101;
		left: 0;
		top: 0;
		transform: translate(-10rpx, -10rpx);
		box-sizing: content-box;
		border: 10rpx solid #717171;
	}

	.rect-img {
		position: absolute;
		left: 0;
		top: 0;
		width: 0;
		height: 0;
	}
</style>
