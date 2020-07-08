#!/usr/bin/env node
(async () => {
	try {
		const request = require('@aero/centra'),
			sleep = require('sleep-async')().Promise.sleep,
			cliProgress = require('cli-progress')
		const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)
		const [,, mod, count, timeout=100] = process.argv
		if (!mod || !count) return console.log('You need to specify a module and a download count.')
		const data = await request(`https://registry.npmjs.org/${mod}`).json()
		if (data.error)	return console.error(`Could not find module '${mod}'.`)
		else console.log(`Adding ${count} downloads to '${mod}' using a ${timeout}ms timeout.\n`)
		const tarballUrl = data.versions[data['dist-tags'].latest].dist.tarball
		progress.start(count, 0)
		for (let counter = 1; counter <= count;) {
			if ((await request(tarballUrl).send()).statusCode === 200) {
				progress.update(++counter)
				await sleep(parseInt(timeout))
			}
		}
		progress.stop()
		console.log(`\nDone!\nhttps://npmjs.com/${mod}`)
	}catch{
		console.error('An unknown error occured. Please retry.')
	}
})()
