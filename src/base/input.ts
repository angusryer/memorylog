function input({ className = "" }) {
	const container = document.createElement("div");
	const input = document.createElement("input");
	input.setAttribute("type", "text");
	className && input.setAttribute("class", `${className}`);
	return container.appendChild(input);
}

export { input };
