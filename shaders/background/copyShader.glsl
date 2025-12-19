#version 300 es
precision highp float;

uniform sampler2D u_prevScene;
uniform sampler2D u_scene;

in vec2 v_uv;

out vec4 color;

void main(){
    color = texture(u_prevScene, v_uv);
}