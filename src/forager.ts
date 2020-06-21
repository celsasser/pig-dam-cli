/**
 * Date: 6/19/20
 * Time: 11:48 PM
 * @license MIT (see project's LICENSE file)
 */

import * as klaw from "klaw";
import * as _ from "lodash";
import {parse as parsePath} from "path";
import {PigError} from "pig-dam-core";
import {CliCommand} from "./types";

/********************
 * Public Interface
 ********************/
/**
 * Searches for all executable commands within path and returns instances of them.
 * Executable commands must:
 * - be in a ".js" file without a "_" prefix
 * - export a class named as follows: \w*Command\w*
 * - this class should implement the CliCommand interface but we don't enforce that.
 */
export async function findCliCommands(path: string): Promise<CliCommand[]> {
	const commands: CliCommand[] = [];
	return new Promise((resolve, reject) => {
		klaw(path)
			.on("data", item => {
				const command = (itemHasPotential(item))
					? loadCommand(item)
					: undefined;
				if(command) {
					commands.push(command);
				}
			})
			.on("end", () => resolve(commands))
			.on("error", reject);
	});
}

/********************
 * Private Interface
 ********************/
/**
 * Does this file have all of the earmarks of a command. Rather does he have any
 * that precludes him from being a command file
 */
function itemHasPotential(item: klaw.Item): boolean {
	return item.stats.isFile()
		&& item.path.endsWith(".js")
		&& !parsePath(item.path).name.startsWith("_");
}

/**
 * If the item looks like it could be a command and load it if so otherwise return undefined
 */
function loadCommand(item: klaw.Item): CliCommand|undefined {
	try {
		const module = require(item.path);
		const property = _.find<string>(Object.keys(module), name => {
			return name.indexOf("Command") > -1
				&& typeof module[name] === "function";
		});
		if(property) {
			return new module[property]();
		} else {
			return undefined;
		}
	} catch(error) {
		throw new PigError({
			error,
			message: `unable to load ${item.path}`
		});
	}
}
