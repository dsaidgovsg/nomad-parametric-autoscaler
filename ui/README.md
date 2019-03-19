This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Docker building & deploying

Run `docker build -t autoscaler-ui .` to build the image and `docker run -p 5000:5000 autoscaler-ui` to run ui. 

## Local deployment

### Deploying in dev mode
Simply run `npm start` to fun app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

### Deploying in production mode

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance. `create-config.js` is a way to insert variables at runtime, more discussion can be found [here](http://ryanogles.by/on-injecting-a-javascript-environment/).

```
export REACT_APP_NOPAS_ENDPOINT=xxxx
npm run build
node create-config.js
serve -s build
```

Run `npm install -g serve` or `yarn global add serve` to install `serve`. See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Testing
`npm test`
Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
