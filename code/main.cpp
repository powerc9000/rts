// The OpenGL libraries, make sure to include the GLUT and OpenGL frameworks
#include <windows.h>
#include <gl/gl.h>
#include "../SDL2/include/SDL.h"
#include <stdio.h>
#include <math.h>
#include "../SDL2/include/SDL_image.h"
// This is just an example using basic glut functionality.
// If you want specific Apple functionality, look up AGL

float PI = 3.1415;
struct v2D{
  float x;
  float y;
};

v2D v2DAdd(v2D left, v2D right){
  v2D result = {0};
  result.x = left.x + right.x;
  result.y = left.y + right.y;
  return result;
}

v2D v2DSub(v2D left, v2D right){
  v2D result = {0};
  result.x = left.x - right.x;
  result.y = left.y - right.y;

  return result;
}

float v2DDot(v2D left, v2D right){
  float result;

  result = (left.x * right.x) + (left.y * right.y);

  return result;
}
float v2DLength(v2D vector){
  float result = sqrt(vector.x * vector.x + vector.y * vector.y);
  return result;
}
v2D v2DNormalize(v2D vector){
  v2D result;
  float len = v2DLength(vector);
  result.x = vector.x/len;
  result.y = vector.y/len;
  return result;
}
v2D v2DMul(v2D vector, float scalar){
  v2D result;

  result.x = scalar * vector.x;
  result.y = scalar * vector.y;

  return result;
}
v2D operator-(v2D &left, v2D &right){
  return v2DSub(left, right);
}
v2D operator*(v2D left, float right){
  return v2DMul(left, right);
}
struct entity{
  v2D position;
  v2D velocity;
  v2D target;
  v2D tile;
  float width;
  float height;
};
enum render_types{
  RENDER_TYPE_NULL,
  RENDER_TYPE_RECTANGLE
};
struct render_command{
  render_types type;
  float width;
  float height;
  float x;
  float y;
  int color;
};
struct render_command_buffer{
  int index;
  int windowWidth;
  int windowHeight;
  GLuint *textures;
  render_command commands[100]; 
};
SDL_Surface* loadImage(char *path){
  SDL_Surface * Image = SDL_LoadBMP(path);
  if(!Image){
    OutputDebugString("Image not found\n");
    OutputDebugString(IMG_GetError());
  }
  return Image;
}
void renderRectangle(render_command_buffer *renderer, float x, float y, float width, float height){
  render_command command;
  command.type = RENDER_TYPE_RECTANGLE;
  command.width = width;
  command.height = height;
  command.color = 0b00001111;
  command.x = x;
  command.y = y;
  renderer->commands[renderer->index] = command;
  renderer->index++;
}

void drawGrid(render_command_buffer *renderer){
  int tileSize = 16;
  int linesX = renderer->windowWidth/16;
  int linesY = renderer->windowHeight/16;
  //Vertical Lines
  glDisable(GL_TEXTURE_2D);
  glColor3f(255,255,255);
  for(int i=0; i<linesX; i++){

    glBegin(GL_LINES);
    glVertex2f(i*tileSize, 0);
    glVertex2f(i*tileSize, renderer->windowHeight);
    glEnd();

  }

  for(int i=0; i<linesY; i++){
    glBegin(GL_LINES);
    glVertex2f(0, i*tileSize);
    glVertex2f(renderer->windowWidth, i*tileSize);
    glEnd();
  }
}

void render(render_command_buffer *renderer){

  drawGrid(renderer);
  for(int i=0; i<renderer->index; i++){
    render_command cur;
    cur = renderer->commands[i];
    switch(cur.type){
    case RENDER_TYPE_RECTANGLE:{
      glEnable(GL_TEXTURE_2D);
      glBindTexture(GL_TEXTURE_2D, renderer->textures[0]);
      glBegin(GL_QUADS);
      glTexCoord2f(0.0f, 0.0f);
      glVertex2f(cur.x, cur.y);  // Bottom Left Of The Texture and Quad
      
      glTexCoord2f(1.0f, 0.0f);
      glVertex2f(cur.x + cur.width, cur.y);

      glTexCoord2f(1.0f, 1.0f);
      glVertex2f(cur.x + cur.width, cur.y + cur.height);

      glTexCoord2f(0.0f, 1.0f);
      glVertex2f(cur.x, cur.y + cur.height);

      glEnd();
    }break;
    default:{

    }
    }
  }

  renderer->index = 0;
}
int CALLBACK WinMain(
  _In_ HINSTANCE hInstance,
  _In_ HINSTANCE hPrevInstance,
  _In_ LPSTR     lpCmdLine,
  _In_ int       nCmdShow
)
{
   SDL_Window *window = SDL_CreateWindow(
       "SDL2/OpenGL Demo", 0, 0, 720, 720, 
       SDL_WINDOW_OPENGL|SDL_WINDOW_RESIZABLE);

   SDL_SetWindowBordered(window, SDL_TRUE);
   
   SDL_GLContext glcontext = SDL_GL_CreateContext(window);
   SDL_GL_SetSwapInterval(1);
   glMatrixMode(GL_PROJECTION);
   glOrtho(0, 720, 0, 720, -1, 1);
   glEnable(GL_TEXTURE_2D);
   glShadeModel( GL_SMOOTH );
   glEnable(GL_COLOR_MATERIAL);
   glEnable( GL_BLEND );
   glBlendFunc(GL_ONE, GL_ONE_MINUS_SRC_ALPHA);
   IMG_Init(IMG_INIT_PNG);
   SDL_Surface *Dude = loadImage("../data/dude.bmp");
   GLuint imageNames[1];
   glGenTextures(1, imageNames);
   glBindTexture(GL_TEXTURE_2D, imageNames[0]);
   int mode = GL_RGB;
   if(Dude->format->BytesPerPixel == 4){
     mode = GL_BGRA_EXT;
   }
   glTexImage2D(GL_TEXTURE_2D, 0, 4, Dude->w, Dude->h, 0, mode, GL_UNSIGNED_BYTE, Dude->pixels);
   glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
   glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

   entity player;
   player.position = {0,0};
   player.velocity = {0,0};
   player.target = {0,0};
   player.width = 64.0f;
   player.height = 64.0f;
   // now you can make GL calls.
   render_command_buffer renderer = {0};
   renderer.windowWidth = 720;
   renderer.windowHeight = 720;
   renderer.textures = imageNames;
   int quit = 0;
   SDL_Event event;
   float startingTick = SDL_GetTicks();

   while(!quit){
     
   if(glGetError() != GL_NO_ERROR){
     OutputDebugString("GL Error");
   }
    float now = SDL_GetTicks();
    float delta = (now - startingTick)/1000;
    while(SDL_PollEvent(&event))
    {
      switch(event.type){
      case SDL_QUIT:{
        quit = 1;
      }break;
      case SDL_WINDOWEVENT:{
        switch(event.window.event){
            case SDL_WINDOWEVENT_SIZE_CHANGED:
            case SDL_WINDOWEVENT_RESIZED:{
              glMatrixMode(GL_PROJECTION);
              float width = event.window.data1;
              float height = event.window.data2;
              glViewport(0,0, width, height);
              glLoadIdentity();
              glOrtho(1, width, 1, height, -1, 1);
                renderer.windowWidth = width;
                renderer.windowHeight = height;
            }break;
        }
      }break;
      case SDL_MOUSEBUTTONDOWN:{
        if(event.button.button == SDL_BUTTON_LEFT){
          
          v2D mouse = {(float)event.button.x, (float)(720 - event.button.y)};
          int tilex = event.button.x/16;
          int tiley = (renderer.windowHeight - event.button.y)/16;
          v2D target = {tilex, tiley};
          player.target = target;
          printf("click event x:%i, y:%i\n", event.button.x, 720-event.button.y);
        }
      }break;
        #if 0
      case SDL_KEYDOWN:
        switch(event.key.keysym.sym){
        case SDLK_LEFT:
          player.vx = -200;
          break;
        case SDLK_RIGHT:
          player.vx = 200;
          break;
        case SDLK_DOWN:
          player.vy = -200;
          break;
        case SDLK_UP:
          player.vy = 200;
        }
        break;
    case SDL_KEYUP:{
      switch(event.key.keysym.sym){
        case SDLK_LEFT:
          player.vx = 0;
          break;
        case SDLK_RIGHT:
          player.vx = 0;
          break;
        case SDLK_DOWN:
          player.vy = 0;
          break;
        case SDLK_UP:
          player.vy = 0;
      }
      }
      #endif
    }break;
    }
    glClearColor(0,0,0,0);
    glClear(GL_COLOR_BUFFER_BIT);
    //translate target tile to world space
    v2D target = player.target * 16;
    v2D targetSpeed = target - player.position; //v2DSub(player.target, player.position);
    if(v2DLength(targetSpeed) > 5.0f){
      targetSpeed = v2DNormalize(targetSpeed) * 200.0f;
    }
    player.velocity = targetSpeed;
    player.position = v2DAdd(player.position, v2DMul(player.velocity, delta));
    renderRectangle(&renderer, player.position.x, player.position.y, player.width, player.height);
    render(&renderer);
    //SDL_UpdateWindowSurface(window);
    SDL_GL_SwapWindow(window);
    // if(color == 1){
    //   color = 0;
    // }
    // else{
    //   color = 1;
    // }
    startingTick = now;
   }

   // Once finished with OpenGL functions, the SDL_GLContext can be deleted.
   SDL_GL_DeleteContext(glcontext);  
   return 0;

}
