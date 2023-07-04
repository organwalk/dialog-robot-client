import * as auth from "@/api/cloud/auth";
import * as save from "@/api/server/save-data";
import {reactive, ref} from "vue";
import {ElMessage} from "element-plus";

const mobile = ref(sessionStorage.getItem("mobile"))
const user = reactive({
    mobile: '',
    uid: '',
    name: '',
    deptName: ''
})

export function personInfoRefresh(){
    auth.getUidByAccount(mobile.value).then(res => {
        sessionStorage.setItem("uid", res.data.data.uid)
        sessionStorage.setItem("mobile", mobile.value)
        auth.getDeptListByUid().then(res => {
            sessionStorage.setItem("deptId", res.data.data[1].id)
            user.deptName = res.data.data[1].name
            auth.getUserInfoByUid().then(res => {
                user.mobile = res.data.data.mobile
                user.uid = res.data.data.uid
                user.name = res.data.data.userName
                sessionStorage.setItem("userName",res.data.data.userName)
                save.saveUserInfo(user).then(res => {
                        if (!res.data.success) {
                            redisError()
                        } else {
                            auth.getDeptList().then(res => {
                                if (res.data.code === 200) {
                                    const deptArray = res.data.data.departments.map(dept => {
                                        return {
                                            deptId: dept.deptId,
                                            parentId: dept.parentId,
                                            name: dept.name,
                                            order: dept.order
                                        };
                                    });
                                    save.saveDeptList(deptArray).then(res => {
                                        if (!res.data.success) {
                                            redisError()
                                        } else {
                                            auth.getGroupList().then(res => {
                                                save.saveGroupList(res.data.data).then(res => {
                                                    if (!res.data.success) {
                                                        redisError()
                                                    } else {
                                                        auth.getDeptPersonList().then(res => {
                                                            const personList = res.data.data.users.map(person => {
                                                                return {
                                                                    id: person.id.toString(),
                                                                    name: person.name,
                                                                    mobile: person.mobile,
                                                                    sequence: person.sequence,
                                                                    orgId: person.orgId,
                                                                    privilege: "mydeptonly"
                                                                }
                                                            })
                                                            save.saveDeptPersonList(personList).then(res => {
                                                                if (!res.data.success) {
                                                                    redisError()
                                                                    return false
                                                                } else {
                                                                    ElMessage.success("更新成功")
                                                                    return false
                                                                }
                                                            })
                                                        })

                                                    }
                                                })

                                            })
                                        }
                                    })
                                }
                            })
                        }
                    }
                )
            })
        })
    })
    return false
}

const redisError = () => {
    ElMessage.error("缓存服务器出错，请重试")
}