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
}

function make(){
  ms = new minesweeper(10, 10, 15);
  ms.setBomb(0, 0);
}
