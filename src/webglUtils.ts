interface WebGLResources{
    programs: WebGLProgram[],
    vaos: WebGLVertexArrayObject[],
    vbos: WebGLBuffer[],
    tfs: WebGLTransformFeedback[],
    texs: WebGLTexture[],
    fbos: WebGLFramebuffer[]
}

interface webGLContext{
    gl:WebGL2RenderingContext,
    resource:WebGLResources
}

interface Uniform {
    value: number|number[]|number[][];
    type: 
        "1f"  | "2f"  | "3f"  | "4f" |
        "1fv" | "2fv" | "3fv" | "4fv"|
        "1i"  | "2i"  | "3i"  | "4i" |
        "1iv" | "2iv" | "3iv" | "4iv"|
        "matrix2" | "matrix3" | "matrix4";
}

interface UniformRefObject{
    current:Record<string, Uniform>
}

interface ProgramGroup {
    program: WebGLProgram;
    uniforms: Record<string, WebGLUniformLocation>;
    attributes: Record<string, number>
}

interface FrameBufferGroup {
    fbo: WebGLFramebuffer;
    tex: WebGLTexture;
}

function createUniform(value:Uniform["value"], type:Uniform["type"]):Uniform{
    return {
        value:value,
        type:type
    }
}

function initGLContext(canvas: HTMLCanvasElement){
    const gl = {
        gl:canvas.getContext("webgl2")!,
        resource:{
            programs:[],
            vaos:[],
            vbos:[],
            tfs:[],
            texs:[],
            fbos:[]
        }
    }
    return gl
}

function createShader(gl: WebGL2RenderingContext, type: number, source: string, shaderName: string): WebGLShader {
    var shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        const log = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(`${shaderName} failed to compile.\n ${log}`)
    }
    return shader;
}

async function loadShaders(gl: WebGL2RenderingContext, shaders: Record<string, string>, type: number): Promise<Record<string, WebGLShader>>{
    const loadedShaders = await Promise.all(
        Object.entries(shaders).map(async ([key, src])=>{
            const newKey = key.replace(/Source$/, "")
            const str = await fetch(`./shaders/${src}`).then(r=>r.text());
            return [newKey, createShader(gl, type, str, newKey)]
        })
    )
    return Object.fromEntries(loadedShaders)
}

function createProgram(gl: WebGL2RenderingContext, vertexShader:WebGLShader, fragmentShader:WebGLShader, programName: string): WebGLProgram {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)){
        const log = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error(`${programName} failed to compile.\n ${log}`);
    }
    return program;
}

async function shaderToProgramUniform(glContext: webGLContext, vertexShaderSources: Record<string, string>, fragmentShaderSources: Record<string, string>, uniforms:Record<string, Uniform>={}, attributes:Record<string, number>={}){
    const {gl, resource} = glContext;
    const vertexShaders = await loadShaders(gl, vertexShaderSources, gl.VERTEX_SHADER);
    const fragmentShaders = await loadShaders(gl, fragmentShaderSources, gl.FRAGMENT_SHADER);

    const programObject: Record<string, ProgramGroup> = {};
    for (const [key, fragmentShader] of Object.entries(fragmentShaders)){
        const newKey = key.replace(/Shader$/, "Program");
        const program = createProgram(gl, vertexShaders[key], fragmentShader, newKey);
        const uniformGroup: Record<string, WebGLUniformLocation> = {};
        for (const [uniformKey, _] of Object.entries(uniforms)){
            const location = gl.getUniformLocation(program, uniformKey);
            if (location !== null){
                uniformGroup[uniformKey] = location;
            }
        }
        const attributeGroup: Record<string, number> = {};
        for (const [attribKey, _] of Object.entries(attributes)){
            const location = gl.getAttribLocation(program, attribKey);
            if (location>=0){
                attributeGroup[attribKey] = location;
            }
        }
        resource.programs.push(program)
        programObject[newKey] = {program, uniforms:uniformGroup, attributes:attributeGroup}
    }
    for (const shader of Object.values(vertexShaders)) gl.deleteShader(shader);
    for (const shader of Object.values(fragmentShaders)) gl.deleteShader(shader);
    return programObject;
}

function createTFProgram(gl: WebGL2RenderingContext, vertexShader:WebGLShader, fragmentShader:WebGLShader, programName: string, varyings:string[]): WebGLProgram {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.transformFeedbackVaryings(program, varyings, gl.INTERLEAVED_ATTRIBS)
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)){
        const log = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error(`${programName} failed to compile.\n ${log}`);
    }
    return program;
}

async function shaderToTFProgramUniform(glContext: webGLContext, vertexShaderSources: Record<string, string>, fragmentShaderSources: Record<string, string>, varyings:string[], attributes:Record<string, number>={}, uniforms:Record<string, Uniform>={}){
    const {gl, resource} = glContext;
    const vertexShaders = await loadShaders(gl, vertexShaderSources, gl.VERTEX_SHADER);
    const fragmentShaders = await loadShaders(gl, fragmentShaderSources, gl.FRAGMENT_SHADER);
    const programObject: Record<string, ProgramGroup> = {};
    for (const [key, fragmentShader] of Object.entries(fragmentShaders)){
        const newKey = key.replace(/Shader$/, "Program");
        const program = createTFProgram(gl, vertexShaders[key], fragmentShader, newKey, varyings);
        const uniformGroup: Record<string, WebGLUniformLocation> = {};
        for (const [uniformKey, _] of Object.entries(uniforms)){
            const location = gl.getUniformLocation(program, uniformKey);
            if (location !== null){
                uniformGroup[uniformKey] = location;
            }
        }
        const attributeGroup: Record<string, number> = {};
        for (const [attribKey, _] of Object.entries(attributes)){
            const location = gl.getAttribLocation(program, attribKey);
            if (location>=0){
                attributeGroup[attribKey] = location;
            }
        }
        resource.programs.push(program)
        programObject[newKey] = {program, uniforms:uniformGroup, attributes:attributeGroup}
    }
    for (const shader of Object.values(vertexShaders)) gl.deleteShader(shader);
    for (const shader of Object.values(fragmentShaders)) gl.deleteShader(shader);
    return programObject;
}

function uploadUniforms(gl: WebGL2RenderingContext, program: ProgramGroup, uniforms: Record<string, Uniform>){
    for (const [key, location] of Object.entries(program.uniforms)){
            const {type, value} = uniforms[key];
            switch (type){
                case "1f": gl.uniform1f(location, value as number); break;
                case "2f": gl.uniform2f(location, ...(value as [number, number])); break;
                case "3f": gl.uniform3f(location, ...(value as [number, number, number])); break;
                case "4f": gl.uniform4f(location, ...(value as [number, number, number, number])); break;

                case "1fv": gl.uniform1fv(location, (value as number[][]).flat()); break;
                case "2fv": gl.uniform2fv(location, (value as number[][]).flat()); break;
                case "3fv": gl.uniform3fv(location, (value as number[][]).flat()); break;
                case "4fv": gl.uniform4fv(location, (value as number[][]).flat()); break;

                case "1i": gl.uniform1i(location, value as number); break;
                case "2i": gl.uniform2i(location, ...(value as [number, number])); break;
                case "3i": gl.uniform3i(location, ...(value as [number, number, number])); break;
                case "4i": gl.uniform4i(location, ...(value as [number, number, number, number])); break;

                case "1iv": gl.uniform1iv(location, (value as number[][]).flat()); break;
                case "2iv": gl.uniform2iv(location, (value as number[][]).flat()); break;
                case "3iv": gl.uniform3iv(location, (value as number[][]).flat()); break;
                case "4iv": gl.uniform4iv(location, (value as number[][]).flat()); break;

                case "matrix2": gl.uniformMatrix2fv(location, false, value as number[]); break;
                case "matrix3": gl.uniformMatrix3fv(location, false, value as number[]); break;
                case "matrix4": gl.uniformMatrix4fv(location, false, value as number[]); break;

                default: console.error("Given uniform type is not valid");
            }
        }
}

function createTexture(gl: WebGL2RenderingContext, width:number, height:number, data?:Uint8Array|Float32Array, internalFormat?: number, format?: number, type?: number){
    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex);
    switch(format){
        case gl.RED:
            gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
            break;
        case gl.RG:
            gl.pixelStorei(gl.UNPACK_ALIGNMENT, 2);
            break;
        case gl.RGB:
            gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
            break;
        default:
            gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
            break;
    }
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internalFormat??gl.RGBA32F,
        width,
        height,
        0,
        format??gl.RGBA,
        type??gl.FLOAT,
        data??null
    )
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
}


function createVBO(gl: WebGL2RenderingContext, data:Float32Array){
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_COPY);
    return vbo
}

function createVAO(gl: WebGL2RenderingContext, vbo:WebGLBuffer, attributes:Record<string, number>, attributeLocation:Record<string, number>){
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    const byte = Float32Array.BYTES_PER_ELEMENT;
    const sortedAttribLocation = Object.entries(attributeLocation).sort((a, b)=>a[1]-b[1])
    const stride = sortedAttribLocation.reduce((sum, [attribKey, _])=>sum+attributes[attribKey], 0);
    let offset = 0;
    for (const [attribKey, attribLoc] of Object.entries(attributeLocation)){
        gl.enableVertexAttribArray(attribLoc);
        gl.vertexAttribPointer(attribLoc, attributes[attribKey], gl.FLOAT, false, stride*byte, offset*byte);
        offset += attributes[attribKey];
    }
    return vao
}

function createTransformFeedback(gl: WebGL2RenderingContext, vbo: WebGLBuffer){
    const tf = gl.createTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, vbo);
    return tf;
}


type ParticleBuffer = {
    vao: WebGLVertexArrayObject,
    tf: WebGLTransformFeedback
}

function createParticleBuffer(glContext: webGLContext, data: Float32Array, attributes:Record<string, number>, attributeLocation:Record<string, number>): ParticleBuffer {
    const {gl, resource} = glContext
    const vbo = createVBO(gl, data);
    const vao = createVAO(gl, vbo, attributes, attributeLocation);
    const tf = createTransformFeedback(gl, vbo);
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);
    resource.vbos.push(vbo);
    resource.vaos.push(vao);
    resource.tfs.push(tf);
    return {vao, tf};
}

function createFrameBuffer(glContext:webGLContext, width:number, height: number):FrameBufferGroup{
    const {gl, resource} = glContext
    const tex = createTexture(gl, width, height)
    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    resource.texs.push(tex);
    resource.fbos.push(fbo);
    return {fbo, tex};
}
function renderFrameBuffer(gl: WebGL2RenderingContext, program: ProgramGroup|null, uniform?: Record<string, Uniform>, fbo?: WebGLFramebuffer|null, textures?: WebGLTexture[]|null, currentActiveTexture: number|null = gl.TEXTURE0){
    if (program) {
        gl.useProgram(program.program);
        if (uniform) uploadUniforms(gl, program, uniform);
    }
    if (fbo){
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    } else {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    if (textures) textures.forEach((texture, i)=>{
        if (currentActiveTexture!=gl.TEXTURE0+i){
            gl.activeTexture(gl.TEXTURE0+i);
        }
        gl.bindTexture(gl.TEXTURE_2D, texture);
    });
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function clearResources(glContext:webGLContext){
    const {gl, resource} = glContext
    resource.programs.forEach((program)=>gl.deleteProgram(program))
    resource.vbos.forEach((vbo)=>gl.deleteBuffer(vbo))
    resource.vaos.forEach((vao)=>gl.deleteVertexArray(vao))
    resource.tfs.forEach((tf)=>gl.deleteTransformFeedback(tf))
    resource.fbos.forEach((fbo)=>gl.deleteFramebuffer(fbo))
    resource.texs.forEach((tex)=>gl.deleteTexture(tex))
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

export {
    initGLContext, 
    createUniform, 
    shaderToProgramUniform, 
    shaderToTFProgramUniform, 
    createParticleBuffer, 
    createFrameBuffer, 
    renderFrameBuffer, 
    clearResources,
};

export type {
    Uniform,
    UniformRefObject
}