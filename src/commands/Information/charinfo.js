const Command = require("../../structures/Command");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Returns information about the characters provided",
			category: "Information",
			usage: "!charinfo <characters>",
			examples: ["charinfo 🍰"],
			argList: ["characters:string"],
			minArgs: 1,
			maxArgs: -1,
		});
	}

	async run(message, args) {
		const categories = [
			"Cc",
			"Zs",
			"Po",
			"Sc",
			"Ps",
			"Pe",
			"Sm",
			"Pd",
			"Nd",
			"Lu",
			"Sk",
			"Pc",
			"Ll",
			"So",
			"Lo",
			"Pi",
			"Cf",
			"No",
			"Pf",
			"Lt",
			"Lm",
			"Mn",
			"Me",
			"Mc",
			"Nl",
			"Zl",
			"Zp",
			"Cs",
			"Co",
		];

		const chars = args.join(" ");
		let text = "";

		for (let i = 0; i < chars.length; i++) {
			categories.forEach(cat => {
				const Unicode = require(`unicode/category/${cat}`);
				const charCode = Unicode[chars[i].codePointAt(0)];
				if (charCode !== undefined) return (text += `${chars[i]} - ${charCode.value} | ${charCode.name}\n`);
			});
		}
		if (text === "") text = "Unable to find any data about the given character(s)";
		else if (text.length >= 1000) text = text.substring(0, 1000) + "...";

		return message.channel.send(text, { code: "" });
	}
};
