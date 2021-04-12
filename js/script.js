'use strict';

var ms, start;
var cellImg_close = ['img/cell.png', 'err', 'img/cell_flag.png', 'img/cell_ques.png'];
var cellImg_bomb = 'img/cell_bomb.png';
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
    this.isSetBomb = false;
    this.status = []//0:close, 1:open, 2:flag, 3:ques.
    for(var i=0; i<this.width*this.height; i++){
      this.map.push(0);
      this.status.push(0);
    }

  }
  setBomb(x, y){
    this.isSetBomb = true;
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
      this.status[pos] = 1;
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
  result(){
    var flag = 1;
    for(var i=0; i < this.width*this.height; i++){
      if(this.map[i] == -1){
        if(this.status[i] == 1){
          return -1;
        }
      }
      else if(this.status[i] == 0){
        flag = 0;
      }
    }
    return flag;
  }
}

//////////////////////////////////////////////
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
    var opt = document.getElementById('option').getBoundingClientRect().height;
    // console.log(width, outline-btn-timer);
    var size = width/ms.width;
    if(size > (outline-opt)/ms.height) size = (outline-opt)/ms.height;
    for(var j = 0; j < ms.width; j++){
      var pos = ms.width*i+j;
      var src = cellImg_close[ms.status[pos]];
      if(src == 'err'){
        if(ms.map[pos] == -1){
          src = cellImg_bomb;
        }else{
          src = 'img/cell_'+String(ms.map[pos])+'.png';
        }
      }
      row.insertAdjacentHTML('beforeend', `<div><img src=${src} id=${pos} style='width: ${size}px;'></div>`);
      document.getElementById(pos).onclick = clickCell;
      document.getElementById(pos).oncontextmenu = rightClickCell;
    }
  }
}

function result_txt(result, time){
  document.getElementById('result_txt').textContent = result;
  document.getElementById('result_time').textContent = time;
}

function clickCell(e){
    var e = e || window.event;
    var elem = e.target || e.srcElement;
    var elemId = elem.id;
    if(ms.isSetBomb == false){
      ms.setBomb(elemId%ms.width, Math.floor(elemId/ms.width));
    }
    // console.log(elemId, ms.map[elemId], ms.status[elemId]);
    var result = ms.open(elemId%ms.width, Math.floor(elemId/ms.width));
    switch (ms.result()) {
      case -1:
        // console.log('game over');
        move('game', 'result');
        var diff = Date.now() - start;
        var m = String(Math.floor(diff/60000));
        if(m.length == 1) m = '0'+m;
        var s = ('0' + String(Math.floor((diff)/1000)%60)).slice(-2);
        result_txt('game over', 'time: '+m+':'+s);
        break;
      case 0:
        break;
      case 1:
        // console.log('game clear');
        move('game', 'result');
        var diff = Date.now() - start;
        var m = String(Math.floor(diff/60000));
        if(m.length == 1) m = '0'+m;
        var s = ('0' + String(Math.floor((diff)/1000)%60)).slice(-2);
        result_txt('game clear', 'time: '+m+':'+s);
        break;
    }
    plot(ms);
}

function rightClickCell(e){
  var e = e || window.event;
  var elem = e.target || e.srcElement;
  var elemId = elem.id;
  ms.right(elemId%ms.width, Math.floor(elemId/ms.width));
  plot(ms);
}

function init(x, y, b){
  start = Date.now();
  var timer = function(){
    var now = Date.now();
    document.getElementById('timer').textContent = 'time: '+
      ('0' + String(Math.floor((now-start)/60000))).slice(-2)+':'+
      ('0' + String(Math.floor((now-start)/1000)%60)).slice(-2);
  };
  setInterval(timer, 1000);
  ms = new minesweeper(x, y, b);
  // console.log(ms);
  // ms.setBomb(5, 5);
  // ms.open(5, 5);
  // console.log(ms.map, ms.status);
  plot(ms);
}
