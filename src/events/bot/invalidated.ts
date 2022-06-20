import Event from "../../structures/Event";
import { pm2Name } from "../../Config";
import { exec } from "shelljs";
// import { sequelize } from "../../utils/database/connection";

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-expect-error
		super(...args, {
			once: true,
		});
	}

	async run() {
		for (let _ = 0; _ < 5; _++) this.client.log.warn("CLIENT SESSION BECAME INVALIDATED");
		this.client.log.warn("Stopping the PM2 process, destroying the client and closing the database");

		this.client.destroy();
		// sequelize.close();

		this.client.log.info("Closed everything <3");

		exec(`pm2 stop ${pm2Name}`);
	}
}
