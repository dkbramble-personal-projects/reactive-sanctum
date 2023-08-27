import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageResponse } from '../../models/storage/asyncStorage';

export async function StoreData<T>(key: string, value: T): Promise<void>{
    try {
        var valueToStore = new AsyncStorageResponse(value, new Date().getTime());
        await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.log('There was an issue storing data for key: ' + key);
        console.error(error);
      }
}

export async function RetrieveData<T>(key: string): Promise<AsyncStorageResponse<T> | null>{
    try {
        var result = await AsyncStorage.getItem(key);
        if (result) {
            return JSON.parse(result) as AsyncStorageResponse<T>;
        }
      } catch (error) {
        console.log('There was an issue retrieving data for key: ' + key);
        console.error(error);
      }

      return null;
}
