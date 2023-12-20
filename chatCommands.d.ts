type ArgumentType =  "boolean" | "number" | "string" | "any"

import { Player } from "@minecraft/server";
export class ChatCommand<T extends ArgumentType> {
    public constructor(
        command: string,
        description: string,
        expectedArguments: Record<string, T>,
        callback: (player: Player, recievedArguments: Record<string, T> ) => void,
        permission?: (player: Player) => boolean,
        aliases?: string[]
    );
}