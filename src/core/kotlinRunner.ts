import { exec } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'
import * as vscode from 'vscode'
import { getKotlinPath } from '../utils/fileUtils'

const execAsync = promisify(exec)

export class KotlinRunner {
	private static terminal: vscode.Terminal | null = null
	private projectPath: string

	constructor(projectPath: string) {
		this.projectPath = projectPath

		if (!KotlinRunner.terminal || KotlinRunner.terminal.exitStatus) {
			KotlinRunner.terminal = vscode.window.createTerminal('Kotlin Runner')
		}
	}

	async compileAndRun(): Promise<void> {
		try {
			await this.compile()
			await this.run()
		} catch (error) {
			throw new Error(
				`Execution failed: ${error instanceof Error ? error.message : error}`
			)
		}
	}

	private async compile(): Promise<void> {
		const kotlinPath = getKotlinPath()
		const libPath = path.join(kotlinPath, 'lib')

		const jarFiles = fs
			.readdirSync(libPath)
			.filter(file => file.endsWith('.jar'))
			.map(file => path.join(libPath, file))

		if (jarFiles.length === 0) {
			throw new Error(`No JAR files found in ${libPath}`)
		}
		const classpath = jarFiles.join(path.delimiter)

		const command = `kotlinc "${path.join(
			this.projectPath,
			'src/main/kotlin/Main.kt'
		)}" -d "${path.join(
			this.projectPath,
			'out/production/classes'
		)}" -cp "${classpath}"`

		await vscode.window.withProgress(
			{
				location: vscode.ProgressLocation.Notification,
				title: 'Compiling Kotlin...',
			},
			async () => {
				const { stderr } = await execAsync(command)
				if (stderr) {
					throw new Error(stderr)
				}
			}
		)
	}

	private async run(): Promise<void> {
		try {
			const kotlinPath = getKotlinPath()
			KotlinRunner.terminal?.sendText('\x1Bc')
			KotlinRunner.terminal?.show()
			KotlinRunner.terminal?.sendText(
				`java -cp "out/production/classes${path.delimiter}${kotlinPath}/lib/*" MainKt`
			)
		} catch (error) {
			vscode.window.showErrorMessage(`Runtime error: ${error}`)
		}
	}
}
