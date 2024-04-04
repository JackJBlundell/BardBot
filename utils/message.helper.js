function sendMessage(message, response, channel, messageContent) {
  return message && message.reply
    ? message.reply(messageContent)
    : message && message.edit
    ? message.edit(messageContent)
    : response && response.edit
    ? response.edit(messageContent)
    : channel.send(messageContent);
}

function deleteMessage(message, response) {
  return message && message.delete
    ? message.delete(1000)
    : response.delete(1000);
}
module.exports = { sendMessage, deleteMessage };
