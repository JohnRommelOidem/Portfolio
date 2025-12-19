#version 300 es
precision highp float;

in vec3 a_position;
in vec3 a_momentum;

out vec3 tf_position;
out vec3 tf_momentum;

struct coords{
    vec3 position;
    vec3 momentum;
};

vec3 dV(vec3 pos, float L){
    float dist = pow(length(vec3(pos.x, pos.z, 0.001)), 3.0);
    float r = pos.x;
    float z = pos.z;
    return vec3(L*L/pow(r, 3.0)-r/4.0-r/dist,0 , -z/dist);
}

vec3 dT(coords p){
    float r = p.position.x;
    return p.momentum/vec3(1, r*r, 1);
}

coords stormerVerlet(coords p, float dt){
    coords outP = p;
    float L = outP.momentum.y;
    outP.momentum += dt*dV(outP.position, L)/2.0;
    outP.position += dt*outP.momentum;
    outP.momentum += dt*dV(outP.position, L)/2.0;
    return outP;
}

void main(){
    coords p;
    p.position = a_position;
    p.momentum = a_momentum;

    coords newP = stormerVerlet(p, 0.01);
    /*newP.momentum *= 0.9999;*/
    tf_position = newP.position;
    tf_momentum = newP.momentum;
    
    /*if (abs(tf_position.x)>=1.0) tf_momentum.x*=-1.0;
    if (abs(tf_position.y)>=1.0) tf_momentum.y*=-1.0;
    if (abs(tf_position.z)>=1.0) tf_momentum.z*=-1.0;
    tf_position = clamp(tf_position, -1.0, 1.0);*/
    
}