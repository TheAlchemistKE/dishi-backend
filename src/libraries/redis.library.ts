import _Redis from 'ioredis'
import Redis from 'ioredis'

const {
	REDIS_HOST,
	REDIS_PORT,
	REDIS_PASSWORD,
	REDIS_KEY_PREFIX,
	ACTIVE_SESSION_HOURS
} = process.env

class Singleton {
	private client: any

	async connect() {
		this.client = new _Redis({
			host: REDIS_HOST,
			port: REDIS_PORT,
			password: REDIS_PASSWORD,
			enableReadyCheck: true,
			autoResubscribe: true,
			retryStrategy: times => {
				return Math.min(times * 500, 5000)
			}
		})

		this.client.on('error', error => {
			console.error(error)
		})

		this.client.on('connect', () => {
			console.info('REDIS client connected')
		})
	}

	getClient() {
		return this.client
	}

	save(
		key: any,
		value: any,
		ex: number = 60 * 60 * Number(ACTIVE_SESSION_HOURS)
	) {
		return new Promise((resolve, reject) => {
			this.getClient().set(
				`${REDIS_KEY_PREFIX}${key}`,
				value,
				'EX',
				ex,
				(error, result) => {
					if (error) return reject(error)
					return resolve(result)
				}
			)
		})
	}

	retrieve(key) {
		return new Promise((resolve, reject) => {
			this.getClient().get(
				`${REDIS_KEY_PREFIX}${key}`,
				(error, value) => {
					if (error) return reject(error)
					return resolve(value)
				}
			)
		})
	}

	remove(key, token) {
		return new Promise((resolve, reject) => {
			this.getClient().get(
				`${REDIS_KEY_PREFIX}${key}`,
				(error, result) => {
					if (error) return reject(error)
					const payload = result === null ? [] : result
					const parsedResult =
						typeof payload === 'string' ? JSON.parse(payload) : []
					if (parsedResult.length < 1) return reject(false)
					const isLoggedIn = parsedResult.some(session => {
						if ((session.token === token, session.active === true))
							return true
					})
					if (isLoggedIn) {
						const stream = this.getClient().scanStream({
							match: `${REDIS_KEY_PREFIX}${key}`
						})

						stream.on('data', keys => {
							if (keys.length) {
								const pipeline = this.getClient().pipeline()
								keys.forEach(key => {
									pipeline.del(key)
								})
								pipeline.exec()
							} else {
								reject(false)
							}
						})

						stream.on('end', () => resolve(true))

						stream.on('error', error => {
							console.error(error)
							return reject(error)
						})
					}
				}
			)
		})
	}

	destroy() {
		return new Promise((resolve, reject) => {
			const stream = this.getClient().scanStream({
				match: `${REDIS_KEY_PREFIX}*`
			})

			stream.on('data', async keys => {
				if (keys.length) {
					const pipeline = this.getClient().pipeline()
					keys.forEach(key => {
						pipeline.del(key)
					})
					await pipeline.exec()
				}
			})

			stream.on('end', () => resolve(true))

			stream.on('error', error => {
				console.error(error)
				return reject(error)
			})
		})
	}

	list() {
		return new Promise((resolve, reject) => {
			const stream = this.getClient().scanStream({
				match: `*`
			})

			stream.on('data', async keys => {
				const data = {}
				for (const key of keys) {
					data[key] = key
				}
				return resolve(data)
			})

			stream.on('error', error => {
				console.error(error)
				return reject(error)
			})
		})
	}
}

const instance = new Singleton()
instance.connect()

export const Redis = instance
