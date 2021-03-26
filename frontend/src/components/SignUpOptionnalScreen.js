import React, { useState } from 'react';
import {connect} from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import './SignUpStyle.css'
import { Redirect } from 'react-router-dom';


function SignUpOptionnalScreen(props) {

    var imgAvatarSrc = [
        'https://i.imgur.com/HgBDc9B.png',
        'https://i.imgur.com/fJYbMZO.png',
        'https://i.imgur.com/clPw5Nx.png',
        'https://i.imgur.com/Wm5vVmF.png',
        'https://i.imgur.com/urOQgGD.png',
        'https://i.imgur.com/NBYvxKX.png',
        'https://i.imgur.com/YSesoUz.png',
        'https://i.imgur.com/97zBLZM.png',
        'https://i.imgur.com/mMzuMuT.png',
        'https://i.imgur.com/17T5sWH.png',
        'https://i.imgur.com/21c3YgT.png',
        'https://i.imgur.com/aK9HbPT.png',
        'https://i.imgur.com/EHaBuT9.png',
        'https://i.imgur.com/T7wBkkk.png',
    ]

    const handlePrevious = () => {
        counter !== 0 ? setCounter(counter - 1) : setCounter(0)
    }
    const handleNext = async () => {
        setCounter(counter + 1)
        if(counter === 3) {
            var rawResponse = await fetch('/sign-up-seconde-step', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `problemDescriptionFront=${problemDesc}
                        &genderFront=${gender}
                        &localisationFront=${JSON.stringify(citySearch)}
                        &avatarFront=${avatar}
                        &tokenFront=${props.userToken}`
            });
            var response = await rawResponse.json()
            setCounter(counter+1)            
        }
    }
    const [counter, setCounter] = useState(0)

    const [problemDesc, setProblemDesc] = useState('')
    const handleSaveProblemDesc = () => {
        setCounter(counter + 1)
    }

    const [city, setCity] = useState([])
    const [citySearch, setCitySearch] = useState('')
    const [cityVisible, setCityVisible] = useState(true)
    var cityList = [];

    const handleSaveCity = () => {
        setCounter(counter + 1)
    }
    console.log(citySearch, '<------ city search')
    const onChangeCity = async (arg) => {
        setCitySearch(arg);
        setCityVisible(true)
        if (citySearch.length > 2) {
            var rawResponse = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${citySearch}&type=municipality&autocomplete=1`)
            var response = await rawResponse.json()
            response.features.map(e => {
                cityList.push({
                    label: e.properties.label,
                    coordinates: e.geometry.coordinates,
                })
            })
            setCity(cityList);
        }
    }

    const [gender, setGender] = useState('')
    const handleSelectGender = (arg) => {
        setGender(arg)

    }

    const handleSaveGender = () => {
        setCounter(counter + 1)
    }

    const [avatar, setAvatar] = useState('https://i.imgur.com/atDrheA.png')
    const handleSelectAvatar = (arg) => {
        setAvatar(arg)
    }

    const handleSaveAvatar = async () => {
        var rawResponse = await fetch('/sign-up-second-step', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `problemDescriptionFront=${problemDesc}&genderFront=${gender}&localisationFront=${JSON.stringify(citySearch)}&avatarFront=${avatar}&tokenFront=${props.userToken}`
        });
        var response = await rawResponse.json()
        setCounter(counter+1)   
    }

    return (
        <div className="signUpContainer">
            { counter === 0 ?
                <div className='progressStepContainer'>
                    <img src='./logo-faceless.png' className='logoSignUp'></img>
                    <div className='containerQuestionsStepSignUp'>
                        <p className='questionsStepSignUp'>Tu veux décrire ton <br />soucis ?</p>
                        <input
                            type='text'
                            placeholder='description'
                            className='inputSignUp'
                            value={problemDesc}
                            onChange={(element) => setProblemDesc(element.target.value)} />
                    </div>
                    <button
                        className='saveStepSignUp'
                        onClick={() => handleSaveProblemDesc()}>
                        enregistrer
                </button>
                </div>
                : counter === 1 ?
                    <div className='progressStepContainer'>
                        <img src='./logo-faceless.png' className='logoSignUp'></img>
                        <div className='containerQuestionsStepSignUp'>
                            <p className='questionsStepSignUp'>Tu viens d'où ?</p>
                            <input
                                type='text'
                                placeholder='votre ville'
                                className='inputSignUp'
                                value={citySearch.label}
                                onChange={(e) => onChangeCity(e.target.value)} />
                            {cityVisible ? city.map((e, key) => {
                                return (
                                    <div className='cityListSignUpOptionnal' onClick={() => { setCitySearch({ label: e.label, coordinates: e.coordinates }); setCityVisible(false) }}>
                                        <p className='cityText' key={key}>{e.label}</p>
                                    </div>
                                )
                            }) : null}
                        </div>
                        <button
                            className='saveStepSignUp'
                            onClick={() => handleSaveCity()}>
                            enregistrer
                        </button>
                    </div>
                    : counter === 2 ?
                        <div className='progressStepContainer'>
                            <img src='./logo-faceless.png' className='logoSignUp'></img>
                            <div className='containerQuestionsStepSignUp'>
                                <p className='questionsStepSignUp'>Tu es ?</p>
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
                            <button
                                className='saveStepSignUp'
                                onClick={() => handleSaveGender()}>
                                enregistrer
                </button>
                        </div>
                        : counter === 3 ?
                            <div className='progressStepContainer'>
                                <img src='./logo-faceless.png' className='logoSignUp'></img>
                                <div className='containerQuestionsStepSignUp'>
                                    <img style={{width: '20%', height: 'auto', marginBottom: '5%'}} src={avatar}></img>
                                    <p className='questionsStepSignUp'>Sélectionne ton avatar !</p>
                                    <div className='avatarContainer'>
                                       { imgAvatarSrc.map((e, key) => { return(
                                            <img key={key} className={avatar === e ? 'avatarBis' : 'avatar'} src={e} onClick={() => handleSelectAvatar(e)} />
                                        )})}
                                    </div>
                                </div>
                                <button
                                    className='saveStepSignUp'
                                    onClick={() => handleSaveAvatar()}>
                                    enregistrer
                </button>
                            </div>
                            : counter === 4 ? <Redirect to='/home' /> : null}
            <div className='containerPreviousOptionnal'>
                <button className='previousButton' onClick={() => handlePrevious()}><FontAwesomeIcon icon={faChevronLeft} style={{ marginRight: '10px' }} />Revoir</button>
                <button className='nextButton' onClick={() => handleNext()}>Passer<FontAwesomeIcon icon={faChevronRight} style={{ marginLeft: '10px' }} /></button>
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
   )(SignUpOptionnalScreen);

