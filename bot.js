// Headless Minecraft bot: joins a server and sends a chat message every 5 minutes.
// Config is via environment variables (see README.md).

const mineflayer = require('mineflayer')

const config = {
  host: process.env.MC_HOST || 'localhost',
  port: parseInt(process.env.MC_PORT || '25565', 10),
  username: process.env.MC_USERNAME || 'ChatBot',   // email for Microsoft auth, any name for offline
  auth: process.env.MC_AUTH || 'microsoft',         // 'microsoft' or 'offline'
  version: process.env.MC_VERSION || false,         // false = auto-detect
  intervalMs: parseInt(process.env.CHAT_INTERVAL_MIN || '5', 10) * 60 * 1000,
  // Messages are cycled through in order. Edit these or set MC_MESSAGES="msg1|msg2"
  messages: (process.env.MC_MESSAGES || 'Still here!|Hello from the bot!|Just checking in.').split('|'),
  reconnectDelayMs: 15000,
  password: process.env.MC_PASSWORD || '',          // for AuthMe-style /login and /register
  randomSuffix: process.env.MC_RANDOM_SUFFIX === 'true', // append " | abcde" to each message
}

function randomLetters(n = 5) {
  const chars = 'abcdefghijklmnopqrstuvwxyz'
  let out = ''
  for (let i = 0; i < n; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

let msgIndex = 0
let timer = null

function startBot() {
  console.log(`[bot] Connecting to ${config.host}:${config.port} as ${config.username} (${config.auth})...`)

  const bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    auth: config.auth,
    version: config.version,
  })

  bot.once('spawn', () => {
    console.log('[bot] Spawned. Chat loop started.')
    clearInterval(timer)
    timer = setInterval(() => {
      let msg = config.messages[msgIndex % config.messages.length]
      msgIndex++
      if (config.randomSuffix) msg += ` | ${randomLetters()}`
      bot.chat(msg)
      console.log(`[bot] Sent: ${msg}`)
    }, config.intervalMs)
  })

  let authSent = false
  bot.on('messagestr', (message) => {
    console.log(`[chat] ${message}`)

    if (!config.password || authSent) return
    const text = message.toLowerCase()

    // Typical AuthMe prompts: "Please login with /login <password>" / "Register with /register <password> <password>"
    let command = null
    if (text.includes('/register')) command = `/register ${config.password} ${config.password}`
    else if (text.includes('/login') || text.includes('/l ')) command = `/login ${config.password}`

    if (command) {
      authSent = true
      setTimeout(() => {
        bot.chat(command)
        console.log(`[bot] Sent ${command.split(' ')[0]} (password hidden)`)
      }, 1000)
      // allow another attempt if the prompt shows up again later (e.g. wrong password / re-prompt)
      setTimeout(() => { authSent = false }, 10000)
    }
  })

  bot.on('kicked', (reason) => console.log('[bot] Kicked:', reason))
  bot.on('error', (err) => console.log('[bot] Error:', err.message))

  bot.on('end', (reason) => {
    clearInterval(timer)
    console.log(`[bot] Disconnected (${reason}). Reconnecting in ${config.reconnectDelayMs / 1000}s...`)
    setTimeout(startBot, config.reconnectDelayMs)
  })
}

startBot()
