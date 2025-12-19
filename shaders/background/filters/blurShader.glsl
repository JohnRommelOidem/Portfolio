#version 300 es
precision highp float;

uniform sampler2D u_scene;
uniform bool u_horizontal;
uniform vec2 u_texSize;
uniform float u_weights[100];
uniform int u_weightLength;

in vec2 v_uv;

out vec4 fragColor;

void main(){
    vec2 texelOffset = (u_horizontal?vec2(1.0, 0.0)/u_texSize.x:vec2(0.0, 1.0)/u_texSize.y);

    vec3 result = texture(u_scene, v_uv).rgb*u_weights[0];

    for (int i = 1; i<u_weightLength; ++i){
        result += texture(u_scene, v_uv+texelOffset*float(i)).rgb*u_weights[i];
        result += texture(u_scene, v_uv-texelOffset*float(i)).rgb*u_weights[i];
    }

    fragColor = vec4(result*1.2, 1.0);
}