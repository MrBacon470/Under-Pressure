const baseRanges = {
    pressure: [Decimal.dTen,D(40)],
    temperature: [D(643.15),D(653.15)],
    capacity: D(30207.6), //~190 Barrels of Oil in liters
    integrity: D(100)
}

function updateRefinery() {

}

function updateRefineryHTML() {
    if(data.currentTab !== 0) return
    DOMCacheGetOrSet('distColumnProductionText').innerText = `Main Products\n\nNaptha: +0.00 L/s\nFuel Oil: +0.00 L/s\nMineral Oil: +0.00 L/s\n\n` +
    `Byproducts\nCoke: +0.00 kg/s\nResidual Gas: +0.00 L/s`
    DOMCacheGetOrSet('distColumnInfoText').innerText = `Refinery Pressure: +0.00 mmHg/s\nRefinery Temp: +0.00°K/s\nRefinery Capacity: +0.00 L/s\nRefinery Integrity: 100.00%\n\n` +
    `[Warning] Temperature Too High\n[Warning] Pressure Too High Taking Damage\n[Warning] Damaged Refinery is Less Effective`
}

function generateRefineryWarning() {
    let str = ''
}