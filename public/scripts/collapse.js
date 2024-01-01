const collapseUpgrades = [
    {
        name: 'Improve Distillation Column',
        desc: '2x Base Refinery Capacity\n1.5x Max Pressure\n1.5x Max Perfect Temperature\n1.25x Base Oil Processing Rate',
        baseCost: D(5),
        maxLevel: D(6)
    },
    {
        name: 'Asphalt Production',
        desc: 'Learn the Process to turn Coke & Naptha into Asphalt',
        baseCost: D(1),
        maxLevel: Decimal.dOne
    },
    {
        name: 'Catalytic Cracking',
        desc: 'Learn the Process to turn Residual Gas into Naptha',
        baseCost: D(10),
        maxLevel: Decimal.dOne,
    },
    {
        name: 'Smart Heater',
        desc: 'The smart heater keeps your refinery at the temperature range you want',
        baseCost: D(25),
        maxLevel: Decimal.dOne
    },
]

const regularUpgrades = [
    {
        name: 'Improve Column Heater',
        desc: '^1.15 Heat/s',
        baseCost: D(1000),
        maxLevel: Decimal.dTen
    },
    {
        name: 'Improve Oil Feed Rate',
        desc: '^1.50 Oil/s',
        baseCost: D(5000),
        maxLevel: Decimal.dTen
    },
    {
        name: 'Upgrade Oil Processor',
        desc: 'x1.5 Oil Processing/s',
        baseCost: D(1e4),
        maxLevel: D(5)
    }
]
const upgradeScaleRate = [1.5,1.25]
let ceramicGain = Decimal.dOne
let collapseUpgradeCost = new Array(collapseUpgrades.length).fill(Decimal.dZero)
let regularUpgradeCost = new Array(regularUpgrades.length).fill(Decimal.dZero)

function updateCollapse() {
    ceramicGain = data.refineryValues[0].lt(baseRanges.pressure) ? Decimal.dZero : Decimal.sqrt(data.refineryValues[0].div(baseRanges.pressure))
    ceramicGain = ceramicGain.times(Decimal.dOne.add(Decimal.log10(data.funds)))

    for(let i = 0; i < collapseUpgradeCost.length; i++) {
        collapseUpgradeCost[i] = collapseUpgrades[i].baseCost.times(Decimal.pow(upgradeScaleRate[0],data.collapseUpgrades[i]))
    }

    for(let i = 0; i < regularUpgradeCost.length; i++) {
        regularUpgradeCost[i] = regularUpgrades[i].baseCost.times(Decimal.pow(upgradeScaleRate[1],data.regularUpgrades[i]))
    }

    if(data.refineryValues[3].lte(0)) {
        collapse()
    }
}

function updateCollapseHTML() {
    if(data.currentTab !== 3) return

    for(let i = 0; i < collapseUpgrades.length; i++) {
        if(data.collapseUpgrades[i].lt(collapseUpgrades[i].maxLevel)) {
            DOMCacheGetOrSet(`collapseUpgrade${i}`).innerText = `${collapseUpgrades[i].name}\n${collapseUpgrades[i].desc}\nCost: ${format(collapseUpgradeCost[i])} Ceramic\nLevel: ${data.collapseUpgrades[i].toFixed(0)}/${collapseUpgrades[i].maxLevel}`
            DOMCacheGetOrSet(`collapseUpgrade${i}`).classList = data.ceramic.lt(collapseUpgrades[i].baseCost) ? 'redButton' : 'greenButton'
        }
        else {
            DOMCacheGetOrSet(`collapseUpgrade${i}`).innerText = `${collapseUpgrades[i].name}\n${collapseUpgrades[i].desc}\n[MAX LEVEL]`
            DOMCacheGetOrSet(`collapseUpgrade${i}`).classList = 'blueButton'
        }
    } 
    for(let i = 0; i < regularUpgrades.length; i++) { 
        if(data.regularUpgrades[i].lt(regularUpgrades[i].maxLevel)) {
            DOMCacheGetOrSet(`regularUpgrade${i}`).innerText = `${regularUpgrades[i].name}\n${regularUpgrades[i].desc}\nCost: $${format(regularUpgradeCost[i])}\nLevel: ${data.regularUpgrades[i].toFixed(0)}/${regularUpgrades[i].maxLevel}`
            DOMCacheGetOrSet(`regularUpgrade${i}`).classList = data.funds.lt(regularUpgrades[i].baseCost) ? 'redButton' : 'greenButton'
        }
        else {
            DOMCacheGetOrSet(`regularUpgrade${i}`).innerText = `${regularUpgrades[i].name}\n${regularUpgrades[i].desc}\n[MAX LEVEL]`
            DOMCacheGetOrSet(`regularUpgrade${i}`).classList = 'blueButton'
        }
    } 
}

function collapse() {

}