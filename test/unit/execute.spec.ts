/**
 * Date: 6/20/20
 * Time: 10:57 PM
 * @license MIT (see project's LICENSE file)
 */

import {executeCliCommand} from "../../src";
// tslint:disable-next-line:no-var-requires
const {TestCommandOne} = require("./input/command-one.js");

describe("execute", function() {
	describe("executeCliCommand", function() {
		/**
		 * Creates a test command with a mocked `execute` method
		 */
		function createTestCommandInstance(): jest.Mocked<typeof TestCommandOne> {
			const command = new TestCommandOne();
			command.execute = jest.fn()
				.mockResolvedValue(undefined);
			return command;
		}

		it("should propery execute our TestCommandOne with short options", async function() {
			const args = [
				"node",
				"runner.js",
				"run",
				"-i",
				"name"
			];
			const command = createTestCommandInstance();
			return executeCliCommand([command], args)
				.then(function(result: any): void {
					expect(result).toBeUndefined();
					expect(command.execute.mock.calls[0][0]).toHaveProperty("imaginary", true);
					expect(command.execute.mock.calls[0][1]).toEqual("name");
				});
		});

		it("should propery execute our TestCommandOne with long options", async function() {
			const args = [
				"node",
				"runner.js",
				"run",
				"--imaginary",
				"name"
			];
			const command = createTestCommandInstance();
			return executeCliCommand([command], args)
				.then(function(): void {
					expect(command.execute.mock.calls[0][0]).toHaveProperty("imaginary", true);
					expect(command.execute.mock.calls[0][1]).toEqual("name");
				});
		});
	});
});
