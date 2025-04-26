import * as fs from 'fs'
import * as path from 'path'
import * as vscode from 'vscode'

export function getKotlinPath(): string {
	const config = vscode.workspace.getConfiguration('kotlin-tools')
	let kotlinPath = config.get(
		'kotlinPath',
		process.platform === 'win32' ? 'C:\\kotlin' : '/usr/local/bin/kotlin'
	)

	if (!kotlinPath) {
		throw new Error('Kotlin path not configured!')
	}

	const normalizedPath = path.normalize(kotlinPath)
	const stdlibPath = path.join(normalizedPath, 'lib', 'kotlin-stdlib.jar')

	if (!fs.existsSync(stdlibPath)) {
		throw new Error(`Invalid Kotlin path: ${normalizedPath}. Missing stdlib!`)
	}

	return normalizedPath
}

export async function getWorkspacePath(): Promise<string> {
	const folderUri = await vscode.window.showOpenDialog({
		canSelectFolders: true,
		canSelectFiles: false,
		openLabel: 'Select workspace folder',
	})

	if (!folderUri || folderUri.length === 0) {
		throw new Error('No workspace folder selected')
	}

	return folderUri[0].fsPath
}
