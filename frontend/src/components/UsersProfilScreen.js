import React, { useEffect, useState } from 'react';
import Navbar from './Navbar'

import { connect } from 'react-redux';
import './UsersProfilScreenStyle.css'

import moment from "moment";
import 'moment/locale/fr'

function UsersProfilScreen(props) {

    const [userProfil, setUserProfil] = useState({});
    const [gender, setGender] = useState('');
    const [problemsTypes, setProblemsTypes] = useState([]);
    const [avatar, setAvatar] = useState("");
    const [problemDescription, setProblemDescription] = useState("");

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
        setUserProfil(response.userProfil)
        setGender(response.userProfil.gender)
        setProblemsTypes(response.userProfil.problems_types)
        setAvatar(response.userProfil.avatar)
        setProblemDescription(response.userProfil.problem_description)
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