import { ActionFormData } from '@minecraft/server-ui';
import {world} from "@minecraft/server";

const sizes = new Map([
	['single', [`§c§h§e§s§t§s§m§a§l§l§r`, 27, 3, 9]], ['double', [`§c§h§e§s§t§l§a§r§g§e§r`, 54, 6, 9]],
	['small', [`§c§h§e§s§t§s§m§a§l§l§r`, 27, 3, 9]], ['large', [`§c§h§e§s§t§l§a§r§g§e§r`, 54, 6, 9]]
]);

class ChestFormData extends ActionFormData {
	#titleText; buttonArray; callbacks = {};
	constructor(size = 'small') {
		super();
		const sizing = sizes.get(size) ?? [`§c§h§e§s§t§s§m§a§l§l§r`, 27];
		super.title(sizing[0])

		this.sizing = sizing;
		/** @internal */
		this.#titleText = sizing[0];
		this.buttonArray = [];
		for (let i = 0; i < sizing[1]; i++)
			this.buttonArray.push(['', undefined]);
		return this;
	}
	title(text) {
		super.title(`${this.#titleText}${text}`)
		return this;
	}
	button(slot, itemName, itemDesc, iconPath, stackSize = 1, callback) {
		this.buttonArray[slot] = [`${'stack#' + (Math.max(stackSize, 1) < 10 ? '0' : '') + Math.min(Math.max(stackSize, 1), 99).toString()}§r${itemName ?? ''}§r${itemDesc?.length ? `\n§o§5${itemDesc.join('\n§o§5')}` : ''}`, iconPath];
		this.callbacks[slot] = callback;
		return this;
	}

	async show(player) {

		this.buttonArray.forEach(button => {
			super.button(button[0], button[1]);
		})
		const result = await super.show(player)
		const selectedButton = this.patternCache.buttonInfo[result.selection]
		result.patternButton = !!this.patternCache.buttonInfo[result.selection];
		if (selectedButton?.callback) selectedButton.callback(player, result.selection);
		if (this.callbacks[result.selection]) result.returnedCallback = this.callbacks[result.selection](player, result.selection);
		// run callback if it exists | patternCache values will have a callback property
		return result;
	}
	/**
	 * 
	 * @param {Array<string>} pattern 
	 * @param { key: { name: string, desc: string[], icon: string, stack: number} } values 
	 * @returns 
	 */
	pattern(pattern, values) {
		const buttonInfo = [];
		const r = this.sizing[2], c = this.sizing[3];
		if (pattern.length !== r) throw new Error(`Pattern length must be ${r}`)
		for (let i = 0; i < pattern.length; i++) {
			if (pattern[i].length !== c) throw new Error(`Pattern[${i}] width must be ${c}`)
		}
		// create a button for each pattern
		for (let i = 0; i < pattern.length; i++) {
			for (let j = 0; j < pattern[i].length; j++) {
				if (!values[pattern[i][j]]) continue;
				buttonInfo[i * c + j] = values[pattern[i][j]];
				this.button(i * c + j, values[pattern[i][j]].name, values[pattern[i][j]].desc, values[pattern[i][j]].icon, values[pattern[i][j]].stack);
			}
		}
		this.patternCache = { pattern, values, buttonInfo };
		return this
	}
	/**
	 * @param {number} minX The minimum X coordinate
	 * @param {number} minY The minimum Y coordinate
	 * @param {number} maxX The maximum X coordinate
	 * @param {number} maxY The maximum Y coordinate
	 * @param {function(buttonIndex, loopIndex)} callback The function to execute for each button index (buttonIndex, loopIndex
	 */
	grid(minX, minY, maxX, maxY, callback = (buttonIndex, loopIndex) => {}) {
		let l = 0;
		for (let i = minY; i <= maxY; i++) {
			for (let j = minX; j <= maxX; j++) {
				callback(i * this.sizing[3] + j, l);
				++l;
			}
		}
	}
}

export { ChestFormData };