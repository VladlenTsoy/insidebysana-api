export const ReplaceVariablesToData = (text, orderId, amount, name) => {
    const literals = text.match(/{[^}]*}/g)

    if (literals && literals.length) {
        literals.map(literal => {
            const re = new RegExp(literal, "g")
            text = text.replace(
                re,
                literal === "{orderId}" ? orderId : literal === "{name}" ? name : amount
            )
        })
    }
    return text
}
