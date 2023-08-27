/**
  This is most dynamic and auto updating! Only thing required to manually update may be types! If types arent changed functionality shouldn't change either!
  Listed below is 2 custom enchants for reference!
  ---------------------------------------------------------------------------------------------------------------------
  const poison = new CustomEnchant("Poison");
  
  poison.on.entityHitEntity(({ damagingEntity: player, hitEntity: target, enchant }) => {
      if ((player[enchant.name] ?? 0) + 3000 > Date.now()) return;
      player[enchant.name] = Date.now();
      target.addEffect(`poison`, enchant.level * 20, { showParticles: true, amplifier: 3 });
  })
  
  poison.init();
  
  const brutality = new CustomEnchant("Brutality");
  
  brutality.on.entityHitEntity(({ damagingEntity: player, hitEntity: target, enchant }) => {
      world.sendMessage(`§a§lINFO: §r§aBrutality hit ${target.typeId} for ${enchant.level * 0.3} damage`)
      target.applyDamage(enchant.level * 0.3, { damagingEntity: player, cause: "entityAttack" });
  })
  
  brutality.init();
  
  system.runInterval(() => {
      const players = world.getAllPlayers()
      for (const player of players) {
          const inv = player.getComponent("minecraft:inventory").container
          const item = inv.getItem(player.selectedSlot);
          if (!item) continue;
          let updatedItem = poison.addToItem(item);
          updatedItem = brutality.addToItem(updatedItem, 100);
          updatedItem = fixLore(updatedItem);
          if (updatedItem) inv.setItem(player.selectedSlot, updatedItem);
      }
  })
  
  
  const fixLore = (item) => {
      const lore = item.getLore();
      // sort from longest to shortest
      lore.sort((a, b) => b.length - a.length);
      item.setLore(lore);
      return item;
  }
*/

import {Player, system, world} from "@minecraft/server";

const singulators = {
    enchantPrefix: "§e§n§c§a§n§t§r§b",
    enchantSplitter: "§s§p§l§i§t§t§e§r : §7"
};
export class CustomEnchant {
    constructor(name) {
        this.name = name;
        this.callbacks = {};
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
            world.sendMessage(`§a§lINFO: §r§aInitializing event ${event} for enchantment ${this.name}`);
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
