# Connect Four

https://connect-four.hashbase.io/

With Beaker Browser you can play two player P2P over Dat protocol at [dat://connect-four.hashbase.io/](dat://connect-four.hashbase.io/).

Connect Four built with Redux, Web Components, and TDD thanks to a polymer-cli generated project.

- install: `npm install && mv node_modules/redux/es/redux.mjs node_modules/redux/es/redux.js`
  - The extra command is needed because of https://github.com/Polymer/tools/issues/736
- serve: `npm start`
- test: `npm run test` or `npm start` and go to `http://localhost:8081/test/fiar-app/fiar-app_test.html`
- build: `npm run build`, find it in `build/es5-bunlded/`. 

## credits
- Code by rjsteinert
- Audio by lebaston100 (https://freesound.org/s/192272/) and jimhancock (https://freesound.org/s/376318/)
