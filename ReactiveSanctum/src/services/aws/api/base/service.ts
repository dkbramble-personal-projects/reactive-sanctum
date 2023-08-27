
import { getAWSAuthStatusOrLogin, retrieveAWSAuthResponse } from '../../auth/service';
import { Config } from 'react-native-config';

var BASE_URL = Config.AWS_API_BASE_URL!;

export const putRequest = async <T> (url: string, bodyString: string): Promise<T | null> => {
    var isAuthed = await getAWSAuthStatusOrLogin(true);
    var awsAuthResponse = await retrieveAWSAuthResponse();

    if (awsAuthResponse && isAuthed){
        var authToken = awsAuthResponse.idToken;

        var response = await fetch(BASE_URL + url, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
            body: bodyString,
        });

        if (response.ok){
            const res = (await response.json()) as any;
            const result : T = res;

            return result;
        } else {
            console.log('Failed post request: ' + response.status );
            console.log('Failed post request: ' + JSON.stringify(response) );
            return null;
        }
    }

    return null;
};

export const getRequest = async <T> (url: string): Promise<T | null> => {
    var isAuthed = await getAWSAuthStatusOrLogin(true);
    var awsAuthResponse = await retrieveAWSAuthResponse();

    if (awsAuthResponse && isAuthed){
        var authToken = awsAuthResponse.idToken;

        var response = await fetch(BASE_URL + url, {
            method: 'GET',
            headers: {
              'content-type': 'application/json',
              'Authorization': 'Bearer ' + authToken,
            },
        });

        if (response.ok){
            const res = (await response.json()) as any;
            const result : T = res;

            return result;
        } else {
            console.log('Failed get request: ' + response.status );
            return null;
        }
    }

    return null;
};

export const deleteRequest = async (url: string): Promise<boolean> => {
    var isAuthed = await getAWSAuthStatusOrLogin(true);
    var awsAuthResponse = await retrieveAWSAuthResponse();

    if (awsAuthResponse && isAuthed){
        var authToken = awsAuthResponse.idToken;

        var response = await fetch(BASE_URL + url, {
            method: 'DELETE',
            headers: {
              'content-type': 'application/json;',
              'Authorization': `Bearer ${authToken}`,
            },
        });

        if (response.ok){
            return true;
        } else {
            console.log('Failed delete request: ' + response.status );
            return false;
        }
    }

    return false;
};

export const patchRequest = async (url: string, bodyString: string): Promise<boolean> => {
    var isAuthed = await getAWSAuthStatusOrLogin(true);
    var awsAuthResponse = await retrieveAWSAuthResponse();

    if (awsAuthResponse && isAuthed){
        var authToken = awsAuthResponse.idToken;

        console.log(BASE_URL + url);

        var response = await fetch(BASE_URL + url, {
            method: 'PATCH',
            headers: {
              'content-type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
            body: bodyString,
        });

        if (response.ok){
            return true;
        } else {
            console.log('Failed patch request: ' + response.status );
            return false;
        }
    }

    return false;
};


