interface IRawMonster {
    name: string;
    rpge_name: string;
    level: number;
    exp: number;
    hp: number;
    gil: number;
    mp: number;
    speed: number;
    atk: number;
    mag_power: number;
    atk_m: number;
    mag_m: number;
    evade: number;
    mag_evade: number;
    def: number;
    mag_def: number;
    elem_immunity: string[];
    status_immunity: string[];
    elem_absorb: string[];
    auto_hit: string[];
    weakness: string[];
    creature_type: string[];
    immunity: string[];
    init_status: string[];
    specialty: ISpecialty;
    spells: string[];
    control: string[];
    blue: string[];
    catch: string;
    drop: IDrop;
    steal: IDrop;
    ai: string[];
}
interface ISpecialty {
    name: string;
    effects: string[];
}
interface IDrop {
    always: string;
    rare: string;
}
export class Monster {
    public name: string;
    public rpgeName: string;
    public level: number;
    public exp: number;
    public hp: number;
    public gil: number;
    public mp: number;
    public speed: number;
    public atk: number;
    public magPower: number;
    public atkM: number;
    public magM: number;
    public evade: number;
    public magEvade: number;
    public def: number;
    public magDef: number;
    public elemImmunity: string[];
    public statusImmunity: string[];
    public elemAbsorb: string[];
    public autoHit: string[];
    public weakness: string[];
    public creatureType: string[];
    public immunity: string[];
    public initStatus: string[];
    public specialty: ISpecialty;
    public spells: string[];
    public control: string[];
    public blue: string[];
    public catch: string;
    public drop: IDrop;
    public steal: IDrop;
    private rawAi: string[];
    constructor(raw: IRawMonster) {
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

    private nameString(): string {
        let out: string;
        out = "__**" + this.name;
        if (this.rpgeName !== this.name) {
            out += " (" + this.rpgeName + ")";
        }
        out += "**__";
        return out;
    }

    private statsProfile(): string {
        let out = "**Level**: " + this.level + " **EXP**: " + this.exp + " **Gil**: " + this.gil + "\n";
        out += "**HP**: " + this.hp + " **MP**: " + this.mp + " **Speed**: " + this.speed + "\n";
        out += `**Attack**: ${this.atk} (${this.atkM} M) **Magic Power**: ${this.magPower} (${this.magM} M)\n`;
        out += `**Defense**: ${this.def} (${this.evade} Evade) **Magic Defense**: ${this.magDef} (${
            this.magEvade
        } Evade)`;
        return out;
    }

    private weakProfile(): string | undefined {
        const out: string[] = [];
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

    private abilityProfile(): string {
        let out = "**Specialty**: " + this.specialty.name;
        if (this.specialty.effects.length > 0) {
            out += " (" + this.specialty.effects.join(", ") + ")";
        }
        out += "\n**Catch**: " + this.catch + " **Control**: " + this.control.join(", ");
        const extras: string[] = [];
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

    private lootProfile(): string {
        return `**Drop**: ${this.drop.always} / ${this.drop.rare} (Rare) **Steal**: ${this.steal.always} / ${
            this.steal.rare
        } (Rare)`;
    }

    get profile(): string {
        let out: string = this.nameString();
        out += "\n" + this.statsProfile();
        const weak = this.weakProfile();
        if (weak) {
            out += "\n" + weak;
        }
        out += "\n" + this.abilityProfile();
        out += "\n" + this.lootProfile();
        return out;
    }

    get stats(): string {
        return this.nameString() + "\n" + this.statsProfile();
    }

    get weak(): string {
        return this.nameString() + "\n" + this.weakProfile();
    }

    get ability(): string {
        return this.nameString() + "\n" + this.abilityProfile();
    }

    get loot(): string {
        return this.nameString() + "\n" + this.lootProfile();
    }

    get ai(): string {
        return this.nameString() + "\n```css\n" + this.rawAi.join("\n") + "```";
    }
}
