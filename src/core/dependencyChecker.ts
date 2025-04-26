import { execSync } from 'child_process'

export function checkKotlinDependencies(): boolean {
	try {
		const kotlinVersion = execSync('kotlin -version', {
			stdio: 'pipe',
		}).toString()

		return kotlinVersion.includes('Kotlin')
	} catch (e) {
		return false
	}
}
