"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Eris = __importStar(require("eris"));
const fs = __importStar(require("mz/fs"));
const job_1 = require("./job");
const monster_1 = require("./monster");
const auth = JSON.parse(fs.readFileSync("auth.json", "utf8"));
if (!auth.token) {
    console.error("Bot token not found at auth.json.token!");
    process.exit();
}
const bot = new Eris.Client(auth.token);
const classes = [];
let jobList = {
    "316052390442958860": ["Mime", "Mime", "Mime", "Mime"]
};
const monsters = [];
let stats = {
    kinuVictims: 0,
    rodsBroken: 0,
    victims: 0
};
const combines = [];
const mixes = [];
const dataFile = "data.json";
const proms = [];
async function loadData() {
    if (await fs.exists(dataFile)) {
        await fs.readFile(dataFile, "utf8").then(file => {
            stats = JSON.parse(file);
        });
    }
}
proms.push(loadData());
const jobFile = "jobs.json";
async function loadJobs() {
    if (await fs.exists(jobFile)) {
        await fs.readFile(jobFile, "utf8").then(file => {
            jobList = JSON.parse(file);
        });
    }
}
proms.push(loadJobs());
const monsterFile = "monsterdata.json";
proms.push(fs.readFile(monsterFile, "utf8").then(file => {
    const list = JSON.parse(file);
    for (const monster of list) {
        monsters.push(new monster_1.Monster(monster));
    }
}));
const classFile = "classes.json";
proms.push(fs.readFile(classFile, "utf8").then(file => {
    const list = JSON.parse(file);
    for (const job of list) {
        classes.push(new job_1.Job(job));
    }
}));
const combFile = "combine.json";
proms.push(fs.readFile(combFile, "utf8").then(file => {
    const list = JSON.parse(file);
    for (const comb of list) {
        combines.push(comb);
    }
}));
const mixFile = "mixes.json";
proms.push(fs.readFile(mixFile, "utf8").then(file => {
    const list = JSON.parse(file);
    for (const curMix of list) {
        mixes.push(curMix);
    }
}));
bot.on("ready", () => {
    console.log("Logged in as %s - %s\n", bot.user.username, bot.user.id);
});
bot.on("disconnect", async () => {
    console.error("Bot disconnected! Reconnecting...");
    await bot.connect();
});
var mainModes;
(function (mainModes) {
    mainModes[mainModes["MODE_NORMAL"] = 0] = "MODE_NORMAL";
    mainModes[mainModes["MODE_RANDOM"] = 1] = "MODE_RANDOM";
    mainModes[mainModes["MODE_CHAOS"] = 2] = "MODE_CHAOS";
    mainModes[mainModes["MODE_PURE"] = 3] = "MODE_PURE";
    mainModes[mainModes["MODE_ADV"] = 4] = "MODE_ADV";
})(mainModes || (mainModes = {}));
const commands = [
    {
        func: mcalc,
        names: ["mcalc"]
    },
    {
        func: almagest,
        names: ["almagest"]
    },
    {
        func: diyFiesta(mainModes.MODE_NORMAL),
        names: ["normal"]
    },
    {
        func: diyFiesta(mainModes.MODE_RANDOM),
        names: ["random"]
    },
    {
        func: sevenFifty,
        names: ["750"]
    },
    {
        func: noSevenFifty,
        names: ["no750"]
    },
    {
        func: chaosSevenFifty,
        names: ["chaos750"]
    },
    {
        func: chaosNoSevenFifty,
        names: ["chaosno750"]
    },
    {
        func: diyFiesta(mainModes.MODE_CHAOS),
        names: ["chaos"]
    },
    {
        func: diyFiesta(mainModes.MODE_PURE),
        names: ["purechaos"]
    },
    {
        func: diyFiesta(mainModes.MODE_ADV),
        names: ["advance", "gba"]
    },
    {
        func: dd,
        names: ["dd"]
    },
    {
        func: trapped,
        names: ["trapped"]
    },
    {
        func: victim,
        names: ["victims"]
    },
    {
        func: breakRod,
        names: ["break"]
    },
    {
        func: broken,
        names: ["broken"]
    },
    {
        func: countdown,
        names: ["timer", "fiestatimer", "countdown"]
    },
    { func: rundown, names: ["therun", "runtimer", "rundown"] },
    {
        func: jobs,
        names: ["jobs"]
    },
    {
        func: forbiddenRisk,
        names: ["winnerrisk"]
    },
    {
        func: forbiddenLite,
        names: ["winnerlite"]
    },
    {
        func: forbidden,
        names: ["forbidden"]
    },
    {
        chk: (msg) => auth.owners && auth.owners.indexOf(msg.author.id) > -1,
        func: purify,
        names: ["purify"]
    },
    {
        func: attributes,
        names: ["attributes"]
    },
    {
        func: info("profile"),
        names: ["info", "enemy"]
    },
    {
        func: info("ai"),
        names: ["ai"]
    },
    {
        func: info("loot"),
        names: ["loot"]
    },
    {
        func: info("stats"),
        names: ["stat"]
    },
    {
        func: info("weak"),
        names: ["weak"]
    },
    {
        func: info("ability"),
        names: ["abilit"]
    },
    {
        func: randcolour,
        names: ["color", "colour", "snescolour", "snescolor"]
    },
    {
        func: deathByMaths,
        names: ["math", "deathbymath"] // "maths" handled because it only checks the start
    },
    {
        func: jobData,
        names: ["class"]
    },
    {
        func: combine,
        names: ["combine", "cannon"]
    },
    {
        func: mix,
        names: ["mix", "drug"]
    },
    {
        func: isBowBetter,
        names: ["isbowbetter"]
    },
    {
        func: order,
        names: ["order", "firstchar"]
    },
    {
        func: zeninage,
        names: ["zeninage", "giltoss"]
    },
    {
        func: loadsOfMoney,
        names: ["loadsofmoney"]
    }
];
const responses = {
    500: "KARNAK 500 TREASURE CHEST MAP, IT'S COOL AND GOOD: " +
        "https://www.gamefaqs.com/ps/562810-final-fantasy-v/faqs/49618?raw=1",
    address: "GBA Memory Address list is here: http://tinyurl.com/leq4gje\n" +
        "Song boosts are stored at 0x0201EE85/86/88/89 for Strength/Agility/Magic/Level!",
    algorithm: "Algorithms guide: http://www.kyrosiris.com/ff5algorithm.html",
    badfaq: "oh my god I love <:rod:455233447565459471> http://www.gamefaqs.com/snes/588331-final-fantasy-v/faqs/21687",
    badfiesta: "The worst fiesta ever happened here: https://www.twitch.tv/dragondarchsda/v/48967944",
    badmod: "`No balance, at all` -mod author http://kyrosiris.com/changes_overview.txt " +
        "https://www.romhacking.net/forum/index.php?topic=26501.0 (DON'T PLAY THIS)",
    beginner: "alcharagia's beginner guide to the game's Jobs:\n" +
        "https://forums.somethingawful.com/showthread.php?threadid=3857516&userid=0" +
        "&perpage=40&pagenumber=13#post484858103",
    blue: "Blue Magic acquisition guide: http://shrines.rpgclassics.com/snes/ff5/bluestrat.shtml",
    catch: "Need catch suggestions? Kyro made a spreadsheet: http://tinyurl.com/catchspreadsheet",
    chemchart: "!Mix Picture Guide: http://i.imgur.com/MBJBNvG.gif\nFor a version with the cruft removed, click here: " +
        "<https://cdn.discordapp.com/attachments/315364661832843265/600020062413258762/mixchart-improved.gif>",
    crystelle: "Those are easy to catch, right? http://i.imgur.com/WD40MES.png",
    dance: "It's *sensual.* https://i.imgur.com/qX3ElWK.gif",
    encounter: "Indoor enemy list per zone/encounter is here: " +
        "https://www.dropbox.com/s/l9cxdjz2atp7ey2/encounter_survey.txt\n" +
        "World 3 encounter map is here: http://www.cavesofnarshe.com/ff5/finalworld.php\n" +
        "disastranagant 20/06/2018\n" +
        "jfc why haven't I posted the sea chart yet https://i.imgur.com/52t2S15.gif\n" +
        "the grey areas are great abp and gil, the light blue area has stingray " +
        "and the yellow area has the highest gil and abp of any random battle outside the void.",
    enkibot: "Asterism's Enkibot guide is here: http://enkibot.herokuapp.com/",
    equipharps: "http://lparchive.org/Final-Fantasy-V-Advance-%28by-Dr-Pepper%29/1-MaximumTruckStyleLove.gif",
    flee: "foolofsound made a guide on which encounters you can or can't easily run from:\n" +
        "https://docs.google.com/document/d/1Kb-lretuvYNOcEEdyHIWq3zz69088EEQ6TBO8j78i9c/edit?usp=sharing",
    fork: "Fork Tower: Magic Left, Physical Right",
    gaia: "THAT HIPPIE SHIT AIN'T MAGIC http://i.imgur.com/JkwTg5O.png",
    happyworm: "https://gifsound.com/?gif=i.imgur.com/UaOsyZS.gif&v=y6Sxv-sUYtM&s=11",
    help: "I have a lot of commands, too many to list in this Discord PM." +
        " Check this readme: https://tinyurl.com/ybh7lrz2",
    iainuki: "That's a good ability! http://gfycat.com/TenseArtisticCobra",
    karnak: "KARNAK 500 TREASURE CHEST MAP, IT'S COOL AND GOOD: " +
        "https://www.gamefaqs.com/ps/562810-final-fantasy-v/faqs/49618?raw=1",
    lamp: "Magic Lamp cast order: Bahamut, Leviathan, Odin, Syldra, Carbuncle, Catoblepas, " +
        "Golem, Titan, Ifrit, Ramuh, Shiva, Remora, Sylph, Chocobo.",
    level5death: "Possibly the best ability! http://gfycat.com/TerrificKeyEmperorshrimp",
    ned: "Neo-Exdeath Picture Guide: https://i.imgur.com/m0E61iK.png",
    numbers: "**PREMIUM TACTICAL INFORMATION ITT**\nDragondarch's team is Monk, Mystic Knight, Beastmaster, Dancer. " +
        "Here's his foolproof strategy for dealing with the Seal Guardians in Moore Forest.\n\n" +
        "1. After getting the wind drake from Bal Castle, go to Kuza and grind to level 32.\n" +
        "2. Proceed with the game until the Barrier Tower. Grind there for Reflect Rings.\n" +
        "3. Go to Drakenvale and get a Poison Eagle to cast Float on everyone.\n" +
        "4. Go to the Gil Cave to grind out 370,000 Gil to buy Hermes Sandals with in World 3.\n" +
        "5. Let the Aegis Shield be transformed into the Flame Shield.\n" +
        "6. Make Bartz a Mystic Knight and weaken him to critical HP.\n" +
        "7. Give Bartz the Flame Shield, give everyone else Reflect Rings.\n" +
        "8. Reset the game because Bartz got one-shotted immediately in the Seal Guardian fight.\n" +
        "9. Kill the Water, Earth and Wind Crystals.\n10. Kill off everyone except Bartz.\n" +
        "11. Use !Focus + Drain Sword to kill the Fire Crystal.\n\nIt's easy!",
    oracle: "https://www.youtube.com/watch?v=makazgIRzfg",
    phoenix: "Phoenix Tower door order: Left Left Right, " +
        "Left Left Right, Left Left Right, Left Left Right, Right Left Right, Left Left Right, Center, Phoenix!",
    physical: "THIS SHIT AIN'T MAGIC (and will trigger React: Physical scripts): Item, Fight, Kick, Focus, Steal, " +
        "Mug, Lance, Jump, Throw, Mineuchi, Zeninage, Animals, Aim, Rapid Fire, " +
        "Call, Check, Scan, Release, Mix, Gaia, and Dance.",
    piano: "The pianos are in: Tule, Carwen, Karnak, Jachol, Crescent, Regole, Moore, and Mirage",
    pyramid: "https://i.imgur.com/YbXESCb.gif",
    quickleak: "https://www.youtube.com/watch?v=1x7zRK-Fsv8&list=PLMthTW4vRq8bfi6MeqVHU-yWkN4BRE1DJ",
    quicksave: "Hang on while I do some **ENCOUNTER MANIPULATION**",
    rocksfall: "...and *NED* dies? sure, why not https://clips.twitch.tv/ProductiveSavoryHorseradishSoBayed",
    runthenumbers: "**PREMIUM TACTICAL INFORMATION ITT**\nDragondarch's team is Monk, Mystic Knight, Beastmaster, Dancer. " +
        "Here's his foolproof strategy for dealing with the Seal Guardians in Moore Forest.\n\n" +
        "1. After getting the wind drake from Bal Castle, go to Kuza and grind to level 32.\n" +
        "2. Proceed with the game until the Barrier Tower. Grind there for Reflect Rings.\n" +
        "3. Go to Drakenvale and get a Poison Eagle to cast Float on everyone.\n" +
        "4. Go to the Gil Cave to grind out 370,000 Gil to buy Hermes Sandals with in World 3.\n" +
        "5. Let the Aegis Shield be transformed into the Flame Shield.\n" +
        "6. Make Bartz a Mystic Knight and weaken him to critical HP.\n" +
        "7. Give Bartz the Flame Shield, give everyone else Reflect Rings.\n" +
        "8. Reset the game because Bartz got one-shotted immediately in the Seal Guardian fight.\n" +
        "9. Kill the Water, Earth and Wind Crystals.\n10. Kill off everyone except Bartz.\n" +
        "11. Use !Focus + Drain Sword to kill the Fire Crystal.\n\nIt's easy!",
    sandworm: "http://kyrosiris.com/sandworm.gif",
    sandworm2: "This is to go ***FURTHER BEYOND!!!*** http://kyrosiris.com/sandworm2.png",
    sealed: "<a:spinryu:587175221421670402>" +
        "__alcharagia's Sealed Temple Guides: 「Don't Do It」__" +
        "<a:spinryu:587175221421670402>\n" +
        "2016:" +
        " https://forums.somethingawful.com/showthread.php?threadid=3776693&pagenumber=87&perpage=40#post461344746\n" +
        "2017:" +
        " https://forums.somethingawful.com/showthread.php?threadid=3820741&pagenumber=22&perpage=40#post473264920\n" +
        "2019:" +
        " https://forums.somethingawful.com/showthread.php?threadid=3889977&perpage=40&pagenumber=12#post495764439",
    seals: "Seal Guardians Picture Guide: http://i.imgur.com/c73swws.png",
    spinryu: "**RUN COWARD RUN RUN RUN RUN RUN RUN RUN** https://i.imgur.com/mnarmy3.gif",
    stats: "Character stat bonuses are as follows:\nButz - +4 Str, +1 Agi, +3 Vit, +1 Mag\n" +
        "Lenna: +1 Str, +2 Agi, +1 Vit, +4 Mag\nGaluf: +3 Str, +4 Vit\n " +
        "Faris: +3 Str, +3 Agi, +2 Vit, +2 Mag\nKrile: +1 Str, +4 Agi, +3 Mag",
    wand: "Wonder Wand spell order: Cure, Poisona, Silence, Protect, Mini, Cura, Raise, Confuse, " +
        "Blink, Shell, Esuna, Curaga, Reflect, Berserk, Arise, Holy, Dispel, " +
        "Fire, Blizzard, Thunder, Poison, Sleep, Toad, Fira, Blizzara, Thundara, Drain, Break, Bio, " +
        "Firaga, Blizzaga, Thundaga, Flare, Death, Osmose, repeat!",
    wonder: "Wonder Wand spell order: Cure, Poisona, Silence, Protect, Mini, Cura, Raise, Confuse, " +
        "Blink, Shell, Esuna, Curaga, Reflect, Berserk, Arise, Holy, Dispel, " +
        "Fire, Blizzard, Thunder, Poison, Sleep, Toad, Fira, Blizzara, Thundara, Drain, Break, Bio, " +
        "Firaga, Blizzaga, Thundaga, Flare, Death, Osmose, repeat!",
    yburns: "The Y-BURNS? My favorite team! http://i.imgur.com/aQ18OQF.png"
};
const prefixes = [".", "!"];
const queries = {};
bot.on("error", (err) => {
    console.dir(err);
});
// reads incoming messages for commands and redirects to functions to handle them
bot.on("messageCreate", async (msg) => {
    const lowMes = msg.content.toLowerCase();
    if (!msg.author.bot) {
        for (const cmd of commands) {
            if (!cmd.chk || cmd.chk(msg)) {
                for (const name of cmd.names) {
                    for (const pre of prefixes) {
                        if (lowMes.startsWith(pre + name)) {
                            await cmd.func(msg);
                            return;
                        }
                    }
                }
            }
        }
        if (lowMes.startsWith("zerky!")) {
            await zerky(msg);
            return;
        }
        for (const key in responses) {
            if (responses.hasOwnProperty(key)) {
                for (const pre of prefixes) {
                    if (lowMes.startsWith(pre + key)) {
                        await msg.channel.createMessage(responses[key]);
                        return;
                    }
                }
            }
        }
        // only continue enemy info stuff in DMs
        if (msg.author.id in queries && msg.channel instanceof Eris.PrivateChannel) {
            await enemyClarify(msg);
            return;
        }
    }
});
bot.on("messageReactionAdd", async (msg, emoji, userID) => {
    if (msg.id in dmReplies && emoji.name === "📬") {
        const user = bot.users.get(userID);
        if (user && !user.bot) {
            const chan = await user.getDMChannel();
            await chan.createMessage(dmReplies[msg.id]);
        }
    }
});
const mcalcTable = {
    bell: {
        args: ["Level", "Magic", "Agility"],
        calc: (nums) => {
            const level = nums[0];
            const mag = nums[1];
            const agil = nums[2];
            let m = Math.floor((level * mag) / 128);
            const bonus = Math.floor((level * agil) / 128);
            const n = Math.ceil((128 * (m + 1)) / mag);
            const ns = Math.ceil((128 * (bonus + 1)) / agil);
            m += bonus + 2;
            return ("At Level " +
                level +
                ", with " +
                mag +
                " Magic and " +
                agil +
                " Agility, your Diamond Bell/Tinkerbell M is " +
                m +
                ". To reach the next M, you need to reach level " +
                n +
                " for Strength and " +
                ns +
                " for Agility.");
        }
    },
    cannon: {
        args: ["Level"],
        calc: (nums) => {
            const m = Math.floor((nums[0] * nums[0]) / 256 + 4);
            let nextLevel = Math.ceil(256 * (m + 1 - 4));
            nextLevel = Math.ceil(Math.sqrt(nextLevel));
            return ("At level " +
                nums[0] +
                ", your Cannoneer M is " +
                m +
                ". To reach the next M, you need to reach level " +
                nextLevel +
                ".");
        }
    },
    chicken: {
        args: ["Level", "Strength", "Agility"],
        calc: (nums) => {
            const level = nums[0];
            const str = nums[1];
            const agil = nums[2];
            let m = Math.floor((level * str) / 128);
            const bonus = Math.floor((level * agil) / 128);
            const n = Math.ceil((128 * (m + 1)) / str);
            const ns = Math.ceil((128 * (bonus + 1)) / agil);
            m += bonus + 2;
            return ("At Level " +
                level +
                ", with " +
                str +
                " Strength and " +
                agil +
                " Agility, your Chicken Knife M is " +
                m +
                ". To reach the next M, you need to reach level " +
                n +
                " for Strength and " +
                ns +
                " for Agility.");
        }
    },
    fists: {
        args: ["Level", "Strength"],
        calc: (nums) => {
            const level = nums[0];
            const str = nums[1];
            const m = Math.floor((level * str) / 256 + 2);
            const nextLevel = Math.ceil((256 * (m + 1 - 2)) / str);
            const pow = level * 2 + 3;
            return ("At Level " +
                level +
                ", with " +
                str +
                " Strength, your fist M is " +
                m +
                " (with " +
                pow +
                " attack power). To reach the next M, you need to reach level " +
                nextLevel +
                ".");
        }
    },
    knife: {
        args: ["Level", "Strength", "Agility"],
        calc: (nums) => {
            const level = nums[0];
            const str = nums[1];
            const agil = nums[2];
            let m = level;
            let bonus = level;
            m = m * str;
            bonus = bonus * agil;
            m = Math.floor(m / 128);
            bonus = Math.floor(bonus / 128);
            let ns = bonus;
            let divider = bonus;
            divider = Math.floor(divider / 2);
            bonus -= divider;
            bonus -= divider;
            let n = m;
            n++;
            ns++;
            n = n * 128;
            ns = ns * 128;
            n = Math.ceil(n / str);
            ns = Math.ceil(ns / agil);
            m += 2;
            if (bonus === 0) {
                return ("At Level " +
                    level +
                    ", with " +
                    str +
                    " Strength and " +
                    agil +
                    " Agility, your knife M is " +
                    m +
                    " (no Agility bonus). To reach the next M, you need to reach level " +
                    n +
                    " (Bonus Agility M gained at level " +
                    ns +
                    ").");
            }
            else {
                // if bonus = 1
                m = m + 1;
                return ("At Level " +
                    level +
                    ", with " +
                    str +
                    " Strength and " +
                    agil +
                    " Agility, your knife M is " +
                    m +
                    " (including Agility bonus). To reach the next M, you need to reach level " +
                    n +
                    " (Bonus Agility M **LOST** at level " +
                    ns +
                    ").");
            }
        }
    },
    magic: {
        args: ["Level", "Magic"],
        calc: (nums) => {
            const m = Math.floor((nums[0] * nums[1]) / 256 + 4);
            const nextLevel = Math.ceil((256 * (m + 1 - 4)) / nums[1]);
            return ("At Level " +
                nums[0] +
                ", with " +
                nums[1] +
                " Magic, your magic M is " +
                m +
                ". To reach the next M, you need to reach level " +
                nextLevel +
                "");
        }
    },
    physical: {
        args: ["Level", "Strength"],
        calc: (nums) => {
            const m = Math.floor((nums[0] * nums[1]) / 128 + 2);
            const nextLevel = Math.ceil((128 * (m + 1 - 2)) / nums[1]);
            return ("At Level " +
                nums[0] +
                ", with " +
                nums[1] +
                " Strength, your physical M is " +
                m +
                ". To reach the next M, you need to reach level " +
                nextLevel +
                "");
        }
    },
    rune: {
        args: ["Level", "Strength", "Magic"],
        calc: (nums) => {
            const level = nums[0];
            const str = nums[1];
            const mag = nums[2];
            let m = Math.floor((level * str) / 128);
            const bonus = Math.floor((level * mag) / 128);
            const n = Math.ceil((128 * (m + 1)) / str);
            const ns = Math.ceil((128 * (bonus + 1)) / mag);
            m += bonus + 2;
            return ("At Level " +
                level +
                ", with " +
                str +
                " Strength and " +
                mag +
                " Magic, your Rune Weapon M is " +
                m +
                ". To reach the next M, you need to reach level " +
                n +
                " for Strength and " +
                ns +
                " for Magic.");
        }
    }
};
async function mcalc(msg) {
    const args = msg.content
        .toLowerCase()
        .split(/ +/)
        .slice(1); // remove command name
    const strs = args.filter((i) => isNaN(parseInt(i, 10))); // extracts strings
    let type;
    if (strs.length < 1) {
        await msg.channel.createMessage("Sorry, you need to tell me what type of M you're calculating! Valid types: `" +
            Object.keys(mcalcTable).join(", ") +
            "`");
        return;
    }
    else {
        type = strs[0].toLowerCase();
    }
    if (!(type in mcalcTable)) {
        await msg.channel.createMessage("Sorry, you need to tell me what type of M you're calculating! Valid types: `" +
            Object.keys(mcalcTable).join(", ") +
            "`");
        return;
    }
    const mtype = mcalcTable[type];
    const nums = args.map((i) => parseInt(i, 10)).filter((i) => !isNaN(i)); // extracts numbers
    if (nums.length < mtype.args.length) {
        await msg.channel.createMessage("Sorry, I need more numbers! Arguments for `" + type + "`: " + mtype.args.join(", "));
        return;
    }
    await msg.channel.createMessage(mtype.calc(nums));
}
const hps = [
    0,
    20,
    25,
    30,
    40,
    50,
    60,
    70,
    80,
    90,
    100,
    120,
    140,
    160,
    180,
    200,
    220,
    240,
    260,
    280,
    300,
    320,
    340,
    360,
    380,
    400,
    420,
    440,
    460,
    480,
    500,
    530,
    560,
    590,
    620,
    650,
    690,
    730,
    770,
    810,
    850,
    900,
    950,
    1000,
    1050,
    1100,
    1160,
    1220,
    1280,
    1340,
    1400,
    1460,
    1520,
    1580,
    1640,
    1700,
    1760,
    1820,
    1880,
    1940,
    2000,
    2050,
    2100,
    2150,
    2200,
    2250,
    2300,
    2350,
    2400,
    2450,
    2500,
    2550,
    2600,
    2650,
    2700,
    2750,
    2800,
    2850,
    2900,
    2950,
    3000,
    3050,
    3100,
    3150,
    3200,
    3250,
    3300,
    3350,
    3400,
    3450,
    3500,
    3550,
    3600,
    3650,
    3700,
    3750,
    3800,
    3850,
    3900,
    3950
];
// .almagest
async function almagest(msg) {
    const args = msg.content.toLowerCase().split(/ +/);
    let vit = parseInt(args[1], 10);
    if (isNaN(vit) || vit > 99) {
        const query = args.slice(1).join("");
        const result = classes.find((c) => c.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query));
        if (result && args.length > 1) {
            vit = result.vit;
        }
        else {
            await msg.channel.createMessage("NED's Almagest can deal 1620 to 1665 Holy damage and inflict Sap. " +
                "Good luck! (Only 720 to 740 damage if you have Shell! Yay!)");
            return;
        }
    }
    const target = Math.ceil((32 * 1665) / (vit + 32));
    const buffTarget = Math.ceil((32 * 1725) / (vit + 32));
    let level = 0;
    let buffLevel = 1;
    while (hps[level] < target || hps[buffLevel] < buffTarget) {
        if (hps[level] < target) {
            level++;
        }
        if (hps[buffLevel] < buffTarget) {
            buffLevel++;
        }
    }
    const finalHP = Math.floor((hps[level] * (vit + 32)) / 32);
    const finalBuffHP = Math.floor((hps[buffLevel] * (vit + 32)) / 32);
    let out = "At " + vit + " vitality, you will need to be level " + level + " (" + finalHP + " HP) to survive Almagest";
    if (level === buffLevel) {
        out += " with a safe buffer.";
    }
    else {
        out += ", or level " + buffLevel + " (" + finalBuffHP + " HP) to survive Almagest with a safe buffer.";
    }
    await msg.channel.createMessage(out);
}
function clean(s) {
    return s.toLowerCase().replace(/\s+/g, "");
}
async function combine(msg) {
    const args = msg.content.toLowerCase().split(/\s+/);
    args.shift();
    const combName = args.join("");
    const comb = combines.find(c => clean(c.name) === combName || clean(c.item) === combName);
    if (comb) {
        let out = "Combine shot with __" + comb.item + "__ for";
        if (comb.text) {
            out += ` **${comb.name} Shot**, **${comb.name} Burst**, **${comb.name} Cannon**\n${comb.text}`;
        }
        else {
            out += `:\n**${comb.name} Shot**\n${comb.shot}\n**${comb.name} Burst**\n${comb.burst}\n**${comb.name} Cannon**\n${comb.cannon}`;
        }
        await msg.channel.createMessage(out);
    }
    else {
        await msg.channel.createMessage("Sorry, I don't have a combination for that item or name.\n" +
            "If you're asking about an item, make sure you're using the GBA name, and I don't need the shot!\n" +
            'If you\'re looking up a name, I don\'t need "Shot", "Burst" or "Cannon", just the first bit!');
    }
}
async function getIngredientName(query) {
    const q = clean(query);
    const empty = [];
    const ing = mixes
        .reduce((prev, cur) => prev.concat(cur.mixes.reduce((p, c) => p.concat(c), empty)), empty)
        .find(i => clean(i).includes(q));
    return ing;
}
async function mix(msg) {
    const args = msg.content.toLowerCase().split(/\s+/);
    args.shift();
    const mode = args.shift();
    const query = args.join("");
    if (!mode || !(mode === "to" || mode === "from")) {
        await msg.channel.createMessage("Sorry, I need to know which direction to search!\n" +
            "Type `!mix from` to specify ingredients, or `!mix to` to specify the mix. " +
            "If you're looking for the chart, use `.chemchart`.");
        return;
    }
    if (mode === "to") {
        const curMix = mixes.find(m => clean(m.name).includes(query) || (!!m.snes && clean(m.snes).includes(query)));
        if (curMix) {
            const out = "__**" +
                curMix.name +
                "**__\nEffects: " +
                curMix.desc +
                "\n" +
                "Ingredients: " +
                curMix.mixes.map(m => m.join(" + ")).join(", ");
            await msg.channel.createMessage(out);
        }
        else {
            await msg.channel.createMessage("Sorry, I couldn't find a mix with that name!");
        }
    }
    else {
        // if mode === "from"
        const ingredients = query.split("+").slice(0, 2);
        if (ingredients.length === 1) {
            const ing = await getIngredientName(ingredients[0]);
            if (!ing) {
                await msg.channel.createMessage("Sorry, I don't know what ingredient you mean by `" + ingredients[0] + "`!");
                return;
            }
            // filter for mixes including thecommands ingredient
            const curMixes = mixes.filter(m => !!m.mixes.find(ings => ings.includes(ing)));
            if (curMixes.length > 0) {
                let out = "Mixing with __" + ing + "__:\n";
                out += curMixes
                    .map(m => m.name +
                    " (" +
                    m.mixes
                        .filter(i => i.includes(ing))
                        .map(i => {
                        if (i[0] === i[1]) {
                            return i[0];
                        }
                        return i.find(n => n !== ing);
                    })
                        .join("/") +
                    ")")
                    .join("\n");
                await msg.channel.createMessage(out);
            }
            else {
                await msg.channel.createMessage("Sorry, I couldn't find a mix using that ingredient!");
            }
        }
        else {
            const quer1 = await getIngredientName(ingredients[0]);
            if (!quer1) {
                await msg.channel.createMessage("Sorry, I don't know what ingredient you mean by `" + ingredients[0] + "`!");
                return;
            }
            const quer2 = await getIngredientName(ingredients[1]);
            if (!quer2) {
                await msg.channel.createMessage("Sorry, I don't know what ingredient you mean by `" + ingredients[1] + "`!");
                return;
            }
            const curMix = mixes.find(m => !!m.mixes.find(i => (i[0] === quer1 && i[1] === quer2) || (i[0] === quer2 && i[1] === quer1)));
            if (curMix) {
                const out = "__**" +
                    curMix.name +
                    "**__\nEffects: " +
                    curMix.desc +
                    "\n" +
                    "Ingredients: " +
                    curMix.mixes.map(m => m.join(" + ")).join(", ");
                await msg.channel.createMessage(out);
            }
            else {
                await msg.channel.createMessage("Sorry, I couldn't find a mix with __" + quer1 + "__ and __" + quer2 + "__!");
            }
        }
    }
}
async function isBowBetter(msg) {
    // Chance of Killer Axe attack to hit is 85%
    // Proc chance of Killer Axe is 33%
    // % chance of Death proc hitting is 80 + Char Level - Seal Level. Seal Level is 77 so this is Char Level + 3.
    // Seal magic evade is 20% to 80% to not evade.
    // These are independent and all need to occur, so total chance is multiplied
    // Compare to Killer Bow flat 8% chance and using !aim to guarantee hit
    const args = msg.content
        .toLowerCase()
        .split(/ +/)
        .slice(1);
    let level = parseInt(args[0], 10);
    if (isNaN(level) || level < 1) {
        await msg.channel.createMessage("Sorry, I need your level!");
        return;
    }
    let capped = false;
    if (level > 97) {
        capped = true;
        level = 97;
    }
    // should be (3+level)/100 for proportion, but to get percentage we *100, so it cancels
    // 0.85 * 0.33 * 0.8 = 0.2244. The less we leave to JS' imprecision the better
    const axeChance = 0.2244 * (3 + level);
    let out;
    if (axeChance >= 8) {
        out =
            "Death Sickle is better vs the Seal Guardians! You've got " +
                axeChance.toPrecision(4) +
                "% odds per !Attack use.";
    }
    else {
        out =
            "Killer Bow is better vs the Seal Guardians! Death Sickle only has " +
                axeChance.toPrecision(4) +
                "% chance per !Attack use.";
    }
    if (capped) {
        out += "\n(Level capped at 97, no increase past that.)";
    }
    await msg.channel.createMessage(out);
}
// DIY fiestas
var jobSets;
(function (jobSets) {
    jobSets[jobSets["JOBS_ALL"] = 0] = "JOBS_ALL";
    jobSets[jobSets["JOBS_MAGE"] = 1] = "JOBS_MAGE";
    jobSets[jobSets["JOBS_PHYS"] = 2] = "JOBS_PHYS";
})(jobSets || (jobSets = {}));
var extraModes;
(function (extraModes) {
    extraModes[extraModes["MODE_NONE"] = 0] = "MODE_NONE";
    extraModes[extraModes["MODE_FORB"] = 1] = "MODE_FORB";
    extraModes[extraModes["MODE_FIFTH"] = 2] = "MODE_FIFTH";
    extraModes[extraModes["MODE_NATURAL"] = 3] = "MODE_NATURAL";
})(extraModes || (extraModes = {}));
var berserkerRisks;
(function (berserkerRisks) {
    berserkerRisks[berserkerRisks["RISK_NONE"] = 0] = "RISK_NONE";
    berserkerRisks[berserkerRisks["RISK_LOW"] = 1] = "RISK_LOW";
    berserkerRisks[berserkerRisks["RISK_MODERATE"] = 2] = "RISK_MODERATE";
    berserkerRisks[berserkerRisks["RISK_HIGH"] = 3] = "RISK_HIGH";
    berserkerRisks[berserkerRisks["RISK_EVERHATE"] = 4] = "RISK_EVERHATE";
})(berserkerRisks || (berserkerRisks = {}));
var spoilers;
(function (spoilers) {
    spoilers[spoilers["SHOW_JOBS"] = 0] = "SHOW_JOBS";
    spoilers[spoilers["HIDE_JOBS"] = 1] = "HIDE_JOBS";
})(spoilers || (spoilers = {}));
const windJobs = (allJobs) => allJobs.filter((c) => c.crystal === 1);
const waterJobs = (allJobs) => allJobs.filter((c) => c.crystal === 2);
const fireJobs = (allJobs) => allJobs.filter((c) => c.crystal === 3);
const earthJobs = (allJobs) => allJobs.filter((c) => c.crystal === 4);
function riskRoll(allJobs, riskMode, normal, spoil) {
    let risky = 0;
    let risks = 0;
    switch (riskMode) {
        case berserkerRisks.RISK_LOW:
            risky = 12;
            risks = 1;
            break;
        case berserkerRisks.RISK_MODERATE:
            risky = 25;
            risks = 2;
            break;
        case berserkerRisks.RISK_HIGH:
            risky = 50;
            risks = 3;
            break;
        case berserkerRisks.RISK_EVERHATE:
            risky = 100;
            risks = allJobs.length;
            break;
    }
    if (normal) {
        if (getIncInt(0, 99) < risky) {
            if (spoil === spoilers.SHOW_JOBS) {
                allJobs[1] = `Berserker (RISKED ${allJobs[1]}!)`; // water only
            }
            else {
                // HIDE_JOBS
                allJobs[1] = `Berserker`;
            }
        }
        return allJobs;
    }
    for (let i = 0; i < allJobs.length; i++) {
        if (risks <= 0) {
            break;
        }
        if (getIncInt(0, 99) < risky) {
            if (spoil === spoilers.SHOW_JOBS) {
                allJobs[i] = `Berserker (RISKED ${allJobs[i]}!)`;
            }
            else {
                allJobs[i] = `Berserker`;
            }
            risks--;
        }
    }
    return allJobs;
}
const fiestaGenerators = {
    0: (allJobs, fifth) => {
        const winJobs = windJobs(allJobs);
        const out = [winJobs[getIncInt(0, winJobs.length - 1)].name];
        const watJobs = waterJobs(allJobs);
        out.push(watJobs[getIncInt(0, watJobs.length - 1)].name);
        const firJobs = fireJobs(allJobs);
        out.push(firJobs[getIncInt(0, firJobs.length - 1)].name);
        const earJobs = earthJobs(allJobs);
        const index = getIncInt(0, earJobs.length - 1);
        out.push(earJobs[index].name);
        if (fifth) {
            // remove the already-selected class from the array
            earJobs.splice(index, 1);
            out.push(earJobs[getIncInt(0, firJobs.length - 1)].name);
        }
        return out;
    },
    1: (allJobs, fifth) => {
        const winJobs = windJobs(allJobs);
        const out = [winJobs[getIncInt(0, winJobs.length - 1)].name];
        const randWater = allJobs.filter(c => c.crystal < 3 && !out.includes(c.name));
        out.push(randWater[getIncInt(0, randWater.length - 1)].name);
        const randFire = allJobs.filter(c => c.crystal < 4 && !out.includes(c.name));
        out.push(randFire[getIncInt(0, randFire.length - 1)].name);
        const randEarth = allJobs.filter(c => !out.includes(c.name));
        const index = getIncInt(0, randEarth.length - 1);
        out.push(randEarth[index].name);
        if (fifth) {
            randEarth.splice(index, 1);
            out.push(randEarth[getIncInt(0, randEarth.length - 1)].name);
        }
        return out;
    },
    2: (allJobs, fifth) => {
        const out = [allJobs[getIncInt(0, allJobs.length - 1)].name];
        for (let i = 0; i < (fifth ? 4 : 3); i++) {
            out.push(allJobs[getIncInt(0, allJobs.length - 1)].name);
        }
        return out;
    },
    3: (allJobs, fifth) => {
        return shuffle(allJobs)
            .slice(0, fifth ? 5 : 4)
            .map(c => c.name);
    },
    4: (allJobs, fifth) => {
        const forbiddenWind = windJobs(allJobs);
        forbiddenWind.push(...getClassesByNames(["Time Mage"]));
        const forbiddenWater = getClassesByNames([
            "Red Mage",
            "Summoner",
            "Berserker",
            "Mystic Knight",
            "Beastmaster",
            "Geomancer",
            "Ninja"
        ]);
        const forbiddenFire = getClassesByNames(["Bard", "Ranger", "Dancer"]);
        forbiddenFire.push(...earthJobs(allJobs));
        const forbiddenEarth = classes.filter(c => c.crystal === 5);
        const out = [
            forbiddenWind[getIncInt(0, forbiddenWind.length - 1)].name,
            forbiddenWater[getIncInt(0, forbiddenWater.length - 1)].name,
            forbiddenFire[getIncInt(0, forbiddenFire.length - 1)].name,
            forbiddenEarth[getIncInt(0, forbiddenEarth.length - 1)].name
        ];
        if (fifth) {
            out.push("nothing. She joins before you get the job, silly!");
        }
        return out;
    }
};
function diyFiesta(mainMode) {
    return async (msg) => {
        const content = msg.content.toLowerCase().split(/\s+/); // lower-case and split by spaces
        let jobSet = jobSets.JOBS_ALL;
        let extraMode = extraModes.MODE_NONE;
        let risk = berserkerRisks.RISK_NONE;
        let spoil = spoilers.SHOW_JOBS;
        const flags = content[0].split("+"); // anything after space is user comment
        flags.shift(); // remove, e.g., .normal from .normal+forbidden
        for (const flag of flags) {
            // only check for change if currently default, so first relevant flag affects
            if (jobSet === jobSets.JOBS_ALL) {
                switch (flag) {
                    case "750":
                        jobSet = jobSets.JOBS_MAGE;
                        break;
                    case "no750":
                        jobSet = jobSets.JOBS_PHYS;
                        break;
                }
            }
            if (extraMode === extraModes.MODE_NONE) {
                switch (flag) {
                    case "forbidden":
                    case "void":
                        extraMode = extraModes.MODE_FORB;
                        break;
                    case "fifthjob":
                        extraMode = extraModes.MODE_FIFTH;
                        break;
                    case "natural":
                        extraMode = extraModes.MODE_NATURAL;
                        break;
                }
            }
            if (risk === berserkerRisks.RISK_NONE) {
                switch (flag) {
                    case "lowrisk":
                        risk = berserkerRisks.RISK_LOW;
                        break;
                    case "berserkerrisk":
                    case "risk":
                        risk = berserkerRisks.RISK_MODERATE;
                        break;
                    case "highrisk":
                        risk = berserkerRisks.RISK_HIGH;
                        break;
                    case "blameeverhate":
                        risk = berserkerRisks.RISK_EVERHATE;
                        break;
                }
            }
            if (spoil === spoilers.SHOW_JOBS) {
                switch (flag) {
                    case "hide":
                        spoil = spoilers.HIDE_JOBS;
                        break;
                }
            }
        }
        if (extraMode === extraModes.MODE_NATURAL) {
            await msg.channel.createMessage("🖕");
            return;
        }
        const allJobs = classes.filter(c => (mainMode === mainModes.MODE_PURE || c.crystal > 0) &&
            (mainMode === mainModes.MODE_ADV || c.crystal < 5) &&
            (jobSet === jobSets.JOBS_ALL ||
                (jobSet === jobSets.JOBS_MAGE && c.is750) ||
                (jobSet === jobSets.JOBS_PHYS && !c.is750)));
        let fiestaJobs = fiestaGenerators[mainMode](allJobs, extraMode === extraModes.MODE_FIFTH);
        // risk has to be applied before forbidden so it doesn't replace a banned job or ban a replaced job
        if (risk !== berserkerRisks.RISK_NONE) {
            fiestaJobs = riskRoll(fiestaJobs, risk, mainMode === mainModes.MODE_NORMAL, spoil);
        }
        let forbJob;
        // check whether forbidden job is not a berserker, for reaction later
        // needs to happen here so that assignment is outside if block
        let zerkFlag = false;
        if (extraMode === extraModes.MODE_FORB) {
            const index = getIncInt(0, fiestaJobs.length - 1);
            forbJob = fiestaJobs[index];
            zerkFlag = !forbJob.startsWith("Berserker");
            if (spoil === spoilers.SHOW_JOBS) {
                // if +hide is on, the strikethrough would spoil the voided job
                fiestaJobs[index] = "~~" + forbJob + "~~";
            }
        }
        const bar = spoil === spoilers.HIDE_JOBS ? "|| " : "";
        let out = "Wind Job: " +
            fiestaJobs[0] +
            "\nWater Job: " +
            bar +
            fiestaJobs[1] +
            bar +
            "\nFire Job: " +
            bar +
            fiestaJobs[2] +
            bar +
            "\nEarth Job: " +
            bar +
            fiestaJobs[3] +
            bar;
        if (extraMode === extraModes.MODE_FIFTH) {
            out += "\nKrile replaces Earth Job with: " + bar + fiestaJobs[4] + bar;
        }
        else if (extraMode === extraModes.MODE_FORB) {
            out += "\nLost to the void: " + bar + forbJob + bar;
        }
        const count = extraMode === extraModes.MODE_FIFTH ? 5 : 4;
        if (spoil === spoilers.HIDE_JOBS) {
            const m = await replyDM(msg, out);
            if ((risk === berserkerRisks.RISK_HIGH &&
                fiestaJobs.filter(j => j.startsWith("Berserker")).length === count) ||
                (fiestaJobs.filter(j => j.startsWith("Berserker")).length > 2 &&
                    extraMode === extraModes.MODE_FORB &&
                    zerkFlag)) {
                await m.addReaction("🤣");
            }
        }
        else {
            const m = await msg.channel.createMessage(out);
            if ((risk === berserkerRisks.RISK_HIGH &&
                fiestaJobs.filter(j => j.startsWith("Berserker")).length === count) ||
                (fiestaJobs.filter(j => j.startsWith("Berserker")).length > 2 &&
                    extraMode === extraModes.MODE_FORB &&
                    zerkFlag)) {
                await m.addReaction("🤣");
            }
        }
    };
}
function getClassesByNames(names) {
    const out = [];
    for (const name of names) {
        const job = classes.find((c) => c.name === name);
        if (job) {
            out.push(job);
        }
    }
    return out;
}
async function sevenFifty(msg) {
    msg.content = ".normal+750";
    await diyFiesta(mainModes.MODE_NORMAL)(msg);
}
async function noSevenFifty(msg) {
    msg.content = ".normal+no750";
    await diyFiesta(mainModes.MODE_NORMAL)(msg);
}
async function chaosSevenFifty(msg) {
    msg.content = ".chaos+750";
    await diyFiesta(mainModes.MODE_CHAOS)(msg);
}
async function chaosNoSevenFifty(msg) {
    msg.content = ".chaos+no750";
    await diyFiesta(mainModes.MODE_CHAOS)(msg);
}
async function forbidden(msg) {
    // would be alias for advanced+forbidden, but has special case for not forbidding earth job
    const forbiddenWind = windJobs(classes);
    forbiddenWind.push(...getClassesByNames(["Time Mage"]));
    const forbiddenWater = getClassesByNames([
        "Red Mage",
        "Summoner",
        "Berserker",
        "Mystic Knight",
        "Beastmaster",
        "Geomancer",
        "Ninja"
    ]);
    const forbiddenFire = getClassesByNames(["Bard", "Ranger", "Dancer"]);
    forbiddenFire.push(...earthJobs(classes));
    const forbiddenEarth = classes.filter(c => c.crystal === 5);
    const forbJobs = [
        forbiddenWind[getIncInt(0, forbiddenWind.length - 1)].name,
        forbiddenWater[getIncInt(0, forbiddenWater.length - 1)].name,
        forbiddenFire[getIncInt(0, forbiddenFire.length - 1)].name,
        forbiddenEarth[getIncInt(0, forbiddenEarth.length - 1)].name
    ];
    const index = getIncInt(0, forbJobs.length - 2);
    const voidJob = forbJobs[index];
    forbJobs[index] = "~~" + forbJobs[index] + "~~";
    await msg.channel.createMessage("Wind Job: " +
        forbJobs[0] +
        "\nWater Job: " +
        forbJobs[1] +
        "\nFire Job: " +
        forbJobs[2] +
        "\nEarth Job: " +
        forbJobs[3] +
        "\nLost to the void: " +
        voidJob);
}
// .dd
const ddLines = [
    "I suggest using **ENCOUNTER MANIPULATION**",
    "Good thing I can !Control Shield Dragons so I can hashtag grind on them for **TWO HOURS**",
    "No, I have to let the Aegis Shield burn, I ran the numbers, doing it without the Flame Shield is impossible.",
    "Running through the Gil Turtle cave four times lets you buy sufficient cottages!",
    "You'll need Bartz in critical HP for this fight. It's not like the Seal Guardians have physical attacks...",
    "I may not have Summoner, but I absolutely have to go get Catoblepas for... some reason!",
    "...what free Hermes Sandals?",
    "I just realized I didn't put Butz in the front row... (I didn't notice Krile either...)",
    "I'm not using Catch and Release for this fight because I can't have four Beastmasters.",
    "**I'M NOT USING FOCUS, IT DOESN'T DO ENOUGH DAMAGE. I TESTED THIS EXTENSIVELY**",
    "I can't get the genji shield off of Gilgamesh because I can't steal.",
    "THE LAG IN THE GAME just prevented my full party curaga!",
    "Hold on, I need to use my eyedrops on the person WHO HAS RAPID FIRE.",
    "Good thing I have a map of Exdeath's Castle so I can completely miss the Hayate Bow!",
    "Giving your Dancer the Chicken Knife over your Ranger is Sound Dragondarch Planning!",
    "Yes, I believe my Ranger with Rapid Fire is the lowest damage character. I will make her a Red Mage instead.",
    "Bartz, please use !Dance while we attempt to run. While wielding the Chicken Knife.",
    "http://winvm.kyrosiris.com/optimalhelmchoices.png",
    "I wish I, a person with access to Equip Bows, had a way to blind someone!",
    "But he's not weak to Air, as far as I'm aware of! ...Oh, wait, yes he is, never mind.",
    "Sword Dance is the best form of damage we've got with this team.",
    "Good thing I have Red Mage so I can hashtag grind Mini Dragons for" +
        " **TWO HOURS** while my sycophants in chat defend it!",
    "Ladies and gentlemen, the grinding is over, we've hit level 32! ...now what do I do?",
    "Yes! Sub 5-hour world 1! I'm so good.",
    "Oh my god, the Wonder Wand missed!",
    "...Does the Hayate Bow even sell?",
    "There's no save points around here. *enters next room, finds save point*",
    "I am a fucking idiot. I have this thing called !Mix, why am I not using it?",
    "Is Archeosaur fuckin' heavy or something?",
    "ANYTHING but the fucking chicken knife!",
    "Now I actually know what the fuck I'm doing here.",
    "I actually don't do serious speedruns of this game. " +
        "I just have a fairly good amount of knowledge about how the mechanics work and stuff.",
    "I need Faris solo to gain experience for **#GOBLINPUNCH**. " +
        "*game overs in the Wind Shrine without having saved the game*",
    "THE CHEST IS OPEN! WHERE IS THE DRAGON FANG? I'M STARING AT THE OPEN CHEST!!!",
    "I'm gonna try something dumb!",
    "\\*swings Blizzara Blade at immune target\\* Can you guys please hit???",
    "Well, he can't cast Aero now. \\*Gigas casts Aero twice\\*",
    "Being higher level isn't really going to help outside of getting higher damage multipliers, basically.",
    "My notes assume I don't get a Lamia Tiara. \\*proceeds to grind for one anyways\\*",
    "I have a really really dumb strategy! <:yayclod:362777481838592010>",
    "I'll admit, I completely forgot he can be confused, that's a better strat than what I'm using.",
    "Well that was definitely a more consistent strat than what I was trying to do before.",
    "Two bears and an axe. And then just hope for good damage rolls (to catch a Prototype).",
    "https://i.imgur.com/CAog7ki.png",
    "I think I grinded for a little bit too long.",
    "75% of chance to hit, and of course I whiff it."
];
async function dd(msg) {
    const args = msg.content.toLowerCase().split(/ +/);
    let index = parseInt(args[1], 10);
    if (args.length < 2) {
        index = getIncInt(0, ddLines.length - 1);
        await msg.channel.createMessage(ddLines[index] + " (#" + (index + 1) + ")");
    }
    else if (isNaN(index)) {
        const matches = ddLines.filter(l => l.toLowerCase().includes(args.slice(1).join(" ")));
        if (matches.length > 0) {
            const i = getIncInt(0, matches.length - 1);
            await msg.channel.createMessage(matches[i] + " (#" + (ddLines.indexOf(matches[i]) + 1) + ")");
        }
        else {
            await msg.channel.createMessage("No, I have to let that quote burn, I ran the numbers, doing it with letters is impossible.");
        }
    }
    else if (index > ddLines.length || index < 1) {
        index = getIncInt(0, ddLines.length - 1);
        await msg.channel.createMessage("Oh my god, the quote wand missed!\n" + ddLines[index] + " (#" + (index + 1) + ")");
    }
    else {
        await msg.channel.createMessage(ddLines[index - 1] + " (#" + index + ")");
    }
}
// speedtrap
async function trapped(msg) {
    stats.victims++;
    if (msg.author.id === "90507312564805632") {
        stats.kinuVictims++;
    }
    await msg.channel.createMessage("Gotta go fast! Total Victims: " + stats.victims);
    await fs.writeFile(dataFile, JSON.stringify(stats, null, 4));
}
async function victim(msg) {
    await msg.channel.createMessage("Dr. Clapperclaw's Deadly Speed Trap has snared " +
        stats.victims +
        " victims! (" +
        stats.kinuVictims +
        " of them are alcharagia...)");
}
async function breakRod(msg) {
    const args = msg.content.toLowerCase().split(/ +/);
    const index = parseInt(args[1], 10);
    if (isNaN(index) || args.length === 1 || index < 0 || index > 100) {
        stats.rodsBroken++;
    }
    else {
        stats.rodsBroken += index;
    }
    await msg.channel.createMessage("750 blaze rods errday (" + stats.rodsBroken + " broken so far!)");
    await fs.writeFile(dataFile, JSON.stringify(stats, null, 4));
}
async function broken(msg) {
    await msg.channel.createMessage("You godless heathens have blazed " + stats.rodsBroken + " rods so far. DARE has failed you all.");
}
// goofy shit
const secsPerDay = 24 * 60 * 60;
const secsPerHour = 60 * 60;
async function countdown(msg) {
    const fiestaDate = Date.UTC(2019, 5, 19, 4, 0, 0); // 0 is Jan, so 5 is June
    const now = Date.now();
    const distance = (fiestaDate - now) / 1000;
    const days = Math.floor(distance / secsPerDay);
    const hours = Math.floor((distance % secsPerDay) / secsPerHour);
    const minutes = Math.floor((distance % secsPerHour) / 60);
    const seconds = Math.floor(distance % 60);
    await msg.channel.createMessage("Fiesta starts in " + days + " days, " + hours + " hours, " + minutes + " minutes, and " + seconds + " seconds!");
}
async function rundown(msg) {
    const runDate = Date.UTC(2019, 5, 16, 15, 0, 0);
    const now = Date.now();
    const distance = (runDate - now) / 1000;
    const days = Math.floor(distance / secsPerDay);
    const hours = Math.floor((distance % secsPerDay) / secsPerHour);
    const minutes = Math.floor((distance % secsPerHour) / 60);
    const seconds = Math.floor(distance % 60);
    await msg.channel.createMessage(`Run starts in ${days}d ${hours}h ${minutes}m ${seconds}s!`);
}
async function zerky(msg) {
    await msg.channel.createMessage("http://www.soldoutcomic.com/Etc/Sketchdump/ThreeOrMoreDeathStillWorryZerky.png");
}
// job DB
async function jobs(msg) {
    const args = msg.content.split(/ +/);
    // expected args - 0: ".jobs", 1: "lookup" or "register", 2: wind job or @mention (str),
    // 3: water job (str), 4: fire job (str), 5: earth job (str)
    if (args.length < 2 || args.length > 6) {
        await msg.channel.createMessage("Acceptable syntax: `.jobs lookup [user]` or `.jobs register <wind> <water> <fire> <earth>`. " +
            "Please ensure you provide jobs when registering. Please delimit with spaces, " +
            "and keep two-word jobs to one word.");
        return;
    }
    if (args[1].toLowerCase() === "register") {
        if (args.length < 3) {
            await msg.channel.createMessage("Acceptable syntax: `.jobs lookup [user]` or `.jobs register <wind> <water> <fire> <earth>`. " +
                "Please ensure you provide jobs when registering. " +
                "Please delimit with spaces, and keep two-word jobs to one word.");
            return;
        }
        const curJobs = args.slice(2);
        jobList[msg.author.id] = curJobs;
        await fs.writeFile(jobFile, JSON.stringify(jobList, null, 4));
        await msg.channel.createMessage("Got it, " + msg.author.username + ". Your jobs (" + curJobs.join("/") + ") are registered.");
    }
    else if (args[1].toLowerCase() === "lookup") {
        let mentioned;
        if (msg.mentions.length > 0) {
            mentioned = msg.mentions[0];
        }
        else if (args.length > 2) {
            // try lookup by name
            const uName = args
                .slice(2)
                .join(" ")
                .toLowerCase();
            const members = msg.channel instanceof Eris.GuildChannel ? msg.channel.guild.members : undefined;
            const user = bot.users.find(u => {
                if (u.username.toLowerCase().includes(uName)) {
                    return true;
                }
                if (members) {
                    const mem = members.get(u.id);
                    if (mem && mem.nick && mem.nick.toLowerCase().includes(uName)) {
                        return true;
                    }
                }
                return false;
            });
            if (user) {
                mentioned = user;
            }
            else {
                await msg.channel.createMessage("Sorry, I can't find that user! Have you tried using an @mention?");
                return;
            }
        }
        else {
            mentioned = msg.author;
        }
        const curJobs = jobList[mentioned.id];
        const name = mentioned.username;
        if (!curJobs) {
            await msg.channel.createMessage("I don't have jobs on file for " + name + ", sorry!");
        }
        else {
            await msg.channel.createMessage("I have " + name + "'s jobs as: " + curJobs.join("/") + ".");
        }
    }
    else {
        await msg.channel.createMessage("Acceptable syntax: `.jobs lookup username` or `.jobs register <wind> <water> <fire> <earth>`. " +
            "Please ensure you provide jobs when registering. " +
            "Please delimit with spaces, and keep two-word jobs to one word.");
    }
}
// misc functions
function getIncInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
async function forbiddenRisk(msg) {
    if (msg.member) {
        await msg.member.addRole("584065205760163840");
        await msg.addReaction("🏆");
        await msg.addReaction("zerky:455235268174413844");
    }
    else {
        await msg.channel.createMessage("Sorry, I can only add you to a role in the server!");
    }
}
async function forbiddenLite(msg) {
    if (msg.member) {
        await msg.member.addRole("584065250144550913");
        await msg.addReaction("🏆");
        // await msg.addReaction("black101:326153094868238338");
    }
    else {
        await msg.channel.createMessage("Sorry, I can only add you to a role in the server!");
    }
}
async function purify() {
    stats = {
        kinuVictims: 0,
        rodsBroken: 0,
        victims: 0
    };
}
// attributes
async function attributes(msg) {
    if (monsters.length > 0) {
        await replyDM(msg, "The monster database has changed! " +
            "Instead of looking individual attributes, you use seperate commands for these categories:\n" +
            "`.info` shows everything but AI\n" +
            "`.stats` just shows the numbers\n" +
            "`.weak` shows things like elemental affinities, statuses, and creature types\n" +
            "`.ability` shows abilities like magic and !Releases\n" +
            "`.loot` shows drops and !Steals\n" +
            "`.ai` shows the AI routine");
    }
}
async function enemyInfo(msg, enemy, type) {
    let out;
    switch (type) {
        case "profile":
            out = enemy.profile;
            break;
        case "ai":
            out = enemy.ai;
            break;
        case "stats":
            out = enemy.stats;
            break;
        case "weak":
            out = enemy.weak;
            break;
        case "ability":
            out = enemy.ability;
            break;
        case "loot":
            out = enemy.loot;
            break;
    }
    if (out) {
        await replyDM(msg, out);
    }
}
// monster data query
const aliases = {
    meatdeath: "Exdeath (Exdeath's Castle)",
    meatgamesh: "Gilgamesh (Exdeath's Castle)",
    rugwizard: "Omniscient",
    shipgamesh: "Gilgamesh (Ship)",
    treedeath: "Exdeath (Final)"
};
async function enemySearch(msg, query, type) {
    if (query.trim().toLowerCase() in aliases) {
        query = aliases[query.trim().toLowerCase()].toLowerCase();
    }
    const matches = monsters.filter((enemy) => enemy.name.toLowerCase().includes(query) || enemy.rpgeName.toLowerCase().includes(query)); // new array which is all enemies with name including message
    if (matches.length < 1) {
        await replyDM(msg, "Sorry, I couldn't find any enemies with that name!");
    }
    else if (matches.length === 1) {
        enemyInfo(msg, matches[0], type);
    }
    else {
        let out = "I'm not sure which enemy you mean! Please pick one of the following:\n";
        let i = 1; // lists from 1-n for humans even tho arrays start at 0
        for (const match of matches) {
            out += i + ". " + match.name + "\n";
            i++;
        }
        queries[msg.author.id] = {
            // store data in queries, in the form of its own tiny key-value pair
            list: matches,
            type
        };
        try {
            await replyDM(msg, out);
        }
        catch (e) {
            await replyDM(msg, "There was some sort of error sending you a list of monsters with names that matched." +
                " This can mean the message was too long. Did you search something too short?" +
                " Try again with more of the name.");
        }
    }
}
async function enemyClarify(msg) {
    const input = parseInt(msg.content, 10);
    if (isNaN(input) || !(input - 1 in queries[msg.author.id].list)) {
        // if user didn't type a number or the number wasn't listed (-1 to convert from 1-start to 0-start)
        await replyDM(msg, "Sorry, that wasn't the number of a result I had saved. Please try searching again.");
    }
    else {
        enemyInfo(msg, queries[msg.author.id].list[input - 1], queries[msg.author.id].type);
    }
    delete queries[msg.author.id]; // remove element from object
}
function info(type) {
    return async (msg) => {
        const query = msg.content
            .toLowerCase()
            .split(/ +/)
            .slice(1)
            .join(" ");
        enemySearch(msg, query, type);
    };
}
const letterEmoji = [
    "🇦",
    "🇧",
    "🇨",
    "🇩",
    "🇪",
    "🇫",
    "🇬",
    "🇭",
    "🇮",
    "🇯",
    "🇰",
    "🇱",
    "🇲",
    "🇳",
    "🇴",
    "🇵",
    "🇶",
    "🇷",
    "🇸",
    "🇹",
    "🇺",
    "🇻",
    "🇼",
    "🇽",
    "🇾",
    "🇿"
];
function numToEmoji(i) {
    if (i === 100) {
        return "💯";
    }
    if (i < 0) {
        throw new Error("That number cannot be represented as an emoji!");
    }
    if (i < 10) {
        return i + "\u20e3";
    }
    const letterIndex = i - 10;
    if (letterIndex in letterEmoji) {
        return letterEmoji[letterIndex];
    }
    throw new Error("That number cannot be represented as an emoji!");
}
async function randcolour(msg) {
    const snes = msg.content.toLowerCase().includes("snes");
    const max = snes ? 31 : 7;
    const colours = [getIncInt(0, max), getIncInt(0, max), getIncInt(0, max)];
    const emoji = [];
    emoji.push(numToEmoji(colours[0]));
    const nextColour = numToEmoji(colours[1]);
    if (emoji.includes(nextColour)) {
        emoji.push("◀");
    }
    else {
        emoji.push(nextColour);
    }
    const lastColour = numToEmoji(colours[2]);
    const index = emoji.indexOf(lastColour);
    if (index === 0) {
        if (emoji.includes("◀")) {
            // three of a kind
            emoji.push("➕");
        }
        else {
            emoji.push("◀");
        }
    }
    else if (index === 1) {
        emoji.push("▶");
    }
    else {
        emoji.push(lastColour);
    }
    for (const emo of emoji) {
        await msg.addReaction(emo);
    }
}
async function order(msg) {
    const reactions = ["🇧", "🇱", "🇬", "🇫"];
    const emoji = shuffle(reactions);
    for (const emo of emoji) {
        await msg.addReaction(emo);
    }
}
async function deathByMaths(msg) {
    const args = msg.content
        .toLowerCase()
        .split(/ +/)
        .slice(1);
    let level = parseInt(args[0], 10);
    const oLevel = level;
    if (isNaN(level)) {
        // later make it search enemy name
        await msg.channel.createMessage("Sorry, I need the level of an enemy!");
    }
    else {
        const sparks = {
            2: -1,
            3: -1,
            4: -1,
            5: -1
        };
        let s = 0;
        while (level > 1 && Object.values(sparks).filter(i => i < 0).length > 0) {
            Object.keys(sparks).forEach(k => {
                const key = parseInt(k, 10);
                if (level % key === 0 && sparks[key] < 0) {
                    sparks[key] = s;
                }
            });
            level = Math.floor(level / 2);
            s++;
        }
        let out = "To get a level " +
            oLevel +
            " enemy's level divisible by the following numbers, it will take this many Dark Sparks:\n";
        out += Object.keys(sparks)
            .map(k => {
            const key = parseInt(k, 10);
            if (sparks[key] > 1) {
                return "**Level " + key + "**: " + sparks[key] + " Dark Sparks";
            }
            else if (sparks[key] === 1) {
                return "**Level " + key + "**: " + sparks[key] + " Dark Spark";
            }
            else if (sparks[key] === 0) {
                return "**Level " + key + "**: Already there!";
            }
            else {
                return "**Level " + key + "**: Will never reach";
            }
        })
            .join("\n");
        await msg.channel.createMessage(out);
    }
}
async function zeninage(msg) {
    if (getIncInt(0, 1)) {
        await msg.channel.createMessage("https://i.imgur.com/jdcTSzO.png");
    }
    else {
        await msg.channel.createMessage("The damage only goes up uP UP! http://i.imgur.com/7wxm7dy.gif");
    }
}
const damPerFling = (l) => Math.min((l - 20) * 150, 9999);
const flings = (l) => Math.ceil(60000 / damPerFling(l));
async function loadsOfMoney(msg) {
    const args = msg.content
        .toLowerCase()
        .split(/ +/)
        .slice(1);
    const level = parseInt(args[0], 10);
    if (isNaN(level) || level < 1 || level > 255) {
        await msg.channel.createMessage("Sorry, I need your level!");
        return;
    }
    if (level <= 20) {
        await msg.channel.createMessage("Sorry, at level " + level + ", your !Zeninage doesn't get through NED's defense!");
        return;
    }
    // damage per fling is level - DEF * 150
    // number of flings is NED's biggest HP / damage per fling, round up
    // cost to kill is cost per fling * number of flings
    // cost per fling is 50 * #targets * level
    const numFlings = flings(level);
    const cost = numFlings * 200 * level;
    if (numFlings === 7) {
        // damage cap
        await msg.channel.createMessage("At Level " +
            level +
            ", taking " +
            numFlings +
            " uses of !Zeninage, it will cost " +
            cost +
            " gil to kill Neo Exdeath. Because of the damage cap, any further levels only increase the cost.");
        return;
    }
    let nextLevel = level + 1;
    while (flings(nextLevel) === numFlings) {
        nextLevel++;
    }
    const nextCost = flings(nextLevel) * 200 * nextLevel;
    let out = "At Level " +
        level +
        ", taking " +
        numFlings +
        " uses of !Zeninage, it will cost " +
        cost +
        " gil to kill Neo Exdeath. The next level that reduces is the cost is " +
        nextLevel +
        ", where it takes " +
        flings(nextLevel) +
        " uses, costing " +
        nextCost +
        " gil.";
    if (nextLevel - level > 1) {
        out += " Any intermediate levels will increase the cost for no benefit.";
    }
    await msg.channel.createMessage(out);
}
async function jobData(msg) {
    const query = msg.content
        .split(/ +/)
        .slice(1)
        .join("")
        .toLowerCase();
    const result = classes.find((c) => c.name
        .toLowerCase()
        .replace(/ +/g, "")
        .includes(query) || c.short.includes(query));
    let out;
    if (result) {
        out = result.profile;
    }
    else {
        out = "Sorry, I can't find a class with that name!";
    }
    await msg.channel.createMessage(out);
}
const dmReplies = {};
async function replyDM(msg, content) {
    const chan = await msg.author.getDMChannel();
    const m = await chan.createMessage(content);
    if (msg.channel instanceof Eris.GuildChannel) {
        await msg.addReaction("📬");
    }
    dmReplies[msg.id] = content;
    // clear cache after a minute
    setTimeout((id) => {
        if (id in dmReplies) {
            delete dmReplies[id];
        }
    }, 60000, msg.id);
    return m;
}
Promise.all(proms).then(_ => {
    bot.connect();
}, err => {
    console.error("Error loading data files!");
    console.error(err);
});
//# sourceMappingURL=carby.js.map