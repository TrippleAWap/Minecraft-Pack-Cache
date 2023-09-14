import * as MC from "@minecraft/server";
import {Vector3} from "@minecraft/server";

// Extend the interface's
declare module "@minecraft/server" {
    interface Player {
        /**
         * Returns the distance between the player's head and the given coordinates.
         */
        distanceTo(x: number, y: number, z: number): Vector3
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

        data: {
            [component: <T>(this: T) => string]: any
        }
    }

    interface Entity {
        /**
         * Returns the distance between the entity and the given coordinates.
         */
        distanceTo(x: number, y: number, z: number): number;
        /** Allows you to manipulate the entity's score on the scoreboard with ease!
         *  @example entity.score["Money"] = 10;
         *  @example entity.score.Money = 10;
         */
        score: {
            [objective: string]: number;
        };
        /**
         * Returns the entity's block location. (returns the block position the entity is at)
         */
        blockLocation: {
            x: number;
            y: number;
            z: number;
        };
    }
}