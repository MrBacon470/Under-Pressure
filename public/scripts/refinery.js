const baseRanges = {
    pressure: D(40),
    temperature: [D(600),D(700)],
    capacity: D(30207.6), //~190 Barrels of Oil in liters
    integrity: D(100),
}
const refineryToggleNames = [
    'Distillation Column Heater',
    'Crude Oil Feed',
]
const baseProductionValues = {
    temperature: D(25),
    oilFeed: Decimal.dTen,
    oilConsumption: D(5),
}
const distColumnNames = ['Basic','Improved','Upgraded','Advanced','Superior','Ultimate']
const distColumnColors = ['yellow','red','blue','purple','green','orange']

let calculatedRefineryValues = {
    pressure: baseRanges.pressure,
    temperatureRange: baseRanges.temperature,
    capacity: baseRanges.capacity,
    integrity: baseRanges.integrity,
    heaterRate: baseProductionValues.temperature,
    oilFeedRate: baseProductionValues.oilFeed,
    oilConsumptionRate: baseProductionValues.oilConsumption
}
let refineryWarningStr = ''
let refineryInfoDisplayValues = new Array(2).fill(Decimal.dZero)
let oilProductionDisplayValues = new Array(5).fill(Decimal.dZero)

function updateRefinery() {
    if(data.refineryToggles[0]) {
        data.refineryValues[1] = data.refineryValues[1].add(calculatedRefineryValues.heaterRate.times(diff))
        refineryInfoDisplayValues[0] = calculatedRefineryValues.heaterRate
    }
    else if(!data.refineryToggles[0] && data.refineryValues[1].gt(273.15)) {
        refineryInfoDisplayValues[0] = data.refineryValues[1].times(-0.01)
        data.refineryValues[1] = data.refineryValues[1].sub((data.refineryValues[1].times(0.01)).times(diff))
        if(data.refineryValues[1].lt(273.15)) {
            data.refineryValues[1] = D(273.15)
        }
    }
    if(!data.refineryToggles[0] && data.refineryValues[1].lte(273.15)) {
        refineryInfoDisplayValues[0] = Decimal.dZero
    }
    
    if(data.refineryToggles[1]) {
        data.refineryValues[2] = data.refineryValues[2].add(calculatedRefineryValues.oilFeedRate.times(diff))
        refineryInfoDisplayValues[1] = calculatedRefineryValues.oilFeedRate
    }
    if(data.refineryValues[2].gt(0)) {
        processOil(calculatedRefineryValues.oilConsumptionRate.times(diff))
        if(data.refineryValues[2].lt(0.01)) {
            data.refineryValues[2] = Decimal.dZero
        }
    }
    if(data.refineryToggles[1] && data.refineryValues[2].gt(0) && data.refineryValues[1].gt(373.15)) {
        refineryInfoDisplayValues[1] = calculatedRefineryValues.oilFeedRate.sub(calculatedRefineryValues.oilConsumptionRate)
    } else if(!data.refineryToggles[1]) {
        refineryInfoDisplayValues[1] = data.refineryValues[2].gt(0) && data.refineryValues[1].gt(373.15) ? (calculatedRefineryValues.oilConsumptionRate).times(-1) : Decimal.dZero
    }
    // Pressure = (Base Pressure * Current Temperature * Column Max Volume) / Remaining Column Volume
    data.refineryValues[0] = calculatedRefineryValues.pressure.div(2)
    data.refineryValues[0] = data.refineryValues[1].eq(0) ? D(0) : data.refineryValues[0].times((data.refineryValues[1].div(calculatedRefineryValues.temperatureRange[0])).times(calculatedRefineryValues.capacity))
    data.refineryValues[0] = data.refineryValues[0].div(calculatedRefineryValues.capacity.sub(data.refineryValues[2]))
    
    if(data.refineryValues[0].gt(calculatedRefineryValues.pressure)) {
        data.refineryValues[3] = data.refineryValues[3].sub(data.refineryValues[0].div(calculatedRefineryValues.pressure))
        if(data.refineryValues[3].lt(0)) {
            data.refineryValues[3] = Decimal.dZero
        }
    }
}

function calculateRefineryValues() {
    //Collapse Upgrade 1 Effects
    calculatedRefineryValues.pressure = data.collapseUpgrades[0].gt(0) ? baseRanges.pressure.times(D(1.5).times(data.collapseUpgrades[0])) : baseRanges.pressure
    calculatedRefineryValues.temperatureRange[1] = data.collapseUpgrades[0].gt(0) ? baseRanges.temperature[1].times(D(1.15).times(data.collapseUpgrades[0])) : baseRanges.temperature[1]
    calculatedRefineryValues.capacity = data.collapseUpgrades[0].gt(0) ? baseRanges.capacity.times(Decimal.dTwo.times(data.collapseUpgrades[0])) : baseRanges.capacity
    calculatedRefineryValues.integrity = data.collapseUpgrades[0].gt(0) ? baseRanges.integrity.times(D(2.5).times(data.collapseUpgrades[0])) : baseRanges.integrity

    //Regular Upgrade 1 Effect
    calculatedRefineryValues.heaterRate = data.regularUpgrades[0].gt(0) ? baseProductionValues.temperature.times(D(1.15).times(data.regularUpgrades[0])) : baseProductionValues.temperature
    //Regular Upgrade 2 Effect
    calculatedRefineryValues.oilFeedRate = baseProductionValues.oilFeed.times(Decimal.pow(1.25,data.regularUpgrades[1]))
    //Regular Upgrade 3 Effect
    calculatedRefineryValues.oilConsumptionRate = data.regularUpgrades[2].gt(0) ? baseProductionValues.oilConsumption.times(D(1.5).times(data.regularUpgrades[2])) : baseProductionValues.oilConsumption
}

function updateRefineryHTML() {
    if(data.currentTab !== 0) return
    generateRefineryWarning()
    DOMCacheGetOrSet('distColumnProductionText').innerText = `Main Products\n\nNaptha: +${format(oilProductionDisplayValues[0])} L/s\nFuel Oil: +${format(oilProductionDisplayValues[1])} L/s\nMineral Oil: +${format(oilProductionDisplayValues[2])} L/s\n\n` +
    `Byproducts\nCoke: +${format(oilProductionDisplayValues[3])} kg/s\nResidual Gas: +${format(oilProductionDisplayValues[4])} L/s`
    DOMCacheGetOrSet('distColumnInfoText').innerText = `Refinery Temp: ${refineryInfoDisplayValues[0].gte(0) ? '+' : ''}${format(refineryInfoDisplayValues[0])}°K/s\n` + `Refinery Capacity: ${refineryInfoDisplayValues[1].gte(0) ? '+' : ''}${format(refineryInfoDisplayValues[1])} L/s\n`+
    `Refinery Integrity: ${format((data.refineryValues[3].div(calculatedRefineryValues.integrity)).times(100))}%`
    DOMCacheGetOrSet('distColumnWarningText').innerHTML = refineryWarningStr

    if(DOMCacheGetOrSet('distColImg').getAttribute('src') !== `images/distCol${Decimal.floor(data.collapseUpgrades[0]).toNumber()}.png`)
        DOMCacheGetOrSet('distColImg').setAttribute('src', `images/distCol${Decimal.floor(data.collapseUpgrades[0]).toNumber()}.png`)
    DOMCacheGetOrSet('distColTitle').innerText = `${distColumnNames[Decimal.floor(data.collapseUpgrades[0]).toNumber()]} Distillation Column`
    DOMCacheGetOrSet('distColTitle').classList = Decimal.floor(data.collapseUpgrades[0]).toNumber() > 0 ? `${distColumnColors[Decimal.floor(data.collapseUpgrades[0]).toNumber()-1]}Text` : '' 
    DOMCacheGetOrSet('smartHeaterHolder').style.display = data.collapseUpgrades[3].gt(0) ? 'block' : 'none'
    DOMCacheGetOrSet('autoTog0').classList = data.automationToggle[0] ? 'greenButton' : 'redButton'
    DOMCacheGetOrSet('autoTog0').innerText = automationToggleNames[0] + ` ${data.automationToggle[0] ? '[ON]' : '[OFF]'}`
}

function generateRefineryWarning() {
    refineryWarningStr = ''
    if(data.refineryValues[0].gt(calculatedRefineryValues.pressure))
        refineryWarningStr += '<span class="redText">[DANGER]</span> Refinery Pressure Too High - Losing Integrity<br>'

    if(data.refineryValues[1].lt(calculatedRefineryValues.temperatureRange[0]) && data.refineryValues[1].gt(373.15) && data.refineryValues[2].gt(0)) {
        refineryWarningStr += '<span class="yellowText">[WARNING]</span> Refinery Temp Too Low - Producing Byproducts<br>'
    }   
    if(data.refineryValues[1].gt(calculatedRefineryValues.temperatureRange[1]) && data.refineryValues[2].gt(0)) {
        refineryWarningStr += '<span class="yellowText">[WARNING]</span> Refinery Temp Too High - Producing Byproducts<br>'
    }
    if(data.refineryValues[1].lt(373.15)) {
        refineryWarningStr += '<span class="yellowText">[WARNING]</span> Refinery Temp below Crude Oil Processing Temp (373.15°K)<br>'
    }
    if(data.automationToggle[0]) {
        refineryWarningStr += '<span class="yellowText">[WARNING]</span> Smart Heater Active - Display Values may be inaccurate<br>'
    }
    if(data.refineryValues[2].gte(calculatedRefineryValues.capacity.times(0.90)))
        refineryWarningStr += '<span class="yellowText">[WARNING]</span> Refinery Capacity at ≥90% of Max Capacity<br>'
    if(data.refineryValues[2].gte(calculatedRefineryValues.capacity))
        refineryWarningStr += '<span class="redText">[DANGER]</span> Refinery Stopped - No Capacity Left'
}

function updateRefineryToggle(i) {
    data.refineryToggles[i] = !data.refineryToggles[i]
    DOMCacheGetOrSet(`refineryToggle${i}`).classList = data.refineryToggles[i] ? 'greenButton' : 'redButton'
    DOMCacheGetOrSet(`refineryToggle${i}`).innerText = refineryToggleNames[i] + ( data.refineryToggles[i] ? ' [ON]' : ' [OFF]')
}

function processOil(amt) {
    if(data.refineryValues[1].lt(373.15) || amt.lte(0)) { //Below Processing Temp
        for(let i = 0; i < oilProductionDisplayValues.length; i++) {
            if(oilProductionDisplayValues[i].neq(0))
            oilProductionDisplayValues[i] = Decimal.dZero
        }
        if(data.refineryValues[2].lt(0)) {
            data.refineryValues[2] = Decimal.dZero
        }
        return
    } 
    if(data.refineryValues[1].gte(calculatedRefineryValues.temperatureRange[0]) && data.refineryValues[1].lte(calculatedRefineryValues.temperatureRange[1])) { // Perfect Temp
        //Production is 50% Naptha, 30% Fuel Oil, 20% Mineral Oil
        data.oilProducts[0] = data.oilProducts[0].add(amt.times(0.5).times(diff))
        data.oilProducts[1] = data.oilProducts[1].add(amt.times(0.3).times(diff))
        data.oilProducts[2] = data.oilProducts[2].add(amt.times(0.2).times(diff))
        
        oilProductionDisplayValues[0] = amt.times(0.5)
        oilProductionDisplayValues[1] = amt.times(0.3)
        oilProductionDisplayValues[2] = amt.times(0.2)
        oilProductionDisplayValues[3] = Decimal.dZero
        oilProductionDisplayValues[4] = Decimal.dZero
    }
    else if(data.refineryValues[1].lt(calculatedRefineryValues.temperatureRange[0])) { // Low Temp
        //Production is 30% Naptha, 20% Fuel Oil, 10% Mineral Oil & 40% Coke
        data.oilProducts[0] = data.oilProducts[0].add(amt.times(0.3).times(diff))
        data.oilProducts[1] = data.oilProducts[1].add(amt.times(0.2).times(diff))
        data.oilProducts[2] = data.oilProducts[2].add(amt.times(0.1).times(diff))
        data.oilProducts[3] = data.oilProducts[3].add(amt.times(0.4).times(diff))
        
        oilProductionDisplayValues[0] = amt.times(0.3)
        oilProductionDisplayValues[1] = amt.times(0.2)
        oilProductionDisplayValues[2] = amt.times(0.1)
        oilProductionDisplayValues[3] = amt.times(0.4)
        oilProductionDisplayValues[4] = Decimal.dZero
    }
    else if(data.refineryValues[1].gt(calculatedRefineryValues.temperatureRange[1])) { //High Temp
        //Production is 30% Naptha, 20% Fuel Oil, 10% Mineral Oil & 40% Residual Gas
        data.oilProducts[0] = data.oilProducts[0].add(amt.times(0.3).times(diff))
        data.oilProducts[1] = data.oilProducts[1].add(amt.times(0.2).times(diff))
        data.oilProducts[2] = data.oilProducts[2].add(amt.times(0.1).times(diff))
        data.oilProducts[4] = data.oilProducts[4].add(amt.times(0.4).times(diff))
        
        oilProductionDisplayValues[0] = amt.times(0.3)
        oilProductionDisplayValues[1] = amt.times(0.2)
        oilProductionDisplayValues[2] = amt.times(0.1)
        oilProductionDisplayValues[3] = Decimal.dZero
        oilProductionDisplayValues[4] = amt.times(0.4)
    }
    data.refineryValues[2] = data.refineryValues[2].sub(amt)
}

function runSmartHeater() {
    if(data.collapseUpgrades[3].lte(0) || !data.automationToggle[0]) return
    const tempIncrement = calculatedRefineryValues.heaterRate.times(diff)
    if(data.refineryValues[1].lt(data.smartHeaterRange[0]) || data.refineryValues[1].lt(data.smartHeaterRange[1])) {
        if((data.refineryValues[1].add(tempIncrement)).gt(data.smartHeaterRange[1])) return
        data.refineryValues[1] = data.refineryValues[1].add(tempIncrement)
    }
}