/*
A* Path Finding Algorithm
Tom Osborne
02 January 2022
*/
let cols = 20;
let rows = 20;
let grid = new Array(cols);

let open_set = [];
let closed_set = [];
let start;
let end;
let w, h;
let path = [];

function removeFromArr(arr, elt) {
    for (let i = arr.length-1; i >= 0; i--) {
        if (arr[i] == elt) {
            arr.splice(i, 1);
        }
    }
}

function heuristic(a, b) {
    // return dist(a.i, a.j, b.i, b.j); // Euclidean
    return abs(a.i - b.i) + abs(a.j - b.j); // Manhattan
}

class Cell {
    constructor(i, j){
        this.i = i;
        this.j = j;
        this.f = 0;
        this.g = 0;
        this.h = 0;    
        this.neighbours = [];
        this.parent = undefined;
    }

    show(colour) {
        fill(colour);
        noStroke;
        rect(this.i * w, this.j * h, w, h);
    }

    add_neighbours() {
        let i = this.i;
        let j = this.j;
        if (i < cols - 1) {
            this.neighbours.push(grid[i + 1][j]);
        }
        if (i > 0) {
            this.neighbours.push(grid[i - 1][j]);
        }
        if (j < rows - 1) {
            this.neighbours.push(grid[i][j + 1]);
        }
        if (j > 0) {       
            this.neighbours.push(grid[i][j - 1]);
        }
    }
}

function setup(){
    createCanvas(600, 600);

    w = width / cols;
    h = height / rows;

    // Create a 2d array
    for (let i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }
    
    // Fill the array with Cell objects
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = new Cell(i, j);
        }
    }

    // Add neighbours
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j].add_neighbours(grid);
        }
    }

    start = grid[0][0];
    end = grid[cols-1][rows - 1];

    open_set.push(start);

}

function draw() {

    // A* Algorithm
    if (open_set.length > 0) {

        let record = 0;
        for (let i = 0; i < open_set.length; i++) {
            if (open_set[i].f < open_set[record].f) {
                record = i;
            }
        }

        current = open_set[record];

        if (current === end) {
            noLoop();
            console.log("done!");
            console.log(grid);
            console.log(path);
        }

        // Move checked cells to the closed set
        removeFromArr(open_set, current);
        closed_set.push(current);

        let neighbours = current.neighbours;
        
        for (let i = 0; i < neighbours.length; i++) {
            let neighbour = neighbours[i];

            if (!closed_set.includes(neighbour)) {
                let temp_g = current.g + 1;

                if (open_set.includes(neighbour)) {
                    if(temp_g < neighbour.g) {
                        neighbour.g = temp_g;
                    }
                } else {
                    neighbour.g = temp_g;
                    open_set.push(neighbour);
                }

                neighbour.h = heuristic(neighbour, end);
                neighbour.f = neighbour.g + neighbour.h;
                neighbour.parent = current;
            }

        }

    } else {
        // no solution
    }

    // Draw grid
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j].show(color(255));
        }
    }

    // Show open set
    for (let i = 0; i < open_set.length; i++) {
        open_set[i].show(color(0, 255, 0));
    }

    // Show closed set
    for (let i = 0; i < closed_set.length; i++) {
        closed_set[i].show(color(255, 0, 0));
    }

    // Find and show the path
    path = [];
    let temp = current;
    path.push(temp);

    while (temp.parent) {
        path.push(temp.parent);
        temp = temp.parent;
    }

    for (let i = 0; i < path.length; i++) {
        path[i].show(color(0, 0, 255));
    }
}