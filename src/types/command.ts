/**
 * Date: 6/19/20
 * Time: 11:35 PM
 * @license MIT (see project's LICENSE file)
 */

export type CliCommandOptions =  {
	debug?: boolean;
	verbose?: boolean;
	[key: string]: any
};

/**
 * Descriptions of a single command option
 */
export interface CliCommandOptionSpecification {
	/**
	 * Optional default
	 */
	default?: string;
	description: string;
	/**
	 * Full option name. For example, "long" to represent "--long"
	 */
	long: string;
	/**
	 * Short option name. May be 1 or more characters. For example, "l" to represent "-l"
	 */
	short: string;
}

export interface CliCommandSpecification {
	description: string;
	/**
	 * 0 or more options
	 */
	options?: CliCommandOptionSpecification[];
	/**
	 * Syntax of the command:
	 * - required: <name>
	 * - optional: [name]
	 */
	syntax: string;
}

/**
 * Interface for all cli commands
 */
export interface CliCommand {
	// tslint:disable-next-line:no-misused-new
	new (): CliCommand;
	specification: CliCommandSpecification;
	execute(options: CliCommandOptions, ...args: string[]): Promise<void>;
}
