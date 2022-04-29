import AdminChannels from "./admin.channels"

export default socket => {
    console.log("a user connected")
    const user = socket.user

    // Комната пользователя
    if (user.access === "admin") socket.join("admins")

    // Создать комнату пользователя
    socket.join(user.id)

    // Изменения статуса или позиции у ордера
    socket.on("order_update_status_and_position", data =>
        AdminChannels.UpdateStatusAndPositionOrder(socket, data)
    )

    //
    socket.on("check_count_new_messages", () =>
        AdminChannels.CheckCountNewMessages(socket)
    )

    //
    socket.on("read_new_message", data =>
        AdminChannels.ReadNewMessage(socket, data)
    )

    socket.on("disconnect", () => {
        console.log("user disconnected")
    })
}
