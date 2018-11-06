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

module.exports = config;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZ1NlcnZlci5qcyJdLCJuYW1lcyI6WyJjb25maWciLCJhcHBOYW1lIiwiZW52IiwidmVyc2lvbiIsImFzc2V0c0RvbWFpbiIsInBvcnRTZXJ2ZXIiLCJteW9Qb3J0Iiwib3NjIiwicmVjZWl2ZUFkZHJlc3MiLCJyZWNlaXZlUG9ydCIsInNlbmRBZGRyZXNzIiwic2VuZFBvcnQiLCJzb2NrZXRTZXJ2ZXJUb0NsaWVudCIsInBvcnQiLCJzb2NrZXRDbGllbnRUb1NlcnZlciIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUlBLFNBQVU7QUFDWjtBQUNBO0FBQ0FDLFdBQVMsc0NBSEc7O0FBS1o7QUFDQUMsT0FBSyxhQU5POztBQVFaO0FBQ0E7QUFDQUMsV0FBUyxPQVZHOztBQWFaO0FBQ0E7QUFDQTtBQUNBQyxnQkFBYyxHQWhCRjs7QUFrQlo7QUFDQUMsY0FBWSxJQW5CQTs7QUFxQlo7QUFDQUMsV0FBUyxLQXRCRzs7QUF3Qlo7QUFDQTs7O0FBR0E7QUFDQUMsT0FBSztBQUNIO0FBQ0FDLG9CQUFnQixXQUZiO0FBR0g7QUFDQUMsaUJBQWEsS0FKVjtBQUtIO0FBQ0FDLGlCQUFhLFdBTlY7QUFPSDtBQUNBQyxjQUFVO0FBUlAsR0E3Qk87O0FBd0NaO0FBQ0FDLHdCQUFzQjtBQUNwQjtBQUNBQyxVQUFNO0FBRmMsR0F6Q1Y7QUE2Q1o7QUFDQUMsd0JBQXNCO0FBQ3BCO0FBQ0FELFVBQU07QUFGYztBQTlDVixDQUFkOztBQW9EQUUsT0FBT0MsT0FBUCxHQUFpQmhCLE1BQWpCIiwiZmlsZSI6ImNvbmZpZ1NlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLy9pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbi8vY29uc3QgY3dkID0gcHJvY2Vzcy5jd2QoKTtcblxuXG4vLyBDb25maWd1cmF0aW9uIG9mIHRoZSBhcHBsaWNhdGlvbi5cbi8vIE90aGVyIGVudHJpZXMgY2FuIGJlIGFkZGVkIChhcyBsb25nIGFzIHRoZWlyIG5hbWUgZG9lc24ndCBjb25mbGljdCB3aXRoXG4vLyBleGlzdGluZyBvbmVzKSB0byBkZWZpbmUgZ2xvYmFsIHBhcmFtZXRlcnMgb2YgdGhlIGFwcGxpY2F0aW9uIChlLmcuIEJQTSxcbi8vIHN5bnRoIHBhcmFtZXRlcnMpIHRoYXQgY2FuIHRoZW4gYmUgc2hhcmVkIGVhc2lseSBhbW9uZyBhbGwgY2xpZW50cyB1c2luZ1xuLy8gdGhlIGBzaGFyZWQtY29uZmlnYCBzZXJ2aWNlLlxudmFyIGNvbmZpZyA9ICB7XG4gIC8vIG5hbWUgb2YgdGhlIGFwcGxpY2F0aW9uLCB1c2VkIGluIHRoZSBgLmVqc2AgdGVtcGxhdGUgYW5kIGJ5IGRlZmF1bHQgaW5cbiAgLy8gdGhlIGBwbGF0Zm9ybWAgc2VydmljZSB0byBwb3B1bGF0ZSBpdHMgdmlld1xuICBhcHBOYW1lOiAnVG9vbEJveCAtIE1vdmVPbjogQSB0ZWNobm9sb2d5IHByb2JlJyxcbiAgXG4gIC8vIG5hbWUgb2YgdGhlIGVudmlyb25uZW1lbnQgKCdwcm9kdWN0aW9uJyBlbmFibGUgY2FjaGUgaW4gZXhwcmVzcyBhcHBsaWNhdGlvbilcbiAgZW52OiAnZGV2ZWxvcG1lbnQnLFxuICBcbiAgLy8gdmVyc2lvbiBvZiBhcHBsaWNhdGlvbiwgY2FuIGJlIHVzZWQgdG8gZm9yY2UgcmVsb2FkIGNzcyBhbmQganMgZmlsZXNcbiAgLy8gZnJvbSBzZXJ2ZXIgKGNmLiBgaHRtbC9kZWZhdWx0LmVqc2ApXG4gIHZlcnNpb246ICcwLjAuMicsXG4gIFxuICBcbiAgLy8gZGVmaW5lIGZyb20gd2hlcmUgdGhlIGFzc2V0cyAoc3RhdGljIGZpbGVzKSBzaG91bGQgYmUgbG9hZGVkLCB0aGVzZSB2YWx1ZVxuICAvLyBjb3VsZCBhbHNvIHJlZmVyIHRvIGEgc2VwYXJhdGUgc2VydmVyIGZvciBzY2FsYWJpbGl0eSByZWFzb25zLiBUaGlzIHZhbHVlXG4gIC8vIHNob3VsZCBhbHNvIGJlIHVzZWQgY2xpZW50LXNpZGUgdG8gY29uZmlndXJlIHRoZSBgYXVkaW8tYnVmZmVyLW1hbmFnZXJgIHNlcnZpY2UuXG4gIGFzc2V0c0RvbWFpbjogJy8nLFxuICBcbiAgLy8gcG9ydCB1c2VkIHRvIG9wZW4gdGhlIGh0dHAgc2VydmVyLCBpbiBwcm9kdWN0aW9uIHRoaXMgdmFsdWUgaXMgdHlwaWNhbGx5IDgwXG4gIHBvcnRTZXJ2ZXI6IDgwMDAsXG4gIFxuICAvL1BvcnQgdXNlZCBieSB0aGUgbXlvXG4gIG15b1BvcnQ6IDEwMTM4LFxuICBcbiAgLy8gbG9jYXRpb24gb2YgdGhlIHB1YmxpYyBkaXJlY3RvcnkgKGFjY2Vzc2libGUgdGhyb3VnaCBodHRwKHMpIHJlcXVlc3RzKVxuICAvLyAgcHVibGljRGlyZWN0b3J5OiBwYXRoLmpvaW4oY3dkLCAncHVibGljJyksXG4gIFxuICBcbiAgLy8gY29uZmlndXJhdGlvbiBvZiB0aGUgYG9zY2Agc2VydmljZVxuICBvc2M6IHtcbiAgICAvLyBJUCBvZiB0aGUgY3VycmVudGx5IHJ1bm5pbmcgbm9kZSBzZXJ2ZXJcbiAgICByZWNlaXZlQWRkcmVzczogJzEyNy4wLjAuMScsXG4gICAgLy8gcG9ydCBsaXN0ZW5pbmcgZm9yIGluY29tbWluZyBtZXNzYWdlc1xuICAgIHJlY2VpdmVQb3J0OiA1NzEyMSxcbiAgICAvLyBJUCBvZiB0aGUgcmVtb3RlIGFwcGxpY2F0aW9uXG4gICAgc2VuZEFkZHJlc3M6ICcxMjcuMC4wLjEnLFxuICAgIC8vIHBvcnQgd2hlcmUgdGhlIHJlbW90ZSBhcHBsaWNhdGlvbiBpcyBsaXN0ZW5pbmcgZm9yIG1lc3NhZ2VzXG4gICAgc2VuZFBvcnQ6IDU3MTIwLFxuICB9LFxuICBcbiAgLy8gY29uZmlndXJhdGlvbiBvZiB0aGUgYHJhdy1zb2NrZXRgIHNlcnZpY2VcbiAgc29ja2V0U2VydmVyVG9DbGllbnQ6IHtcbiAgICAvLyBwb3J0IHVzZWQgZm9yIHNvY2tldCBjb25uZWN0aW9uIHdpdGggdGhlIGNsaWVudFxuICAgIHBvcnQ6IDkwMDJcbiAgfSxcbiAgLy8gY29uZmlndXJhdGlvbiBvZiB0aGUgYHJhdy1zb2NrZXRgIHNlcnZpY2VcbiAgc29ja2V0Q2xpZW50VG9TZXJ2ZXI6IHtcbiAgICAvLyBwb3J0IHVzZWQgZm9yIHNvY2tldCBjb25uZWN0aW9uIHdpdGggdGhlIGNsaWVudFxuICAgIHBvcnQ6IDkwMDFcbiAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY29uZmlnO1xuIl19