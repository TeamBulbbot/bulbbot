module.exports = {
	'*.{js,ts}': 'yarn lint',
	'*.{js,ts,md}': 'prettier --write',
	'*.ts': () => 'yarn typecheck',
}
