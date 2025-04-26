import * as vscode from 'vscode'
import { KotlinRunner } from '../core/kotlinRunner'

export function registerRunKotlinCommand(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand(
		'kotlin-tools.run',
		async () => {
			try {
				const projectPath = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath
				if (!projectPath) {
					vscode.window.showErrorMessage('No project opened!')
					return
				}
				const runner = new KotlinRunner(projectPath)
				await runner.compileAndRun()
			} catch (error) {
				vscode.window.showErrorMessage(`Execution failed: ${error}`)
			}
		}
	)

	context.subscriptions.push(disposable)
}
