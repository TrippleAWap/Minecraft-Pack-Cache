import {Entity, Player, World, world} from "@minecraft/server";

let scoreboards = {}

const newProps = {
    distanceTo: {
        value: function (x,y,z) {
            const { x: px, y: py, z: pz } = this.location
            return Math.sqrt((x - px) ** 2 + (y - py) ** 2 + (z - pz) ** 2)
        }
    },
    score: {
        get() {
            /* @type {Player} */
            const player = this;
            return new Proxy({}, {
                get(target, key) {
                    try {
                        return (scoreboards[key] ??= world.scoreboard.getObjective(key)).getScore(player) ?? 0;
                    } catch {
                        return 0;
                    }
                },
                set(target, key, value) {
                    try {
                        (scoreboards[key] ??= world.scoreboard.getObjective(key)).setScore(player, value)
                    } catch {
                        player.runCommandAsync(`scoreboard players set @s ${key} ${value}`)
                    }
                    return true;
                },
            })
        },
    },
    blockLocation: {
        get() {
            const vals = ['x', 'y', 'z']
            return Object.values(this.getHeadLocation()).reduce((prev, curr, i) => prev[vals[i]] = Math.floor(curr), {}) // returns {x: 0, y: 0, z: 0}
        }
    },
    data: new Proxy({}, {
        get(_, comp) {
            return _.getComponent(comp)
        }
    })
}
export const MessageTypes = {
    server: "§7[§aSERVER§7]",
    warning: "§7[§c!§7]"
}
const cB = World.prototype.sendMessage
Object.defineProperties(World.prototype, {
    sendMessage: {
        value: function (message, type = "NA") {
            if (type === "NA") return cB.call(world, message)
            cB.call(world, `${MessageTypes[type]} ${message}`)
        }
    }
})

Object.defineProperties(Player.prototype, newProps)
Object.defineProperties(Entity.prototype, newProps)

Object.defineProperties(Number.prototype, {
    short: {
        get: function () {
            const number = this.valueOf();
            if (number === 0) return "0";

            const suffixes = ["", "k", "m", "b", "t", "q", "Q", "s", "S", "o", "n", "d", "U", "D", "T", "Qt", "Qd", "Sd", "Od", "Nd", "V", "Uv", "Dv"];
            const power = Math.floor(Math.log10(Math.abs(number)) / 3);
            const sign = number < 0 ? "-" : "";

            return sign + (Math.abs(number) / Math.pow(10, power * 3)).toFixed(2) + (suffixes[power] || "");
        }
    }
});
console.log = (...args) => console.warn.call(console, ...["§7[§cLOG§7]§r", ...args.map(e => typeof e === "object" ? JSON.stringify(e) : e)])
