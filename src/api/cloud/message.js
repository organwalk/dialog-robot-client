import http from "@/api/cloud/http";
const msg = (msgType,object) =>{
    switch (msgType){
        case 'AppMsg' :
            sendAppMsg(object)
            break
        case 'TxtMsg' :
            sendTxtMsg(object)
            break
        case 'PicMsg' :
            sendPicMsg(object)
            break
        case 'LinkMsg' :
            sendLinkMsg(object)
            break
        case 'MulMsg' :
            sendMulMsg(object)
            break
        case 'IDMsg' :
            sendIDMsg(object)
            break
        case 'SysMsg':
            sendSysMsg(object)
            break
        case 'VocMsg':
            sendVoice(object)
            break

    }
}

const msgBaseUrl = '/message/push'
const sendAppMsg = (obj)=>{
    return http.post(msgBaseUrl + '/app',obj)
}

const sendTxtMsg = (obj)=>{
    obj['msgType'] = 1
    const newObj = {
        ...obj,
        message: obj.content
    }
    delete newObj.content
    return http.post(msgBaseUrl + '/text',newObj)
}

const sendPicMsg = (obj)=>{
    obj['msgType'] = 2
    obj['extraData'] = JSON.stringify({width: 300, height: 300})
    const newObj = {
        ...obj,
        message:obj.image
    }
    delete newObj.image
    return http.post(msgBaseUrl,newObj)
}

const sendLinkMsg = (obj)=>{
    obj['msgType'] = 10
    obj['extraData'] = JSON.stringify({content:obj.content, url: obj.url})
    const newObj = {
        ...obj,
        message:obj.title
    }
    delete newObj.title
    return http.post(msgBaseUrl,newObj)
}

const sendMulMsg = (obj)=>{
    obj['msgType'] = 8
    obj['extraData'] = JSON.stringify({content:obj.content, image:obj.image, url: obj.url})
    const newObj = {
        ...obj,
        message:obj.title
    }
    delete newObj.title
    return http.post(msgBaseUrl,newObj)
}

const sendIDMsg = (obj)=>{
    obj['msgType'] = 7
    obj['extraData'] = JSON.stringify({cardId:Math.random() * (1000000000 - 9000000000 +1), orgName:obj.content})
    const newObj = {
        ...obj,
        message:obj.title
    }
    delete newObj.title
    return http.post(msgBaseUrl,newObj)
}

const sendSysMsg = (obj)=>{
    obj['msgType'] = 25
    obj['extraData'] = JSON.stringify({title:obj.title,content:obj.content,desc:obj.desc})
    const newObj = {
        ...obj,
        message:obj.title
    }
    delete newObj.title
    return http.post(msgBaseUrl,newObj)
}

const sendVoice = (obj) => {
    let newObj = {
        msgType:3,
        message:obj.voiceUrl.voiceUrl,
        extraData:"{\"duration\":" + obj.voiceUrl.duration + "}",
        receivers:["1151800183169088"],
        needPush:true
    }
    return http.post(msgBaseUrl,newObj)
}
export default msg