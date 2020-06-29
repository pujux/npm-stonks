#!/usr/bin/env node
(async () => {
	const request = require('@aero/centra')
		sleep = require('sleep-async'),
		cliProgress = require('cli-progress')
		
	const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)
	const [,, mod, count] = process.argv
	if (!mod || !count) return
	console.log(`Adding ${count} downloads to '${mod}'.\n`)
	const data = await request(`https://registry.npmjs.org/${mod}`).json()
	if (data.error)	return console.error(`Could not find module '${mod}'.`)
	const tarballUrl = data.versions[data['dist-tags'].latest].dist.tarball
	progress.start(count, 0)
	for (let counter = 1; counter <= count;) {
		if ((await request(tarballUrl).send()).statusCode === 200) {
			progress.update(counter)
			counter++
			await sleep(1000)
		}
	}
	progress.stop()
	console.log(`\nDone!`)
})()