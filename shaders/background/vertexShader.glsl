#version 300 es
precision highp float;

in vec3 a_position;
in vec3 a_momentum;

vec3 cylToCart(vec3 coord){
    float r = coord.x;
    float th = coord.y;
    return vec3(
        r*sin(th),
        coord.z,
        r*cos(th)
    );
}

void main(){
    float theta1 = -3.1415/4.0;
    float theta2 = 3.1415/6.0;
    mat4 rotate1 = mat4(
        cos(theta1), sin(theta1), 0.0, 0.0,
        -sin(theta1), cos(theta1), 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
    mat4 rotate2 = mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0 , cos(theta2), sin(theta2), 0.0,
        0.0 , -sin(theta2), cos(theta2), 0.0,
        0.0, 0.0, 0.0, 1.0
    );
    vec3 cartPos = (rotate2*rotate1*vec4(cylToCart(a_position), 1.0)).xyz;
    gl_Position = vec4(cartPos.x/5.0, cartPos.y/5.0, 0, 1);
    gl_PointSize = 3.0+0.5*max(cartPos.z, -1.0);
}