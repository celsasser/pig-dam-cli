/**
 * Date: 6/19/20
 * Time: 11:34 PM
 * @license MIT (see project's LICENSE file)
 */

import * as commander from "commander";
import {
	errorToDiagnosticString,
	errorToFriendlyString
} from "pig-dam-core";
import {CliCommand, CliCommandOptions} from "./types";

/********************
 * Public interface
 ********************/

/**
 * Given the candidates we will process the args and see who is the lucky winner and run him.
 * @param candidates - probably want to use findCliCommands to populate this guy
 * @param args
 */
export async function executeCliCommand(candidates: CliCommand[], args: string[] = process.argv): Promise<void> {
	const commander = setupCommander(candidates);
	try {
		await commander.parseAsync(args);
	} catch(error) {
		console.error(error.message);
		process.exit(1);
	}
}

/********************
 * Private Interface
 ********************/
/**
 * Executes our lucky winner who has been promoted from a candidate to a full grown command.
 * @param command - the chosen sub-command
 * @param options - commander stores options in the sub-command instance. We aren't going to fight it.
 * @param args - execution arguments except that commander attaches itself as a final argument. We will remove it.
 */
async function executeCommand(command: CliCommand, options: commander.Command, ...args: any[]): Promise<void> {
	return command.execute(options as CliCommandOptions, ...args.slice(0, args.length-1))
		.catch(error => {
			// create a simple error with a formatted error message that we will write to console in executeCliCommand
			throw new Error(("debug" in options)
				? `error: ${errorToDiagnosticString(error)}`
				: `error: ${errorToFriendlyString(error)}`
			);
		});
}

/**
 * Loads package.json and pulls out the version
 */
function getModuleVersion(): string {
	const packageJson = require("../package.json");
	return packageJson.version;
}

/**
 * Creates and configures an instance of `Command`:
 * - setups up boiler plate options
 * - configures our `candidates`
 * - sets up execution handlers
 */
function setupCommander(candidates: CliCommand[]): commander.Command {
	const program = new commander.Command()
		.version(getModuleVersion());
	candidates.forEach(function(candidate) {
		const specification = candidate.specification;
		const subCommand = program.command(specification.syntax)
			.description(specification.description)
			.option("-d, --debug", "Logs more detailed output")
			.option("-v, --verbose", "Logs more output");
		(specification.options || []).forEach(function(option) {
			subCommand.option(`-${option.short}, --${option.long}`, option.description, option.default);
		});
		subCommand.action(executeCommand.bind(null, candidate, subCommand));
	});
	return program;
}
