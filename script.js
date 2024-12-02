// Elements to interact with
const audio = document.querySelector('audio');
const cvs = document.querySelector('canvas');
const ctx = cvs.getContext('2d');

// Initialize canvas
function initCvs() {
    cvs.width = window.innerWidth * devicePixelRatio;
    cvs.height = (window.innerHeight / 2) * devicePixelRatio;
}

initCvs();

// Initialization flag
let isInit = false;
// Array to hold analyzer data
let dataArray;
// Analyzer node
let analyser;

// Audio play event
audio.onplay = function() {
    // Check if already initialized
    if (isInit) {
        return;
    }

    // Begin initialization
    // Create audio context
    const audioCtx = new AudioContext();
    // Create audio source node
    const source = audioCtx.createMediaElementSource(audio);
    // Create analyzer node
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    // Receive data from analyzer node
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    // Set initialization flag
    isInit = true;
}

// Draw the analyzed waveform onto the canvas
function draw() {
    // Draw frame by frame
    requestAnimationFrame(draw);

    // Clear the canvas
    const { width, height } = cvs;
    ctx.clearRect(0, 0, width, height);

    if (!isInit) {
        return;
    }

    // Get frequency data from analyzer
    analyser.getByteFrequencyData(dataArray);
    const len = dataArray.length / 2; // Number of bars (use lower frequencies for better visualization)
    const barWidth = width / len / 2; // Width of each bar
    ctx.fillStyle = 'rgba(219,112,147, 1)'; 


    // Loop to draw each bar
    for (let i = 0; i < len; i++) {
        const data = dataArray[i];
        const barHeight = (data / 255) * height; // Height of each bar
        const x1 = i * barWidth + width / 2; // X-coordinate for right side
        const x2 = width / 2 - (i + 1) * barWidth; // X-coordinate for left side (mirror)
        const y = height - barHeight; // Y-coordinate for the bar
        ctx.fillRect(x1, y, barWidth - 2, barHeight); // Draw right side
        ctx.fillRect(x2, y, barWidth - 2, barHeight); // Draw left side
        
    }
}

draw();
