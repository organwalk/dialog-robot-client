import axios from "axios";

const whisper_server = "http://localhost:8280/api/whisper"
const resource = "https://organwalk.ink/api/voice/"
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