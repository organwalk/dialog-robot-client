import axios from "axios";

const whisper_server = "http://8.130.43.166:8280/api/whisper"
const resource = "https://8.130.43.166:8081/api/voice/"
const useWhisper = (voiceUrl) => {
    return axios.post(whisper_server, {voice_url:resource + voiceUrl},{
        headers:{
            "Content-Type":'application/json'
        }
    })
}

export {
    useWhisper
}