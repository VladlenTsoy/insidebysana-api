const {PaymeService} = require("services/payment/PaymeService")

const Index = async (req, res) => {
    const paymeSerive = new PaymeService(req, res)
    return await paymeSerive.Run()
}

export default {Index}
