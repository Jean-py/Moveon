
//import path from 'path';
//const cwd = process.cwd();


// Configuration of the application.
// Other entries can be added (as long as their name doesn't conflict with
// existing ones) to define global parameters of the application (e.g. BPM,
// synth parameters) that can then be shared easily among all clients using
// the `shared-config` service.
var config =  {
  // name of the application, used in the `.ejs` template and by default in
  // the `platform` service to populate its view
  appName: 'ToolBox - MoveOn: A technology probe',
  
  // name of the environnement ('production' enable cache in express application)
  env: 'development',
  
  // version of application, can be used to force reload css and js files
  // from server (cf. `html/default.ejs`)
  version: '0.0.1',
  
  
  // define from where the assets (static files) should be loaded, these value
  // could also refer to a separate server for scalability reasons. This value
  // should also be used client-side to configure the `audio-buffer-manager` service.
  assetsDomain: '/',
  
  // port used to open the http server, in production this value is typically 80
  portServer: 8081,
  
  //Port used by the myo
  myoPort: 10138,
  
  // location of the public directory (accessible through http(s) requests)
  //  publicDirectory: path.join(cwd, 'public'),
  
  
  // configuration of the `osc` service
  osc: {
    // IP of the currently running node server
    receiveAddress: '127.0.0.1',
    // port listening for incomming messages
    receivePort: 57121,
    // IP of the remote application
    sendAddress: '127.0.0.1',
    // port where the remote application is listening for messages
    sendPort: 57120,
  },
  
  // configuration of the `raw-socket` service
  socketServerToClient: {
    // port used for socket connection with the client
    port: 9002
  },
  // configuration of the `raw-socket` service
  socketClientToServer: {
    // port used for socket connection with the client
    port: 9001
  },
};

module.exports = config;
