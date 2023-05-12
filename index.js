import {buildSDNF, buildSKNF, showTable} from '../lab3/lab3New.js'
import {MinimizationMcClusky} from '../lab3/MinimizationMcClusky.js'

let NAME_OF_FSM_SIGNAL = 'V'
let NAMES_OF_PRE_TACTS = ['q1', 'q2', 'q3']
let NAMES_OF_POST_TACTS = ['Q1', 'Q2', 'Q3']
let NAMES_OF_TRIGGER_FUNCTIONS = ['H1', 'H2', 'H3']

let inputVars = ['q1', 'q2', 'q3', 'V']

function truthTable(n) {
    const rows = 2 ** n;
    const table = [];

    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = n - 1; j >= 0; j--) {
            row.push((i >> j) & 1);
        }
        table.push(row);
    }

    return table;
}

const buildTruthTable = (count) => {
    let table = truthTable(count)
    return table
}

const buildTable = (count) => {
    let table = buildTruthTable(count)
    let inputsTable = []
    let excitationTable = []
    console.log(table)
    for(let i = 0; i < table.length; i++) {
        for(let j = 0; j < 2; j++) {
            if(j == 0) {
                inputsTable.push([...table[i], j, ...table[i]])
            } else if(j == 1) {
                if(i !== table.length - 1) {
                    inputsTable.push([...table[i], j, ...table[i + 1]])
                } else {
                    inputsTable.push([...table[i], j, ...table[0]])
                }
            }
        }
    }
    for(let i = 0; i < inputsTable.length; i++) {
        let row = []
        for(let j = 0; j < 3; j++) {
            if(inputsTable[i][j] !== inputsTable[i][j + 4]) {
                row.push(1)
            } else {
                row.push(0)
            }
        }
        excitationTable.push(row)
    }
    console.log("TRANSITION TABLE")
    console.log(NAMES_OF_PRE_TACTS.join(" "), NAME_OF_FSM_SIGNAL, NAMES_OF_POST_TACTS.join(" "), NAMES_OF_TRIGGER_FUNCTIONS.join(" "))
    for(let i = 0; i < inputsTable.length; i++) {
        console.log(inputsTable[i].join("  "),"", excitationTable[i].join("  "))
    }
    let tableWithOnlyVars = []
    for(let i = 0; i < inputsTable.length; i++) {
        tableWithOnlyVars.push(inputsTable[i].slice(0, 4))
    }
    return {tableWithOnlyVars, excitationTable}
}

let {tableWithOnlyVars, excitationTable} = buildTable(3)

const getH1H2H3 = (excitationTable) => {
    let h1 = []
    let h2 = []
    let h3 = []
    for(let i = 0; i < excitationTable.length; i++) {
        h1.push(excitationTable[i][0])
        h2.push(excitationTable[i][1])
        h3.push(excitationTable[i][2])
    }
    return {h1, h2, h3}
}

const MinimizeH1H2H3 = (tableWithOnlyVars, excitationTable, inputVars) => {
    let {h1, h2, h3} = getH1H2H3(excitationTable)
    let h1SDNF = buildSDNF(tableWithOnlyVars, h1, inputVars)
    let h2SDNF = buildSDNF(tableWithOnlyVars, h2, inputVars)
    let h3SDNF = buildSDNF(tableWithOnlyVars, h3, inputVars)

    let minObj = new MinimizationMcClusky()
    console.log('H1:', minObj.formStringAns(h1SDNF))
    console.log('H2:', minObj.formStringAns(h2SDNF))
    console.log('H3:', minObj.formStringAns(h3SDNF))
}

MinimizeH1H2H3(tableWithOnlyVars, excitationTable, inputVars)


