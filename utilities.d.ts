import * as MC from "@minecraft/server";
import * as MCUI from "@minecraft/server-ui"

export type MessageTypes = {
    server: "§7[§aSERVER§7]",
    warning: "§7[§c!§7]"
}
// Extend the interface's
declare module "@minecraft/server" {
    interface World {
        sendMessage<T extends keyof MessageTypes>(message: string, type?: T): void;
    }
    interface Player {
        /**
         * Returns the distance between the player's head and the given coordinates.
         */
        distanceTo(x: number, y: number, z: number): MC.Vector3
        /** Allows you to manipulate the player's score on the scoreboard with ease!
         *  @example player.score["Money"] = 10;
         *  @example player.score.Money = 10;
         */
        score: Record<string, number>;
        /**
         * Returns the player's block location. (returns the block position the player is at)
         */
        blockLocation: {
            x: number;
            y: number;
            z: number;
        };
        sendMessage<T extends keyof MessageTypes>(message: string, type?: T): void;
    }

    interface Entity {
        /**
         * Returns the distance between the entity's head and the given coordinates.
         */
        distanceTo(x: number, y: number, z: number): MC.Vector3
        /** Allows you to manipulate the entity's score on the scoreboard with ease!
         *  @example entity.score["Money"] = 10;
         *  @example entity.score.Money = 10;
         */
        score: Record<string, number>;
        /**
         * Returns the entity's block location. (returns the block position the entity is at)
         */
        blockLocation: {
            x: number;
            y: number;
            z: number;
        };
        sendMessage<T extends keyof MessageTypes>(message: string, type?: T): void;
    }
}

declare module "@minecraft/server-ui" {
     class ActionFormData {
         /**
          * @param forceShow
          * Whether to force show the form to the player. (default: false)
          * @param overrideForce
          * Whether to override the current form trying to force show. (default: false)
          */
        show(player: MC.Player, forceShow?: boolean, overrideForce?: boolean): Promise<MCUI.ActionFormResponse>;
        button(text: string, iconPath?: string, callback?: (player: MC.Player) => void): MCUI.ActionFormData;
    }
     class ModalFormData {
         /**
          * @param forceShow
          * Whether to force show the form to the player. (default: false)
          * @param overrideForce
          * Whether to override the current form trying to force show. (default: false)
          */
        show(player: MC.Player, forceShow?: boolean, overrideForce?: boolean): Promise<MCUI.ModalFormResponse>;
    }
     class MessageFormData {
         /**
          * @param forceShow
          * Whether to force show the form to the player. (default: false)
          * @param overrideForce
          * Whether to override the current form trying to force show. (default: false)
          */
        show(player: MC.Player, forceShow?: boolean, overrideForce?: boolean): Promise<MCUI.MessageFormResponse>;
    }
}

declare global {
    interface Number {
        /**
         * Returns the number as a string with a suffix. (e.g. 1000 -> 1k)
         */
        get short(): string;
    }

    interface Console {
        disabled?: boolean;
    }
}
