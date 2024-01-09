const achievements = [
    {
        name: 'Profitable',
        desc: `Make $${format(D(1e3))}`,    
        img: 'images/achievementIcons/bronzeMoney.png',
        condition: () => data.funds.gte(1e3)
    },
    {
        name: 'Profiteer',
        desc: `Make $${format(D(1e4))}`,    
        img: 'images/achievementIcons/silverMoney.png',
        condition: () => data.funds.gte(1e4)
    },
    {
        name: 'Oil Barron',
        desc: `Make $${format(D(1e5))}`,    
        img: 'images/achievementIcons/goldMoney.png',
        condition: () => data.funds.gte(1e5)
    },
    {
        name: 'Tycoon',
        desc: `Make $${format(D(5e5))}`,    
        img: 'images/achievementIcons/platinumMoney.png',
        condition: () => data.funds.gte(5e5)
    },
    {
        name: 'Rockefeller',
        desc: `Make $${format(D(1e6))}`,    
        img: 'images/achievementIcons/diamondMoney.png',
        condition: () => data.funds.gte(1e6)
    },
    {
        name: 'Implosion',
        desc: `Acquire your first ceramic`,    
        img: 'images/achievementIcons/bronzeCeramic.png',
        condition: () => data.ceramic.gte(1)
    },
    {
        name: 'Cracked',
        desc: `Acquire 10 Ceramic`,    
        img: 'images/achievementIcons/silverCeramic.png',
        condition: () => data.ceramic.gte(10)
    },
    {
        name: 'Pottery Expert',
        desc: `Acquire 100 Ceramic`,    
        img: 'images/achievementIcons/goldCeramic.png',
        condition: () => data.ceramic.gte(100)
    },
    {
        name: 'Boiler',
        desc: `Reach Processing Temperature`,    
        img: 'images/achievementIcons/cold.png',
        condition: () => data.refineryValues[1].gte(baseRanges.temperature[0])
    },
    {
        name: 'Too Hot!!',
        desc: `Surpass Max Temperature`,    
        img: 'images/heat.png',
        condition: () => data.refineryValues[1].gte(baseRanges.temperature[1])
    },
    {
        name: 'An Upgrade',
        desc: 'Improve your distillation column',
        img: 'images/distCol1.png',
        condition: () => data.collapseUpgrades[0].gte(1)
    },
    {
        name: 'Advancements Galore',
        desc: 'Get the 3rd distillation column upgrade',
        img: 'images/distCol3.png',
        condition: () => data.collapseUpgrades[0].gte(3)
    },
    {
        name: 'Ultimate...',
        desc: 'Max out your distillation column',
        img: 'images/distCol6.png',
        condition: () => data.collapseUpgrades[0].gte(6)
    },
    {
        name: 'Asphalt Absolutist',
        desc: 'Produce some Asphalt',
        img: 'images/asphalt.png',
        condition: () => data.refinedProducts[0].gt(0)
    },
    {
        name: 'Microplastics are good for you',
        desc: 'Produce some plastic',
        img: 'images/plastic.png',
        condition: () => data.refinedProducts[1].gt(0)
    },
    {
        name: 'Red Gold?',
        desc: 'Stockpile 1,000 Liters of Naptha',
        img: 'images/naptha.png',
        condition: () => data.oilProducts[0].gte(1e3)
    },
    {
        name: 'I <3 Combustion',
        desc: 'Stockpile 750 Liters of Fuel Oil',
        img: 'images/fuelOil.png',
        condition: () => data.oilProducts[1].gte(750)
    },
    {
        name: 'Yummy Minerals',
        desc: 'Stockpile 500 Liters of Mineral Oil',
        img: 'images/mineralOil.png',
        condition: () => data.oilProducts[2].gte(500)
    },
    {
        name: 'Pablo Escobar',
        desc: 'Stockpile 1,000 kilos of Coal Coke',
        img: 'images/coke.png',
        condition: () => data.oilProducts[3].gte(1e3)
    },
    {
        name: 'Heavy Hydrocarbons',
        desc: 'Stockpile 1,000 Liters of Residual Gas',
        img: 'images/residual-gas.png',
        condition: () => data.oilProducts[4].gte(1e3)
    },
]

const minAchievementColumnSize = 5
const achievementColumnSizes = [5,5,5,5]

function generateAchievements() {
    let achCount = 0;
    for(let i = 0; i < achievementColumnSizes.length; i++) {
        addHTML('achievementsHolder',`<div id="achievementColumn${i}" class="flexCol"></div>`)
        for(let j = 1; j <= minAchievementColumnSize; j++) {
            if(j <= achievementColumnSizes[i]) {
                addHTML(`achievementColumn${i}`,`<img id="achievement${achCount}" src="${achievements[achCount].img}" class="achLock">`)
                achCount++;
            }
            else {
                addHTML(`achievementColumn${i}`,`<div class="achPlaceholder"></div>`)
            }
        }
    }
}

function achievementHover(id) {
    DOMCacheGetOrSet('achievementHoverText').innerText = `${achievements[id].name} - (${id+1})\n${achievements[id].desc}`
    DOMCacheGetOrSet('achievementHoverText').classList = data.achievements[id] ? 'greenText' : 'redText'
}

function updateAchievementHTML() {
    if(data.currentTab !== 4) return
    for(let i = 0; i < data.achievements.length; i++) {
        DOMCacheGetOrSet(`achievement${i}`).classList = data.achievements[i] ? 'achUnlock' : 'achLock'
    }
    DOMCacheGetOrSet('achievementCompletionText').innerText = `Achievements Completed: ${calculateAchievementsCompleted()}/${data.achievements.length} [${toPlaces(D(calculateAchievementsCompleted()/data.achievements.length).times(100),2,D(101))}%]`
}

function getAchievement(id) {
    data.achievements[id] = true
    generateNotification(`${achievements[id].name} Unlocked!`,'success')
}

function checkAchievements() {
    for(let i = 0; i < achievements.length; i++) {
        if(achievements[i].condition() && !data.achievements[i]) {
            getAchievement(i)        
        }
    }
}

function calculateAchievementsCompleted() {
    let count = 0
    for(let i = 0; i < data.achievements.length; i++) {
        if(data.achievements[i])
            count++;
    }
    return count
}