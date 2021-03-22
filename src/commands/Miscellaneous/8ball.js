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
            message.channel.send(await this.client.bulbutils.translate("8ball_question_not_defined");
            return;
        }

        const responses = [
            await this.client.bulbutils.transalate("8ball_response_one"),
		    await this.client.bulbutils.transalate("8ball_response_one"),
		    await this.client.bulbutils.transalate("8ball_response_two"),
		    await this.client.bulbutils.transalate("8ball_response_three"),
		    await this.client.bulbutils.transalate("8ball_response_four"),
		    await this.client.bulbutils.transalate("8ball_response_five"),
		    await this.client.bulbutils.transalate("8ball_response_six"),
		    await this.client.bulbutils.transalate("8ball_response_seven"),
		    await this.client.bulbutils.transalate("8ball_response_eight"),
		    await this.client.bulbutils.transalate("8ball_response_nine"),
		    await this.client.bulbutils.transalate("8ball_response_ten"),
		    await this.client.bulbutils.transalate("8ball_response_eleven"),
		    await this.client.bulbutils.transalate("8ball_response_twelve"),
		    await this.client.bulbutils.transalate("8ball_response_thirteen"),
		    await this.client.bulbutils.transalate("8ball_response_fourteen"),
		    await this.client.bulbutils.transalate("8ball_response_fifteen"),
		    await this.client.bulbutils.transalate("8ball_response_sixteen"),
		    await this.client.bulbutils.transalate("8ball_response_seventeen"),
		    await this.client.bulbutils.transalate("8ball_response_eighteen"),
		    await this.client.bulbutils.transalate("8ball_response_nineteen"),
		    await this.client.bulbutils.transalate("8ball_response_twenty"),
		    await this.client.bulbutils.transalate("8ball_response_twentyone")
        ];

        const answer = responses[Math.floor(Math.random() * responses.length)];

        message.channel.send(answer);
	}
};
