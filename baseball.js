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

loader.style.display = "none"
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
    stamina;
    position;
    rightHanded;
    fieldPosition;
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

const positions = ['PT', 'CT', 'FB', 'SB', 'TB', 'SS', 'LF', 'CF', 'RF']
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


let team_one = [];
let team_two = [];
let bases = [];
let strikeOuts = 0;
let innings;


const generatePlayer = () => {
    const seed = String(Math.floor(Math.random() * (399999999 - 10000000 + 1) + 10000000));
    console.log(seed)
    console.log(namesJson.female)
    let generatedNames = getNames(seed.substring(0, 7));
    let randomPlayer = new Player(
        fName = generatedNames[1],
        sName = generatedNames[0],
        age = Number(seed.slice[-1] + seed[0]),
        gender = generatedNames[2],

    );
    if (team_one.length >= 14) {
        team_one.push(randomPlayer)
    } else {
        team_two.push(randomPlayer)
    }
};

const getNames = (seed) => {
    console.log(seed)
    console.log(seed[4])
    console.log(seed.substring(1, 4))
    console.log(seed.substring(4, 7))
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
    console.log(names)
    return names
}



function runSim() {
    fetchNames()
        .then(() => {
            console.log(namesJson)
            for (let x = 0; x < 10; x++) {
                generatePlayer()
            }
            console.log(team_one, team_two)
        })
}

runSim()