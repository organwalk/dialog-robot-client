export default {
    getMissingKeyObj:(state)=>state.missingKeyObj,
    getSearchUid:(state)=>state.searchUid,
    getCreateStatus:(state)=>state.createStatus,
    getVoiceObj:(state)=>state.voiceObj,
    getNameAndGroupMarkNum:(state)=>state.nameAndGroupMarkNum,
    getTimeQueryPlanData:(state)=>state.timeQueryPlanData,
    getNameQueryPlanData:(state)=>state.nameQueryPlanData,
    getContentQueryPlanData:(state)=>state.contentQueryPlanData,
    getFastQueryNotesData:(state)=>state.fastQueryNotesData,
    getFastContentQueryNotesStatus:(state)=>state.fastContentQueryNotesData.status,
    getFastContentQueryNotesData:(state)=>state.fastContentQueryNotesData.data,
    getCacheIntention:(state)=>state.cacheIntention,
    getCacheEntity:(state)=>state.cacheEntity,
    getNowDept:(state)=>state.nowDept
}