window.onload = function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const subcanvas = document.getElementById('subcanvas');
    const subctx = subcanvas.getContext('2d');
    let curColor = 'black';
    let prevColor = 'white';
    let tempColor;
    let curColorShape = document.getElementById('cur-color-shape');
    let prevColorShape = document.getElementById('prev-color-shape');
    let fillBox = document.getElementById('fill');
    let eyedropperBox = document.getElementById('eyedropper');
    let pencilBox = document.getElementById('pencil');
    let canvas128x128Box = document.getElementById('canvas-128x128');
    let canvas256x256Box = document.getElementById('canvas-256x256');
    let canvas512x512Box = document.getElementById('canvas-512x512');
    let curColorBox = document.getElementById('cur-color');
    let prevColorBox = document.getElementById('prev-color');
    let redColorBox = document.getElementById('red-color');
    let blueColorBox = document.getElementById('blue-color');
    let inputColor = document.getElementById('input-color');
    let canvasWidth = canvas.offsetWidth;
    let canvasHeight = canvas.offsetHeight;
    let mouseDown = false;
    let colorArray = [];
    let pixelSize;

    function getLinkToImage() {
        const url = `https://api.unsplash.com/photos/random?query=${document.getElementById('search-bar').value}&client_id=00beef71971397b1936a679a3acf85f8ad37c6ad519479e243aff5a78c6aca61`;
        return fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log('fetch')
                convertImageToSubcanvas(data.urls.small);
            });
    }

    function convertImageToSubcanvas(path) {
        image = document.createElement('img');
        document.body.appendChild(image);
        image.setAttribute('style', 'display:none');
        image.setAttribute('alt', 'script div');
        image.setAttribute('src', path);
        image.crossOrigin = "Anonymous";
        image.style.imageRendering = 'pixelated';
        image.onload = function () {
            const subcanvas = document.getElementById('subcanvas');
            const subctx = subcanvas.getContext('2d');
            subctx.imageSmoothingEnabled = false;
            let aspectRatio = image.width / image.height;
            let marginTop = 0;
            let marginLeft = 0;
            let imageDrawWidth = 0;
            let imageDrawHeight = 0;
            if (aspectRatio > 1) {
                imageDrawWidth = subcanvas.width;
                imageDrawHeight = subcanvas.height / aspectRatio;
                marginTop = (subcanvas.height - imageDrawHeight) / 2;
            }
            else {
                imageDrawWidth = subcanvas.width * aspectRatio;
                imageDrawHeight = subcanvas.height;
                marginLeft = (subcanvas.width - imageDrawWidth) / 2;
            }
            subctx.drawImage(image, marginLeft, marginTop, imageDrawWidth, imageDrawHeight);
            subcanvas.crossOrigin = 'Anonymous';
            ctx.drawImage(subcanvas, 0, 0, subcanvas.width, subcanvas.height, 0, 0, canvas.width, canvas.height);
        }
    }

    let loadButton = document.getElementById('load-button');
    loadButton.addEventListener('click', () => {
        getLinkToImage();
    })

    function changeLocalStorage(pixelSize, curTool, curColor, prevColor) {
        localStorage.pixelSize = pixelSize;
        localStorage.curTool = curTool;
        localStorage.curColor = curColor;
        localStorage.prevColor = prevColor;
        console.log(localStorage);
    }

    function changeColor(color) {
        if (curColor != color) {
            tempColor = curColor;
            curColor = color;
            curColorShape.style.background = curColor;
            prevColor = tempColor;
            prevColorShape.style.background = prevColor;
        }
    }

    function restoreCanvas() {
        if (localStorage.getItem('canvasImage') != null) {
            var dataURL = localStorage.getItem('canvasImage');
            var img = new Image;
            img.src = dataURL;
            img.onload = function () {
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(img, 0, 0);
            };
        }
        
    }

    function restoreArray() {
        for (let i = 0; i < (canvasWidth / pixelSize) - 1; i++) {
            colorArray[i] = [];
            for (let j = 0; j < (canvasHeight / pixelSize) - 1; j++) {
                colorArray[i][j] = '#ffffff';
            }
        }
    }

    function selectCanvasSize(canvasBoxSelected, newPixelSize) {
        localStorage.setItem('canvasImage', canvas.toDataURL());
        canvas128x128Box.classList.remove('highlight');
        canvas256x256Box.classList.remove('highlight');
        canvas512x512Box.classList.remove('highlight');
        canvasBoxSelected.classList.add('highlight');
        pixelSize = newPixelSize;
    }

    function changeSubcanvas(size) {
        subcanvas.width = size;
        subcanvas.height = size;
        subctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, subcanvas.width, subcanvas.height);

    }

    canvas128x128Box.onclick = () => {
        changeSubcanvas(128);
        selectCanvasSize(canvas128x128Box, 4);
        restoreArray();
        ctx.drawImage(subcanvas, 0, 0, subcanvas.width, subcanvas.height, 0, 0, canvas.width, canvas.height);
        changeLocalStorage(pixelSize, curTool, curColor, prevColor);
    }

    canvas256x256Box.onclick = () => {
        changeSubcanvas(256);
        selectCanvasSize(canvas256x256Box, 2);
        restoreArray();
        ctx.drawImage(subcanvas, 0, 0, subcanvas.width, subcanvas.height, 0, 0, canvas.width, canvas.height);
        changeLocalStorage(pixelSize, curTool, curColor, prevColor);
    }

    canvas512x512Box.onclick = () => {
        changeSubcanvas(512);
        selectCanvasSize(canvas512x512Box, 1);
        restoreArray();
        ctx.drawImage(subcanvas, 0, 0, subcanvas.width, subcanvas.height, 0, 0, canvas.width, canvas.height);
        changeLocalStorage(pixelSize, curTool, curColor, prevColor);
    }

    fillBox.onclick = () => {
        curTool = 'fill';
        document.getElementsByTagName('body')[0].style.cursor = `url('assets/bucket.svg'), auto`;
        fillBox.classList.add('highlight');
        eyedropperBox.classList.remove('highlight');
        pencilBox.classList.remove('highlight');
        canvas.onmousemove = null;
        canvas.onclick = () => {
            ctx.fillStyle = curColor;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            for (let i = 0; i < (canvasWidth / pixelSize) - 1; i++) {
                for (let j = 0; j < (canvasHeight / pixelSize) - 1; j++) {
                    colorArray[i][j] = curColor;
                }
            }
        }
        changeLocalStorage(pixelSize, curTool, curColor, prevColor);
    }
    eyedropperBox.onclick = () => {
        curTool = 'eyedropper';
        document.getElementsByTagName('body')[0].style.cursor = `url('assets/eyedropper.svg') 0 20, auto`;
        fillBox.classList.remove('highlight');
        eyedropperBox.classList.add('highlight');
        pencilBox.classList.remove('highlight');
        canvas.onmousemove = null;
        canvas.onclick = (e) => {
            let pixel = {
                x: Math.floor((e.clientX - canvas.getBoundingClientRect().x) / pixelSize),
                y: Math.floor((e.clientY - canvas.getBoundingClientRect().y) / pixelSize)
            };
            changeColor(colorArray[pixel.y][pixel.x]);
        }
        changeLocalStorage(pixelSize, curTool, curColor, prevColor);
    }
    pencilBox.onclick = () => {
        curTool = 'pencil';
        document.getElementsByTagName('body')[0].style.cursor = `url('assets/pencil.svg') 0 20, auto`;
        fillBox.classList.remove('highlight');
        eyedropperBox.classList.remove('highlight');
        pencilBox.classList.add('highlight');
        canvas.addEventListener('mousedown', () => {
            mouseDown = true;
        });
        canvas.addEventListener('mouseup', () => {
            mouseDown = false;
        });
        canvas.onclick = (e) => {
            let pixel = {
                x: Math.floor((e.clientX - canvas.getBoundingClientRect().x) / pixelSize),
                y: Math.floor((e.clientY - canvas.getBoundingClientRect().y) / pixelSize)
            };
            ctx.fillStyle = curColor;
            ctx.fillRect(pixel.x * pixelSize, pixel.y * pixelSize, pixelSize, pixelSize);
            colorArray[pixel.y][pixel.x] = curColor;
        }
        canvas.onmousemove = (e) => {
            if (mouseDown) {
                let pixel = {
                    x: Math.floor((e.clientX - canvas.getBoundingClientRect().x) / pixelSize),
                    y: Math.floor((e.clientY - canvas.getBoundingClientRect().y) / pixelSize)
                };
                ctx.fillStyle = curColor;
                ctx.fillRect(pixel.x * pixelSize, pixel.y * pixelSize, pixelSize, pixelSize);
                colorArray[pixel.y][pixel.x] = curColor;
            }
        }
        changeLocalStorage(pixelSize, curTool, curColor, prevColor);
    }
    prevColorBox.onclick = () => {
        changeColor(prevColor);
        changeLocalStorage(pixelSize, curTool, curColor, prevColor);
    }
    curColorBox.onclick = () => {
        inputColor.click();
        inputColor.onchange = () => {
            changeColor(inputColor.value);
        }
        changeLocalStorage(pixelSize, curTool, curColor, prevColor);
    }
    redColorBox.onclick = () => {
        changeColor('red');
        changeLocalStorage(pixelSize, curTool, curColor, prevColor);
    }
    blueColorBox.onclick = () => {
        changeColor('blue');
        changeLocalStorage(pixelSize, curTool, curColor, prevColor);
    }
    //Hotkeys
    document.addEventListener('keydown', (e) => {
        switch (e.code) {
            case 'KeyB':
                fillBox.click();
                break;
            case 'KeyP':
                pencilBox.click();
                break;
            case 'KeyC':
                eyedropperBox.click();
                break;
        }
    })
    if (localStorage.curColor != null) {
        curColor = localStorage.curColor;
    }
    else {
        curColor = 'black';
    }
    curColorShape.style.background = curColor;
    if (localStorage.prevColor != null) {
        prevColor = localStorage.prevColor;
    }
    else {
        prevColor = 'white';
    }
    prevColorShape.style.background = prevColor;
    if (localStorage.pixelSize != null) {
        pixelSize = +localStorage.pixelSize;
        subcanvas.width = canvas.width / pixelSize;
        subcanvas.height = canvas.height / pixelSize;
        switch (pixelSize) {
            case 4:
                canvas128x128Box.classList.add('highlight');
                break;
            case 2:
                canvas256x256Box.classList.add('highlight');
                break;
            case 1:
                canvas512x512Box.classList.add('highlight');
                break;
        }
    }
    else {
        canvas512x512Box.click();
    }
    if (localStorage.curTool != null) {
        curTool = localStorage.curTool;
        switch (curTool) {
            case 'pencil':
                pencilBox.click();
                break;
            case 'eyedropper':
                eyedropperBox.click();
                break;
            case 'fill':
                fillBox.click();
                break;
        }
    }
    else {
        curTool = 'pencil';
        pencilBox.click();
    }
    restoreCanvas();
    restoreArray();
}
window.onbeforeunload = function () {
    localStorage.setItem('canvasImage', canvas.toDataURL());
};
