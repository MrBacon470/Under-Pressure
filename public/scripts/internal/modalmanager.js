//Custom Modal Window Manager by VoidCloud

function createAlert(title,content,color="") {
    const alertHTML = `
        <div id="alertModal" class="modalContainer${color} flexCol">
            <h2>${title}</h2>
            <p>${content}<p>
            <button id="alertModalButton">Close Alert</button>
        </div>
    `
    addHTML('gameHolder',alertHTML)
    document.getElementById('alertModalButton').addEventListener('click',() => {document.getElementById('alertModal').remove()})
}

function createPrompt(title,content,color="",acceptFunction) {
    const promptHTML = `
    <div id="promptModal" class="modalContainer${color} flexCol">
        <h2>${title}</h2>
        <p>${content}<p>
        <div class="flexRow">
            <button id="acceptPromptButton" class="greenButton" style="margin:0 0.5vw 0 0.5vw">Yes</button>
            <button id="denyPromptButton" class="redButton" style="margin:0 0.5vw 0 0.5vw">No</button>
        </button>
    </div>
    `
    addHTML('gameHolder',promptHTML)
    document.getElementById('denyPromptButton').addEventListener('click', () => {document.getElementById('promptModal').remove()})
    document.getElementById('acceptPromptButton').addEventListener('click', () => acceptFunction())
}

function createInput(title,color="",functionToRun) {
    const inputHTML = `
    <div id="inputModal" class="modalContainer${color} flexCol">
        <h2>${title}</h2>
        <div class=flexRow>
            <input id="inputModalField" type="text" placeholder="Paste Text Here">
            <button id="inputModalButton"></button>
        </div
    </div>
    `
    addHTML('gameHolder',inputHTML)
    document.getElementById('inputModalButton').addEventListener('click',() => {
        functionToRun(document.getElementById('inputModalField').value);
        document.getElementById('inputModal').remove();
    })
}