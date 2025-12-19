#version 300 es
precision highp float;

out vec4 color;

void main(){
    float dist = length(gl_PointCoord-0.5);
    if (dist>0.5) discard;
    color = vec4(1.0, 0.4, 0.1, 1.0);
}