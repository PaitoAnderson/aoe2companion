import {Alert, Linking, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {FontAwesome, FontAwesome5} from "@expo/vector-icons";
import {Divider, Menu} from 'react-native-paper';
import {getRootNavigation} from "../../service/navigation";
import {useNavigationStateExternal} from "../../hooks/use-navigation-state-external";
import * as Notifications from "expo-notifications";
import {RootStackParamList} from "../../../App";
import Space from "./space";
import {createStylesheet} from '../../theming-new';
import {getTranslation} from '../../helper/translate';
import {setIngame, setPrefValue, useMutate, useSelector} from '../../redux/reducer';
import {saveCurrentPrefsToStorage} from '../../service/storage';
import {fetchMatchWithFallback, isBirthday, moProfileId} from '@nex/data';
import {
    getElectron,
    isElectron,
    useLastNotificationReceivedElectron,
    useLastNotificationResponseElectron
} from '../../helper/electron';
import {useLastNotificationResponseWeb} from '../../helper/pusher';
import {IQueryRow} from "./search-query";
import {openLink} from "../../helper/url";
import {appConfig} from "@nex/dataset";


export default function Footer() {
    const styles = useStyles();
    const [menu, setMenu] = useState(false);
    const navigationState = useNavigationStateExternal();
    const activeRoute = navigationState?.routes[0];
    const auth = useSelector(state => state.auth);
    const birthdayRead = useSelector(state => state.prefs.birthdayRead);
    const mutate = useMutate();

    const nav = async (route: keyof RootStackParamList, params?: any) => {
        const navigation = getRootNavigation();
        navigation.reset({
            index: 0,
            routes: [{name: route, params}]
        });
    };

    const nav2 = (event: any, item: IQueryRow) => {
        const navigation = getRootNavigation();
        console.log(item);
        const { unit, building, tech, civ, build } = item;
        if (civ) {
            return navigation.navigate('Civ', { civ });
        }
        if (unit) {
            return navigation.navigate('Unit', { unit });
        }
        if (building) {
            return navigation.navigate('Building', { building });
        }
        if (tech) {
            return navigation.navigate('Tech', { tech });
        }
        if (build) {
            return navigation.navigate('Guide', { build });
        }
    };

    if (isElectron()) {
        useLayoutEffect(() => {
            const ipcRenderer = getElectron().ipcRenderer;
            ipcRenderer.on('navigate', nav2);
            return () => {
                ipcRenderer.removeListener('navigate', nav2);
            };
        }, []);
    }

    const iconStyle = (...routes: string[]) => {
        // console.log('currentRoute', activeRoute?.name);
        const isActiveRoute = routes.includes(activeRoute?.name!);
        return isActiveRoute ? styles.iconActive : styles.icon;
    };

    const iconStyle2 = (...routes: string[]) => {
        // console.log('currentRoute', activeRoute?.name);
        const isActiveRoute = routes.includes(activeRoute?.name!);
        return isActiveRoute ? styles.iconActive2 : styles.icon2;
    };

    const iconPopupStyle = (...routes: string[]) => {
        const isActiveRoute = routes.includes(activeRoute?.name!);
        return isActiveRoute ? styles.iconActive : styles.iconInPopup;
    };

    // Workaround need for cavy to not throw "React state update" exception
    if (!__DEV__) {
        const response = Notifications.useLastNotificationResponse();
        useEffect(() => {
            if (response && response.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
                console.log('response (FOOTER)', response);
                nav('Feed', { match_id: response.notification.request.content.data.match_id });
            }
        }, [response]);
    }

    if (isElectron()) {
        const response = useLastNotificationResponseElectron();
        useEffect(() => {
            if (response) {
                console.log('response (FOOTER)', response);
                nav('Feed', { match_id: response.data.match_id });
            }
        }, [response]);
    }

    if (isElectron()) {
        const receivedNotification = useLastNotificationReceivedElectron();
        useEffect(() => {
            if (receivedNotification) {
                console.log('received (FOOTER)', receivedNotification);
                fetchMatchWithFallback('aoe2de', { match_id: receivedNotification.data.match_id }).then(match => {
                    mutate(setIngame(match, match.players.find(p => p.profile_id === auth?.profile_id)!));
                });
            }
        }, [receivedNotification]);
    }

    if (Platform.OS === 'web' && !isElectron()) {
        const response = useLastNotificationResponseWeb();
        useEffect(() => {
            if (response) {
                console.log('response (FOOTER)', response);
                nav('Feed', { match_id: response.data.match_id });
            }
        }, [response]);
    }

    const secondAlert = () => {
        Alert.alert('🎉  Happy Birthday  🎉', '\n...und alles Gute wünscht dir\n\nDennis',
            [
                {text: 'Danke', style: "cancel", onPress: () => {
                    mutate(setPrefValue('birthdayRead', true));
                    saveCurrentPrefsToStorage();
                }},
            ],
            {cancelable: false}
        );
    };

    const firstAlert = () => {
        Alert.alert('Ein Brief für Mo!', '',
            [
                {text: 'Öffnen', style: "cancel", onPress: secondAlert},
            ],
            {cancelable: false}
        );
    };

    useEffect(() => {
        if (auth?.profile_id === moProfileId && isBirthday() && !birthdayRead) {
            firstAlert();
        }
    }, []);

    const iconSize = 22;

    const useIcon = (name: string, page?: string) => (props: any) => <FontAwesome5 name={name} {...props} style={[styles.menuIcon, iconPopupStyle(page || '')]} size={iconSize} solid />;

    // const myprops: any = {
    //     onMouseEnter: () => console.log('ENTERED'),
    //     onMouseLeave: () => console.log('LEFT'),
    // };

    return (
            <View style={styles.container}>
                <View style={styles.menu}>
                    {
                        auth?.profile_id === moProfileId && isBirthday() &&
                        <>
                            <TouchableOpacity style={styles.menuButton} onPress={() => nav('Search')}>
                                <FontAwesome5 name="glass-cheers" size={iconSize} style={iconStyle2('Search')} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuButton} onPress={() => nav('Feed')}>
                                <FontAwesome5 name="gift" size={iconSize} style={iconStyle2('Feed')} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuButton} onPress={() => nav('User')}>
                                <FontAwesome5 name="birthday-cake" size={iconSize} style={iconStyle2('User')} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuButton} onPress={() => nav('Leaderboard')}>
                                <FontAwesome5 name="glass-cheers" size={iconSize} style={iconStyle2('Leaderboard')} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuButton} onPress={() => nav('Civ')}>
                                <FontAwesome5 name="gift" size={iconSize} style={iconStyle2('Civ')} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuButton} onPress={() => nav('Guide')}>
                                <FontAwesome5 name="birthday-cake" size={iconSize} style={iconStyle2('Guide')} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuButtonDots} onPress={() => setMenu(true)}>
                                <FontAwesome name="ellipsis-v" size={iconSize} style={iconStyle2('Tech', 'Unit', 'Building', 'About', 'Settings', 'Changelog')} />
                            </TouchableOpacity>
                        </>
                    }
                    {
                        !(auth?.profile_id === moProfileId && isBirthday()) &&
                        <>
                            <TouchableOpacity style={styles.menuButton} onPress={() => nav('Search')}>
                                <FontAwesome name="search" size={iconSize} style={iconStyle('Search')} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuButton} onPress={() => nav('Feed')}>
                                <FontAwesome name="heart" size={iconSize} style={iconStyle('Feed')} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuButton} onPress={() => nav('User')}>
                                <FontAwesome name="user" size={iconSize} style={iconStyle('User')} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuButton} onPress={() => nav('Leaderboard')}>
                                <FontAwesome name="trophy" size={iconSize} style={iconStyle('Leaderboard')} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuButton} onPress={() => nav('Civ')}>
                                <FontAwesome5 name="landmark" size={iconSize} style={iconStyle('Civ')} />
                            </TouchableOpacity>
                            {
                                appConfig.game === 'aoe2de' &&
                                <TouchableOpacity style={styles.menuButton} onPress={() => nav('Guide')}>
                                    <FontAwesome name="graduation-cap" size={iconSize} style={iconStyle('Guide')} />
                                </TouchableOpacity>
                            }
                            <TouchableOpacity style={styles.menuButtonDots} onPress={() => setMenu(true)}>
                                <FontAwesome name="ellipsis-v" size={iconSize} style={iconStyle('Tech', 'Unit', 'Building', 'About', 'Settings', 'Changelog')} />
                            </TouchableOpacity>
                        </>
                    }


                    {
                        appConfig.game === 'aoe2de' &&
                        <Menu
                            contentStyle={{marginBottom: 50}}
                            theme={{animation: {scale: 0}}}
                                visible={menu}
                                onDismiss={() => setMenu(false)}
                                anchor={
                                    <View><Space/></View>
                                }
                        >
                            <Menu.Item icon={useIcon('hands-helping')} titleStyle={iconPopupStyle('')} onPress={() => { openLink('https://discord.com/invite/gCunWKx'); setMenu(false); }} title={getTranslation('footer.help')} />
                            {/*<Menu.Item icon={useIcon('coffee')} titleStyle={iconPopupStyle('')} onPress={() => { nav('Donation'); setMenu(false); }} title={getTranslation('footer.buymeacoffee')} />*/}
                            {
                               Platform.OS !== 'ios' &&
                               <Menu.Item icon={useIcon('coffee')} titleStyle={iconPopupStyle('')} onPress={() => { openLink('https://www.buymeacoffee.com/denniskeil'); setMenu(false); }} title={getTranslation('footer.buymeacoffee')} />
                            }
                            <Divider />
                            <Menu.Item icon={useIcon('question-circle', 'About')} titleStyle={iconPopupStyle('About')} onPress={() => { nav('About'); setMenu(false); }} title={getTranslation('footer.about')} />
                            <Menu.Item icon={useIcon('exchange-alt', 'Changelog')} titleStyle={iconPopupStyle('Changelog')} onPress={() => { nav('Changelog'); setMenu(false); }} title={getTranslation('footer.changelog')} />
                            <Divider />
                            <Menu.Item icon={useIcon('cog', 'Settings')} titleStyle={iconPopupStyle('Settings')} onPress={() => { nav('Settings'); setMenu(false); }} title={getTranslation('footer.settings')} />
                            <Divider />
                            <Menu.Item icon={useIcon('lightbulb', 'Tips')} titleStyle={iconPopupStyle('Tips')} onPress={() => { nav('Tips'); setMenu(false); }} title={getTranslation('footer.tips')} />
                            <Divider />
                            <Menu.Item icon={useIcon('play', 'Live')} titleStyle={iconPopupStyle('Live')} onPress={() => { nav('Live'); setMenu(false); }} title={getTranslation('footer.lobbies')} />
                            <Divider />
                            <Menu.Item icon={useIcon('archway', 'Building')} titleStyle={iconPopupStyle('Building')} onPress={() => { nav('Building'); setMenu(false); }} title={getTranslation('footer.buildings')} />
                            <Menu.Item icon={useIcon('flask', 'Tech')} titleStyle={iconPopupStyle('Tech')} onPress={() => { nav('Tech'); setMenu(false); }} title={getTranslation('footer.techs')} />
                            <Menu.Item icon={useIcon('fist-raised', 'Unit')} titleStyle={iconPopupStyle('Unit')} onPress={() => { nav('Unit'); setMenu(false); }} title={getTranslation('footer.units')} />
                            <Divider />
                            <Menu.Item icon={useIcon('trophy', 'Winrates')} titleStyle={iconPopupStyle('Winrates')} onPress={() => { nav('Winrates'); setMenu(false); }} title={getTranslation('footer.winrates')} />
                        </Menu>
                    }
                    {
                        appConfig.game === 'aoe4' &&
                        <Menu
                            contentStyle={{marginBottom: 50}}
                            theme={{animation: {scale: 0}}}
                                visible={menu}
                                onDismiss={() => setMenu(false)}
                                anchor={
                                    <View><Space/></View>
                                }
                        >
                            <Menu.Item icon={useIcon('hands-helping')} titleStyle={iconPopupStyle('')} onPress={() => { openLink('https://discord.com/invite/gCunWKx'); setMenu(false); }} title={getTranslation('footer.help')} />
                            <Divider />
                            <Menu.Item icon={useIcon('question-circle', 'About')} titleStyle={iconPopupStyle('About')} onPress={() => { nav('About'); setMenu(false); }} title={getTranslation('footer.about')} />
                            <Menu.Item icon={useIcon('exchange-alt', 'Changelog')} titleStyle={iconPopupStyle('Changelog')} onPress={() => { nav('Changelog'); setMenu(false); }} title={getTranslation('footer.changelog')} />
                            <Divider />
                            <Menu.Item icon={useIcon('cog', 'Settings')} titleStyle={iconPopupStyle('Settings')} onPress={() => { nav('Settings'); setMenu(false); }} title={getTranslation('footer.settings')} />
                        </Menu>
                    }


                </View>
            </View>
    );
}

const useStyles = createStylesheet(theme => StyleSheet.create({
    menu: {
        // backgroundColor: 'yellow',
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-evenly',
        flex: 1,
    },
    menuIcon: {
        alignSelf: 'center'
    },
    iconInPopup: {
        color: theme.textNoteColor,
    },
    icon: {
        color: '#777',
    },
    iconActive: {
        color: theme.textColor,
        fontWeight: 'bold',
    },
    icon2: {
        color: '#050',
    },
    iconActive2: {
        color: '#0A0',
        fontWeight: 'bold',
    },
    menuButton: {
        // backgroundColor: 'blue',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        marginHorizontal: 2,
    },
    menuButtonDots: {
        // backgroundColor: 'blue',
        flex: 0.7,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        marginHorizontal: 2,
    },
    header: {
        // backgroundColor: 'blue',
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    container: {
        // backgroundColor: 'blue',
        backgroundColor: theme.backgroundColor,
        borderTopWidth: 1,
        borderTopColor: theme.borderColor,
        flexDirection: 'row',
        height: 48,
        paddingLeft: 16,
        paddingRight: 12, // because of three dots icon
    },
}));
