// Require the framework and instantiate it

import Fastify from 'fastify'
import { FromSchema } from 'json-schema-to-ts';

const fastify = Fastify({
  logger: true
})
// // CommonJs
// const fastify = require('fastify')({
//   logger: true
// })

// Declare a route
fastify.get('/', function (request, reply) {
  reply.send({ hello: 'world' })
})


const createUserSchema = {
  type:'object',
  properties:{
    name:{
      type:'string',
    },
    age:{
      type:'integer',
      minimum:0,
      maximum:150,
    },
  },
  required:['name','age'],
  additionalProperties:false,
} as const;

type CreateUserBody = FromSchema<typeof createUserSchema>;


fastify.post(
  '/users',
  {
    schema:{
      body:createUserSchema,
      response:{
        201:{
          type:'object',
          properties:{
            id:{type:'number'},
            name:{type:'string'},
            age:{type:'integer'},
          },
          required:['id','name','age'],
        }
      }
    }
  },
  async (request,reply)=>{
    const body = request.body as CreateUserBody;
    const newUser = {id:0,...body};
    reply.status(201).send(newUser);
  },
)





// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})