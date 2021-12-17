import {FlatList, Linking, Platform, StyleSheet, View} from "react-native";
import {
    clearMatchesPlayer, clearStatsPlayer, setLoadingMatchesOrStats, setPrefValue, useMutate, useSelector
} from "../../redux/reducer";
import {keysOf, LeaderboardId} from "@nex/data";
import React, {useEffect, useState} from "react";
import {RouteProp, useNavigation, useNavigationState, useRoute} from "@react-navigation/native";
import {RootStackParamList, RootTabParamList} from "../../../App";
import {get} from 'lodash';
import {usePrevious} from "@nex/data/hooks";
import {saveCurrentPrefsToStorage} from "../../service/storage";
import {MyText} from "../components/my-text";
import StatsPosition from "../components/stats-position";
import StatsCiv from "../components/stats-civ";
import StatsMap from "../components/stats-map";
import StatsPlayer from "../components/stats-player";
import TemplatePicker from "../components/template-picker";
import {TextLoader} from "../components/loader/text-loader";
import RefreshControlThemed from "../components/refresh-control-themed";
import {parseUserId} from "../../helper/user";
import StatsDuration from "../components/stats-duration";
import {createStylesheet} from '../../theming-new';
import {getTranslation} from '../../helper/translate';
import {useNavigationStateExternal} from '../../hooks/use-navigation-state-external';
import {getPathToRoute, getRoutes, getRoutesFromCurrentActiveStack} from '../../service/navigation';
import {useTheme} from '../../theming';
import {appVariants} from '../../styles';
import {openLink} from "../../helper/url";
import FlatListLoadingIndicator from "../components/flat-list-loading-indicator";
import {useWebRefresh} from "../../hooks/use-web-refresh";
import {leaderboardIdsData, leaderboardMappingData} from "@nex/dataset";


export default function MainStats() {
    const styles = useStyles();
    const appStyles = useTheme(appVariants);
    const route = useRoute();
    const navigationState = useNavigationStateExternal();
    let routes = getPathToRoute(navigationState, route.key);
    if (routes.length === 0) {
        routes = getRoutesFromCurrentActiveStack(navigationState);
    }

    if (routes == null || routes.length === 0 || routes[0].params == null) return <View/>;

    const user = routes[0].params.id;

    if (user == null) {
        return (
            <View style={styles.list}>
                <MyText>
                    If you see this screen instead of a user profile, report a bug in the <MyText style={appStyles.link} onPress={() => openLink('https://discord.com/invite/gCunWKx')}>discord</MyText>.
                </MyText>
            </View>
        );
    }

    return <MainStatsInternal user={user}/>;
}

function MainStatsInternal({user}: { user: any}) {
    const styles = useStyles();
    const mutate = useMutate();
    const prefLeaderboardId = useSelector(state => state.prefs.leaderboardId) ?? leaderboardIdsData[0];
    const [leaderboardId, setLeaderboardId] = useState(prefLeaderboardId);

    const navigation = useNavigation();
    const userProfile = useSelector(state => state.user[user.id]?.profile);
    useEffect(() => {
        if (!userProfile) return;
        navigation.setOptions({
            title: userProfile?.name + ' - AoE II Companion',
        });
    }, [userProfile]);

    const currentCachedData = useSelector(state => get(state.statsPlayer, [user.id, leaderboardId]));
    const previousCachedData = usePrevious(currentCachedData);

    const cachedData = currentCachedData ?? previousCachedData;

    let statsDuration = cachedData?.statsDuration;
    let statsPosition = cachedData?.statsPosition;
    let statsPlayer = cachedData?.statsPlayer;
    let statsCiv = cachedData?.statsCiv;
    let statsMap = cachedData?.statsMap;

    const hasStats = cachedData != null;

    const list = ['stats-header', 'stats-duration', 'stats-position', 'stats-player', 'stats-civ', 'stats-map'];

    const onLeaderboardSelected = async (leaderboardId: LeaderboardId) => {
        mutate(setPrefValue('leaderboardId', leaderboardId));
        await saveCurrentPrefsToStorage();
        setLeaderboardId(leaderboardId);
    };

    const valueMapping: any = leaderboardMappingData;
    const values: any[] = leaderboardIdsData;

    const renderLeaderboard = (value: LeaderboardId, selected: boolean) => {
        return <View style={styles.col}>
            <MyText style={[styles.h1, { fontWeight: selected ? 'bold' : 'normal'}]}>{valueMapping[value].title}</MyText>
            <MyText style={[styles.h2, { fontWeight: selected ? 'bold' : 'normal'}]}>{valueMapping[value].subtitle}</MyText>
        </View>;
    };

    const [refetching, setRefetching] = useState(false);

    useEffect(() => {
        if (currentCachedData) {
            setRefetching(false);
        }
    }, [currentCachedData])

    const route = useRoute();
    const state = useNavigationState(state => state);
    const activeRoute = state.routes[state.index] as RouteProp<RootStackParamList, 'Main'>;
    const isActiveRoute = route?.key === activeRoute?.key;

    useWebRefresh(() => {
        if (!isActiveRoute) return;
        onRefresh();
    }, [isActiveRoute]);

    const onRefresh = async () => {
        setRefetching(true);
        await mutate(clearStatsPlayer(user));
        await mutate(clearMatchesPlayer(user));
        await mutate(setLoadingMatchesOrStats());
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {
                    Platform.OS === 'web' && refetching &&
                    <FlatListLoadingIndicator/>
                }
                <FlatList
                    contentContainerStyle={styles.list}
                    data={list}
                    renderItem={({item, index}) => {
                        switch (item) {
                            case 'stats-header':
                                return <View>
                                    <View style={styles.pickerRow}>
                                        <TemplatePicker value={leaderboardId} values={values} template={renderLeaderboard} onSelect={onLeaderboardSelected}/>
                                    </View>
                                    <TextLoader ready={hasStats} style={styles.info}>
                                        {statsPlayer?.matchCount > 0 ?
                                            getTranslation('main.stats.thelastmatches', { matches: statsPlayer?.matchCount }) :
                                            getTranslation('main.stats.nomatches')}
                                    </TextLoader>
                                </View>;
                            case 'stats-duration':
                                return <StatsDuration data={statsDuration} user={user}/>;
                            case 'stats-position':
                                return <StatsPosition data={statsPosition} user={user} leaderboardId={leaderboardId}/>;
                            case 'stats-civ':
                                return <StatsCiv data={statsCiv} user={user} leaderboardId={leaderboardId}/>;
                            case 'stats-map':
                                return <StatsMap data={statsMap} user={user}/>;
                            case 'stats-player':
                                return <StatsPlayer data={statsPlayer} user={user} leaderboardId={leaderboardId}/>;
                            default:
                                return <View/>;
                        }
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl={
                        <RefreshControlThemed
                            onRefresh={onRefresh}
                            refreshing={refetching}
                        />
                    }
                />
            </View>
        </View>
    );
}


const useStyles = createStylesheet(theme => StyleSheet.create({
    info: {
        marginBottom: 10,
        marginLeft: 5,
    },

    col: {
        paddingHorizontal: 7,
        alignItems: 'center',
    },
    h1: {

    },
    h2: {
        fontSize: 11,
    },

    pickerRow: {
        // backgroundColor: 'yellow',
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 20,
        marginBottom: 20,
    },
    list: {
        padding: 20,
    },
    container: {
        flex: 1,
        // backgroundColor: '#B89579',
    },
    content: {
        flex: 1,
    },
}));
