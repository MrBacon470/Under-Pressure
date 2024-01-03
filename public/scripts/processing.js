const crackingRecipes = [
    { // Residual Gas -> Naptha
        input: [D(50)],
        output: [D(10)]
    }
]

const productionRecipes = [
    { // Coke + Naptha -> Asphalt
        input: [D(20),D(30)],
        output: [D(25)]
    },
    { // Naptha -> Plastic
        input: [D(30)],
        output: [D(10)]
    }
]

let crackingCounts = new Array(crackingRecipes.length).fill(Decimal.dZero)
let productionCounts = new Array(productionRecipes.length).fill(Decimal.dZero)

function updateProcessingHTML() {
    if(data.currentTab !== 1) return

    DOMCacheGetOrSet('productionAmountButton').innerText = `Amount Used for Production: ${resourceSellAmts.names[data.buyAmount[1]]}`
    DOMCacheGetOrSet(`crackingHolder0`).style.display = data.collapseUpgrades[2].gte(1) ? 'flex' : 'none'
    
    DOMCacheGetOrSet(`productionHolder0`).style.display = data.collapseUpgrades[1].gte(1) ? 'flex' : 'none'
    DOMCacheGetOrSet(`productionHolder1`).style.display = data.collapseUpgrades[4].gte(1) ? 'flex' : 'none'

    updateCrackingButtonHTML()
    updateProductionButtonHTML()
    for(let i = 0; i < crackingCounts.length; i++) {
        DOMCacheGetOrSet(`crackingButton${i}`).classList = crackingCounts[i].lte(0) ? 'redButton' : 'greenButton'
    }   
    for(let i = 0; i < productionCounts.length; i++) {
        DOMCacheGetOrSet(`productionButton${i}`).classList = productionCounts[i].lte(0) ? 'redButton' : 'greenButton'
    } 

}

function calculateProcessingAmounts() {
    const prodPct = resourceSellAmts.values[data.buyAmount[1]]
    //Cracking Calculations
    crackingCounts[0] = Decimal.floor((data.oilProducts[4].times(prodPct)).div(crackingRecipes[0].input[0]))
    //Production Calculations
    productionCounts[0] = Decimal.min(Decimal.floor((data.oilProducts[3].times(prodPct)).div(productionRecipes[0].input[0])),Decimal.floor((data.oilProducts[0].times(prodPct)).div(productionRecipes[0].input[1])))
    productionCounts[1] = Decimal.floor((data.oilProducts[0].times(prodPct)).div(productionRecipes[1].input[0]))
}

function updateCrackingButtonHTML() {
    DOMCacheGetOrSet(`crackingButton0`).innerText = `${format(crackingRecipes[0].input[0].times(crackingCounts[0]))} Residual Gas -> ${format(crackingRecipes[0].output[0].times(crackingCounts[0]))} Naptha`
}

function updateProductionButtonHTML() {
    DOMCacheGetOrSet(`productionButton0`).innerText = `${format(productionRecipes[0].input[0].times(productionCounts[0]))} Coke + ${format(productionRecipes[0].input[1].times(productionCounts[0]))} Naptha -> ${format(productionRecipes[0].output[0].times(productionCounts[0]))} Asphalt`
    DOMCacheGetOrSet(`productionButton1`).innerText = `${format(productionRecipes[1].input[0].times(productionCounts[1]))} Naptha -> ${format(productionRecipes[1].output[0].times(productionCounts[1]))} Plastic`
}

function crackResource(id) {
    if(crackingCounts[id].eq(0)) return
    const count = crackingCounts[id]
    switch(id) {
        case 0: // Res Gas -> Naptha
            data.oilProducts[0] = data.oilProducts[0].add(crackingRecipes[0].output[0].times(count))
            data.oilProducts[4] = data.oilProducts[4].sub(crackingRecipes[0].input[0].times(count))
            break
    }
}

function produceResource(id) {
    if(productionCounts[id].eq(0)) return
    const count = productionCounts[id]
    switch(id) {
        case 0: // Coke + Naptha -> Asphalt
            data.oilProducts[3] = data.oilProducts[3].sub(productionRecipes[0].input[0].times(count))
            data.oilProducts[0] = data.oilProducts[0].sub(productionRecipes[0].input[0].times(count))
            data.refinedProducts[0] = data.refinedProducts[0].add(productionRecipes[0].output[0].times(count))
            break
        case 1: // Naptha -> Plastic
            data.oilProducts[0] = data.oilProducts[0].sub(productionRecipes[1].input[0].times(count))
            data.refinedProducts[1] = data.refinedProducts[1].add(productionRecipes[1].output[0].times(count))
            break
    }
}