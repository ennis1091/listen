<template>
	<div class="singer" ref="singer"> 
		<listview :data="this.singers" ref="list" @select="selectSinger"></listview>
		<router-view></router-view>
	</div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/Singer'
  import listview from 'base/listview/listview'
  import {mapMutations} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'

  const hot_name = "热门"
  const hot_len = 10

  export default {
    mixins:[playlistMixin],
  	data() {
  		return{
  			singers: []
  		} 		
  	},
  	created() {
  		this._getSingerList()
  	},
  	components:{
  		listview
  	},
  	methods: {
      handlePlaylist(playList) {
        const bottom = playList.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
  		selectSinger(singer) {
  			this.$router.push({
  				path:`/singer/${singer.id}`
  			})
  			this.setSinger(singer)
  		},
  		_getSingerList() {
  			getSingerList().then((res) => {
  				if (res.code=== ERR_OK) {
  					this.singers = this._normalizaSinger(res.data.list)
  				}
  			})
  		},
  		_normalizaSinger(list) { //选取热门歌手 以及字母排序
  			let map={
  				hot:{
  					title:hot_name,
  					items:[]
  				}
  			}
  			list.forEach((item,index) => {
  				if (index<hot_len) {
  					map.hot.items.push(new Singer({
  						id:item.Fsinger_mid,
  						name:item.Fsinger_name
  					}))
  				}
  				const key = item.Findex
  				if(!map[key]){
  					map[key]={
  						title:key,
  						items:[]
  					}
  				}
  				map[key].items.push(new Singer({
  					id:item.Fsinger_mid,
  					name:item.Fsinger_name
  				}))
  			})
  			// 字母排序  处理map
  			let hot = []
  			let ret = []
  			for (let key in map) {
  				let val = map[key]
  				if (val.title.match(/[a-zA-Z]/)) {
  					ret.push(val)
  				}else if(val.title === hot_name){
  					hot.push(val)
  				}
  			}
  			ret.sort((a,b) => {
  				return a.title.charCodeAt(0) - b.title.charCodeAt(0)  //a-z排序
  			})
  			return hot.concat(ret) //合并数组
  		},
  		...mapMutations({
  			setSinger:'SET_SINGER'
  		})
  	}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	.singer
		position:fixed
		top:88px
		bottom:0
		width:100%
</style>