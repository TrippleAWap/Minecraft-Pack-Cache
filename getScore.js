import { Entity } from "@minecraft/server";
const cache = {}

/**
 * @param {Entity | String} target The target to get the score of ( can be a string, or an entity instance )
 * @param {String | String[]} objective The objective to get the score of
 *
 * @returns {Number | Object} The score of the objective, or an object containing all scores for all objectives
 *
 * @example getScore("player", "kills") // returns the value of the kills objective for the player ( 0 if not set )
 *
 * @example getScore("player", ["kills", "deaths"]) // returns an object containing the values of the kills and deaths objectives for the player
 */

const getScore = (target, objective) => {
    if (typeof objective === "string") try {
        return (cache[objective] ??= world.scoreboard.getObjective(objective))?.getScore(target) || 0
    } catch {
        return 0;
    }
    // get all scores for all objectives
    return objective.reduce((acc, cur) => {
        try {
            var obj = (cache[cur] ??= world.scoreboard.getObjective(cur))
            acc[cur] = obj.getScore(target);
        } catch {
            acc[cur] = 0;
        }
        return acc;
    }, {})
}
