class cube{
    static lookup = [[[[], []]], [[[0,1/2], [1/2,0]]], [[[1/2,0], [1,1/2]]], [[[0,1/2], [1,1/2]]], [[[1/2,1], [1,1/2]]], 
                    [[[1/2,0], [1,1/2]], [[0,1/2], [1/2,1]]] ,[[[1/2,0], [1/2,1]]] ,[[[0,1/2], [1/2,1]]], [[[0,1/2], [1/2,1]]],
                    [[[1/2,0], [1/2,1]]], [[[0,1/2], [1/2,0]], [[1/2,1], [1,1/2]]], [[[1/2,1], [1,1/2]]], 
                    [[[0,1/2], [1,1/2]]], [[[1/2,0], [1,1/2]]], [[[0,1/2], [1/2,0]]], [[[], []]]];
    constructor(x, y, width, f, contour){
        this.f = f;
        this.contour = contour;
        this.mode = '0000';
        this.x = x;
        this.y = y;
        this.width = width;
    }

    classify(){
        let s = 0;
        if(this.f(this.x/unit, this.y/unit) <= this.contour){
            s++;
        }
        if(this.f((this.x+this.width)/unit, this.y/unit) <= this.contour){
            s+=2;
        }
        if(this.f((this.x+this.width)/unit, (this.y+this.width)/unit) <= this.contour){
            s+=4;
        }
        if(this.f(this.x/unit, (this.y+this.width)/unit) <= this.contour){
            s+=8;
        }

        this.mode = s;
    }

    drawShape(){
        let drawData = cube.lookup[this.mode];
        // for(let pair=0; pair<drawData.length; pair++){
        //     ctx.strokeStyle = "purple";
        //     ctx.beginPath();
        //     ctx.moveTo(this.x + drawData[pair][0][0] * this.width, this.y + drawData[pair][0][1] * this.width);
        //     ctx.lineTo(this.x + drawData[pair][1][0] * this.width, this.y + drawData[pair][1][1] * this.width);
        //     ctx.stroke();
        // }
        for(let pair=0; pair<drawData.length; pair++){
            ctx.strokeStyle = "purple";
            let axis1 = dumbIndic(drawData[pair][0][0]);
            let axis2 = dumbIndic(drawData[pair][1][0]);

            let x1 = axis1 * (this.x + drawData[pair][0][0]*this.width) +
                unit*(1-axis1) * (reverseLerp((x)=>{return this.f(x/unit, (this.y+(drawData[pair][0][1])*this.width)/unit)},
                this.x+this.width, this.x, this.contour));
            let y1 = (1-axis1) * (this.y + drawData[pair][0][1]*this.width) +
                unit * axis1 * (reverseLerp((y)=>{return this.f((this.x+(drawData[pair][0][0]*this.width))/unit, y/unit)},
                this.y+this.width, this.y, this.contour));

            let x2 = axis2 * (this.x + drawData[pair][1][0]*this.width) +
                unit * (1-axis2) * (reverseLerp((x)=>{return this.f(x/unit, (this.y+(drawData[pair][1][1])*this.width)/unit)},
                this.x+this.width, this.x, this.contour));

            let y2 = (1-axis2) * (this.y + drawData[pair][1][1]*this.width) +
                unit * axis2 * (reverseLerp((y)=>{return this.f((this.x+(drawData[pair][1][0]*this.width))/unit, y/unit)},
                this.y+this.width, this.y, this.contour));
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }

    draw(){
        let smol =  1/5;
        let str = this.mode.toString('2').padStart(4, '0');
        ctx.fillStyle = 'rgb(0,' + (256-256*parseInt(str[3])).toString() + ',0)';
        ctx.fillRect(this.x-this.width*smol,this.y-this.width*smol, this.width * 2 * smol, this.width * 2 * smol);
        ctx.fill();
    }
}

class grid{
    constructor(f, contour, res, csl){
        this.f = f;
        this.res = res;
        this.csl = csl;
        this.contour = contour;
        this.offset = (canvas.width/2 % csl);
        let arr = [];
        for(let i=0; i<res; i++){
            arr.push([]);
            for(let j=0; j<res; j++){
                arr[arr.length-1].push(new cube(i*csl - canvas.width/2 + this.offset
                    , j*csl - canvas.width/2 + this.offset, csl, f, contour));
            }
        }
        this.cubes = arr;
    }

    setFunction(g){
        for(let i=0, n=this.cubes.length; i<n; i++){
            for(let j=0, n=this.cubes.length; j<n; j++){
                this.cubes[i][j].f = g;
            }
        }
    }

    initDraw(){
        ctx.strokeStyle = "black";
        for(let r=-canvas.width/2+this.offset; r<canvas.width/2; r+=this.csl){
            ctx.beginPath();
            ctx.moveTo(-canvas.width/2, r);
            ctx.lineTo(canvas.width/2,r);
            ctx.stroke();
        }
        for(let c=-canvas.width/2+this.offset; c<canvas.width/2; c+=this.csl){
            ctx.beginPath();
            ctx.moveTo(c, -canvas.width/2);
            ctx.lineTo(c, canvas.width/2);
            ctx.stroke();
        }

        ctx.strokeStyle = "blue";
        ctx.lineWidth=2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.width/2);
        ctx.lineTo(0, -canvas.width/2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-canvas.width/2, 0);
        ctx.lineTo(canvas.width/2, 0);
        ctx.stroke();
    }

    drawShape(){
        for(let i=0, n=this.cubes.length; i<n; i++){
            for(let j=0, n=this.cubes.length; j<n; j++){
                this.cubes[i][j].classify();
                this.cubes[i][j].drawShape();
            }
        }
    }

    draw(){
        for(let i=0, n=this.cubes.length; i<n; i++){
            for(let j=0, n=this.cubes.length; j<n; j++){
                this.cubes[i][j].classify();
                this.cubes[i][j].drawShape();
                this.cubes[i][j].draw();
            }
        }
    }
}

function reverseLerp(f, b, c, v){
    if(b == c){
        return b/unit;
    }
    else if(f(b) == f(c)){
        return b/unit + (b-c)/2/unit;
    }
    else{
        return b/unit + (b-c)/unit * (v - f(b)) / (f(b) - f(c));
    }
}

function dumbIndic(x){
    if(x==0 || x==1){
        return 1;
    }
    else{
        return 0;
    }
}

function f(x,y){
    //return x*x+y*y;
    //return (x*x + y*y - 1)**3 - x*x*y*y*y;
    return 2.8*x*x*(x*x*(2.5*x*x+y*y-2)+1.2*y**2*(y*(3*y-0.75)-6.0311)+3.09)+0.98*y**2*((y**2-3.01)*y**2+3)-1.005
}

function g(x,y,a,b){
    return 2.8*(x-a)**2*((x-a)**2*(2.5*(x-a)**2+(y-b)**2-2)+1.2*(y-b)**2*((y-b)*(3*(y-b)-0.75)-6.0311)+3.09)+0.98*(y-b)**2*(((y-b)**2-3.01)*(y-b)**2+3)-1.005
}

function elipse(x,y,a,b,c,d){
    return (x-a)**2/c + (y-b)**2/d;
}


function metaballs(x,y,centers, sizes){
    s = 0;
    for(let i=0; i<centers.length; i++){
        s += sizes[i]**2/((x-centers[i][0])**2+(y-centers[i][1])**2);
    }
    return s
}

function hearts(x,y,centers,sizes){
    let s = 0;
    for(let i=0; i<centers.length; i++){
        s += sizes[i]**2/(((x-centers[i][0])**2 + (y-centers[i][1])**2 - 1)**3 - (x-centers[i][0])**2*(y-centers[i][1])**3);
    }
    return s;
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;
ctx.translate(canvas.width/2, canvas.height/2);
ctx.scale(1,-1);

const unit = 100

const gr = new grid(f, 1, canvas.width/10, 10);

var centers = [[0,0],[0.5,0.6],[-1.2,-0.4],[-0.5, 0.8], [-1, -1.5], [1, -1.4]]
var sizes = [0.5,0.7, 0.3, 0.2, 0.3, 0.41];
var dirs = [-0.5, 1.2, 2.7, 5, 5.67, 0.2];
var speed = 1;
var buffer = 0.3;

gr.draw();
let t = 0;
let disp = 0;
setInterval(()=>{
    ctx.clearRect(-canvas.width/2,-canvas.height/2,canvas.width,canvas.height);
    for(let i=0; i<centers.length; i++){
        if(centers[i][0] + Math.cos(dirs[i]) * speed * 1/100 + Math.sign(Math.cos(dirs[i])) * sizes[i] < -canvas.width/2/unit+buffer || 
        centers[i][0] + Math.cos(dirs[i]) * speed * 1/100 + Math.sign(Math.cos(dirs[i])) * sizes[i] > canvas.width/2/unit-buffer){
            dirs[i] = ((-dirs[i]-Math.PI)+2*Math.PI)%(2*Math.PI);
        }
        if(centers[i][1] + Math.sin(dirs[i]) * speed * 1/100 + Math.sign(Math.sin(dirs[i])) * sizes[i] < -canvas.width/2/unit+buffer || 
        centers[i][1] + Math.sin(dirs[i]) * speed * 1/100 + Math.sign(Math.sin(dirs[i])) * sizes[i] > canvas.width/2/unit-buffer){
            dirs[i] = ((-dirs[i])+2*Math.PI)%(2*Math.PI);
        }
        centers[i][0] += 1/100 * speed * Math.cos(dirs[i]);
        centers[i][1] += 1/100 * speed * Math.sin(dirs[i]);
    }


    gr.setFunction((x,y)=>{return metaballs(x,y, centers, sizes)});
    gr.draw();
    //gr.drawShape();
}, 16)