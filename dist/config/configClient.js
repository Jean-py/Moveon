'use strict';

//import path from 'path';
//const cwd = process.cwd();


// Configuration of the application.
// Other entries can be added (as long as their name doesn't conflict with
// existing ones) to define global parameters of the application (e.g. BPM,
// synth parameters) that can then be shared easily among all clients using
// the `shared-config` service.
var config = {
  // name of the application, used in the `.ejs` template and by default in
  // the `platform` service to populate its view
  appName: 'ToolBox - MoveOn: A technology probe',

  // name of the environnement ('production' enable cache in express application)
  env: 'development',

  // version of application, can be used to force reload css and js files
  // from server (cf. `html/default.ejs`)
  version: '0.0.2',

  // define from where the assets (static files) should be loaded, these value
  // could also refer to a separate server for scalability reasons. This value
  // should also be used client-side to configure the `audio-buffer-manager` service.
  assetsDomain: '/',

  // port used to open the http server, in production this value is typically 80
  portServer: 8000,

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
    sendPort: 57120
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
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZ0NsaWVudC5qcyJdLCJuYW1lcyI6WyJjb25maWciLCJhcHBOYW1lIiwiZW52IiwidmVyc2lvbiIsImFzc2V0c0RvbWFpbiIsInBvcnRTZXJ2ZXIiLCJteW9Qb3J0Iiwib3NjIiwicmVjZWl2ZUFkZHJlc3MiLCJyZWNlaXZlUG9ydCIsInNlbmRBZGRyZXNzIiwic2VuZFBvcnQiLCJzb2NrZXRTZXJ2ZXJUb0NsaWVudCIsInBvcnQiLCJzb2NrZXRDbGllbnRUb1NlcnZlciJdLCJtYXBwaW5ncyI6Ijs7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSUEsU0FBVTtBQUNaO0FBQ0E7QUFDQUMsV0FBUyxzQ0FIRzs7QUFLWjtBQUNBQyxPQUFLLGFBTk87O0FBUVo7QUFDQTtBQUNBQyxXQUFTLE9BVkc7O0FBYVo7QUFDQTtBQUNBO0FBQ0FDLGdCQUFjLEdBaEJGOztBQWtCWjtBQUNBQyxjQUFZLElBbkJBOztBQXFCWjtBQUNBQyxXQUFTLEtBdEJHOztBQXdCWjtBQUNBOzs7QUFHQTtBQUNBQyxPQUFLO0FBQ0g7QUFDQUMsb0JBQWdCLFdBRmI7QUFHSDtBQUNBQyxpQkFBYSxLQUpWO0FBS0g7QUFDQUMsaUJBQWEsV0FOVjtBQU9IO0FBQ0FDLGNBQVU7QUFSUCxHQTdCTzs7QUF3Q1o7QUFDQUMsd0JBQXNCO0FBQ3BCO0FBQ0FDLFVBQU07QUFGYyxHQXpDVjtBQTZDWjtBQUNBQyx3QkFBc0I7QUFDcEI7QUFDQUQsVUFBTTtBQUZjO0FBOUNWLENBQWQiLCJmaWxlIjoiY29uZmlnQ2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vL2ltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuLy9jb25zdCBjd2QgPSBwcm9jZXNzLmN3ZCgpO1xuXG5cbi8vIENvbmZpZ3VyYXRpb24gb2YgdGhlIGFwcGxpY2F0aW9uLlxuLy8gT3RoZXIgZW50cmllcyBjYW4gYmUgYWRkZWQgKGFzIGxvbmcgYXMgdGhlaXIgbmFtZSBkb2Vzbid0IGNvbmZsaWN0IHdpdGhcbi8vIGV4aXN0aW5nIG9uZXMpIHRvIGRlZmluZSBnbG9iYWwgcGFyYW1ldGVycyBvZiB0aGUgYXBwbGljYXRpb24gKGUuZy4gQlBNLFxuLy8gc3ludGggcGFyYW1ldGVycykgdGhhdCBjYW4gdGhlbiBiZSBzaGFyZWQgZWFzaWx5IGFtb25nIGFsbCBjbGllbnRzIHVzaW5nXG4vLyB0aGUgYHNoYXJlZC1jb25maWdgIHNlcnZpY2UuXG52YXIgY29uZmlnID0gIHtcbiAgLy8gbmFtZSBvZiB0aGUgYXBwbGljYXRpb24sIHVzZWQgaW4gdGhlIGAuZWpzYCB0ZW1wbGF0ZSBhbmQgYnkgZGVmYXVsdCBpblxuICAvLyB0aGUgYHBsYXRmb3JtYCBzZXJ2aWNlIHRvIHBvcHVsYXRlIGl0cyB2aWV3XG4gIGFwcE5hbWU6ICdUb29sQm94IC0gTW92ZU9uOiBBIHRlY2hub2xvZ3kgcHJvYmUnLFxuICBcbiAgLy8gbmFtZSBvZiB0aGUgZW52aXJvbm5lbWVudCAoJ3Byb2R1Y3Rpb24nIGVuYWJsZSBjYWNoZSBpbiBleHByZXNzIGFwcGxpY2F0aW9uKVxuICBlbnY6ICdkZXZlbG9wbWVudCcsXG4gIFxuICAvLyB2ZXJzaW9uIG9mIGFwcGxpY2F0aW9uLCBjYW4gYmUgdXNlZCB0byBmb3JjZSByZWxvYWQgY3NzIGFuZCBqcyBmaWxlc1xuICAvLyBmcm9tIHNlcnZlciAoY2YuIGBodG1sL2RlZmF1bHQuZWpzYClcbiAgdmVyc2lvbjogJzAuMC4yJyxcbiAgXG4gIFxuICAvLyBkZWZpbmUgZnJvbSB3aGVyZSB0aGUgYXNzZXRzIChzdGF0aWMgZmlsZXMpIHNob3VsZCBiZSBsb2FkZWQsIHRoZXNlIHZhbHVlXG4gIC8vIGNvdWxkIGFsc28gcmVmZXIgdG8gYSBzZXBhcmF0ZSBzZXJ2ZXIgZm9yIHNjYWxhYmlsaXR5IHJlYXNvbnMuIFRoaXMgdmFsdWVcbiAgLy8gc2hvdWxkIGFsc28gYmUgdXNlZCBjbGllbnQtc2lkZSB0byBjb25maWd1cmUgdGhlIGBhdWRpby1idWZmZXItbWFuYWdlcmAgc2VydmljZS5cbiAgYXNzZXRzRG9tYWluOiAnLycsXG4gIFxuICAvLyBwb3J0IHVzZWQgdG8gb3BlbiB0aGUgaHR0cCBzZXJ2ZXIsIGluIHByb2R1Y3Rpb24gdGhpcyB2YWx1ZSBpcyB0eXBpY2FsbHkgODBcbiAgcG9ydFNlcnZlcjogODAwMCxcbiAgXG4gIC8vUG9ydCB1c2VkIGJ5IHRoZSBteW9cbiAgbXlvUG9ydDogMTAxMzgsXG4gIFxuICAvLyBsb2NhdGlvbiBvZiB0aGUgcHVibGljIGRpcmVjdG9yeSAoYWNjZXNzaWJsZSB0aHJvdWdoIGh0dHAocykgcmVxdWVzdHMpXG4gIC8vICBwdWJsaWNEaXJlY3Rvcnk6IHBhdGguam9pbihjd2QsICdwdWJsaWMnKSxcbiAgXG4gIFxuICAvLyBjb25maWd1cmF0aW9uIG9mIHRoZSBgb3NjYCBzZXJ2aWNlXG4gIG9zYzoge1xuICAgIC8vIElQIG9mIHRoZSBjdXJyZW50bHkgcnVubmluZyBub2RlIHNlcnZlclxuICAgIHJlY2VpdmVBZGRyZXNzOiAnMTI3LjAuMC4xJyxcbiAgICAvLyBwb3J0IGxpc3RlbmluZyBmb3IgaW5jb21taW5nIG1lc3NhZ2VzXG4gICAgcmVjZWl2ZVBvcnQ6IDU3MTIxLFxuICAgIC8vIElQIG9mIHRoZSByZW1vdGUgYXBwbGljYXRpb25cbiAgICBzZW5kQWRkcmVzczogJzEyNy4wLjAuMScsXG4gICAgLy8gcG9ydCB3aGVyZSB0aGUgcmVtb3RlIGFwcGxpY2F0aW9uIGlzIGxpc3RlbmluZyBmb3IgbWVzc2FnZXNcbiAgICBzZW5kUG9ydDogNTcxMjAsXG4gIH0sXG4gIFxuICAvLyBjb25maWd1cmF0aW9uIG9mIHRoZSBgcmF3LXNvY2tldGAgc2VydmljZVxuICBzb2NrZXRTZXJ2ZXJUb0NsaWVudDoge1xuICAgIC8vIHBvcnQgdXNlZCBmb3Igc29ja2V0IGNvbm5lY3Rpb24gd2l0aCB0aGUgY2xpZW50XG4gICAgcG9ydDogOTAwMlxuICB9LFxuICAvLyBjb25maWd1cmF0aW9uIG9mIHRoZSBgcmF3LXNvY2tldGAgc2VydmljZVxuICBzb2NrZXRDbGllbnRUb1NlcnZlcjoge1xuICAgIC8vIHBvcnQgdXNlZCBmb3Igc29ja2V0IGNvbm5lY3Rpb24gd2l0aCB0aGUgY2xpZW50XG4gICAgcG9ydDogOTAwMVxuICB9LFxufTtcbiJdfQ==