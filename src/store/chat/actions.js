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
    }
}