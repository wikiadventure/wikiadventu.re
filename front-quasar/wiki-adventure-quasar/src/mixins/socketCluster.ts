import socketCluster from 'socketcluster-client';

let socket = socketCluster.create({
    hostname: 'localhost',
    port: 8000
  });
socket.subscribe