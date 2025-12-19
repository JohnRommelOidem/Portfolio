#version 300 es
precision highp float;

out vec2 v_uv;

void main(){
    v_uv = vec2(
        float(gl_VertexID&1),
        float((gl_VertexID>>1)&1)
    );
    gl_Position = vec4(v_uv*2.0-1.0, 0.0, 1.0);
}