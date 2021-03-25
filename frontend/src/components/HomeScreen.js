import React, { useEffect, useState } from 'react';
import Navbar from './Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faPaperPlane, faUser } from "@fortawesome/free-solid-svg-icons";
import {  Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';


import { connect } from 'react-redux';
import './HomeScreenStyle.css'


function HomeScreen(props) {

    const [userToDisplay, setUserToDisplay] = useState([])
    const [currentMsg, setCurrentMsg] = useState("")
    const [myContactId, setMyContactId] = useState("")
    const [myId, setMyId] = useState(null)
    const [modal, setModal] = useState(false);



    console.log(props.userToken,'<------token user')

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
        const handleGetCards = async () => {
            var rawResponse = await fetch('/show-card', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `tokenFront=${props.userToken}` 
            });
            var response = await rawResponse.json()
            setUserToDisplay(response.userToDisplay)
            console.log(response, '<)))------- USER TO DISPLAYFRONT');
        };
        handleGetId();
        handleGetCards();
    }, []);

    const sendMessage = async (e) => {
            const rawResponseDemand = await fetch(`/send-msg`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `msg=${currentMsg}&myContactId=${myContactId}&myId=${myId}`
            });
            setCurrentMsg('')    
            const responseDemand = await rawResponseDemand.json()
            toggle()
      }



      const toggle = () => setModal(!modal);
      console.log(currentMsg,'<---- mon message')

      console.log(userToDisplay,'<----- USER OK')
    var allUsers = userToDisplay.map((e, key) => {
        return (
            <div className='cardContentContainer' key={key}>
                <div className='topCard' >
                    <Link to={`/usersprofilscreen/${e.token}`} className='linkTo' >
                        <img src={e.avatar} className='avatarCard' to="/usersprofilscreen"/>
                    </Link>
                    <div className='pseudoContainer' >
                        <p className='pseudoText' >{e.pseudo}</p>
                    </div>
                    <div className='fromContainer' >
                        <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '10px' }}  />
                        <p className='from' >Région {e.localisation == undefined ? "non-renseignée" : `de ${e.localisation.label}`}</p>
                    </div>
                </div>
                <div className='descriptionContainer' >
                    <p className='titleCard' >En quelques mots:</p>
                    <p className='problemDesc' >{e.problem_description == '' ? "Cet utilisateur n'a pas de descritption" : e.problem_description}</p>
                </div>
                <div className='problemContainer' >
                    <p className='titleCard'>Type(s) de souci(s)</p>
                    <div className='badgeContainer'>
                    {e.problems_types.map((element, key) => {
                        return (
                            <div className='badgeProblem' key={key}>
                                <p className='textBadgeProblem' >{element}</p>
                            </div>
                        )
                    })}
                    </div>
                </div>
                <div className='buttonContainer'>
                
                    <button className='buttonCard' onClick={() => { toggle(); setMyContactId(e._id) }} >
                        <FontAwesomeIcon icon={faPaperPlane}/>
                    </button>
                    <Link to={`/usersprofilscreen/${e.token}`} >
                    <button className='buttonCard' onClick={() => {  }}>
                        <FontAwesomeIcon icon={faUser} />
                    </button>
                    </Link>
                </div>
            </div>
        )
    })


    return (
        <div className="homeScreenContainer">
            <Navbar />
            <div className='cardsContainer'>
                {allUsers}
            </div>
            <Modal isOpen={modal} toggle={toggle}  >
                        <ModalHeader>Ton message</ModalHeader>
                        <ModalBody>
                            <input
                                type='text'
                                placeholder='Rédige ton message'
                                className='messageTextHome'
                                value={currentMsg}
                                onChange={(element) => setCurrentMsg(element.target.value)} />
                            <button className='buttonCardModal' onClick={sendMessage} >
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </button>
                        </ModalBody>
                        
            </Modal>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        userToken: state.userToken,
        
    }
}


export default connect(
    mapStateToProps,
    null
)(HomeScreen);

