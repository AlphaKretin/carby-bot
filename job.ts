export class Job {
    private static baseStat = 24;
    private static crystals = ["Special", "Wind", "Water", "Fire", "Earth", "GBA"];
    private static stats = ["Str", "Agi", "Vit", "Mag"];
    public name: string;
    public crystal: number;
    public is750: boolean;
    public innate: string[];
    public abilities: string[];
    public ap: number[];
    private rawStr: number;
    private rawAgi: number;
    private rawVit: number;
    private rawMag: number;
    constructor(obj: any) {
        this.name = obj.name;
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

    private convertAbilities() {
        return this.abilities.map((a, i) => a + " (" + this.ap[i] + " ABP)").join(", ");
    }

    private convertStat(stat: number) {
        return Job.baseStat + stat;
    }

    private convert750(stat: boolean) {
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
        } else {
            out += this.innate.join(", ");
        }
        out += "\n**Abilities**: ";
        if (this.abilities.length < 1) {
            out += "None";
        } else {
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
