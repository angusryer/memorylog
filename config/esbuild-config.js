import dayjs from "dayjs";
import chalk from "chalk";
import { clean } from "esbuild-plugin-clean";
import { copy } from "esbuild-plugin-copy";
import cssModulePlugin from "esbuild-css-modules-plugin";

export const publicDir = "./public";
export const srcHtmlFile = `./src/index.html`;
export const devServerOutputJsFile = "dist/index.js"; // we want the dist folder that is a child of dev-server here
export const devServerOutputDir = "./dev-server";
export const devServerOutputHtmlFile = `${devServerOutputDir}/index.html`;

export const getEsBuildConfig = (clients) => {
	return {
		entryPoints: ["./src/app.ts"],
		bundle: true,
		minify: false,
		loader: {
			".ts": "ts"
		},
		tsconfig: "./tsconfig.json",
		incremental: true,
		sourcemap: true,
		outfile: `${devServerOutputDir}/${devServerOutputJsFile}`,
		banner: {
			js: ' (() => new EventSource("/dev-server").onmessage = () => location.reload())();'
		},
		watch: {
			onRebuild(error) {
				clients.forEach((res) => res.write("data: update\n\n"));
				clients.length = 0;
				if (error)
					console.log(
						`[ ${chalk.grey(dayjs().format("h:mm:ss A"))} ] DEV: ${chalk.red(
							"Error rebuilding..."
						)}`
					);
				else
					console.log(
						`[ ${chalk.green(dayjs().format("h:mm:ss A"))} ] DEV: ${chalk.green(
							"Successfully rebuilt."
						)}`
					);
			}
		},
		define: {
			"process.env.NODE_ENV": '"development"',
			"process.env.DEBUG": '"FALSE"',
			"process.env.GATEWAY_HOST": '"http://localhost"',
			"process.env.GATEWAY_PORT": '"5000"'
		},
		plugins: [
			clean({
				patterns: ["dev-server/*", `!${devServerOutputHtmlFile}`],
				sync: true,
				verbose: false
			}),
			copy({
				resolveFrom: "cwd",
				assets: {
					from: [`${publicDir}/**/*`],
					to: [`${devServerOutputDir}`],
					keepStructure: true
				}
			}),
			cssModulePlugin()
		]
	};
};
