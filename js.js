document.addEventListener("DOMContentLoaded", function () {

	// SELECCION ELEMENTO CANVA Y DA UN CONTEXTO 
	const canvas = document.querySelector("#canvas")
	const ctx = canvas.getContext("2d")

	// VARIABLES
	let dibujar = false;
	let borrar = false;

	let activo = false;

	let height = canvas.height
	let width = canvas.width



	let coordenadas1 = 0;
	let coordenadas2 = 0;

	const reader = new FileReader()
	const img = new Image()

	let oldImage;



	// INICIA LIENZO
	ctx.beginPath();
	ctx.rect(0, 0, width, height);
	ctx.fillStyle = "rgba(255,255,255,1)";
	ctx.fill();

	//** IMAGEN ** //

	//DESCARGAR IMAGEN 
	document.getElementById("guardar").addEventListener("click", function () {
		const image = canvas.toDataURL();
		const link = document.createElement("a");
		link.href = image;
		link.download = 'image.png'
		link.click();
	});

	//SELECCIONAR ARCHIVO Y CARGARLA EN CANVA
	document.getElementById('uploader').addEventListener('change', function (e) {
		reader.onload = () => {
			img.onload = () => {

				ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
				let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
				oldImage = imageData
			}
			img.src = reader.result
		}
		reader.readAsDataURL(e.target.files[0])
	})

	// **HERRAMIENTAS CANVAS** //

	//SWITCH ESTADO DE LAPIZ
	document.getElementById("lapiz").addEventListener("click", function () {
		if (dibujar) {
			dibujar = false;
		} else {
			dibujar = true;
			borrar = false;
		}
		console.log(dibujar);
	});

	//SWITCH ESTADO GOMA
	document.getElementById("borrar").addEventListener("click", function () {
		if (borrar) {
			borrar = false
		} else {
			borrar = true
			dibujar = false
		}
		console.log(borrar);
	});

	//LIMPIAR CANVA
	document.getElementById("limpiar").addEventListener("click", function () {
		dibujar = false
		borrar = false

		canvas.width = width;
		canvas.height = height;

		ctx.beginPath();
		ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "rgba(255,255,255,1)";
		ctx.fill();
		document.getElementById("uploader").value = '';
		canvas.style.filter = "";
	});




	//EVENTO PARA ACTIVAR EL PAINT
	canvas.addEventListener("mousedown", function () {
		activo = true;
	})

	//EVENTO PARA PINTAR
	canvas.addEventListener("mousedown", mouseClick);

	//EVENTO PARA DEJAR DE PINTAR
	canvas.addEventListener("mouseup", function () {
		activo = false;
	})


	//FUNCION PARA COMENZAR A PINTAR EN EL CANVAS
	function mouseClick() {
		if (activo) {
			coordenadas1 = getCoordinates(event);
			canvas.addEventListener("mousemove", function () {
				draw();
			})
		}
	}
	//RETORNA LAS COORDENADAS DEL PUNTERO    

	function getCoordinates(event) {
		return {
			x: event.clientX,
			y: event.clientY
		};
	}

	// DIBUJAR O BORRAR SEGUN HERRAMIENTA ACTIVA   
	function draw() {

		let colorLapiz = document.getElementById("colorLapiz").value;
		let grosorLapiz = document.getElementById("grosorLapiz").value;

		if ((dibujar || borrar) && (activo)) {
			coordenadas2 = getCoordinates(event);
			ctx.lineWidth = grosorLapiz;
			if (borrar)
				ctx.strokeStyle = "#ffffff";
			else {

				ctx.strokeStyle = colorLapiz;
			}

			ctx.rect(0, 0, canvas.width, canvas.height)
			ctx.moveTo(coordenadas1.x, coordenadas1.y);
			ctx.lineTo(coordenadas2.x, coordenadas2.y);
			ctx.stroke();
			coordenadas1 = coordenadas2;
		}
	}


	//** FILTROS ** //   

	function setPixel(imageData, x, y, r, g, b, a){
        let index = (x + y * imageData.width) * 4;
        imageData.data[index+0] = r;
        imageData.data[index+1] = g;
        imageData.data[index+2] = b;
        imageData.data[index+3] = a;
}
	//BORRA FILTROS

	document.getElementById("borrarFiltro").addEventListener("click", function (e) {
		ctx.putImageData(oldImage, 0, 0);
	});

	function getRed(imageData, x, y) {
		let index = (x + y * imageData.width) * 4;
		return imageData.data[index + 0];
	}

	function getGreen(imageData, x, y) {
		let index = (x + y * imageData.width) * 4;
		return imageData.data[index + 1];
	}

	function getBlue(imageData, x, y) {
		let index = (x + y * imageData.width) * 4;
		return imageData.data[index + 2];
	}

	// FILTRO SEPIA
	document.getElementById("sepia").addEventListener("click", function () {
		let index;
		let pixel;
		let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		for (let x = 0; x < imageData.width; x++) {
			for (let y = 0; y < imageData.height; y++) {
				index = (x + y * imageData.width) * 4;
				pixel = 0.3 * getRed(imageData, x, y) + 0.6 * getGreen(imageData, x, y) + 0.1 * getBlue(imageData, x, y);
				let r = Math.min(pixel + 35, 255);
				let g = Math.min(pixel + 20, 255);
				let b = pixel;
				imageData.data[index + 0] = r;
				imageData.data[index + 1] = g;
				imageData.data[index + 2] = b;
			}
		}
		ctx.putImageData(imageData, 0, 0);
	});

	// FILTRO BRILLO
	document.getElementById("brillo").addEventListener("click", function () {
		let index;
		let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);;
		for (let x = 0; x < imageData.width; x++) {
			for (let y = 0; y < imageData.height; y++) {
				index = (x + y * imageData.width) * 4;
				let r = imageData.data[index + 0] + 77;
				let g = imageData.data[index + 1] + 77;
				let b = imageData.data[index + 2] + 77;
				imageData.data[index + 0] = r;
				imageData.data[index + 1] = g;
				imageData.data[index + 2] = b;
			}
		}
		ctx.putImageData(imageData, 0, 0);
	})

	// FILTRO BINARIO
	document.getElementById("binario").addEventListener("click", function () {
		let r;
		let b;
		let g;
		let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		for (let y = 0; y < canvas.height; y++) {
			for (let x = 0; x < canvas.width; x++) {
				let index = (x + y * imageData.width) * 4;
				r = getRed(imageData, x, y);
				g = getGreen(imageData, x, y);
				b = getBlue(imageData, x, y);
				let promedio = (r + g + b) / 3;
				imageData.data[index + 0] = promedio;
				imageData.data[index + 1] = promedio;
				imageData.data[index + 2] = promedio;
			}
		}
		ctx.putImageData(imageData, 0, 0);
	})



	// FILTRO NEGATIVO
	document.getElementById("negativo").addEventListener("click", function () {

		let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		for (let x = 0; x < imageData.width; x++) {
			for (let y = 0; y < imageData.height; y++) {

				let r = 255 - getRed(imageData, x, y);
				let g = 255 - getGreen(imageData, x, y);
				let b = 255 - getBlue(imageData, x, y);
				let a = 255;

				let index = (x + y * imageData.width) * 4;
				imageData.data[index+0] = r;
				imageData.data[index+1] = g;
				imageData.data[index+2] = b;
				imageData.data[index+3] = a;
				
			}
			ctx.putImageData(imageData, 0, 0);
		}
	})

	// FILTRO BLUR
	document.getElementById("blur").addEventListener("click", function () {
		let matrizConAdayacentes = [ // matriz con los valores adyacentes a la posicion actual
		];
		let index;
		let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height); //se obtiene la imagen
		let r = 0;
		let g = 0;
		let b = 0;
		for (let x = 1; x < imageData.width - 1; x++) { // se recorrre pixel por pixel
			for (let y = 1; y < imageData.height - 1; y++) {
				promedioData(imageData, x, y, matrizConAdayacentes, r, g, b, index); // se aplica los valores a cada pixel
				index = (x + y * imageData.width) * 4;
			}
		}
		ctx.putImageData(imageData, 0, 0);
	})

	function promedioData(imageData, x, y, matrizX, r, g, b, index) { //obtenemos el promedio de cada rojo, verde y azul 
		r = getRed(imageData, x - 1, y - 1) * 1 / 9 + getRed(imageData, x, y - 1) * 1 / 9 + getRed(imageData, x + 1, y - 1) * 1 / 9
			+ getRed(imageData, x - 1, y) * 1 / 9 + getRed(imageData, x, y) * 1 / 9 + getRed(imageData, x + 1, y) * 1 / 9
			+ getRed(imageData, x - 1, y + 1) * 1 / 9 + getRed(imageData, x, y + 1) * 1 / 9 + getRed(imageData, x + 1, y + 1) * 1 / 9;
		g = getGreen(imageData, x - 1, y - 1) * 1 / 9 + getGreen(imageData, x, y - 1) * 1 / 9 + getGreen(imageData, x + 1, y - 1) * 1 / 9
			+ getGreen(imageData, x - 1, y) * 1 / 9 + getGreen(imageData, x, y) * 1 / 9 + getGreen(imageData, x + 1, y) * 1 / 9
			+ getGreen(imageData, x - 1, y + 1) * 1 / 9 + getGreen(imageData, x, y + 1) * 1 / 9 + getGreen(imageData, x + 1, y + 1) * 1 / 9;
		b = getBlue(imageData, x - 1, y - 1) * 1 / 9 + getBlue(imageData, x, y - 1) * 1 / 9 + getBlue(imageData, x + 1, y - 1) * 1 / 9
			+ getBlue(imageData, x - 1, y) * 1 / 9 + getBlue(imageData, x, y) * 1 / 9 + getBlue(imageData, x + 1, y + 1) * 1 / 9
			+ getBlue(imageData, x - 1, y + 1) * 1 / 9 + getBlue(imageData, x, y + 1) * 1 / 9 + getBlue(imageData, x + 1, y + 1) * 1 / 9;
		imageData.data[index + 0] = r;
		imageData.data[index + 1] = g;
		imageData.data[index + 2] = b;
	}



	// FILTRO SATURACION
	document.getElementById("saturacion").addEventListener("click", function () {
		let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		for (let x = 0; x < imageData.width; x++) {
			for (let y = 0; y < imageData.height; y++) {
				let hsl = rgbToHsl(imageData, x, y);
				hsl[1] = hsl[1] + 0.3; // grado de saturacion
				let rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
				setPixel(imageData, x, y, rgb[0], rgb[1], rgb[2], 255);
			}
		}
		ctx.putImageData(imageData, 0, 0);

		function rgbToHsl(imageData, x, y) {
			let index = (x + y * imageData.width) * 4;
			let r = imageData.data[index + 0];
			let g = imageData.data[index + 1];
			let b = imageData.data[index + 2];
			r /= 255
			g /= 255
			b /= 255
			let max = Math.max(r, g, b), min = Math.min(r, g, b);
			let h, s, l = (max + min) / 2;
			if (max == min) {
				h = s = 0;
			} else {
				let d = max - min;
				s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
				switch (max) {
					case r: h = (g - b) / d + (g < b ? 6 : 0); break;
					case g: h = (b - r) / d + 2; break;
					case b: h = (r - g) / d + 4; break;
				}
				h /= 6;
			}
			return [h, s, l];
		}

		function hslToRgb(h, s, l) { //Convierte un valor de color HSL a RGB.
		// h, s y l están contenidos en el conjunto [0, 1]	
			let r;
			let g;
			let b;
			if (s == 0) {
				r = g = b = l;
			} else {
				function hue2rgb(p, q, t) {
					if (t < 0) t += 1;
					if (t > 1) t -= 1;
					if (t < 1 / 6) return p + (q - p) * 6 * t;
					if (t < 1 / 2) return q;
					if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
					return p;
				}
				let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
				let p = 2 * l - q;
				r = hue2rgb(p, q, h + 1 / 3);
				g = hue2rgb(p, q, h);
				b = hue2rgb(p, q, h - 1 / 3);
			}
			return [r * 255, g * 255, b * 255];//devuelve r, g y b en el conjunto [0, 255].
		}

		// FILTRO DEL+GRANDE
		document.getElementById("el+grande").addEventListener("click", function () {
			let r;
			let b;
			let g;
			let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			for (let y = 0; y < canvas.height; y++) {
				for (let x = 0; x < canvas.width; x++) {
					let index = (x + y * imageData.width) * 4;
					r = getRed(imageData, x, y);
					g = getGreen(imageData, x, y);
					b = getBlue(imageData, x, y);

					if (((r + g + b) / 3) <= 255 / 2) {
						r = 255;
						g = 255;
						b = 0;
					} else {
						r = 0;
						g = 0;
						b = 255;
					}
					imageData.data[index + 0] = r;
					imageData.data[index + 1] = g;
					imageData.data[index + 2] = b;
				}
			}
			ctx.putImageData(imageData, 0, 0);
		})
	})
})