module.exports = {
	name: "commnad",
	aliases: ["A1", "A2"],
	group: "Group",
	description: "Description of the command",
	defaultUsage: "command <required> [non required]",
	examples: [
		"command @mrphilip something here",
		"command 190160914765316096 something here",
	],
	requiredPermissions: ["EMBED_LINKS", "SEND_MESSAGES", "VIEW_CHANNEL"],
	userPermissions: [],
	defaultClearanceLevel: 0,
	expectedArgs: 1,
	args: ["user", "reason"],
	run: (client, message, args) => {
		// CODE GOES HERE
	},
};
