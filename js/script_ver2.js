'use strict';

class Cell{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.isBomb = false;
        this.numberOfBombAroundHere = 0;
        this.opend = false;
        this.mark = 0;

        this.cellId = 'cell' + String(x) + '_' + String(y);
        this.imgId = 'img' + String(x) + '_' + String(y);
    }
    
    getBomb(){ return this.isBomb; }
    setBomb(){ this.isBomb = true; }
    getNumberOfBombAroundHere(){ return this.numberOfBombAroundHere; }
    setNumberOfBombAroundHere(n){ this.numberOfBombAroundHere = n; }
}

class Minesweeper{
    constructor(x = 10, y = 10, bomb = 10){
        this.x = x;
        this.y = y;
        this.bomb = bomb;
        this.setBomb = false;
        this.cells = new Array();

        for(var i = 0; i < this.y; i++){
            for(var j = 0; j < this.x; j++){
                this.cells.push(new Cell(j, i));
                //console.log(this.cells[this.x*i+j]);
            }
        }
    }

    init(img_percentage=100){
        console.log(img_percentage);
        document.write('<table>');
    for(var i = 0; i < this.y; i++){
        document.write('<tr>');
        for(var j = 0; j < this.x; j++){
            const id1 = this.cells[this.x*i+j].cellId;
            const id2 = this.cells[this.x*i+j].imgId;
            document.write(`<td id=${id1}><img src='../_common/img/cell.png' id=${id2} height = ${String(img_percentage)+'%'}></td>`);
        }
        document.write('</tr>');
    }
    document.write('</table>');
    }

    initBomb(index){
        //console.log('initBomb.');
        this.setBomb = true;
        var temp = 0;
        while(temp < this.bomb){
            //console.log(temp);
            var b_pos_x = Math.floor(Math.random() * this.x);
            var b_pos_y = Math.floor(Math.random() * this.y);

            const temp_x = index % this.x;
            const temp_y = Math.floor(index / this.x);
            const start_x = temp_x==0? 0: temp_x-1;
            const end_x = temp_x==this.x-1? this.x-1: temp_x+1;
            const start_y = temp_y==0? 0: temp_y-1;
            const end_y = temp_y==this.y-1? this.y-1: temp_y+1;
            if(b_pos_x >= start_x && b_pos_x <= end_x && b_pos_y >= start_y && b_pos_y <= end_y){
                continue;
            }

            if(this.cells[this.x*b_pos_y + b_pos_x].getBomb() === false){
                this.cells[this.x*b_pos_y + b_pos_x].setBomb();

                const start_x = b_pos_x==0? 0: b_pos_x-1;
                const end_x = b_pos_x==this.x-1? this.x-1: b_pos_x+1;
                const start_y = b_pos_y==0? 0: b_pos_y-1;
                const end_y = b_pos_y==this.y-1? this.y-1: b_pos_y+1;
                //console.log(b_pos_x, b_pos_y, start_x, end_x, start_y, end_y);
                
                for(var i = start_y; i <= end_y; i++){
                    for(var j = start_x; j <= end_x; j++){
                        this.cells[this.x*i+j].setNumberOfBombAroundHere(this.cells[this.x*i+j].getNumberOfBombAroundHere()+1);
                    }
                }

                temp++;
            }
        }
        //console.log(this.cells);
    }

    open(index){
        if(this.setBomb === false){
            this.initBomb(index);
        }
        if(this.cells[index].mark !== 0){
            return;
        }
        this.cells[index].opend = true;

        if(this.cells[index].isBomb === true){
            document.getElementById(this.cells[index].imgId).src = `../_common/img/cell_bomb.png`;
        }else{
            document.getElementById(this.cells[index].imgId).src = `../_common/img/cell_${this.cells[index].getNumberOfBombAroundHere()}.png`;
            if(this.cells[index].getNumberOfBombAroundHere() === 0){
                const temp_x = index % this.x;
                const temp_y = Math.floor(index / this.x);
                const start_x = temp_x==0? 0: temp_x-1;
                const end_x = temp_x==this.x-1? this.x-1: temp_x+1;
                const start_y = temp_y==0? 0: temp_y-1;
                const end_y = temp_y==this.y-1? this.y-1: temp_y+1;

                //console.log(index, temp_x, temp_y, start_x, end_x, start_y, end_y);
                
                for(var i = start_y; i <= end_y; i++){
                    for(var j = start_x; j <= end_x; j++){
                        if(this.x*i+j !== index && this.cells[this.x*i+j].opend === false){
                            this.open(this.x*i+j);
                        }
                        
                    }
                }
            }
        }
    }

    marking(index){
        //console.log('right click');
        if(this.cells[index].opend === true){
            return;
        }
        this.cells[index].mark = (this.cells[index].mark + 1) % 3;
        switch(this.cells[index].mark){
            case 0:
                document.getElementById(this.cells[index].imgId).src = `../_common/img/cell.png`;
                break;
            case 1:
                document.getElementById(this.cells[index].imgId).src = `../_common/img/cell_flag.png`;
                break;
            case 2:
                document.getElementById(this.cells[index].imgId).src = `../_common/img/cell_ques.png`;
                break;
        }
    }

    rest(){
        var temp = this.bomb;
        for(var i = 0; i < this.x*this.y; i++){
            if(this.cells[i].mark === 1){
                temp--;
            }
        }
        return temp > 0? temp: 0;
    }

    isGameOver(){
        for(var i = 0; i < this.x*this.y; i++){
            if(this.cells[i].isBomb === true && this.cells[i].opend === true){
                return true;
            }
        }
        return false;
    }
    isGameClear(){
        var closed = 0;
        for(var i = 0; i < this.x*this.y; i++){
            if(this.cells[i].opend === false){
                closed++;
            }
        }
        if(this.isGameOver() === false && closed === this.bomb){
            return true;
        }
        return false;
    }
}

function clear(text){
    const res = document.getElementById('result');
    res.textContent = text;
    const time = document.getElementById('time').textContent;
    res.insertAdjacentHTML('afterend', `<p>${time}</p>`);
}

var timer_id = null;

function timer(start){
    //console.log(Math.floor((new Date().getTime() - start.getTime()) / 1000));
    //console.log(start, new Date());
    const time = Math.floor((new Date().getTime() - start.getTime()) / 1000);
    const min = Math.floor(time/60);
    const sec = time%60;
    //console.log(min, sec);
    document.getElementById('time').textContent = 'Time ' + String(min).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
    timer_id = setTimeout(function(s){
        timer(s);
    }, 1000, start);
}

function popupImage() {
    var popup = document.getElementById('js-popup');
    if(!popup) return;
    var blackBg = document.getElementById('js-black-bg');
    var closeBtn = document.getElementById('js-close-btn');
    var newGame = document.getElementById('newgame');
    var replay = document.getElementById('replay');
  
    closePopUp(blackBg);
    closePopUp(closeBtn);
    closePopUp(newGame);
    closePopUp(replay);
    function closePopUp(elem) {
      if(!elem) return;
      elem.addEventListener('click', function() {
        console.log('clicked:'+elem);
        popup.classList.toggle('is-show');

      });
    }
  }

  function closePopUp(elem) {
    if(!elem) return;
    elem.addEventListener('click', function() {
      popup.classList.toggle('is-show');
      
    });
  }


function test1_1(minesweeper){
    document.write('<table>');
    for(var i = 0; i < minesweeper.y; i++){
        document.write('<tr>');
        for(var j = 0; j < minesweeper.x; j++){
            const id = minesweeper.cells[minesweeper.x*i+j].cellId;
            document.write(`<td id=${id}>.</td>`);
        }
        document.write('</tr>');
    }
    document.write('</table>');
}

function test1_2(minesweeper){
    for(var i = 0; i < minesweeper.y; i++){
        for(var j = 0; j < minesweeper.x; j++){
            if(minesweeper.cells[minesweeper.x*i+j].getBomb() === true){
                document.getElementById('cell' + String(j) + '_' + String(i)).textContent = 'B';
            }else{
                //console.log(String(minesweeper.cells[minesweeper.x*i+j].getNumberOfBombAroundHere()));
                document.getElementById('cell' + String(j) + '_' + String(i)).textContent = String(minesweeper.cells[minesweeper.x*i+j].getNumberOfBombAroundHere());
            }
        }
    }
}
