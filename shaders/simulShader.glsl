#version 300 es
precision mediump float;

in vec2 v_texCoord;
out vec4 outputColor;
uniform sampler2D u_texture;
uniform vec2 u_texSize;

void main(){
    ivec2 size = ivec2(u_texSize);
    ivec2 coord = ivec2(v_texCoord*u_texSize);
    
    int alive = 0;
    for (int dy=-1;dy<=1;dy++){
        for (int dx=-1;dx<=1;dx++){
            if (dx==0&&dy==0) continue;
            ivec2 neighbor = ivec2(
                (coord.x+dx+size.x)%size.x,
                (coord.y+dy+size.y)%size.y
            );
            float cell = texelFetch(u_texture, neighbor, 0).r;
            alive+=int(cell);
        }
    }

    float current = texelFetch(u_texture, coord, 0).r;
    float next=(alive==3||(current==1.0 && alive==2))? 1.0:0.0;

    outputColor = vec4(next, 0.0, 0.0, 1.0);
}