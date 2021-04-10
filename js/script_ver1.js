'use strict';

class Map{
    constructor(size_x, size_y, b_num, size_pic){
        console.log('make class.Map');
        this.size_x = size_x;
        this.size_y = size_y;
        this.b_num = b_num;
        this.size_pic = size_pic;
        this.cells = new Array(this.size_x * this.size_y);
        this.setup();
    }

    setup(){
        if(this.size_x*this.size_y <= this.b_num){
            console.log('error(class.Map.setup)');
            return;
        }

        for(var i = 0; i < this.size_x * this.size_y; i++){
            this.cells[i].bomb = false;
        }

        var rest_b_num = this.b_num;
        while(rest_b_num > 0){
            var b_pos_x = Math.floor(Math.random() * this.size_x);
            var b_pos_y = Math.floor(Math.random() * this.size_y);

            if(this.cells[this.size_x*b_pos_y + b_pos_x].bomb === false){
                this.cells[this.size_x*b_pos_y + b_pos_x].bomb = true;
                rest_b_num--;
            }
        }
    }

    getCells(){ return this.cells; }
    setCells(i, id){ this.cells[i].id = id; }
    getX(){ return this.size_x; }
    getY(){ return this.size_y; }
}


function makeTable(map){
    document.write('<table>');
    for(var i = 0; i < map.getY(); i++){
        document.write('<tr>');
        for(var j = 0; j < map.getX(); j++){
            var id = 'cell' + String(x*i+j+1);
            map.setCells(x*i+j, id);
            //console.log(id);
            //document.write(`<th id=${id}>.</th>`);
            document.write(`<td id=${id}><img src="../_common/img/cell.png" alt="${id}" height="${size}"></td>`);
        }
        document.write('</tr>');
    }
    document.write('</table>');
}

//test. bomb='B',other='a'.
/*
function printMap(map){
    console.log(map.getCells());
    for(var i = 0; i < map.getY(); i++){
        for(var j = 0; j < map.getX(); j++){
            console.log(map.getX()*i+j);
            console.log(map.getCells()[map.getX()*i+j]);
            if(map.getCells()[map.getX()*i+j] === true){
                document.getElementById('cell' + String(map.getX()*i+j+1)).textContent = 'B';
            }else{
                document.getElementById('cell' + String(map.getX()*i+j+1)).textContent = 'a';
            }
            
        }
    }
}*/
