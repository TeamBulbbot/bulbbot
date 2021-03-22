const Command = require("./../../structures/Command");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Asks the bot a question",
			category: "Miscellaneous",
			aliases: ["8b"],
			usage: "!8ball <question>",
			examples: ["8ball how are ya?"],
			minArgs: 1,
			maxArgs: -1,
			argList: ["code:string"],
			devOnly: false,
		});
	}

	async run(message, args) {
		if (!args[0]) {
            message.channel.send("You didn't ask a question");
            return;
        }

        const responses = [
            "It is certain.",
            "It is decidedly so.",
            "Without a doubt",
            "Yes - definitely.",
            "You may rely on it.",
            "As I see it, yes.",
            "Most likely.",
            "Outlook good.",
            "Yes.",
            "Signs point to yes.",
            "Reply hazy, try again.",
            "Ask again later.",
            "Better not tell you now.",
            "Cannot predict now.",
            "Concentrate and ask again.",
            "Don't count on it.",
            "My reply is no.",
            "My sources say no.",
            "Outlook not so good.",
            "Very doubtful."
        ];

        const answer = responses[Math.floor(Math.random() * responses.length)];

        message.channel.send(answer);
	}
};
