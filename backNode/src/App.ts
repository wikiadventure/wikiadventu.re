import { getInfo, getInfoUrl } from './controller/api/info/index';
import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http';

const server: FastifyInstance = Fastify({})

server.get(getInfoUrl, getInfo);

const start = async () => {
  try {
    await server.listen(7500);
    console.log("Listen on 6000")
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
start();
