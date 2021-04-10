'use strict';

class Cell{
    constructor(x, y, id){
        this.x = x;
        this.y = y;
        this.id = id;
        this.bomb = false;
        this.opend = false;
        this.bombAround = 0;
        this.marker = 0;
    }
    setBomb(){ this.bomb = true; }
    setBombAround(n){ this.bombAround = n; }
    addBombAround(){ this.bombAround++; }
    mark(){ this.marker = (this.marker + 1) % 3; }
}

/*
マインスイーパーの主処理をするクラス。
爆弾の設置や、マスを開いたときや旗を立てた時の挙動をhtmlに反映させたりする。
*/

class Minesweeper{
    constructor(x, y, bomb, table_id, img_id='img'){
        /*
        1,2:マインスイーパーのサイズ
        3:爆弾の数
        4:マインスイーパーの画面を表示する場所のid
            ※すでにこのidを持つテーブルタグが作成されている必要がある。
        5:マインスイーパーのマスのid
            を引数にとり初期化を行う。
        ただし、爆弾の位置はまだ設定せず、「initBomb」関数で行う。
        ※ゲームの仕様上この操作が必要になる。詳細は「initBomb」関数の説明に記載。
        */

        this.x = x;
        this.y = y;
        this.bomb = bomb;
        this.bomb_rest = bomb;
        this.table_id = table_id;
        this.img_id = img_id;
        this.cells = new Array(this.x*this.y);
        this.setBomb = false;
        this.init(this.x, this.y, this.table_id, this.img_id);
    }
    init(x, y, table_id, img_id){
        /*
        マスを表示する場所のidを受け取る。※これの後に、"'x座標'_'y座標'"をつけたidにマスを表示する。
        例えばx=y=0(左上)のマスのidはcell0_0になる。
        */
        var table = document.getElementById(table_id);
        if(table.hasChildNodes()){
            for(var i = table.childNodes.length-1; i >= 0; i--){
                table.removeChild(table.childNodes[i]);
            }
        }


        for(var i = 0; i < y; i++){
            const trId = 'tr'+String(i);
            table.insertAdjacentHTML('beforeend', `<tr id=${trId}>`);
            var tr = document.getElementById(trId);
            for(var j = 0; j < x; j++){
                this.cells[x*i+j] = new Cell(j, i, img_id + String(j)+'_'+String(i));
                tr.insertAdjacentHTML('beforeend', `<td><img src='../_common/img/cell.png' id=${this.cells[x*i+j].id} height='50%'></td>`);
            }
        }
    }
    initBomb(x=-1, y=-1){
        /*
        ゲームの仕様で、「最初に選択したマスとその周囲1マスには爆弾が設置されない」というものがある。
        x,yにその「最初に選択したマス」の座標が代入された場合上記の仕様に沿って爆弾を設置する。
        初期値は-1で、この場合全てのマスを対象にして爆弾を設置する。
        */
        if(this.x*this.y -9 < this.bomb){
            console.log('too many bombs');
            return;
        }

        this.setBomb = true;
        var bomb_rest = this.bomb;

        while(bomb_rest > 0){
            //爆弾の位置を生成
            const bomb_x = Math.floor(Math.random() * this.x);
            const bomb_y = Math.floor(Math.random() * this.y);

            //クリックしたマスの周囲1マスは爆弾を設置しない
            if(Math.abs(bomb_x - x) <= 1 && Math.abs(bomb_y - y) <= 1){
                continue;
            }
            //すでに同じマスに爆弾があるかチェック
            if(this.cells[bomb_y*this.x + bomb_x].bomb === false){
                this.cells[bomb_y*this.x + bomb_x].bomb = true;
                bomb_rest--;
                //周囲1マスの'bombAround'を加算
                for(var i = bomb_y-1; i <= bomb_y+1; i++){
                    for(var j = bomb_x-1; j <= bomb_x+1; j++){
                        if(i >= 0 && i < this.y && j >= 0 && j < this.x){
                            this.cells[i*this.x+j].addBombAround();
                        }
                    }
                }
            }
       }
    }
    open(x, y){
        /*
        x,yで指定されたマスを開く。「init」で設定したidの場所に情報を反映する。
        ※これの前に「initBomb」を実行する必要がある。
        */
        if(this.setBomb === false){
            console.log('must run initBomb');
            return;
        }
        //仕様により、旗、はてなマークがある場合マスは開かない
        if(this.cells[y*this.x+x].marker != 0){
            console.log('flag or ques');
            return;
        }

        this.cells[y*this.x+x].opend = true;

        //爆弾がある場合
        if(this.cells[y*this.x+x].bomb === true){
            document.getElementById(this.cells[y*this.x+x].id).src = '../_common/img/cell_bomb.png';
        }else{
            document.getElementById(this.cells[y*this.x+x].id).src = `../_common/img/cell_${this.cells[y*this.x+x].bombAround}.png`;
            //マスの周囲の爆弾が0の場合
            if(this.cells[y*this.x+x].bombAround === 0){
                for(var i = y-1; i <= y+1; i++){
                    for(var j = x-1; j <= x+1; j++){
                        if(i >= 0 && i < this.y && j >= 0 && j < this.x && this.cells[i*this.x+j].opend === false){
                            this.open(j, i);
                        }
                    }
                }
            }
        }

    }
    marking(x, y){
        /*
        x,yで指定されたマスに印をつける。印は旗、はてなマークの2種がある。
        一般的に、旗は爆弾が隠れている位置、はてなは現時点で爆弾があるか未確定なマスに仮置きとして使用される。
        */
        if(this.setBomb === false){
            console.log('must run initBomb');
            return;
        }
        const cell = this.cells[y*this.x+x];
        cell.mark();
        //0:通常 1:旗 2:はてな
        switch(cell.marker){
            case 0:
                document.getElementById(cell.id).src = '../_common/img/cell.png';
                break;
            case 1:
                document.getElementById(cell.id).src = '../_common/img/cell_flag.png';
                break;
            case 2:
                document.getElementById(cell.id).src = '../_common/img/cell_ques.png';
                break;
        }
    }
    setSize(percentage){
        /*
        1マスの大きさを設定する関数。
        */
        for(var i = 0; i < this.x*this.y; i++){
            document.getElementById(this.cells[i].id).height = percentage;
        }
    }
    rest(){
        var temp = this.bomb;
        for(var i = 0; i < this.x*this.y; i++){
            if(this.cells[i].marker === 1){
                temp--;
            }
        }
        return temp > 0? temp: 0;
    }
}
