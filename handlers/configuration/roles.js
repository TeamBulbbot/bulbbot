const Role = require("../../models/role");

module.exports = {
	Change_Admin_role: async (guildId, roleId) => {
		Role.findOneAndUpdate({ guildID: guildId }, { admin: roleId }, function (error) {
			if (error) {
				console.error(clc.red(error));
			}
		});
	},
	Change_Mod_role: async (guildId, roleId) => {
		Role.findOneAndUpdate({ guildID: guildId }, { moderator: roleId }, function (error) {
			if (error) {
				console.error(clc.red(error));
			}
		});
	},
};
