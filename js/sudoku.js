async function main(){
    let constraints = [];
    let sudoku = document.getElementsByClassName("tile__value");


    for(let i=0;i<sudoku.length;i++){
        let id = sudoku[i].id;
        let text = sudoku[i].innerText;
        constraints.push({name: id +"_" + text + "input", value:1, var:id +"_" + text});
    }

    if(constraints.length < 17) {
        document.getElementById("error").innerHTML = "Input must be at least 17 characters long!";
        return;
    }

    await (async () => {
        document.getElementById("error").innerHTML = "";
        const glpk = await GLPK();

        function print(res) {
            const el = window.document.getElementById('out');
            el.innerHTML = JSON.stringify(res, null, 2);
        }

        const lp = {
            name: 'LP',
            objective: {
                direction: glpk.GLP_MAX,
                name: 'obj',
                vars: [0
                ]
            },
            subjectTo: [],
            binaries: [],
            generals: []
        };


        // define variables

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                for (let r = 1; r < 10; r++) {
                    let str = "x_" + i + "_" + j + "_" + r;
                    lp['binaries'].push(str);
                }
            }
        }

        // each row must contain a number
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                let constraint = {
                    name: "square_" + i + "_" + j,
                    vars: [],
                    bnds: {type: glpk.GLP_FX, ub: 1.0, lb: 1.0}
                }
                for (let r = 1; r < 10; r++) {
                    let str = "x_" + i + "_" + j + "_" + r;
                    // each row i should have 1 element
                    constraint['vars'].push({name: str, coef: 1.0});
                }
                lp['subjectTo'].push(constraint);
            }
        }

        // each row must contain each number
        for (let i = 0; i < 9; i++) {
            for (let r = 1; r < 10; r++) {
                let constraint = {
                    name: "row_" + i + "_number_" + r,
                    vars: [],
                    bnds: {type: glpk.GLP_FX, ub: 1.0, lb: 1.0}
                };
                for (let j = 0; j < 9; j++) {

                    let str = "x_" + i + "_" + j + "_" + r;
                    // each row i should have 1 element
                    constraint['vars'].push({name: str, coef: 1.0})
                }
                lp['subjectTo'].push(constraint);
            }
        }

        // each col must contain each number
        for (let j = 0; j < 9; j++) {
            for (let r = 1; r < 10; r++) {
                let constraint = {
                    name: "col_" + j + "_number_" + r,
                    vars: [],
                    bnds: {type: glpk.GLP_FX, ub: 1.0, lb: 1.0}
                }
                for (let i = 0; i < 9; i++) {

                    let str = "x_" + i + "_" + j + "_" + r;
                    // each row i should have 1 element
                    constraint['vars'].push({name: str, coef: 1.0})
                }
                lp['subjectTo'].push(constraint)
            }
        }

        // each 3x3 must contain each numberW
        for (let row = 0; row < 9; row = row + 3) {
            for (let col = 0; col < 9; col = col + 3) {

                for (let k = 1; k < 10; k++) {
                    let constraint = {
                        name: "cube_" + row + "_" + col + "_value_" + k,
                        vars: [],
                        bnds: {type: glpk.GLP_FX, ub: 1.0, lb: 1.0}
                    }
                    for (let i = 0; i < 3; i++) {
                        for (let j = 0; j < 3; j++) {

                            let str = "x_" + (i + row) + "_" + (j + col) + '_' + k;
                            constraint['vars'].push({name: str, coef: 1.0})
                        }
                    }
                    lp['subjectTo'].push(constraint)
                }
            }
        }
        for (let i=0; i<constraints.length;i++){
            let constraint =
                {
                    name: constraints[i]['name'],
                    vars: [{name: constraints[i]['var'], coef: 1.0}],
                    bnds: {type: glpk.GLP_FX, ub: constraints[i]['value'], lb: constraints[i]['value']}
                }
            console.log(constraint)
            lp['subjectTo'].push(constraint);
        }

        const opt = {
            msglev: glpk.GLP_MSG_OFF,
            cb: {
                call: res => print(res),
                each: 1
            }
        };
        try {
        console.log("rinad")
        glpk.solve(lp, opt)
            .then(res => print(res))
            .catch(err => {
                console.log(err)
            });
        }
        catch(err) {
            document.getElementById("error").innerHTML = "Oups! Run out of depth. GLPK depth is limited to " +
                                                                    "reduce computation. Please try and easier problem"
            }


        let sol = await glpk.solve(lp, glpk.GLP_MSG_DBG)
        console.log("done!")
        let answers = []

        Object.keys(sol['result']['vars']).forEach(function (key, index) {
            if (sol['result']['vars'][key] === 1) {
                let val = key.split("_")
                answers.push({id: "x_" + val[1] + '_' + val[2], value: val[3]})
            }
        });

        if(answers.length === 0){
            document.getElementById("error").innerHTML = "No solution! You can always reset or adjust the values"
            return;
        }

        /* assignments*/

        for(let i=0; i<answers.length;i++) {
            document.getElementById(answers[i].id).innerText = answers[i].value ;
        }

    })();
}

window.Solver=()=> main()