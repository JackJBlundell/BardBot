async function sendMessage(message, response, channel, client, messageContent) {
  // Check if the message was sent by the bot
  const isBotMessage =
    (message && message.author && message.author.id === client.user.id) ||
    (message && message.user && message.user.id === client.user.id);

  // If the message was sent by the bot, you can edit it
  if (response && response.edit) {
    console.log("Editing");
    return response.edit(messageContent);
  } else if (message && message.reply) {
    console.log("Replying");

    return message.reply(messageContent);
  } else if (isBotMessage && message && message.edit) {
    console.log("Editing!");
    return message.edit(messageContent);
  }
  // If it's not a bot message or if the message doesn't support editing, reply or send a new message
  else {
    console.log("Sending");

    return channel.send(messageContent);
  }
}

async function editMessage(message, response, channel, client, messageContent) {
  // Check if the message was sent by the bot
  const isBotMessage =
    (message && message.author && message.author.id === client.user.id) ||
    (message && message.user && message.user.id === client.user.id);

  // If the message was sent by the bot, you can edit it
  if (message && message.update) {
    console.log("uhhh updating??", message);
    return message.update(messageContent);
  }
  if (isBotMessage && message && message.edit) {
    console.log("Editing!");
    return message.edit(messageContent);
  }
  // If it's not a bot message or if the message doesn't support editing, reply or send a new message
  else if (response && response.edit) {
    console.log("Editing");
    return response.edit(messageContent);
  } else {
    console.log("Sending");

    return channel.send(messageContent);
  }
}

function deleteMessage(message, response) {
  return message && message.delete
    ? message.delete(1000)
    : response.delete(1000);
}
module.exports = { sendMessage, editMessage, deleteMessage };
