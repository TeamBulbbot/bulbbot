const Infraction = require("../../../models/infraction");
const Logger = require("../../../utils/other/winston");

const Claim = require("./claim");
const Info = require("./info");
const List = require("./list");
const ModSearch = require("./modsearch");
const OffenderSearch = require("./offedersearch");
const Remove = require("./remove");
const Search = require("./search");
const Update = require("./update");

module.exports = {
	Handle: async (option, client, message, args) => {
		switch (option) {
			case "claim":
				Claim.Call(client, message, args);
				break;

			case "info":
				Info.Call(client, message, args);
				break;

			case "list":
				await List.Call(client, message, await GetAllInfs(message.guild.id));
				break;

			case "modsearch":
				ModSearch.Call(client, message, args);
				break;

			case "offendersearch":
				OffenderSearch.Call(client, message, args);
				break;

			case "remove":
				Remove.Call(client, message, args);
				break;

			case "search":
				Search.Call(client, message, args);
				break;

			case "update":
				Update.Call(client, message, args);
				break;

			default:
				break;
		}
	},
};

async function GetAllInfs(guildId) {
	const Infs = await Infraction.find({ guildID: guildId }, async (err, _g) => {
		if (err) Logger.error(err);
	});

	return Infs;
}
