const createDivButton = document.getElementById('createDivButton');
const createImageButton = document.getElementById('createImageButton');
const createVideoButton = document.getElementById('createVideoButton');
const imageUrlInput = document.getElementById('imageUrlInput');
const videoUrlInput = document.getElementById('videoUrlInput');
const boardDiv = document.getElementById('boardDiv');
const contextElement = document.getElementById('context-menu');
const deleteElementButton = document.getElementById('deleteElementButton');
let isCamMove = false;
let camPosX = 0, camPosY = 0;
let oldMouseX = 0, oldMouseY = 0;

createDivButton.addEventListener('click', () => {
    spawnDiv('draggable-div');
});

createImageButton.addEventListener('click', () => {
    const imageUrl = imageUrlInput.value.trim();
    if (imageUrl) {
        spawnDiv('image-div', true, imageUrl);
    } else {
        alert('Lütfen geçerli bir resim URL\'si girin.');
    }
});

createVideoButton.addEventListener('click', () => {
    const videoUrl = videoUrlInput.value.trim();
    if (videoUrl) {
        spawnDiv('draggable-div', false, videoUrl, true);
    } else {
        alert('Lütfen geçerli bir resim URL\'si girin.');
    }
});

document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    contextElement.style.display = "block";
    
    contextElement.style.left = `${event.clientX}px`;
    contextElement.style.top = `${event.clientY}px`;
});
contextElement.addEventListener('mouseleave', (event) => {
        contextElement.style.display = "none";
}); 

boardDiv.addEventListener('mousedown', (event) => {
    oldMouseX = event.clientX;
    oldMouseY = event.clientY;
});

boardDiv.addEventListener('mousemove', (event) => {
    if (isCamMove)
    {
        const x = event.clientX - oldMouseX;
        const y = event.clientY - oldMouseY;
        if (x != 0 || y != 0)
        {
            camPosX += x;
            camPosY += y;
            boardDiv.style.backgroundPosition = `${camPosX}px ${camPosY}px`;
            oldMouseX = event.clientX;
            oldMouseY = event.clientY;
        }
        
    }
    
});



function spawnDiv(classID, isImage = false, Url = "", isVideo = false,)
{
    const draggableDiv = document.createElement('div');
    draggableDiv.classList.add(classID);
    let posX = 0; let posY = 0;
    let PoldMouseX = 0, PoldMouseY = 0;
    if (isImage){
        const pdiv = document.createElement('div');
        pdiv.style.backgroundColor = "black";
        pdiv.style.position = "absolute";
        pdiv.style.top = "30px";
        pdiv.style.left = "10px";
        pdiv.style.right = "10px";
        pdiv.style.bottom = "10px";

        draggableDiv.appendChild(pdiv);
        const img = document.createElement('img');
        img.src = Url;
        img.alt = 'Resim';
        
        pdiv.appendChild(img);
    }
    else if (isVideo){
        const video = document.createElement('iframe');
        video.width = "70%";
        video.height = "auto";
        video.src = `https://www.youtube.com/embed/${Url}`;
        video.frameBorder = "0";
        video.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        video.allowFullscreen = true;
        draggableDiv.appendChild(video);
    }
    else 
    {
        const pdiv = document.createElement('div');
        //textbox.type = "text";
        //textbox.style.width = "100%";
        //textbox.style.padding = "10px";
        //textbox.style.position = "absolute";
        //textbox.style.top = "0px";
        //textbox.placeholder = "Metin girin..."
        pdiv.style.backgroundColor = "black";
        pdiv.style.position = "absolute";
        pdiv.style.top = "30px";
        pdiv.style.left = "10px";
        pdiv.style.right = "10px";
        pdiv.style.bottom = "10px";

        draggableDiv.appendChild(pdiv);
    }

    boardDiv.appendChild(draggableDiv);

    let isDragging = false;
    let isResizing = false;
    let isSelected = false;
    
    function outputsize() {
     isResizing = true;
    }
    outputsize()

    new ResizeObserver(outputsize).observe(draggableDiv)

    boardDiv.addEventListener('mousedown', (event) => {
        
        if (event.button === 1) {
            PoldMouseX = event.clientX;
            PoldMouseY = event.clientY;
            isCamMove = true;
            isDragging = false;
            draggableDiv.classList.remove("selected-div");
            isSelected = false;
        }
    });


    draggableDiv.addEventListener('mousedown', (event) => {
        draggableDiv.classList.add("selected-div");
        isSelected = true;
        isDragging = true;
        draggableDiv.style.cursor = 'grabbing';
        PoldMouseX = event.clientX;
        PoldMouseY = event.clientY;
        if (PoldMouseX > (draggableDiv.getBoundingClientRect().left + draggableDiv.getBoundingClientRect().width / 1.3)) { isDragging = false; }
    });

    

    boardDiv.addEventListener('mouseup', (event) => {
        if (event.button === 1) {
            isCamMove = false;
        }
    });

    boardDiv.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const x = event.clientX - PoldMouseX;
            const y = event.clientY - PoldMouseY;
	        
            if (x != 0 || y != 0)
            {
                posX += x;
                posY += y;
                draggableDiv.style.left = `${Math.round(posX/16)*16 + camPosX}px`;
                draggableDiv.style.top = `${Math.round((posY)/16)*16 + camPosY}px`;
                let rect = draggableDiv.getBoundingClientRect();
                const sposx = Math.round(posX/16)*16;
	            const sposy = Math.round(posY/16)*16;
	            let oOffset = x/draggableDiv.offsetWidth;
	            let oOffsetY = y/draggableDiv.offsetHeight;
                PoldMouseX = event.clientX;
                PoldMouseY = event.clientY;
                
                draggableDiv.style.transform = `matrix3d(1, 0, 0, ${oOffset/100}, 0, 1, 0, ${oOffsetY/100}, 0, 0, 1, 0, 0, 0, 0, 1)`;
                setTimeout(() => {
                    draggableDiv.style.transform = "rotate(0deg)";
                }, 500);
            }
            
        }

        if (isCamMove)
        {
            draggableDiv.style.left = `${Math.round(posX/16)*16 + camPosX}px`;
            draggableDiv.style.top = `${Math.round(posY/16)*16 + camPosY}px`;
        }

    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        draggableDiv.style.cursor = 'grab';
	    draggableDiv.style.transform = "rotate(0deg)";
	    if (isResizing){
		    var x = Math.round((draggableDiv.offsetWidth)/ 16)* 16;
     		var y = Math.round((draggableDiv.offsetHeight)/ 16)* 16;
     		draggableDiv.style.width  = `${x}px`;
     		draggableDiv.style.height  = `${y}px`;
		    isResizing = false;
	    }
	
    });

    document.body.addEventListener('dblclick', (event) => {
        if (!isDragging || isSelected)
        {
            draggableDiv.classList.remove("selected-div");
            isSelected = false;
        }
        
    });

    draggableDiv.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        
    });

    deleteElementButton.addEventListener('click', () => {
        contextElement.style.display = "none";
        if (isSelected)
        {
            draggableDiv.remove();
        }
        
    });


    // Yeni div'i başlangıç konumuna yerleştir
    draggableDiv.style.left = `${camPosX}px`;
    draggableDiv.style.top = `${camPosY}px`;
}