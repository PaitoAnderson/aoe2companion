import {captureImage} from "./capture";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from "@react-navigation/stack";
import {MaterialTopTabNavigationProp} from "@react-navigation/material-top-tabs";
import {RootStackParamList, RootTabParamList} from '../../App2';

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

let imageNumber = 0;

async function capture() {
    console.log('CAPTURE');
    await captureImage('screen-' + imageNumber++);
}

const waitTime = 6000;

export default function (spec: any) {

    spec.describe('App', function () {

        spec.it('all', async function () {
            await AsyncStorage.removeItem('settings');
            await AsyncStorage.setItem('following', '[{"id":"76561197984749679-196240","steam_id":"76561197984749679","profile_id":196240,"name":"GL.TheViper","games":2243,"country":"NO"},{"id":"76561198011417995-254415","steam_id":"76561198011417995","profile_id":254415,"name":"Modri","games":1168,"country":"SI"},{"id":"76561198083128303-2413974","steam_id":"76561198083128303","profile_id":2413974,"name":"Roggy","games":2298,"country":"TR"}]');
            // console.log(await AsyncStorage.getItem('following'));

            await sleep(1000);

            const navigation = await spec.findComponent('Navigation') as StackNavigationProp<RootStackParamList, "Main">;
            const tabNavigation = await spec.findComponent('Navigation') as MaterialTopTabNavigationProp<RootTabParamList, "MainProfile">;

            // console.log('CAVY found navigation', navigation);

            return;

            navigation.reset({index: 0, routes: [{name: 'Feed'}]});
            await sleep(waitTime*2);
            await capture();
            await sleep(1000);

            // // navigation.reset({index: 0, routes: [{name: 'Main'}]});
            await spec.exists('Footer.Main');
            await spec.press('Footer.Main');
            await sleep(1000);

            await spec.exists('Search.Input');
            await spec.fillIn('Search.Input', 'hera');
            await sleep(waitTime);
            await capture();
            await sleep(1000);

            await spec.exists('Search.Player.199325-76561198449406083');
            await spec.press('Search.Player.199325-76561198449406083');
            await sleep(waitTime);
            await capture();

            tabNavigation.navigate('MainStats' as any);
            await sleep(waitTime*2);
            await capture();

            tabNavigation.navigate('MainMatches' as any);
            await sleep(waitTime);
            await capture();

            // navigation.navigate('Search', {});
            // await sleep(1000);
            //
            // await spec.exists('Search.Input');
            // await spec.fillIn('Search.Input', 'baratticus');
            // await sleep(waitTime);
            //
            // await spec.exists('Search.Player.76561198116899512-336655');
            // await spec.press('Search.Player.76561198116899512-336655');
            // await sleep(waitTime);
            // await capture();

            navigation.reset({index: 0, routes: [{name: 'Leaderboard'}]});
            await sleep(1000);
            await sleep(waitTime);
            await capture();

            // navigation.reset({index: 0, routes: [{name: 'Guide'}]});
            // await sleep(1000);
            // await sleep(waitTime);
            // await capture();

            navigation.reset({index: 0, routes: [{name: 'Civ'}]})
            await sleep(1000);
            await sleep(waitTime);
            await capture();

            navigation.reset({index: 0, routes: [{name: 'Civ'}, {name: 'Civ', params: {civ: 'Chinese'}}]})
            // navigation.reset({index: 0, routes: [{name: 'Civ'}, {name: 'Civ', params: {civ: 'Aztecs'}}]})
            await sleep(1000);
            await sleep(waitTime);
            await capture();

            // navigation.reset({index: 0, routes: [{name: 'Unit'}, {name: 'Unit', params: {unit: 'Arambai'}}]})
            // await sleep(1000);
            // await sleep(waitTime);
            // await capture();
        });
    });
}
