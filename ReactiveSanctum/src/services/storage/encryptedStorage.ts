import EncryptedStorage from 'react-native-encrypted-storage';

export const storeValue = async function (key: string, value: string) : Promise<void> {
    try {
        await EncryptedStorage.setItem(
            key,
            value
        );
    } catch (error) {
        console.log('Error Storing Value for ' + key);
    }
};

export const retrieveValue = async function (key: string) : Promise<string | null> {
    try {
        const value = await EncryptedStorage.getItem(key);

        if (value === null) {
            console.log('No value found for ' + key);
        }

        return value;

    } catch (error) {
        console.log('Error Retrieving Value for ' + key);
        return null;
    }
}
