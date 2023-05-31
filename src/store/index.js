import {createStore} from "vuex";
import createSchedule from "@/store/create-schedule";

const store = createStore({
    modules:{
        createSchedule
    }
})

export default store