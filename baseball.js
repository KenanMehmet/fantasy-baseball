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

const fanfare = new Audio('PipeOrganCharge.mp3')
const gameLog = document.querySelector('#game-log')
const homeScore = document.querySelector('#home-score')
const awayScore = document.querySelector('#away-score')
// TODO: Gravity based on playing field
const planets = [["Earth", "#1a285a", 9.8]]
const playingField = planets[0]
const gravity = playingField[2]

function randomNegativePostiveNumber(range) {
    let num = Math.floor(Math.random() * range) + 1;
    num *= Math.round(Math.random()) ? 1 : -1;
    return num
}

document.querySelector('body').style.backgroundColor = playingField[1]

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
        const strength = Math.floor((this.batting - randomNegativePostiveNumber(5)) - (Math.random() * 10 + this.fatigue));
        this.fatiguePlayer();
        console.log(strength)
        return strength
    }
    battingStrength() {
        const strength = Math.floor((this.pitching - randomNegativePostiveNumber(15)) - (Math.random() * 10 + this.fatigue));
        this.fatiguePlayer();
        console.log(strength)
        return strength
    }
    canCatch(ballVelocity) {
        //TODO: Do some actual maths here
        const strength = Math.floor((Math.random() * 100) - (this.catching - (Math.random() * 5)))
        return strength < 25 ? true : false
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
    reinvigoratePlayer() {
        //TODO: regenerate player fatigue based on position
        this.fatigue = Math.floor(this.fatigue - (this.stamina / 10))
    }
    runTime(timeInAir) {
        return Math.floor((timeInAir * this.running) / 100)
    }
    runningSpeed() {
        console.log(this)
        console.log(this.running)
        return Math.floor(
            (
                this.running - randomNegativePostiveNumber(2)
            ) - (Math.random() * 10 + this.fatigue)
        )
    }


}

Player.prototype.toString = function playerToString() {
    return `${this.fName}`
};

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

const positions = ['PT', 'CT', 'RB', 'CB', 'LB', 'SS', 'LF', 'CF', 'RF']
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

/*

Distance to run to a base will be set at a number of 100, 
we will then calculate the speed of the runner which we will
calculate how many seconds it takes by how many of itself it takes
to get to 100, then if the ball is not caught we will will then 
take the closest catcher and have them use their pithing stat
to calculate their throw speed and add that time onto them running.

average running speed for running 90 feet (27.432 meters) is
4.3 seconds
source: https://www.topendsports.com/testing/tests/sprint-first-base.htm


*/


let teamOne = [];
let teamTwo = [];
let bases = [undefined, undefined, undefined];
let gameState = {
    outs: 0,
    strikes: 0,
    balls: 0,
    top: true,
    batting: teamTwo,
    pitching: teamOne,
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

const swapTeams = () => {
    gameState.outs = 0
    bases.forEach(function (value, index) { bases[index] = undefined })
    teamOne.forEach(player => player.reinvigoratePlayer())
    teamTwo.forEach(player => player.reinvigoratePlayer())
    if (gameState.top) {
        gameState.pitching = teamOne
        gameState.bating = teamTwo
        gameState.top = false
        console.log(teamOne)
        swapPitcher(teamOne)
        console.log(teamTwo)
        updateLog(`Bottom of the ${gameState.innings} inning`)
    }
    else {
        gameState.pitching = teamTwo
        gameState.bating = teamOne
        gameState.top = true
        swapPitcher(teamTwo)
        gameState.innings++
        updateLog(`Top of the ${gameState.innings} inning`)
    }
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

function swapPitcher(team) {
    team.sort(pitchingSort)
    for (let i = 1; i < team.length; i++) {
        if (
            (team[0].pitching - team[0].fatigue) < (team[i].pitching - team[i].fatigue)
        ) {
            team[0].position = team[i].position
            team[i].position = 'PT'
            break
        } else if ((team[0].pitching - team[0].fatigue) > (team[i].pitching + 10)) {
            break
        }
    }
}

function addScore(runner) {
    updateLog(`${runner.fName} has scored it for their team`)
    if (gameState.top) {
        gameState.awayScore++
        awayScore.innerHTML = gameState.awayScore
    }
    else {
        gameState.homeScore++
        homeScore.innerHTML = gameState.homeScore
    }
}

function updateLog(text) {
    const para = document.createElement("p");
    const node = document.createTextNode(text);
    para.appendChild(node);
    gameLog.appendChild(para)
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
    //fanfare.play();
    while (gameState.innings <= 9) {
        while (gameState.outs < 3) {
            let result = pitchBall(
                gameState.pitching.find(
                    player => player.position === 'PT'
                ), gameState.batting[0])
            if (result === true) {
                advanceBases(5, gameState.batting[0]);
            } else {
                updateLog("OUT")
                gameState.outs = gameState.outs + 1
            }
            gameState.batting.push(gameState.batting[0])
            gameState.batting.shift()
        }
        gameState.strikes = 0
        swapTeams()
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

const wait = (ms) => {
    const start = Date.now();
    let now = start;
    while (now - start < ms) {
        now = Date.now();
    }
}

function pitchBall(pitcher, batter) {

    //TODO: 
    updateLog(`Up at Bat is: ${batter.fName}`)
    while (gameState.strikes < 3) {
        if (gameState.awayScore > 999) {
            break
        }
        if (batter.batting > pitcher.pitchingStrength()) {
            gameState.strikes = 0;
            updateLog(`Its a hit`)

            if (catchBall("blank")) {
                updateLog(`Caught by ${pitcher.fName}`)
                return false
            }
            return true
        }
        else {
            updateLog("STRIKE")
            gameState.strikes++;
        }
    }
    gameState.strikes = 0;
    return false
}

function findCatcher(ballVelocity) {
    //ballVelocity will contain 2 numbers, direction and speed
    // TODO: Redo the entire thing once extra bases are added. Goody
    let ballDirection = Math.random()
    //temperaory code
    if (ballDirection > 0.6) {
        ballDirection = 1
    } else if (ballDirection < 0.3) {
        ballDirection = -1
    } else { ballDirection = 0 }
    const ballSpeed = Math.random() < 0.5 ? "B" : "F"
    let catcher;
    if (ballDirection === -1) {
        catcher = gameState.pitching.find(
            player => player.position === (`L${ballSpeed}`)
        )
    } else if (ballDirection === 1) {
        catcher = gameState.pitching.find(
            player => player.position === (`R${ballSpeed}`)
        )
    } else {
        catcher = gameState.pitching.find(
            player => player.position === (`C${ballSpeed}`)
        )
    }
    return catcher
}

function advanceBases(timeInAir, batter) {
    for (let i = 0; i < bases.length; i++) {
        if (bases[i] !== undefined) {
            let runresult = runToBase(timeInAir, bases[i])
            if (runresult) {
                if (i === 0) {
                    addScore(bases[i])
                }
                else {
                    bases[i - 1] = bases[i]
                }
                bases[i] = undefined
            }
            else {
                bases[i] = undefined
                gameState.outs++
                if (gameState.outs === 3) {
                    break
                }
            }
        }
    }
    bases.pop()
    bases.push(batter)
    updateLog(displayBases(bases))

}

function displayBases(bases) {
    let log = "Bases are "
    for (let i = 0; i < bases.length; i++) {
        if (bases[i] !== undefined) {
            log = log + `${bases[i]}, `
        }
        else {
            log = log + "open, "
        }
    }
    return log.slice(0, -2)
}

function calculateAirTime(batter) {
    // do something here to calculate air time
}

function runToBase(timeInAir, runner) {
    console.log("RunSpeed:")
    console.log(runner.runningSpeed())
    return true
}

function catchBall(ballVelocity) {
    const catcher = findCatcher();
    return catcher.canCatch("blank");
}

function runSim() {
    fetchNames()
        .then(() => {
            for (let x = 0; x < 28; x++) {
                generatePlayer()
            }
            teamOne.sort(pitchingSort)
            teamTwo.sort(pitchingSort)
            teamOne = setPositions(teamOne)
            teamTwo = setPositions(teamTwo)
            teamTwo.sort(battingSort)
            loader.style.display = "none"
        })
}



runSim()