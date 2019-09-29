const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');

const config = require('./config');

const poolData = {    
    UserPoolId : config.UserPoolId, // Your user pool id here    
    ClientId : config.ClientId // Your client id here
}; 
const pool_region = config.Region;

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

function RegisterUser(authData, userdata){
    var attributeList = [];
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"name",Value:userdata.name}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"preferred_username",Value:userdata.nickname}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"gender",Value:userdata.gender}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"birthdate",Value:userdata.birthdate}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"address",Value:userdata.address}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"email",Value:userdata.email}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"phone_number",Value:userdata.tel}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"custom:scope",Value:userdata.scope}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"picture",Value:userdata.pict ? userdata.pict : "https://static.thenounproject.com/png/17241-200.png"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"locale",Value:userdata.country}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"profile",Value:userdata.profile ? userdata.profile : ""}));

    userPool.signUp(authData.email, authData.password, attributeList, null, function(err, result){
        if (err) {
            console.log(err);
            return;
        }
        cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
    });
}

function Login(authData) {
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username : authData.email,
        Password : authData.password,
    });

    var userData = {
        Username : authData.email,
        Pool : userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            console.log('access token + ' + result.getAccessToken().getJwtToken());
            console.log('id token + ' + result.getIdToken().getJwtToken());
            console.log('refresh token + ' + result.getRefreshToken().getToken());
        },
        onFailure: function(err) {
            console.log(err);
        },

    });
}

function update(authData){
        var attributeList = [];
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: "custom:scope",
            Value: "some new value"
        }));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: "name",
            Value: "some new value"
        }));
  
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: authData.email,
            Password: authData.password,
        });

        var userData = {
            Username: authData.email,
            Pool: userPool
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.updateAttributes(attributeList, (err, result) => {
            if (err) {
                //handle error
            } else {
                console.log(result);
            }
        });
}

function ValidateToken(token) {
        request({
            url: `https://cognito-idp.${pool_region}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                pems = {};
                var keys = body['keys'];
                for(var i = 0; i < keys.length; i++) {
                    //Convert each key to PEM
                    var key_id = keys[i].kid;
                    var modulus = keys[i].n;
                    var exponent = keys[i].e;
                    var key_type = keys[i].kty;
                    var jwk = { kty: key_type, n: modulus, e: exponent};
                    var pem = jwkToPem(jwk);
                    pems[key_id] = pem;
                }
                //validate the token
                var decodedJwt = jwt.decode(token, {complete: true});
                if (!decodedJwt) {
                    console.log("Not a valid JWT token");
                    return;
                }

                var kid = decodedJwt.header.kid;
                var pem = pems[kid];
                if (!pem) {
                    console.log('Invalid token');
                    return;
                }

                jwt.verify(token, pem, function(err, payload) {
                    if(err) {
                        console.log("Invalid Token.");
                    } else {
                        console.log("Valid Token.");
                        console.log(payload);
                    }
                });
            } else {
                console.log("Error! Unable to download JWKs");
            }
        });
}

function renew(username) {
    const RefreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({RefreshToken: "your_refresh_token_from_a_previous_login"});

    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    const userData = {
        Username: username,
        Pool: userPool
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.refreshSession(RefreshToken, (err, session) => {
        if (err) {
            console.log(err);
        } else {
            let retObj = {
                "access_token": session.accessToken.jwtToken,
                "id_token": session.idToken.jwtToken,
                "refresh_token": session.refreshToken.token,
            }
            console.log(retObj);
        }
    })
}

function DeleteUser(authData) {
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: authData.email,
            Password: authData.password,
        });

        var userData = {
            Username: authData.email,
            Pool: userPool
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                cognitoUser.deleteUser((err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Successfully deleted the user.");
                        console.log(result);
                    }
                });
            },
            onFailure: function (err) {
                console.log(err);
            },
        });
}

function deleteAttributes(authData){
        var attributeList = [];
        attributeList.push("custom:scope");
        attributeList.push("name");
  
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: authData.email,
            Password: authData.password,
        });

        var userData = {
            Username: authData.email,
            Pool: userPool
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.deleteAttributes(attributeList, (err, result) => {
            if (err) {
                //handle error
            } else {
                console.log(result);
            }
        });
}

function ChangePassword(authData, newpassword) {
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: authData.email,
            Password: authData.password,
        });

        var userData = {
            Username: authData.email,
            Pool: userPool
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                cognitoUser.changePassword(authData.password, newpassword, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Successfully changed password of the user.");
                        console.log(result);
                    }
                });
            },
            onFailure: function (err) {
                console.log(err);
            },
        });
}

module.exports = {
	RegisterUser,
	Login,
	update,
	ValidateToken,
	renew,
	DeleteUser,
	deleteAttributes,
	ChangePassword
};
