import axios from "axios";
import {ref, watchEffect} from "vue";
import store from "@/store";

const resource = "https://8.130.43.166:8081/api/voice"
let mediaRecorder
let audio
let audioChunks = []

const usingVoice = (action) => {
    if (action === 'start'){
        startRecording()
    }else if(action === 'stop'){
        stopRecording()
    }
}

const startRecording = () => {
    navigator.mediaDevices.getUserMedia({audio: true})
        .then(stream => {
            //  实例化一个媒体录制接口
            mediaRecorder = new MediaRecorder(stream);
            //  开始录制
            mediaRecorder.start();
            //  监听是否产生可用音频数据，若有，则将该数据推到音频数据缓冲区中
            mediaRecorder.addEventListener("dataavailable", event => {
                if (audioChunks.length === 1){
                    audioChunks = []
                }
                audioChunks.push(event.data)
            });
        })
}


/**  监听停止录制事件，并进行如下处理:
 1.  将音频数据缓冲区的数据转合并为 Blob 对象
 2.  通过 Blob 对象生成一个完整的音频资源 URL
 3.  创建一个 Audio 对象，该对象将存储一个完整可播放的音频资源
 4.  监听音频是否可被完整播放，如果可被完整播放，则表明该音频资源完整
 5.  上传音频文件，并获取到响应中给予的 download url
 6.  获取音频总时长需要达成完整播放音频这一条件，再此使用了预加载实现
 7.  预加载意味着生成一个随机的播放节点时间，以达成快进目的，不断循环新的节点时间，直到获取到完整时间
 */

const stopRecording = () => {
    mediaRecorder.stop();
    mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks);
        audio = new Audio(URL.createObjectURL(audioBlob));
        const url = ref('')
        const duration = ref()
        audio.addEventListener('canplaythrough', async () => {
            while (isNaN(audio.duration) || audio.duration === Infinity) {
                await new Promise(resolve => setTimeout(resolve, 200));
                audio.currentTime = 10000000 * Math.random();
            }
            duration.value = Math.round(audio.duration)
        })
        watchEffect(()=>{
            if (duration.value){
                getVoiceDownloadUrl(audioBlob).then(res => {
                    url.value = res.data
                    let obj = {
                        voiceUrl: url.value,
                        duration: duration.value
                    }
                    store.dispatch('updataVoiceObj', obj)
                })
            }
        })
    });
}

let voice_audio
const playRecording = async (voiceUrl) => {
    voice_audio = new Audio(voiceUrl); // 创建一个新的语音对象
    voice_audio.type = 'audio/wav';
    await voice_audio.play(); // 播放新的语音
}

const playRecordingPause = () => {
    voice_audio.pause()
}

const getVoiceDownloadUrl = (audioBlob) => {
    const formData = new FormData();
    formData.append("voice", audioBlob, "recording.wav");
    return axios.post(resource, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

export {
    usingVoice,
    playRecording,
    playRecordingPause
}


