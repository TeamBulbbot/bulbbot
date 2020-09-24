const { readdirSync } = require("fs");
const ascii = require("ascii-table");
const { resolve } = require("path");
const table = new ascii("Discord Bot").setHeading("Command", "Status");

module.exports = (client) => {
  readdirSync(resolve(__dirname, "../commands/")).forEach((dir) => {
    const commands = readdirSync(
      resolve(__dirname, `../commands/${dir}/`)
    ).filter((f) => f.endsWith(".js"));

    for (let file of commands) {
      let pull = require(`../commands/${dir}/${file}`);

      if (pull.name) {
        client.commands.set(pull.name, pull);
        table.addRow(file, "✅");
      } else {
        table.addRow(file, "❌");
        continue;
      }

      if (pull.aliases && Array.isArray(pull.aliases))
        pull.aliases.forEach((alias) => client.aliases.set(alias, pull.name));
    }

    console.log(table.toString());
  });
};
