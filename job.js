class Job {
    constructor(obj) {
        this._name = obj.name;
        this._crystal = obj.crystal;
        this._750 = obj["750"];
        this._innate = obj.innate;
        this._abilities = obj.abilities;
        this._ap = obj.ap;
        this._str = obj.str;
        this._agi = obj.agi;
        this._vit = obj.vit;
        this._mag = obj.mag;
    }

    convertAbilities() {
        return this._abilities.map((a, i) => a + " (" + this._ap[i] + " ABP)").join(", ");
    }

    convertStat(stat) {
        return Job.baseStat + stat;
    }

    convert750(stat) {
        return stat ? "750" : "no 750";
    }

    get name() {
        return this._name;
    }

    get crystal() {
        return this._crystal;
    }

    get crystalName() {
        return Job.crystals[this._crystal];
    }

    get is750() {
        return this._750;
    }

    get innate() {
        return this._innate;
    }

    get abilities() {
        return this._abilities;
    }

    get abilityList() {
        return this.convertAbilities();
    }

    get str() {
        return this.convertStat(this._str);
    }

    get agi() {
        return this.convertStat(this._agi);
    }

    get vit() {
        return this.convertStat(this._vit);
    }

    get mag() {
        return this.convertStat(this._mag);
    }

    get profile() {
        let out = "__**" + this._name + "**__ (" + this.convert750(this._750) + ")\n";
        out += "**Crystal**: " + Job.crystals[this._crystal] + "\n",
        out += "**Innates**: ";
        if (this._innate.length < 1) {
            out += "None";
        } else {
            out += this._innate.join(", ");
        }
        out += "\n**Abilities**: ";
        if (this._abilities.length < 1) {
            out += "None";
        } else {
            out += this.convertAbilities();
        }
        out += "\n**Stats**: ";
        let stats = [this._str, this._agi, this._vit, this._mag];
        out += stats.map((s, i) => this.convertStat(s) + " " + Job.stats[i] + " (" + ((s < 0) ? s : ("+" + s)) + ")").join(", ");
        return out;
    }
}

Job.baseStat = 24;
Job.crystals = ["Special", "Wind", "Water", "Fire", "Earth", "GBA"];
Job.stats = ["Str", "Agi", "Vit", "Mag"];

module.exports = Job;