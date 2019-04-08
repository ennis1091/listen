import {playMode} from 'common/js/config'
const state ={
	singer:{},
	playing:false,
	fullScreen:false,
	playList:[],
	sequenceList:[], //顺序列表 
	mode:playMode.sequence,
	currentIndex:-1, //当前播放索引
	disc:{}
}

export default state