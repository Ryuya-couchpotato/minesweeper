'use strict';

var ms;
window.onload = function () {
  var v = document.getElementById("vertical");
  var h = document.getElementById("horizontal");
  var vt = document.getElementById("v_tbox");
  var ht = document.getElementById("h_tbox");
  var b = document.getElementById("bomb")
  var bt = document.getElementById("b_tbox");
    // 選択した際のイベント取得
    v.addEventListener('change', (e) => {
      vt.value = v.value;
      b.max = bt.max = v.value*h.value-9;
    });
    vt.addEventListener('change', (e) => {
      v.value = vt.value;
      b.max = bt.max = v.value*h.value-9;
    });
    h.addEventListener('change', (e) => {
      ht.value = h.value;
      b.max = bt.max = v.value*h.value-9;
    });
    ht.addEventListener('change', (e) => {
      h.value = ht.value;
      b.max = bt.max = v.value*h.value-9;
    });
    b.addEventListener('change', (e) => {
      bt.value = b.value;
    });
    bt.addEventListener('change', (e) => {
      b.value = bt.value;
    });
  }

function move(from, to) {
  var f = document.getElementById(from);
  var t = document.getElementById(to);
  // console.log(f, t);
  f.classList.add('hidden');
  f.classList.remove('visible');
  t.classList.add('visible');
  t.classList.remove('hidden');
}

class minesweeper {
  constructor(width, height, bomb){
    this.width = width;
    this.height = height;
    this.bomb = bomb;
    this.map = []
    this.status = []//0:close, 1:open, 2:flag, 3:ques.
    for(var i=0; i<this.width*this.height; i++){
      this.map.push(0);
      this.status.push(0);
    }
  }
  setBomb(x, y){
    var rest = this.bomb;
    while(rest > 0){
      var pos = Math.floor(Math.random() * this.width*this.height);
      var px = pos%this.width;
      var py = Math.floor(pos/this.width);

      if(Math.abs(x-px) > 1 || Math.abs(y-py) > 1){
        if(this.map[pos] >= 0){
          for(var h=py-1; h <= py+1; h++){
            if(h<0 || h>=this.height) continue;
            for(var w=px-1; w <= px+1; w++){
              if(w<0 || w>=this.width || this.map[this.width*h+w] == -1) continue;
              this.map[this.width*h+w]+=1;
            }
          }
          this.map[pos] = -1;
          rest--;
        }
      }
    }
    // console.log(this.map);
  }

  open_step2(x, y, pos){
    if(this.map[pos] == 0){
      // console.log(x, y, 'is 0');
      for(var h=y-1; h <= y+1; h++){
        if(h<0 || h>=this.height) continue;
        for(var w=x-1; w <= x+1; w++){
          if(w<0 || w>=this.width) continue;
          if(this.status[this.width*h+w] != 0) continue;
          // console.log(w, h, 'will open');
          this.status[this.width*h+w] = 1;
          if(this.map[this.width*h+w] == 0){
            // console.log('find new 0');
            this.open_step2(w, h, this.width*h+w);
          }
        }
      }
    }else{
      this.status[pos] = 1;
    }
  }

  open(x, y){
    var pos = this.width*y+x;
    if(this.status[pos] != 0){
      return -1;
    }else if(this.map[pos] == -1){
      return -2;
    }
    //map[x, y]=0
    this.open_step2(x, y, pos);
    return 0;
  }
  right(x, y){
    var pos = this.width*y+x;
    switch(this.status[pos]){
      case 0:
        this.status[pos] = 2;
        break;
      case 1:
        return -1;
      case 2:
        this.status[pos] = 3;
        break;
      case 3:
        this.status[pos] = 0;
        break;
    }
    return 0;
  }

}

function plot(ms){
  var table = document.getElementById('minesweeper');
  if(table.hasChildNodes()){
      for(var i = table.childNodes.length-1; i >= 0; i--){
          table.removeChild(table.childNodes[i]);
      }
  }
  for(var i = 0; i < ms.height; i++){
      const rowId = 'row'+String(i);
      table.insertAdjacentHTML('beforeend', `<div class='row' id=${rowId}>`);
      var row = document.getElementById(rowId);
      var width = row.getBoundingClientRect().width;
      var outline = document.getElementById('outline').getBoundingClientRect().height;
      var btn = document.getElementById('back_game').getBoundingClientRect().height;
      var timer = document.getElementById('timer').getBoundingClientRect().height;
      // console.log(width, outline-btn-timer);
      var size = width/ms.width;
      if(size > (outline-btn-timer)/ms.height) size = (outline-btn-timer)/ms.height;
      for(var j = 0; j < ms.width; j++){
          row.insertAdjacentHTML('beforeend', `<div><img src='img/cell.png' id=${ms.width*i+j} style='width: ${size}px;'></div>`);
      }
  }
}


function init(x, y, b){
  ms = new minesweeper(x, y, b);
  // console.log(ms);
  ms.setBomb(5, 5);
  ms.open(5, 5);
  // console.log(ms.map, ms.status);
  plot(ms);
}
