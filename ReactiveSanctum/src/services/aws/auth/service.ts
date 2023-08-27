import { AuthConfiguration, AuthorizeResult, ServiceConfiguration, authorize, refresh } from 'react-native-app-auth';
import { Config } from 'react-native-config';
import { retrieveValue, storeValue } from '../../storage/encryptedStorage';

export const AWS_AUTH_RESPONSE = 'aws_auth_response';

const getAWSAuthConfig = () : AuthConfiguration => {
    const serviceConfig : ServiceConfiguration = {
        authorizationEndpoint: Config.AWS_AUTH_URL + '/oauth2/authorize',
        tokenEndpoint: Config.AWS_AUTH_URL + '/oauth2/token',
        revocationEndpoint: Config.AWS_AUTH_URL + '/oauth2/revoke',
    };

    const config : AuthConfiguration = {
        clientId: Config.AWS_CLIENT_ID!,
        redirectUrl: Config.AWS_REDIRECT_URI!,
        scopes: [Config.AWS_SCOPES!],
        serviceConfiguration: serviceConfig,
    };

    return config;
};

export const awsLoginRequest = async (): Promise<AuthorizeResult | undefined> => {
    try {
        const result = await authorize(getAWSAuthConfig());

        await storeValue(AWS_AUTH_RESPONSE, JSON.stringify(result));

        return result;
    } catch (error: any) {
        console.log('Failed To Request AWS Token');
        console.log(error);
        console.log(error.code);
    }
};

export const getAWSAuthStatusOrLogin = async (loginIfNot: boolean): Promise<boolean> => {
    var authResult = await retrieveAWSAuthResponse();

    if (authResult && authResult.accessToken){
        if (authResult.accessTokenExpirationDate){
            if (isTokenExpired(authResult)) {
                if (authResult.refreshToken){
                    console.log('Access Token is Expired, Refreshing');
                    var refreshedToken = await refreshAwsToken(authResult);

                    if (refreshedToken) {
                        return true;
                    } else {
                        console.log('Refresh could not be generated');
                    }
                } else {
                    console.log('Expired but no refresh found');
                }
            } else {
                console.log('Token is not expired, all set');
                return true;
            }
        }
    } else {
        console.log('No Auth Token, requesting');
    }

    if (loginIfNot) {
        var result = await awsLoginRequest();

        if (result) {
            return true;
        }
    }

    return false;
};

export const isAWSLoggedIn = async (): Promise<boolean> => {
    var stringResponse = await retrieveValue(AWS_AUTH_RESPONSE);

    if (stringResponse) {
        var result =  JSON.parse(stringResponse!) as AuthorizeResult;
        return result && result.idToken?.length > 0 && !isTokenExpired(result);
    }

    return false;
};

function isTokenExpired(auth: AuthorizeResult) {
    var expireTimeInEpoch = (new Date(auth.accessTokenExpirationDate)).getTime();
    var currentTimeInEpoch = new Date().getTime();
    return expireTimeInEpoch <= currentTimeInEpoch;
}


export const retrieveAWSAuthResponse = async (): Promise<AuthorizeResult | null> => {
    var stringResponse = await retrieveValue(AWS_AUTH_RESPONSE);

    if (stringResponse) {
        return JSON.parse(stringResponse!);
    }

    return null;
};

export const refreshAwsToken = async (authResult: AuthorizeResult): Promise<AuthorizeResult | undefined>  => {
    if (authResult && authResult.refreshToken){
        try {
            console.log('Now Refreshing Token');
            var refreshedState = await refresh(getAWSAuthConfig(), {
                refreshToken: authResult.refreshToken,
            });

            if (refreshedState && refreshedState.accessToken) {
                console.log('Successfully Refreshed Token');

                authResult.accessToken = refreshedState.accessToken;
                authResult.accessTokenExpirationDate = refreshedState.accessTokenExpirationDate;
                authResult.idToken = refreshedState.idToken;
                authResult.tokenType = refreshedState.tokenType;

                await storeValue(AWS_AUTH_RESPONSE, JSON.stringify(authResult));
                return authResult;
            }

            await storeValue(AWS_AUTH_RESPONSE, JSON.stringify(null));

        } catch (error: any) {
            console.log('Failed To Refresh AWS Token');
            console.log(error);
            console.log(error.code);
        }
    }
    console.log('No Refresh Token Present');
};

