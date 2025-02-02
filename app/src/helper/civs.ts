import {Civ, civs} from "@nex/data";
import {civIconListData} from "@nex/dataset";


export const civIconList = civIconListData;

export const civHistoryList = [
    require('../../../app/assets/history/civs/history_aztecs.png'),
    require('../../../app/assets/history/civs/history_bengalis.png'),
    require('../../../app/assets/history/civs/history_berbers.png'),
    require('../../../app/assets/history/civs/history_bohemians.png'),
    require('../../../app/assets/history/civs/history_britons.png'),
    require('../../../app/assets/history/civs/history_bulgarians.png'),
    require('../../../app/assets/history/civs/history_burgundians.png'),
    require('../../../app/assets/history/civs/history_burmese.png'),
    require('../../../app/assets/history/civs/history_byzantines.png'),
    require('../../../app/assets/history/civs/history_celts.png'),
    require('../../../app/assets/history/civs/history_chinese.png'),
    require('../../../app/assets/history/civs/history_cumans.png'),
    require('../../../app/assets/history/civs/history_dravidians.png'),
    require('../../../app/assets/history/civs/history_ethiopians.png'),
    require('../../../app/assets/history/civs/history_franks.png'),
    require('../../../app/assets/history/civs/history_goths.png'),
    require('../../../app/assets/history/civs/history_gurjaras.png'),
    require('../../../app/assets/history/civs/history_huns.png'),
    require('../../../app/assets/history/civs/history_incas.png'),
    require('../../../app/assets/history/civs/history_hindustani.png'),
    require('../../../app/assets/history/civs/history_italians.png'),
    require('../../../app/assets/history/civs/history_japanese.png'),
    require('../../../app/assets/history/civs/history_khmer.png'),
    require('../../../app/assets/history/civs/history_koreans.png'),
    require('../../../app/assets/history/civs/history_lithuanians.png'),
    require('../../../app/assets/history/civs/history_magyars.png'),
    require('../../../app/assets/history/civs/history_malay.png'),
    require('../../../app/assets/history/civs/history_malians.png'),
    require('../../../app/assets/history/civs/history_mayans.png'),
    require('../../../app/assets/history/civs/history_mongols.png'),
    require('../../../app/assets/history/civs/history_persians.png'),
    require('../../../app/assets/history/civs/history_poles.png'),
    require('../../../app/assets/history/civs/history_portuguese.png'),
    require('../../../app/assets/history/civs/history_saracens.png'),
    require('../../../app/assets/history/civs/history_sicilians.png'),
    require('../../../app/assets/history/civs/history_slavs.png'),
    require('../../../app/assets/history/civs/history_spanish.png'),
    require('../../../app/assets/history/civs/history_tatars.png'),
    require('../../../app/assets/history/civs/history_teutons.png'),
    require('../../../app/assets/history/civs/history_turks.png'),
    require('../../../app/assets/history/civs/history_vietnamese.png'),
    require('../../../app/assets/history/civs/history_vikings.png'),
    require('../../../app/assets/history/civs/history_indians.png'),
];

export function getCivIconByIndex(civ: number) {
    return civIconList[civ];
}

export function getCivIcon(civ: Civ) {
    return civIconList[civs.indexOf(civ as any)];
}

export function getCivHistoryImage(civ: Civ) {
    return civHistoryList[civs.indexOf(civ as any)];
}
