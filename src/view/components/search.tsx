import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { formatAgo } from '../../helper/util';
import { IFetchedUser, loadUser } from '../../service/user';
import { useLazyApi } from '../../hooks/use-lazy-api';
import { Searchbar } from 'react-native-paper';
import { composeUserIdFromParts, UserInfo } from '../../helper/user';
import { getFlagIcon } from '../../helper/flags';

interface IPlayerProps {
    player: IFetchedUser;
    selectedUser: (user: UserInfo) => void;
}

function Player({player, selectedUser}: IPlayerProps) {
    const onSelect = async () => {
        selectedUser({
            id: composeUserIdFromParts(player.steam_id, player.profile_id),
            steam_id: player.steam_id,
            profile_id: player.profile_id,
            name: player.name,
        });
    };

    return (
            <TouchableHighlight onPress={onSelect} underlayColor="white">
                <View style={styles.row}>
                    <View style={styles.cellCountry}><Image style={styles.countryIcon} source={getFlagIcon(player.country)}/></View>
                    <Text style={styles.cellName} numberOfLines={1}>{player.name}</Text>
                    <Text style={styles.cellGames}>{player.games}</Text>
                    <Text style={styles.cellLastMatch}>{formatAgo(player.last_match)}</Text>
                </View>
            </TouchableHighlight>
    );
}

export default function Search({title, selectedUser}: any) {
    const [text, setText] = useState('');

    const user = useLazyApi(loadUser, 'aoe2de', text);

    const refresh = () => {
        if (text.length < 3) {
            user.reset();
            return;
        }
        user.refetch('aoe2de', text);
    };

    useEffect(() => {
        refresh();
    }, [text]);

    let list: any[] = user.data ? [...user.data]:[];
    if (user.touched && (user.data == null || user.data.length === 0)) {
        list = [{type: 'text', content: 'No user found.'}];
    }
    if (text.length < 3) {
        list = [{type: 'text', content: 'Enter at least 3 chars.'}];
    }

    return (
            <View style={styles.container}>
                <Text style={styles.centerText}>{title}</Text>

                <Searchbar
                        style={styles.searchbar}
                        placeholder="username"
                        onChangeText={text => setText(text)}
                        value={text}
                />

                {
                    user.data && user.data.length > 0 && text.length >= 3 &&
                    <View style={styles.headerRow}>
                        <Text style={styles.cellCountry}> </Text>
                        <Text style={styles.cellName}>Name</Text>
                        <Text style={styles.cellGames}>Games</Text>
                        <Text style={styles.cellLastMatch}>Last Match</Text>
                    </View>
                }

                <FlatList
                        refreshing={user.loading}
                        onRefresh={refresh}
                        data={list}
                        renderItem={({item}) => {
                            if (item.type === 'text') {
                                return <Text style={styles.centerText}>{item.content}</Text>;
                            }
                            return <Player player={item} selectedUser={selectedUser}/>;
                        }}
                        keyExtractor={(item, index) => index.toString()}
                />
            </View>
    );
}

const styles = StyleSheet.create({
    centerText: {
        textAlign: 'center',
    },
    countryIcon: {
        width: 21,
        height: 15,
        marginRight: 5,
    },
    searchbar: {
        marginTop: 15,
        marginBottom: 15,
        marginRight: 30,
        marginLeft: 30,
    },
    cellRating: {
        width: 40,
    },
    cellCountry: {
        width: 30,
    },
    cellName: {
        flex: 1,
    },
    cellGames: {
        width: 60,
        marginLeft: 5,
    },
    cellLastMatch: {
        width: 110,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
        padding: 3,
        borderRadius: 5,
        marginRight: 30,
        marginLeft: 30,
    },
    row: {
        marginRight: 30,
        marginLeft: 30,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
        padding: 3,
    },
    container: {
        paddingTop: 20,
        flex: 1,
        backgroundColor: '#fff',
    },
});
