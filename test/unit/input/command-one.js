/**
 * Date: 6/20/20
 * Time: 12:18 AM
 * @license MIT (see project's LICENSE file)
 */

class TestCommandOne {
	constructor() {

	}

	get specification() {
		return {
			description: "runs and imaginary test",
			options: [{
				"description": "an imaginary option",
				"long": "imaginary",
				"short": "i"
			}],
			syntax: "run <name>"
		};
	}

	async execute() {

	}
}

module.exports = {
	TestCommandOne
};
