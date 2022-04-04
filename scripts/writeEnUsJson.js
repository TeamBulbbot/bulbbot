// This file is JS rather than TS so that we don't have to compile it
const fs = require("fs");
// This is the current "en-US.json", which may be out of sync with en-US.ts
const current = require("../build/languages/en-US.json");
const prettier = require("prettier");
const path = require("path");

// Makeshift tsc-to-string
const ts = require("typescript");
const tsconfig = require("../tsconfig.json");
function tsCompile(source, options = tsconfig) {
	// Default options -- you could also perform a merge, or use the project tsconfig.json
	if (null === options) {
		options = { compilerOptions: { module: ts.ModuleKind.CommonJS } };
	}
	return ts.transpileModule(source, options).outputText;
}

// This is the TS source file, which we pass through the compiler (which shouldn't modify it other than removing types)
const source = fs.readFileSync(path.resolve(__dirname, "../src/languages/en-US.ts"), "utf8");
let compiledSource = tsCompile(source);
// Don't _EVER_ do this with something used in runtime
eval(compiledSource);
// The compiled typescript is exporting the object we want, so it runs `module.exports = {...};`
const { default: en_US } = module.exports;

if (!en_US) throw new Error("Cannot find en-US source file");

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

const formattedJsonFile = prettier.format(JSON.stringify(en_US), prettierOptions);

// Avoid writing & reporting when there's no changes
if (formattedJsonFile !== prettier.format(JSON.stringify(current), prettierOptions)) {
	fs.writeFileSync(path.resolve(__dirname, "../build/languages/en-US.json"), formattedJsonFile);

	fs.writeFileSync(path.resolve(__dirname, "../src/languages/en-US.json"), formattedJsonFile);

	console.log("Updated languages/en-US.json");
}
