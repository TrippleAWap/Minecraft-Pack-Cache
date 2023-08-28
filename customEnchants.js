/**
    Example Code Below
    import { system, world } from "@minecraft/server";
    import { CustomEnchant } from "./customEnchants.js";
    
    const poison = new CustomEnchant("Poison");
    
    poison.on.entityHitEntity(({ damagingEntity: player, hitEntity: target, enchant }) => {
        if ((player[enchant.name] ?? 0) + 3000 > Date.now()) return;
        player[enchant.name] = Date.now();
        target.addEffect("fatal_poison", enchant.level * 20, { showParticles: true, amplifier: enchant.level * 0.3 + 3})
    })
    
    poison.init();
    
    const brutality = new CustomEnchant("Brutality");
    
    brutality.on.entityHitEntity(({ damagingEntity: player, hitEntity: target, enchant }) => {
        target.applyDamage(enchant.level * 0.3, { damagingEntity: player, cause: "entityAttack" });
    })
    
    brutality.init();
    
    system.runInterval(() => {
        const players = world.getAllPlayers()
        for (const player of players) {
            const inv = player.getComponent("minecraft:inventory").container
            const item = inv.getItem(player.selectedSlot);
            if (!item) continue;
            const updatedItem = item.setCustomEnchantment("Poison", 100).setCustomEnchantment("Brutality", 1);
            if (updatedItem) inv.setItem(player.selectedSlot, updatedItem);
        }
    })
*/

import {ItemStack, system, world} from "@minecraft/server";

console.warn(`Custom Enchants Initialized | .trippleawap.`) // to keep the script from lagging on start ( wont lag at all with out this but you might get a slow running script warningg when the script initializes ( first event executes ) )

const singulators = {
    enchantPrefix: "§e§n§c§a§n§t§r§b",
    enchantSplitter: "§s§p§l§i§t§t§e§r : §7"
};
const enchants = []
export class CustomEnchant {
    constructor(name) {
        this.name = name;
        this.callbacks = {};
        enchants.push(this);
    }

    get on() {
        // return super
        return new Proxy(this, {
            get: (target, prop) => {
                if (!world.afterEvents[prop]) {
                    if (prop === "tick") {
                        return callback => {
                            (this.callbacks[prop] ??= []).push(callback);
                        }
                    }
                    world.sendMessage(`§c§lERROR: §r§cEvent ${prop} does not exist!`);
                    throw new Error(`Event ${prop} does not exist!`);
                }
                return (callback) => {
                    (this.callbacks[prop] ??= []).push(callback);
                };
            }
        });
    }
    addToItem(item, level = 1) {
        const lore = item.getLore();
        if (lore.some((l) => {
            const [name, level] = l.replace(singulators.enchantPrefix, '').split(singulators.enchantSplitter);
            return name === this.name;

        })) {
            const index = lore.findIndex((l) => {
                const [name, level] = l.replace(singulators.enchantPrefix, '').split(singulators.enchantSplitter);
                return name === this.name;

            });
            lore[index] = `${singulators.enchantPrefix}${this.name}${singulators.enchantSplitter}${level}`;
            item.setLore(lore);
            return item;
        }
        lore.push(`${singulators.enchantPrefix}${this.name}${singulators.enchantSplitter}${level}`);
        item.setLore(lore);
        return item;
    }
    init() {
        for (const event of Object.keys(this.callbacks)) {
            if (event === "tick") continue;
            world.afterEvents[event].subscribe((data) => {
                const source = data[sourceFromEvent.find((s) => data[s])];
                const item = source.getComponent("minecraft:inventory").container.getItem(source.selectedSlot);
                if (!item) return;
                const enchantment = getEnchantments(item).find((enchant) => enchant.name === this.name);
                if (!enchantment) return;
                Object.assign(data, { enchant: enchantment });
                for (const callback of this.callbacks[event]) {
                    callback(data);
                }
            })
        }
        system.runInterval(() => {
            for (const player of world.getAllPlayers()) {
                const item = player.getComponent("minecraft:inventory").container.getItem(player.selectedSlot);
                if (!item) continue;
                const enchants = getEnchantments(item);
                for (const { name, level } of enchants) {
                    const enchantment = enchants.find((e) => e.name === name);
                    if (!enchantment) continue;
                    for (const callback of (this.callbacks.tick ?? [])) {
                        enchantment.level = level;
                        Object.assign(player, { enchant: enchantment });
                        callback(player);
                    }
                }
            }
        })
    }
}

const sourceFromEvent = [
    "source",
    "player",
    "damagingEntity"
]

const getEnchantments = (item) => {
    return item.getLore().filter((line) => line.startsWith(singulators.enchantPrefix)).reduce((acc, line) => {
        const [name, level] = line.replace(singulators.enchantPrefix, '').split(singulators.enchantSplitter);
        acc.push({ name, level });
        return acc; // Return the accumulator
    }, []); // Initialize with an empty array
}

ItemStack.prototype.setCustomEnchantment =  function (name, level = 1) {
    if (!enchants.some((e) => e.name === name)) throw new Error(`Enchantment ${name} does not exist!`);
    const lore = this.getLore();
    if (lore.some((l) => {
        const [_, level] = l.replace(singulators.enchantPrefix, '').split(singulators.enchantSplitter);
        return _ === name;
    })) {
        const index = lore.findIndex((l) => {
            const [_, level] = l.replace(singulators.enchantPrefix, '').split(singulators.enchantSplitter);
            return _ === name;
        });
        lore[index] = `${singulators.enchantPrefix}${name}${singulators.enchantSplitter}${level}`;
        lore.sort((a, b) => b.length - a.length);
        this.setLore(lore);
        return this;
    }
    lore.push(`${singulators.enchantPrefix}${name}${singulators.enchantSplitter}${level}`);
    lore.sort((a, b) => b.length - a.length);
    this.setLore(lore);
    return this;
}
ItemStack.prototype.removeCustomEnchantment = function (name) {
    const lore = this.getLore();
    if (!lore.some((l) => {
        const [_, level] = l.replace(singulators.enchantPrefix, '').split(singulators.enchantSplitter);
        return _ === name;
    })) return this;
    const index = lore.findIndex((l) => {
        const [name, level] = l.replace(singulators.enchantPrefix, '').split(singulators.enchantSplitter);
        return name === name;

    });
    lore.splice(index, 1);
    lore.sort((a, b) => b.length - a.length);
    this.setLore(lore);
    return this;
}
ItemStack.prototype.getCustomEnchantment = function (name) {
    const lore = this.getLore();
    if (!lore.some((l) => {
        const [_, level] = l.replace(singulators.enchantPrefix, '').split(singulators.enchantSplitter);
        return _ === name;
    })) return null;
    const index = lore.findIndex((l) => {
        const [name, level] = l.replace(singulators.enchantPrefix, '').split(singulators.enchantSplitter);
        return name === name;

    });
    const [_, level] = lore[index].replace(singulators.enchantPrefix, '').split(singulators.enchantSplitter);
    return { name: _, level: Number(level) };
}
ItemStack.prototype.getCustomEnchantments = function () {
    const lore = this.getLore();
    return lore.filter((line) => line.startsWith(singulators.enchantPrefix)).reduce((acc, line) => {
        const [name, level] = line.replace(singulators.enchantPrefix, '').split(singulators.enchantSplitter);
        acc.push({ name, level });
        return acc; // Return the accumulator
    }, []); // Initialize with an empty array
}

