let hola = "espero que estes muy bien care mi palo";

function FirstLetterCap(str) {
	str = str.split(" ").map(str => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	});
	
	g = str.join().replaceAll(",", " ");
	return g;
}

function FirstLetterCap1(str) {
	str = str.split(" ");
	let h = [];

	str.map((str, i) => {
		if (i == 0) {
			str = str.charAt(0).toUpperCase() + str.slice(1);
		}

		h.push(str);
	});
	return h.join().replaceAll(",", " ");
}
console.log(FirstLetterCap(hola));
