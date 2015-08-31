angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    title: 'Steve Jobs miraculously comes back to life to tell joke!',
    image: 'https://slimgur.com/images/2015/08/29/65f6e6390514cd743e7ed0e03cad7933.jpg'
  }, {
    id: 1,
    title: 'Who wore it better?',
    image: 'https://i.imgur.com/q7m31TM.jpg'
  }, {
    id: 2,
    title: 'Neural algorithm that "paints" photos based on the style of a given painting',
    image: 'https://i.imgur.com/sb8dHcY.png'
  }, {
    id: 3,
    title: 'beautiful golden beach, Cornwall (1334 x 750) OC',
    image: 'https://i.imgur.com/EiqVgXq.jpg'
  }, {
    id: 4,
    title: 'As big as a tennis court and as tall as a four-story building, a full-scale model of the James Webb Space Telescope model was on display at the South by Southwest Interactive Festival in Austin, Texas. NASAs JWST is the successor to Hubble and the largest space telescope to ever be built',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/James_Webb_Telescope_Model_at_South_by_Southwest.jpg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
