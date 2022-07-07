import esbuild from "esbuild";

esbuild.buildSync({
	entryPoints: ["./src/app.ts"],
	bundle: true,
	minify: true,
	sourcemap: true,
	target: ["chrome58", "firefox57", "safari11", "edge16"],
	outfile: "dist/index.js"
});
