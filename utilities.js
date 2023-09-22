import * as MC from "@minecraft/server"
import * as MCUI from "@minecraft/server-ui"
let scoreboards = {}

const sendMessage = MC.Player.prototype.sendMessage

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
                        return (scoreboards[key] ??= MC.world.scoreboard.getObjective(key)).getScore(player) ?? 0;
                    } catch {
                        return 0;
                    }
                },
                set(target, key, value) {
                    try {
                        (scoreboards[key] ??= MC.world.scoreboard.getObjective(key)).setScore(player, value)
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
    sendMessage: {
        value: function (message, type = "NA") {
            if (type === "NA") return sendMessage.call(this, message)
            sendMessage.call(this, `${MessageTypes[type]} ${message}`)
        }
    }
}
const MessageTypes = {
    server: "§7[§aSERVER§7]",
    warning: "§7[§c!§7]"
}
const cB = MC.World.prototype.sendMessage
Object.defineProperties(MC.World.prototype, {
    sendMessage: {
        value: function (message, type = "NA") {
            if (type === "NA") return cB.call(MC.world, message)
            cB.call(MC.world, `${MessageTypes[type]} ${message}`)
        }
    }
})

Object.defineProperties(MC.Player.prototype, newProps)
Object.defineProperties(MC.Entity.prototype, newProps)


// Region Form Show Overrides -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const showCB = MCUI.ActionFormData.prototype.show
const buttonCB = MCUI.ActionFormData.prototype.button
Object.defineProperties(MCUI.ActionFormData.prototype, {
    show: {
        value: async function (player, forceShow = false, overrideForce = false) {
            let res
            MC.system.run(async () => {
                if (overrideForce) player.currentForm = undefined;
                if (player.currentForm !== undefined && player.currentForm !== this) return;
                player.currentForm = this
                res = await showCB.call(this, player);
                if (res.cancelationReason === "UserBusy") this.show(player, forceShow, overrideForce)
                player.currentForm = undefined
                const callback = this.callbacks[res.selection]
                if (callback && callback !== undefined) callback(player, res.selection)
            })
            return res
        }
    },
    button: {
        value: function (text, iconPath = null, callback = undefined) {
            MC.system.run(() => {
                (this.callbacks ??= {})[this.buttonCount ??= 0] = callback
                this.buttonCount++
                buttonCB.call(this, text, iconPath)
            })
            return this
        }
    }
})

const showCB2 = MCUI.ModalFormData.prototype.show
Object.defineProperties(MCUI.ModalFormData.prototype, {
    show: {
        value: async function (player, forceShow = false, overrideForce = false) {
            if (overrideForce) player.currentForm = undefined;
            if (player.currentForm !== undefined && player.currentForm !== this) return;
            player.currentForm = this
            const res = await showCB2.call(this, player)
            if (res.cancelationReason === "UserBusy") this.show(player, forceShow, overrideForce)
            return res
        }
    }
})

const showCB3 = MCUI.MessageFormData.prototype.show
Object.defineProperties(MCUI.MessageFormData.prototype, {
    show: {
        value: async function (player, forceShow = false, overrideForce = false) {
            if (overrideForce) player.currentForm = undefined;
            if (player.currentForm !== undefined && player.currentForm !== this) return;
            player.currentForm = this
            const res = await showCB3.call(this, player)
            if (res.cancelationReason === "UserBusy") this.show(player, forceShow, overrideForce)
            return res
        }
    }
})

// End Region Form Show Overrides -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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

const savedCB = console.warn;
console.warn = (...args) => {
    if (console.disabled) return;
    savedCB.call(console, ...args)
}
