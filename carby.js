var Discord = require('discord.io');

var bot = new Discord.Client({
    token: "",
    autorun: true
});

var kyro = new String;
kyro = "103835146066599936";

var jsonfile = require('jsonfile');
var file = "data.json";
var data = {
    victims: -1,
    kinuVictims: -1,
    rodsBroken: -1
};
var jobFile = "jobs.json";
var jobData = [
{
    id: "316052390442958860",
    jobs: ["Mime", "Mime", "Mime", "Mime"]
}];

var monsterFile = "monsterdata.json";
var monsterData = [];

bot.on('ready', function () {
    console.log('Logged in as %s - %s\n', bot.username, bot.id);
    jsonfile.readFile(file, function (err, obj) {
        data = obj;
    });
    jsonfile.readFile(jobFile, function (err, obj) {
        jobData = obj;
    });
    jsonfile.readFile(monsterFile, function (err, obj) {
        monsterData = obj;
    });
});

bot.on('disconnect', function () {
    bot.connect();
});

//reads incoming messages for commands and redirects to functions to handle them
bot.on('message', function (user, userID, channelID, message, event) {
    var lowMes = message.toLowerCase();
    if ((userID !== bot.id) && (lowMes.charAt(0) === "!" || lowMes.charAt(0) === "." || lowMes.charAt(0) === "z")) {
        //.help
        if (lowMes.indexOf(".help") === 0) {
            help(user, userID, channelID, message, event);
        }
        //.mcalc
        if (lowMes.indexOf(".mcalc") === 0) {
            mcalc(user, userID, channelID, message, event);
        }
        //.almagest
        if (lowMes.indexOf(".almagest") === 0) {
            almagest(user, userID, channelID, message, event);
        }
        //fiesta rolls
        if (lowMes.indexOf(".normal") === 0) {
            normal(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".random") === 0) {
            random(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".750") === 0) {
            sevenFifty(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".no750") === 0) {
            noSevenFifty(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".chaos") === 0 && lowMes.indexOf("750") === -1) {
            chaos(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".chaosno750") === 0) {
            chaosNoSevenFifty(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".chaos750") === 0) {
            chaosSevenFifty(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".purechaos") === 0) {
            purechaos(user, userID, channelID, message, event);
        }
        //.dd
        if (lowMes.indexOf(".dd") === 0) {
            dd(user, userID, channelID, message, event);
        }
        //speedtrap and rods
        if (lowMes.indexOf(".trapped") === 0) {
            trapped(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".victims") === 0) {
            victim(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".break") === 0) {
            breakRod(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".broken") === 0) {
            broken(user, userID, channelID, message, event);
        }
        //goofy shit
        if (lowMes.indexOf("!gaia") === 0) {
            gaia(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf("!dance") === 0) {
            galufdance(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf("!zeninage") === 0) {
            giltoss(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".yburns") === 0) {
            yburns(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".quicksave") === 0) {
            quicksave(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".badfaq") === 0) {
            badfaq(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".badfiesta") === 0) {
            badfiesta(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".equipharps") === 0) {
            equipharps(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".crystelle") === 0) {
            crystelle(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".runthenumbers") === 0) {
            ddstrat(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".numbers") === 0) {
            ddstrat(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".sandworm") === 0) {
            sandworm(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".happyworm") === 0) {
            happyworm(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf("!iainuki") === 0) {
            iainuki(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf("zerky!") === 0) {
            zerky(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".oracle") === 0) {
        	oracle(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf("!level5death") === 0) {
        	levelFiveDeath(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".quickleak") === 0) {
        	quickleak(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".timer") === 0) {
        	countdown(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".fiestatimer") === 0) {
        	countdown(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".countdown") === 0) {
        	countdown(user, userID, channelID, message, event);
        }
        //job DB
        if (lowMes.indexOf(".jobs") === 0) {
            jobs(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".forbiddenrisk") === 0) {
            forbiddenRisk(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".forbiddenlite") === 0) {
            forbidden(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".purify") === 0 && userID === kyro) {
            purify(user, userID, channelID, message, event);
        }
        //monster data search (not working atm)
        /* if (lowMes.indexOf(".info") === 0) {
            info(user, userID, channelID, message, event);
        }
        if (lowMes.indexOf(".attributes") === 0) {
            attributes(user, userID, channelID, message, event);
        } */
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
function mcalc(user, userID, channelID, message, event) {
    var args = message.toLowerCase().split(" ");
    var m;
    var nextLevel;
    //expected args - 0: ".mcalc", 1: level (int), 2: str/mag (int), 3: type (string), 4: extra stat (int)
    var level = parseInt(args[1]);
    var strMag = parseInt(args[2]);
    var statString = "";
    if (isNaN(level) || isNaN(strMag)) {
        abortMcalc(user, userID, channelID, message, event);
        return;
    }
    if (args[3] === "physical") {
        m = Math.floor(((level * strMag) / 128) + 2);
        nextLevel = Math.ceil((128 * ((m + 1) - 2)) / strMag);
        statString = "Strength";
    } else if (args[3] === "magic") {
        m = Math.floor(((level * strMag) / 256) + 4);
        nextLevel = Math.ceil((256 * ((m + 1) - 4)) / strMag);
        statString = "Magic";
    } else if (args[3] === "knife") {
        var agil = parseInt(args[4]);
        if (isNaN(agil)) {
            abortMcalc(user, userID, channelID, message, event);
            return;
        } else {
            m = level;
            var bonus = level;
            m = m * strMag;
            bonus = bonus * agil;
            m = Math.floor(m / 128);
            bonus = Math.floor(bonus / 128);
            var ns = bonus;
            var divider = bonus;
            divider = Math.floor(divider / 2);
            bonus -= divider;
            bonus -= divider;
            var n = m;
            n++;
            ns++;
            n = n * 128;
            ns = ns * 128;
            n = Math.floor(n / strMag);
            ns = Math.floor(ns / agil);
            m += 2;
            //n++;  ???
            //ns++; forget why these are
            if (bonus === 0) {
                m = m + " (no Agility bonus)";
                nextLevel = n + " (Bonus Agility M gained at level " + ns + ")";
            } else { //if bonus = 1
                m = m + 1;
                m = m + " (+1 from Agility bonus)";
                nextLevel = n + " (Bonus Agility M **LOST** at level " + ns + ")";
            }
            statString = "Strength and " + agil + " Agility";
        }
    } else if (args[3] === "chicken") {
        var agil = parseInt(args[4]);
        if (isNaN(agil)) {
            abortMcalc(user, userID, channelID, message, event);
            return;
        } else {
            m = Math.floor((level * strMag) / 128);
            var bonus = Math.floor((level * agil) / 128);
            var n = Math.ceil((128 * (m + 1)) / strMag);
            var ns = Math.ceil((128 * (bonus + 1)) / agil);
            m += bonus + 2;
            statString = "Strength and " + agil + " Agility";
            nextLevel = n + " for Strength and " + ns + " for Agility";
            args[3] = "Chicken Knife";
        }
    } else if (args[3] === "rune") {
        var mag = parseInt(args[4]);
        if (isNaN(mag)) {
            abortMcalc(user, userID, channelID, message, event);
            return;
        } else {
            m = Math.floor((level * strMag) / 128);
            var bonus = Math.floor((level * mag) / 128);
            var n = Math.ceil((128 * (m + 1)) / strMag);
            var ns = Math.ceil((128 * (bonus + 1)) / mag);
            m += bonus + 2;
            statString = "Strength and " + mag + " Magic Power";
            nextLevel = n + " for Strength and " + ns + " for Magic";
            args[3] = "Rune weapon";
        }
    } else if (args[3] === "fists") {
        m = Math.floor(((level * strMag) / 256) + 2);
        nextLevel = Math.ceil((256 * ((m + 1) - 2)) / strMag);
        var pow = level * 2 + 3;
        m = m + " (with " + pow + " attack power)";
        statString = "Strength";
        args[3] = "fist";
    } else if (args[3] === "cannon") {
        m = Math.floor(((level * level) / 256) + 4);
        nextLevel = Math.ceil((256 * ((m + 1) - 4)));
        nextLevel = Math.ceil(Math.sqrt(nextLevel));
        args[3] = "Cannoneer";
        statString = "useless stat"
    } else {
        abortMcalc(user, userID, channelID, message, event);
        return;
    }
    if (args[3] === "Cannoneer") {
    bot.sendMessage({
        to: channelID,
        message: "At level " + level + ", your " + args[3] + " M is " + m + ". To reach the next M, you need to reach level " + nextLevel + "."
    });
    } else {
     bot.sendMessage({
        to: channelID,
        message: "At level " + level + " with " + strMag + " " + statString + ", your " + args[3] + " M is " + m + ". To reach the next M, you need to reach level " + nextLevel + "."
    });
    }
}

function abortMcalc(user, userID, channelID, message, event) {
    bot.sendMessage({
        to: channelID,
        message: "The syntax for this command is: .mcalc level strength/magic <type> <agility/magic>; example: .mcalc 20 46 rune 44 (valid types: physical, magic, knife, chicken, rune, fists, cannon)"
    });
    return;
}

//.almagest
function almagest(user, userID, channelID, message, event) {
    var args = message.toLowerCase().split(" ");
    var vit = parseInt(args[1]);
    if (isNaN(vit) || args.length === 1) {
        bot.sendMessage({
            to: channelID,
            message: "NED's Almagest can deal 1620 to 1665 Holy damage and inflict Sap. Good luck! (Only 720 to 740 damage if you have Shell! Yay!)"
        });
    } else {
        var target = Math.floor((32 * 1665) / (vit + 32));
        var buffTarget = Math.floor((32 * 1725) / (vit + 32));
        bot.sendMessage({
            to: channelID,
            message: "You need " + target + " base HP to survive a max 1665 damage Almagest with " + vit + " Vitality (or " + buffTarget + " to have 1725 HP for a buffer). Refer here for the level you'll need! http://bit.ly/1WKSUyu"
        });
    }
}

//DIY fiestas
var windJobs = ["Knight", "Monk", "Thief", "Black Mage", "White Mage", "Blue Mage"];
var waterJobs = ["Red Mage", "Time Mage", "Summoner", "Berserker", "Mystic Knight"];
var fireJobs = ["Beastmaster", "Geomancer", "Ninja", "Ranger", "Bard"];
var earthJobs = ["Dragoon", "Dancer", "Samurai", "Chemist"];
var miscJobs = ["Freelancer", "Mime"];
var mageJobs = ["Black Mage", "White Mage", "Blue Mage", "Red Mage", "Time Mage", "Summoner", "Geomancer", "Bard", "Dancer", "Chemist", "Mime"];
var noMageJobs = ["Monk", "Thief", "Knight", "Berserker", "Mystic Knight", "Ninja", "Ranger", "Beastmaster", "Samurai", "Dragoon"];

function normal(user, userID, channelID, message, event) {
    var wind = windJobs[getIncInt(0, windJobs.length - 1)];
    var water = waterJobs[getIncInt(0, waterJobs.length - 1)];
    var fire = fireJobs[getIncInt(0, fireJobs.length - 1)];
    var earth = earthJobs[getIncInt(0, earthJobs.length - 1)];
    bot.createDMChannel(userID);
    bot.sendMessage({
        to: userID,
        message: "Wind Job: " + wind + "\nWater Job: " + water + "\nFire Job: " + fire + "\nEarth Job: " + earth
    });
}

function random(user, userID, channelID, message, event) {
    var wind = windJobs[getIncInt(0, windJobs.length - 1)];
    var randWater = windJobs.concat(waterJobs);
    var water = randWater[getIncInt(0, randWater.length - 1)];
    var randFire = randWater.concat(fireJobs);
    var fire = randFire[getIncInt(0, randFire.length - 1)];
    var randEarth = randFire.concat(earthJobs);
    var earth = randEarth[getIncInt(0, randEarth.length - 1)];
    bot.createDMChannel(userID);
    bot.sendMessage({
        to: userID,
        message: "Wind Job: " + wind + "\nWater Job: " + water + "\nFire Job: " + fire + "\nEarth Job: " + earth
    });
}

function sevenFifty(user, userID, channelID, message, event) {
    var mageWind = intersect(windJobs, mageJobs);
    var wind = mageWind[getIncInt(0, mageWind.length - 1)];
    var mageWater = intersect(waterJobs, mageJobs);
    var water = mageWater[getIncInt(0, mageWater.length - 1)];
    var mageFire = intersect(fireJobs, mageJobs);
    var fire = mageFire[getIncInt(0, mageFire.length - 1)];
    var mageEarth = intersect(earthJobs, mageJobs);
    var earth = mageEarth[getIncInt(0, mageEarth.length - 1)];
    bot.createDMChannel(userID);
    bot.sendMessage({
        to: userID,
        message: "Wind Job: " + wind + "\nWater Job: " + water + "\nFire Job: " + fire + "\nEarth Job: " + earth
    });
}

function noSevenFifty(user, userID, channelID, message, event) {
    var noWind = intersect(windJobs, noMageJobs);
    var wind = noWind[getIncInt(0, noWind.length - 1)];
    var noWater = intersect(waterJobs, noMageJobs);
    var water = noWater[getIncInt(0, noWater.length - 1)];
    var noFire = intersect(fireJobs, noMageJobs);
    var fire = noFire[getIncInt(0, noFire.length - 1)];
    var noEarth = intersect(earthJobs, noMageJobs);
    var earth = noEarth[getIncInt(0, noEarth.length - 1)];
    bot.createDMChannel(userID);
    bot.sendMessage({
        to: userID,
        message: "Wind Job: " + wind + "\nWater Job: " + water + "\nFire Job: " + fire + "\nEarth Job: " + earth
    });
}

function chaos(user, userID, channelID, message, event) {
    var allJobs = windJobs.concat(waterJobs).concat(fireJobs).concat(earthJobs);
    var wind = allJobs[getIncInt(0, allJobs.length - 1)];
    var water = allJobs[getIncInt(0, allJobs.length - 1)];
    var fire = allJobs[getIncInt(0, allJobs.length - 1)];
    var earth = allJobs[getIncInt(0, allJobs.length - 1)];
    bot.createDMChannel(userID);
    bot.sendMessage({
        to: userID,
        message: "Wind Job: " + wind + "\nWater Job: " + water + "\nFire Job: " + fire + "\nEarth Job: " + earth
    });
}

function chaosNoSevenFifty(user, userID, channelID, message, event) {
    var allJobs = windJobs.concat(waterJobs).concat(fireJobs).concat(earthJobs);
    var noJobs = intersect(allJobs, noMageJobs);
    var wind = noJobs[getIncInt(0, noJobs.length - 1)];
    var water = noJobs[getIncInt(0, noJobs.length - 1)];
    var fire = noJobs[getIncInt(0, noJobs.length - 1)];
    var earth = noJobs[getIncInt(0, noJobs.length - 1)];
    bot.createDMChannel(userID);
    bot.sendMessage({
        to: userID,
        message: "Wind Job: " + wind + "\nWater Job: " + water + "\nFire Job: " + fire + "\nEarth Job: " + earth
    });
}

function chaosSevenFifty(user, userID, channelID, message, event) {
    var allJobs = windJobs.concat(waterJobs).concat(fireJobs).concat(earthJobs);
    var magJobs = intersect(allJobs, mageJobs);
    var wind = magJobs[getIncInt(0, magJobs.length - 1)];
    var water = magJobs[getIncInt(0, magJobs.length - 1)];
    var fire = magJobs[getIncInt(0, magJobs.length - 1)];
    var earth = magJobs[getIncInt(0, magJobs.length - 1)];
    bot.createDMChannel(userID);
    bot.sendMessage({
        to: userID,
        message: "Wind Job: " + wind + "\nWater Job: " + water + "\nFire Job: " + fire + "\nEarth Job: " + earth
    });
}

function purechaos(user, userID, channelID, message, event) {
    var allJobs = windJobs.concat(waterJobs).concat(fireJobs).concat(earthJobs).concat(miscJobs);
    var wind = allJobs[getIncInt(0, allJobs.length - 1)];
    var water;
    do {
    	water = allJobs[getIncInt(0, allJobs.length - 1)];
    } while (water === wind);
    var fire;
    do {
    	fire = allJobs[getIncInt(0, allJobs.length - 1)];
    } while (fire === wind || fire === water);
    var earth;
    do {
    	earth = allJobs[getIncInt(0, allJobs.length - 1)];
    } while (earth === wind || earth === water || earth === fire);
    bot.createDMChannel(userID);
    bot.sendMessage({
        to: userID,
        message: "Wind Job: " + wind + "\nWater Job: " + water + "\nFire Job: " + fire + "\nEarth Job: " + earth
    });
}

//.dd
var ddLines = [
    "I suggest using **ENCOUNTER MANIPULATION** (#1)",
    "Good thing I can !Control Shield Dragons so I can hashtag grind on them for **TWO HOURS** (#2)",
    "No, I have to let the Aegis Shield burn, I ran the numbers, doing it without the Flame Shield is impossible. (#3)",
    "Running through the Gil Turtle cave four times lets you buy sufficient cottages! (#4)",
    "You'll need Bartz in critical HP for this fight. It's not like the Seal Guardians have physical attacks... (#5)",
    "I may not have Summoner, but I absolutely have to go get Catoblepas for... some reason! (#6)",
    "...what free Hermes Sandals? (#7)",
    "I just realized I didn't put Butz in the front row... (I didn't notice Krile either...) (#8)",
    "I'm not using Catch and Release for this fight because I can't have four Beastmasters. (#9)",
    "**I'M NOT USING FOCUS, IT DOESN'T DO ENOUGH DAMAGE. I TESTED THIS EXTENSIVELY** (#10)",
    "I can't get the genji shield off of Gilgamesh because I can't steal. (#11)",
    "THE LAG IN THE GAME just prevented my full party curaga! (#12)",
    "Hold on, I need to use my eyedrops on the person WHO HAS RAPID FIRE. (#13)",
    "Good thing I have a map of Exdeath's Castle so I can completely miss the Hayate Bow! (#14)",
    "Giving your Dancer the Chicken Knife over your Ranger is Sound Dragondarch Planning! (#15)",
    "Yes, I believe my Ranger with Rapid Fire is the lowest damage character. I will make her a Red Mage instead. (#16)",
    "Bartz, please use !Dance while we attempt to run. While wielding the Chicken Knife. (#17)",
    "http://winvm.kyrosiris.com/optimalhelmchoices.png (#18)",
    "I wish I, a person with access to Equip Bows, had a way to blind someone! (#19)",
    "But he's not weak to Air, as far as I'm aware of! ...Oh, wait, yes he is, never mind. (#20)",
    "Sword Dance is the best form of damage we've got with this team. (#21)",
    "Good thing I have Red Mage so I can hashtag grind Mini Dragons for **TWO HOURS** while my sycophants in chat defend it! (#22)",
    "Ladies and gentlemen, the grinding is over, we've hit level 32! ...now what do I do? (#23)",
    "Yes! Sub 5-hour world 1! I'm so good. (#24)",
    "Oh my god, the Wonder Wand missed! (#25)",
    "...Does the Hayate Bow even sell? (#26)",
    "There's no save points around here. *enters next room, finds save point* (#27)",
    "I am a fucking idiot. I have this thing called !Mix, why am I not using it? (#28)",
    "Is Archeosaur fuckin' heavy or something? (#29)",
    "ANYTHING but the fucking chicken knife! (#30)",
    "Now I actually know what the fuck I'm doing here. (#31)",
    "I actually don't do serious speedruns of this game. I just have a fairly good amount of knowledge about how the mechanics work and stuff. (#32)",
    "I need Faris solo to gain experience for **#GOBLINPUNCH**. *game overs in the Wind Shrine without having saved the game* (#33)",
    "THE CHEST IS OPEN! WHERE IS THE DRAGON FANG? I'M STARING AT THE OPEN CHEST!!! (#34)",
    "I'm gonna try something dumb! (#35)",
    "\\*swings Blizzara Blade at immune target\\* Can you guys please hit??? (#36)",
    "Well, he can't cast Aero now. \\*Gigas casts Aero twice\\* (#37)",
    "Being higher level isn't really going to help outside of getting higher damage multipliers, basically. (#38)",
    "My notes assume I don't get a Lamia Tiara. \\*proceeds to grind for one anyways\\* (#39)",
    "I have a really really dumb strategy! <:yayclod:362777481838592010> (#40)"
];

function dd(user, userID, channelID, message, event) {
    var args = message.toLowerCase().split(" ");
    var index = parseInt(args[1]);
    if (args.length === 1) {
        bot.sendMessage({
            to: channelID,
            message: ddLines[getIncInt(0, ddLines.length - 1)]
        });
    } else if (isNaN(index)) {
    	bot.sendMessage({
    		to: channelID,
    		message: "No, I have to let that quote burn, I ran the numbers, doing it with letters is impossible."
    	});
    } else if (index > ddLines.length || index < 1) { 
    	bot.sendMessage({
    		to: channelID,
    		message: "Oh my god, the quote wand missed!\n" + ddLines[getIncInt(0, ddLines.length - 1)]
    	});
    } else {
        bot.sendMessage({
            to: channelID,
            message: ddLines[index - 1]
        });
    }
}

//speedtrap
function trapped(user, userID, channelID, message, event) {
    data.victims++;
    if (userID === "90507312564805632") {
        data.kinuVictims++;
    }
    bot.sendMessage({
        to: channelID,
        message: "Gotta go fast! Total Victims: " + data.victims
    });
    jsonfile.writeFile(file, data, function (err) {
        console.error(err);
    });
}

function victim(user, userID, channelID, message, event) {
    bot.sendMessage({
        to: channelID,
        message: "<@" + userID + ">: Dr. Clapperclaw's Deadly Speed Trap has snared " + data.victims + " victims! (" + data.kinuVictims + " of them are alcharagia...)"
    });
}

function breakRod(user, userID, channelID, message, event) {
    var args = message.toLowerCase().split(" ");
    var index = parseInt(args[1]);
    if (isNaN(index) || args.length === 1 || index < 0 || index > 100 ) {
        data.rodsBroken++;
    } else {
        data.rodsBroken += index;
    }
    bot.sendMessage({
        to: channelID,
        message: "750 blaze rods errday (" + data.rodsBroken + " broken so far!)"
    });
    jsonfile.writeFile(file, data, function (err) {
        console.error(err);
    });
}

function broken(user, userID, channelID, message, event) {
    bot.sendMessage({
        to: channelID,
        message: "You godless heathens have blazed " + data.rodsBroken + " rods so far. DARE has failed you all."
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
    var os = require('os');
    bot.sendMessage({
        to: channelID,
        message: "**PREMIUM TACTICAL INFORMATION ITT**" + os.EOL + "Dragondarch's team is Monk, Mystic Knight, Beastmaster, Dancer. Here's his foolproof strategy for dealing with the Seal Guardians in Moore Forest." + os.EOL + os.EOL + "1. After getting the wind drake from Bal Castle, go to Kuza and grind to level 32." + os.EOL + "2. Proceed with the game until the Barrier Tower. Grind there for Reflect Rings." + os.EOL + "3. Go to Drakenvale and get a Poison Eagle to cast Float on everyone." + os.EOL + "4. Go to the Gil Cave to grind out 370,000 Gil to buy Hermes Sandals with in World 3." + os.EOL + "5. Let the Aegis Shield be transformed into the Flame Shield." + os.EOL + "6. Make Bartz a Mystic Knight and weaken him to critical HP." + os.EOL + "7. Give Bartz the Flame Shield, give everyone else Reflect Rings." + os.EOL + "8. Reset the game because Bartz got one-shotted immediately in the Seal Guardian fight." + os.EOL + "9. Kill the Water, Earth and Wind Crystals." + os.EOL + "10. Kill off everyone except Bartz." + os.EOL + "11. Use !Focus + Drain Sword to kill the Fire Crystal." + os.EOL + os.EOL + "It's easy!"
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
    var fiestaDate = new Date("June 17, 2018 13:00:00").getTime();
    var now = new Date().getTime();
    var distance = fiestaDate - now;
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
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
    var args = message.split(" ");
    //expected args - 0: ".jobs", 1: "lookup" or "register", 2: wind job or @mention (str), 3: water job (str), 4: fire job (str), 5: earth job (str)
    if (args[1] === undefined) {
        args[1] = "a";
    } //prevents crash on no args
    if (args[1].toLowerCase() === "register") {
        var hasUser = false;
        for (var user of jobData) {
            if (user.id === userID) {
                hasUser = true;
                user.jobs = [args[2], args[3], args[4], args[5]];
            }
        }
        if (!hasUser) {
            jobData.push({
                id: userID,
                jobs: [args[2], args[3], args[4], args[5]]
            });
        }
        jsonfile.writeFile(jobFile, jobData, function (err) {
            console.error(err);
        });
        bot.sendMessage({
            to: channelID,
            message: "Got it, <@" + userID + ">. Your jobs (" + args[2] + " / " + args[3] + " / " + args[4] + " / " + args[5] + ") are registered."
        });
    } else if (args[1].toLowerCase() === "lookup") {
        var current;
        var mentioned = message.replace(/\D/g, '');
        if (bot.fixMessage("<@" + mentioned + ">") === "undefined") {
            bot.sendMessage({
                to: channelID,
                message: "Sorry <@" + userID + ">, I can only lookup with @mentions!"
            });
        } else {
            for (var user of jobData) {
                if (user.id === mentioned) {
                    current = user;
                }
            }
            if (current === undefined) {
                bot.sendMessage({
                    to: channelID,
                    message: "I don't have jobs on file for <@" + mentioned + ">, sorry!"
                });
            } else {
                bot.sendMessage({
                    to: channelID,
                    message: "I have <@" + mentioned + ">'s jobs as: " + current.jobs[0] + " / " + current.jobs[1] + " / " + current.jobs[2] + " / " + current.jobs[3] + "."
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
    var t;
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

function forbidden(user, userID, channelID, message, event) {
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
    var args = message.split(" ");
    var monster = "";
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
                for (var i = 0; i < monsterList.length; i++) {
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
                    for (var i = 0; i < monsterList.length; i++) {
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