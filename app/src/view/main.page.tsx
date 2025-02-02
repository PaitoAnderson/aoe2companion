import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {UserId} from '../helper/user';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {setAuth, useMutate, useSelector} from '../redux/reducer';
import {useNavigationState} from "@react-navigation/native";
import {TabBarLabel} from "./components/tab-bar-label";
import {fetchPlayerMatches, LeaderboardId} from "@nex/data";
import {useCachedConservedLazyApi} from "../hooks/use-cached-conserved-lazy-api";
import {get, set} from 'lodash';
import {getStats} from "../service/stats";
import {FontAwesome5} from "@expo/vector-icons";
import MainProfile from "./main/main-profile";
import MainStats from "./main/main-stats";
import MainMatches from "./main/main-matches";
import {createStylesheet} from '../theming-new';
import {getTranslation} from '../helper/translate';


export function mainMenu() {
    return () => {
        return <MainMenu/>;
    }
}

export function MainMenu() {
    const styles = useStyles();
    const mutate = useMutate();
    const auth = useSelector(state => state.auth!);

    const deleteUser = () => {
        if (Platform.OS === 'web') {
            if (confirm("Do you want to reset me page?")){
                doDeleteUser();
            }
        } else {
            Alert.alert(getTranslation('main.profile.reset.title'), getTranslation('main.profile.reset.note'),
                [
                    {text: getTranslation('main.profile.reset.action.cancel'), style: "cancel"},
                    {text: getTranslation('main.profile.reset.action.reset'), onPress: doDeleteUser,}
                ],
                {cancelable: false}
            );
        }
    };

    const doDeleteUser = async () => {
        await AsyncStorage.removeItem('settings');
        mutate(setAuth(null))
    };

    if (auth == null) {
        return <View/>;
    }

    return (
        <View style={styles.menu}>
            <TouchableOpacity style={styles.menuButton} onPress={deleteUser}>
                <FontAwesome5 style={styles.menuIcon} name="user-times" size={16} />
            </TouchableOpacity>
        </View>
    );
}

const Tab = createMaterialTopTabNavigator();

interface MainPageInnerProps {
    user: UserId;
}

// export default function MainPage() {
//     const mutate = useMutate();
//     const auth = useSelector(state => state.auth);
//
//     const generateTestHook = useCavy();
//     const navigation = useNavigation<RootStackProp>();
//     generateTestHook('Navigation')(navigation);
//
//     const onSelect = async (user: UserInfo) => {
//         await saveSettingsToStorage({
//             id: composeUserId(user),
//             steam_id: user.steam_id,
//             profile_id: user.profile_id,
//         });
//         mutate(setAuth(user));
//     };
//
//
//     const nav = async (route: keyof RootStackParamList, params: any) => {
//         // const navigation = getRootNavigation();
//         navigation.reset({
//             index: 0,
//             routes: [{name: route, params}],
//             stale: true,
//         });
//     };
//
//     // Reset country for use in leaderboard country dropdown
//     useEffect(() => {
//         if (auth == null) {
//             mutate(setPrefValue('country', undefined));
//             saveCurrentPrefsToStorage();
//         }
//     }, [auth]);
//
//     useEffect(() => {
//         if (auth != null) {
//             nav('User', {
//                 id: userIdFromBase(auth),
//                 name: 'Walter White',
//             });
//         }
//     }, [auth]);
//
//     if (auth == null) {
//         return <Search title="Enter your AoE username to track your games:" selectedUser={onSelect} actionText="Choose" />;
//     }
//
//     return <View><MyText>Redirecting to user page...</MyText></View>
//
//     // return <MainPageInner user={auth}/>
// }

export function MainPageInner({ user }: MainPageInnerProps) {
    const loadingMatchesOrStatsTrigger = useSelector(state => state.loadingMatchesOrStats);
    const leaderboardId = useSelector(state => state.prefs.leaderboardId) ?? LeaderboardId.RM1v1;

    const currentTabIndex = useNavigationState(state => {
        const mainState = state.routes[state.index].state;

        // Direct navigation to child tab via web browser
        if (mainState && mainState.index == null && mainState.routes.length === 1) {
            return ['MainProfile', 'MainStats', 'MainMatches'].indexOf(mainState.routes[0].name);
        }
        return mainState?.index ?? 0;
    });

    console.log('CACHED API ACCESS', user.id);

    let allMatches = useCachedConservedLazyApi(
        [currentTabIndex, loadingMatchesOrStatsTrigger],
        () => currentTabIndex > 0,
        state => get(state, ['user', user.id, 'matches']),
        (state, value) => set(state, ['user', user.id, 'matches'], value),
        fetchPlayerMatches, 'aoe2de', 0, 1000, [user]
    );

    useCachedConservedLazyApi(
        [allMatches.data, leaderboardId],
        () => allMatches.data != null,
        state => get(state, ['statsPlayer', user.id, leaderboardId]),
        (state, value) => set(state, ['statsPlayer', user.id, leaderboardId], value),
        getStats, {matches: allMatches.data, user: user, leaderboardId}
    );

    return (
            <Tab.Navigator lazy={true} swipeEnabled={true}>
                <Tab.Screen name="MainProfile" options={{title: 'AoE II Companion', tabBarLabel: (x) => <TabBarLabel {...x} title={getTranslation('main.heading.profile')}/>}} component={MainProfile} />
                <Tab.Screen name="MainStats" options={{title: 'AoE II Companion', tabBarLabel: (x) => <TabBarLabel {...x} title={getTranslation('main.heading.stats')}/>}} component={MainStats} />
                <Tab.Screen name="MainMatches" options={{title: 'AoE II Companion', tabBarLabel: (x) => <TabBarLabel {...x} title={getTranslation('main.heading.matches')}/>}} component={MainMatches} />
            </Tab.Navigator>
    );
}

const useStyles = createStylesheet(theme => StyleSheet.create({
    menu: {
        // backgroundColor: 'red',
        flexDirection: 'row',
        flex: 1,
        marginRight: 10,
    },
    menuButton: {
        // backgroundColor: 'blue',
        width: 35,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        marginHorizontal: 2,
    },
    menuIcon: {
        opacity: 0.5,
        color: theme.textColor,
    },
}));
