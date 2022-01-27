export interface Statistic {
	continent: string
	country: string
	population: number
	cases: {
		new: number | any
		active: number | any
		critical: number | any
		recovered: number | any
		'1M_pop': number | any
		total: number | any
	}
	deaths: {
		new: number | any
		'1M_pop': number | any
		total: number | any
	}
	tests: {
		'1M_pop': number | any
		total: number | any
	}
	day: string
	time: string
}

export interface Country {
	name: string
	alpha2code: string
	alpha3code: string
	latitude: number
	longitude: number
}

export interface CountryStatistic extends Country, Statistic {
	db_name?: string
}

export interface DBRecord {
	_id?: string
	date: string
	location: string
	new_cases: string
	new_deaths: string
	total_cases: string
	total_deaths: string
	weekly_cases: string
	weekly_deaths: string
	biweekly_cases: string
	biweekly_deaths: string
	__v?: number
}

export type History = {
	date: string
	new_cases: string
	new_deaths: string
	total_cases: string
	total_deaths: string
	weekly_cases: string
	weekly_deaths: string
	biweekly_cases: string
	biweekly_deaths: string
}

export type Location = {
	location: string
	provinces: Array<{
		county: string
		zip: string
		state: string
		lat: string
		lng: string
		cumulative: string
		deaths: string
		recovered: string
	}>
	lat: string
	lng: string
	cumulative: string
	deaths: string
	recovered: string
	_id?: string
	__v?: number
}
