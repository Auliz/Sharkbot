import tmi from 'tmi.js';
import {
  BOT_USERNAME,
  OAUTH_TOKEN,
  CHANNEL_NAME,
  BLOCKED_WORDS,
  DADJOKE_URL,
  FACTS_URL,
  MOVIE_URL,
} from '../constants/constants';
import fetch from 'node-fetch';

const options = {
  options: { debug: true },
  connection: {
    reconnect: true,
    secure: true,
  },
  identity: {
    username: BOT_USERNAME,
    password: OAUTH_TOKEN,
  },
  channels: [CHANNEL_NAME],
};

const client = new tmi.Client(options);
client.connect().catch(console.error);

// events
client.on('disconnected', (reason) => {
  onDisconnectedHandler(reason);
});

client.on('connected', (address, port) => {
  onConnectedHandler(address, port);
});

client.on('hosted', (channel, username, viewers, autohost) => {
  onHostedHandler(channel, username, viewers, autohost);
});

client.on('subscription', (channel, username, method, message, userstate) => {
  onSubscriptionHandler(channel, username, method, message, userstate);
});

client.on('raided', (channel, username, viewers) => {
  onRaidedHandler(channel, username, viewers);
});

client.on('cheer', (channel, userstate, message) => {
  onCheerHandler(channel, userstate, message);
});

client.on('giftpaidupgrade', (channel, username, sender, userstate) => {
  onGiftPaidUpgradeHandler(channel, username, sender, userstate);
});

client.on('hosting', (channel, target, viewers) => {
  onHostingHandler(channel, target, viewers);
});

client.on('reconnect', () => {
  reconnectHandler();
});

client.on('resub', (channel, username, months, message, userstate, methods) => {
  resubHandler(channel, username, months, message, userstate, methods);
});

client.on(
  'subgift',
  (channel, username, streakMonths, recipient, methods, userstate) => {
    subGiftHandler(
      channel,
      username,
      streakMonths,
      recipient,
      methods,
      userstate
    );
  }
);

// event handlers

client.on('message', (channel, userstate, message, self) => {
  if (self) {
    return;
  }

  if (userstate.username === BOT_USERNAME) {
    console.log(`Not checking bot's messages.`);
    return;
  }

  if (message.toLowerCase() === '!commands') {
    commands(channel, userstate);
    return;
  }

  if (
    message.toLowerCase().includes('!discord') ||
    message.toLowerCase().includes('!disc')
  ) {
    discord(channel, userstate, message);
    return;
  }

  // IF YOU COMMENTED OUT THE OTHER DADJOKE FUNCTIONS / VARIABLES, COMMENT THIS OUT TOO
  if (message.toLowerCase() === '!dadjoke') {
    noSpamDadJoke(channel);
    return;
  }

  if (message.toLowerCase() === '!fact') {
    uselessFacts(channel);
    return;
  }

  if (message.toLowerCase() === '!movieq') {
    movieQuote(channel);
    return;
  }

  // if (message.toLowerCase() === '!news') {
  //   news(channel, userstate);
  //   return;
  // }

  // specific to WildSideC, feel free to comment or remove
  if (message.toLowerCase() === '!spoop') {
    spoop(channel);
    return;
  }

  // specific to WildSideC, feel free to comment or remove
  if (message.toLowerCase() === '!onemore') {
    oneMore(channel);
    return;
  }

  onMessageHandler(channel, userstate, message, self);
});

function onMessageHandler(channel, userstate, message, self) {
  checkTwitchChat(userstate, message, channel);
}

function onDisconnectedHandler(reason) {
  console.log(`Disconnected: ${reason}`);
}

function onConnectedHandler(address, port) {
  console.log(`Connected: ${address}:${port}`);
}

function onHostedHandler(channel, username, viewers, autohost) {
  client.say(channel, `Thank you @${username} for the host of ${viewers}!`);
}

function onRaidedHandler(channel, username, viewers) {
  client.say(channel, `Thank you @${username} for the raid of ${viewers}!`);
}

function onSubscriptionHandler(channel, username, method, message, userstate) {
  client.say(channel, `Thank you @${username} for subscribing!`);
}

function onCheerHandler(channel, userstate, message) {
  client.say(
    channel,
    `Thank you @${userstate.username} for the ${userstate.bits} bits!`
  );
}

function onGiftPaidUpgradeHandler(channel, username, sender, userstate) {
  client.say(channel, `Thank you @${username} for continuing your gifted sub!`);
}

function onHostingHandler(channel, target, viewers) {
  client.say(channel, `We are now hosting ${target} with ${viewers} viewers!`);
}

function reconnectHandler() {
  console.log('Reconnecting...');
}

function resubHandler(channel, username, months, message, userstate, methods) {
  const cumulativeMonths = userstate['msg-param-cumulative-months'];
  client.say(
    channel,
    `Thank you @${username} for the ${cumulativeMonths} sub!`
  );
}

function subGiftHandler(
  channel,
  username,
  streakMonths,
  recipient,
  methods,
  userstate
) {
  client.say(
    channel,
    `Thank you @${username} for gifting a sub to ${recipient}}.`
  );

  // this comes back as a boolean from twitch, disabling for now
  // "msg-param-sender-count": false
  // const senderCount =  ~~userstate["msg-param-sender-count"];
  // client.say(channel,
  //   `${username} has gifted ${senderCount} subs!`
  // )
}

// commands

function commands(channel, userstate) {
  client.say(
    channel,
    `@${userstate.username} The current channel commands are: !discord, !disc, !dadjoke, !fact, !movieq, !spoop, !onemore`
  );
}

function oneMore(channel) {
  client.say(channel, `Kappa Kappa Kappa`); // can comment this out, is specific to WildSideC
}

// function news(channel, userstate) {
//   client.say(
//     channel,
//     `@${userstate.username} A channel re-vamp is coming soon. More details will be available soon.` // can change this to be whatever news you may have to share
//   );
// }

// used to generate a random number for spoop()
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function spoop(channel) {
  let boo = 'boo';
  // adds an o to the end of boo based on the random number
  for (let i = getRandomInt(13); i <= 13; i++) {
    boo += 'o';
  }
  // makes every other character capital. ex: BoOoOoOoO
  let res = '';
  for (let j = 0; j < boo.length; j++) {
    res += j % 2 == 0 ? boo.charAt(j).toUpperCase() : boo.charAt(j);
  }
  client.say(channel, `${res}`);
  // client.say(channel, `@${userstate.username} ${res}`);
}

function discord(channel, userstate, message) {
  if (message.startsWith('@')) {
    const splitString = message.split(' ');
    const taggedUser = splitString[0].substring(1);
    // console.log(taggedUser.substring(1));
    client.say(
      channel,
      `@${taggedUser} The discord invite link is: https://discord.gg/bBs2wMh` // Put your discord here
    );
  } else {
    client.say(
      channel,
      `@${userstate.username} The discord invite link is: https://discord.gg/bBs2wMh` // Put your discord here
    );
  }
}

function checkTwitchChat(userstate, message, channel) {
  message = message.toLowerCase();
  let shouldSendMessage = false;
  shouldSendMessage = BLOCKED_WORDS.some((blockedWord) =>
    message.includes(blockedWord.toLowerCase())
  );
  if (shouldSendMessage) {
    // tell user
    client.say(
      channel,
      `@${userstate.username} Sorry! Your message was deleted.`
    );
    // delete message
    client.deletemessage(channel, userstate.id);
  }
}

// IF YOU COMMENTED OUT THE DADJOKE CONST IN THE CONSTANTS FILE, COMMENT THE BELOW CODE OUT AS WELL.

async function dadJoke(channel) {
  const objReq = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  let response = await fetch(DADJOKE_URL, objReq);
  let result = await response.json();

  client.say(channel, `${result.joke}`);
}

let timerId;
function noSpamDadJoke(channel) {
  if (!(timerId === null)) {
    clearTimeout(timerId);
  }
  timerId = setTimeout(() => {
    dadJoke(channel);
  }, 400);
}

async function uselessFacts(channel) {
  const objReq = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  let response = await fetch(FACTS_URL, objReq);
  let result = await response.json();

  client.say(channel, `${result.text}`);
}

async function movieQuote(channel) {
  const objReq = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  let response = await fetch(MOVIE_URL, objReq);
  let result = await response.json();

  client.say(channel, `${result.content} -- ${result.film}`);
}
