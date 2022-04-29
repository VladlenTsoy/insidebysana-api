import {PaymeService} from "services/payment/PaymeService"

const Index = async (req, res) => {
    const paymeService = new PaymeService(req, res)
    return await paymeService.Run()
}

export default {Index}
