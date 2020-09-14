const mongoose = require("mongoose");
var clc = require("cli-color");

module.exports = {
	init: () => {
		const dbOptions = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			autoIndex: false,
			poolSize: 5,
			connectTimeoutMS: 10000,
			family: 4,
		};

		mongoose.connect(process.env.MONGODB_URI, dbOptions);
		mongoose.set("useFindAndModify", false);
		mongoose.Promise = global.Promise;

		mongoose.connection.on("connected", () => {
			console.log(clc.green("[+] Mongoose has successfully connected!"));
		});

		mongoose.connection.on("err", (err) => {
			console.error(clc.red(`[!] Mongoose connection error: \n${err.stack}`));
		});

		mongoose.connection.on("disconnected", () => {
			console.warn(clc.yellow("[!] Mongoose connection lost"));
		});
	},
};
