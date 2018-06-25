const Discord = require("discord.io");
const fs = require("fs");

let auth = JSON.parse(fs.readFileSync("auth.json", "utf8"));

if (!auth.token) {
    console.error("Bot token not found at auth.json.token!");
    process.exit();
}

let bot = new Discord.Client({
    token: auth.token,
    autorun: false
});

let data = {
    stats: {
        victims: -1,
        kinuVictims: -1,
        rodsBroken: -1
    },
    jobs: {
        "316052390442958860": ["Mime", "Mime", "Mime", "Mime"]
    },
    monsters: []
};

function loadData(filename, key) {
    return new Promise((resolve, reject) => {
        console.log("Loading " + filename + "...");
        fs.readFile(filename, "utf8", (err, file) => {
            if (err) {
                reject(err);
            } else {
                data[key] = JSON.parse(file);
                resolve();
            }
        });
    });
}
let file = "data.json";
let jobFile = "jobs.json";
let monsterFile = "monsterdata.json";
let proms = [loadData(file, "stats"), loadData(jobFile, "jobs"), loadData(monsterFile, "monsters")];
Promise.all(proms).then(() => {
    bot.connect();
}, err => {
    console.error("Error loading data files!");
    console.error(err);
});

bot.on("ready", function () {
    console.log("Logged in as %s - %s\n", bot.username, bot.id);
});

bot.on("disconnect", err => {
    console.error("Bot disconnected with below error! Reconnecting...");
    console.error(err);
    bot.connect();
});

let commands = [
    {
        names: ["mcalc"],
        func: mcalc
    },
    {
        names: ["almagest"],
        func: almagest
    },
    {
        names: ["normal"],
        func: normal
    },
    {
        names: ["random"],
        func: random
    },
    {
        names: ["750"],
        func: sevenFifty
    },
    {
        names: ["no750"],
        func: noSevenFifty
    },
    {
        names: ["chaos"],
        func: chaos
    },
    {
        names: ["chaos750"],
        func: chaosSevenFifty
    },
    {
        names: ["chaosno750"],
        func: chaosNoSevenFifty
    },
    {
        names: ["purechaos"],
        func: purechaos
    },
    {
        names: ["dd"],
        func: dd
    },
    {
        names: ["trapped"],
        func: trapped
    },
    {
        names: ["victims"],
        func: victim
    },
    {
        names: ["break"],
        func: breakRod
    },
    {
        names: ["broken"],
        func: broken
    },
    {
        names: ["timer", "fiestatimer", "countdown"],
        func: countdown
    },
    {
        names: ["jobs"],
        func: jobs
    },
    {
        names: ["forbiddenrisk"],
        func: forbiddenRisk
    },
    {
        names: ["forbiddenlite"],
        func: forbiddenLite
    },
    {
        names: ["forbidden"],
        func: forbidden
    },
    {
        names: ["purify"],
        func: purify,
        chk: (_, userID) => auth.owners && auth.owners.indexOf(userID) > -1
    },
    {
        names: ["attributes"],
        func: attributes
    },
    {
        names: ["info"],
        func: info
    },
    //does not work
    /*{
        names: ["color", "colour"],
        func: randcolour
    }*/
];

let responses = {
    help: "I have a lot of commands, too many to list in this Discord PM. Check this readme: https://tinyurl.com/ybh7lrz2",
    gaia: "THAT HIPPIE SHIT AIN'T MAGIC http://i.imgur.com/JkwTg5O.png",
    dance: "It's *sensual.* https://i.imgur.com/qX3ElWK.gif",
    zeninage: "The damage only goes up uP UP! http://i.imgur.com/7wxm7dy.gif",
    yburns: "The Y-BURNS? My favorite team! http://i.imgur.com/aQ18OQF.png",
    quicksave: "Hang on while I do some **ENCOUNTER MANIPULATION**",
    badfaq: "oh my god I love <:rod:455233447565459471> http://www.gamefaqs.com/snes/588331-final-fantasy-v/faqs/21687",
    badfiesta: "The worst fiesta ever happened here: https://www.twitch.tv/dragondarchsda/v/48967944",
    equipharps: "http://lparchive.org/Final-Fantasy-V-Advance-%28by-Dr-Pepper%29/1-MaximumTruckStyleLove.gif",
    crystelle: "Those are easy to catch, right? http://i.imgur.com/WD40MES.png",
    numbers: "**PREMIUM TACTICAL INFORMATION ITT**\nDragondarch's team is Monk, Mystic Knight, Beastmaster, Dancer. Here's his foolproof strategy for dealing with the Seal Guardians in Moore Forest.\n\n1. After getting the wind drake from Bal Castle, go to Kuza and grind to level 32.\n2. Proceed with the game until the Barrier Tower. Grind there for Reflect Rings.\n3. Go to Drakenvale and get a Poison Eagle to cast Float on everyone.\n4. Go to the Gil Cave to grind out 370,000 Gil to buy Hermes Sandals with in World 3.\n5. Let the Aegis Shield be transformed into the Flame Shield.\n6. Make Bartz a Mystic Knight and weaken him to critical HP.\n7. Give Bartz the Flame Shield, give everyone else Reflect Rings.\n8. Reset the game because Bartz got one-shotted immediately in the Seal Guardian fight.\n9. Kill the Water, Earth and Wind Crystals.\n10. Kill off everyone except Bartz.\n11. Use !Focus + Drain Sword to kill the Fire Crystal.\n\nIt's easy!",
    runthenumbers: "**PREMIUM TACTICAL INFORMATION ITT**\nDragondarch's team is Monk, Mystic Knight, Beastmaster, Dancer. Here's his foolproof strategy for dealing with the Seal Guardians in Moore Forest.\n\n1. After getting the wind drake from Bal Castle, go to Kuza and grind to level 32.\n2. Proceed with the game until the Barrier Tower. Grind there for Reflect Rings.\n3. Go to Drakenvale and get a Poison Eagle to cast Float on everyone.\n4. Go to the Gil Cave to grind out 370,000 Gil to buy Hermes Sandals with in World 3.\n5. Let the Aegis Shield be transformed into the Flame Shield.\n6. Make Bartz a Mystic Knight and weaken him to critical HP.\n7. Give Bartz the Flame Shield, give everyone else Reflect Rings.\n8. Reset the game because Bartz got one-shotted immediately in the Seal Guardian fight.\n9. Kill the Water, Earth and Wind Crystals.\n10. Kill off everyone except Bartz.\n11. Use !Focus + Drain Sword to kill the Fire Crystal.\n\nIt's easy!",
    sandworm: "http://i.imgur.com/UaOsyZS.gif",
    happyworm: "https://gifsound.com/?gif=i.imgur.com/UaOsyZS.gif&v=y6Sxv-sUYtM&s=11",
    iainuki: "That's a good ability! http://gfycat.com/TenseArtisticCobra",
    oracle: "https://www.youtube.com/watch?v=makazgIRzfg",
    level5death: "Possibly the best ability! http://gfycat.com/TerrificKeyEmperorshrimp",
    quickleak: "https://www.youtube.com/watch?v=1x7zRK-Fsv8&list=PLMthTW4vRq8bfi6MeqVHU-yWkN4BRE1DJ"
};

let prefixes = [".", "!"];

let queries = {};

//reads incoming messages for commands and redirects to functions to handle them
bot.on("message", (user, userID, channelID, message, event) => {
    let lowMes = message.toLowerCase();
    if (userID !== bot.id) {
        for (let cmd of commands) {
            if (!cmd.chk || cmd.chk(user, userID, channelID, message, event)) {
                for (let name of cmd.names) {
                    for (let pre of prefixes) {
                        if (lowMes.startsWith(pre + name)) {
                            cmd.func(user, userID, channelID, message, event);
                            return;
                        }
                    }
                }
            }
        }
        if (lowMes.startsWith("zerky!")) {
            zerky(user, userID, channelID, message, event);
            return;
        }
        for (let key in responses) {
            if (responses.hasOwnProperty(key)) {
                for (let pre of prefixes) {
                    if (lowMes.startsWith(pre + key)) {
                        bot.sendMessage({
                            to: channelID,
                            message: responses[key]
                        });
                        return;
                    }
                }
            }
        }
        if (userID in queries) {
            enemyClarify(user, userID, channelID, message, event);
            return;
        }
    }
});

//.mcalc
let mcalcTable = {
    physical: {
        args: ["Level", "Strength"],
        calc: nums => {
            let m = Math.floor(((nums[0] * nums[1]) / 128) + 2);
            let nextLevel = Math.ceil((128 * ((m + 1) - 2)) / nums[1]);
            return "At Level " + nums[0] + ", with " + nums[1] + " Strength, your physical M is " + m + ". To reach the next M, you need to reach level " + nextLevel + "";
        }
    },
    magic: {
        args: ["Level", "Magic"],
        calc: nums => {
            let m = Math.floor(((nums[0] * nums[1]) / 256) + 4);
            let nextLevel = Math.ceil((256 * ((m + 1) - 4)) / nums[1]);
            return "At Level " + nums[0] + ", with " + nums[1] + " Magic, your magic M is " + m + ". To reach the next M, you need to reach level " + nextLevel + "";
        }
    },
    knife: {
        args: ["Level", "Strength", "Agility"],
        calc: nums => {
            let level = nums[0];
            let str = nums[1];
            let agil = nums[2];
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
                return "At Level " + level + ", with " + str + " Strength and " + agil + " Agility, your knife M is " + m + " (no Agility bonus). To reach the next M, you need to reach level " + n + " (Bonus Agility M gained at level " + ns + ").";
            } else { //if bonus = 1
                m = m + 1;
                return "At Level " + level + ", with " + str + " Strength and " + agil + " Agility, your knife M is " + m + " (including Agility bonus). To reach the next M, you need to reach level " + n + " (Bonus Agility M **LOST** at level " + ns + ").";
            }
        }
    },
    chicken: {
        args: ["Level", "Strength", "Agility"],
        calc: nums => {
            let level = nums[0];
            let str = nums[1];
            let agil = nums[2];
            let m = Math.floor((level * str) / 128);
            let bonus = Math.floor((level * agil) / 128);
            let n = Math.ceil((128 * (m + 1)) / str);
            let ns = Math.ceil((128 * (bonus + 1)) / agil);
            m += bonus + 2;
            return "At Level " + level + ", with " + str + " Strength and " + agil + " Agility, your Chicken Knife M is " + m + ". To reach the next M, you need to reach level " + n + " for Strength and " + ns + " for Agility.";
        }
    },
    rune: {
        args: ["Level", "Strength", "Magic"],
        calc: nums => {
            let level = nums[0];
            let str = nums[1];
            let mag = nums[2];
            let m = Math.floor((level * str) / 128);
            let bonus = Math.floor((level * mag) / 128);
            let n = Math.ceil((128 * (m + 1)) / str);
            let ns = Math.ceil((128 * (bonus + 1)) / mag);
            m += bonus + 2;
            return "At Level " + level + ", with " + str + " Strength and " + mag + " Magic, your Rune Weapon M is " + m + ". To reach the next M, you need to reach level " + n + " for Strength and " + ns + " for Magic.";
        }
    },
    fists: {
        args: ["Level", "Strength"],
        calc: nums => {
            let level = nums[0];
            let str = nums[1];
            let m = Math.floor(((level * str) / 256) + 2);
            let nextLevel = Math.ceil((256 * ((m + 1) - 2)) / str);
            let pow = level * 2 + 3;
            return "At Level " + level + ", with " + str + " Strength, your fist M is " + m + " (with " + pow + " attack power). To reach the next M, you need to reach level " + nextLevel + ".";
        }
    },
    cannon: {
        args: ["Level"],
        calc: nums => {
            let m = Math.floor(((nums[0] * nums[0]) / 256) + 4);
            let nextLevel = Math.ceil((256 * ((m + 1) - 4)));
            nextLevel = Math.ceil(Math.sqrt(nextLevel));
            return "At level " + nums[0] + ", your Cannoneer M is " + m + ". To reach the next M, you need to reach level " + nextLevel + ".";
        }
    },
};

function mcalc(user, userID, channelID, message) {
    let args = message.toLowerCase().split(/ +/).slice(1); //remove command name
    let strs = args.filter(i => isNaN(parseInt(i))); //extracts strings
    let type;
    if (strs.length < 1) {
        bot.sendMessage({
            to: channelID,
            message: "Sorry, you need to tell me what type of M you're calculating! Valid types: `" + Object.keys(mcalcTable).join(", ") + "`"
        });
        return;
    } else {
        type = strs[0].toLowerCase();
    }
    if (!(type in mcalcTable)) {
        bot.sendMessage({
            to: channelID,
            message: "Sorry, you need to tell me what type of M you're calculating! Valid types: `" + Object.keys(mcalcTable).join(", ") + "`"
        });
        return;
    }
    let mtype = mcalcTable[type];
    let nums = args.map(i => parseInt(i)).filter(i => !isNaN(i)); //extracts numbers
    if (nums.length < mtype.args.length) {
        bot.sendMessage({
            to: channelID,
            message: "Sorry, I need more numbers! Arguments for `" + type + "`: " + mtype.args.join(", ")
        });
        return;
    }
    bot.sendMessage({
        to: channelID,
        message: mtype.calc(nums)
    });
}

//.almagest
function almagest(user, userID, channelID, message) {
    let args = message.toLowerCase().split(/ +/);
    let vit = parseInt(args[1]);
    let hps = [0, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420, 440, 460, 
        480, 500, 530, 560, 590, 620, 650, 690, 730, 770, 810, 850, 900, 950, 1000, 1050, 1100, 1160, 1220, 1280, 1340, 1400, 1460, 1520, 1580, 
        1640, 1700, 1760, 1820, 1880, 1940, 2000, 2050, 2100, 2150, 2200, 2250, 2300, 2350, 2400, 2450, 2500, 2550, 2600, 2650, 2700, 2750, 2800, 
        2850, 2900, 2950, 3000, 3050, 3100, 3150, 3200, 3250, 3300, 3350, 3400, 3450, 3500, 3550, 3600, 3650, 3700, 3750, 3800, 3850, 3900, 3950];
    if (isNaN(vit) || args.length === 1) {
        bot.sendMessage({
            to: channelID,
            message: "NED's Almagest can deal 1620 to 1665 Holy damage and inflict Sap. Good luck! (Only 720 to 740 damage if you have Shell! Yay!)"
        });
    } else {
        let target = Math.floor((32 * 1665) / (vit + 32));
        let buffTarget = Math.floor((32 * 1725) / (vit + 32));
        let level = 0;
        let buffLevel = 0;
        while (hps[level] < target && hps[buffLevel] < buffTarget) {
            if (hps[level] < target) {
                level++;
            }
            if (hps[buffLevel] < buffTarget) {
                buffLevel++;
            }
        }
        let finalHP = Math.floor((hps[level] * (vit + 32))/32);
        let finalBuffHP = Math.floor((hps[buffLevel] * (vit + 32))/32);
        bot.sendMessage({
            to: channelID,
            message: "At " + vit + " vitality, you will need to be level " + level + " (" + finalHP + " HP) to survive Almagest" + ((level == buffLevel) ? " with a safe buffer." : ", or level " + buffLevel + " (" + finalBuffHP + " HP) to survive Almagest with a safe buffer.")
        });
    }
}

//DIY fiestas
let windJobs = ["Knight", "Monk", "Thief", "Black Mage", "White Mage", "Blue Mage"];
let waterJobs = ["Red Mage", "Time Mage", "Summoner", "Berserker", "Mystic Knight"];
let fireJobs = ["Beastmaster", "Geomancer", "Ninja", "Ranger", "Bard"];
let earthJobs = ["Dragoon", "Dancer", "Samurai", "Chemist"];
let miscJobs = ["Freelancer", "Mime"];
let mageJobs = ["Black Mage", "White Mage", "Blue Mage", "Red Mage", "Time Mage", "Summoner", "Geomancer", "Bard", "Dancer", "Chemist", "Mime"];
let noMageJobs = ["Monk", "Thief", "Knight", "Berserker", "Mystic Knight", "Ninja", "Ranger", "Beastmaster", "Samurai", "Dragoon"];
//let forbiddenWind = windJobs.slice(0).push("Time Mage");
let forbiddenWind = windJobs.slice(0);
forbiddenWind.push("Time Mage");
/*let forbiddenWater = waterJobs.slice(2).unshift("Red Mage");
forbiddenWater = forbiddenWater + fireJobs.slice(0,3);*/
let forbiddenWater = waterJobs.slice(2).concat(fireJobs.slice(0,3));
forbiddenWater.unshift("Red Mage");
let forbiddenFire = fireJobs.slice(3).concat(earthJobs);
let forbiddenEarth = ["Cannoneer", "Gladiator", "Oracle"];

function normal(user, userID) {
    let wind = windJobs[getIncInt(0, windJobs.length - 1)];
    let water = waterJobs[getIncInt(0, waterJobs.length - 1)];
    let fire = fireJobs[getIncInt(0, fireJobs.length - 1)];
    let earth = earthJobs[getIncInt(0, earthJobs.length - 1)];
    bot.sendMessage({
        to: userID,
        message: "Wind Job: " + wind + "\nWater Job: " + water + "\nFire Job: " + fire + "\nEarth Job: " + earth
    });
}

function random(user, userID) {
    let wind = windJobs[getIncInt(0, windJobs.length - 1)];
    let randWater = windJobs.concat(waterJobs);
    let water = randWater[getIncInt(0, randWater.length - 1)];
    let randFire = randWater.concat(fireJobs);
    let fire = randFire[getIncInt(0, randFire.length - 1)];
    let randEarth = randFire.concat(earthJobs);
    let earth = randEarth[getIncInt(0, randEarth.length - 1)];
    bot.sendMessage({
        to: userID,
        message: "Wind Job: " + wind + "\nWater Job: " + water + "\nFire Job: " + fire + "\nEarth Job: " + earth
    });
}

function sevenFifty(user, userID) {
    let mageWind = intersect(windJobs, mageJobs);
    let wind = mageWind[getIncInt(0, mageWind.length - 1)];
    let mageWater = intersect(waterJobs, mageJobs);
    let water = mageWater[getIncInt(0, mageWater.length - 1)];
    let mageFire = intersect(fireJobs, mageJobs);
    let fire = mageFire[getIncInt(0, mageFire.length - 1)];
    let mageEarth = intersect(earthJobs, mageJobs);
    let earth = mageEarth[getIncInt(0, mageEarth.length - 1)];
    bot.sendMessage({
        to: userID,
        message: "Wind Job: " + wind + "\nWater Job: " + water + "\nFire Job: " + fire + "\nEarth Job: " + earth
    });
}

function noSevenFifty(user, userID) {
    let noWind = intersect(windJobs, noMageJobs);
    let wind = noWind[getIncInt(0, noWind.length - 1)];
    let noWater = intersect(waterJobs, noMageJobs);
    let water = noWater[getIncInt(0, noWater.length - 1)];
    let noFire = intersect(fireJobs, noMageJobs);
    let fire = noFire[getIncInt(0, noFire.length - 1)];
    let noEarth = intersect(earthJobs, noMageJobs);
    let earth = noEarth[getIncInt(0, noEarth.length - 1)];
    bot.sendMessage({
        to: userID,
        message: "Wind Job: " + wind + "\nWater Job: " + water + "\nFire Job: " + fire + "\nEarth Job: " + earth
    });
}

function chaos(user, userID) {
    let allJobs = windJobs.concat(waterJobs).concat(fireJobs).concat(earthJobs);
    let wind = allJobs[getIncInt(0, allJobs.length - 1)];
    let water = allJobs[getIncInt(0, allJobs.length - 1)];
    let fire = allJobs[getIncInt(0, allJobs.length - 1)];
    let earth = allJobs[getIncInt(0, allJobs.length - 1)];
    bot.createDMChannel(userID);
    bot.sendMessage({
        to: userID,
        message: "Wind Job: " + wind + "\nWater Job: " + water + "\nFire Job: " + fire + "\nEarth Job: " + earth
    });
}

function chaosNoSevenFifty(user, userID) {
    let allJobs = windJobs.concat(waterJobs).concat(fireJobs).concat(earthJobs);
    let noJobs = intersect(allJobs, noMageJobs);
    let wind = noJobs[getIncInt(0, noJobs.length - 1)];
    let water = noJobs[getIncInt(0, noJobs.length - 1)];
    let fire = noJobs[getIncInt(0, noJobs.length - 1)];
    let earth = noJobs[getIncInt(0, noJobs.length - 1)];
    bot.sendMessage({
        to: userID,
        message: "Wind Job: " + wind + "\nWater Job: " + water + "\nFire Job: " + fire + "\nEarth Job: " + earth
    });
}

function chaosSevenFifty(user, userID) {
    let allJobs = windJobs.concat(waterJobs).concat(fireJobs).concat(earthJobs);
    let magJobs = intersect(allJobs, mageJobs);
    let wind = magJobs[getIncInt(0, magJobs.length - 1)];
    let water = magJobs[getIncInt(0, magJobs.length - 1)];
    let fire = magJobs[getIncInt(0, magJobs.length - 1)];
    let earth = magJobs[getIncInt(0, magJobs.length - 1)];
    bot.sendMessage({
        to: userID,
        message: "Wind Job: " + wind + "\nWater Job: " + water + "\nFire Job: " + fire + "\nEarth Job: " + earth
    });
}

function purechaos(user, userID) {
    let allJobs = windJobs.concat(waterJobs).concat(fireJobs).concat(earthJobs).concat(miscJobs);
    let wind = allJobs[getIncInt(0, allJobs.length - 1)];
    let water;
    do {
        water = allJobs[getIncInt(0, allJobs.length - 1)];
    } while (water === wind);
    let fire;
    do {
        fire = allJobs[getIncInt(0, allJobs.length - 1)];
    } while (fire === wind || fire === water);
    let earth;
    do {
        earth = allJobs[getIncInt(0, allJobs.length - 1)];
    } while (earth === wind || earth === water || earth === fire);
    bot.sendMessage({
        to: userID,
        message: "Wind Job: " + wind + "\nWater Job: " + water + "\nFire Job: " + fire + "\nEarth Job: " + earth
    });
}

function forbidden(user, userID) {
    let jobs = [
        forbiddenWind[getIncInt(0, forbiddenWind.length - 1)],
        forbiddenWater[getIncInt(0, forbiddenWater.length - 1)],
        forbiddenFire[getIncInt(0, forbiddenFire.length - 1)],
        forbiddenEarth[getIncInt(0, forbiddenEarth.length - 1)]
    ];
    let index = getIncInt(0, jobs.length - 2);
    let voidJob = jobs[index];
    jobs[index] = "~~" + jobs[index] + "~~";
    bot.sendMessage({
        to: userID,
        message: "Wind Job: " + jobs[0] + "\nWater Job: " + jobs[1] + "\nFire Job: " + jobs[2] + "\nEarth Job: " + jobs[3] + "\nLost to the void: " + voidJob
    });

}

//.dd
let ddLines = [
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
    "Good thing I have Red Mage so I can hashtag grind Mini Dragons for **TWO HOURS** while my sycophants in chat defend it!",
    "Ladies and gentlemen, the grinding is over, we've hit level 32! ...now what do I do?",
    "Yes! Sub 5-hour world 1! I'm so good.",
    "Oh my god, the Wonder Wand missed!",
    "...Does the Hayate Bow even sell?",
    "There's no save points around here. *enters next room, finds save point*",
    "I am a fucking idiot. I have this thing called !Mix, why am I not using it?",
    "Is Archeosaur fuckin' heavy or something?",
    "ANYTHING but the fucking chicken knife!",
    "Now I actually know what the fuck I'm doing here.",
    "I actually don't do serious speedruns of this game. I just have a fairly good amount of knowledge about how the mechanics work and stuff.",
    "I need Faris solo to gain experience for **#GOBLINPUNCH**. *game overs in the Wind Shrine without having saved the game*",
    "THE CHEST IS OPEN! WHERE IS THE DRAGON FANG? I'M STARING AT THE OPEN CHEST!!!",
    "I'm gonna try something dumb!",
    "\\*swings Blizzara Blade at immune target\\* Can you guys please hit???",
    "Well, he can't cast Aero now. \\*Gigas casts Aero twice\\*",
    "Being higher level isn't really going to help outside of getting higher damage multipliers, basically.",
    "My notes assume I don't get a Lamia Tiara. \\*proceeds to grind for one anyways\\*",
    "I have a really really dumb strategy! <:yayclod:362777481838592010>"
];

function dd(user, userID, channelID, message) {
    let args = message.toLowerCase().split(/ +/);
    let index = parseInt(args[1]);
    if (args.length < 2) {
        index = getIncInt(0, ddLines.length - 1);
        bot.sendMessage({
            to: channelID,
            message: ddLines[index] + " (#" + (index + 1) + ")"
        });
    } else if (isNaN(index)) {
        let matches = ddLines.filter(l => l.toLowerCase().includes(args.slice(1).join(" ")));
        if (matches.length > 0) {
            let i = getIncInt(0, matches.length - 1);
            bot.sendMessage({
                to: channelID,
                message: matches[i] + " (#" + (ddLines.indexOf(matches[i]) + 1) + ")"
            });
        } else {
            bot.sendMessage({
                to: channelID,
                message: "No, I have to let that quote burn, I ran the numbers, doing it with letters is impossible."
            });
        }
    } else if (index > ddLines.length || index < 1) { 
        index = getIncInt(0, ddLines.length - 1);
        bot.sendMessage({
            to: channelID,
            message: "Oh my god, the quote wand missed!\n" + ddLines[index] + " (#" + (index + 1) + ")"
        });
    } else {
        bot.sendMessage({
            to: channelID,
            message: ddLines[index - 1] + " (#" + index + ")"
        });
    }
}

//speedtrap
function trapped(user, userID, channelID) {
    data.stats.victims++;
    if (userID === "90507312564805632") {
        data.stats.kinuVictims++;
    }
    bot.sendMessage({
        to: channelID,
        message: "Gotta go fast! Total Victims: " + data.stats.victims
    });
    fs.writeFile(file, JSON.stringify(data.stats, null, 4), err => {
        if (err) {
            console.error(err);
        }
    });
}

function victim(user, userID, channelID) {
    bot.sendMessage({
        to: channelID,
        message: "<@" + userID + ">: Dr. Clapperclaw's Deadly Speed Trap has snared " + data.stats.victims + " victims! (" + data.stats.kinuVictims + " of them are alcharagia...)"
    });
}

function breakRod(user, userID, channelID, message) {
    let args = message.toLowerCase().split(/ +/);
    let index = parseInt(args[1]);
    if (isNaN(index) || args.length === 1 || index < 0 || index > 100 ) {
        data.stats.rodsBroken++;
    } else {
        data.stats.rodsBroken += index;
    }
    bot.sendMessage({
        to: channelID,
        message: "750 blaze rods errday (" + data.stats.rodsBroken + " broken so far!)"
    });
    fs.writeFile(file, JSON.stringify(data.stats, null, 4), err => {
        if (err) {
            console.error(err);
        }
    });
}

function broken(user, userID, channelID) {
    bot.sendMessage({
        to: channelID,
        message: "You godless heathens have blazed " + data.stats.rodsBroken + " rods so far. DARE has failed you all."
    });
}

//goofy shit

function countdown(user, userID, channelID) {
    let fiestaDate = new Date("June 17, 2018 13:00:00").getTime();
    let now = new Date().getTime();
    let distance = fiestaDate - now;
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    bot.sendMessage({
        to: channelID,
        //message: "FJF 2018's The Run officially starts in " + days + " days, " + hours + " hours, " + minutes + " minutes, and " + seconds + " seconds! (The Fiesta proper starts whenever The Run ends.)"
        message: "The Run has Begun! What are you waiting for? Get in here and make fun of DD! https://www.twitch.tv/rpglimitbreak"
    });
}

function zerky(user, userID, channelID) {
    bot.sendMessage({
        to: channelID,
        message: "http://www.soldoutcomic.com/Etc/Sketchdump/ThreeOrMoreDeathStillWorryZerky.png"
    });
}

//job DB
function jobs(user, userID, channelID, message, event) {
    let args = message.split(/ +/);
    //expected args - 0: ".jobs", 1: "lookup" or "register", 2: wind job or @mention (str), 3: water job (str), 4: fire job (str), 5: earth job (str)
    if (args.length < 2 || args.length > 6) {
        bot.sendMessage({
            to: channelID,
            message: "Acceptable syntax: `.jobs lookup [user]` or `.jobs register <wind> <water> <fire> <earth>`. Please ensure you provide jobs when registering. Please delimit with spaces, and keep two-word jobs to one word."
        });
        return;
    }
    if (args[1].toLowerCase() === "register") {
        if (args.length < 3) {
            bot.sendMessage({
                to: channelID,
                message: "Acceptable syntax: `.jobs lookup [user]` or `.jobs register <wind> <water> <fire> <earth>`. Please ensure you provide jobs when registering. Please delimit with spaces, and keep two-word jobs to one word."
            });
            return;
        }
        let curJobs = args.slice(2);
        data.jobs[userID] = curJobs;
        fs.writeFile(jobFile, JSON.stringify(data.jobs, null, 4), err => {
            if (err) {
                console.error(err);
            }
        });
        bot.sendMessage({
            to: channelID,
            message: "Got it, <@" + userID + ">. Your jobs (" + curJobs.join("/") + ") are registered."
        });
    } else if (args[1].toLowerCase() === "lookup") {
        let mentioned;
        if (event.d.mentions.length > 0) {
            mentioned = event.d.mentions[0].id;
        } else if (args.length > 2) {
            //try lookup by name
            let name = args.slice(2).join(" ").toLowerCase();
            let matches = Object.values(bot.users).filter(u => u.username && u.username.toLowerCase().includes(name));
            if (matches.length > 0) {
                mentioned = matches[0].id;
            } else {
                bot.sendMessage({
                    to: channelID,
                    message: "Sorry, I can't find that user! Have you tried using an @mention?"
                });
                return;
            }
        } else {
            mentioned = userID;
        }
        let curJobs = data.jobs[mentioned];
        let name = mentioned in bot.users ? bot.users[mentioned].username : "that user";
        if (!curJobs) {
            bot.sendMessage({
                to: channelID,
                message: "I don't have jobs on file for " + name + ", sorry!"
            });
        } else {
            bot.sendMessage({
                to: channelID,
                message: "I have " + name + "'s jobs as: " + curJobs.join("/") + "."
            });
        }
    } else {
        bot.sendMessage({
            to: channelID,
            message: "Acceptable syntax: `.jobs lookup @mention` or `.jobs register <wind> <water> <fire> <earth>`. Please ensure you provide jobs when registering. Please delimit with spaces, and keep two-word jobs to one word."
        });
    }
}

//misc functions
function getIncInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function intersect(a, b) {
    let t;
    if (b.length > a.length) {
        t = b;
        b = a;
        a = t;
    } // indexOf to loop over shorter
    return a.filter(e => b.indexOf(e) > -1).filter((e, i, c) => c.indexOf(e) === i);  // extra step to remove duplicates
}

function forbiddenRisk(user, userID, channelID, message, event) {
    bot.addToRole({
        serverID: "315364487882342401",
        userID: userID,
        roleID: "451768175152070657"
    }, err => {
        if (err) {
            console.error(err);
        }
    });
    addMultReactions(channelID, event, ["forbidden:451764608202571816", "black101:326153094868238338"]).catch(e => console.error(e));}

function forbiddenLite(user, userID, channelID, message, event) {
    bot.addToRole({
        serverID: "315364487882342401",
        userID: userID,
        roleID: "451874821245108225"
    }, err => {
        if (err) {
            console.error(err);
        }
    });
    bot.addReaction({
        channelID: channelID,
        messageID: event.d.id,
        reaction: "forbidden:451764608202571816"
    });
}

function purify() {
    data = {
        victims: 0,
        kinuVictims: 0,
        rodsBroken: 0
    };
}

// attributes
function attributes(user, userID) {
    if (data.monsters.length > 0) {
        bot.sendMessage({
            to: userID,
            message: "Available attributes for use with `.info`:\n`" + Object.keys(data.monsters[0]).join(", ") + "`." 
        }); 
    }
}

function enemyInfo(userID, enemyData, att) {
    let out = "__Data for " + enemyData.name + "__:\n";
    if (att && att in enemyData) {
        switch(att) {
        case "ai":
            out += "```css\n" + enemyData[att].join("\n") + "```";
            break;
        default:
            out += JSON.stringify(enemyData[att], null, 4);
        }
    } else {
        if (att) {
            console.error("enemyInfo called with invalid attribute " + att);
        }
        out += JSON.stringify(enemyData, null, 4);
    }
    bot.sendMessage({
        to: userID,
        message: out
    });
}

//monster data query
let aliases = {
    "rugwizard": "Omniscient",
    "meatdeath": "Exdeath (Exdeath's Castle)",
    "treedeath": "Exdeath (Final)",
    "shipgamesh": "Gilgamesh (Ship)",
    "meatgamesh": "Gilgamesh (Exdeath's Castle)"
};

function enemySearch(userID, query, att) {
    if (query.trim().toLowerCase() in aliases) {
        query = aliases[query.trim().toLowerCase()];
    }
    let matches = data.monsters.filter(enemy => enemy.name.toLowerCase().includes(query) || enemy.rpge_name.toLowerCase().includes(query)); //new array which is all enemies with name including message
    if (matches.length < 1) {
        bot.sendMessage({
            to: userID,
            message: "Sorry, I couldn't find any enemies with that name!"
        });
    } else if (matches.length === 1) {
        enemyInfo(userID, matches[0], att);
    } else {
        let out = "I'm not sure which enemy you mean! Please pick one of the following:\n";
        let i = 1; //lists from 1-n for humans even tho arrays start at 0
        for (let match of matches) {
            out += i + ". " + match.name + "\n";
            i++;
        }
        queries[userID] = { //store data in queries, in the form of its own tiny key-value pair
            list: matches,
            att: att
        };
        bot.sendMessage({
            to: userID,
            message: out
        });
    }
}

function enemyClarify(user, userID, channelID, message) {
    let input = parseInt(message);
    if (isNaN(input) || !((input - 1) in queries[userID].list)) { //if user didn't type a number or the number wasn't listed (-1 to convert from 1-start to 0-start)
        bot.sendMessage({
            to: userID,
            message: "Sorry, that wasn't the number of a result I had saved. Please try searching again."
        });
    } else {
        enemyInfo(userID, queries[userID].list[input - 1], queries[userID].att);
    }
    delete queries[userID]; //remove element from object
}

function info(user, userID, channelID, message) {
    let args = message.toLowerCase().split(/ +/);
    if (args.length < 2) {
        bot.sendMessage({
            to: userID,
            message: "Sorry, I didn't understand your query. Correct syntax: `.info attribute enemy_name`.\nYou can see a list of valid attributes with `.attributes`.\nSpecifying an attribute is optional.\nEnemy name can be RPGe or Advance translation."
        });
        return;
    }
    // expected args - 0: ".info", 1: query (str), 2..: monster name (str)
    if (args[1] in data.monsters[0]) {
        let att = args[1];
        let query = args.slice(2).join(" ");
        enemySearch(userID, query, att);
    } else {
        let query = args.slice(1).join(" ");
        enemySearch(userID, query);
    }    
}

//discord doesn't like this, will revisit
let numEmoji = [ "0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣"];

const addReaction = (channelID, event, reaction) => {
    return new Promise((resolve, reject) => {
        bot.addReaction({
            channelID: channelID,
            messageID: event.d.id,
            reaction: reaction
        }, (err, res) => {
            if (err) {
                if (err.response && err.response.retry_after) {
                    setTimeout(() => {
                        reject(err); //still rejects, but after a delay. Attempts to add a reaction are all on loops, so it will try to add the same reaction again, but now with the rate limit safely awaited.
                    }, err.response.retry_after + 1);
                } else {
                    reject(err);
                }
            } else {
                resolve(res);
            }
        });
    });
};

const addMultReactions = (channelID, event, reactions) => {
    return new Promise(async (resolve, reject) => {
        let i = 0;
        let errs = 0;
        while (i in reactions) {
            await addReaction(channelID, event, reactions[i]).then(() => i++).catch(err => {
                if (!(err.response && err.response.retry_after)) { //if the error wasn't a rate limit
                    errs++;
                    if (errs > reactions.length) {
                        i = -1;
                        reject(err);
                    }
                }
            });
        }
        resolve();
    });
};

function randcolour(user, userID, channelID, message, event) {
    let colours = [getIncInt(0, 7), getIncInt(0, 7), getIncInt(0, 7)];
    let emoji = colours.map(i => numEmoji[i]);
    addMultReactions(channelID, event, emoji).catch(e => console.error(e));
}