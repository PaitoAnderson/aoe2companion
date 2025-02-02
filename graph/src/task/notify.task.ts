import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {getUnixTime} from "date-fns";
import {getSentry} from "../db";
import fetch from "node-fetch";
import {Connection, In, MoreThan, Repository} from "typeorm";
import {groupBy} from 'lodash';
import {Match} from "../entity/match";
import {Push} from "../entity/push";
import {Following} from "../entity/following";
import {InjectRepository} from "@nestjs/typeorm";
import PushNotifications from '@pusher/push-notifications-server';
import {Account} from "../entity/account";


interface IExpoPushResponse {
    data: {
        status: string;
        message: string;
        details?: { error?: 'DeviceNotRegistered' };
    };
}

function formatNames(names: string[]) {
    return names.reduce((a, b, i) => a + (i === names.length-1 ? ' and ' : ', ') + b);
}

@Injectable()
export class NotifyTask implements OnModuleInit {
    private readonly logger = new Logger(NotifyTask.name);
    private beamsClient: PushNotifications;

    constructor(
        private connection: Connection,
        @InjectRepository(Push)
        private pushRepository: Repository<Push>,
    ) {}

    async onModuleInit() {
        // const followings = await this.connection.manager.find(Following);
        // console.log('followings.length', followings.length);

        this.beamsClient = new PushNotifications({
            instanceId: 'f5f0895e-446c-4fb7-9c88-cee14814718d',
            secretKey: process.env.PUSHER_SECRET_KEY,
        });

        await this.notifyAll();
    }

    async notifyAll() {
        try {
            const oneMinuteAgo = getUnixTime(new Date()) - 60*5;

            // const matches = await connection.manager.find(Match, {where: { id: '33322038'}, relations: ["players"]});
            const matches = await this.connection.manager.find(Match, {where: { notified: false, started: MoreThan(oneMinuteAgo) }, relations: ["players"]});
            console.log(matches.length);

            for (const match of matches) {
                await this.notify(match);
            }
            setTimeout(() => this.notifyAll(), 5000);
        } catch (e) {
            console.error(e);
            getSentry().captureException(e);
            // sendAlert('notify', e)
            setTimeout(() => this.notifyAll(), 60 * 1000);
        }
    }

    async notify(match: Match) {
        console.log('NOTIFY', match.name, '->', match.id);
        const players = match.players.filter(p => p.profile_id);

        if (players.length === 0) return;

        const data = {
            match_id: match.id,
            player_ids: match.players.map(p => p.profile_id),
        };

        const followings = await this.connection.manager.find(Following, {where: { profile_id: In(players.map(p => p.profile_id)), enabled: true }, relations: ["account"]});

        const tokens = Object.entries(groupBy(followings, p => p.account.push_token));
        if (tokens.length > 0) {
            console.log('tokens', tokens.length);
            for (const [token, followings] of tokens) {
                const names = formatNames(followings.map(following => players.find(p => p.profile_id == following.profile_id).name));
                const verb = followings.length > 1 ? 'are' : 'is';

                try {
                    await this.sendPushNotification(token, match.name + ' - ' + match.id, names + ' ' + verb + ' playing.', data);
                } catch (e) {
                    console.error(e);
                }
            }
        }

        const tokensWeb = Object.entries(groupBy(followings, p => p.account.push_token_web));
        if (tokensWeb.length > 0) {
            console.log('tokensWeb', tokensWeb.length);
            for (const [tokenWeb, followings] of tokensWeb) {
                const names = formatNames(followings.map(following => players.find(p => p.profile_id == following.profile_id).name));
                const verb = followings.length > 1 ? 'are' : 'is';

                try {
                    await this.sendPushNotificationWeb(tokenWeb, match.name + ' - ' + match.id, names + ' ' + verb + ' playing.', data);
                } catch (e) {
                    console.error(e);
                }
            }
        }

        const tokensElectron = Object.entries(groupBy(followings, p => p.account.push_token_electron));
        if (tokensElectron.length > 0) {
            console.log('tokensElectron', tokensElectron.length);
            for (const [tokenElectron, followings] of tokensElectron) {
                const names = formatNames(followings.map(following => players.find(p => p.profile_id == following.profile_id).name));
                const verb = followings.length > 1 ? 'are' : 'is';

                try {
                    await this.sendPushNotificationElectron(tokenElectron, match.name + ' - ' + match.id, names + ' ' + verb + ' playing.', data);
                } catch (e) {
                    console.error(e);
                }
            }
        }

        const tokensElectronSent = tokensElectron.map(([tokenElectron, followings]) => tokenElectron);

        const accounts = await this.connection.manager.find(Account, {where: { profile_id: In(players.map(p => p.profile_id)), overlay: true }});

        for (const account of accounts) {
            if (tokensElectronSent.includes(account.push_token_electron)) continue;
            try {
                await this.sendPushNotificationElectron(account.push_token_electron, match.name + ' - ' + match.id, 'You are playing.', data);
            } catch (e) {
                console.error(e);
            }
        }

        await this.connection.createQueryBuilder()
            .update(Match)
            .set({ notified: true })
            .where("id = :id", { id: match.id })
            .execute();
    }

    async sendPushNotification(expoPushToken: string, title: string, body: string, data: any) {
        if (expoPushToken == null || expoPushToken == 'null') return;

        const message = {
            to: expoPushToken,
            sound: 'default',
            title,
            body,
            data,
        };

        console.log('PUSH');
        console.log(message);

        const result = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
            timeout: 60 * 1000,
        });
        const expoPushResponse = await result.json() as IExpoPushResponse;
        console.log(expoPushResponse);

        const status = expoPushResponse.data.status == 'ok' ? 'ok' : expoPushResponse.data.details?.error;

        await this.pushRepository.save({ title: message.title, body: message.body, push_token: expoPushToken, status });
    }

    async sendPushNotificationWeb(pushTokenWeb: string, title: string, body: string, data: any) {
        if (pushTokenWeb == null || pushTokenWeb == 'null') return;

        const message = {
            to: pushTokenWeb,
            sound: 'default',
            title,
            body,
            data,
        };

        console.log('PUSH WEB');
        console.log(message);

        let status = '?';
        try {
            const webPushResponse = await this.beamsClient.publishToInterests([`device-${pushTokenWeb}`], {
                web: {
                    notification: {
                        title,
                        body,
                        deep_link: `https://app.aoe2companion.com/feed?match_id=${data.match_id}`,
                    },
                    data,
                }
            });
            console.log(webPushResponse);
            status = 'ok';
        } catch (e) {
            console.error(e);
            status = e.toString();
        }

        await this.pushRepository.save({ title: message.title, body: message.body, push_token_web: pushTokenWeb, status });
    }

    async sendPushNotificationElectron(pushTokenElectron: string, title: string, body: string, data: any) {
        if (pushTokenElectron == null || pushTokenElectron == 'null') return;

        const message = {
            appKey: 'IpANYN0DRa84xPpmvQ9Z',
            appSecret: process.env.ELECTROLYTIC_APP_SECRET,
            target: [pushTokenElectron],
            payload: {
                title,
                body,
                data,
            },
        };

        console.log('PUSH ELECTRON');
        console.log(message);

        const result = await fetch('https://api.electrolytic.app/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
            timeout: 60 * 1000,
        });
        const electronPushResponse = await result.json();
        console.log(electronPushResponse);

        const status = electronPushResponse.status == 'accepted' ? 'ok' : 'error';

        await this.pushRepository.save({ title: message.payload.title, body: message.payload.body, push_token: pushTokenElectron, status });
    }
}
