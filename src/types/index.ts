export type ProjectConfig = {
	name: string
	path: string
	kotlinVersion: string
}

export type CompilationResult = {
	success: boolean
	output?: string
	error?: string
}
