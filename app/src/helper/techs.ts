import {Tech} from "@nex/data";
import {ImageSourcePropType} from "react-native";

type TechIconDict = {
    [tech in Tech]: ImageSourcePropType
}

const techIcons: TechIconDict = {
    'FeudalAge': require('../../../app/assets/other/FeudalAgeFull.png'),
    'CastleAge': require('../../../app/assets/other/CastleAge.png'),
    'ImperialAge': require('../../../app/assets/other/ImperialAge.png'),
    'BombardTower': require('../../../app/assets/buildings/BombardTower.png'),
    'Keep': require('../../../app/assets/buildings/Keep.png'),
    'GuardTower': require('../../../app/assets/buildings/GuardTower.png'),
    'FortifiedWall': require('../../../app/assets/buildings/FortifiedWall.png'),
    'Architecture': require('../../../app/assets/techs/Architecture.png'),
    'ArrowSlits': require('../../../app/assets/techs/ArrowSlits.png'),
    'Banking': require('../../../app/assets/techs/Banking.png'),
    'Coinage': require('../../../app/assets/techs/Coinage.png'),
    'Guilds': require('../../../app/assets/techs/Guilds.png'),
    'HeatedShot': require('../../../app/assets/techs/HeatedShot.png'),
    'Hoardings': require('../../../app/assets/techs/Hoardings.png'),
    'Masonry': require('../../../app/assets/techs/Masonry.png'),
    'MurderHoles': require('../../../app/assets/techs/MurderHoles.png'),
    'TownPatrol': require('../../../app/assets/techs/TownPatrol.png'),
    'TownWatch': require('../../../app/assets/techs/TownWatch.png'),
    'SpiesTreason': require('../../../app/assets/techs/SpiesTreason.png'),
    'HorseCollar': require('../../../app/assets/techs/HorseCollar.png'),
    'CropRotation': require('../../../app/assets/techs/CropRotation.png'),
    'Forging': require('../../../app/assets/techs/Forging.png'),
    'IronCasting': require('../../../app/assets/techs/IronCasting.png'),
    'BlastFurnace': require('../../../app/assets/techs/BlastFurnace.png'),
    'Arson': require('../../../app/assets/techs/Arson.png'),
    'ScaleMailArmor': require('../../../app/assets/techs/ScaleMailArmor.png'),
    'ChainMailArmor': require('../../../app/assets/techs/ChainMailArmor.png'),
    'PlateMailArmor': require('../../../app/assets/techs/PlateMailArmor.png'),
    'Squires': require('../../../app/assets/techs/Squires.png'),
    'Tracking': require('../../../app/assets/techs/Tracking.png'),
    'Faith': require('../../../app/assets/techs/Faith.png'),
    'Heresy': require('../../../app/assets/techs/Heresy.png'),
    'Conscription': require('../../../app/assets/techs/Conscription.png'),
    'ThumbRing': require('../../../app/assets/techs/ThumbRing.png'),
    'Ballistics': require('../../../app/assets/techs/Ballistics.png'),
    'PaddedArcherArmor': require('../../../app/assets/techs/PaddedArcherArmor.png'),
    'LeatherArcherArmor': require('../../../app/assets/techs/LeatherArcherArmor.png'),
    'RingArcherArmor': require('../../../app/assets/techs/RingArcherArmor.png'),
    'Fletching': require('../../../app/assets/techs/Fletching.png'),
    'BodkinArrow': require('../../../app/assets/techs/BodkinArrow.png'),
    'Bracer': require('../../../app/assets/techs/Bracer.png'),
    'Chemistry': require('../../../app/assets/techs/Chemistry.png'),
    'Bloodlines': require('../../../app/assets/techs/Bloodlines.png'),
    'ParthianTactics': require('../../../app/assets/techs/ParthianTactics.png'),
    'Husbandry': require('../../../app/assets/techs/Husbandry.png'),
    'ScaleBardingArmor': require('../../../app/assets/techs/ScaleBardingArmor.png'),
    'ChainBardingArmor': require('../../../app/assets/techs/ChainBardingArmor.png'),
    'PlateBardingArmor': require('../../../app/assets/techs/PlateBardingArmor.png'),
    'Supplies': require('../../../app/assets/techs/Supplies.png'),
    'SiegeEngineers': require('../../../app/assets/techs/SiegeEngineers.png'),
    'Careening': require('../../../app/assets/techs/Careening.png'),
    'DryDock': require('../../../app/assets/techs/DryDock.png'),
    'Shipwright': require('../../../app/assets/techs/Shipwright.png'),
    'Sanctity': require('../../../app/assets/techs/Sanctity.png'),
    'Redemption': require('../../../app/assets/techs/Redemption.png'),
    'Atonement': require('../../../app/assets/techs/Atonement.png'),
    'HerbalMedicine': require('../../../app/assets/techs/HerbalMedicine.png'),
    'Fervor': require('../../../app/assets/techs/Fervor.png'),
    'Illumination': require('../../../app/assets/techs/Illumination.png'),
    'BlockPrinting': require('../../../app/assets/techs/BlockPrinting.png'),
    'Theocracy': require('../../../app/assets/techs/Theocracy.png'),
    'Caravan': require('../../../app/assets/techs/Caravan.png'),
    'Gillnets': require('../../../app/assets/techs/Gillnets.png'),
    'Wheelbarrow': require('../../../app/assets/techs/Wheelbarrow.png'),
    'HandCart': require('../../../app/assets/techs/HandCart.png'),
    'HeavyPlow': require('../../../app/assets/techs/HeavyPlow.png'),
    'DoubleBitAxe': require('../../../app/assets/techs/DoubleBitAxe.png'),
    'BowSaw': require('../../../app/assets/techs/BowSaw.png'),
    'TwoManSaw': require('../../../app/assets/techs/TwoManSaw.png'),
    'StoneMining': require('../../../app/assets/techs/StoneMining.png'),
    'StoneShaftMining': require('../../../app/assets/techs/StoneShaftMining.png'),
    'GoldMining': require('../../../app/assets/techs/GoldMining.png'),
    'GoldShaftMining': require('../../../app/assets/techs/GoldShaftMining.png'),
    'Loom': require('../../../app/assets/techs/Loom.png'),
    'Sappers': require('../../../app/assets/techs/Sappers.png'),
    'TreadmillCrane': require('../../../app/assets/techs/TreadmillCrane.png'),

    'Atlatl': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'Kasbah': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'Yeomen': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'Stirrups': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'Howdah': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'GreekFire': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'Stronghold': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'GreatWall': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'SteppeHusbandry': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'RoyalHeirs': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'BeardedAxe': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'Anarchy': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'Marauders': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'AndeanSling': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'Sultans': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'Pavise': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'Yasama': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'TuskSwords': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'Eupseong': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'HillForts': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'CorvinianArmy': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'Thalassocracy': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'Tigui': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'HulcheJavelineers': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'Nomads': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'Kamandaran': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'Carrack': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'Madrasah': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'Orthodoxy': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'Inquisition': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'SilkArmor': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'Ironclad': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'Sipahi': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'Chatras': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'Chieftains': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'BurgundianVineyards': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'FirstCrusade': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'WagenburgTactics': require('../../../app/assets/techs/UniqueTechCastle.png'),
    'SzlachtaPrivileges': require('../../../app/assets/techs/UniqueTechCastle.png'),

    'LechiticLegacy': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'HussiteReforms': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'GarlandWars': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'MaghrebiCamels': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'Warwolf': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'Bagains': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'ManipurCavalry': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'Logistica': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'FurorCeltica': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'Rocketry': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'CumanMercenaries': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'TorsionEngines': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'Chivalry': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'Perfusion': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'Atheism': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'FabricShields': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'Shatagni': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'SilkRoad': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'Kataparuto': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'DoubleCrossbow': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'Shinkichon': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'TowerShields': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'RecurveBow': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'ForcedLevy': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'Farimba': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'ElDorado': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'Drill': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'Mahouts': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'Arquebus': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'Zealotry': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'Druzhina': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'Supremacy': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'TimuridSiegecraft': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'Crenellations': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'Artillery': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'PaperMoney': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'Berserkergang': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'FlemishRevolution': require('../../../app/assets/techs/UniqueTechImperial.png'),
    'Hauberk': require('../../../app/assets/techs/UniqueTechImperial.png'),
};

export function getTechIcon(tech: Tech) {
    return techIcons[tech];
}
