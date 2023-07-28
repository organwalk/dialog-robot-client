import {createStore} from "vuex";
import chat from "@/store/chat";

const store = createStore({
    modules:{
        chat
    }
})

export default store