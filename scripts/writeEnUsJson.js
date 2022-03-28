// This file is JS rather than TS so that we don't have to compile it
const fs = require("fs");
const { default: en_US } = require("../build/languages/en-US.js");
const current = require("../build/languages/en-US.json");
const prettier = require('prettier');
const path = require("path");

if(typeof en_US === "undefined" || !en_US) throw new Error("Cannot find en-US source file");

const prettierOptions = {
	printWidth: 200,
	endOfLine: "lf",
	parser: "json",
	proseWrap: "always",
	tabWidth: 4,
	useTabs: true,
	semi: true,
	singleQuote: false,
};

const formattedJsonFile = prettier.format(
	JSON.stringify(en_US),
	prettierOptions,
);

// Avoid writing & reporting when there's no changes
if(formattedJsonFile !== prettier.format(JSON.stringify(current), prettierOptions)) {
	fs.writeFileSync(
		path.resolve(__dirname, "../build/languages/en-US.json"),
		formattedJsonFile,
	);

	fs.writeFileSync(
		path.resolve(__dirname, "../src/languages/en-US.json"),
		formattedJsonFile,
	);

	console.log('Updated languages/en-US.json');
}
