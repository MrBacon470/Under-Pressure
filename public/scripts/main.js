let diff = 0;
const tabData = [
    {
        name: 'Refinery',
        color: '',
        subtabs: []
    }, 
    {
        name: 'Processing',
        color: '',
        subtabs: []
    },
    {
        name: 'Shipping',
        color: '',
        subtabs: []
    },
    {
        name: 'Research & Development',
        color: 'purple',
        subtabs: []
    },
    {
        name: 'Settings',
        color: '',
        subtabs: []
    }
]
// 10-40 mmHG (torr) is ideal pressure (Too Low or Too High Damages Refinery Column)
// 370-380C is ideal temperature (Too Low or Too High Produces Coke or Residual Gas Byproducts)
function initGame() {
    //HTML Generation
    for(let i = 0; i < tabData.length; i++) {
        if(tabData[i].color === '') {
            addHTML('navBar',`<button id="navButton${i}">${tabData[i].name}</button>`)
        }
        else {
            addHTML('navBar',`<button id="navButton${i}" class="${tabData[i].color}Button">${tabData[i].name}</button>`)
        } 
        DOMCacheGetOrSet(`navButton${i}`).addEventListener('click',() => switchTab(i))
    }
    for(let i = 0; i < collapseUpgrades.length; i++) {
        addHTML('collapseUpgradesHolder',`<button id="collapseUpgrade${i}">Collapse Upgrade ${i}</button>`)
        DOMCacheGetOrSet(`collapseUpgrade${i}`).addEventListener('click', () => purchaseCollapseUpgrade(i))
    }
    for(let i = 0; i < regularUpgrades.length; i++) {
        addHTML('regularUpgradesHolder',`<button id="regularUpgrade${i}">Regular Upgrade ${i}</button>`)
        DOMCacheGetOrSet(`regularUpgrade${i}`).addEventListener('click', () => purchaseRegularUpgrade(i))
    }
    //Refinery Tab
    for(let i = 0; i < data.refineryToggles.length; i++) {
        DOMCacheGetOrSet(`refineryToggle${i}`).classList = data.refineryToggles[i] ? 'greenButton' : 'redButton'
        DOMCacheGetOrSet(`refineryToggle${i}`).innerText = refineryToggleNames[i] + ( data.refineryToggles[i] ? ' [ON]' : ' [OFF]')
        DOMCacheGetOrSet(`refineryToggle${i}`).addEventListener('click',() => updateRefineryToggle(i))
    }
    //Processing Tab
    DOMCacheGetOrSet(`productionAmountButton`).addEventListener('click',() => {
        data.buyAmount[1] = data.buyAmount[1] + 1 < 4 ? data.buyAmount[1] + 1 : 0 
    })
    for(let i = 0; i < crackingRecipes.length; i++) {
        DOMCacheGetOrSet(`crackingButton${i}`).addEventListener('click', () => crackResource(i))
    }
    for(let i = 0; i < productionRecipes.length; i++) {
        DOMCacheGetOrSet(`productionButton${i}`).addEventListener('click', () => produceResource(i))
    }
    //Shipping Tab
    DOMCacheGetOrSet(`resourceSellAmountButton`).addEventListener('click',() => {
        data.buyAmount[0] = data.buyAmount[0] + 1 < 4 ? data.buyAmount[0] + 1 : 0 
    })
    DOMCacheGetOrSet(`napthaSellButton`).addEventListener('click', () => sellResource(0))
    DOMCacheGetOrSet(`fuelOilSellButton`).addEventListener('click', () => sellResource(1))
    DOMCacheGetOrSet(`mineralOilSellButton`).addEventListener('click', () => sellResource(2))
    DOMCacheGetOrSet(`cokeSellButton`).addEventListener('click', () => sellResource(3))
    DOMCacheGetOrSet(`residualGasSellButton`).addEventListener('click', () => sellResource(4))
    //Settings Tab
    DOMCacheGetOrSet('saveButton').addEventListener('click', () => save())
    DOMCacheGetOrSet('exportButton').addEventListener('click',() => exportSave())
    DOMCacheGetOrSet('importButton').addEventListener('click', () => createInput('Import Save Data',"",importSave))
    DOMCacheGetOrSet('deleteButton').addEventListener('click', () => deleteSave())
}

function updateGame() {
    diff = (Date.now() - data.time) / 1000
    data.time = Date.now()
    // Information Updates
    calculateRefineryValues()
    calculateProcessingAmounts()
    updateRefinery()
    updateShipping()
    updateCollapse()
    //Global HTML Updates
    DOMCacheGetOrSet('navButton3').style.display = data.hasCollapsed ? 'block' : 'none'
    
    DOMCacheGetOrSet('pressureInfoText').innerText = `Refinery Pressure: ${format(data.refineryValues[0])}/${format(calculatedRefineryValues.pressure)} mmHg`
    DOMCacheGetOrSet('pressureInfoText').classList = data.refineryValues[0].gt(calculatedRefineryValues.pressure) ? 'redText' : ''
    DOMCacheGetOrSet('heatInfoText').innerText = `Refinery Temp: ${format(data.refineryValues[1])}°K`
    DOMCacheGetOrSet('capacityInfoText').innerText = `Refinery Capacity: ${format(data.refineryValues[2])}/${format(calculatedRefineryValues.capacity)} L`
    DOMCacheGetOrSet('moneyInfoText').innerText = `Funds: $${format(data.funds)}`

    DOMCacheGetOrSet('ceramicInfoHolder').style.display = data.hasCollapsed ? 'flex' : 'none'
    if(data.hasCollapsed)
        DOMCacheGetOrSet('ceramicInfoText').innerText = `Ceramic: ${format(data.ceramic)}\nPotential Gain: ${format(ceramicGain)}`
    //HTML Update Functions
    updateRefineryHTML()
    updateShippingHTML()
    updateCollapseHTML()
    updateProcessingHTML()
}

function calculateOfflineProgress() {
    diff = (Date.now() - data.time) / 1000
    generateNotification(`Welcome Back\nYou were gone for: ${formatTimeAlternate(diff)}`,'info')
    data.time = Date.now()
}

function switchTab(id) {
    for(let i = 0; i < tabData.length; i++) {
        DOMCacheGetOrSet(`${(tabData[i].name.replace(/\s+/g,'')).toLowerCase()}Tab`).style.display = id === i ? 'block' : 'none'
        if(tabData[i].color === '') {
            DOMCacheGetOrSet(`navButton${i}`).classList = id === i ? 'selected' : 'normal'
        }
        else {
            DOMCacheGetOrSet(`navButton${i}`).classList = id === i ? `${tabData[i].color}Button selected` : `${tabData[i].color}Button normal`
        }
    }
    data.currentTab = id
}

//Start Up
window.onload = function() {
    load()
    initGame()
    calculateOfflineProgress()
    switchTab(data.currentTab)
    DOMCacheGetOrSet('currentVersionText').innerText = `Current Version: ${getDefaultData().currentVersion}`
    //Start Update Loop After Game has been initialized
    window.setInterval(() => updateGame(), 50)
}

//30s Auto Save
window.setInterval(() => save(),30000)