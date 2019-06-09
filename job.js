"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Job {
    constructor(obj) {
        this.name = obj.name;
        this.short = obj.short;
        this.crystal = obj.crystal;
        this.is750 = obj["750"];
        this.innate = obj.innate;
        this.abilities = obj.abilities;
        this.ap = obj.ap;
        this.rawStr = obj.str;
        this.rawAgi = obj.agi;
        this.rawVit = obj.vit;
        this.rawMag = obj.mag;
    }
    convertAbilities() {
        return this.abilities.map((a, i) => a + " (" + this.ap[i] + " ABP)").join(", ");
    }
    convertStat(stat) {
        return Job.baseStat + stat;
    }
    convert750(stat) {
        return stat ? "750" : "no 750";
    }
    get crystalName() {
        return Job.crystals[this.crystal];
    }
    get abilityList() {
        return this.convertAbilities();
    }
    get str() {
        return this.convertStat(this.rawStr);
    }
    get agi() {
        return this.convertStat(this.rawAgi);
    }
    get vit() {
        return this.convertStat(this.rawVit);
    }
    get mag() {
        return this.convertStat(this.rawMag);
    }
    get profile() {
        let out = "__**" + this.name + "**__ (" + this.convert750(this.is750) + ")\n";
        (out += "**Crystal**: " + Job.crystals[this.crystal] + "\n"), (out += "**Innates**: ");
        if (this.innate.length < 1) {
            out += "None";
        }
        else {
            out += this.innate.join(", ");
        }
        out += "\n**Abilities**: ";
        if (this.abilities.length < 1) {
            out += "None";
        }
        else {
            out += this.convertAbilities();
        }
        out += "\n**Stats**: ";
        const stats = [this.rawStr, this.rawAgi, this.rawVit, this.rawMag];
        out += stats
            .map((s, i) => this.convertStat(s) + " " + Job.stats[i] + " (" + (s < 0 ? s : "+" + s) + ")")
            .join(", ");
        return out;
    }
}
Job.baseStat = 24;
Job.crystals = ["Special", "Wind", "Water", "Fire", "Earth", "GBA"];
Job.stats = ["Str", "Agi", "Vit", "Mag"];
exports.Job = Job;
//# sourceMappingURL=job.js.map