const container = document.createElement("div");
container.id = "floatingContainer";
container.style.position = "fixed";
container.style.top = "20px";
container.style.left = "20px";
container.style.width = "400px";
container.style.backgroundColor = "white";
container.style.padding = "20px";
container.style.boxShadow = "0px 4px 12px rgba(0, 0, 0, 0.1)";
container.style.borderRadius = "8px";
container.style.zIndex = "1000";
container.style.display = "flex";
container.style.flexDirection = "column";
container.style.alignItems = "center";
container.style.cursor = "default";
container.style.userSelect = "none";


container.innerHTML = `
  <div id="dragBar" style="cursor: grab; color:black; border-radius: 5px; width: 100%; background: #ddd; padding: 8px; text-align: center; font-weight: bold;">Drag to Move</div>
  <h1 title="OJT Developer : Mandaguio, Lemuel E. ▪ Uy, Kyan Miles Ivan G. ▪ Magbag, Kenneth Isaac
Year                  : 2025
University         : STI Cotabato College" style="font-weight: bolder; color: black;">Convert Google Drive Link</h1>
  <label for="driveLink" style="color: black;">Enter Google Drive Link:</label>
  <textarea id="driveLink" placeholder="Enter Google Drive URL here..." style=" border-style: dashed; border-radius: 5px; color: grey; resize: none; width: 95%; padding: 10px; margin-bottom: 10px;"></textarea>
  <button id="generate" style="width: 100%; padding: 10px; background-color:rgb(73, 73, 73); color: white; border: none; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
    Generate Embedded Link
  </button>
  
  <!-- Result section, initially hidden -->
  <div id="resultContainer" style="width: 100%; display: none; margin-top: 10px;">
    <h3 style="color: black;">Result:</h3>
    <textarea id="result" readonly style="width: 95%; border-style: dashed; border-radius: 5px; padding: 10px; height: 108px; resize: none;"></textarea>
    <button id="copyIcon" style="width: 100%; padding: 10px; margin-top: 10px; background-color:rgb(55, 160, 120); color: white; border: none; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
      <span id="copyText">Copy to Clipboard</span> 
      <span id="checkIcon" style="display: none; margin-left: 8px;">✔</span>
    </button>
  </div>
 
`;
document.body.appendChild(container);

let posX = 0, posY = 0, mouseX = 0, mouseY = 0;
const dragBar = document.getElementById("dragBar");

dragBar.addEventListener("mousedown", (e) => {
    e.preventDefault();
    mouseX = e.clientX;
    mouseY = e.clientY;
    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", stopDrag);
    dragBar.style.cursor = "grabbing";
});

function dragMove(e) {
    posX = mouseX - e.clientX;
    posY = mouseY - e.clientY;
    mouseX = e.clientX;
    mouseY = e.clientY;

    let newTop = container.offsetTop - posY;
    let newLeft = container.offsetLeft - posX;

    const maxTop = window.innerHeight - container.clientHeight;
    const maxLeft = window.innerWidth - container.clientWidth;

    if (newTop < 0) newTop = 0;
    if (newLeft < 0) newLeft = 0;
    if (newTop > maxTop) newTop = maxTop;
    if (newLeft > maxLeft) newLeft = maxLeft;

    container.style.top = `${newTop}px`;
    container.style.left = `${newLeft}px`;
}

function stopDrag() {
    document.removeEventListener("mousemove", dragMove);
    document.removeEventListener("mouseup", stopDrag);
    dragBar.style.cursor = "grab";
}
document.getElementById("generate").addEventListener("click", async function () {
    let driveLink = document.getElementById("driveLink").value.trim();
    let fileIdMatch = driveLink.match(/[-\w]{25,}/);

    if (!fileIdMatch) {
        alert("❌ Invalid Google Drive link.");
        return;
    }

    let fileId = fileIdMatch[0];
    let scriptUrl = `https://script.google.com/macros/s/AKfycbzDe0PS4-OYKucmfkrKzAIyPdB98uFkh8oU3MAXrmbTV-TChdkeoQ6hC4GMtXLz-fKd/exec?id=${fileId}`;

    let resultBox = document.getElementById("result");
    let resultContainer = document.getElementById("resultContainer");
    let generateBtn = document.getElementById("generate");

    resultContainer.style.display = "none";
    resultBox.value = "";

    let originalText = generateBtn.innerHTML;

    generateBtn.innerHTML = `<div class="spinner"></div> Processing...`;
    generateBtn.disabled = true;

    try {
        let response = await fetch(scriptUrl);
        let resultUrl = await response.text();

        if (resultUrl.startsWith("Error")) {
            alert("❌ Error making file public.");
            return;
        }

        let embedUrl = `https://lh3.googleusercontent.com/d/${fileId}=s1600-rw-v1?source=screenshot.guru`;
        let embedCode = `<a href="${embedUrl}"> <img src="${embedUrl}" /> </a>`;

        // Set the text value
        resultBox.value = embedCode;

        // Apply background image with opacity effect
        resultBox.style.backgroundImage = `url('${embedUrl}')`;
        resultBox.style.backgroundSize = "cover";  // Ensures the image fills the area
        resultBox.style.backgroundPosition = "center";
        resultBox.style.backgroundRepeat = "no-repeat";
        resultBox.style.opacity = "1"; // Keeps the text readable
        resultBox.style.color = "black"; // Ensures text remains readable
        resultBox.style.fontWeight = "bold"; 

        // Show result
        resultContainer.style.display = "block";

    } catch (error) {
        alert("⚠️ Failed to fetch public link. Please try again.");
    } finally {
        generateBtn.innerHTML = originalText;
        generateBtn.disabled = false;
    }
});


document.getElementById("copyIcon").addEventListener("click", function () {
    let textToCopy = document.getElementById("result").value; // Use .value instead of .textContent
    let copyText = document.getElementById("copyText");
    let checkIcon = document.getElementById("checkIcon");

    if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            copyText.style.display = "none";  // Hide "Copy to Clipboard"
            checkIcon.style.display = "inline";  // Show ✔ icon

            setTimeout(() => {
                copyText.style.display = "inline"; // Show "Copy to Clipboard" again
                checkIcon.style.display = "none";  // Hide ✔ icon
            }, 2000);
        }).catch(() => {
            alert("⚠️ Copy failed. Please try again.");
        });
    }
});


// Add styles including hover effects
const style = document.createElement("style");
style.textContent = `
  .spinner {
      width: 15px;
      height: 15px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      display: inline-block;
      margin-right: 8px;
      vertical-align: middle;
      animation: spin 1s linear infinite;
  }

  @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
  }

  /* Hover effects */
  #generate:hover {
      background-color: rgb(90, 90, 90);
      cursor: pointer;
  }

  #copyIcon:hover {
      background-color: rgb(65, 180, 130);
      cursor: pointer;
  }
`;
document.head.appendChild(style);


// OJT Developer : Mandaguio, Lemuel E. | Uy, Kyan Miles Ivan G. | Magbag, Kenneth Isaac 
// Year          : 2025
// University    : STI Cotabato City College
