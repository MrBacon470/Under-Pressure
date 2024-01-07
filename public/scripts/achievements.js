const achievements = [
    {
        name: 'Profitable',
        desc: `Make $${format(D(1e3))}`,    
        img: 'images/achievementIcons/bronzeMoney.png',
        condition: () => {data.funds.gte(1e3)}
    },
    {
        name: 'Profiteer',
        desc: `Make $${format(D(1e4))}`,    
        img: 'images/achievementIcons/silverMoney.png',
        condition: () => {data.funds.gte(1e4)}
    },
    {
        name: 'Oil Barron',
        desc: `Make $${format(D(1e5))}`,    
        img: 'images/achievementIcons/goldMoney.png',
        condition: () => {data.funds.gte(1e3)}
    },
    {
        name: 'Tycoon',
        desc: `Make $${format(D(5e5))}`,    
        img: 'images/achievementIcons/platinumMoney.png',
        condition: () => {data.funds.gte(1e3)}
    },
    {
        name: 'Rockefeller',
        desc: `Make $${format(D(1e6))}`,    
        img: 'images/achievementIcons/diamondMoney.png',
        condition: () => {data.funds.gte(1e3)}
    },
]

const minAchievementColumnSize = 5
const achievementColumnSizes = [5,0]

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
    DOMCacheGetOrSet('achievementHoverText').classList = true ? 'greenText' : 'redText'
}

function updateAchievementHTML() {

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