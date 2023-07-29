// noinspection ExceptionCaughtLocallyJS

import * as auth from "@/api/cloud/auth";
import * as save from "@/api/server/save-data";
import {ElMessage} from "element-plus";

export async function updateDeptName() {
    try {
        await save.deleteAboutDept();
        const deptListRes = await auth.getDeptList();
        if (deptListRes.data.code !== 200) {
            throw new Error("服务出错，请重试");
        }
        const deptArray = deptListRes.data.data.departments.map((dept) => {
            return {
                deptId: dept.deptId,
                parentId: dept.parentId,
                name: dept.name,
                order: dept.order,
            };
        });
        const saveDeptRes = await save.saveDeptList(deptArray);
        if (saveDeptRes.data.status !== 200) {
            throw new Error("服务出错，请重试");
        }
        const groupListRes = await auth.getGroupList();
        if (groupListRes.data.code !== 200) {
            throw new Error("服务出错，请重试");
        }
        const saveGroupRes = await save.saveGroupList(groupListRes.data.data);
        if (saveGroupRes.data.status !== 200) {
            throw new Error("服务出错，请重试");
        }
        return true;
    } catch (error) {
        ElMessage.error(error.message);
        return false;
    }
}