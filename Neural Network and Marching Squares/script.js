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

class jn{

    static random(a,b){
        return a + Math.random()*(b-a);
    }
    
    static randint(a,b){
        return a+Math.floor(Math.random()*(b-a));
    }
    
    static randomize(arr){
        let newarr = [];
        let m = arr.length;
        for(let i=0; i<m; i++){
            let s = jn.randint(0,arr.length);
            newarr.push(arr.splice(s,1)[0]);
        }
        return newarr;
    }

    static dot(lst1, lst2){
        let s=0;
        for(let i=0; i<lst1.length; i++){
            s+=lst1[i] * lst2[i]
        }
        return s
    }

    static operator(A, b){ //matrix A times vector b
        let C = [];
        for(let r=0; r<A.length; r++){
            C.push(jn.dot(A[r], b));
        }
        return C
    }

    static areEqual(a,b){
        if(a.length!=b.length){
            return false;
        }
        for(let i=0; i<a.length; i++){
            if(a[i]!=b[i]){
                return false;
            }
        }
        return true;
    }

    static randArr(n){
        let lst = [];
        for(let i=0; i<n; i++){
            lst.push(jn.random(-1, 1));
        }
        return lst;
    }

    static roundArr(arr){
        let newArr = [];
        for(let i=0; i<arr.length; i++){
            newArr.push(Math.round(arr[i]));
        }
        return newArr;
    }

    static sigmoid(z){
        //return 1/(1+Math.exp(-z));
        return Math.atan(z)/Math.PI+1/2;
    }

    static lstSigmoid(lst){
        var nlist = [];
        for(let i=0; i<lst.length; i++){
            nlist.push(jn.sigmoid(lst[i]));
        }
        return nlist;
    }

    //POLYGONS

    static generateConvex(N, bound){
        let X = [];
        let Y = [];
        for(let i=0; i<N; i++){
            X[i] = jn.randint(0,bound);
            Y[i] = jn.randint(0,bound);
        }
        X.sort((a,b)=>{
            return a-b;
        })
        Y.sort((a,b)=>{
            return a-b;
        })
        let xmin = X[0];
        let xmax = X[X.length-1];
        let ymin = Y[0];
        let ymax = Y[Y.length-1];
        let xGroups = [[xmin],[xmin]];
        let yGroups = [[ymin], [ymin]];
        for(let i=1; i<N-1; i++){
            let s1 = jn.randint(0,2);
            let s2 = jn.randint(0,2);
            if(s1){
                xGroups[0].push(X[i])
            }
            else{
                xGroups[1].push(X[i]);
            }
            if(s2){
                yGroups[0].push(Y[i])
            }
            else{
                yGroups[1].push(Y[i]);
            }
        }
        xGroups[0].push(xmax);
        xGroups[1].push(xmax);
        yGroups[0].push(ymax);
        yGroups[1].push(ymax);

        let xVec = [];
        let yVec = [];
        for(let i=0; i<xGroups[0].length-1; i++){
            xVec.push(xGroups[0][i+1]-xGroups[0][i]);
        }
        for(let i=0; i<xGroups[1].length-1; i++){
            xVec.push(xGroups[1][i]-xGroups[1][i+1]);
        }
        for(let i=0; i<yGroups[0].length-1; i++){
            yVec.push(yGroups[0][i+1]-yGroups[0][i]);
        }
        for(let i=0; i<yGroups[1].length-1; i++){
            yVec.push(yGroups[1][i]-yGroups[1][i+1]);
        }

        yVec = jn.randomize(yVec);
        
        let Vectors = [];
        for(let i=0; i<xVec.length; i++){
            Vectors.push(new vec2d(xVec[i], yVec[i]));
        }
        
        Vectors.sort((a,b)=>{
            let anga = Math.atan2(a.x1, a.x0);
            let angb = Math.atan2(b.x1, b.x0);
            if(anga<0){
                anga+=2*Math.PI;
            }
            if(angb<0){
                angb+=2*Math.PI;
            }
            return anga-angb;
        })

        let verts = [Vectors[0].add(new vec2d(xmax,ymax))];
        for(let i=1; i<Vectors.length; i++){
            verts.push(verts[i-1].add(Vectors[i]));
        }

        return new polygon(verts);
    }

    static createRect(x,y,width,height){
        return new polygon([new vec2d(x-width/2, y-height/2), new vec2d(x-width/2, y+height/2), new vec2d(x+width/2, y-height/2),
            new vec2d(x+width/2, y+height/2)]);
    }

    static SAT(poly1, poly2){
        for(let i=0; i<poly1.vertices.length; i++){
            let axis = poly1.edge(i).normal();
            let p1 = poly1.project(axis);
            let p2 = poly2.project(axis);
            if(p1[0]>p2[1] || p2[0]>p1[1]){
                return false;
            }
        }
        for(let i=0; i<poly2.vertices.length; i++){
            let axis = poly2.edge(i).normal();
            let p1 = poly1.project(axis);
            let p2 = poly2.project(axis);
            if(p1[0]>p2[1] || p2[0]>p1[1]){
                return false;
            }
        }
        return true;
    }
}

class Neural_Network{

    constructor(system, data, target, niter = 1000, alpha = 1, thetas = null){
        this.system = system;
        this.data = data;
        this.target = target;
        this.niter = niter;
        this.alpha = alpha;
        this.thetas = thetas;
    }

    generateThetas(){
        if(!thetas){
            var thetas = [];
            for(let layer=1; layer<this.system.length; layer++){
                thetas.push([]);
                for(let neuron=0; neuron<this.system[layer]; neuron++){
                    thetas[thetas.length-1].push(jn.randArr(this.system[layer-1]+1));
                }
            }
            this.thetas = thetas;
        }
    }

    forwardProp(x0){
        let t = [];
        for(let i=0; i<x0.length; i++){
            t.push(x0[i]);
        }
        t.splice(0,0,1);
        var values = [t];
        for(let layer=1; layer<this.system.length; layer++){
            let temp = jn.lstSigmoid(jn.operator(this.thetas[layer-1], values[layer-1]));
            temp.splice(0,0,1);
            values.push(temp);
        }
        return values
    }

    backProp(){
        for(let point=0; point<this.data.length; point++){ //for each data point
            let values = this.forwardProp(this.data[point]); //calculate all of the values
            let deltas = [[]]; //first (last) layer of deltas
            for(let i=1; i<values[values.length-1].length; i++){ //ignore bias which is the first element
                deltas[0].push(-2*(this.target[point][i-1]-values[values.length-1][i])*values[values.length-1][i]*(1-values[values.length-1][i])) //definition of deltas
                for(let j=0; j<values[values.length-2].length; j++){
                    this.thetas[this.thetas.length-1][i-1][j]-=this.alpha * deltas[0][deltas[0].length-1]*values[values.length-2][j] //gradient descent
                }
            }

            for(let layer=values.length-2; layer>0; layer--){ //dont include first layer because we already calculated it, dont include last because its the input layer
                deltas.push([]);
                for(let i=1; i<values[layer].length; i++){ //ignore bias, doesnt matter for backwards propagation
                    let s = 0; //calulate dot product by hand because numpy can go suck a fucking lollipop. this is the dot product/sum in definition for deltas
                    for(let k=1; k<values[layer+1].length; k++){ //once again, fuck the bias
                        s+=deltas[deltas.length-2][k-1] * this.thetas[layer][k-1][i] //deltas doesnt include a bias (starts from index 1), so we k-1 instead of k. additionaly, thetas array is made so thetas[layer]
                    } //are the thetas for the next layer, none go to bias, 2d arr which is practically a single dim array so we take 0 coord, ith neuron is what we are looking for
                    deltas[deltas.length-1].push(s*values[layer][i]*(1-values[layer][i])); 
                    for(let j=0; j<values[layer-1].length; j++){//adjust all of the thetas
                        this.thetas[layer-1][i-1][j] -= this.alpha * deltas[deltas.length-1][deltas[deltas.length-1].length-1]*values[layer-1][j]; //read
                    }
                }
            }
        }
    }

    solve(){
        this.generateThetas();
        for(let run=0; run<this.niter; run++){
            this.backProp();
        }        
    }
    

    evaluate(){
        let count = 0;
        for(let i=0; i<this.data.length; i++){
            if (jn.areEqual(jn.roundArr(this.predict(this.data[i])), this.target[i])){
                count++;
            }
        }
        return {"count": count, "successRate": count/this.data.length}
    }

    predict(x0){
        let temp = this.forwardProp(x0)
        temp = temp[temp.length-1];
        temp.splice(0,1);
        return temp;
    }
}

var network = new Neural_Network([2, 100, 50, 50, 2], [], [], 0, 0, thetas)

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

function f(x, y){
    return network.predict([x,y])[0];
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;
ctx.translate(canvas.width/2, canvas.height/2);
ctx.scale(1,-1);

const unit = 100; //how many pixels is a unit

const gr = new grid(f, 0.5, canvas.width/10, 10); //function, contour, how many squares, how big are squares

gr.drawShape();

//draw data
let s = 5;
for(let point in data){
    ctx.beginPath();
    ctx.arc(data[point][0]*unit, data[point][1]*unit, s, 0, 2*Math.PI);
    ctx.fillStyle = 'rgb(0,' + (target[point][0]*255).toString() + ',0)';
    ctx.fill();
}

//console.log(network.predict([1,2]))