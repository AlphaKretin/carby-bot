const Discord = require("discord.io");
const fs = require("fs");

let auth = fs.readFileSync("auth.json", "utf8");

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
        console.log("Loading ${filename}...");
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
let proms = [loadData(file, stats), loadData(jobFile, jobs), loadData(monsterFile, monsters)];
Promise.all(proms).then(() => {
    bot.connect()
}, err => {
    console.error("Error loading data files!");
    console.error(err);
});

bot.on('ready', function () {
    console.log('Logged in as %s - %s\n', bot.username, bot.id);
});

bot.on('disconnect', err => {
    console.error("Bot disconnected with below error! Reconnecting...");
    console.error(err);
    bot.connect();
});

let commands = [
    {
        names: ["help"],
        func: help
    },
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
        names: ["forbidden"],
        func: forbidden
    }
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
        names: ["gaia"],
        func: gaia
    },
    {
        names: ["dance"],
        func: dance
    },
    {
        names: ["zeninage"],
        func: giltoss
    },
    {
        names: ["yburns"],
        func: yburns
    },
    {
        names: ["quicksave"],
        func: quicksave
    },
    {
        names: ["badfaq"],
        func: badfaq
    },
    {
        names: ["badfiesta"],
        func: badfiesta
    },
    {
        names: ["equipharps"],
        func: equipharps
    },
    {
        names: ["crystelle"],
        func: crystelle
    },
    {
        names: ["runthenumbers", "numbers"],
        func: ddstrat
    },
    {
        names: ["sandworm"],
        func: sandworm
    },
    {
        names: ["happyworm"],
        func: happyworm
    },
    {
        names: ["iainuki"],
        func: iainuki
    },
    {
        names: ["oracle"],
        func: oracle
    },
    {
        names: ["level5death"],
        func: levelFiveDeath
    },
    {
        names: ["quickleak"],
        func: quickleak
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
        names: ["purify"],
        func: help
        chk: (_, userID) => auth.owners && auth.owners.indexOf(userID) > -1;
    },
];

let prefixes = [".", "!"];

//reads incoming messages for commands and redirects to functions to handle them
bot.on('message', (user, userID, channelID, message, event) => {
    let lowMes = message.toLowerCase();
    if (userID !== bot.id) {
        if (lowMes.startsWith("zerky!")) {
            zerky(user, userID, channelID, message, event);
        }
        //monster data search (not working atm)
        /* if (lowMes.indexOf(".info") === 0) {
            info(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".attributes") === 0) {
            attributes(user, userID, channelID, message, event);
        } */
        for (let cmd of commands) {
            if (!cmd.chk || cmd.chk(user, userID, channelID, message, event)) {
                for (let name of names) {
                    for (let pre of prefixes) {
                        if (lowMes.startsWith(pre + name)) {
                            cmd.func(user, userID, channelID, message, event);
                        }
                    }
                }
            }
        }
    }
});

//.help
function help(user, userID, channelID, message, event) {
    bot.createDMChannel(userID);
    bot.sendMessage({
        to: userID,
        message: "I have a lot of commands, too many to list in this Discord PM. Check this readme: https://tinyurl.com/ybh7lrz2"
    });
}

//.mcalc
let mcalcTable = {
    physical: {
        args: ["Level", "Strength"],
        calc: nums => {
            let m = Math.floor(((nums[0] * nums[1]) / 128) + 2);
            let nextLevel = Math.ceil((128 * ((m + 1) - 2)) / nums[1];
            return "At Level ${nums[0]}, with ${nums[1]} Strength, your physical M is ${m}. To reach the next M, you need to reach level ${nextLevel}";
        }
    },
    magic: {
        args: ["Level", "Magic"],
        calc: nums => {
            let m = Math.floor(((nums[0] * nums[1]) / 256) + 4)
            let nextLevel = Math.ceil((256 * ((m + 1) - 4)) / nums[1])
            return "At Level ${nums[0]}, with ${nums[1]} Magic, your magic M is ${m}. To reach the next M, you need to reach level ${nextLevel}";
        }
    },
    knife: {
        args: ["Level", "Strength", "Agility"],
        calc: nums => {
            let level = nums[0];
            let str = nums[1];
            let agil = nums[2];
            m = level;
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
            n = Math.floor(n / str);
            ns = Math.floor(ns / agil);
            m += 2;
            if (bonus === 0) {
                return "At Level ${level}, with ${str} Strength and ${agil} Agility, your knife M is ${m} (no Agility bonus). To reach the next M, you need to reach level ${n} (Bonus Agility M gained at level ${ns}).";
            } else { //if bonus = 1
                m = m + 1;
                return "At Level ${level}, with ${str} Strength and ${agil} Agility, your knife M is ${m} (including Agility bonus). To reach the next M, you need to reach level ${n} (Bonus Agility M **LOST** at level ${ns}).";
            }
        }
    },
    chicken: {
        args: ["Level", "Strength", "Agility"],
        calc: nums => {
            let level = nums[0];
            let str = nums[1];
            let agil = nums[2];
            m = Math.floor((level * str) / 128);
            let bonus = Math.floor((level * agil) / 128);
            let n = Math.ceil((128 * (m + 1)) / str);
            let ns = Math.ceil((128 * (bonus + 1)) / agil);
            m += bonus + 2;
            return "At Level ${level}, with ${str} Strength and ${agil} Agility, your Chicken Knife M is ${m}. To reach the next M, you need to reach level ${n} for Strength and ${ns} for Agility.";
        }
    },
    rune: {
        args: ["Level", "Strength", "Magic"],
        calc: nums => {
            let level = nums[0];
            let str = nums[1];
            let mag = nums[2];
            m = Math.floor((level * str) / 128);
            let bonus = Math.floor((level * mag) / 128);
            let n = Math.ceil((128 * (m + 1)) / str);
            let ns = Math.ceil((128 * (bonus + 1)) / mag);
            m += bonus + 2;
            return "At Level ${level}, with ${str} Strength and ${mag} Magic, your Rune Weapon M is ${m}. To reach the next M, you need to reach level ${n} for Strength and ${ns} for Magic.";
        }
    }
    fists: {
        args: ["Level", "Strength"],
        calc: nums => {
            let level = nums[0];
            let str = nums[1];
            m = Math.floor(((level * str) / 256) + 2);
            nextLevel = Math.ceil((256 * ((m + 1) - 2)) / str);
            let pow = level * 2 + 3;
            m = m + " (with " + pow + " attack power)";
            return "At Level ${level}, with ${str} Strength, your fist M is ${m} (with ${pow} attack power). To reach the next M, you need to reach level ${n}.";
        }
    },
    cannon: {
        args: ["Level"],
        calc: nums => {
            m = Math.floor(((nums[0] * nums[0]) / 256) + 4);
            nextLevel = Math.ceil((256 * ((m + 1) - 4)));
            nextLevel = Math.ceil(Math.sqrt(nextLevel));
            return "At level ${nums[0]}, your Cannoneer M is ${m}. To reach the next M, you need to reach level ${nextLevel}."
        }
    },
}

function mcalc(user, userID, channelID, message, event) {
    let args = message.toLowerCase().split(" ").slice(1); //remove command name
    let strs = args.filter(i => isNaN(parseInt(i))); //extracts strings
    let type;
    if (strs.length < 1) {
        bot.sendMessage({
            to: channelID,
            message: "Sorry, you need to tell me what type of M you're calculating! Valid types: `" + Object.keys(mcalcTable).join(", ") + "`";
        });
        return;
    } else {
        type = strs[0].toLowerCase();
    }
    if (!type in mcalcTable) {
        bot.sendMessage({
            to: channelID,
            message: "Sorry, you need to tell me what type of M you're calculating! Valid types: `" + Object.keys(mcalcTable).join(", ") + "`";
        });
        return;
    }
    let mtype = mcalcTable[type];
    let nums = args.map(i => parseInt(i).filter(i => !isNaN(i))); //extracts numbers
    if (nums.length < mtype.args.length) {
        bot.sendMessage({
            to: channelID,
            message: "Sorry, I need more numbers! Arguments for `${type}`: " + mtype.args.join(", ")
        });
        return;
    }
    bot.sendMessage({
        to: channelID,
        message: mtype.calc(nums)
    });
}

//.almagest
function almagest(user, userID, channelID, message, event) {
    let args = message.toLowerCase().split(" ");
    let vit = parseInt(args[1]);
    if (isNaN(vit) || args.length === 1) {
        bot.sendMessage({
            to: channelID,
            message: "NED's Almagest can deal 1620 to 1665 Holy damage and inflict Sap. Good luck! (Only 720 to 740 damage if you have Shell! Yay!)"
        });
    } else {
        let target = Math.floor((32 * 1665) / (vit + 32));
        let buffTarget = Math.floor((32 * 1725) / (vit + 32));
        bot.sendMessage({
            to: channelID,
            message: "You need " + target + " base HP to survive a max 1665 damage Almagest with " + vit + " Vitality (or " + buffTarget + " to have 1725 HP for a buffer). Refer here for the level you'll need! http://bit.ly/1WKSUyu"
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
let forbiddenWind = windJobs.slice().push("Time Mage");
let forbiddenWater = waterJobs.slice(2).unshift("Red Mage").concat(fireJobs.slice(0,3));
let forbiddenFire = fireJobs.slice(3).concat(earthJobs);
let forbiddenEarth = ["Cannoneer", "Gladiator", "Oracle"];

function normal(user, userID, channelID, message, event) {
    let wind = windJobs[getIncInt(0, windJobs.length - 1)];
    let water = waterJobs[getIncInt(0, waterJobs.length - 1)];
    let fire = fireJobs[getIncInt(0, fireJobs.length - 1)];
    let earth = earthJobs[getIncInt(0, earthJobs.length - 1)];
    bot.sendMessage({
        to: userID,
        message: "Wind Job: " + wind + "\nWater Job: " + water + "\nFire Job: " + fire + "\nEarth Job: " + earth
    });
}

function random(user, userID, channelID, message, event) {
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

function sevenFifty(user, userID, channelID, message, event) {
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

function noSevenFifty(user, userID, channelID, message, event) {
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

function chaos(user, userID, channelID, message, event) {
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

function chaosNoSevenFifty(user, userID, channelID, message, event) {
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

function chaosSevenFifty(user, userID, channelID, message, event) {
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

function purechaos(user, userID, channelID, message, event) {
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

function forbidden(user, userID, channelID, message, event) {
    let jobs = [
        forbiddenWind[getIncInt(0, forbiddenWind.length - 1)],
        forbiddenWater[getIncInt(0, forbiddenWater.length - 1)],
        forbiddenFire[getIncInt(0, forbiddenFire.length - 1)],
        forbiddenEarth[getIncInt(0, forbiddenEarth.length - 1)]
    ];
    bot.sendMessage({
        to: userID,
        message: "Wind Job: " + jobs[0] + "\nWater Job: " + jobs[1] + "\nFire Job: " + jobs[2] + "\nEarth Job: " + jobs[3] + "\nLost to the void: " + jobs[getIncInt(0, jobs.length - 1)]
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

function dd(user, userID, channelID, message, event) {
    let args = message.toLowerCase().split(" ");
    let index = parseInt(args[1]);
    if (args.length === 1) {
        index = getIncInt(0, ddLines.length - 1);
        bot.sendMessage({
            to: channelID,
            message: ddLines[index] + " (#" + (index + 1) + ")"
        });
    } else if (isNaN(index)) {
        bot.sendMessage({
            to: channelID,
            message: "No, I have to let that quote burn, I ran the numbers, doing it with letters is impossible."
        });
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
function trapped(user, userID, channelID, message, event) {
    data.stats.victims++;
    if (userID === "90507312564805632") {
        data.stats.kinuVictims++;
    }
    bot.sendMessage({
        to: channelID,
        message: "Gotta go fast! Total Victims: " + data.stats.victims
    });
    fs.writeFile(file, JSON.stringify(data.stats, null, 4), err => console.error(err));
}

function victim(user, userID, channelID, message, event) {
    bot.sendMessage({
        to: channelID,
        message: "<@" + userID + ">: Dr. Clapperclaw's Deadly Speed Trap has snared " + data.stats.victims + " victims! (" + data.stats.kinuVictims + " of them are alcharagia...)"
    });
}

function breakRod(user, userID, channelID, message, event) {
    let args = message.toLowerCase().split(" ");
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
    fs.writeFile(file, JSON.stringify(data.stats, null, 4), err => console.error(err));
}

function broken(user, userID, channelID, message, event) {
    bot.sendMessage({
        to: channelID,
        message: "You godless heathens have blazed " + data.stats.rodsBroken + " rods so far. DARE has failed you all."
    });
}

//goofy shit
function gaia(user, userID, channelID, message, event) {
    bot.sendMessage({
        to: channelID,
        message: "THAT HIPPIE SHIT AIN'T MAGIC http://i.imgur.com/JkwTg5O.png"
    });
}

function galufdance(user, userID, channelID, message, event) {
    bot.sendMessage({
        to: channelID,
        message: "It's *sensual.* https://i.imgur.com/qX3ElWK.gif"
    });
}

function giltoss(user, userID, channelID, message, event) {
    bot.sendMessage({
        to: channelID,
        message: "The damage only goes up uP UP! http://i.imgur.com/7wxm7dy.gif"
    });
}

function ddstrat(user, userID, channelID, message, event) {
    bot.sendMessage({
        to: channelID,
        message: "**PREMIUM TACTICAL INFORMATION ITT**\nDragondarch's team is Monk, Mystic Knight, Beastmaster, Dancer. Here's his foolproof strategy for dealing with the Seal Guardians in Moore Forest.\n\n1. After getting the wind drake from Bal Castle, go to Kuza and grind to level 32.\n2. Proceed with the game until the Barrier Tower. Grind there for Reflect Rings.\n3. Go to Drakenvale and get a Poison Eagle to cast Float on everyone.\n4. Go to the Gil Cave to grind out 370,000 Gil to buy Hermes Sandals with in World 3.\n5. Let the Aegis Shield be transformed into the Flame Shield.\n6. Make Bartz a Mystic Knight and weaken him to critical HP.\n7. Give Bartz the Flame Shield, give everyone else Reflect Rings.\n8. Reset the game because Bartz got one-shotted immediately in the Seal Guardian fight.\n9. Kill the Water, Earth and Wind Crystals.\n10. Kill off everyone except Bartz.\n11. Use !Focus + Drain Sword to kill the Fire Crystal.\n\nIt's easy!"
    });
}

function yburns(user, userID, channelID, message, event) {
    bot.sendMessage({
        to: channelID,
        message: "The Y-BURNS? My favorite team! http://i.imgur.com/aQ18OQF.png"
    });
}

function quicksave(user, userID, channelID, message, event) {
    bot.sendMessage({
        to: channelID,
        message: "Hang on while I do some **ENCOUNTER MANIPULATION**"
    });
}

function badfaq(user, userID, channelID, message, event) {
    bot.sendMessage({
        to: channelID,
        message: "oh my god I love <:rod:455233447565459471> http://www.gamefaqs.com/snes/588331-final-fantasy-v/faqs/21687"
    });
}

function badfiesta(user, userID, channelID, message, event) {
    bot.sendMessage({
        to: channelID,
        message: "The worst fiesta ever happened here: https://www.twitch.tv/dragondarchsda/v/48967944"
    });
}

function equipharps(user, userID, channelID, message, event) {
    bot.sendMessage({
        to: channelID,
        message: "http://lparchive.org/Final-Fantasy-V-Advance-%28by-Dr-Pepper%29/1-MaximumTruckStyleLove.gif"
    });
}

function crystelle(user, userID, channelID, message, event) {
    bot.sendMessage({
        to: channelID,
        message: "Those are easy to catch, right? http://i.imgur.com/WD40MES.png"
    });
}

function countdown(user, userID, channelID, message, event) {
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

function sandworm(user, userID, channelID, message, event) {
    bot.sendMessage({
        to: channelID,
        message: "http://i.imgur.com/UaOsyZS.gif"
    });
}

function happyworm(user, userID, channelID, message, event) {
    bot.sendMessage({
        to: channelID,
        message: "https://gifsound.com/?gif=i.imgur.com/UaOsyZS.gif&v=y6Sxv-sUYtM&s=11"
    });
}

function iainuki(user, userID, channelID, message, event) {
    bot.sendMessage({
        to: channelID,
        message: "That's a good ability! http://gfycat.com/TenseArtisticCobra"
    });
}

function zerky(user, userID, channelID, message, event) {
    bot.sendMessage({
        to: channelID,
        message: "http://www.soldoutcomic.com/Etc/Sketchdump/ThreeOrMoreDeathStillWorryZerky.png"
    });
}

function oracle(user, userID, channelID, message, event) {
    bot.sendMessage({
        to: channelID,
        message: "https://www.youtube.com/watch?v=makazgIRzfg"
    });
}

function levelFiveDeath(user, userID, channelID, message, event) {
    bot.sendMessage({
        to: channelID,
        message: "Possibly the best ability! http://gfycat.com/TerrificKeyEmperorshrimp"
    });
}

function quickleak(user, userID, channelID, message, event){
    bot.sendMessage({
        to: channelID,
        message: "https://www.youtube.com/watch?v=1x7zRK-Fsv8&list=PLMthTW4vRq8bfi6MeqVHU-yWkN4BRE1DJ"
    });
}

//job DB
function jobs(user, userID, channelID, message, event) {
    let args = message.split(" ");
    //expected args - 0: ".jobs", 1: "lookup" or "register", 2: wind job or @mention (str), 3: water job (str), 4: fire job (str), 5: earth job (str)
    if (args.length < 3 || args.length > 6) {
        bot.sendMessage({
            to: channelID,
            message: "Acceptable syntax: `.jobs lookup @mention` or `.jobs register <wind> <water> <fire> <earth>`. Please ensure you provide jobs when registering. Please delimit with spaces, and keep two-word jobs to one word."
        });
        return;
    }
    if (args[1].toLowerCase() === "register") {
        let jobs = args.slice(2);
        data.jobs[userID] = jobs;
        fs.writeFile(jobFile, JSON.stringify(data.jobs, null, 4), err => console.error(err));
        bot.sendMessage({
            to: channelID,
            message: "Got it, <@" + userID + ">. Your jobs (" + jobs.join("/") + ") are registered."
        });
    } else if (args[1].toLowerCase() === "lookup") {
        let mentioned = message.replace(/\D/g, '');
        if (bot.fixMessage("<@" + mentioned + ">") === "undefined") {
            bot.sendMessage({
                to: channelID,
                message: "Sorry <@" + userID + ">, I can only lookup with @mentions!"
            });
        } else {
            jobs = data.jobs[mentioned]
            if (!jobs) {
                bot.sendMessage({
                    to: channelID,
                    message: "I don't have jobs on file for <@" + mentioned + ">, sorry!"
                });
            } else {
                bot.sendMessage({
                    to: channelID,
                    message: "I have <@" + mentioned + ">'s jobs as: " + jobs.join("/") + "."
                });
            }
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
    return a.filter(function (e) {
        return b.indexOf(e) > -1;
    }).filter(function (e, i, c) { // extra step to remove duplicates
        return c.indexOf(e) === i;
    });
}

function forbiddenRisk(user, userID, channelID, message, event) {
    bot.addToRole({
        serverID: "315364487882342401",
        userID: userID,
        roleID: "451768175152070657"
    },function(err) {if(err) {console.log(err);}});
    bot.sendMessage({
        to: channelID,
        message: "<:forbidden:451764608202571816> <:black101:326153094868238338>"
    });
}

function forbiddenLite(user, userID, channelID, message, event) {
    bot.addToRole({
        serverID: "315364487882342401",
        userID: userID,
        roleID: "451874821245108225"
    },function(err) {if(err) {console.log(err);}});
    bot.sendMessage({
        to: channelID,
        message: "<:forbidden:451764608202571816>"
    });
}

function purify(user, userID, channelID, message, event) {
    data = {
    victims: 0,
    kinuVictims: 0,
    rodsBroken: 0
};
}

// attributes
function attributes(user, userID, channelID, message, event) {
    bot.sendMessage({
        to: userID,
        message: "Available attributes:\n`name, rpge_name, level, exp, hp, mp, gil, speed, atk, mag_power, atk_m, mag_m, def, mag_def, evade, mag_evade, status_immunity, elem_immunity, elem_absorb, auto_hit, weakness, immunity, creature_type, init_status, specialty, spells, control, blue, catch, drop, steal, ai`." 
    });
}


function failQuery(destination) {
    bot.sendMessage({
        to: destination,
        message: "Sorry, I couldn't find the information you requested. Acceptable syntax: `.info <attribute> monster_name`. Monster name can be either RPGe or Advance translation. For a list of attributes I accept, use `.attributes`. "
    });
}


//monster data query (kinda busted)
/* function info(user, userID, channelID, message, event) {
    let args = message.split(" ");
    let monster = "";
    // expected args - 0: ".info", 1: query (str), 2..: monster name (str)
    if (args[1] === undefined) {
        args[1] = "a"; // prevents crash on no args
    }
    if(monsterData[0][args[1]] === undefined) { // no query, try and find monster 
        monster = args.slice(1, args.length).join(" "); // recreate monster name
        monsterList = monsterData.filter((x) => { 
            return (x.name.includes(monster) || x.rpge_name.includes(monster));
        });
        if (monsterList === []) { // no monster found :( 
            failQuery(channelID);        
        } else { // got just a monster
            if (monsterList.length > 1) { // which monster do we want?
                monsters = "\n```";
                for (let i = 0; i < monsterList.length; i++) {
                    monsters = monsters + i + ") " + monsterList[i].name + "[" + monsterList[i].rpge_name + "]\n";
                }
                monsters = monsters + "```\n";
                bot.sendMessage({
                    to: userID,
                    message: "Here are all the results I have for \"" + monster + "\":" + monsters + "Please be more specific when querying."
                }); // holy fuck this is janky
            } else { // just one monster, good:
                bot.sendMessage({
                    to: userID,
                    message: "Info for \"" + monster + "\":\n```" + JSON.stringify(monsterList[0], null, 2) + "```"
                });
            }
        }
    } else { // there's a query, we can just do it
        query = args[1];
        monster = args.slice(2, args.length).join(" "); // set up args
        if(monsterData[0][query] === undefined) { // user asked for nonexistent attribute
            failQuery(channelID);
        } else { // do the thing
            monsterList = monsterData.filter((x) => {
                return (x.name.includes(monster) || x.rpge_name.includes(monster));
            });
            if (monsterList === []) { // no monster found :(
                failQuery(channelID);
            } else { // got monster and query
                if (monsterList.length > 1) { // which monster do we want?
                    monsters = "\n```";
                    for (let i = 0; i < monsterList.length; i++) {
                        monsters = monsters + i + ") " + monsterList[i].name + "[" + monsterList[i].rpge_name + "]\n";
                    }
                    monsters = monsters + "```\n";
                    bot.sendMessage({
                        to: userID,
                        message: "Here are all the results I have for \"" + monster + "\":" + monsters + "Please be more specific when querying."
                    });
                } else { // just one monster + query
                    bot.sendMessage({
                        to: userID,
                        message: monster + "'s `" + query + "`:\n```" + JSON.stringify(monsterList[0][query], null, 2) + "```"
                });
            }
        }
    }
}
} */