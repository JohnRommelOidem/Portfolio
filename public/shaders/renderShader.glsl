#version 300 es
precision mediump float;

in vec2 v_texCoord;
out vec4 outputColor;
uniform sampler2D u_texture;
uniform vec2 u_texSize;
uniform vec3 u_aliveColor;
uniform vec3 u_deadColor;

void main(){
    ivec2 coord = ivec2(v_texCoord*u_texSize);
    vec2 state = texelFetch(u_texture, coord, 0).rg;
    vec3 color = mix(u_deadColor, u_aliveColor, state.r);
    outputColor = vec4(color, 1.0);
}