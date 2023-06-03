import axios from "axios";

const mockBaseURL = 'http://localhost:4523/m1/2785261-0-default/m1/2785261-0-default'
const sendOrderToServer = (content) => {
    return axios.get(mockBaseURL+'/order/msg?id='+content)
}

export default sendOrderToServer