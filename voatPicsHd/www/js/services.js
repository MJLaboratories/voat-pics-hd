angular.module('starter.services', [])

  .factory('Chats', ['$http', function ($http) {
  // Might use a resource here that returns a JSON array


    // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

    var voatData;
    var voatFrontPageURL = 'https://voat.co/api/frontpage';

    // fetch voat frontpage xml
    $http({
      method: 'GET',
      url: voatFrontPageURL,
    }).success(function (data) {

      for (var i = 0; i < data.length; i++) {
        var item = data[i];

        if (item === null || item.MessageContent === null) {
          continue;
        }

        if (item.MessageContent.indexOf('imgur') < 0) {
          continue;
        }

        item.id = item.Id;
        item.name = item.Name;
        item.lastText = item.LinkDescription;
        item.face = item.MessageContent;
      }

      voatData = data;
    }).error(function () {
      alert('error getting voat data');
    });




  return {
    all: function() {
      return voatData === null ? chats : voatData;
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
  }]);
