var config = require("./data.json"),
    voice = [
        {
            statustype: [
                "今の状態を一覧として表示します。",
                "今の状態をチャットに送信しました。確認が出来ない場合、自分でチャットに「/status」を入力し、実行してください。"
            ],
            statusset: [
                "ステータスを切り替えました。",
                "ステータスを",
                "に切り替えました。"
            ],
            allsets: [
                "全ての機能をオンにしました。",
                "全ての機能をtrueに変更しました。",
                "全ての機能をオフにしました。",
                "全ての機能をfalseに変更しました。"
            ],
            setsta: [
                "オンに切り替えました。",
                "既にオンになっています。",
                "オフに切り替えました。",
                "既にオフになっています。"
            ],
            locktype: [
                "現在の状態",
                "ステータス",
                "```ステータス:",
                "\nオンラインステータス:",
                "\n\nメッセージ送信応答:",
                "\nメッセージ削除応答:",
                "\nメッセージ更新応答:",
                "\nリアクション応答:",
                "```",
                "棒読みちゃん設定",
                "読み上げ速度:`",
                "`\n声の高さ:`",
                "`\n声の大きさ:`",
                "`\n声の種類:`",
                "`"
            ],
            statusd: [

            ]
        }
    ],
    lavol = voice[config.language];
require("dotenv").config();
const net = require('net'),
    bouyomiclient = new net.Socket(),
    { Client, GatewayIntentBits, Partials, EmbedBuilder, BaseChannel, ApplicationCommandOptionType } = require('discord.js'),
    client = new Client({
        partials: [Partials.Channel],
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.DirectMessageTyping,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.MessageContent
        ]
    });
client.on('ready', () => { ready(); });
client.on('messageCreate', message => { bouyomi(message, "", "1"); });
client.on('messageUpdate', (oldMessage, newMessage) => { bouyomi(oldMessage, newMessage, "2"); });
client.on('messageDelete', message => { bouyomi(message, "", "3"); });
client.on('messageReactionAdd', (MessageReaction, User) => { bouyomi(MessageReaction, User, "4"); });
client.on('messageReactionRemove', (MessageReaction, User) => { bouyomi(MessageReaction, User, "5"); });
client.on('interactionCreate', interaction => {
    if (!interaction.isCommand()) return;

    var f = interaction.commandName,
        g = interaction.options.getString("option");
    if (f == "createmsg") {
        config.crem = setstatus(config.crem, g, interaction);
    } else if (f == "deletemsg") {
        config.delm = setstatus(config.delm, g, interaction);
    } else if (f == "updatemsg") {
        config.updm = setstatus(config.updm, g, interaction);
    } else if (f == "msgreaction") {
        config.ream = setstatus(config.ream, g, interaction);
    } else if (f == "status") {
        interaction.reply({
            embeds: [{
                title: lavol.locktype[0],
                description: lavol.statustype[0],
                fields: [
                    {
                        name: lavol.locktype[1],
                        value: lavol.locktype[2] + config.status + lavol.locktype[3] + config.onlinestatus + lavol.locktype[4] + config.crem + lavol.locktype[5] + config.delm + lavol.locktype[6] + config.updm + lavol.locktype[7] + config.ream + lavol.locktype[8]
                    },
                    {
                        name: lavol.locktype[9],
                        value: lavol.locktype[10] + config.Speed + lavol.locktype[11] + config.Tone + lavol.locktype[12] + config.Volume + lavol.locktype[13] + config.Voice + lavol.locktype[14]
                    }
                ]
            }],
            ephemeral: true
        });
        bouyomisend(lavol.statustype[0]);
        console.log(lavol.statustype[1]);
    } else if (f == "onlinestatus") {
        config.onlinestatus = g;
        onstats();
        interaction.reply({ content: lavol.statusset[0], ephemeral: true });
        bouyomisend(lavol.statusset[0]);
        console.log(lavol.statusset[1] + config.onlinestatus + lavol.statusset[2]);
    } else if (f == "allset") {
        if (g == "true") {
            config.crem = true,
                config.delm = true,
                config.updm = true,
                config.ream = true;
            interaction.reply({ content: lavol.allsets[0], ephemeral: true });
            bouyomisend(lavol.allsets[0]);
            console.log(lavol.allsets[1]);
        } else if (g == "false") {
            config.crem = false,
                config.delm = false,
                config.updm = false,
                config.ream = false;
            interaction.reply({ content: lavol.allsets[2], ephemeral: true });
            bouyomisend(lavol.allsets[2]);
            console.log(lavol.allsets[3]);
        };
    };
});
//上のやつは全部データ受け取るためだけのもの。

function setstatus(stats, request, interaction) {
    var data;
    if (request == "true") {
        if (stats == false) {
            data = true;
            interaction.reply({ content: lavol.setsta[0], ephemeral: true });
            bouyomisend(lavol.setsta[0]);
            console.log(lavol.setsta[0]);
        } else {
            data = true;
            interaction.reply({ content: lavol.setsta[1], ephemeral: true });
            bouyomisend(lavol.setsta[1]);
            console.log(lavol.setsta[1]);
        };
    } else if (request == "false") {
        if (stats == true) {
            data = false;
            interaction.reply({ content: lavol.setsta[2], ephemeral: true });
            bouyomisend(lavol.setsta[2]);
            console.log(lavol.setsta[2]);
        } else {
            data = false;
            interaction.reply({ content: lavol.setsta[3], ephemeral: true });
            bouyomisend(lavol.setsta[3]);
            console.log(lavol.setsta[3]);
        };
    };
    console.log("setstatusの状態-stats:" + stats + " request:" + request + " data:" + data);
    return data;
};
function bouyomi(data1, data2, id) {
    if (id == "1" && config.crem) {
        if (data1.author.bot) return;
        bouyomisend(replace(data1.content));
        console.log("棒読みちゃんに送信:" + replace(data1.content));
    } else if (id == "2" && config.updm) {
        if (data1.author.bot) return;
        if (data1.content == data2.content) return;
        bouyomisend(replace(data2.content));
        console.log("棒読みちゃんに送信:" + replace(data2.content));
    } else if (id == "3" && config.delm) {
        if (data1.author.bot) return;
        bouyomisend(replace(data1.content));
        console.log("棒読みちゃんに送信:" + replace(data1.content));
    } else if (id == "4" && config.ream) {
        if (data1.message.author.bot) return;
        bouyomisend("メッセージにリアクション。" + data1.emoji.name);
        console.log("棒読みちゃんに送信:" + "メッセージにリアクション。" + data1.emoji.name);
    } else if (id == "5" && config.ream) {
        if (data1.message.author.bot) return;
        bouyomisend("メッセージのリアクション解除。" + data1.emoji.name);
        console.log("棒読みちゃんに送信:" + "メッセージのリアクション解除。" + data1.emoji.name);
    };
};
//棒読みちゃんに送信するプログラム全部ネットからコピペした
function bouyomisend(msg) {
    bouyomiclient.connect(config.port, config.address, function () {
    });
    var iCommand = new Buffer.alloc(2);
    iCommand.writeInt16LE(1, 0);
    bouyomiclient.write(iCommand);
    var iSpeed = new Buffer.alloc(2);
    iSpeed.writeInt16LE(config.Speed, 0);
    bouyomiclient.write(iSpeed);
    var iTone = new Buffer.alloc(2);
    iTone.writeInt16LE(config.Tone, 0);
    bouyomiclient.write(iTone);
    var iVolume = new Buffer.alloc(2);
    iVolume.writeInt16LE(config.Volume, 0);
    bouyomiclient.write(iVolume);
    var iVoice = new Buffer.alloc(2);
    iVoice.writeInt16LE(config.Voice, 0);
    bouyomiclient.write(iVoice);
    var bCode = new Buffer.alloc(1);
    bCode.writeInt8(0, 0);
    bouyomiclient.write(bCode);
    var bMessage = new Buffer.from(msg, 'utf8');
    var iLength = new Buffer.alloc(4);
    iLength.writeInt32LE(bMessage.length, 0);
    bouyomiclient.write(iLength);
    bouyomiclient.write(bMessage);
    bouyomiclient.end();
};
bouyomiclient.on('close', () => {
    bouyomiclient.end();
});
bouyomiclient.on('error', () => {
    console.log("ところが、棒読みちゃんにデータを送信出来ませんでした。なので、botが終了しちゃいます...\nもし棒読みちゃんが起動しているのに、送信ができない場合は棒読みちゃんの設定ボタンから、アプリケーション連携>Socket連携の「ローカルTCPサーバー機能を使う」の項目をTrueにし、\nポート番号を'50001'に変更してください。");
    client.destroy();
});
var replace = d => {
    var c = d;
    c = c.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 65248);
    });
    c = c.replace(/\r?\n/g, " ");
    var b = new RegExp("<:[a-zA-Z0-9]:[0-9]{17,}>", 'g');
    c = c.replace(b, " 絵文字 ");
    var b = new RegExp("<@[0-9]>", 'g');
    c = c.replace(b, " メンション "); return c;
};
var ready = () => {
    onstats();
    console.log("Bot動作開始しましたよ～");
    bouyomisend("ぼっと/ど+おさ/かいししました'/よ'ぉー。");
};
var onstats = () => {
    var scommand = [
        {
            name: "createmsg",
            description: "送信されたメッセージに反応するかどうかを切り替えます。",
            options: [{
                type: ApplicationCommandOptionType.String,
                name: "option",
                description: "TrueかFalseを選択し、オン/オフを切り替えます。",
                required: true,
                choices: [
                    {
                        name: "True(オン)",
                        value: "true"
                    },
                    {
                        name: "False(オフ)",
                        value: "false"
                    }
                ]
            }]
        },
        {
            name: "deletemsg",
            description: "削除されたメッセージを読み上げるかどうかを切り替えます。",
            options: [{
                type: ApplicationCommandOptionType.String,
                name: "option",
                description: "TrueかFalseを選択し、オン/オフを切り替えます。",
                required: true,
                choices: [
                    {
                        name: "True(オン)",
                        value: "true"
                    },
                    {
                        name: "False(オフ)",
                        value: "false"
                    }
                ]
            }]
        },
        {
            name: "updatemsg",
            description: "編集されたメッセージに反応するかどうかを切り替えます。",
            options: [{
                type: ApplicationCommandOptionType.String,
                name: "option",
                description: "TrueかFalseを選択し、オン/オフを切り替えます。",
                required: true,
                choices: [
                    {
                        name: "True(オン)",
                        value: "true"
                    },
                    {
                        name: "False(オフ)",
                        value: "false"
                    }
                ]
            }]
        },
        {
            name: "msgreaction",
            description: "メッセージにリアクションされた場合に反応するかどうかを切り替えます。",
            options: [{
                type: ApplicationCommandOptionType.String,
                name: "option",
                description: "TrueかFalseを選択し、オン/オフを切り替えます。",
                required: true,
                choices: [
                    {
                        name: "True(オン)",
                        value: "true"
                    },
                    {
                        name: "False(オフ)",
                        value: "false"
                    }
                ]
            }]
        },
        {
            name: "allset",
            description: "全ての機能をオンにしたりオフにしたりします。",
            options: [{
                type: ApplicationCommandOptionType.String,
                name: "option",
                description: "TrueかFalseを選択し、オン/オフを切り替えます。",
                required: true,
                choices: [
                    {
                        name: "True(オン)",
                        value: "true"
                    },
                    {
                        name: "False(オフ)",
                        value: "false"
                    }
                ]
            }]
        },
        {
            name: "onlinestatus",
            description: "このbotのオンラインステータスを変更します。",
            options: [{
                type: ApplicationCommandOptionType.String,
                name: "option",
                description: "一覧を選択し、ステータスを切り替えます。",
                required: true,
                choices: [
                    {
                        name: "オンライン",
                        value: "online"
                    },
                    {
                        name: "離席中",
                        value: "idle"
                    },
                    {
                        name: "取り込み中",
                        value: "dnd"
                    },
                    {
                        name: "オフライン",
                        value: "invisible"
                    }
                ]
            }]
        },
        {
            name: "status",
            description: "今のbotの設定等を表示します。"
        }
    ];
    client.user.setPresence({
        activities: [{
            name: config.status
        }],
        status: config.onlinestatus
    });
    client.application.commands.set(scommand);
};
client.login(process.env.TOKEN);