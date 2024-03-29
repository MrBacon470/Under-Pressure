const baseResourceCosts = [D(25),D(40),D(80),D(10),D(5)]
const refinedResourceCosts = [D(40),D(60)]

const resourceSellAmts = {
    names: ['10%','25%','50%','100%'],
    values: [D(0.1),D(0.25),D(0.5),D(1)]
}

let currentSaleMultiplier = Decimal.dOne
let previousSaleMultiplier = Decimal.dOne
let multiplierCounter = 0
let marketCapValue = D(5)
function updateShipping() {
    marketCapValue = data.regularUpgrades[3].gt(0) ? D(5).times(D(1.5).times(data.regularUpgrades[3])) : D(5)
    multiplierCounter += diff
    if(multiplierCounter >= 10) {
        previousSaleMultiplier = currentSaleMultiplier;
        let changeAmt = getRandomArbitrary(0,6)
        changeAmt *= Math.random() <= 0.5 ? -1 : 1
        currentSaleMultiplier = currentSaleMultiplier.add(changeAmt)
        currentSaleMultiplier = Decimal.max(currentSaleMultiplier,D(0.25))
        currentSaleMultiplier = Decimal.min(currentSaleMultiplier,marketCapValue)
        multiplierCounter = 0
    }
}

function updateShippingHTML() {
    if(data.currentTab !== 2) return

    DOMCacheGetOrSet(`napthaInfoText`).innerText = `Naptha: ${format(data.oilProducts[0])} L`
    DOMCacheGetOrSet(`fuelOilInfoText`).innerText = `Fuel Oil: ${format(data.oilProducts[1])} L`
    DOMCacheGetOrSet(`mineralOilInfoText`).innerText = `Mineral Oil: ${format(data.oilProducts[2])} L`
    DOMCacheGetOrSet(`cokeInfoText`).innerText = `Coke: ${format(data.oilProducts[3])} kg`
    DOMCacheGetOrSet(`residualGasInfoText`).innerText = `Residual Gas: ${format(data.oilProducts[4])} L`

    DOMCacheGetOrSet(`asphaltInfoText`).innerText = `Asphalt: ${format(data.refinedProducts[0])} L`
    DOMCacheGetOrSet(`plasticInfoText`).innerText = `Plastic: ${format(data.refinedProducts[1])} kg`

    DOMCacheGetOrSet(`napthaSellButton`).innerText = `Sell Naptha: $${format((data.oilProducts[0].times(resourceSellAmts.values[data.buyAmount[0]])).times(baseResourceCosts[0].times(currentSaleMultiplier)))}`
    DOMCacheGetOrSet(`fuelOilSellButton`).innerText = `Sell Fuel Oil: $${format((data.oilProducts[1].times(resourceSellAmts.values[data.buyAmount[0]])).times(baseResourceCosts[1].times(currentSaleMultiplier)))}`
    DOMCacheGetOrSet(`mineralOilSellButton`).innerText = `Sell Mineral Oil: $${format((data.oilProducts[2].times(resourceSellAmts.values[data.buyAmount[0]])).times(baseResourceCosts[2].times(currentSaleMultiplier)))}`
    DOMCacheGetOrSet(`cokeSellButton`).innerText = `Sell Coke: $${format((data.oilProducts[3].times(resourceSellAmts.values[data.buyAmount[0]])).times(baseResourceCosts[3].times(currentSaleMultiplier)))}`
    DOMCacheGetOrSet(`residualGasSellButton`).innerText = `Sell Residual Gas: $${format((data.oilProducts[4].times(resourceSellAmts.values[data.buyAmount[0]])).times(baseResourceCosts[4].times(currentSaleMultiplier)))}`

    DOMCacheGetOrSet(`asphaltSellButton`).innerText = `Sell Asphalt: $${format((data.refinedProducts[0].times(resourceSellAmts.values[data.buyAmount[0]])).times(refinedResourceCosts[0].times(currentSaleMultiplier)))}`
    DOMCacheGetOrSet(`plasticSellButton`).innerText = `Sell Plastic: $${format((data.refinedProducts[1].times(resourceSellAmts.values[data.buyAmount[0]])).times(refinedResourceCosts[1].times(currentSaleMultiplier)))}`

    DOMCacheGetOrSet(`resourceSellAmountButton`).innerText = `Sell Amount: ${resourceSellAmts.names[data.buyAmount[0]]}`

    if(currentSaleMultiplier.eq(previousSaleMultiplier)) {
        DOMCacheGetOrSet(`resourceSellModifierText`).classList = ''
        DOMCacheGetOrSet(`resourceSellModifierText`).innerText = `Market Value Modifer: x${format(currentSaleMultiplier)} to Resource Sale Price` +
        `\n[+0.00x] | Time to Update: ${formatTime(10-multiplierCounter)}` +
        `\nMarket Cap: x${format(marketCapValue)}`
    }
    else {
        DOMCacheGetOrSet(`resourceSellModifierText`).classList = previousSaleMultiplier.lt(currentSaleMultiplier) ? 'greenText' : 'redText'
        DOMCacheGetOrSet(`resourceSellModifierText`).innerText = `Market Value Modifer: x${format(currentSaleMultiplier)} to Resource Sale Price` +
        `\n[${currentSaleMultiplier.sub(previousSaleMultiplier).gt(0) ? '+':''}${format(currentSaleMultiplier.sub(previousSaleMultiplier))}] | Time to Update: ${formatTime(10-multiplierCounter)}` +
        `\nMarket Cap: x${format(marketCapValue)}`
    }
}

function sellResource(id) {
    if(data.oilProducts[id].eq(0)) return
    if(data.oilProducts[id].lte(0.1)) {
        data.funds = data.funds.add((data.oilProducts[id]).times(baseResourceCosts[id].times(currentSaleMultiplier)))
        data.oilProducts[id] = D(0)
    }
    else {
        data.funds = data.funds.add((data.oilProducts[id].times(resourceSellAmts.values[data.buyAmount[0]])).times(baseResourceCosts[id].times(currentSaleMultiplier)))
        data.oilProducts[id] = data.oilProducts[id].sub(data.oilProducts[id].times(resourceSellAmts.values[data.buyAmount[0]]))
    }
}

function sellRefined(id) {
    if(data.refinedProducts[id].eq(0)) return
    if(data.refinedProducts[id].lte(0.1)) {
        data.funds = data.funds.add((data.refinedProducts[id]).times(refinedResourceCosts[id].times(currentSaleMultiplier)))
        data.refinedProducts[id] = D(0)
    }
    else {
        data.funds = data.funds.add((data.refinedProducts[id].times(resourceSellAmts.values[data.buyAmount[0]])).times(refinedResourceCosts[id].times(currentSaleMultiplier)))
        data.refinedProducts[id] = data.refinedProducts[id].sub(data.refinedProducts[id].times(resourceSellAmts.values[data.buyAmount[0]]))
    }
}