import * as vscode from 'vscode';
import * as util from './utils/Util';
import * as devCommands from './utils/devCommands';

import { ProjectProvider, LibertyProject } from './utils/libertyProject';

export async function activate(context: vscode.ExtensionContext) {
	console.log('"vscode-liberty-dev" extension is now active!');

	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (workspaceFolders !== undefined) {
		var allPomPaths: string[] = [];
		for (let folder of workspaceFolders) {
			var pomPaths: string[] = util.getAllPomPaths(folder);
			allPomPaths = allPomPaths.concat(pomPaths);
		}

		if (vscode.workspace.rootPath !== undefined) {
			const projectProvider = new ProjectProvider(vscode.workspace.rootPath, allPomPaths);
			vscode.window.registerTreeDataProvider('liberty-dev', projectProvider);
			vscode.workspace.onDidChangeTextDocument((e) => {
				pomPaths.forEach((pom) => {
					console.log("pom: " + pom);
					if (pom === e.document.uri.fsPath) {
						projectProvider.refresh();
					}
				});
			});
		}
	}
	context.subscriptions.push(
		vscode.commands.registerCommand('extension.open.project', (pomPath) => devCommands.openProject(pomPath))
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('liberty.dev.start', async (libProject?: LibertyProject | undefined) => devCommands.startDevMode(libProject))
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('liberty.dev.stop', async (libProject?: LibertyProject | undefined) => devCommands.stopDevMode(libProject))
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('liberty.dev.custom', async (libProject?: LibertyProject | undefined) => devCommands.customDevMode(libProject))
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('liberty.dev.run.tests', async (libProject?: LibertyProject | undefined) => devCommands.runTests(libProject))
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('liberty.dev.open.failsafe.report', async (libProject?: LibertyProject | undefined) => devCommands.openReport('failsafe', libProject))
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('liberty.dev.open.surefire.report', async (libProject?: LibertyProject | undefined) => devCommands.openReport('surefire', libProject))
	);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
