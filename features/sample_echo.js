/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const { BotkitConversation } = require("botkit");

module.exports = function (controller) {
  controller.hears("sample", "message,direct_message", async (bot, message) => {
    await bot.reply(message, "I heard a sample message.");
  });

  let convo = new BotkitConversation("convo", controller);

  convo.say("Hey!");

  convo.ask("What is your name?", async (answer) => {}, { key: "name" });

  convo.ask(
    "Do you like tacos?",
    [
      {
        pattern: "yes",
        handler: async function (answer, convo, bot) {
          await convo.gotoThread("likes_tacos");
        },
      },
      {
        pattern: "no",
        handler: async function (answer, convo, bot) {
          await convo.gotoThread("hates_life");
        },
      },
    ],
    { key: "tacos" }
  );

  // define a 'likes_tacos' thread
  convo.addMessage("HOORAY TACOS", "likes_tacos");

  // define a 'hates_life' thread
  convo.addMessage("TOO BAD!", "hates_life");

  // handle the end of the conversation
  convo.after(async (results, bot) => {
    const name = results.name;
  });

  // add the conversation to the dialogset
  controller.addDialog(convo);

  // launch the dialog in response to a message or event
  controller.hears(["hello"], "message", async (bot, message) => {
    bot.beginDialog("convo");
  });

  //   controller.on("channel_join", async (bot, message) => {
  //     await bot.reply(message, `Welcome! 歡迎`);
  //   });
};
