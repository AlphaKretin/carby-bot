import * as Eris from "eris";
import * as fs from "mz/fs";
import { Job } from "./job";
import { Monster } from "./monster";

const auth = JSON.parse(fs.readFileSync("auth.json", "utf8"));

if (!auth.token) {
    console.error("Bot token not found at auth.json.token!");
    process.exit();
}

const bot = new Eris.Client(auth.token);

const classes: Job[] = [];
let jobList: {
    [userID: string]: string[];
} = {
    "316052390442958860": ["Mime", "Mime", "Mime", "Mime"]
};
const monsters: Monster[] = [];
interface IMiscStats {
    victims: number;
    kinuVictims: number;
    rodsBroken: number;
}
let stats: IMiscStats = {
    kinuVictims: 0,
    rodsBroken: 0,
    victims: 0
};
const dataFile = "data.json";
const proms: Array<Promise<void>> = [];
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
proms.push(
    fs.readFile(monsterFile, "utf8").then(file => {
        const list = JSON.parse(file);
        for (const monster of list) {
            monsters.push(new Monster(monster));
        }
    })
);
const classFile = "classes.json";
proms.push(
    fs.readFile(classFile, "utf8").then(file => {
        const list = JSON.parse(file);
        for (const job of list) {
            classes.push(new Job(job));
        }
    })
);

bot.on("ready", () => {
    console.log("Logged in as %s - %s\n", bot.user.username, bot.user.id);
});

bot.on("disconnect", async () => {
    console.error("Bot disconnected! Reconnecting...");
    await bot.connect();
});

interface ICommand {
    func: (msg: Eris.Message) => Promise<void>;
    names: string[];
    chk?: (msg: Eris.Message) => boolean;
}
const commands: ICommand[] = [
    {
        func: mcalc,
        names: ["mcalc"]
    },
    {
        func: almagest,
        names: ["almagest"]
    },
    {
        func: normal,
        names: ["normal"]
    },
    {
        func: random,
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
        func: chaos,
        names: ["chaos"]
    },
    {
        func: purechaos,
        names: ["purechaos"]
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
    {
        func: jobs,
        names: ["jobs"]
    },
    {
        func: forbiddenRisk,
        names: ["forbiddenrisk"]
    },
    {
        func: forbiddenLite,
        names: ["forbiddenlite"]
    },
    {
        func: forbidden,
        names: ["forbidden"]
    },
    {
        chk: (msg: Eris.Message) => auth.owners && auth.owners.indexOf(msg.author.id) > -1,
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
        names: ["color", "colour"]
    },
    {
        func: deathByMaths,
        names: ["math", "deathbymath"] // "maths" handled because it only checks the start
    },
    {
        func: jobData,
        names: ["class"]
    }
];

const responses: { [key: string]: string } = {
    badfaq: "oh my god I love <:rod:455233447565459471> http://www.gamefaqs.com/snes/588331-final-fantasy-v/faqs/21687",
    badfiesta: "The worst fiesta ever happened here: https://www.twitch.tv/dragondarchsda/v/48967944",
    badmod:
        "`No balance, at all` -mod author http://kyrosiris.com/changes_overview.txt " +
        "https://www.romhacking.net/forum/index.php?topic=26501.0 (DON'T PLAY THIS)",
    crystelle: "Those are easy to catch, right? http://i.imgur.com/WD40MES.png",
    dance: "It's *sensual.* https://i.imgur.com/qX3ElWK.gif",
    equipharps: "http://lparchive.org/Final-Fantasy-V-Advance-%28by-Dr-Pepper%29/1-MaximumTruckStyleLove.gif",
    gaia: "THAT HIPPIE SHIT AIN'T MAGIC http://i.imgur.com/JkwTg5O.png",
    happyworm: "https://gifsound.com/?gif=i.imgur.com/UaOsyZS.gif&v=y6Sxv-sUYtM&s=11",
    help:
        "I have a lot of commands, too many to list in this Discord PM." +
        " Check this readme: https://tinyurl.com/ybh7lrz2",
    iainuki: "That's a good ability! http://gfycat.com/TenseArtisticCobra",
    level5death: "Possibly the best ability! http://gfycat.com/TerrificKeyEmperorshrimp",
    numbers:
        "**PREMIUM TACTICAL INFORMATION ITT**\nDragondarch's team is Monk, Mystic Knight, Beastmaster, Dancer. " +
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
    quickleak: "https://www.youtube.com/watch?v=1x7zRK-Fsv8&list=PLMthTW4vRq8bfi6MeqVHU-yWkN4BRE1DJ",
    quicksave: "Hang on while I do some **ENCOUNTER MANIPULATION**",
    rocksfall: "...and *NED* dies? sure, why not https://clips.twitch.tv/ProductiveSavoryHorseradishSoBayed",
    runthenumbers:
        "**PREMIUM TACTICAL INFORMATION ITT**\nDragondarch's team is Monk, Mystic Knight, Beastmaster, Dancer. " +
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
    yburns: "The Y-BURNS? My favorite team! http://i.imgur.com/aQ18OQF.png",
    zeninage: "The damage only goes up uP UP! http://i.imgur.com/7wxm7dy.gif"
};

const prefixes = [".", "!"];

const queries: {
    [userID: string]: {
        list: Monster[];
        type: string;
    };
} = {};

// reads incoming messages for commands and redirects to functions to handle them
bot.on("messageCreate", async (msg: Eris.Message) => {
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
        if (msg.author.id in queries) {
            await enemyClarify(msg);
            return;
        }
    }
});

// .mcalc
interface IMCalc {
    args: string[];
    calc: (nums: number[]) => string;
}
const mcalcTable: { [name: string]: IMCalc } = {
    cannon: {
        args: ["Level"],
        calc: (nums: number[]) => {
            const m = Math.floor((nums[0] * nums[0]) / 256 + 4);
            let nextLevel = Math.ceil(256 * (m + 1 - 4));
            nextLevel = Math.ceil(Math.sqrt(nextLevel));
            return (
                "At level " +
                nums[0] +
                ", your Cannoneer M is " +
                m +
                ". To reach the next M, you need to reach level " +
                nextLevel +
                "."
            );
        }
    },
    fists: {
        args: ["Level", "Strength"],
        calc: (nums: any[]) => {
            const level = nums[0];
            const str = nums[1];
            const m = Math.floor((level * str) / 256 + 2);
            const nextLevel = Math.ceil((256 * (m + 1 - 2)) / str);
            const pow = level * 2 + 3;
            return (
                "At Level " +
                level +
                ", with " +
                str +
                " Strength, your fist M is " +
                m +
                " (with " +
                pow +
                " attack power). To reach the next M, you need to reach level " +
                nextLevel +
                "."
            );
        }
    },
    knife: {
        args: ["Level", "Strength", "Agility"],
        calc: (nums: any[]) => {
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
                return (
                    "At Level " +
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
                    ")."
                );
            } else {
                // if bonus = 1
                m = m + 1;
                return (
                    "At Level " +
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
                    ")."
                );
            }
        }
    },
    magic: {
        args: ["Level", "Magic"],
        calc: (nums: number[]) => {
            const m = Math.floor((nums[0] * nums[1]) / 256 + 4);
            const nextLevel = Math.ceil((256 * (m + 1 - 4)) / nums[1]);
            return (
                "At Level " +
                nums[0] +
                ", with " +
                nums[1] +
                " Magic, your magic M is " +
                m +
                ". To reach the next M, you need to reach level " +
                nextLevel +
                ""
            );
        }
    },
    physical: {
        args: ["Level", "Strength"],
        calc: (nums: number[]) => {
            const m = Math.floor((nums[0] * nums[1]) / 128 + 2);
            const nextLevel = Math.ceil((128 * (m + 1 - 2)) / nums[1]);
            return (
                "At Level " +
                nums[0] +
                ", with " +
                nums[1] +
                " Strength, your physical M is " +
                m +
                ". To reach the next M, you need to reach level " +
                nextLevel +
                ""
            );
        }
    },

    chicken: {
        args: ["Level", "Strength", "Agility"],
        calc: (nums: any[]) => {
            const level = nums[0];
            const str = nums[1];
            const agil = nums[2];
            let m = Math.floor((level * str) / 128);
            const bonus = Math.floor((level * agil) / 128);
            const n = Math.ceil((128 * (m + 1)) / str);
            const ns = Math.ceil((128 * (bonus + 1)) / agil);
            m += bonus + 2;
            return (
                "At Level " +
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
                " for Agility."
            );
        }
    },
    rune: {
        args: ["Level", "Strength", "Magic"],
        calc: (nums: any[]) => {
            const level = nums[0];
            const str = nums[1];
            const mag = nums[2];
            let m = Math.floor((level * str) / 128);
            const bonus = Math.floor((level * mag) / 128);
            const n = Math.ceil((128 * (m + 1)) / str);
            const ns = Math.ceil((128 * (bonus + 1)) / mag);
            m += bonus + 2;
            return (
                "At Level " +
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
                " for Magic."
            );
        }
    }
};

async function mcalc(msg: Eris.Message) {
    const args = msg.content
        .toLowerCase()
        .split(/ +/)
        .slice(1); // remove command name
    const strs = args.filter((i: string) => isNaN(parseInt(i, 10))); // extracts strings
    let type;
    if (strs.length < 1) {
        await msg.channel.createMessage(
            "Sorry, you need to tell me what type of M you're calculating! Valid types: `" +
                Object.keys(mcalcTable).join(", ") +
                "`"
        );
        return;
    } else {
        type = strs[0].toLowerCase();
    }
    if (!(type in mcalcTable)) {
        await msg.channel.createMessage(
            "Sorry, you need to tell me what type of M you're calculating! Valid types: `" +
                Object.keys(mcalcTable).join(", ") +
                "`"
        );
        return;
    }
    const mtype = mcalcTable[type];
    const nums = args.map((i: string) => parseInt(i, 10)).filter((i: number) => !isNaN(i)); // extracts numbers
    if (nums.length < mtype.args.length) {
        await msg.channel.createMessage(
            "Sorry, I need more numbers! Arguments for `" + type + "`: " + mtype.args.join(", ")
        );
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
async function almagest(msg: Eris.Message) {
    const args = msg.content.toLowerCase().split(/ +/);
    let vit = parseInt(args[1], 10);
    if (isNaN(vit) || vit > 99) {
        const query = args.slice(1).join("");
        const result = classes.find((c: Job) =>
            c.name
                .toLowerCase()
                .replace(/ +/g, "")
                .includes(query)
        );
        if (result && args.length > 1) {
            vit = result.vit;
        } else {
            await msg.channel.createMessage(
                "NED's Almagest can deal 1620 to 1665 Holy damage and inflict Sap. " +
                    "Good luck! (Only 720 to 740 damage if you have Shell! Yay!)"
            );
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
    let out =
        "At " + vit + " vitality, you will need to be level " + level + " (" + finalHP + " HP) to survive Almagest";
    if (level === buffLevel) {
        out += " with a safe buffer.";
    } else {
        out += ", or level " + buffLevel + " (" + finalBuffHP + " HP) to survive Almagest with a safe buffer.";
    }
    await msg.channel.createMessage(out);
}

// DIY fiestas
function getClassesByNames(names: string[]) {
    const out: Job[] = [];
    for (const name of names) {
        const job = classes.find((c: Job) => c.name === name);
        if (job) {
            out.push(job);
        }
    }
    return out;
}

const windJobs = () => classes.filter((c: { crystal: number }) => c.crystal === 1);
const waterJobs = () => classes.filter((c: { crystal: number }) => c.crystal === 2);
const fireJobs = () => classes.filter((c: { crystal: number }) => c.crystal === 3);
const earthJobs = () => classes.filter((c: { crystal: number }) => c.crystal === 4);

async function normal(msg: Eris.Message) {
    const wind = windJobs()[getIncInt(0, windJobs.length - 1)].name;
    const water = waterJobs()[getIncInt(0, waterJobs.length - 1)].name;
    const fire = fireJobs()[getIncInt(0, fireJobs.length - 1)].name;
    const earth = earthJobs()[getIncInt(0, earthJobs.length - 1)].name;
    const chan = await msg.author.getDMChannel();
    await chan.createMessage(
        "Wind Job: " + wind + "\nWater Job: " + water + "\nFire Job: " + fire + "\nEarth Job: " + earth
    );
}

async function random(msg: Eris.Message) {
    const out = [windJobs()[getIncInt(0, windJobs.length - 1)].name];
    const randWater = classes.filter((c: Job) => c.crystal > 0 && c.crystal < 3 && !out.includes(c.name));
    out.push(randWater[getIncInt(0, randWater.length - 1)].name);
    const randFire = classes.filter((c: Job) => c.crystal > 0 && c.crystal < 4 && !out.includes(c.name));
    out.push(randFire[getIncInt(0, randFire.length - 1)].name);
    const randEarth = classes.filter((c: Job) => c.crystal > 0 && c.crystal < 5 && !out.includes(c.name));
    out.push(randEarth[getIncInt(0, randEarth.length - 1)].name);
    const chan = await msg.author.getDMChannel();
    await chan.createMessage(
        "Wind Job: " + out[0] + "\nWater Job: " + out[1] + "\nFire Job: " + out[2] + "\nEarth Job: " + out[3]
    );
}

async function sevenFifty(msg: Eris.Message) {
    const mageWind = windJobs().filter((c: { is750: any }) => c.is750);
    const wind = mageWind[getIncInt(0, mageWind.length - 1)].name;
    const mageWater = waterJobs().filter((c: { is750: any }) => c.is750);
    const water = mageWater[getIncInt(0, mageWater.length - 1)].name;
    const mageFire = fireJobs().filter((c: { is750: any }) => c.is750);
    const fire = mageFire[getIncInt(0, mageFire.length - 1)].name;
    const mageEarth = earthJobs().filter((c: { is750: any }) => c.is750);
    const earth = mageEarth[getIncInt(0, mageEarth.length - 1)].name;
    const chan = await msg.author.getDMChannel();
    await chan.createMessage(
        "Wind Job: " + wind + "\nWater Job: " + water + "\nFire Job: " + fire + "\nEarth Job: " + earth
    );
}

async function noSevenFifty(msg: Eris.Message) {
    const noWind = windJobs().filter((c: { is750: any }) => !c.is750);
    const wind = noWind[getIncInt(0, noWind.length - 1)].name;
    const noWater = waterJobs().filter((c: { is750: any }) => !c.is750);
    const water = noWater[getIncInt(0, noWater.length - 1)].name;
    const noFire = fireJobs().filter((c: { is750: any }) => !c.is750);
    const fire = noFire[getIncInt(0, noFire.length - 1)].name;
    const noEarth = earthJobs().filter((c: { is750: any }) => !c.is750);
    const earth = noEarth[getIncInt(0, noEarth.length - 1)].name;
    const chan = await msg.author.getDMChannel();
    await chan.createMessage(
        "Wind Job: " + wind + "\nWater Job: " + water + "\nFire Job: " + fire + "\nEarth Job: " + earth
    );
}

async function chaos(msg: Eris.Message) {
    const allJobs = classes.filter((c: { crystal: number }) => c.crystal > 0 && c.crystal < 5);
    const wind = allJobs[getIncInt(0, allJobs.length - 1)].name;
    const water = allJobs[getIncInt(0, allJobs.length - 1)].name;
    const fire = allJobs[getIncInt(0, allJobs.length - 1)].name;
    const earth = allJobs[getIncInt(0, allJobs.length - 1)].name;
    const chan = await msg.author.getDMChannel();
    await chan.createMessage(
        "Wind Job: " + wind + "\nWater Job: " + water + "\nFire Job: " + fire + "\nEarth Job: " + earth
    );
}

async function chaosNoSevenFifty(msg: Eris.Message) {
    const noJobs = classes.filter((c: { crystal: number; is750: any }) => c.crystal > 0 && c.crystal < 5 && !c.is750);
    const wind = noJobs[getIncInt(0, noJobs.length - 1)].name;
    const water = noJobs[getIncInt(0, noJobs.length - 1)].name;
    const fire = noJobs[getIncInt(0, noJobs.length - 1)].name;
    const earth = noJobs[getIncInt(0, noJobs.length - 1)].name;
    const chan = await msg.author.getDMChannel();
    await chan.createMessage(
        "Wind Job: " + wind + "\nWater Job: " + water + "\nFire Job: " + fire + "\nEarth Job: " + earth
    );
}

async function chaosSevenFifty(msg: Eris.Message) {
    const magJobs = classes.filter((c: { crystal: number; is750: any }) => c.crystal > 0 && c.crystal < 5 && c.is750);
    const wind = magJobs[getIncInt(0, magJobs.length - 1)].name;
    const water = magJobs[getIncInt(0, magJobs.length - 1)].name;
    const fire = magJobs[getIncInt(0, magJobs.length - 1)].name;
    const earth = magJobs[getIncInt(0, magJobs.length - 1)].name;
    const chan = await msg.author.getDMChannel();
    await chan.createMessage(
        "Wind Job: " + wind + "\nWater Job: " + water + "\nFire Job: " + fire + "\nEarth Job: " + earth
    );
}

async function purechaos(msg: Eris.Message) {
    const allJobs = classes.filter((c: { crystal: number }) => c.crystal < 5).map((c: { name: any }) => c.name);
    let wind: string;
    let water: string;
    let fire: string;
    let earth: string;
    [wind, water, fire, earth] = shuffle(allJobs).slice(0, 4);
    const chan = await msg.author.getDMChannel();
    await chan.createMessage(
        "Wind Job: " + wind + "\nWater Job: " + water + "\nFire Job: " + fire + "\nEarth Job: " + earth
    );
}

async function forbidden(msg: Eris.Message) {
    const forbiddenWind = windJobs();
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
    const forbiddenFire = getClassesByNames(["Bard", "Ranger", "Dancer"]).concat(earthJobs());
    const forbiddenEarth = classes.filter((c: { crystal: number }) => c.crystal === 5);
    const forbJobs = [
        forbiddenWind[getIncInt(0, forbiddenWind.length - 1)].name,
        forbiddenWater[getIncInt(0, forbiddenWater.length - 1)].name,
        forbiddenFire[getIncInt(0, forbiddenFire.length - 1)].name,
        forbiddenEarth[getIncInt(0, forbiddenEarth.length - 1)].name
    ];
    const index = getIncInt(0, forbJobs.length - 2);
    const voidJob = forbJobs[index];
    forbJobs[index] = "~~" + forbJobs[index] + "~~";
    const chan = await msg.author.getDMChannel();
    await chan.createMessage(
        "Wind Job: " +
            forbJobs[0] +
            "\nWater Job: " +
            forbJobs[1] +
            "\nFire Job: " +
            forbJobs[2] +
            "\nEarth Job: " +
            forbJobs[3] +
            "\nLost to the void: " +
            voidJob
    );
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
    "I have a really really dumb strategy! <:yayclod:362777481838592010>"
];

async function dd(msg: Eris.Message) {
    const args = msg.content.toLowerCase().split(/ +/);
    let index = parseInt(args[1], 10);
    if (args.length < 2) {
        index = getIncInt(0, ddLines.length - 1);
        await msg.channel.createMessage(ddLines[index] + " (#" + (index + 1) + ")");
    } else if (isNaN(index)) {
        const matches = ddLines.filter(l => l.toLowerCase().includes(args.slice(1).join(" ")));
        if (matches.length > 0) {
            const i = getIncInt(0, matches.length - 1);
            await msg.channel.createMessage(matches[i] + " (#" + (ddLines.indexOf(matches[i]) + 1) + ")");
        } else {
            await msg.channel.createMessage(
                "No, I have to let that quote burn, I ran the numbers, doing it with letters is impossible."
            );
        }
    } else if (index > ddLines.length || index < 1) {
        index = getIncInt(0, ddLines.length - 1);
        await msg.channel.createMessage(
            "Oh my god, the quote wand missed!\n" + ddLines[index] + " (#" + (index + 1) + ")"
        );
    } else {
        await msg.channel.createMessage(ddLines[index - 1] + " (#" + index + ")");
    }
}

// speedtrap
async function trapped(msg: Eris.Message) {
    stats.victims++;
    if (msg.author.id === "90507312564805632") {
        stats.kinuVictims++;
    }
    await msg.channel.createMessage("Gotta go fast! Total Victims: " + stats.victims);
    await fs.writeFile(dataFile, JSON.stringify(stats, null, 4));
}

async function victim(msg: Eris.Message) {
    await msg.channel.createMessage(
        "Dr. Clapperclaw's Deadly Speed Trap has snared " +
            stats.victims +
            " victims! (" +
            stats.kinuVictims +
            " of them are alcharagia...)"
    );
}

async function breakRod(msg: Eris.Message) {
    const args = msg.content.toLowerCase().split(/ +/);
    const index = parseInt(args[1], 10);
    if (isNaN(index) || args.length === 1 || index < 0 || index > 100) {
        stats.rodsBroken++;
    } else {
        stats.rodsBroken += index;
    }
    await msg.channel.createMessage("750 blaze rods errday (" + stats.rodsBroken + " broken so far!)");
    await fs.writeFile(dataFile, JSON.stringify(stats, null, 4));
}

async function broken(msg: Eris.Message) {
    await msg.channel.createMessage(
        "You godless heathens have blazed " + stats.rodsBroken + " rods so far. DARE has failed you all."
    );
}

// goofy shit

async function countdown(msg: Eris.Message) {
    const fiestaDate = Date.UTC(2019, 5, 0, 15, 0, 0); // 0 is Jan, so 5 is June
    const now = Date.now();
    const distance = fiestaDate - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    await msg.channel.createMessage(
        "Preregistration starts in " +
            days +
            " days, " +
            hours +
            " hours, " +
            minutes +
            " minutes, and " +
            seconds +
            " seconds!"
    );
}

async function zerky(msg: Eris.Message) {
    await msg.channel.createMessage("http://www.soldoutcomic.com/Etc/Sketchdump/ThreeOrMoreDeathStillWorryZerky.png");
}

// job DB
async function jobs(msg: Eris.Message) {
    const args = msg.content.split(/ +/);
    // expected args - 0: ".jobs", 1: "lookup" or "register", 2: wind job or @mention (str),
    // 3: water job (str), 4: fire job (str), 5: earth job (str)
    if (args.length < 2 || args.length > 6) {
        await msg.channel.createMessage(
            "Acceptable syntax: `.jobs lookup [user]` or `.jobs register <wind> <water> <fire> <earth>`. " +
                "Please ensure you provide jobs when registering. Please delimit with spaces, " +
                "and keep two-word jobs to one word."
        );
        return;
    }
    if (args[1].toLowerCase() === "register") {
        if (args.length < 3) {
            await msg.channel.createMessage(
                "Acceptable syntax: `.jobs lookup [user]` or `.jobs register <wind> <water> <fire> <earth>`. " +
                    "Please ensure you provide jobs when registering. " +
                    "Please delimit with spaces, and keep two-word jobs to one word."
            );
            return;
        }
        const curJobs = args.slice(2);
        jobList[msg.author.id] = curJobs;
        await fs.writeFile(jobFile, JSON.stringify(jobs, null, 4));
        await msg.channel.createMessage(
            "Got it, <@" + msg.author.id + ">. Your jobs (" + curJobs.join("/") + ") are registered."
        );
    } else if (args[1].toLowerCase() === "lookup") {
        let mentioned: Eris.User;
        if (msg.mentions.length > 0) {
            mentioned = msg.mentions[0];
        } else if (args.length > 2) {
            // try lookup by name
            const uName = args
                .slice(2)
                .join(" ")
                .toLowerCase();
            const matches = Object.values(bot.users).filter(
                u => u.username && u.username.toLowerCase().includes(uName)
            );
            if (matches.length > 0) {
                mentioned = matches[0];
            } else {
                await msg.channel.createMessage("Sorry, I can't find that user! Have you tried using an @mention?");
                return;
            }
        } else {
            mentioned = msg.author;
        }
        const curJobs = jobList[mentioned.id];
        const name = mentioned.username;
        if (!curJobs) {
            await msg.channel.createMessage("I don't have jobs on file for " + name + ", sorry!");
        } else {
            await msg.channel.createMessage("I have " + name + "'s jobs as: " + curJobs.join("/") + ".");
        }
    } else {
        await msg.channel.createMessage(
            "Acceptable syntax: `.jobs lookup @mention` or `.jobs register <wind> <water> <fire> <earth>`. " +
                "Please ensure you provide jobs when registering. " +
                "Please delimit with spaces, and keep two-word jobs to one word."
        );
    }
}

// misc functions
function getIncInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array: any[]) {
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

async function forbiddenRisk(msg: Eris.Message) {
    if (msg.member) {
        await msg.member.addRole("451768175152070657");
        await msg.addReaction("forbidden:451764608202571816");
        await msg.addReaction("black101:326153094868238338");
    } else {
        await msg.channel.createMessage("Sorry, I can only add you to a role in the server!");
    }
}

async function forbiddenLite(msg: Eris.Message) {
    if (msg.member) {
        await msg.member.addRole("451874821245108225");
        await msg.addReaction("forbidden:451764608202571816");
        await msg.addReaction("black101:326153094868238338");
    } else {
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
async function attributes(msg: Eris.Message) {
    if (monsters.length > 0) {
        const chan = await msg.author.getDMChannel();
        await chan.createMessage(
            "The monster database has changed! " +
                "Instead of looking individual attributes, you use seperate commands for these categories:\n" +
                "`.info` shows everything but AI\n" +
                "`.stats` just shows the numbers\n" +
                "`.weak` shows things like elemental affinities, statuses, and creature types\n" +
                "`.ability` shows abilities like magic and !Releases\n" +
                "`.loot` shows drops and !Steals\n" +
                "`.ai` shows the AI routine"
        );
    }
}

async function enemyInfo(user: Eris.User, enemy: Monster, type: string) {
    let out: string | undefined;
    switch (type) {
        case "info":
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
        const chan = await user.getDMChannel();
        await chan.createMessage(out);
    }
}

// monster data query
const aliases: { [alias: string]: string } = {
    meatdeath: "Exdeath (Exdeath's Castle)",
    meatgamesh: "Gilgamesh (Exdeath's Castle)",
    rugwizard: "Omniscient",
    shipgamesh: "Gilgamesh (Ship)",
    treedeath: "Exdeath (Final)"
};

async function enemySearch(user: Eris.User, query: string, type: string) {
    if (query.trim().toLowerCase() in aliases) {
        query = aliases[query.trim().toLowerCase()].toLowerCase();
    }
    const matches = monsters.filter(
        (enemy: any) => enemy.name.toLowerCase().includes(query) || enemy.rpge_name.toLowerCase().includes(query)
    ); // new array which is all enemies with name including message
    if (matches.length < 1) {
        const chan = await user.getDMChannel();
        await chan.createMessage("Sorry, I couldn't find any enemies with that name!");
    } else if (matches.length === 1) {
        enemyInfo(user, matches[0], type);
    } else {
        let out = "I'm not sure which enemy you mean! Please pick one of the following:\n";
        let i = 1; // lists from 1-n for humans even tho arrays start at 0
        for (const match of matches) {
            out += i + ". " + match.name + "\n";
            i++;
        }
        queries[user.id] = {
            // store data in queries, in the form of its own tiny key-value pair
            list: matches,
            type
        };
        const chan = await user.getDMChannel();
        await chan.createMessage(out);
    }
}

async function enemyClarify(msg: Eris.Message) {
    const input = parseInt(msg.content, 10);
    if (isNaN(input) || !(input - 1 in queries[msg.author.id].list)) {
        // if user didn't type a number or the number wasn't listed (-1 to convert from 1-start to 0-start)
        const chan = await msg.author.getDMChannel();
        await chan.createMessage("Sorry, that wasn't the number of a result I had saved. Please try searching again.");
    } else {
        enemyInfo(msg.author, queries[msg.author.id].list[input - 1], queries[msg.author.id].type);
    }
    delete queries[msg.author.id]; // remove element from object
}

function info(type: string) {
    return async (msg: Eris.Message) => {
        const query = msg.content
            .toLowerCase()
            .split(/ +/)
            .slice(1)
            .join(" ");
        enemySearch(msg.author, query, type);
    };
}

async function randcolour(msg: Eris.Message) {
    const colours = [getIncInt(0, 7), getIncInt(0, 7), getIncInt(0, 7)];
    const emoji = colours.map(i => `${i}\u20e3`);
    for (const emo of emoji) {
        await msg.addReaction(emo);
    }
}

async function deathByMaths(msg: Eris.Message) {
    const args = msg.content
        .toLowerCase()
        .split(/ +/)
        .slice(1);
    let level = parseInt(args[0], 10);
    const oLevel = level;
    if (isNaN(level)) {
        // later make it search enemy name
        await msg.channel.createMessage("Sorry, I need the level of an enemy!");
    } else {
        const sparks: { [level: number]: number } = {
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
        let out =
            "To get a level " +
            oLevel +
            " enemy's level divisible by the following numbers, it will take this many Dark Sparks:\n";
        out += Object.keys(sparks)
            .map(k => {
                const key = parseInt(k, 10);
                if (sparks[key] > 1) {
                    return "**Level " + key + "**: " + sparks[key] + " Dark Sparks";
                } else if (sparks[key] === 1) {
                    return "**Level " + key + "**: " + sparks[key] + " Dark Spark";
                } else if (sparks[key] === 0) {
                    return "**Level " + key + "**: Already there!";
                } else {
                    return "**Level " + key + "**: Will never reach";
                }
            })
            .join("\n");
        await msg.channel.createMessage(out);
    }
}

async function jobData(msg: Eris.Message) {
    const query = msg.content
        .split(/ +/)
        .slice(1)
        .join("")
        .toLowerCase();
    const result = classes.find((c: Job) =>
        c.name
            .toLowerCase()
            .replace(/ +/g, "")
            .includes(query)
    );
    let out;
    if (result) {
        out = result.profile;
    } else {
        out = "Sorry, I can't find a class with that name!";
    }
    await msg.channel.createMessage(out);
}

Promise.all(proms).then(
    _ => {
        bot.connect();
    },
    err => {
        console.error("Error loading data files!");
        console.error(err);
    }
);