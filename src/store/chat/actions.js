export default {
    updataMissingKeyObj({commit},missingKeyObj){
        commit('setMissingKeyObj',missingKeyObj)
    },
    updataSearchUid({commit},searchUid){
        commit('setSearchUid',searchUid)
    },
    updataSending({commit},sending){
        commit('setSending',sending)
    },
    updataCreateStatus({commit},createStatus){
        commit('setCreateStatus',createStatus)
    },
    updataVoiceObj({commit},voiceObj){
        commit('setVoiceObj',voiceObj)
    },
    updataNameAndGroupMarkNum({commit},nameAndGroupMarkNum){
        commit('setNameAndGroupMarkNum',nameAndGroupMarkNum)
    },
    updataTimeQueryPlanData({commit},timeQueryPlanData){
        commit('setTimeQueryPlanData',timeQueryPlanData)
    },
    updataNameQueryPlanData({commit},nameQueryPlanData){
        commit('setNameQueryPlanData',nameQueryPlanData)
    },
    updataContentQueryPlanData({commit},contentQueryPlanData){
        commit('setContentQueryPlanData',contentQueryPlanData)
    },
    updataFastQueryNotesData({commit},fastQueryNotesData){
        commit('setFastQueryNotesData',fastQueryNotesData)
    },
    updataFastContentQueryNotesData({commit},fastContentQueryNotesData){
        commit('setFastContentQueryNotesData',fastContentQueryNotesData)
    },
    updataFastContentQueryNotesStatus({commit},fastContentQueryNotesStatus){
        commit('setFastContentQueryNotesStatus',fastContentQueryNotesStatus)
    },
    updataCacheIntention({commit},cacheIntention){
        commit('setCacheIntention',cacheIntention)
    },
    updataCacheEntity({commit},cacheEntity){
        commit('setCacheEntity',cacheEntity)
    }
}