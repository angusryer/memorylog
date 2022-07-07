import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { Command } from "commander";
import { build, serve } from "esbuild";
import { createServer, request } from "http";
import { spawn } from "child_process";
import dayjs from "dayjs";
import chalk from "chalk";

import {
	getEsBuildConfig,
	srcHtmlFile,
	devServerOutputHtmlFile,
	devServerOutputDir,
	devServerOutputJsFile
} from "../config/esbuild-config.js";

const prepareOutputDir = () => {
	!existsSync(`${devServerOutputDir}/`) && mkdirSync(`${devServerOutputDir}/`);
};

const injectJs = () => {
	
	try {
		const htmlStr = readFileSync(srcHtmlFile)
			.toString()
			.replace(
				/<\/body>/,
				`\n\t\t<script src="${devServerOutputJsFile}"></script>\n\t</body>`
			);

		writeFileSync(devServerOutputHtmlFile, htmlStr);

		const message = `Successfully injected ${devServerOutputJsFile} into ${devServerOutputHtmlFile}.`;
		console.log(
			`[ ${chalk.green(dayjs().format("h:mm:ss A"))} ] Injector: ${chalk.green(
				message
			)}`
		);
	} catch (error) {
		const message = `Error injecting ${devServerOutputJsFile} into ${devServerOutputHtmlFile}...`;
		console.log(
			`[ ${chalk.grey(dayjs().format("h:mm:ss A"))} ] Injector: ${chalk.red(
				message
			)}`
		);
	}
};

const createBuildServer = async () => {
	const NODE_PORT = 3005;
	const clients = [];

	build(getEsBuildConfig(clients)).catch(() => process.exit(1));

	const result = await serve({ servedir: devServerOutputDir }, {});

	createServer((requestListener, res) => {
		const { url, method, headers } = requestListener;
		if (requestListener.url === "/dev-server")
			return clients.push(
				res.writeHead(200, {
					"Content-Type": "text/event-stream",
					"Cache-Control": "no-cache",
					Connection: "keep-alive"
				})
			);
		const urlPath = ~url.split("/").pop().indexOf(".") ? url : "/index.html"; // accommodates PWAs with router
		requestListener.pipe(
			request(
				{ hostname: "0.0.0.0", port: 8000, path: urlPath, method, headers },
				(incomingMessage) => {
					res.writeHead(incomingMessage.statusCode, incomingMessage.headers);
					incomingMessage.pipe(res, { end: true });
				}
			),
			{ end: true }
		);
	}).listen(NODE_PORT);

	console.log(
		`⚡ Development build server running on ${result.host}:${result.port}`
	);
	console.log(`⚡ Node hot-reloader running on ${result.host}:${NODE_PORT}`);
};

const createLintServer = () => {
	const eslint = spawn("npx esw", ["--watch --changed --color"], {
		shell: true
	});
	eslint.stdout.on("data", (data) => {
		console.log(
			`[ ${chalk.grey(dayjs().format("h:mm:ss A"))} ] eslint: \n${data}`
		);
	});

	eslint.on("error", (error) => {
		console.log(
			`[ ${chalk.grey(dayjs().format("h:mm:ss A"))} ] eslint: error \n${
				error.message
			}`
		);
	});
};

const createTscServer = () => {
	const tsc = spawn(
		"npx tsc",
		["--noEmit --watch --skipLibCheck --pretty --project tsconfig.json"],
		{
			shell: true
		}
	);
	tsc.stdout.on("data", (data) => {
		console.log(`${data}`);
	});

	tsc.on("error", (error) => {
		console.log(`error: ${error.message}`);
	});
};

const main = async () => {
	const program = new Command();

	program.option("-l, --lint", "Enable eslint while in watch mode.");
	program.parse(process.argv);

	const options = program.opts();

	prepareOutputDir();
	injectJs();
	createBuildServer();
	createTscServer();
	if (options.lint) createLintServer();
};

main();
