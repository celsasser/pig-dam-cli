/**
 * Date: 6/19/20
 * Time: 11:58 PM
 * @license MIT (see project's LICENSE file)
 */

import {findCliCommands} from "../../src";

describe("forager", function() {
	describe("findCommands", function() {
		it("should properly load all executable commands in our test directory", async function() {
			return findCliCommands(`${__dirname}/input`)
				.then(commands => {
					expect(commands.length).toEqual(2);
					commands.forEach(command => {
						expect(command).toHaveProperty("execute");
						expect(command).toHaveProperty("specification");
					});
				});
		});
	});
});
