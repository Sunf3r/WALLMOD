export default class Collection<K, V> extends Map {
	limit: num
	base?: any

	constructor(limit?: num, base?: any) {
		super()
		this.limit = limit === 0 ? 0 : limit || 100
		this.base = base
	}

	// Add: adds a value to the collection
	add(key: K, value: V | object, extra?: any[]): V {
		if (!key) throw new Error('Missing object key')

		const existing = this.get(key)
		if (existing) return existing

		if (this.base) {
			value = (value instanceof this.base ||
					value?.constructor?.name === this.base.name)
				? value
				: new this.base(key, ...extra!)
		}

		this.set(key, value)

		if (this.limit && this.size > this.limit) {
			const iter = this.keys()
			while (this.size > this.limit) {
				this.delete(iter.next().value)
			}
		}

		return value as V
	}

	// Update: updates a item in the collection
	update(key: K, value: V, extra?: any[]): V {
		if (!key) throw new Error('Missing object key')

		const item = this.get(key)
		if (!item) return this.add(key, value, extra)

		value = Object.assign(item, value)
		this.set(key, value)

		return item
	}

	// Filter: same as Array#filter
	filter(func: (item: V) => any): V[] {
		const res = []

		for (const item of this.values()) {
			if (func(item)) res.push(item)
		}

		return res
	}

	// Find: same as Array#find
	find(func: (item: V) => any): V | undefined {
		for (const item of this.values()) {
			if (func(item)) return item
		}

		return undefined
	}

	// Map: same as Array#map
	map<T>(func: (item: V) => T): T[] {
		const arr = []

		for (const item of this.values()) arr.push(func(item))

		return arr
	}

	// Random: returns a random item of the Map
	random(): V {
		const index = Math.floor(Math.random() * this.size)
		const iter = this.values()

		for (let c = 0; c < index; ++c) iter.next()

		return iter.next().value
	}

	// Every: Returns true if all items pass in the check
	// Returns false if one item does not pass in the function
	every(func: (item: V) => bool): bool {
		for (const item of this.values()) {
			if (!func(item)) return false
		}

		return true
	}

	// Some: Returns true if some item passes in the function
	some(func: (item: V) => any): bool {
		for (const item of this.values()) {
			if (func(item)) return true
		}

		return false
	}

	// Reduce: same as Array#reduce
	reduce(func: Function, initialValue: any): any {
		const iter = this.values()
		let val
		let result = initialValue === undefined ? iter.next().value : initialValue

		while ((val = iter.next().value) !== undefined) {
			result = func(result, val)
		}

		return result
	}

	// Remove: what do you think this method does?
	remove(id: K): V | null {
		const item = this.get(id)
		if (!item) return null

		this.delete(id)

		return item
	}

	// toJSON: Returns a JSON object containing the id: value pairs
	toJSON() {
		const json = {}

		// @ts-ignore json obj does not have a type
		for (const item of this.values()) json[item.id] = item

		return json
	}
}
