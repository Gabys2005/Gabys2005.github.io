const inputInput = document.getElementById("input");
const resultCanvas = document.getElementById("resultCanvas");
const canvasContext = resultCanvas.getContext("2d");
const downloadButton = document.getElementById("downloadButton");
const resultDiv = document.getElementById("result");
const normalViewRadio = document.getElementById("normalViewRadio");
const robloxViewRadio = document.getElementById("robloxViewRadio");
const normalView = document.getElementById("normalView");
const robloxView = document.getElementById("robloxView");
const processingDiv = document.getElementById("processing");
const highFrameCountWarning = document.getElementById("highFrameCountWarning");

function getFramesPerRow(imageWidth, imageHeight, imageCount) {
	let lastAspectRatio;
	let lastPerRow;
	for (let perRow = 1; perRow < imageCount; perRow++) {
		const totalImageWidth = imageWidth * perRow;
		const totalImageHeight = imageHeight * Math.ceil(imageCount / perRow);
		const aspectRatio = totalImageWidth / totalImageHeight;
		if (!lastAspectRatio) {
			lastAspectRatio = aspectRatio;
			lastPerRow = perRow;
		} else if (Math.abs(1 - lastAspectRatio) > Math.abs(1 - aspectRatio)) {
			lastAspectRatio = aspectRatio;
			lastPerRow = perRow;
		}
	}
	return lastPerRow;
}

function setData(name, value) {
	const normalElement = document.getElementById(`${name}N`);
	if (normalElement) {
		normalElement.textContent = value;
	}
	const robloxElement = document.getElementById(`${name}R`);
	if (robloxElement) {
		robloxElement.textContent = value;
	}
}

inputInput.addEventListener("change", (e) => {
	const file = e.target.files[0];
	if (!file) {
		return;
	}
	if (file.type !== "image/gif") {
		return alert("You need to upload a .gif file");
	}

	const startTime = Date.now();

	const fileReader = new FileReader();
	fileReader.addEventListener("load", (fil) => {
		const content = fil.target.result;
		processingDiv.style.display = "block";

		setTimeout(() => {
			gifFrames({ url: content, frames: "all", cumulative: true, outputType: "canvas" }).then((frameData) => {
				const frameTimesInSeconds = [];
				const frameHeight = frameData[0].frameInfo.height;
				const frameWidth = frameData[0].frameInfo.width;

				const totalFrames = frameData.length;
				const framesPerRow = getFramesPerRow(frameWidth, frameHeight, totalFrames);

				resultCanvas.setAttribute("width", frameWidth * framesPerRow);
				resultCanvas.setAttribute("height", frameHeight * Math.ceil(totalFrames / framesPerRow));

				let currentRow = 0;
				let currentColumn = 0;

				frameData.forEach((frame) => {
					console.log(frame);
					frameTimesInSeconds.push(frame.frameInfo.delay / 100);
					const canvas = frame.getImage();
					canvasContext.drawImage(canvas, currentColumn * frameWidth, currentRow * frameHeight);
					currentColumn += 1;
					if (currentColumn >= framesPerRow) {
						currentColumn = 0;
						currentRow += 1;
					}
				});

				const gifLoopTime = frameTimesInSeconds.reduce((p, c) => p + c, 0);
				const averageFrameTime = gifLoopTime / frameTimesInSeconds.length;
				const averageFPS = 1 / averageFrameTime;
				const endTime = Date.now();

				setData("frameCount", totalFrames);
				setData("framesPerRow", framesPerRow);
				setData("fps", Math.round(averageFPS));
				setData("time", (endTime - startTime) / 1000);
				processingDiv.style.display = "none";
				resultDiv.style.display = "flex";

				if (totalFrames >= 100) {
					highFrameCountWarning.style.display = "block";
				} else {
					highFrameCountWarning.style.display = "none";
				}
			});
		}, 100);
	});
	fileReader.readAsDataURL(file);
});

downloadButton.addEventListener("click", () => {
	const link = document.createElement("a");
	link.download = "spritesheet.jpg";
	link.href = resultCanvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
	link.click();
});

normalViewRadio.addEventListener("change", () => {
	normalView.style.display = "block";
	robloxView.style.display = "none";
});

robloxViewRadio.addEventListener("change", () => {
	normalView.style.display = "none";
	robloxView.style.display = "block";
});
