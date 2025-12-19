#version 300 es
precision highp float;

uniform sampler2D u_scene;
uniform sampler2D u_prevScene;

in vec2 v_uv;

out vec4 color;

void main(){
    vec3 finalColor = texture(u_scene, v_uv).rgb+texture(u_prevScene, v_uv).rgb;
    color = vec4(finalColor, 1.0);
}