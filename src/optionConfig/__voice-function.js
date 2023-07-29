const { ipcRenderer } = require('electron');
const axios = require('axios');
const { ref, watchEffect } = require('vue');
const store = require('@/store');

const resource = 'http://47.122.19.138:38081/api/voice';

let audio;
let audioChunks = [];

const usingVoice = (action) => {
  if (action === 'start') {
    startRecording();
  } else if (action === 'stop') {
    stopRecording();
  }
};

const startRecording = () => {
  console.log(audioChunks.length);
  ipcRenderer.send('START_RECORDING');
};

const stopRecording = () => {
  ipcRenderer.send('STOP_RECORDING');
};

let voice_audio;
const playRecording = async (voiceUrl) => {
  if (voice_audio) {
    voice_audio.pause();
  }
  voice_audio = new Audio(voiceUrl); // 创建一个新的语音对象
  voice_audio.type = 'audio/wav';
  await voice_audio.play(); // 播放新的语音
};

const playRecordingPause = () => {
  if (voice_audio) {
    voice_audio.pause();
  }
};

const getVoiceDownloadUrl = (audioBlob) => {
  const formData = new FormData();
  formData.append('voice', audioBlob, 'recording.wav');
  return axios.post(resource, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

ipcRenderer.on('AUDIO_DATA', (event, audioData) => {
  if (audioChunks.length === 1) {
    audioChunks = [];
  }
  audioChunks.push(audioData);
});

ipcRenderer.on('STOP_RECORDING_SUCCESS', (event, audioBlob) => {
  audio = new Audio(URL.createObjectURL(audioBlob));
  const url = ref('');
  const duration = ref();
  audio.addEventListener('canplaythrough', async () => {
    while (isNaN(audio.duration) || audio.duration === Infinity) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      audio.currentTime = 10000000 * Math.random();
    }
    duration.value = Math.round(audio.duration);
  });
  watchEffect(() => {
    if (duration.value) {
      getVoiceDownloadUrl(audioBlob)
        .then((res) => {
          url.value = res.data;
          let obj = {
            voiceUrl: url.value,
            duration: duration.value,
          };
          store.dispatch('updataVoiceObj', obj);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
});

module.exports = {
  usingVoice,
  playRecording,
  playRecordingPause,
};