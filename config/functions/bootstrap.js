'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#bootstrap
 */

// module.exports = () => {
//   process.nextTick(() => {
//     console.log(strapi.server.listener)
//     var io = require("socket.io")(strapi.server, {
//       cors: {
//         origin: "*",
//         methods: ["GET", "POST"],
//         allowedHeaders: ["my-custom-header"],
//         credentials: true,
//       },
//       transports: ["polling"] 
//     });

      
//     var online_users = [];
      
//     io.on("connection", function (socket) {
        
//       let token = socket.handshake.query.token;
      
//       //io.socketsJoin("post_room");
//       console.log("rooms",socket.rooms);
//       console.log('a user has connected',(socket.id)); 
//     })
//   })
// }


module.exports = async () => {
  console.log(strapi)
  // process.nextTick(() =>{
    var io = require('socket.io')(strapi.server);
    io.on('connection', async function(socket) {

      console.log(socket.id, `a user connected`)
      // send message on user connection
      socket.emit('hello', JSON.stringify({message: "ffsfs"}));


      // listen for user diconnect
      socket.on('disconnect', () =>{
        console.log('a user disconnected')
      });
    });
    strapi.io = io; // register socket io inside strapi main object to use it globally anywhere
  // })

};