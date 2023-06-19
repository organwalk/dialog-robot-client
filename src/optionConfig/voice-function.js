import axios from "axios";
import msg from "@/api/cloud/message";
import {ref, watch} from "vue";

let mediaRecorder
let audio

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
            console.log('start.....')

            //  监听是否产生可用音频数据，若有，则将该数据推到音频数据缓冲区中
            const audioChunks = [];
            mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
            });

            /**  监听停止录制事件，并进行如下处理:
             1.  将音频数据缓冲区的数据转合并为 Blob 对象
             2.  通过 Blob 对象生成一个完整的音频资源 URL
             3.  创建一个 Audio 对象，该对象将存储一个完整可播放的音频资源
             4.  监听音频是否可被完整播放，如果可被完整播放，则表明该音频资源完整
             5.  上传音频文件，并获取到响应中给予的 download url
             6.  获取音频总时长需要达成完整播放音频这一条件，再此使用了预加载实现
             7.  预加载意味着生成一个随机的播放节点时间，以达成快进目的，不断循环新的节点时间，直到获取到完整时间
             */


            mediaRecorder.addEventListener("stop", () => {
                const audioBlob = new Blob(audioChunks);
                audio = new Audio(URL.createObjectURL(audioBlob));
                const url = ref('')
                const duration = ref()
                getVoiceDownloadUrl(audioBlob).then(res => {
                    url.value = res.data
                })
                audio.addEventListener('canplaythrough', async () => {
                    await new Promise(resolve => {
                        let interval;
                        interval = setInterval(() => {
                            if (!isNaN(audio.duration) && audio.duration !== Infinity) {
                                clearInterval(interval);
                                resolve(audio.duration);
                            }
                        }, 200);
                    }).then(dur => {
                        duration.value = Math.round(dur)
                    })
                    watch([url, duration], ([newU, newD]) => {
                        console.log(duration)
                        if (newU && newD) {
                            msg('VocMsg', {
                                url: "https://organwalk.ink/api/voice/" + newU,
                                duration: newD
                            })
                        }
                    })
                })
            });
        })
}

const stopRecording = () => {
    mediaRecorder.stop();
    console.log('stop..........')
}

const playRecording = async () => {
    await audio.play()
}

const getVoiceDownloadUrl = (audioBlob) => {
    const formData = new FormData();
    formData.append("voice", audioBlob, "recording.wav");
    return axios.post("https://organwalk.ink/api/voice", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

export {
    usingVoice,
    playRecording
}

