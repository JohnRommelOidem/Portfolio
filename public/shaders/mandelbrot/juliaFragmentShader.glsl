#version 300 es
precision highp float;

out vec4 outputColor;
uniform int u_iterations;
uniform vec2 u_c0;
uniform mat3 u_juliaTransform;
uniform float u_power;

in vec2 v_uv;

vec2 complexMult(vec2 a, vec2 b){
    return vec2(
        a.x*b.x-a.y*b.y,
        a.x*b.y+a.y*b.x
    );
}

vec2 complexPower(vec2 z, float n){
    float r = length(z);
    float th = atan(z.y, z.x);
    float rn = pow(r, n);
    float thn = n*th;
    return rn*vec2(cos(thn), sin(thn));
}
vec2 iterate(vec2 z, vec2 c){
    return complexPower(z, u_power)+c;
}

vec3 palette(float nu, vec3 colors[4]){
    float scaled = fract(nu/30.0)*4.0;
    int i0 = int(floor(scaled))%4;
    int i1 = (i0+1)%4;
    return mix(colors[i0], colors[i1], smoothstep(0.0, 1.0, fract(scaled)));
}

void main(){
    vec3 colors[4] = vec3[4](
        vec3(0, 0.25, 0.4),
        vec3(1),
        vec3(0.8, 0.45, 0.3),
        vec3(0.1)
    );
    vec3 color = vec3(0);
    vec2 c = u_c0;
    vec2 z = 3.5*(u_juliaTransform*vec3(gl_FragCoord.xy, 1)).xy;
    vec2 dz = vec2(1, 0);
    vec2 dz_sum = vec2(0);
    for (int i=0;i<u_iterations;i++){
        z = iterate(z, c);
        dz = 2.0*complexMult(dz, z)+vec2(1, 0);
        dz_sum += dz;
        if (length(dz_sum)>1e10){
            float nu = float(i)-log2(log(length(z)))/log2(u_power);
            color = palette(nu, colors);
            break;
        }
    }
    outputColor = vec4(color, 1);
}