module.exports = {
	'*.{js,ts}': 'yarn lint',
	'*.ts': () => 'yarn typecheck',
}
