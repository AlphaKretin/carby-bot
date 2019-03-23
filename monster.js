"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Monster {
    constructor(raw) {
        this.name = raw.name;
        this.rpgeName = raw.rpge_name;
        this.level = raw.level;
        this.exp = raw.exp;
        this.hp = raw.hp;
        this.gil = raw.gil;
        this.mp = raw.mp;
        this.speed = raw.speed;
        this.atk = raw.atk;
        this.magPower = raw.mag_power;
        this.atkM = raw.atk_m;
        this.magM = raw.mag_m;
        this.evade = raw.evade;
        this.magEvade = raw.mag_evade;
        this.def = raw.def;
        this.magDef = raw.mag_def;
        this.elemImmunity = raw.elem_immunity;
        this.statusImmunity = raw.status_immunity;
        this.elemAbsorb = raw.elem_absorb;
        this.autoHit = raw.auto_hit;
        this.weakness = raw.weakness;
        this.creatureType = raw.creature_type;
        this.immunity = raw.immunity;
        this.initStatus = raw.init_status;
        this.specialty = raw.specialty;
        this.spells = raw.spells;
        this.control = raw.control;
        this.blue = raw.blue;
        this.catch = raw.catch;
        this.drop = raw.drop;
        this.steal = raw.steal;
        this.rawAi = raw.ai;
    }
    nameString() {
        let out;
        out = "__**" + this.name;
        if (this.rpgeName !== this.name) {
            out += " (" + this.rpgeName + ")";
        }
        out += "**__";
        return out;
    }
    statsProfile() {
        let out = "**Level**: " + this.level + " **EXP**: " + this.exp + " **Gil**: " + this.gil + "\n";
        out += "**HP**: " + this.hp + " **MP**: " + this.mp + " **Speed**: " + this.speed + "\n";
        out += `**Attack**: ${this.atk} (${this.atkM} M) **Magic Power**: ${this.magPower} (${this.magM} M)\n`;
        out += `**Defense**: ${this.def} (${this.evade} Evade) **Magic Defense**: ${this.magDef} (${this.magEvade} Evade)`;
        return out;
    }
    weakProfile() {
        const out = [];
        if (this.elemAbsorb.length > 0) {
            out.push("**Elemental Absorptions**: " + this.elemAbsorb.join(", "));
        }
        if (this.elemImmunity.length > 0) {
            out.push("**Elemental Immunities**: " + this.elemImmunity.join(", "));
        }
        if (this.weakness.length > 0) {
            out.push("**Elemental Weaknesses**: " + this.weakness.join(", "));
        }
        if (this.statusImmunity.length > 0) {
            out.push("**Status Immunities**: " + this.statusImmunity.join(", "));
        }
        if (this.initStatus.length > 0) {
            out.push("**Initial Status**: " + this.initStatus.join(", "));
        }
        if (this.immunity.length > 0) {
            out.push("**Misc. Immunities**: " + this.immunity.join(", "));
        }
        if (this.creatureType.length > 0) {
            out.push("**Creature Types**: " + this.creatureType.join(", "));
        }
        if (this.autoHit.length > 0) {
            out.push("**Auto-Hit Types**: " + this.autoHit.join(", "));
        }
        if (out.length > 0) {
            return out.join("\n");
        }
    }
    abilityProfile() {
        let out = "**Specialty**: " + this.specialty.name;
        if (this.specialty.effects.length > 0) {
            out += " (" + this.specialty.effects.join(", ") + ")";
        }
        out += "\n**Catch**: " + this.catch + " **Control**: " + this.control.join(", ");
        const extras = [];
        if (this.spells.length > 0) {
            extras.push("**Spells**: " + this.spells.join(", "));
        }
        if (this.blue.length > 0) {
            extras.push("**Blue Magic**: " + this.blue.join(", "));
        }
        if (extras.length > 0) {
            out += "\n" + extras.join("\n");
        }
        return out;
    }
    lootProfile() {
        return `**Drop**: ${this.drop.always} / ${this.drop.rare} (Rare) **Steal**: ${this.steal.always} / ${this.steal.rare} (Rare)`;
    }
    get profile() {
        let out = this.nameString();
        out += "\n" + this.statsProfile();
        const weak = this.weakProfile();
        if (weak) {
            out += "\n" + weak;
        }
        out += "\n" + this.abilityProfile();
        out += "\n" + this.lootProfile();
        return out;
    }
    get stats() {
        return this.nameString() + "\n" + this.statsProfile();
    }
    get weak() {
        return this.nameString() + "\n" + this.weakProfile();
    }
    get ability() {
        return this.nameString() + "\n" + this.abilityProfile();
    }
    get loot() {
        return this.nameString() + "\n" + this.lootProfile();
    }
    get ai() {
        return this.nameString() + "\n```css\n" + this.rawAi.join("\n") + "```";
    }
}
exports.Monster = Monster;
//# sourceMappingURL=monster.js.map