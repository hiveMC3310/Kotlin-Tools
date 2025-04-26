import * as vscode from 'vscode'
import { registerCreateProjectCommand } from './commands/createProject'
import { registerRunKotlinCommand } from './commands/runKotlin'
import { checkKotlinDependencies } from './core/dependencyChecker'

export function activate(context: vscode.ExtensionContext) {
	try {
		if (!checkKotlinDependencies()) {
			vscode.window.showErrorMessage('Kotlin dependencies are missing!')
			return
		}

		registerCreateProjectCommand(context)
		registerRunKotlinCommand(context)
	} catch (error) {
		vscode.window.showErrorMessage(
			`Extension activation failed: ${
				error instanceof Error ? error.message : error
			}`
		)
	}
}

// This method is called when your extension is deactivated
export function deactivate() {}
