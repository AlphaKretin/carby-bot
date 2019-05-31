#Carbybot

Hi! I'm Discord!Carbybot, made by AlphaKretin, based off of the IRC!Carbybot made by Kyrosiris! I'm here to make Fiestaing easier!
If you have other suggestions for commands, let Kyrosiris or someone with the Robit Helper role know. They'll try to add it.
Unlike the dumb IRC version of Carbybot, I can accept PMs! Yay!
You can use `.help` to get a link to this readme. Note that while the "intended" prefix alternates between commands, they all work with either `.` or `!`, so don't feel compelled to memorise which is which.

##Mechanical Tips/Useful things
See also the section on the enemy database.
###.mcalc
**Usage**: `.mcalc type stat [stat stat]`
This calculates attack multipliers, or "M", and the next level at which it will increase, based on your stats. If you're not sure what M is, check out [this primer](https://forums.somethingawful.com/showthread.php?threadid=3889977&userid=0&perpage=40&pagenumber=4#post495448811) I wrote about it.

If you just enter `.mcalc` or otherwise invalid input, Carby will guide you through the process. Carby accepts the following M types, with required stats in the order listed.

-   `physical`: Level, Strength. Used for most weapons.
-   `magic`: Level, Magic. Used for magic.
-   `knife`: Level, Strength, Agility. Used for knives, bows, whips, etc.
-   `chicken`: Level, Strength, Agility. Used for the Chicken Knife.
-   `rune`: Level, Strength, Magic. Used for the Rune Axe etc.
-   `fists`: Level, Strength. Used for unarmed attacks.
-   `cannon`: Level. Used for !Open Fire.

###.almagest
**Usage**: `.almagest [stamina|Job]`
This recites how much HP you need to survive the final boss' powerful Almagest attack. If you include a Stamina value, or the name of a job class, Carby will calculate the Level you need to have that much HP.

###.math
**Usage**: `.maths level`
This calculates how many times you'll need to cast the Blue Magic Dark Spark on an enemy of a given level, halving their level rounding down, to make it a multiple of 2, 3, 4 or 5 for the various Level X Blue Magic spells.

###.class
**Usage**: `.class name`
This recites information about a Job class, such as its base stats and learned abilities. The name `.class` is chosen over `.job` to avoid conflicts with `.jobs`.

###.timer
This displays the current state of a countdown until the next relevant date, be it preregistration or The Run.

###.color
This generates a random set of three 0-7 numbers, used for FFV Advance's menu colour option, and reacts to your message with them. Because reactions have to be unique, duplicate numbers are represented with ◀ and ➕.

##Fun Stat Tracking:
These commands keep track of various fun stats about our playthroughs. People donate based on these totals, so keep them coming and keep them honest!
###.trapped
This registers that you fell in the speed trap, an obstacle pictured below.
[!speed trap](http://i.imgur.com/887zUa3.png)

###.victims
This recites the number of people who have fallen in the speed trap.

###.break
**Usage**: `.break [number]`
This registers that you broke some rods. This means equipping a Rod weapon, pressing up on the Item menu in-battle to check your equipment, then click the Rod twice while it's equipped to use it. This casts a high-level spell of that element and destroys it, a useful crutch in the early game. You can include a number to register breaking multiple in one fight, or to save up a play session worth.

###.broken
This recites the number of rods people have broken.

###.jobs
**Usage**: `.jobs register job job job job`, `.jobs lookup [@User]`
This keeps track of what Jobs people have been assigned, for reference when asking for advice etc. When registering, Carby accepts any 4 strings seperated by spaces. People have a trend of using emoji, so a table of likely meanings is below. When looking up a user, Carby will try to find them if you just type their name, but you might have to @mention them. If you don't include a user, it will recite your own registered jobs.

| Job Name   | Emoji |
| ---------- | ----- |
| Knight     | ⚔🛡    |
| Black Mage | ⚫    |

###.forbiddenRisk
This adds you to a role designating that you braved `#regForbidden #BERSERKERRISK` in 2018 when it was new and unknown.

###.forbiddenLite
This adds you to a role designating that you braved `#regForbidden`, without Berserker Risk, in 2018 when it was new and unknown.

##DIY Fiesta:
**Usage**: `.runtype[+modifier]`
These commands all generate a Four Job Fiesta Job set according to the chosen rules. They support the following additional modifiers after a `+` (e.g. `.normal+forbidden`):

-   `+forbidden`: A random Job will be "lost to the void". After you enter the final dungeon, you can no longer use it or its abilities.
-   `+fifthjob`: A fifth Job will be assigned to Krile. When she joins your party, you can no longer use your Earth Job and instead use this fifth Job.

###.normal
These are the normal Fiesta rules. At each crystal, the Job you are assigned will come from the group that crystal gave you.

###.random
At each crystal, the Job you are assigned will come from any crystals you already have unlocked, but not future ones.

###.750
You will only be assigned magical jobs, namely . This is to be turned into a modifier at a later date, and does not support the other modifiers.

###.no750
You will only be assigned physical jobs, namely . This is to be turned into a modifier at a later date, and does not support the other modifiers.

###.chaos
You can be assigned any normal job at any crystal, with duplicates allowed.

###.chaosno750
A combination of `.chaos` and `.750` rules. Will be obsolete when 750 becomes a modifier, and does not support the other modifiers.

###.chaos750
A combination of `.chaos` and `.no750` rules. Will be obsolete when no750 becomes a modifier, and does not support the other modifiers.

###.purechaos
You can be assigned any normal job, as well as the special jobs Mime and Freelancer, at any crystal, with no duplicates.

###.advance
Jobs are re-arranged in order to fit the 3 bonus GBA version jobs, Gladiator, Oracle and Cannoneer, in the Earth Crystal. Assigns jobs like Normal.

-   Wind: Normal Wind Jobs and Time Mage
-   Water: Red Mage, Summoner, Berserker, Mystic Knight, Beastmaster, Geomancer and Ninja
-   Fire: Bard, Ranger, Dancer and Normal Earth Jobs
-   Earth: Gladiator, Oracle and Cannoneer

###.forbidden
Obsolete combination of `.advance+forbidden`. Your Earth Job cannot be Forbidden.

## Enemy database

Thanks to DigiPack (Sakako), Carby has a full database of all the enemies in FFV. These commands look them up and display their information. If you search a phrase that matches the names of multiple enemies, Carby will continue with you in DMs, just type the number next to the name you wanted. Carby knows names from both the GBA version onwards and the RPGe fan translation.

###.attributes
This provides help for the other commands in this category.

###.info
**Usage**: `.info name`
This provides the whole profile of an enemy's data, except the AI routines.

###.ai
**Usage**: `.ai name`
This provides an enemy's AI script, as documented in the [FFV Algorithms guide](http://www.kyrosiris.com/ff5algorithm.html).

###.loot
**Usage**: `.loot name`
This provides an enemy's item drops and steals.

###.stats
**Usage**: `.stats name`
This provides an enemy's basic stats like Level, Strength, etc.

###.weak
**Usage**: `.weak name`
This provides an enemy's elemental and status affinities, including weakness, resistance, immunty, absorption, and initial statuses.

###.ability
**Usage**: `.ability name`
This provides information about an enemy's abilities, such as their known Magic, Blue Magic you can learn from them, and what happens when you !Control or !Catch them.

## Silly nonsense:

###.dd
**Usage**: `.dd [number|search]`
Recites a random quote from a certain speedrunner's runs of FFV. Include a number to get the quote with that number, or a phrase to get a quote that includes that phrase.

###Other
The following commands all recite a quote or link.

-   `.badfaq`
-   `.badfiesta`
-   `.badmod`
-   `.crystelle`
-   `!dance`
-   `.equipharps`
-   `!gaia`
-   `.happyworm`
-   `!iainuki`
-   `.level5death`
-   `.numbers`/`.runthenumbers`
-   `.oracle`
-   `.quickleak`
-   `.quicksave`
-   `.rocksfall`
-   `.sandworm`
-   `.yburns`
-   `!zeninage`
-   `zerky!`
