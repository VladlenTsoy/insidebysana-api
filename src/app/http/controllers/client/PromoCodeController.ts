import {PromoCode} from "models/settings/PromoCode"

const GetPromoCodeByCode = async (req, res) => {
        const {code} = req.body

        const promoCode = await PromoCode.query()
            .findOne({code: code, status: "active"})
            .whereRaw('end_at IS NULL OR end_at >= CURRENT_DATE()')
            .select('id', 'code', 'type', 'discount')

        if(!promoCode)
            return res.status(500).send({message: 'Введен недействительный промокод!'})

        return res.send(promoCode)
}

export default {GetPromoCodeByCode}
