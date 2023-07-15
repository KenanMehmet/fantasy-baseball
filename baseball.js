// TODO: Move this to its own file
let namesJson;
async function fetchNames() {
    return fetch('./names.json')
        .then(response => {
            return response.json();
        })
        .then(data => {
            namesJson = data;
        })
}

let loader = document.querySelector('#loading')

class Player {
    fName;
    sName;
    age;
    gender;
    origin;
    batting;
    pitching;
    catching;
    running;
    fatigue;
    stamina;
    position;
    rightHanded;
    fieldPosition;
    constructor() {
        this.fName = fName
        this.sName = sName
        this.gender = gender
        this.age = age
        this.batting = batting
        this.pitching = pitching
        this.catching = catching
        this.running = running
        this.rightHanded = rightHanded
        this.stamina = stamina
        this.fatigue = 0
    }
    pitchingStrength() {
        const strength = Math.floor((this.batting - Math.floor(Math.random() * 5)) - (Math.random() * 10 + this.fatigue));
        this.fatiguePlayer();
        console.log(strength)
        return strength
    }
    battingStrength() {
        const strength = Math.floor((this.pitching - Math.floor(Math.random() * 5)) - (Math.random() * 10 + this.fatigue));
        this.fatiguePlayer();
        console.log(strength)
        return strength
    }
    fatiguePlayer() {
        this.fatigue += Math.floor(
            (
                (
                    Math.random() * 100 / this.stamina
                ) * ((100 - this.fatigue) / 100)
            )
            * 100) / 100
    }

}

/*
numbers to make for random generation
1000 names for each gender and last name
a number between 1-3 to determine gender idenity
0-9 for origin
2 numbers for the four stats
0-4 for left hand 5-9 for right hand
position will be determined by score and then random order
3 - 999 - 999 - 09
gender first name last name hand origin

*/

const positions = ['PT', 'CT', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF']
/*
Each position conventionally has an associated number, for use in scorekeeping by the official scorer: 
1 (pitcher), 2 (catcher), 3 (first baseman), 4 (second baseman), 
5 (third baseman), 6 (shortstop), 7 (left fielder), 8 (center fielder), and 9 (right fielder).

PT
CT
FB
SB
TB
SS
LF
CF
RF
*/


let teamOne = [];
let teamTwo = [];
let bases = [undefined, undefined, undefined, undefined];
let gameState = {
    outs: 0,
    strikes: 0,
    balls: 0,
    top: true,
    innings: 1,
    homeScore: 0,
    awayScore: 0,
};
let innings = 1;

const logSeed = (seed) => {
    // For testing to randomize the seeds even more, may just not be worth the effort
    let theLog = Math.log10(Number(seed.substring(1, seed.length)))
    console.log(theLog)
    console.log((theLog * theLog * theLog))
    console.log((theLog * 50))
    console.log(
        (theLog * theLog * theLog) -
        (theLog * 50)
    )

}


const generatePlayer = () => {
    const seed = String(Math.floor(Math.random() * (399999999 - 10000000 + 1) + 10000000));
    let generatedNames = getNames(seed.substring(0, 7));
    let randomPlayer = new Player(
        fName = generatedNames[1],
        sName = generatedNames[0],
        age = Number(seed.slice[-1] + seed[0]),
        gender = generatedNames[2],
        batting = Number(seed.substring(1, 3)),
        pitching = Number(seed.substring(3, 5)),
        catching = Number(seed.substring(5, 7)),
        running = Number((seed[1] + seed[7])),
        stamina = Number((seed[2] + seed[6])),
        rightHanded = true ? (Number(seed[-1]) / 2 === 1) : false
    );
    if (teamOne.length < 14) {
        teamOne.push(randomPlayer)
    } else {
        teamTwo.push(randomPlayer)
    }
};

const getNames = (seed) => {
    const fnameSeed = seed.substring(4, 7)
    let names = [namesJson.surname[Number(seed.substring(1, 4))]]

    if (seed[0] === "1") {
        names.push(namesJson.male[Number(fnameSeed)])
        names.push("male")
    } else if (seed[0] === "2") {
        names.push(namesJson.female[Number(fnameSeed)])
        names.push("female")
    } else {
        if (Number(seed) % 2 === 1) {
            names.push(namesJson.male[Number(fnameSeed)])
        } else {
            names.push(namesJson.female[Number(fnameSeed)])
        }
        names.push("Unspecified")
    }
    return names
}

function pitchingSort(a, b) {
    if (a.pitching < b.pitching) {
        return 1;
    }
    if (a.pitching > b.pitching) {
        return -1;
    }
    return 0;
}

function battingSort(a, b) {
    if (a.pitching < b.pitching) {
        return 1;
    }
    if (a.pitching > b.pitching) {
        return -1;
    }
    return 0;
}

function setPositions(team) {
    team[0].position = "PT"
    // TODO: Once more bases get added add in the extra bases
    for (let i = 1; i < (6 + bases.length); i++) {
        team[i].position = positions[i]
    }
    return team
}

function runInning() {
    console.table(teamTwo[0].stamina, teamTwo[0].pitching)
    while (gameState.outs < 3) {
        let result = pitchBall(teamOne[0], teamTwo[0])
        if (result === true) {
            gameState.homeScore += 1
            if (gameState.homeScore > 3) {
                console.log("Home won")
                break
            }
        } else {
            console.log("Their outta there")
            gameState.outs = gameState.outs + 1
            teamTwo.push(teamTwo.shift())
        }
    }



    // for (let x = 0; x < 5; x++) {
    //     if (x % 2 == 1) {
    //         let score = Number(document.querySelector('#home-score').innerHTML)
    //         score++;
    //         document.querySelector('#home-score').innerHTML = score
    //     } else {
    //         let score = Number(document.querySelector('#away-score').innerHTML)
    //         score++;
    //         document.querySelector('#away-score').innerHTML = score
    //     }
    //     setTimeout(5000)
    // }
}

function pitchBall(pitcher, batter) {
    for (let i = 0; i < 6; i++) {
        console.log("Batter " + batter.batting)
        if (batter.batting > pitcher.pitchingStrength()) {
            gameState.strikes = 0;
            return true
        }
        gameState.strikes++;
    }
    gameState.strikes = 0;
    return false

}

function runSim() {
    fetchNames()
        .then(() => {
            for (let x = 0; x < 28; x++) {
                generatePlayer()
            }
            loader.style.display = "none"
            teamOne.sort(battingSort)
            teamTwo.sort(pitchingSort)
            teamTwo = setPositions(teamTwo)
            setTimeout(function () {
                runInning()

            }, 2000);
        })
}



runSim()