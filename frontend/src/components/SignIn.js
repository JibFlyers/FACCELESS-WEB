import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import "./SignInStyle.css";

function SignIn(props) {
    const [signInEmail, setSignInEmail] = useState("");
    const [signInPassword, setSignInPassword] = useState("");

    const [userExists, setUserExists] = useState(false);

    const [listErrorsSignIn, setErrorsSignIn] = useState([])

    var handleSubmitSignIn = async () => {
        const rawData = await fetch(`/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `emailFromFront=${signInEmail}&passwordFromFront=${signInPassword}`,
        });
        const data = await rawData.json();

        if (data.result == true) {
            props.addToken(data.token)
            setUserExists(true);
        }

        if (data.error) {
            setErrorsSignIn(data.error);
        }
    };

    if (userExists) {
        return <Redirect to="/home" />;
    }

    var ErrorToDisplay = listErrorsSignIn.map((error, i)=>{
        return (<p className="emailError">{error}</p>)
    })

    return (
        <div className="containerSignIn">
        <div className="setupSignIn">
            <p className="titleSignIn">Hello,</p>
            <p className="textSignIn">Bon retour parmi nous !</p>
            <input
            type="email"
            className="inputSignIn"
            placeholder="Ton email"
            onChange={(e) => setSignInEmail(e.target.value)}
            value={signInEmail}
            />
            <input
            type="password"
            className="inputSignIn"
            placeholder="Ton mot de passe"
            onChange={(e) => setSignInPassword(e.target.value)}
            value={signInPassword}
            />
            {ErrorToDisplay}
            <div className="divBoutonValider">
            <button className="bouton" onClick={() => handleSubmitSignIn()}>
                valider
            </button>
            </div>
        </div>
        </div>
    );
}

function mapDispatchToProps(dispatch){
    return {
      addToken: function(arg){
        dispatch({type: 'ADD_TOKEN', payload: arg})
      }
    }
  }

export default connect(
    null,
    mapDispatchToProps
)(SignIn)
