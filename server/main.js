const {  ButtonBuilder, ButtonStyle, ActionRowBuilder, Client, GatewayIntentBits, MessageActionRowComponent, ButtonComponent } = require("discord.js");
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const fs = require("fs/promises");
const path = require('path');
const app = express();
const axios = require('axios');
const url = require('url');
require('dotenv').config({ path: path.join('../.env') });

const PORT = process.env.VITE_PORT;
const URL = process.env.VITE_URL;
const URL_FULL = `${URL}:${PORT}`
const PREFIX = "\x1b[90m[\x1b[37mContent-Server\x1b[90m]\x1b[0m"
const CHANNEL_ID = process.env.VITE_CHANNEL_ID;
const BOT_TOKEN = process.env.VITE_BOT_TOKEN;

const corsOptions = {
    origin: URL_FULL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use(express.json(), fileUpload(), cors(corsOptions), express.urlencoded({ extended: true }));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

const CONTENT_DIR = path.join("./content");
let discordCdnFile = '';

const generateFileName = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${month}${day}${year}${hours}${minutes}${seconds}`;
};

client.on("messageCreate", async (message) => {
    if (!message.author.bot && message.attachments.size > 0) {
        const attachment = message.attachments.first();
        const fileUrl = attachment.url;
        const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
        const fileName = `${generateFileName()}${path.extname(attachment.name)}`;
        const filePath = path.join(CONTENT_DIR, fileName);
        await fs.writeFile(filePath, Buffer.from(response.data));
        console.log(PREFIX, `${fileName} has saved.`);
        await uploadContentMsg(filePath, "Discord");
        await message.delete();
    }
});

app.post('/uploadContent', async (req, res) => {
    const { files } = req;
    const content = files.content;
    const fileName = `${generateFileName()}${path.extname(content.name)}`;
    const contentPath = path.join(CONTENT_DIR, fileName);
    await fs.mkdir(path.dirname(contentPath), { recursive: true });
    await content.mv(contentPath);
    await uploadContentMsg(contentPath, "External");
});

async function uploadContentMsg(contentPath, from) {
    const channel = client.channels.cache.get(CHANNEL_ID);
    const fileStats = await fs.stat(contentPath);
    const uploadDate = fileStats.birthtime;
    await channel.send(
        " \n" +
        "~~--------------------------------~~\n" +
        ":new_moon_with_face:  **Content Server**"
    );
    await channel.send({ files: [contentPath] });
    setTimeout(async () => {
        await channel.send(
            "```\n" +
            `From: ${from}\n` +
            `Name: ${path.basename(contentPath)}\n` +
            `Uploaded at: ${uploadDate.toLocaleString()}\n` +
            "\n" +
            `Discord URL: ${discordCdnFile}\n` +
            "\n" +
            `Server URL: ${URL_FULL}/content/${path.basename(contentPath)}\n` +
            "```" +
            "~~--------------------------------~~"
        );
    }, 500);
}

app.get('/content/:filename', async (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(CONTENT_DIR, filename);
    try {
        await fs.access(filePath).then(r => {console.log("ok")});
        res.download(filePath, filename);
    } catch (err) {
        console.error('ファイルが見つかりません:', err);
        res.status(404).send('指定されたファイルが見つかりません。');
    }
});

client.on('messageCreate', async (message) => {
    if (message.author.bot && message.attachments.size > 0) {
        const attachment = message.attachments.first();
        const imageUrl = attachment.url;
        const urlObject = url.parse(imageUrl);
        discordCdnFile = urlObject.protocol + '//' + urlObject.host + urlObject.pathname;
    }
});




client.on('messageCreate', message => {
    if (message.content === '!send') {
        const confirm = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Confirm Ban')
            .setStyle(ButtonStyle.Danger);

        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder()
            .addComponents(cancel, confirm);

        message.channel.send({
            content: `Hello World`,
            components: [row],
        });
    }
});




client.login(BOT_TOKEN).then(() => {
    console.log(PREFIX, "Bot Logged.");
});

app.listen(PORT, () => {
    console.log();
    console.log(PREFIX, "Server is up and running.");
    console.log(PREFIX, `Address: ${URL_FULL}`);
    console.log();
});