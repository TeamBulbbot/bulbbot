const fs = require("fs")
const moment = require("moment")

module.exports = {
	report(type, data = {}) {
		const then = Date.now();
		fs.appendFileSync("./src/files/watchdog/watchdog.txt", `${moment().format()} | [WATCHDOG - REPORT] Check acknowledged. Checking for ${type} violations in '${typeof data}'\n`, function (err) {
			if (err) console.error(err)
		})

		switch (type) {
			case "WD_CHECK_NOT_NULL":
				for (let i = 0; i < Object.entries(data).length; i++) {
					fs.appendFileSync("./src/files/watchdog/watchdog.txt", `${moment().format()} | [WATCHDOG - REPORT] Checking for ${type} violations in '${Object.entries(data)[i][0]}'\n`, function (err) {
						if (err) console.error(err)
					});
					if (Object.entries(data)[i][1] === null) {
						fs.appendFileSync("./src/files/watchdog/watchdog.txt", `${moment().format()} | [WATCHDOG - REPORT] Check violated. Found ${type} violations found in '${typeof type}' Took ${Date.now() - then}ms\n`, function (err) {
							if (err) console.error(err)
						});
						return false;
					}
				}
				break;
			case "WD_CHECK_NOT_UNDEFINED":
				for (let i = 0; i < Object.entries(data).length; i++) {
					fs.appendFileSync("./src/files/watchdog/watchdog.txt", `${moment().format()} | [WATCHDOG - REPORT] Checking for ${type} violations in '${Object.entries(data)[i][0]}'\n`, function (err) {
						if (err) console.error(err)
					});
					if (Object.entries(data)[i][1] === undefined) {
						fs.appendFileSync("./src/files/watchdog/watchdog.txt", `${moment().format()} | [WATCHDOG - REPORT] Check violated. Found ${type} violations found in '${Object.entries(data)[i][0]}' Took ${Date.now() - then}ms\n`, function (err) {
							if (err) console.error(err)
						});
						return false;
					}
				}
				break;
			case "WD_CHECK_NOT_UNDEFINED_NULL":
				for (let i = 0; i < Object.entries(data).length; i++) {
					fs.appendFileSync("./src/files/watchdog/watchdog.txt", `${moment().format()} | [WATCHDOG - REPORT] Checking for ${type} violations in '${Object.entries(data)[i][0]}'\n`, function (err) {
						if (err) console.error(err)
					});
					if (Object.entries(data)[i][1] === undefined || Object.entries(data)[i][1] === null) {
						fs.appendFileSync("./src/files/watchdog/watchdog.txt", `${moment().format()} | [WATCHDOG - REPORT] Check violated. Found ${type} violations found in '${Object.entries(data)[i][0]}' Took ${Date.now() - then}ms\n`, function (err) {
							if (err) console.error(err)
						});
						return false;
					}
				}
				break;
			default:
				fs.appendFileSync("./src/files/watchdog/watchdog.txt", `${moment().format()} | [WATCHDOG - ERROR] Violation type '${type}' not recognized as valid detection type`, function (err) {
					if (err) console.error(err)
				});
				throw new TypeError(`Detection type '${type}' not recognized as valid detection type`)
		}

		fs.appendFileSync("./src/files/watchdog/watchdog.txt", `${moment().format()} | [WATCHDOG - REPORT] Check succeed. No ${type} violations found in '${typeof data}' Took ${Date.now() - then}ms\n`, function (err) {
			if (err) console.error(err)
		});
		return true;
	}
}