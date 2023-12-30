function format(a,b = 2) {
    a = D(a)
    if(data.settingsToggles[0]) {
        if(a.div(1e93).lt(1e3))
            return notate(a)
        else 
            return formatSci(a)
    }
    else {
        return formatSci(a)
    }
}

class Notation {
    static standardPrefix = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'O', 'N', 'Dc', 'UnDc', 'DuDc', 'TrDc', 'QaDc', 'QiDc', 'SxDc', 'SpDc', 'OcDc', 'NoDc', 'Vg', 'UnVg', 'DuVg', 'TrVg', 'QaVg', 'QiVg', 'SxVg', 'SpVg', 'OcVg', 'NoVg', 'TG'];
    constructor(standardPrefix = Notation.standardPrefix) {
        this.standardPrefix = standardPrefix;
    }
    notate(e) {
        return e.toPrecision(4).replace(/(\d)\.?(\d*)e\+?(\d+)/, (s,a,b,c)=> {
            let ab0 = a + b + '000';
            let num = `${ab0.slice(0, c % 3 + 1)}.${ab0.slice(c % 3 + 1, 4)}`;
            let pow3 = ~~(c/3);
            let prefix = this.standardPrefix[pow3];
            if (prefix) prefix = ' ' + prefix;
            else if (c < 4) prefix = '';
            else prefix = 'e' + (pow3 * 3);
            return `${num}${prefix}`;
        })
    }
    bind() {
        return (e) => this.notate(e);
    }
}

notate = new Notation().bind()

function formatDate(a) {
    let d = new Date(a)
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
}

function getTotalCost(base,rate,level,maxLevel,interval) {
    let totalCost = Decimal.dZero
    let actInterval = interval
    
    if((D(level).add(interval)).gt(maxLevel))
        actInterval = maxLevel.sub(level)

    if(!actInterval.eq(1))
        totalCost = base.times((Decimal.pow(rate,level).sub(Decimal.pow(rate,level.add(actInterval)))).div(Decimal.dOne.sub(rate)))
    else
        totalCost = base.times(Decimal.pow(rate,level))
    return totalCost;
}

function addHTML(target,htmlStr) {
    document.getElementById(target).insertAdjacentHTML('beforeend',htmlStr)
}