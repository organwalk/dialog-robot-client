import http from "@/api/cloud/http";
const msg = (msgType,object) =>{
    switch (msgType){
        case 'AppMsg' :
            sendAppMsg(object).then(res=>{
                console.log(res.data)
            })
            break
    }


}

const sendAppMsg = (object)=>{
    return http.post('/message/push/app',object)
}

export default msg