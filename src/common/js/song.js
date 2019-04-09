import { getSongsUrl,getLyric } from 'api/song'
import { ERR_OK } from 'api/config'
import {Base64} from 'js-base64'

export default class Song {
	 constructor({id, mid, singer, name, album, duration, image, url}) {  //参数多可用对象传入
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.filename = `C400${this.mid}.m4a`
    this.url = url
  }
  getLyric() {
  	if (this.lyric) {
  		return Promise.resolve(this.lyric)
  	}
  	return new Promise((resolve,reject) => {
  		getLyric(this.mid).then((res) => {
  		if (res.retcode===ERR_OK) {
  			this.lyric = Base64.decode(res.lyric)
  			resolve(this.lyric)
  		}else{
  			reject('获取歌词失败')
  		}
  	})
  	
  	})
  }
}

export function createSong(musicData) {
	return new Song({
		id:musicData.songid,
		mid:musicData.songmid,
		singer:filterSinger(musicData.singer),
		name:musicData.songname,
		album:musicData.albumname,
		duration:musicData.interval,
		image:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
		url:musicData.url
	})
}

function filterSinger (singer) {
	let ret = []
	if (!singer) {
		return ''
	}
	 singer.forEach((i) => {
	 	ret.push(i.name)
	 })
	 return ret.join('/')
}

export function isValidMusic(musicData) {
  return musicData.songid && musicData.albummid && (!musicData.pay || musicData.pay.payalbumprice === 0)
}  //获取有效歌曲

export function processSongsUrl(songs) {
  
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  return getSongsUrl(songs).then((res) => {   
    if (res.code === ERR_OK) {
      console.log("res")
      console.log(res)
      let midUrlInfo = res.url_mid.data.midurlinfo     
      midUrlInfo.forEach((info, index) => {   //把url 拼接 赋值给 song实例
      	let song = songs[index]       
        song.url = `http://dl.stream.qqmusic.qq.com/${info.purl}`
      })
      console.log("midUrlInfo")
      console.log(midUrlInfo)
    }
    let newsongs=songs.filter(item => item.url!="http://dl.stream.qqmusic.qq.com/") //新添加 过滤地址为空的purl
    console.log("processSongsUrl")
    console.log(newsongs)
    return newsongs    
  })
}