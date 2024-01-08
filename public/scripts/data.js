
function getDefaultData() {
    return {
        funds: Decimal.dZero,
        ceramic: Decimal.dZero,
        hasCollapsed: false,
        oilProducts: new Array(5).fill(Decimal.dZero),
        refinedProducts: new Array(2).fill(Decimal.dZero),
        refineryValues: [Decimal.dZero,D(273.15),Decimal.dZero,D(100)],
        refineryToggles: new Array(2).fill(false),
        regularUpgrades: new Array(5).fill(Decimal.dZero),
        collapseUpgrades: new Array(5).fill(Decimal.dZero),
        achievements: new Array(20).fill(false),
        buyAmount: new Array(2).fill(0),
        settingsToggles: new Array(1).fill(false),
        currentTab: 0,
        time: Date.now(),
        currentVersion: 'v0.0.0'
    }
}

let data = getDefaultData();
const saveName = 'UnderPressureSave'

function save() {
    window.localStorage.setItem(saveName,JSON.stringify(data))
    generateNotification('Saved Game!','info')
}

function load() {
    let save = JSON.parse(window.localStorage.getItem(saveName))

    if(save === null || save === undefined) save = getDefaultData()
    else if(save !== undefined) fixSave(data,save)

    if(data.currentVersion !== getDefaultData().currentVersion) {
        data.currentVersion = getDefaultData().currentVersion
        createAlert('Welcome Back!',`The game's current version is ${getDefaultData().currentVersion}`)
    }
}

function fixSave(defaultData=getDefaultObject(), importedData) {
    if (typeof importedData === "object") {
        Object.keys(importedData).forEach(i => {
            if (defaultData[i] instanceof Decimal) {
                defaultData[i] = D(importedData[i]!==null?importedData[i]:defaultData[i])
            } else if (typeof defaultData[i]  == "object") {
                fixSave(defaultData[i], importedData[i])
            } else {
                defaultData[i] = importedData[i]
            }
        })
        return defaultData
    }
    else return getDefaultObject()
}

function importSave(importedData) {
    if(importedData === undefined || importedData.length === 0) {
        createAlert('No Data Imported','','red')
        return
    }
    data = Object.assign(getDefaultData(),JSON.parse(atob(importedData)))
    save()
    location.reload()
}

function exportSave() {
    const linkObj = document.createElement('a')
    linkObj.id = 'fileExportObject'
    
    save()
    const saveFile = new Blob([btoa(JSON.stringify(data))], {type:'text/plain'})
    linkObj.setAttribute('href', URL.createObjectURL(saveFile))
    linkObj.download = `${saveName}-${new Date()}.txt`
    linkObj.click()
    URL.revokeObjectURL(linkObj)
    generateNotification('Exported Save to File','success')
}

function deleteSave() {
    save()
    exportSave()
    window.localStorage.removeItem(saveName)
    location.reload()
    generateNotification('Exported & Deleted Save','error')
}