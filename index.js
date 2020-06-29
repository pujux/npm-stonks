#!/usr/bin/env node
(async () => {
	const request = require('@aero/centra')
		sleep = require('sleep-async')
	const [,, mod, count] = process.argv
	if (!mod || !count) return
	console.log(`adding ${count} downloads to '${mod}'`)
	const data = await request(`https://registry.npmjs.org/${mod}`).json()
	if (data.error) return
	const tarballUrl = data.versions[data['dist-tags'].latest].dist.tarball
	for (let counter = 1; counter <= count;) {
		if ((await request(tarballUrl).send()).statusCode === 200) counter++
		await sleep(1000)
	}
	console.log(`finished`)
})()