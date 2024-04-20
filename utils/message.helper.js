async function sendMessage(message, response, channel, client, messageContent) {
  // Check if the message was sent by the bot
  const isBotMessage =
    (message && message.author && message.author.id === client.user.id) ||
    (message && message.user && message.user.id === client.user.id);

  const isMessageReplied = isReplied(message);

  // // If the message was sent by the bot, you can edit it
  // if (response && response.edit) {
  //   console.log("Editing");
  //   return await response.edit(messageContent);
  // } else if (message && message.reply && !isMessageReplied) {
  //   console.log("Replying");
  //   try {
  //     return await message.reply(messageContent);
  //   } catch {
  //     return await message.editReply(messageContent);
  //   }
  // } else if (isBotMessage && message && message.edit) {
  //   console.log("Editing!");
  //   return await message.edit(messageContent);
  // }
  // // If it's not a bot message or if the message doesn't support editing, reply or send a new message
  // else {
  //   console.log("Sending");
  try {
    return await message.reply(messageContent);
  } catch (err) {
    console.log(err);
    try {
      return await message.edit(messageContent);
    } catch (err1) {
      console.log(err1);
      try {
        return await message.editReply(messageContent);
      } catch (err2) {
        console.log(err2);
        try {
          return await response.edit(messageContent);
        } catch (err3) {
          console.log(err3);
          return await channel.send(messageContent);
        }
      }
    }
  }

  // }
}

function isReplied(message) {
  // Check if the message has a reference
  if (message && message.reference) {
    // Check if the reference is to another message
    if (message.reference.messageID) {
      return true;
    }
    // Check if the reference is to a thread
    else if (message.reference.threadID) {
      return true;
    }
  }
  return false;
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
