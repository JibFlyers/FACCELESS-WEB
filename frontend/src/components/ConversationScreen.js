import React, { useEffect, useState } from 'react';
import Navbar from './Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faCircle, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import {  Modal, ModalHeader, ModalBody } from 'reactstrap';
import SwitchSelector from "react-switch-selector";
import { Link, Router, Switch, Route, Redirect } from 'react-router-dom';
import moment from "moment";
import 'moment/locale/fr'


import { connect } from 'react-redux';
import './ConversationScreenStyle.css'

function ConversationScreen(props) {
  

    const [token, setToken] = useState(null)
    const [myId, setMyId] = useState(null)
    const [conversations, setConversations] = useState([])
    const [myConversations, setMyConversations] = useState([])
    const [unreadPerConversation, setUnreadPerConversation] = useState([])
    const [part, setPart] = useState('')
    const [nbDemand, setNbDemand] = useState(0)
    const [goodConvers, setGoodConvers] = useState({})
    const [data, setData] = useState([])
    const [myContactId, setMyContactId] = useState("")
    const [currentMsg, setCurrentMsg] = useState("")
    const [disableSendBtn, setDisableSendBtn] = useState(true)
    const [demandEnd, setDemandeEnd] = useState(false)


console.log(currentMsg)


  //   let demandEnd = null;
  // if (props.route && props.route.params && props.route.params.demandEnd) {
  //   demandEnd = props.route.params.demandEnd
  // }

  // console.log(props.userToken,'<------token')

    const loadConversations = async (params) => {
        // console.log('loadConversations - myId', myId)
        if (myId) { // l'id obtenue à partir du token existe bien
          let uri = `/show-msg?user_id=${myId}`
          if (params && params.demandes) {
            uri += `&demandes=oui`
          }
          const dialogues = await fetch(uri, { method: 'GET' })
    
          const dialoguesWithFriends = await dialogues.json()
          // console.log('dialoguesWithFriends.conversations = ', dialoguesWithFriends.conversations)
          setConversations(dialoguesWithFriends.conversations)
          setNbDemand(dialoguesWithFriends.nbNewConversations)
    
          let nolu = []
          dialoguesWithFriends.conversations.forEach(element => {
            nolu.push(element.nbUnreadMsg)
          });
          setUnreadPerConversation(nolu)
        }
    }


    useEffect(() => {
      const handleGetId = async () => {
          var rawResponse = await fetch('/get-id-from-token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: `tokenFront=${props.userToken}`
          });
          var response = await rawResponse.json()
          setMyId(response.id)
      };
      const handleGetConvers = async () => {
        var rawConvers = await fetch('/show-msg', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `tokenFront=${props.userToken}`
        });
        var convers = await rawConvers.json()
        setConversations(convers.allConversations);
        setMyConversations(convers.myConversations);
    };
      handleGetId();
      handleGetConvers();
      loadConversations({ demandes: false })
  }, [myId]);

  useEffect(() => {

    loadConversations({ demandes: false })

  }, [demandEnd])

  // useEffect(() => {
  //   // au focus du screen, le contenu de la page se réinitialise à interval 3 secondes
  //   // quand on quitte le screen, l'interval est stoppé
  //   if (isFocused) {
  //     const interval = setInterval(() => loadConversations({ demandes: false }), 3000)
  //     if (part === 'demandes') {
  //       clearInterval(interval)
  //     }
  //     return () => {
  //       // console.log('fin')
  //       clearInterval(interval)
  //     }
  //   }

  // }, [myId, isFocused, part])


  const handleMessage = (e) => {
  }

  const sendMessage = async (e) => {
    setDisableSendBtn(true)
        const rawResponseDemand = await fetch(`/send-msg`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `msg=${currentMsg}&myContactId=${myContactId}&myId=${myId}`
        });
        setCurrentMsg('')
        handleGetMessages({idUser: myContactId, monId: myId})

        const responseDemand = await rawResponseDemand.json()

        if (responseDemand.demandEnd) {
            setDemandeEnd(responseDemand.demandEnd)
        }
  }

  console.log(myConversations, '<)))------- CONVERS RETOUR');

  const handleGetMessages = async (e) => {
      setMyContactId(e.idUser)
      var rawMessages = await fetch('/show-convers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `myConvers=${JSON.stringify(myConversations)}&idUser=${e.idUser}`
      });
      var messages = await rawMessages.json()
      setData(messages.allMessagesWithOneUser)
    }

          console.log(data, '<)))------- CONVERS RESPONSE');
          let dateCheck
          let dateToShow

 var tabMsg = data.map((item, i) => {
  let when = new Date(item.date)
  // let whenFormat = when.toLocaleDateString('fr-FR', { weekday: 'short', month: 'numeric', day: 'numeric' })
  //     + ' à ' + when.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  let hours = when.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  let date = when.toLocaleDateString('fr-FR', { weekday: 'long', month: 'short', day: 'numeric' })
  if (date != dateCheck) {
    dateCheck = date
    dateToShow = dateCheck
} else {
    dateToShow = null
}
  if (item.to_id === myContactId) {
    return (
        <div key={i}>
            <p className="dateMessage">{dateToShow}</p>
            <div className="message">
                    <div className="blocRight">
                        <div className="msgRight">
                            <p className="textRight" >{item.content}</p>
                        </div>
                    </div>
            </div>
        </div>)

} else {
    return (
        <div key={i}>
            <p className="dateMessage">{dateToShow}</p>
            <div className="message">
                    <div className="blocLeft">
                        <div className="msgLeft">
                            <p className="textLeft" >{item.content}</p>
                        </div>
                    </div>
            </div>
        </div>
    )
}
 })

 console.log(conversations,'<--- A reprendre pour last message')
const items = []
for (let i=0; i<conversations.length; i++ ) {
  moment.locale('fr');
  var NewDate = moment(conversations[i].dateLastMessage).format('Do MMMM YYYY h:mm')
    // if (el.lastMessage && el.friendsDatas) {
      let when = new Date(conversations[i].date)
      let whenFormat = when.toLocaleDateString('fr-FR', { weekday: 'short', month: 'short', day: 'numeric' })
        + ' à ' + when.toLocaleTimeString('fr-FR')

    items.push(
        <div className='conversCard' onClick={()=>{handleGetMessages({idUser: conversations[i].userId, monId: myId})}}>
          <img src={conversations[i].userAvatar} className='avatarConvers' />
          <div className='infoConvers' >
            <p className='pseudoConvers' >{conversations[i].userPseudo}</p>
            <p className='dateMessage' >{NewDate}</p>
            <p className='lastMessage' >{conversations[i].lastMessageContent}</p>
          </div>
        </div>)}

return ( 
<div className="ConversationScreenContainer">
    <Navbar />
    <div className="container">
      {
        <div className="main">
          <div className="mainTitle"><p>Messagerie</p></div>
          <div className="mainContainer">
            <div className="conversContainer">
            {
              conversations.length > 0 ?
                <div className="conversations">
                  {items}
                </div>
                :

                <div className="ScrollView">
                  {
                    <div style={{ textAlign: 'center', marginTop: 30 }}>
                      <p style={{ textAlign: 'center', marginBottom: 30 }}>{ part === 'confidents' ? 'Vous n\'avez pas de confident !' : 'Vous n\'avez aucune demande !'}</p>
                      <Link to="/home"><button className='buttonConversation'><p className='textButtonConversation'>Rechercher des confident(e)s</p></button></Link>
                    </div>
                  }
                </div>
            }
            </div>
            <div className='messagerieContainer'>
            <p className="messageTitle">Conversation</p>
            <div className="messageContainer">
            {tabMsg}
            </div>
            <div className='sendMessage'>
              <input
                            type='text'
                            placeholder='Rédige ton message'
                            className='messageText'
                            value={currentMsg}
                            onChange={(element) => setCurrentMsg(element.target.value)} />
              <button className="iconButton" onClick={sendMessage}>
                <FontAwesomeIcon icon={faPaperPlane}  color="#5571D7"/>
              </button>
            </div>
            </div>
          </div>
          
        </div>
      }
    </div>
</div>
)
}

function mapStateToProps(state) {
    return {
        userToken: state.userToken,
    }
}

export default connect(
    mapStateToProps,
    null
)(ConversationScreen);