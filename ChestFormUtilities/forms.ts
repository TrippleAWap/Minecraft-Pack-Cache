import {ActionFormData} from '@minecraft/server-ui';
import {Player} from "@minecraft/server";

const sizes = new Map([
    ['single', [`§c§h§e§s§t§s§m§a§l§l§r`, 27, 3, 9]], ['double', [`§c§h§e§s§t§l§a§r§g§e§r`, 54, 6, 9]],
    ['small', [`§c§h§e§s§t§s§m§a§l§l§r`, 27, 3, 9]], ['large', [`§c§h§e§s§t§l§a§r§g§e§r`, 54, 6, 9]]
]);
class ChestFormData extends ActionFormData {
    protected readonly titleText: string | number; buttonArray: (number | string[])[]; callbacks = {}; patternCache: { buttonInfo: any; pattern?: any; values?: any; };
    protected readonly sizing: (string | number)[];
    constructor(size = 'small') {
        super();
        const sizing = sizes.get(size) ?? [`§c§h§e§s§t§s§m§a§l§l§r`, 27];
        // @ts-ignore
        super.title(sizing[0])

        this.sizing = sizing;
        /** @internal */
        this.titleText = sizing[0];
        this.buttonArray = [];
        // @ts-ignore
        for (let i = 0; i < sizing[1]; i++)
            this.buttonArray.push(['', undefined]);
        return this;
    }
    // @ts-ignore
     title(text: string) {
        return this;
    }
    // @ts-ignore
    button(slot: number, itemName: string, itemDesc: string[], iconPath: string, stackSize = 1, callback: (player: Player, buttonIndex: number) => void = () => {}) {
        return this;
    }

    async show(player: Player) {
        this.buttonArray.forEach((button: number) => {
            super.button(button[0], button[1]);
        })
        return await super.show(player);
    }
    pattern(pattern: string[], values: { [key: string]: { name: string; desc: string[]; icon: string; stack: number; callback?: (player: Player, buttonIndex: number) => void; }; }) {
    }
    grid(minX: number, minY: number, maxX: number, maxY: number, callback?: (buttonIndex: number, loopIndex: number) => void) {

    }
}

export { ChestFormData };