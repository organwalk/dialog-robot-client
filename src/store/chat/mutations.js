export default {
    setMissingKeyObj(state,missingKeyObj){
        state.missingKeyObj = missingKeyObj
    },
    setSearchUid(state,searchUid){
        state.searchUid = searchUid
    },
    setSending(state,sending){
        state.sending = sending
    },
    setCreateStatus(state,createStatus){
        state.createStatus = createStatus
    },
    setVoiceObj(state,voiceObj){
        state.voiceObj = voiceObj
    },
    setNameAndGroupMarkNum(state,nameAndGroupMarkNum){
        state.nameAndGroupMarkNum = nameAndGroupMarkNum
    },
    setTimeQueryPlanData(state,timeQueryPlanData){
        state.timeQueryPlanData = timeQueryPlanData
    },
    setNameQueryPlanData(state,nameQueryPlanData){
        state.nameQueryPlanData = nameQueryPlanData
    },
    setContentQueryPlanData(state,contentQueryPlanData){
        state.contentQueryPlanData = contentQueryPlanData
    },
    setFastQueryNotesData(state,fastQueryNotesData){
        state.fastQueryNotesData = fastQueryNotesData
    }
}