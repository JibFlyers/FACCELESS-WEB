import React, { useEffect, useState } from 'react';
import Navbar from './Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faCheck, faPen } from "@fortawesome/free-solid-svg-icons";
import {  Modal, ModalHeader, ModalBody } from 'reactstrap';

import { connect } from 'react-redux';
import './ProfilScreenStyle.css'

function ProfilScreen(props) {

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
    const [password, setPassword] = useState(""); /* Normalement utile pour la modification du password mais je n'ai pas eu le temps de la gérer */
    const [problemDescription, setProblemDescription] = useState("");
    const [emailVisible, setEmailVisible] = useState(false);
    const [isValidated, setIsValidated] = useState(false);
    const [saveButton, setSaveButton] = useState(false);
    const [descriptionVisible, setDescriptionVisible] = useState(false);
    const [token, setToken] = useState("");

useEffect(() => {
    const handleGetProfil = async () => {
        var rawResponse = await fetch('/show-profil', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `tokenFront=${props.userToken}`
        });
        var response = await rawResponse.json()
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


const onChangeCity = async (arg) => {
    setCitySearch(arg);
    setCityVisible(true)
    if (citySearch.length > 2) {
        var rawResponse = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${citySearch}&type=municipality&autocomplete=1`)
        var response = await rawResponse.json()
        console.log(response,'<---- LES VILLES')
        response.features.map(e => {
            cityList.push({
                label: e.properties.label,
                coordinates: e.geometry.coordinates,
            })
        })
        setCity(cityList);
    }
}


const handleSelectGender = (arg) => {
    setGender(arg)
}

const handleSelectProblems = (element) => {
    var problemsCopy = [...problemsTypes];
    if (problemsCopy.includes(element) == false) {
      problemsCopy.push(element);
      setProblemsTypes(problemsCopy);
    } else {
      problemsCopy = problemsCopy.filter((e) => e != element);
      setProblemsTypes(problemsCopy);
    }
  };

  var imgAvatarSrc = [
    "https://i.imgur.com/HgBDc9B.png",
    "https://i.imgur.com/NBYvxKX.png",
    "https://i.imgur.com/urOQgGD.png",
    "https://i.imgur.com/clPw5Nx.png",
    "https://i.imgur.com/Wm5vVmF.png",
    "https://i.imgur.com/YSesoUz.png",
    "https://i.imgur.com/mMzuMuT.png",
    "https://i.imgur.com/EHaBuT9.png",
    "https://i.imgur.com/21c3YgT.png",
    "https://i.imgur.com/17T5sWH.png",
    "https://i.imgur.com/97zBLZM.png",
    "https://i.imgur.com/aK9HbPT.png",
    "https://i.imgur.com/T7wBkkk.png",
    "https://i.imgur.com/fJYbMZO.png",
  ];

  var imgAvatar = imgAvatarSrc.map((url, key) => {
    return (
        <img
          src={ url } className='avatarProfilModal' key={key} url={url} onClick={() => { setAvatar(url); setVisibleAvatar(!visibleAvatar); toggle() }} />
    );
  });

    
const toggle = () => setModal(!modal);

const handleSaveChange = () => {
    var problemsTypeStringify = JSON.stringify(problems);

    async function updateUser() {

      var rawResponse = await fetch(`/update-profil`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `tokenFront=${props.userToken}&avatarFront=${avatar}&emailFront=${email}&localisationFront=${JSON.stringify(localisation)}&passwordFront=${password}&genderFront=${gender}&descriptionProblemFront=${problemDescription}&problemsTypeFront=${JSON.stringify(problemsTypes)}`,
      });
      var response = await rawResponse.json();

      if (response.userSaved.avatar) {
        setAvatar(response.userSaved.avatar);
      }

      if (response.userSaved.email) {
        setEmail(response.userSaved.email);
        setEmailVisible(false);
      }

      if (response.userSaved.localisation) {
        setLocalisation(response.userSaved.localisation);
        setCityVisible(false);
      }


      if (response.userSaved.gender) {
        setGender(response.userSaved.gender);
      }

      if (response.userSaved.problem_description) {
        setProblemDescription(response.userSaved.problem_description);
      }

      if (response.userSaved.problems_types) {
        setProblems(response.userSaved.problems_types);
      }
    }
    updateUser();
    setIsValidated(true);

    setTimeout(function () {
      setIsValidated(false);
    }, 1200);
  };

  const handlePressEmail = () => {
    setEmailVisible(!emailVisible);
    setSaveButton(true);
  };

  const handlePressDesc = () => {
    setDescriptionVisible(!descriptionVisible);
    setSaveButton(true);
  };

  const handleChangeDesc = (e) => {
    setProblemDescription(e.target.value)
}

  const handleChangeEmail = (e) => {
      setEmail(e.target.value)
  }



return (
        <div className="ProfilScreenContainer">
            <Navbar />

            <div className='profilContainer'>
                <div className='title'><p>Mon Profil</p></div>
                <div className='topProfil'>
                    <img src={avatar} className='avatarProfil' onClick={toggle}/>
                    <Modal isOpen={modal} toggle={toggle}  >
                        <ModalHeader >Choisis ton avatar</ModalHeader>
                        <ModalBody >
                        {imgAvatar}
                        </ModalBody>
                    </Modal>
                    <div className='infoContainer'>
                            <p className='pseudoText'>{userProfil.pseudo}</p>
                                {!emailVisible ? (
                                <div className='mailContainer'>
                                    <p className='emailText'>{email}</p>
                                    <button className="iconButton" onClick={handlePressEmail}>
                                        <FontAwesomeIcon icon={faPen} />
                                    </button>
                                </div>
                                ) : (
                                <div className='mailContainer'>
                                    <input
                                    type='text'
                                    className='emailText'
                                    onChange={handleChangeEmail}
                                    placeholder={'Ton email'}
                                    />
                                    <button className="buttonDesc" onClick={handleChangeEmail, handlePressEmail}><FontAwesomeIcon icon={faCheck}  color="white" /></button>
                                </div>
                                )}
                    </div>                
                </div>
                <div className='midContainer'>
                    <div className='cityContainer'>
                <p className='titleCard'>Change ta ville :</p>
                            <input
                                type='text'
                                placeholder={localisation.label}
                                className='inputSignUpProfil'
                                value={citySearch.label}
                                onChange={(e) => onChangeCity(e.target.value)} />
                            {cityVisible ? city.map((e, key) => {
                                return (
                                    <div className='cityListSignUpOptionnal' onClick={() => { setCitySearch({ label: e.label, coordinates: e.coordinates }); setCityVisible(false);  setLocalisation({ label: e.label, coordinates: e.coordinates }) }}>
                                        <p className='cityText' key={key}>{e.label}</p>
                                    </div>
                                )
                            }) : null}
                            </div>
                <div className='containerQuestionsStepSignUpProfil'>
                                <p className='titleCard'>Genre :</p>
                                <div className='genderContainer'>
                                    <div onClick={() => handleSelectGender('other')}>
                                        <img src={gender === 'other' ? './gender_1_selected.png' : './gender_1.png'} />
                                    </div>
                                    <div onClick={() => handleSelectGender('female')}>
                                        <img src={gender === 'female' ? './gender_female_selected.png' : './gender_female.png'} />
                                    </div>
                                    <div onClick={() => handleSelectGender('male')}>
                                        <img src={gender === 'male' ? './gender_male_selected.png' : './gender_male.png'} />
                                    </div>
                                </div>
                            </div>
                </div>
                <div className='descriptionContainer'>
                    <div className='descriptionModif'>
                        <p className='titleCard'>En quelques mots:</p>
                        <button className="iconButton" onClick={handlePressDesc}>
                            <FontAwesomeIcon icon={faPen}  />
                        </button>
                    </div>
                    {!descriptionVisible ? (
                                <div className='problemDesc'>
                                    <p className='problemDesc'>{problemDescription == '' ? "Tu n'as pas encore écrit de description." : problemDescription}</p>                                </div>
                                ) : (
                                <div className='textAreaProblem'>
                                    <textarea
                                    type='text'
                                    className='inputSignUpDesc'
                                    onChange={handleChangeDesc}
                                    placeholder={'Je complète ma description'}
                                    style={{ width: '60%', height:'100px'}}
                                    multiline
                                    onKeyPress
                                    />
                                    <button className="buttonDesc" onClick={handleChangeDesc, handlePressDesc}><FontAwesomeIcon icon={faCheck} color="white" /></button>
                                </div>
                                )}
                </div>
                
                <div className='problemContainer'>
                    <p className='titleCard'>Type(s) de souci(s)</p>
                    <div >
                    <div className='badgeContainer'>
                        <button
                        onClick={() => {
                            handleSelectProblems(`Amoureux`);
                        }}
                        className={
                            problemsTypes.includes("Amoureux") ? 'badgeProblem' : 'badgeProblemBis'
                        }
                        >
                        <p className='textBadgeProblem'>Amoureux</p>
                        </button>
                        <button
                        onClick={() => {
                            handleSelectProblems(`Familial`);
                        }}
                        className={
                            problemsTypes.includes("Familial") ? 'badgeProblem' : 'badgeProblemBis'
                        }
                        >
                        <p className='textBadgeProblem'>Familial</p>
                        </button>
                        <button
                        onClick={() => {
                            handleSelectProblems(`Physique`);
                        }}
                        className={
                            problemsTypes.includes("Physique") ? 'badgeProblem' : 'badgeProblemBis'
                        }
                        >
                        <p className='textBadgeProblem'>Physique</p>
                        </button>
                        <button
                        onClick={() => {
                            handleSelectProblems(`Professionnel`);
                        }}
                        className={
                            problemsTypes.includes("Professionnel") ? 'badgeProblem' : 'badgeProblemBis'
                        }
                        >
                        <p className='textBadgeProblem'>Professionnel</p>
                        </button>
                        <button
                        onClick={() => {
                            handleSelectProblems(`Scolaire`);
                        }}
                        className={
                            problemsTypes.includes("Scolaire") ? 'badgeProblem' : 'badgeProblemBis'
                        }
                        >
                        <p className='textBadgeProblem'>Scolaire</p>
                        </button>
                    </div>
                </div>
                </div>
                <div className='buttonContainer'>
                    <button
                    onClick={handleSaveChange}
                    className={!isValidated ? 'buttonProfil' : 'buttonProfilBis'}
                    >
                    {isValidated ? (<FontAwesomeIcon icon={faCheck} size={24} color="white" />
                    ) : (
                        <p className='textBadgeProblem'> enregistrer</p>)}
                    </button>
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
)(ProfilScreen);