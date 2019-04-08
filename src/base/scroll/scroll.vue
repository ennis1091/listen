<template>
	<div ref="wrapper">
		<slot></slot>
	</div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll'

	export default {
		props: {
			probeType:{
				type:Number,
				default:1   //1是节流  要实时监听是3
			},
			click: {
				type:Boolean,
				default:true
			},
			data: {
				type: Array,
				default:null
			},
			listenScroll: {
				type:Boolean,
				default:false
			}
		},
		mounted() {
			setTimeout(() => {
				this._initScroll()
			},20)
		},
		methods: {
			_initScroll() {
				if(!this.$refs.wrapper){
					return
				}
				this.scroll = new BScroll(this.$refs.wrapper,{
					probeType:this.probeType,
					click:this.click
				})

				if (this.listenScroll) {
					let me = this
					this.scroll.on('scroll',(pos) => {
						me.$emit('scroll',pos) //betterscroll 里会改变this指针 指向scroll实例 pos是位置对象，有x，y属性
					})
				}
			},
			enable() {
				this.scroll && this.scroll.enable() //作用：启用 better-scroll, 默认 开启。
			},
			disable() {
				this.scroll && this.scroll.disable()
			},
			refresh() {
				this.scroll && this.scroll.refresh()
			},
			scrollTo() {
				this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments)
			},
			scrollToElement() {
				this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
			}
		},
		watch: {
			data() {
				setTimeout(() => {
					this.refresh()
				},20)
			}
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>