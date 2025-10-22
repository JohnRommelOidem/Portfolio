import * as gl2Utils from "./webGlUtils.js"

let aliveColor = [1,1,0.7];
let deadColor = [0.1,0.1,0.1];
const texValue = 0;
const canvas = document.getElementById("gol-canvas");
const fps = 30;
const frameDuration = 1000/fps;
canvas.width  = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const [width, height] = [canvas.clientWidth, canvas.clientHeight];
const texSize = [width, height];
const renderUniforms = {
    u_texture:{type:"1i",value:texValue},
    u_texSize:{type:"2f",value:texSize},
    u_aliveColor:{type:"3f",value:aliveColor},
    u_deadColor:{type:"3f",value:deadColor}
}

const simulUniforms = {
    u_texture:{type:"1i",value:texValue},
    u_texSize:{type:"2f",value:texSize}
}


canvas.style.backgroundColor = rgbToHex(...deadColor);

const data = new Uint8Array(width*height);
for (let y=0;y<height;y++){
    for (let x=0;x<width;x++){
        const i = (y*width+x);
        const value = Math.random()>0.3?255:0;
        data[i] = value;
    }
}

function createFrameBuffer(gl, width, height, data){
    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.R8,
        width,
        height,
        0,
        gl.RED,
        gl.UNSIGNED_BYTE,
        data
    )
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(
        gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0
    );
    return {fb, tex};
}

function getUniformLocations(gl, uniforms, program){
    for (const [name, uniform] of Object.entries(uniforms)){
        if (name.startsWith("u_")){
            uniform.location = gl.getUniformLocation(program, name);
        }
    }
}

function uploadUniforms(gl, uniforms){
    for (const[_, {location, type, value}] of Object.entries(uniforms)){
            switch (type){
                case "1f": gl.uniform1f(location, value); break;
                case "2f": gl.uniform2f(location, ...value); break;
                case "3f": gl.uniform3f(location, ...value); break;
                case "1i": gl.uniform1i(location, value); break;
            }
        }
}

function initGl(canvas, vertexShaderSource, renderShaderSource, simulShaderSource){
    const gl = canvas.getContext("webgl2");
    const vertexShader = gl2Utils.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const renderShader = gl2Utils.createShader(gl, gl.FRAGMENT_SHADER, renderShaderSource);
    const simulShader = gl2Utils.createShader(gl, gl.FRAGMENT_SHADER, simulShaderSource);

    const renderProgram = gl2Utils.createProgram(gl, vertexShader, renderShader);
    const simulProgram = gl2Utils.createProgram(gl, vertexShader, simulShader);

    const positionAttribLocation = gl.getAttribLocation(renderProgram, "a_position");

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    gl2Utils.setGeometry(gl);

    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttribLocation);

    gl.vertexAttribPointer(
        positionAttribLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );
    
    getUniformLocations(gl, simulUniforms, simulProgram);
    getUniformLocations(gl, renderUniforms, renderProgram);

    const fbCurrent = createFrameBuffer(gl, width, height, data)
    const fbNext = createFrameBuffer(gl, width, height, null)
    let read = fbCurrent;
    let write = fbNext;
    function step(){
        gl.useProgram(simulProgram);
        gl.bindFramebuffer(gl.FRAMEBUFFER, write.fb);
        gl.viewport(0, 0, width, height);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, read.tex);
        uploadUniforms(gl, simulUniforms);
        gl.bindVertexArray(vao);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        [read,write]=[write,read];
    }
    function renderToCanvas() {
        gl.useProgram(renderProgram);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, read.tex);

        uploadUniforms(gl, renderUniforms);

        gl.bindVertexArray(vao);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    let lastStepTime = 0;

    function animate(now){
        if (now-lastStepTime>=frameDuration){
            step();
            lastStepTime = now;
        }
        renderToCanvas();
        requestAnimationFrame(animate);
    }
    animate();
}

function rgbToHex(r,g,b){
    function toHex(c){
        return Math.round(c*255).toString(16).padStart(2,'0').toUpperCase();
    }
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

initGl(
    canvas,
    await gl2Utils.loadShader("./shaders/vertexShader.glsl"),
    await gl2Utils.loadShader("./shaders/renderShader.glsl"),
    await gl2Utils.loadShader("./shaders/simulShader.glsl")
);