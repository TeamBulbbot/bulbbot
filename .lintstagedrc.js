module.exports = {
	'*.{js,ts}': 'yarn eslint',
	'*.{js,ts,md}': 'prettier --write',
	'*.ts': () => 'yarn typecheck',
}
