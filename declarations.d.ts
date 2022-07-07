declare module "*.css";
declare module "*.scss";

interface props {
	children?: HTMLElement | undefined;
	[k as string]: any;
}
