const Translator = require("../../utils/lang/translator");

module.exports = {
	name: "charinfo",
	category: "information",
	description: "Get information about given unicode characters.",
	usage: "charinfo <characters>",
	clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS"],
	userPermissions: [],
	clearanceLevel: 0,
	run: async (client, message, args) => {
		if (args[0] === undefined)
			return message.channel.send(
				Translator.Translate("charinfo_missing_arg_characters")
			);

		const categories = [
			"Cc",
			"Cf",
			"Co",
			"Cs",
			"Ll",
			"Lm",
			"Lo",
			"Lt",
			"Lu",
			"Mc",
			"Me",
			"Mn",
			"Nd",
			"Nl",
			"No",
			"Pc",
			"Pd",
			"Pe",
			"Pf",
			"Pi",
			"Po",
			"Ps",
			"Sc",
			"Sk",
			"Sm",
			"So",
			"Zl",
			"Zp",
			"Zs",
		];

		let chars = args.slice(0).join(" ");

		message.channel
			.send(Translator.Translate("global_loading"))
			.then(async (msg) => {
				let text = "";
				for (let i = 0; i < chars.length; i++) {
					categories.forEach((cat) => {
						let Unicode = require(`unicode/category/${cat}`);
						if (Unicode[chars[i].charCodeAt(0)] !== undefined)
							text += `${chars[i]} - ${Unicode[chars[i].charCodeAt(0)].name}\n`;
					});
				}
				if (text.length >= 1000) text = text.substring(0, 1000) + "...";

				return msg.edit(`\`\`\`${text}\`\`\``);
			});
	},
};
