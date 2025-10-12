var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;

var field_width=6;
var field_height=6;
var x_step=(w-0)/field_width;
var y_step=(h-0)/field_height;

//Test
var matrix1=newMatrix(3,4);
var matrix2=newMatrix(2,1);
var field=newField();
var player_onturn=0;
var player_color=["Blau","Rot"];
var computer_player=1;
var computer_strength=2;
var computer_game=true;

var game_running=false;
var block_input=false;
var game_turn=0;

var switchTipps=0;
var switchStart=0;

function start(){
    (document.getElementById("myCanvas")).addEventListener("mousedown", onClickHandler, false);
    startGame();
}
function startGame(){
    field=newField();
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "black";
    var i=0;
    ctx.beginPath();
    for(i=0;i<field_height+1;i++){
        ctx.moveTo(0, 0+i*y_step);
        ctx.lineTo(w, 0+i*y_step);
    }
    for(i=0;i<field_width+1;i++){
        ctx.moveTo(0+i*x_step, 0);
        ctx.lineTo(0+i*x_step, h);
    }
    ctx.stroke();
    game_running=true;
    game_turn=0;
}
function onClickHandler(e){
    var obj = document.getElementById("myCanvas");
    var obj_left = 0;
    var obj_top = 0;
    var xpos=0;
    var ypos=0;
    while (obj.offsetParent)
    {
        obj_left += obj.offsetLeft;
        obj_top += obj.offsetTop;
        obj = obj.offsetParent;
    }
    if (e)
    {
        //FireFox
        xpos = e.pageX;
        ypos = e.pageY;
    }
    else
    {
        //IE
        xpos = window.event.x + document.body.scrollLeft - 2;
        ypos = window.event.y + document.body.scrollTop - 2;
    }
    xpos -= obj_left;
    ypos -= obj_top;
    //var x=e.screenX;
    //var y=e.screenY;
    if(game_running&&!block_input){
        var index=parseInt(xpos/x_step);
        if(field.checkDraw()){
            (document.getElementById("theturn")).innerHTML="Unentschieden";
            window.alert("Unentschieden");
            game_running=false;
        }else{
            if(field.drawChip(index,player_onturn+1)){
                //(document.getElementById("jsframe1")).style.zIndex="2";
                if(field.drawWin(player_onturn+1)){
                    game_running=false;
                    (document.getElementById("theturn")).innerHTML=player_color[player_onturn] +" gewinnt!!!";
                    window.alert(player_color[player_onturn] +" gewinnt!!!");
                    //document.getElementById("console").innerHTML = "die Ausgabe ist krass:  "+"<br>"+field.print()+"<br>";//+matrix2.print();
                }else{
                    if(computer_game){
                        (document.getElementById("theturn")).innerHTML=player_color[computer_player] +" zieht";
                        game_turn+=1;
                        //window.alert("guter Zug");
                        block_input=true;
                        setTimeout(function(){ block_input=false; }, 10);
                        var move=makeDecision(computer_player);
                        //document.getElementById("console2").innerHTML = "Move:  "+move+"   Turn:  "+game_turn;//+matrix2.print();
                        field.drawChip(move,computer_player+1);
                        if(field.drawWin(computer_player+1)){
                            game_running=false;
                            (document.getElementById("theturn")).innerHTML=player_color[computer_player] +" gewinnt!!!";
                            window.alert(player_color[computer_player] +" gewinnt!!!");
                            //document.getElementById("console").innerHTML = "die Ausgabe ist krass:  "+"<br>"+field.print()+"<br>";//+matrix2.print();
                        }else{
                            (document.getElementById("theturn")).innerHTML=player_color[player_onturn] +" zieht";
                        }
                        if(switchTipps>1){
                            var options=showOptions(player_onturn);
                            document.getElementById("tipp1").innerHTML =player_color[player_onturn]+":  "+ options;
                        }
                    }else{
                        player_onturn=(player_onturn+1)%2;
                        (document.getElementById("theturn")).innerHTML=player_color[player_onturn] +" zieht";
                        if(switchTipps>0){
                            block_input=true;
                            setTimeout(function(){ block_input=false; }, 10);
                            var options=showOptions(player_onturn);
                            document.getElementById("tipp"+(player_onturn+1)).innerHTML =player_color[player_onturn]+":  "+ options;
                        }
                    }
                }
                //(document.getElementById("jsframe1")).style.zIndex="-1";
            }
        }    
        
    }
    
    //ctx.fillStyle = "black";
    //ctx.fillRect(xpos-25, ypos-25, 50, 50);
}
function button2(){
    /*field.drawChip(3,2);
    field.drawChip(3,2);
    field.drawChip(3,2);
    field.drawChip(3,2);
    document.getElementById("console").innerHTML = "die Ausgabe ist krass:  "+field.checkWin(2);+"<br>"+field.print()+"<br>"+matrix2.print();*/
    computer_game=false;
    document.getElementById("blueVsRed").innerHTML = "Blau vs. Rot";
    if(switchStart>1){
        player_onturn=parseInt((Math.random()*2));
        
    }else{
        player_onturn=switchStart;
    }
    startGame();
    (document.getElementById("theturn")).innerHTML=player_color[player_onturn]+" beginnt";
}
function button1(){
    computer_game=true;
    document.getElementById("blueVsRed").innerHTML = "Blau vs. Rot(Computer)";
    player_onturn=0;
    startGame();
    var starter=0;
    if(switchStart>1){
        starter=parseInt((Math.random()*2));
    }else{
        starter=switchStart;
    }
    (document.getElementById("theturn")).innerHTML=player_color[starter]+" beginnt";
    if(starter==1){
        game_turn+=1;
        var move=parseInt((Math.random()*field_width));
        field.drawChip(move,computer_player+1);
        (document.getElementById("theturn")).innerHTML=player_color[0] +" zieht";
    }
}
function restartGame(){
    if(computer_game){
        button1();
    }else{
        button2();
    }
}
function tippsChange(){
    switchTipps=(switchTipps+1)%3;
    (document.getElementById("tipp1")).innerHTML="-";
    (document.getElementById("tipp2")).innerHTML="-";
    switch(switchTipps){
        case 0:
        (document.getElementById("tipps")).innerHTML="keine";
        break;
        case 1:
        (document.getElementById("tipps")).innerHTML="mode 1";
        break;
        case 2:
        (document.getElementById("tipps")).innerHTML="mode 2";
        break;
    }
}
function levelUp(){
    if(computer_strength<3){
        computer_strength+=1;
        switch(computer_strength){
        case 1:
        (document.getElementById("cpLevel")).innerHTML="Low";
        break;
        case 2:
        (document.getElementById("cpLevel")).innerHTML="Medium";
        break;
        case 3:
        (document.getElementById("cpLevel")).innerHTML="Hard";
        break;
        }
    }
}
function levelDown(){
    if(computer_strength>1){
        computer_strength-=1;
        switch(computer_strength){
        case 1:
        (document.getElementById("cpLevel")).innerHTML="Low";
        break;
        case 2:
        (document.getElementById("cpLevel")).innerHTML="Medium";
        break;
        case 3:
        (document.getElementById("cpLevel")).innerHTML="Hard";
        break;
        }
    }
}
function startChange(){
    switchStart=(switchStart+1)%3;
    switch(switchStart){
        case 0:
        (document.getElementById("startColor")).innerHTML=player_color[0];
        break;
        case 1:
        (document.getElementById("startColor")).innerHTML=player_color[1];
        break;
        case 2:
        (document.getElementById("startColor")).innerHTML="Zufall";
        break;
        }
}
function newMatrix(m,n){
    var result={
        row: m,
        col: n,
        entries: [],
        entry: function(i,j){
            return this.entries[i*this.col+j];
        },
        setEntry: function(i,j,value){
            this.entries[i*this.col+j]=value;
        },
        print: function(){
            var text="";
            var i=0;
            var    j=0;
            for(i=0;i<this.row;i++){
                for(j=0;j<this.col;j++){
                    text+=this.entry(i,j)+", ";
                }
                text+="<br>";
            }
            return text;
        }
    }
    var i=0;
    for(i=0;i<m*n;i++){
        result.entries[i]=0;
    }
    return result;
}
function newField(){
    var result={
        matrix: newMatrix(2*field_height,2*field_width),
        entry: function(i,j){
            return this.matrix.entries[i*2*field_width+j];
        },
        print: function(){
            return this.matrix.print();
        },
        checkDraw: function(){
            var i=0;
            for(i=0;i<field_width;i++){
                if(this.matrix.entries[i]==0){
                    return false;
                }
            }
            return true;
        },
        setChip: function(position,player){
            if(position<0||position>=field_width||this.matrix.entry(0,position)!=0){
                return false;
            }else{
                var i=1;
                while(this.matrix.entry(i,position)==0&&i<field_height){
                    i+=1;
                }
                this.matrix.entry(i-1,position,player);
                i=i-1;
                this.matrix.setEntry(i,position,player);
                this.matrix.setEntry(i+field_height,position,player);
                this.matrix.setEntry(field_height-i-1,position+field_width,player);
                this.matrix.setEntry(2*field_height-i-1,position+field_width,player);
                return true;
            }
        },
        drawChip: function(position,player){
            if(position<0||position>=field_width||this.matrix.entry(0,position)!=0){
                return false;
            }else{
                var i=1;
                while(this.matrix.entry(i,position)==0&&i<field_height){
                    i+=1;
                }
                i=i-1;
                this.matrix.setEntry(i,position,player);
                this.matrix.setEntry(i+field_height,position,player);
                this.matrix.setEntry(field_height-i-1,position+field_width,player);
                this.matrix.setEntry(2*field_height-i-1,position+field_width,player);
                ctx.fillStyle = "red";
                if(player==1){ctx.fillStyle = "blue";}
                ctx.fillRect(1+position*x_step,1+(i)*y_step, x_step-2, y_step-2);
                return true;
            }
        },
        checkWin: function(player){
            //Horizontal
            var i=0;
            var j=0;
            var k=0;
            for(i=0;i<field_height;i++){
                j=0;
                k=0;
                while(j<2*field_width){
                    while(j<2*field_width && this.entry(i,j)==player){
                        k+=1;
                        if(k==4){
                            return true;
                        }
                        j+=1;
                    }
                    j+=1;
                    k=0;
                    
                }
            }
            
            //Vertikal
            i=0;
            for(i=0;i<field_width;i++){
                var j=0;
                var k=0;
                while(j<2*field_height){
                    while(j<2*field_height && this.entry(j,i)==player){
                        k+=1;
                        if(k==4){
                            return true;
                        }
                        j+=1;
                    }
                    j+=1;
                    k=0;
                    
                }
            }
            //diagonal oben links nach unten rechts
            i=0;
            for(i=0;i<2*field_width;i++){
                var j=0;
                var k=0;
                while(j<2*field_height && j<2*field_width-i){
                    while(j<2*field_height && j<2*field_width-i && this.entry(j,j+i)==player){
                        k+=1;
                        if(k==4){
                            return true;
                        }
                        j+=1;
                    }
                    j+=1;
                    k=0;
                    
                }
            }
            i=0;
            for(i=0;i<2*field_height;i++){
                var j=0;
                var k=0;
                while(j<2*field_width && j<2*field_height-i){
                    while(j<2*field_width && j<2*field_height-i && this.entry(j+i,j)==player){
                        k+=1;
                        if(k==4){
                            return true;
                        }
                        j+=1;
                    }
                    j+=1;
                    k=0;
                    
                }
            }
            //diagonal oben rechts nach unten links
            i=0;
            for(i=0;i<2*field_width;i++){
                var j=0;
                var k=0;
                while(j<2*field_height && j<2*field_width-i){
                    while(j<2*field_height && j<2*field_width-i && this.entry(j,2*field_width-1-j-i)==player){
                        k+=1;
                        if(k==4){
                            return true;
                        }
                        j+=1;
                    }
                    j+=1;
                    k=0;
                    
                }
            }
            i=0;
            for(i=0;i<2*field_height;i++){
                var j=0;
                var k=0;
                while(j<2*field_width && j<2*field_height-i){
                    while(j<2*field_width && j<2*field_height-i && this.entry(j+i,2*field_width-1-j)==player){
                        k+=1;
                        if(k==4){
                            return true;
                        }
                        j+=1;
                    }
                    j+=1;
                    k=0;
                    
                }
            }
            return false;
        },
        drawWin: function(player){
            //Horizontal
            var i=0;
            var j=0;
            var k=0;
            for(i=0;i<field_height;i++){
                j=0;
                k=0;
                while(j<2*field_width){
                    while(j<2*field_width && this.entry(i,j)==player){
                        k+=1;
                        if(k==4){
                            var s=0;
                            var pos;
                            for(s=0;s<4;s++){
                                pos=getFieldPosition(i,j-s);
                                ctx.fillStyle = "yellow";
                                ctx.fillRect(x_step/4+pos[1]*x_step,y_step/4+pos[0]*y_step, x_step/2, y_step/2);
                            }
                            return true;
                        }
                        j+=1;
                    }
                    j+=1;
                    k=0;
                    
                }
            }
            
            //Vertikal
            i=0;
            for(i=0;i<field_width;i++){
                var j=0;
                var k=0;
                while(j<2*field_height){
                    while(j<2*field_height && this.entry(j,i)==player){
                        k+=1;
                        if(k==4){
                            var s=0;
                            var pos;
                            for(s=0;s<4;s++){
                                pos=getFieldPosition(j-s,i);
                                ctx.fillStyle = "yellow";
                                ctx.fillRect(x_step/4+pos[1]*x_step,y_step/4+pos[0]*y_step, x_step/2, y_step/2);
                            }
                            return true;
                        }
                        j+=1;
                    }
                    j+=1;
                    k=0;
                    
                }
            }
            //diagonal oben links nach unten rechts
            i=0;
            for(i=0;i<2*field_width;i++){
                var j=0;
                var k=0;
                while(j<2*field_height && j<2*field_width-i){
                    while(j<2*field_height && j<2*field_width-i && this.entry(j,j+i)==player){
                        k+=1;
                        if(k==4){
                            var s=0;
                            var pos;
                            for(s=0;s<4;s++){
                                pos=getFieldPosition(j-s,j+i-s);
                                ctx.fillStyle = "yellow";
                                ctx.fillRect(x_step/4+pos[1]*x_step,y_step/4+pos[0]*y_step, x_step/2, y_step/2);
                            }
                            return true;
                        }
                        j+=1;
                    }
                    j+=1;
                    k=0;
                    
                }
            }
            i=0;
            for(i=0;i<2*field_height;i++){
                var j=0;
                var k=0;
                while(j<2*field_width && j<2*field_height-i){
                    while(j<2*field_width && j<2*field_height-i && this.entry(j+i,j)==player){
                        k+=1;
                        if(k==4){
                            var s=0;
                            var pos;
                            for(s=0;s<4;s++){
                                pos=getFieldPosition(j+i-s,j-s);
                                ctx.fillStyle = "yellow";
                                ctx.fillRect(x_step/4+pos[1]*x_step,y_step/4+pos[0]*y_step, x_step/2, y_step/2);
                            }
                            return true;
                        }
                        j+=1;
                    }
                    j+=1;
                    k=0;
                    
                }
            }
            //diagonal oben rechts nach unten links
            i=0;
            for(i=0;i<2*field_width;i++){
                var j=0;
                var k=0;
                while(j<2*field_height && j<2*field_width-i){
                    while(j<2*field_height && j<2*field_width-i && this.entry(j,2*field_width-1-j-i)==player){
                        k+=1;
                        if(k==4){
                            var s=0;
                            var pos;
                            for(s=0;s<4;s++){
                                pos=getFieldPosition(j-s,2*field_width-1-j-i+s);
                                ctx.fillStyle = "yellow";
                                ctx.fillRect(x_step/4+pos[1]*x_step,y_step/4+pos[0]*y_step, x_step/2, y_step/2);
                            }
                            return true;
                        }
                        j+=1;
                    }
                    j+=1;
                    k=0;
                    
                }
            }
            i=0;
            for(i=0;i<2*field_height;i++){
                var j=0;
                var k=0;
                while(j<2*field_width && j<2*field_height-i){
                    while(j<2*field_width && j<2*field_height-i && this.entry(j+i,2*field_width-1-j)==player){
                        k+=1;
                        if(k==4){
                            var s=0;
                            var pos;
                            for(s=0;s<4;s++){
                                pos=getFieldPosition(j+i-s,2*field_width-1-j+s);
                                ctx.fillStyle = "yellow";
                                ctx.fillRect(x_step/4+pos[1]*x_step,y_step/4+pos[0]*y_step, x_step/2, y_step/2);
                            }
                            return true;
                        }
                        j+=1;
                    }
                    j+=1;
                    k=0;
                    
                }
            }
            return false;
        }
    }
    return result;
}
function copyField(field){
    var result=newField();
    var i=0;
    for(i=0;i<field_height*field_width*4;i++){
        result.matrix.entries[i]=field.matrix.entries[i];
    }
    return result;
}
function getFieldPosition(i,j){
    var result=[i,j];
    if(i>=field_height){
        result[0]=i-field_height;
    }
    if(j>=field_width){
        result[1]=j-field_width;
        result[0]=field_height-result[0]-1;
    }
    return result;
}

//Computer Gegner

function makeDecision(player){
    var conField=copyField(field);
    var tree=newTreeElt();
    tree.elt=conField;
    buildTree(tree,computer_strength,player);
    var values=[0,0];
    var i=0;
    for(i=0;i<field_width;i++){
        values[i]=getValue(tree.children[i],player);
    }
    i=0;
    var curr_position=0;
    var curr_value=values[0];
    var start=parseInt((field_width*Math.random()));
    for(i=0;i<field_width;i++){
        if(tree.children[(i+start)%field_width].hasTurn){
            curr_value=values[(i+start)%field_width];
            curr_position=(i+start)%field_width;
        }
    }
    i=0;
    start=parseInt((field_width*Math.random()));
    for(i=0;i<field_width;i++){
        if(values[(i+start)%field_width]>curr_value&&tree.children[(i+start)%field_width].hasTurn){
            curr_value=values[(i+start)%field_width];
            curr_position=(i+start)%field_width;
        }
    }
    //document.getElementById("console").innerHTML =player_color[player]+" (computer):  "+ values+"    Turn:  "+game_turn;
    if(switchTipps>0){document.getElementById("tipp2").innerHTML =player_color[player]+":  "+ values+" (computer)";}
    return curr_position;

}
function showOptions(player){
    var conField=copyField(field);
    var tree=newTreeElt();
    tree.elt=conField;
    buildTree(tree,computer_strength,player);
    var values=[0,0];
    var i=0;
    for(i=0;i<field_width;i++){
        values[i]=getValue(tree.children[i],player);
    }
    //document.getElementById("console2").innerHTML =player_color[player]+":  "+ values;
    return values;
}


function getValue(tree,player){
    if(tree.hasChild){
        if(tree.player==(player+1)%2+1){
            var child_value=0;
            var top_value=0;
            var i=0;
            while(i<tree.children.length&&(!tree.children[i].hasTurn)){
                i+=1;
            }
            if(i==tree.children.length){
                return 0;
            }else{
                top_value=getValue(tree.children[i],player);
                i=0;
                for(i=0;i<tree.children.length;i++){
                    if(tree.children[i].hasTurn){
                        child_value=getValue(tree.children[i],player);
                        if(child_value>top_value){
                            top_value=child_value;
                        }
                    }
                
                }
                return top_value;
                
            }
        }else{
            var child_value=0;
            var top_value=0;
            var i=0;
            while(i<tree.children.length&&(!tree.children[i].hasTurn)){
                i+=1;
            }
            if(i==tree.children.length){
                return 0;
            }else{
                top_value=getValue(tree.children[i],player);
                i=0;
                for(i=0;i<tree.children.length;i++){
                    if(tree.children[i].hasTurn){
                        child_value=getValue(tree.children[i],player);
                        if(child_value<top_value){
                            top_value=child_value;
                        }
                    }
                
                }
                return top_value;
            }
        }
    }else{
        //document.getElementById("console2").innerHTML = "TreeValue:"+tree.value;//+matrix2.print();
        return tree.value;
    }
}

/*function getValue(tree){
    if(tree.hasChild){
        var i=0;
        var curr_value=0;
        var min_value=0;
        var child_value=0;
        var hasLoose=true;
        if(tree.player==computer_player+1){
            for(i=0;i<tree.children.length;i++){
                if(tree.children[i].hasTurn){
                    child_value=getValue(tree.children[i]);
                    if(child_value>=0){
                        if(child_value>curr_value){curr_value=child_value;}
                        hasLoose=false;
                    }else{
                        if(child_value<min_value){min_value=child_value;}
                    }
                }
                
            }
            if(hasLoose){
                return (min_value-1);
            }else{
                return (curr_value+1);
            }
        }else{
            hasLoose=false;
            for(i=0;i<tree.children.length;i++){
                if(tree.children[i].hasTurn){
                    child_value=getValue(tree.children[i]);
                    if(child_value<0){
                        hasLoose=true;
                        if(child_value<min_value){min_value=child_value;}
                    }else{
                        if(child_value>curr_value){curr_value=child_value;}
                    }
                }
                
            }
            if(hasLoose){
                return (min_value-1);
            }else{
                return (curr_value+1);
            }
            
        }
        
    }else{
        return tree.value;
    }
}*/
function buildTree(startField,deepness,player){
    if(deepness>0){
        var i=0;
        for(i=0;i<field_width;i++){
            var result=copyField(startField.elt);
            var resultTree=newTreeElt();
            resultTree.player=player+1;
            if(result.setChip(i,player+1)){
                resultTree.elt=result;
                if(result.checkWin(player+1)){
                    resultTree.value=computer_strength-deepness+1;
                }else{
                    var j=0;
                    for(j=0;j<field_width;j++){
                        var result2=copyField(resultTree.elt);
                        var resultTree2=newTreeElt();
                        resultTree2.player=(player+1)%2+1;
                        if(result2.setChip(j,(player+1)%2+1)){
                            resultTree2.elt=result2;
                            if(result2.checkWin((player+1)%2+1)){
                                resultTree2.value=-deepness-1;
                            }else{
                                buildTree(resultTree2,deepness-1,player);
                            }
                        }else{
                            resultTree2.value=0;
                            resultTree2.hasTurn=false;
                            resultTree2.elt=result2;
                        }
                        resultTree.addTree(resultTree2);
                        
                    }
                }
            }else{
                resultTree.value=0;
                resultTree.hasTurn=false;
                resultTree.elt=result;
            }
            startField.addTree(resultTree);
        }    
    }
}

function newTreeElt(){
    var result={
        elt: newField(),
        value: 0,
        parent: newField(),
        children: [newField()],
        hasParent: false,
        hasChild: false,
        numberChild: 0,
        player: 0,
        hasTurn: true,
        addTree: function(tree){
            this.hasChild=true;
            tree.hasParent=true;
            this.children[this.numberChild]=tree;
            this.numberChild+=1;
            tree.parent=this;
        }
    }
    return result;
}
 