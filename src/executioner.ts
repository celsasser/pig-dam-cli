/**
 * Date: 6/19/20
 * Time: 11:34 PM
 * @license MIT (see project's LICENSE file)
 */

import * as commander from "commander";
import * as _ from "lodash";
import {CliCommand, CliCommandOptions} from "./types";

/********************
 * Public interface
 ********************/

/**
 * Given the candidates we will process the args and see who is the lucky winner and run him.
 * @param candidates - probably want to use findCliCommands to populate this guy
 * @param args - may optionally specify your own but `process.args` is most likely going to fit the bill.
 */
export function executeCliCommand(candidates: CliCommand[], args: string[] = process.argv): Promise<void> {
	const commander = setupCommander(candidates);
	// note: we let commander handle synchronous errors and we deal with all command runtime errors. The reason is
	// that he doesn't handle asynchronous errors and they end up being unhandled. But if we handle them then we
	// are responsible for logging. And we have special needs for command logging. So we divide responsibility.
	return commander.parseAsync(args)
		.then(() => undefined);
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
			// For the reasons documented above in `executeCliCommand` we handle async errors here and snuff the error.
			// But don't really care one way or the other 'cause we are exiting the process.
			if("debug" in options) {
				console.error(error);
			} else {
				console.error(`error: ${error.message}`);
			}
			process.exit(_.get(error, "statusCode", 1));
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
