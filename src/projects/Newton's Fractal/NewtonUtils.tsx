export function getTransMatrix(canvas:HTMLCanvasElement|SVGSVGElement, transform: {k: number, x: number, y: number} = {k:1, x:0, y:0}):number[]{
    const {k, x, y} = transform;
    const minDimension = Math.min(canvas.clientWidth, canvas.clientHeight);
    return [
        1/(k*minDimension), 0, 0,
        0, 1/(k*minDimension), 0,
        (-x-k*canvas.clientWidth/2)/(k*minDimension), (y-canvas.clientHeight+k*canvas.clientHeight/2)/(k*minDimension), 1
    ]
}

export function getDomain(svg:SVGSVGElement, transformMatrix:number[], scale:number, translate:[number, number]){
    return [
        [
            scale*(transformMatrix[6])-translate[0],
            scale*(svg.clientWidth*transformMatrix[0] + transformMatrix[6])-translate[0]
        ],[
            scale*(transformMatrix[7])-translate[1],
            scale*(svg.clientHeight*transformMatrix[4]+transformMatrix[7])-translate[1]
        ]
    ]
}


const PI = Math.PI;

export function circleComplex(numRoots:number, angle:number){
    return [Math.cos(2*PI*angle/numRoots), Math.sin(2*PI*angle/numRoots)];
}
