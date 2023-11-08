# Three.js Basics

Project available at: <https://threejs-basics-nu.vercel.app/>

|3D Text|Random Object|Environment Map|
|-------|-------------|---------------|
|![image](https://user-images.githubusercontent.com/17517057/212352787-8e3dabd7-a131-4280-b987-29af2f670fd5.png)| ![image](https://user-images.githubusercontent.com/17517057/212353221-b92a1375-1a0f-428e-9b68-bb546811087d.png)|![image](https://user-images.githubusercontent.com/17517057/212353663-a2752799-fa1a-435b-b27f-2c2be5edba35.png)

This project exemplify some Threejs possibilities.

## Setup

Run this followed commands:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```

## Create another animation

1) Choose the proper file (the one that is more related to the animation goal)
   1) or create one new file as `new-feature.js`
      1) to see something on the screen copy `example-template.js` content to your file
   2) choose a name for your function like `newFeatureExample`
2) Add the function call on `methodObject` in `canvas.js`
3) Add the route on `routes.js`
4) Reload server so routes can be created on webpack
