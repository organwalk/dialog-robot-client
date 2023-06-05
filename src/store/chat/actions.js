export default {
    updataMissingKeyObj({commit},missingKeyObj){
        commit('setMissingKeyObj',missingKeyObj)
    },
    updataSearchUid({commit},searchUid){
        commit('setSearchUid',searchUid)
    },
    updataOldMem({commit},oldMem){
        commit('setSearchUid',oldMem)
    },
}