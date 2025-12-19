#version 300 es
precision highp float;

uniform sampler2D u_scene;

in vec2 v_uv;

out vec4 color;

void main(){
    vec4 colorX = texture(u_scene, v_uv);
    float brightness = max(max(colorX.r, colorX.g), colorX.b);
    color = brightness > 1.0 ? colorX: vec4(0, 0, 0, 1);
}