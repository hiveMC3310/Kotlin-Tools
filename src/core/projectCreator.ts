import { promises as fs } from 'fs' // Используем асинхронные методы
import { mkdir, rm, writeFile } from 'fs/promises'
import * as path from 'path'
import * as vscode from 'vscode'
import { getWorkspacePath } from '../utils/fileUtils'

export async function createKotlinProject(): Promise<void> {
	const projectName = await vscode.window.showInputBox({
		prompt: 'Enter project name',
		validateInput: text =>
			text.match(/^[a-zA-Z0-9_-]+$/) ? null : 'Invalid project name',
	})

	if (!projectName) {
		throw new Error('Project name is required')
	}

	const workspacePath = await getWorkspacePath()
	const projectPath = path.normalize(path.join(workspacePath, projectName))

	await validateProjectPath(projectPath)
	await createProjectStructure(projectPath)
	await createProjectFiles(projectPath)

	const projectUri = vscode.Uri.file(projectPath)
	const choice = await vscode.window.showInformationMessage(
		`Project "${projectName}" created! Open in:`,
		'Current Window',
		'New Window'
	)
	if (choice) {
		const success = await vscode.commands.executeCommand(
			'vscode.openFolder',
			projectUri,
			choice === 'New Window'
		)

		// Ждем, пока проект загрузится
		if (success) {
			await new Promise(resolve => setTimeout(resolve, 1000))
			const mainFile = vscode.Uri.file(
				path.join(projectPath, 'src/main/kotlin/Main.kt')
			)
			try {
				const doc = await vscode.workspace.openTextDocument(mainFile)
				await vscode.window.showTextDocument(doc, { preview: false })
			} catch (e) {
				vscode.window.showErrorMessage('Failed to open Main.kt: ' + e)
			}
		}
	}
}

async function validateProjectPath(projectPath: string): Promise<void> {
	try {
		const stats = await fs.stat(projectPath)
		if (stats.isDirectory()) {
			const overwrite = await vscode.window.showWarningMessage(
				'Project folder exists. Overwrite?',
				{ modal: true },
				'Yes'
			)
			if (overwrite === 'Yes') {
				await rm(projectPath, { recursive: true, force: true })
			} else {
				throw new Error('Operation cancelled')
			}
		}
	} catch (error: any) {
		if (error.code !== 'ENOENT') {
			throw error
		}
	}
}

async function createProjectStructure(projectPath: string): Promise<void> {
	const dirs = [
		'src/main/kotlin',
		'src/test/kotlin',
		'out/production/classes',
		'lib',
	]

	await Promise.all(
		dirs.map(async dir => {
			const fullPath = path.join(projectPath, dir)
			await mkdir(fullPath, { recursive: true })
		})
	)
}

async function createProjectFiles(projectPath: string): Promise<void> {
	const mainKtContent = `fun main() {\n    println("Hello Kotlin!")\n}`
	const mainKtPath = path.join(projectPath, 'src/main/kotlin/Main.kt')

	await Promise.all([
		writeFile(mainKtPath, mainKtContent),
		writeFile(
			path.join(projectPath, '.gitignore'),
			'### IntelliJ IDEA ###\n\nout/\n!**/src/main**/out/\n!**/src/test/**/out/\n\n### Kotlin ###\n\n.kotlin\n\n### VS Code ###\n\n.vscode/\n'
		),
	])
}
