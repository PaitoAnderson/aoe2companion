import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {chunk, uniqBy} from 'lodash';
import {Connection} from "typeorm";
import {PrismaService} from '../service/prisma.service';
import {Prisma} from '@prisma/client'
import {sleep} from "../util";
import {upsertMany} from "../db2";

interface IParams {
    [key: string]: any;
}

function makeQueryString(params: IParams) {
    return Object.keys(params).filter(k => params[k] != null)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');
}

const baseUrlAoe2Companion = 'https://function.aoe2companion.com';

export async function getMatchesFromAoe2Companion(cursor: string = null, count: number = 200): Promise<{ next_cursor: string, matches: any[] }> {
    const queryString = makeQueryString({
        cursor,
        count,
    });

    const url = `${baseUrlAoe2Companion}/api/matches?${queryString}`;
    console.log(url);
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (e) {
        console.log("FAILED", url);
        console.log(e);
        console.log("Trying again", url);
        await sleep(3000);
        return await getMatchesFromAoe2Companion(cursor, count);
    }
}

@Injectable()
export class MigrateTask implements OnModuleInit {
    private readonly logger = new Logger(MigrateTask.name);

    constructor(
        private connection: Connection,
        private prisma: PrismaService,
    ) {}

    async onModuleInit() {
        console.log('Existing matches:', await this.prisma.match.findMany({
            take: 5,
        }));
        await this.importMatches();
    }

    async importMatches() {
        try {

            console.log();
            console.log('FetchFromAoe2Companion');

            let cursor = '141356286';
            const count = 10000;

            let total = 0;

            while(true) {
                const start = new Date();
                const {next_cursor, matches} = await getMatchesFromAoe2Companion(cursor, count);
                total += matches.length;

                for (const matchesChunk of chunk(matches, 100)) {
                    let profileItems: Prisma.profileCreateManyInput[] = [];

                    for (const {players, ...match} of matchesChunk) {
                        delete match.match_uuid;
                        delete match.lobby_id;
                        delete match.opened;
                        delete match.replayed;
                        delete match.duration;
                        delete match.duration_minutes;
                        delete match.notified;
                        delete match.maybe_finished;
                        delete match.checked;

                        players.forEach(playerData => {
                            profileItems.push({
                                profile_id: playerData.profile_id,
                                steam_id: playerData.steam_id,
                                name: playerData.name,
                                clan: playerData.clan,
                                last_match_time: match.started,
                            });
                        });
                    }

                    // Because we are fetching multiple matches there might be duplicate profiles
                    profileItems = uniqBy(profileItems, item => item.profile_id);

                    await upsertMany(this.prisma, 'profile', ['profile_id'], profileItems);
                }

                cursor = next_cursor;

                console.log('total', total, 'percent', total/16000000*100, 'time', (new Date().getTime() - start.getTime()) / 1000, 's');

                if (!next_cursor) break;
            }
        } catch (e) {
            console.error(e);
        }
    }
}
