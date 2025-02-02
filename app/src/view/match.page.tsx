import React from 'react';
import {sameUserNull} from '../helper/user';
import {useNavigation} from '@react-navigation/native';
import {RootStackProp} from '../../App';
import {Game} from "./components/game";
import {StyleSheet, View} from "react-native";
import {createStylesheet} from "../theming-new";
import {civs, IPlayer} from "@nex/data";
import {orderBy} from "lodash";
import {useSelector} from "../redux/reducer";
import {MyText} from "./components/my-text";
import {CivCompBig} from "./civ.page";


export default function MatchPage() {
    const styles = useStyles();
    const navigation = useNavigation<RootStackProp>();

    const match = useSelector(state => state.ingame?.match);
    const player = useSelector(state => state.ingame?.player);
    const auth = useSelector(state => state.auth);
    const following = useSelector(state => state.following);

    if (!match) {
        return (
            <View style={styles.container}>
                <MyText>No match.</MyText>
            </View>
        );
    }

    const filterAndSortPlayers = (players: IPlayer[]) => {
        let filteredPlayers = players.filter(p => following.filter(f => sameUserNull(p, f)).length > 0 || sameUserNull(p, auth));
        filteredPlayers = orderBy(filteredPlayers, p => sameUserNull(p, auth));
        return filteredPlayers;
    };

    const filteredPlayers = filterAndSortPlayers(match.players as any);
    return (
        <View style={styles.container}>
            <Game match={match} expanded={true} highlightedUsers={filteredPlayers}/>
            <MyText style={styles.heading}>Your Civ</MyText>
            <CivCompBig civ={civs[player.civ]}/>
        </View>
    );
}


const useStyles = createStylesheet(theme => StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    heading: {
        marginVertical: 10,
        lineHeight: 20,
        fontWeight: 'bold',
    },

}));
