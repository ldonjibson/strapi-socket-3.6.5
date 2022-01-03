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
  // process.nextTick(() =>{
  var io = require('socket.io')(strapi.server);
  io.on('connection', async function(socket) {

    console.log(socket.id, `a user connected`)
        // listen for user diconnect
    socket.on('register', async (data) => {
      console.log(data, "register this guy");
      let res = await strapi.query('user', 'users-permissions').find({
        device_id: data.device_id
      })
      if (res.length > 0){
        console.log(res[0].username)
        io.emit("group_join", `${res[0].username} just joined`)
      } else {
        res = await strapi.query('user', 'users-permissions').create({
          device_id: data.device_id,
          username: data.username,
          email: data.email
        })
        io.emit("group_join", `${res.username} just joined`)
      }
    });
    // send message on user connection
    socket.emit('hello', JSON.stringify({message: "ffsfs"}));

    //send messages to a group
    socket.on("send_message", async (data) => {
      let msg = await strapi.query("messages").create({
        text: data.text,
        author: data.author,
        room_id: data.room_id,
        type: data.type
      })
      let room = await strapi.query("rooms").find({id: data.room_id})
      io.emit(`room_${room[0].id}`, msg)
    })

    socket.on(`get_messages_group`, async (data) => {
      let msg = await strapi.query("messages").find({
        room_id: data.room_id
      })
      socket.emit(`messages_${data.room_id}`, msg)
    })

    //get rooms
    socket.on(`get_rooms`, async (data) => {
      let msg = await strapi.query("rooms").find({
        users_contains: data.user_id
      })
      socket.emit(`get_rooms`, msg)
    })

    // listen for user diconnect
    socket.on('disconnect', () =>{
      console.log('a user disconnected')
    });
  });
  strapi.io = io; // register socket io inside strapi main object to use it globally anywhere

};