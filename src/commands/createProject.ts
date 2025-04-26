import * as vscode from 'vscode'
import { createKotlinProject } from '../core/projectCreator'

export function registerCreateProjectCommand(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand(
		'kotlin-tools.createProject',
		async () => {
			try {
				await createKotlinProject()
				vscode.window.showInformationMessage('Project created successfully!')
			} catch (error) {
				vscode.window.showErrorMessage(
					`Project creation failed: ${
						error instanceof Error ? error.message : error
					}`
				)
			}
		}
	)

	context.subscriptions.push(disposable)
}
