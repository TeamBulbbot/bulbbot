module.exports = {
	'en-US.{ts,json}': 'node scripts/writeEnUsJson.js && git add',
	'*.{js,ts,md}': 'prettier --write',
	'*.ts': () => 'yarn typecheck',
	'*.{js,ts}': 'yarn eslint',
	'*.prisma': () => 'yarn prisma format',
}
