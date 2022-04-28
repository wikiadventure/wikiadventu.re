import Fastify, { FastifyInstance } from 'fastify'
import { addRoutes } from './controller/api';

const server: FastifyInstance = Fastify({})

addRoutes(server);

const start = async () => {
  try {
    await server.listen(process.env?.['PORT'] || 5000);
    console.log("Listen on 5000")
  } catch (err) {
    console.error(err);
    server.log.error(err)
    process.exit(1)
  }
}
start();

