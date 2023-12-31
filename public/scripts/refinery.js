const baseRanges = {
    pressure: D(40),
    temperature: [D(643.15),D(653.15)],
    capacity: D(30207.6), //~190 Barrels of Oil in liters
    integrity: D(100),
}
const refineryToggleNames = [
    'Distillation Column Heater',
    'Crude Oil Feed',
    'Column Pressure Vent                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   '
]
let refineryWarningStr = ''

function updateRefinery() {

}

function updateRefineryHTML() {
    if(data.currentTab !== 0) return
    generateRefineryWarning()
    DOMCacheGetOrSet('distColumnProductionText').innerText = `Main Products\n\nNaptha: +0.00 L/s\nFuel Oil: +0.00 L/s\nMineral Oil: +0.00 L/s\n\n` +
    `Byproducts\nCoke: +0.00 kg/s\nResidual Gas: +0.00 L/s`
    DOMCacheGetOrSet('distColumnInfoText').innerText = `Refinery Pressure: +0.00 mmHg/s\nRefinery Temp: +0.00°K/s\nRefinery Capacity: +0.00 L/s\nRefinery Integrity: 100.00%\n\n`
    DOMCacheGetOrSet('distColumnWarningText').innerHTML = refineryWarningStr
}

function generateRefineryWarning() {
    refineryWarningStr = ''
    if(data.refineryValues[0].gt(baseRanges.pressure))
        refineryWarningStr += '<span class="redText">[DANGER]</span> Refinery Pressure Too High - Losing Integrity<br>'

    if(data.refineryValues[1].lt(baseRanges.temperature[0]))
        refineryWarningStr += '<span class="yellowText">[WARNING]</span> Refinery Temp Too Low - Producing Byproducts<br>'
    if(data.refineryValues[1].gt(baseRanges.temperature[1]))
        refineryWarningStr += '<span class="yellowText">[WARNING]</span> Refinery Temp Too High - Producing Byproducts<br>'

    if(data.refineryValues[2].gte(baseRanges.capacity.times(0.90)))
        refineryWarningStr += '<span class="yellowText">[WARNING]</span> Refinery Capacity at ≥90% of Max Capacity'
}

function updateRefineryToggle(i) {
    data.refineryToggles[i] = !data.refineryToggles[i]
    DOMCacheGetOrSet(`refineryToggle${i}`).classList = data.refineryToggles[i] ? 'greenButton' : 'redButton'
    DOMCacheGetOrSet(`refineryToggle${i}`).innerText = refineryToggleNames[i] + ( data.refineryToggles[i] ? ' [ON]' : ' [OFF]')
}