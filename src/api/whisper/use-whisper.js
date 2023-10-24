import axios from "axios";

const whisper_server = "http://localhost:38280/api/whisper"
const resource = "https://localhost:38081/api/voice/"
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