import React, { useEffect, useState } from 'react';
import Navbar from './Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faCheck, faPen } from "@fortawesome/free-solid-svg-icons";
import {  Modal, ModalHeader, ModalBody } from 'reactstrap';


import { connect } from 'react-redux';
import './UsersProfilScreenStyle.css'

import moment from "moment";
import 'moment/locale/fr'

function UsersProfilScreen(props) {

    const [city, setCity] = useState([])
    const [userProfil, setUserProfil] = useState({});
    const [citySearch, setCitySearch] = useState('');
    const [cityVisible, setCityVisible] = useState(true);
    var cityList = [];
    const [gender, setGender] = useState('');
    const [problemsTypes, setProblemsTypes] = useState([]);
    const [problems, setProblems] = useState([]);
    const [avatar, setAvatar] = useState("");
    const [visibleAvatar, setVisibleAvatar] = useState(false);
    const [modal, setModal] = useState(false);
    const [email, setEmail] = useState("");
    const [localisation, setLocalisation] = useState({});
    const [password, setPassword] = useState("");
    const [problemDescription, setProblemDescription] = useState("");
    const [emailVisible, setEmailVisible] = useState(false);
    const [mdpVisible, setMdpVisible] = useState(false);
    const [isValidated, setIsValidated] = useState(false);
    const [saveButton, setSaveButton] = useState(false);
    const [descriptionVisible, setDescriptionVisible] = useState(false);
    const [token, setToken] = useState("");

    console.log(window.location.href,'Link');
// console.log(this.props.match.params.id, '<----- PARAMS RECUP')
    var id = window.location.href.slice(40)

    console.log(id)
useEffect(() => {
    const handleGetProfil = async () => {
        var rawResponse = await fetch('/show-profil', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `tokenFront=${id}`
        });
        var response = await rawResponse.json()
        console.log(response, '<)))------- USER PROFIL INFO');
        setUserProfil(response.userProfil)
        setGender(response.userProfil.gender)
        setProblemsTypes(response.userProfil.problems_types)
        setAvatar(response.userProfil.avatar)
        setEmail(response.userProfil.email)
        setLocalisation(response.userProfil.localisation)
        setProblemDescription(response.userProfil.problem_description)
        setToken(response.userProfil.token)
    };
    handleGetProfil();
}, []);

var genderImage = ''

if (gender === 'other') {
     genderImage = <img className="gender" src={'../gender_1.png'} />
} else if (gender === 'male' ) {
     genderImage = <img className="gender" src={'../gender_male.png'} />
} else if ( gender === 'female') {
     genderImage = <img className="gender" src={'../gender_female.png'} />

}

moment.locale('fr');
var NewDate = moment(userProfil.subscriptionDate).format('Do MMMM YYYY')

return (
        <div className="UserProfilScreenContainer">
            <Navbar />
            <div className='UserProfilContainer'>
                <div className='topUserProfil'>
                    <img src={avatar} className='avatarUserProfil'/>
                    
                    <div className='infoUserContainer'>
                            <p className='pseudoUserText'>{userProfil.pseudo}</p>
                            {genderImage}
                    </div>
                    <p className='dateUser'>Membre depuis le {NewDate}</p>                
                </div>
                <div className='midUserContainer'>
                <div className='descriptionUserContainer'>
                    <div className='descriptionUserModif'>
                        <p className='titleUserCard'>En quelques mots:</p>
                    </div>
                        <div className='problemUserDesc'>
                                    <p className='problemUserDesc'>{problemDescription == '' ? "Cette personne n'as pas encore de description." : problemDescription}</p>                                
                        </div>
                </div>    
                <div className='problemUserContainer'>
                    <p className='titleUserCard'>Type(s) de souci(s)</p>
                    <div className='badgeUserContainer'>
                        <button
                        className={
                            problemsTypes.includes("Amoureux") ? 'badgeProblem' : 'badgeProblemBis'
                        }
                        >
                        <p className='textUserBadgeProblem'>Amoureux</p>
                        </button>
                        <button
                        className={
                            problemsTypes.includes("Familial") ? 'badgeProblem' : 'badgeProblemBis'
                        }
                        >
                        <p className='textUserBadgeProblem'>Familial</p>
                        </button>
                        <button
                        className={
                            problemsTypes.includes("Physique") ? 'badgeProblem' : 'badgeProblemBis'
                        }
                        >
                        <p className='textUserBadgeProblem'>Physique</p>
                        </button>
                        <button
                        className={
                            problemsTypes.includes("Professionnel") ? 'badgeProblem' : 'badgeProblemBis'
                        }
                        >
                        <p className='textUserBadgeProblem'>Professionnel</p>
                        </button>
                        <button
                        className={
                            problemsTypes.includes("Scolaire") ? 'badgeProblem' : 'badgeProblemBis'
                        }
                        >
                        <p className='textUserBadgeProblem'>Scolaire</p>
                        </button>
                    </div>
                </div>
                </div>
            </div>
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
)(UsersProfilScreen);