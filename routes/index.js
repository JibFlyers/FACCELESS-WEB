var express = require('express');
var router = express.Router();
const UserModel = require('../models/users');
const ConversationsModel = require('../models/conversations')
const MessagesModel = require('../models/messages');

// node module pour chiffrer le mot de passe
var bcrypt = require('bcrypt');

// permet la génération d'un token avec des chiffres et des lettres aléatoires 
var uid2 = require('uid2');
const cost = 10;

var ObjectId = require('mongodb').ObjectId;
const { request } = require('express');
const { count } = require('../models/users');


// Route permettant de vérifier si l'email existe déjà.
router.post('/email-check', async function(req, res, next) {
  var user = await UserModel.findOne({email: req.body.emailFront});  
  user ? res.json({emailFound: true, error: 'Cet email est déjà associé à un compte'}) : res.json({emailFound: false})
});


// Route permettant de vérifier si le pseudo existe déjà.
router.post('/pseudo-check', async function(req, res, next) {
  var user = await UserModel.findOne({pseudo: req.body.pseudoFront});  
  user ? res.json({pseudoFound: true, error: 'Ce pseudo existe déjà, veuillez en utiliser un autre'}) : res.json({pseudoFound: false})
});


// route permettant la connexion
router.post('/sign-in', async function (req, res, next) {

  var result = false;
  let user = null;
  var error = [];
  var token = null;

  if (req.body.emailFromFront == ''
    || req.body.passwordFromFront == ''
  ) {
    error.push('champs vides')
  }

  user = await UserModel.findOne({
    email: req.body.emailFromFront,
  })

  if (user) {
    if (bcrypt.compareSync(req.body.passwordFromFront, user.password)) {
      token = user.token
      result = true
    } else {
      error.push('mot de passe incorrect')
    }
  } else {
    error.push('email incorrect')
  }

  res.json({ result, user, token, error });
});


// Route pour la première étape (obligatoire) de l'inscription
router.post('/sign-up-first-step', async function(req, res, next) {
  
  // on crypte le mot de passe
  const hash = bcrypt.hashSync(req.body.passwordFront, cost);
  var birthDate = new Date(req.body.birthDateFront)
  var dateToday = new Date()
  var dateCompare = dateToday - birthDate
  var conditionDate = (86400000 * 365) * 18
  var isAdult;

  if (dateCompare > conditionDate) {
    isAdult = true
  } else {
    isAdult = false
  }

  //On crée le user en base
  var newUser = await new UserModel({
    email: req.body.emailFront,
    password: hash,
    pseudo: req.body.pseudoFront,
    birthDate: birthDate,
    problems_types: JSON.parse(req.body.problemsFront),
    is_adult: isAdult,
    token: uid2(32),
    subscription_date: new Date(),
    statut: 'active',
  });  

  var userSaved = await newUser.save()

  res.json({result: true, userSaved:userSaved})
});


// Second étape d'inscription (facultative) pour ajouter des informations au user
router.post('/sign-up-second-step', async function (req, res, next) {

  var localisation = req.body.localisation;
  var gender = req.body.genderFront;
  var problemDesc = req.body.problemDescriptionFront;
  var avatar = req.body.avatarFront;
  req.body.localisationFront == 'undefined' || req.body.localisationFront == undefined ? localisation = {label: 'France'} : localisation = JSON.parse(req.body.localisationFront);
  req.body.genderFront == 'undefined' ? gender = '' : gender = req.body.genderFront;
  req.body.problemDescriptionFront == 'undefined' ? problemDesc = '' : problemDesc = req.body.problemDescriptionFront;
  req.body.avatarFront == 'undefined' ? avatar = 'hhttps://i.imgur.com/atDrheA.png' : avatar = req.body.avatarFront;

  // On va aller mettre à jour le user précédemment créé en base.
  var user = await UserModel.updateOne(
    { token: req.body.tokenFront }, 
    {
      problem_description: problemDesc,
      gender: gender,
      localisation: localisation,
      avatar: avatar,
    }
  );

  var userUpdated = await UserModel.findOne({ token: req.body.tokenFront })
  var result;
  userUpdated ? result = true : result = false

  res.json({ result: result, userUpdated:userUpdated });
})


// Cette route permet d'afficher les profils des autres utilisateurs sur la homepage
router.post('/show-card', async function (req, res, next) {

  //On va chercher tous les users dont le token est différent de l'utilisateur connecté.
  var userToDisplay = await UserModel.find({token: { $ne: req.body.tokenFront }})

  res.json({userToDisplay})
})


// Cette route permet de renvoyer les informations nécessaires à l'affichage d'un profil.
router.post('/show-profil', async function (req, res, next) {

  var userProfil = await UserModel.findOne({token: req.body.tokenFront })
  var label = userProfil.localisation.label

  res.json({userProfil, label})

})


// Cette route permet de mettre à jour le profil de l'utilisateur connecté.
router.post("/update-profil", async function (req, res, next) {

  var userBeforeUpdate = await UserModel.findOne({ token: req.body.tokenFront })
  var problemsTypeParse = JSON.parse(req.body.problemsTypeFront)

  // Modification des informations de l'utilisateur s'il a choisi de modifier un champ.
  await UserModel.updateOne(
    { token: req.body.tokenFront },
    {
      avatar: req.body.avatarFront,
      email: req.body.emailFront,
      localisation: JSON.parse(req.body.localisationFront),
      password: req.body.passwordFront == "" ? userBeforeUpdate.password : hash,
      gender: req.body.genderFront,
      problem_description: req.body.descriptionProblemFront,
      problems_types: problemsTypeParse,
    }
  );


  var userAfterUpdate = await UserModel.findOne({ token: req.body.tokenFront })

  var result;
  userAfterUpdate ? result = true : result = false

  res.json({ userSaved: userAfterUpdate, result });
});


// Cette route permet d'afficher les conversations que j'ai avec quelques infos et les derniers messages reçu ou envoyés.
router.post('/show-msg', async function (req, res, next) {

  var myUser = await UserModel.findOne({ token: req.body.tokenFront });

  var myConversations = await ConversationsModel.find({ participants: myUser._id });

  var myLastMessages = [];

  await Promise.all(myConversations.map(async (element, i) => {

    // construit un tableau listant le dernier message de chaque conversation
    var lastMessage = await MessagesModel.findOne({conversation_id: element._id}).sort({date: -1})
    var userId;

    element.participants[0].toString() === myUser._id.toString() ? userId = element.participants[1] : userId = element.participants[0];

    var userConv = await UserModel.findOne({_id: userId})

    myLastMessages.push({
      lastMessageContent: lastMessage.content, 
      dateLastMessage: lastMessage.date,
      conversationId: lastMessage.conversation_id, 
      myId: myUser._id, 
      userId: userId,
      userAvatar: userConv.avatar,
      userPseudo: userConv.pseudo,
    })
  }))

  res.json({ allConversations: myLastMessages, myConversations:myConversations})
})


// récupère l'id utilisateur à partir du token
router.post('/get-id-from-token', async function (req, res, next) {
  
  const me = await UserModel.findOne({ token: req.body.tokenFront })

  if (me) {
    res.json({
      error: false,
      id: me._id
    })
  } else {
    res.json({
      error: true,
      id: undefined,
    })
  }
})


// sPermet d'afficher la conversation avec un autre utilisateur.
router.post('/show-convers', async function (req, res, next) {

  var myConversations = JSON.parse(req.body.myConvers)

  for (let i=0; i<myConversations.length; i++) {
    var findConvers = myConversations[i].participants.find(element=> element == req.body.idUser);
    if ( findConvers != null) {
      findConvers = myConversations[i]
      var conversId = findConvers._id
    }
  };

  var allMessagesWithOneUser = await MessagesModel.find(
    { conversation_id: conversId }
  ).sort({ date: 1 });

  res.json({ allMessagesWithOneUser:allMessagesWithOneUser})
});


// Permet d'envoyer un message à un autre utilisateur.
router.post('/send-msg', async function (req, res, next) {

  const searchConvWithUser = await ConversationsModel.findOne({
    participants: { $all: [req.body.myId, req.body.myContactId] }
  })

  // vérifie qu'une conversation existe déjà, sinon ccela crée une coonversation
  if (searchConvWithUser != null) {

  var msg = new MessagesModel({
    conversation_id: searchConvWithUser._id,
    from_id: req.body.myId,
    to_id: req.body.myContactId,
    content: req.body.msg,
    date: new Date(),
    read: false
  })

  var newMsg = await msg.save()

} else {
  var conv = new ConversationsModel({
    participants: [req.body.myContactId, req.body.myId],
    demand: true
  })
  var newConv = await conv.save()
}
  let demandEnd = false

  if (searchConvWithUser.demand) {
    var allMsg = await MessagesModel.find(
      { conversation_id: searchConvWithUser._id }
    )

    for (var i = 0; i < allMsg.length; i++) {
      if (allMsg[i].to_id == req.body.myId) {
        var updateStatusConv = await ConversationsModel.updateOne(
          { _id: searchConvWithUser._id },
          { demand: false }
        );
        demandEnd = true
      }
    }
  }

  res.json({ result: true, demandEnd });
});


module.exports = router;
