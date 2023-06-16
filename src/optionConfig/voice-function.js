import Recorder from 'recorder-js';
import audioBufferToWav from 'audiobuffer-to-wav'
import WaveformData from "waveform-data";


// 创建一个音频上下文对象
const audioContext = new AudioContext()

// 创建一个Recorder实例
const recorder = new Recorder(audioContext, {
    // 设置录音格式为.wav
    encoderPath: 'waveWorker.min.js'
});

const startVoice = () => {
    // 获取用户的麦克风输入
    navigator.mediaDevices.getUserMedia({audio: true})
        .then((stream) => {
            // 开始录音
            recorder.init(stream);
            recorder.start();
            console.log('Recording...');
        })
        .catch((err) => {
            console.error('Could not get user media', err);
        });
    // 设置一个定时器，10秒后停止录音并上传
    setTimeout(() => {
        // 停止录音
        recorder.stop()
            .then(({blob, buffer}) => {
                console.log(buffer)
                let audioBuffer = audioContext.createBuffer(
                    2,     // 双声道
                    44100, // 44100采样点
                    44100);
                let float32Buffer = convertToFloat32(buffer);
                audioBuffer.copyToChannel(float32Buffer, 0);
                // 将音频缓冲区转换为.wav格式的Blob对象
                let wavBlob = new Blob([audioBufferToWav(audioBuffer)], {type: 'audio/wav'});
                // 创建一个表单数据对象
                let formData = new FormData();
                // 将音频文件添加到表单中，命名为file
                formData.append('file', wavBlob, 'audio.wav');
                console.log(wavBlob)
                // 使用axios发送表单数据到后端API
                console.log(blob)
                // 根据音频缓冲区获取波纹数组和录音时长
                let arrayBuffer = convertToArrayBuffer(buffer);
                console.log(arrayBuffer)
                let waveform = WaveformData.create(arrayBuffer);
                let duration = buffer.duration;
                // 打印波纹数组和录音时长
                console.log('Waveform:', waveform.min.concat(waveform.max));
                console.log('Duration:', duration);
            });
    }, 3000);
}

const convertToFloat32 = (buffer) => {
    // 把 buffer 数据复制到 float32Buffer
    return new Float32Array(buffer.length);
}

const convertToArrayBuffer = (buffer) => {
    let bufferView = new Uint8Array(buffer);
    return bufferView.buffer;
}

export {
    startVoice
}
