const Commands = require("./overrides/commands");
const Roles = require("./overrides/roles");
const Translator = require("../../utils/lang/translator");

module.exports = {
	name: "override",
	category: "configuration",
	description: "Configure the overrides.",
	usage: "override <category> <sub category>",
	clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS"],
	userPermissions: [],
	clearanceLevel: 100,
	run: async (client, message, args) => {
		if (args[0] === undefined)
			return message.channel.send(
				Translator.Translate("override_missing_arg_category")
			);
		if (args[1] === undefined) args[1] = "null";

		switch (args[0].toLowerCase()) {
			case "command":
			case "commands":
				switch (args[1].toLowerCase() || "") {
					case "edit":
					case "modify":
						Commands.Edit(message, args);
						break;
					case "new":
					case "add":
						Commands.New(client, message, args);
						break;
					case "disable":
						Commands.Disable(message, args);
						break;
					case "enable":
						Commands.Enable(message, args);
						break;
					default:
						message.channel.send(
							Translator.Translate("override_invalid_subcategory")
						);
						break;
				}

				break;
			case "role":
			case "roles":
				switch (args[1].toLowerCase()) {
					case "edit":
					case "modify":
						Roles.Edit(message, args);
						break;
					case "new":
					case "add":
						Roles.Add(message, args);
						break;
					default:
						message.channel.send(
							Translator.Translate("override_invalid_subcategory_edit_add")
						);
						break;
				}

				break;
			default:
				message.channel.send(Translator.Translate("override_invalid_category_subcategory"));
				break;
		}
	},
};
