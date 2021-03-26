import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faHeart, faUsers, faMale, faBriefcase, faSchool, faGraduationCap } from "@fortawesome/free-solid-svg-icons";

import './SignUpStyle.css'

function SignUpScreen(props) {

    const [counter, setCounter] = useState(0)

    const handlePrevious = () => {
        setCounter(counter - 1)
    }

    const [email, setEmail] = useState('')
    const [errorEmail, setErrorEmail] = useState('')
    const handleSaveEmail = async () => {
        var rawResponse = await fetch('/email-check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `emailFront=${email}`
        });
        var response = await rawResponse.json()
        email === '' ? setErrorEmail('Veuillez renseigner une adresse email') : response.emailFound === true ? setErrorEmail(response.error) : setCounter(counter + 1)
    }

    const [password, setPassword] = useState('')
    const [errorPassword, setErrorPassword] = useState('')
    const handleSavePassword = () => {
        password === '' ? setErrorPassword('Veuillez créer votre mot de passe') : setCounter(counter + 1)
    }

    const [pseudo, setPseudo] = useState('')
    const [errorPseudo, setErrorPseudo] = useState('')

    const handleSavePseudo = async () => {
        var rawResponse = await fetch('/pseudo-check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `pseudoFront=${pseudo}`
        });
        var response = await rawResponse.json()
        pseudo === '' ? setErrorPseudo('Veuillez créer votre votre pseudo') : response.pseudoFound === true ? setErrorPseudo(response.error) : setCounter(counter + 1);
    }

    const [birthDate, setBirthDate] = useState(new Date())
    const [errorBirthDate, setErrorBirthDate] = useState('')
    const handleSaveBirthDate = () => {
        var dateCondition = (86400000 * 365) * 13
        var dateComparison = new Date() - new Date(birthDate)
        dateComparison < dateCondition ? setErrorBirthDate("Vous devez avoir 13 ans pour rejoindre l'application") : setCounter(counter + 1)
    }
    const [problemsTypes, setProblemsTypes] = useState([])
    const [errorProblems, setErrorProblems] = useState('')

    const handleAddProblem = (arg) => {
        var problemsCopy = [...problemsTypes];
        if (problemsCopy.includes(arg) === false) {
            problemsCopy.push(arg)
            setProblemsTypes(problemsCopy)
        } else {
            setProblemsTypes(problemsCopy.filter(e => e !== arg))
        }
    }
    const handleSaveProblems = async () => {
        if (problemsTypes.length === 0) {
            setErrorProblems('Veuillez sélectionner au moins un type de soucis')
        } else {
            var rawResponse = await fetch('/sign-up-first-step', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `emailFront=${email}&passwordFront=${password}&birthDateFront=${birthDate}&pseudoFront=${pseudo}&problemsFront=${JSON.stringify(problemsTypes)}`
            });
            var response = await rawResponse.json()
            props.onAddToken(response.userSaved.token)
            setCounter(counter + 1)
        }
    }
    return (
        <div className="signUpContainer">
            { counter === 0 ?
                <div className='progressStepContainer'>
                    <img src='./logo-faceless.png' className='logoSignUp'></img>
                    <div className='containerQuestionsStepSignUp'>
                        <p className='helloSignUp'>Salut,</p>
                        <p className='questionsStepSignUp'>c'est quoi ton email ?</p>
                        <input
                            type='email'
                            placeholder='exemple@gmail.com'
                            className='inputSignUp'
                            value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <button
                        className='saveStepSignUp'
                        onClick={() => handleSaveEmail()}>
                        enregistrer
                </button>
                    {errorEmail !== '' ? <p className='errorSignUp'>{errorEmail}</p> : null}
                </div>
                : counter === 1 ?
                    <div className='progressStepContainer'>
                        <img src='./logo-faceless.png' className='logoSignUp'></img>
                        <div className='containerQuestionsStepSignUp'>
                            <p className='questionsStepSignUp'>Crée ton mot de passe</p>
                            <input
                                type='password'
                                placeholder='******'
                                className='inputSignUp'
                                value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button
                            className='saveStepSignUp'
                            onClick={() => handleSavePassword()}>
                            enregistrer
                        </button>
                        {errorPassword !== '' ? <p className='errorSignUp'>{errorPassword}</p> : null}
                        <div className='containerPreviousButton'>
                            <button onClick={() => handlePrevious()} className='previousButton'><FontAwesomeIcon icon={faChevronLeft} style={{ marginRight: '10px' }} />Revoir</button>
                        </div>
                    </div>
                    : counter === 2 ?
                        <div className='progressStepContainer'>
                            <img src='./logo-faceless.png' className='logoSignUp'></img>
                            <div className='containerQuestionsStepSignUp'>
                                <p className='questionsStepSignUp'>Comment veux-tu<br />qu'on t'appelle ?</p>
                                <input
                                    type='text'
                                    placeholder='HelicoptereDeCombat778'
                                    className='inputSignUp'
                                    value={pseudo} onChange={(e) => setPseudo(e.target.value)} />
                            </div>
                            <button
                                className='saveStepSignUp'
                                onClick={() => handleSavePseudo()}>
                                enregistrer
                            </button>
                            {errorPseudo !== '' ? <p className='errorSignUp'>{errorPseudo}</p> : null}
                            <div className='containerPreviousButton'>
                                <button onClick={() => handlePrevious()} className='previousButton'><FontAwesomeIcon icon={faChevronLeft} style={{ marginRight: '10px' }} />Revoir</button>
                            </div>
                        </div>
                        : counter === 3 ?
                            <div className='progressStepContainer'>
                                <img src='./logo-faceless.png' className='logoSignUp'></img>
                                <div className='containerQuestionsStepSignUp'>
                                    <p className='questionsStepSignUp'>C'est quoi<br />ta date de naissance ?</p>
                                    <input
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        value={birthDate}
                                        type='date'
                                        className='inputSignUp'
                                    />
                                </div>
                                <button
                                    className='saveStepSignUp'
                                    onClick={() => handleSaveBirthDate()}>
                                    enregistrer
                        </button>
                                {errorBirthDate !== '' ? <p className='errorSignUp'>{errorBirthDate}</p> : null}
                                <div className='containerPreviousButton'>
                                    <button onClick={() => handlePrevious()} className='previousButton'><FontAwesomeIcon icon={faChevronLeft} style={{ marginRight: '10px' }} />Revoir</button>
                                </div>
                            </div>
                            : counter === 4 ?
                                <div className='progressStepContainer'>
                                    <img src='./logo-faceless.png' className='logoSignUp'></img>
                                    <div className='containerQuestionsStepSignUp'>
                                        <p className='questionsStepSignUp'>Types de soucis :</p>
                                        <div className={problemsTypes.includes(`Amoureux`) === false ? 'worriesContainer' : 'worriesContainerBis'} onClick={() => handleAddProblem('Amoureux')}>
                                            <FontAwesomeIcon icon={faHeart} style={{ marginRight: '10px', color: '#5571D7' }} />
                                            <p className='worriesText'>Amoureux</p>
                                        </div>
                                        <div className={problemsTypes.includes(`Familial`) === false ? 'worriesContainer' : 'worriesContainerBis'} onClick={() => handleAddProblem('Familial')}>
                                            <FontAwesomeIcon icon={faUsers} style={{ marginRight: '10px', color: '#5571D7' }} />
                                            <p className='worriesText'>Familial</p>
                                        </div>
                                        <div className={problemsTypes.includes(`Physique`) === false ? 'worriesContainer' : 'worriesContainerBis'} onClick={() => handleAddProblem('Physique')}>
                                            <FontAwesomeIcon icon={faMale} style={{ marginRight: '10px', color: '#5571D7' }} />
                                            <p className='worriesText'>Physique</p>
                                        </div>
                                        <div className={problemsTypes.includes(`Professionnel`) === false ? 'worriesContainer' : 'worriesContainerBis'} onClick={() => handleAddProblem('Professionnel')}>
                                            <FontAwesomeIcon icon={faBriefcase} style={{ marginRight: '10px', color: '#5571D7' }} />
                                            <p className='worriesText'>Professionnel</p>
                                        </div>
                                        <div className={problemsTypes.includes(`Scolaire`) === false ? 'worriesContainer' : 'worriesContainerBis'} onClick={() => handleAddProblem('Scolaire')}>
                                            <FontAwesomeIcon icon={faGraduationCap} style={{ marginRight: '10px', color: '#5571D7' }} />
                                            <p className='worriesText'>Scolaire</p>
                                        </div>
                                    </div>
                                    <button
                                        className='saveStepSignUp'
                                        onClick={() => handleSaveProblems()}>
                                        enregistrer
                        </button>
                                    {errorProblems !== '' ? <p className='errorSignUp'>{errorProblems}</p> : null}
                                    <div className='containerPreviousButton'>
                                        <button onClick={() => handlePrevious()} className='previousButton'><FontAwesomeIcon icon={faChevronLeft} style={{ marginRight: '10px' }} />Revoir</button>
                                    </div>
                                </div>
                                : counter === 5 ?
                                    <Redirect to='/sign-up-optionnal' /> : null}
        </div>
    );
}

function mapDispatchToProps(dispatch) {
    return {
        onAddToken: function (arg) {
            dispatch({ type: 'ADD_TOKEN', payload: arg })
        }
    }
}

export default connect(
    null,
    mapDispatchToProps
)(SignUpScreen);

