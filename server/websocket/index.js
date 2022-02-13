const SocketEvents = require('../constants/SocketEvents');
const commentModel = require('../models').Comment;
const replyModel = require('../models').Reply;
const notificationModel = require('../models').Notfication;

connection = (client) => {
  client.on('openchat', (info) => {
    console.log('user join');

    const user0bj = {
      socketId: client.id,
      userId: info.username,
      folderId: info.folder_id,
    };

    if (
      !global.users.some(
        (e) => e.userId === info.username && e.folderId === info.folder_id,
      )
    ) {
      global.users.push(user0bj);
    }
    notificationModel
      .findOne({
        where: {
          appraisal_id: info.folder_id,
          user_id: info.username,
        },
      })
      .then((notifcation) => {
        console.log('here notif');
        if (notifcation) {
          notifcation
            .update({
              notif_count: 0,
            })
            .then((newnotif) => client.emit(SocketEvents.FETCHNOTIFICATION, {
              notifcation: newnotif,
            }))
            .catch((error) => console.log(error));
        }
      })
      .catch((error) => console.log(error));
  });

  client.on(SocketEvents.USERJOIN, (info) => {
    client.join(info.folder_id);
    // fetch comments and return it to the user
    commentModel
      .findAll({
        where: {
          appraisal_id: info.folder_id,
        },
        include: [
          {
            model: replyModel,
            as: 'replys',
          },
        ],
      })
      .then((comments) => {
        client.emit(SocketEvents.COMMENTSLIST, { comments });
      })
      .catch((error) => console.log(error));
  });

  // user join notification channel
  client.on(SocketEvents.JOINNOTFICATION, (info) => {
    // join notificaton
    client.join(`${info.folder_id}_notification_${info.username}`);

    notificationModel
      .findOne({
        where: {
          appraisal_id: info.folder_id,
          user_id: info.username,
        },
      })
      .then((notifcation) => {
        if (notifcation) {
          client.emit(SocketEvents.FETCHNOTIFICATION, { notifcation });
        } else {
          notificationModel
            .create({
              appraisal_id: info.folder_id,
              user_id: info.username,
              notif_count: 0,
            })
            .then((newnotif) => {
              client.emit(SocketEvents.FETCHNOTIFICATION, {
                notifcation: newnotif,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => console.log(error));
  });

  client.on(SocketEvents.SENDCOMMENT, (body) => {
    commentModel
      .create(
        {
          user_id: body.username,
          text: body.body,
          appraisal_id: body.folder_id,
          replys: [],
        },
        {
          include: [
            {
              model: replyModel,
              as: 'replys',
            },
          ],
        },
      )
      .then((comment) => {
        console.log(comment.appraisal_id);

        io.to(comment.appraisal_id).emit(SocketEvents.NEWCOMMENT, { comment });
        notificationModel
          .findAll({
            where: {
              appraisal_id: body.folder_id,
            },
          })
          .then((notifactions) => {
            const notificationList = notifactions.filter(
              (notif) => notif.username !== body.username,
            );
            console.log(notificationList);
            notificationList.forEach((notif) => {
              if (
                !global.users.some(
                  (e) => e.userId === notif.user_id
                    && e.folderId === notif.appraisal_id,
                )
              ) {
                console.log('heeeeeeeere');
                notificationModel
                  .increment('notif_count', { by: 1, where: { id: notif.id } })
                  .then((notification) => {
                    notificationModel
                      .findOne({
                        where: {
                          id: notif.id,
                        },
                      })
                      .then((n) => {
                        console.log(n);
                        io.to(
                          `${notif.appraisal_id}_notification_${notif.user_id}`,
                        ).emit(SocketEvents.NEWNOTIFICATION, n);
                      })
                      .catch((error) => console.log(error));
                  });
              }
            });
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => {
        console.log(error);
      });
  });

  // client.on(SocketEvents.SENDREPLY, (body) => {

  //   replyModel
  //     .create({
  //       user_id: body.username,
  //       text: body.body,
  //       comment_id: body.comment_id,
  //     })
  //     .then((reply) => {
  //       io.to(body.folder_id).emit(SocketEvents.NEWREPLY, { reply });
  //       notificationModel
  //         .findAll({
  //           where: {
  //             folder_id: body.folder_id,
  //           },
  //         })
  //         .then((notifactions) => {
  //           const notificationList = notifactions.filter((notif) => notif.username !== body.username);

  //           console.log(notificationList.length);
  //           notificationList.forEach((notif) => {
  //           // let obj = {userId: notif.username,  folderId: notif.folder_id}
  //             console.log(global.users);
  //             if (global.users.some((e) => e.userId === notif.username && e.folderId === notif.folder_id)) {
  //               notificationModel
  //                 .increment('notifications', { by: 1, where: { id: notif.id } })
  //                 .then((notification) => {
  //                   io.to(`${notif.folder_id}_notification_${notif.username}`).emit(SocketEvents.NEWNOTIFICATION, { notifcation: notification });
  //                 });
  //             }
  //           });
  //         })
  //         .catch((error) => console.log(error));
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // });

  client.on(SocketEvents.LEAVEFOLDER, (body) => {
    const list = global.users.filter(
      (user) => user.userId === body.username && user.folderId === body.folder_id,
    );

    global.users = global.users.filter((x) => !list.includes(x));
  });

  client.on('disconnect', () => {
    global.users = global.users.filter((user) => user.socketId !== client.id);
  });
};

module.exports = connection;
