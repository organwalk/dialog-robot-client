import {createStore} from "vuex";
import createSchedule from "@/store/create-schedule";
import chat from "@/store/chat";

const store = createStore({
    modules:{
        createSchedule,
        chat
    }
})

export default store