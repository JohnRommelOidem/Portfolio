#version 300 es
precision highp float;

uniform sampler2D u_scene;
uniform sampler2D u_prevScene;

in vec2 v_uv;

out vec4 color;

void main(){
    color = 0.995*texture(u_prevScene, v_uv)+texture(u_scene, v_uv);
}