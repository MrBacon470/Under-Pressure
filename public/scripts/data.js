
function getDefaultData() {
    return {
        currentTab: 0,
        currentVersion: 'v0.0.0'
    }
}

let data = getDefaultData();
const saveName = 'UnderPressureSave'

function save() {
    window.localStorage.setItem(saveName,JSON.stringify(data))
    //TODO: Generate Notifications
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
}

function deleteSave() {
    save()
    exportSave()
    window.localStorage.removeItem(saveName)
    location.reload()
}