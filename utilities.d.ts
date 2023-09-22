import * as MC from "@minecraft/server";
import {ActionFormData, ActionFormResponse, MessageFormResponse, ModalFormResponse,} from "@minecraft/server-ui";
export type EntityComponents = {
    'addrider': MC.EntityAddRiderComponent
    'ageable': MC.EntityAgeableComponent
    'breathable': MC.EntityBreathableComponent
    'can_climb': MC.EntityCanClimbComponent
    'can_fly': MC.EntityCanFlyComponent
    'can_power_jump': MC.EntityCanPowerJumpComponent
    'color': MC.EntityColorComponent
    "equippable": MC.EntityEquippableComponent
    'fire_immune': MC.EntityFireImmuneComponent
    'floats_in_liquid': MC.EntityFloatsInLiquidComponent
    'flying_speed': MC.EntityFlyingSpeedComponent
    'friction_modifier': MC.EntityFrictionModifierComponent
    'ground_offset': MC.EntityGroundOffsetComponent
    'healable': MC.EntityHealableComponent
    'health': MC.EntityHealthComponent
    'inventory': MC.EntityInventoryComponent
    'is_baby': MC.EntityIsBabyComponent
    'is_charged': MC.EntityIsChargedComponent
    'is_chested': MC.EntityIsChestedComponent
    'is_hidden_when_invisible': MC.EntityIsHiddenWhenInvisibleComponent
    'is_ignited': MC.EntityIsIgnitedComponent
    'is_illager_captain': MC.EntityIsIllagerCaptainComponent
    'is_saddled': MC.EntityIsSaddledComponent
    'is_shaking': MC.EntityIsShakingComponent
    'is_sheared': MC.EntityIsShearedComponent
    'is_stackable': MC.EntityIsStackableComponent
    'is_stunned': MC.EntityIsStunnedComponent
    'is_tamed': MC.EntityIsTamedComponent
    'item': MC.EntityItemComponent
    'lava_movement': MC.EntityLavaMovementComponent
    'leashable': MC.EntityLeashableComponent
    'mark_variant': MC.EntityMarkVariantComponent
    'minecraft:addrider': MC.EntityAddRiderComponent
    'minecraft:ageable': MC.EntityAgeableComponent
    'minecraft:breathable': MC.EntityBreathableComponent
    'minecraft:can_climb': MC.EntityCanClimbComponent
    'minecraft:can_fly': MC.EntityCanFlyComponent
    'minecraft:can_power_jump': MC.EntityCanPowerJumpComponent
    'minecraft:color': MC.EntityColorComponent
    "minecraft:equippable": MC.EntityEquippableComponent
    'minecraft:fire_immune': MC.EntityFireImmuneComponent
    'minecraft:floats_in_liquid': MC.EntityFloatsInLiquidComponent
    'minecraft:flying_speed': MC.EntityFlyingSpeedComponent
    'minecraft:friction_modifier': MC.EntityFrictionModifierComponent
    'minecraft:ground_offset': MC.EntityGroundOffsetComponent
    'minecraft:healable': MC.EntityHealableComponent
    'minecraft:health': MC.EntityHealthComponent
    'minecraft:inventory': MC.EntityInventoryComponent
    'minecraft:is_baby': MC.EntityIsBabyComponent
    'minecraft:is_charged': MC.EntityIsChargedComponent
    'minecraft:is_chested': MC.EntityIsChestedComponent
    'minecraft:is_hidden_when_invisible': MC.EntityIsHiddenWhenInvisibleComponent
    'minecraft:is_ignited': MC.EntityIsIgnitedComponent
    'minecraft:is_illager_captain': MC.EntityIsIllagerCaptainComponent
    'minecraft:is_saddled': MC.EntityIsSaddledComponent
    'minecraft:is_shaking': MC.EntityIsShakingComponent
    'minecraft:is_sheared': MC.EntityIsShearedComponent
    'minecraft:is_stackable': MC.EntityIsStackableComponent
    'minecraft:is_stunned': MC.EntityIsStunnedComponent
    'minecraft:is_tamed': MC.EntityIsTamedComponent
    'minecraft:item': MC.EntityItemComponent
    'minecraft:lava_movement': MC.EntityLavaMovementComponent
    'minecraft:leashable': MC.EntityLeashableComponent
    'minecraft:mark_variant': MC.EntityMarkVariantComponent
    'minecraft:movement': MC.EntityMovementComponent
    'minecraft:movement.amphibious': MC.EntityMovementAmphibiousComponent
    'minecraft:movement.basic': MC.EntityMovementBasicComponent
    'minecraft:movement.fly': MC.EntityMovementFlyComponent
    'minecraft:movement.generic': MC.EntityMovementGenericComponent
    'minecraft:movement.glide': MC.EntityMovementGlideComponent
    'minecraft:movement.hover': MC.EntityMovementHoverComponent
    'minecraft:movement.jump': MC.EntityMovementJumpComponent
    'minecraft:movement.skip': MC.EntityMovementSkipComponent
    'minecraft:movement.sway': MC.EntityMovementSwayComponent
    'minecraft:navigation.climb': MC.EntityNavigationClimbComponent
    'minecraft:navigation.float': MC.EntityNavigationFloatComponent
    'minecraft:navigation.fly': MC.EntityNavigationFlyComponent
    'minecraft:navigation.generic': MC.EntityNavigationGenericComponent
    'minecraft:navigation.hover': MC.EntityNavigationHoverComponent
    'minecraft:navigation.walk': MC.EntityNavigationWalkComponent
    'minecraft:push_through': MC.EntityPushThroughComponent
    'minecraft:rideable': MC.EntityRideableComponent
    'minecraft:scale': MC.EntityScaleComponent
    'minecraft:skin_id': MC.EntitySkinIdComponent
    'minecraft:strength': MC.EntityStrengthComponent
    'minecraft:tameable': MC.EntityTameableComponent
    'minecraft:tamemount': MC.EntityMountTamingComponent
    'minecraft:underwater_movement': MC.EntityUnderwaterMovementComponent
    'minecraft:variant': MC.EntityVariantComponent
    'minecraft:wants_jockey': MC.EntityWantsJockeyComponent
    'movement': MC.EntityMovementComponent
    'movement.amphibious': MC.EntityMovementAmphibiousComponent
    'movement.basic': MC.EntityMovementBasicComponent
    'movement.fly': MC.EntityMovementFlyComponent
    'movement.generic': MC.EntityMovementGenericComponent
    'movement.glide': MC.EntityMovementGlideComponent
    'movement.hover': MC.EntityMovementHoverComponent
    'movement.jump': MC.EntityMovementJumpComponent
    'movement.skip': MC.EntityMovementSkipComponent
    'movement.sway': MC.EntityMovementSwayComponent
    'navigation.climb': MC.EntityNavigationClimbComponent
    'navigation.float': MC.EntityNavigationFloatComponent
    'navigation.fly': MC.EntityNavigationFlyComponent
    'navigation.generic': MC.EntityNavigationGenericComponent
    'navigation.hover': MC.EntityNavigationHoverComponent
    'navigation.walk': MC.EntityNavigationWalkComponent
    'push_through': MC.EntityPushThroughComponent
    'rideable': MC.EntityRideableComponent
    'scale': MC.EntityScaleComponent
    'skin_id': MC.EntitySkinIdComponent
    'strength': MC.EntityStrengthComponent
    'tameable': MC.EntityTameableComponent
    'tamemount': MC.EntityMountTamingComponent
    'underwater_movement': MC.EntityUnderwaterMovementComponent
    'variant': MC.EntityVariantComponent
    'wants_jockey': MC.EntityWantsJockeyComponent
}

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

        getComponent<T extends keyof EntityComponents>(componentId: T): EntityComponents[T]
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

        getComponent<T extends keyof EntityComponents>(componentId: T): EntityComponents[T]
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
        show(player: MC.Player, forceShow?: boolean, overrideForce?: boolean): Promise<ActionFormResponse>;
        button(text: string, iconPath?: string, callback?: (player: MC.Player) => void): ActionFormData;
    }
     class ModalFormData {
         /**
          * @param forceShow
          * Whether to force show the form to the player. (default: false)
          * @param overrideForce
          * Whether to override the current form trying to force show. (default: false)
          */
        show(player: MC.Player, forceShow?: boolean, overrideForce?: boolean): Promise<ModalFormResponse>;
    }
     class MessageFormData {
         /**
          * @param forceShow
          * Whether to force show the form to the player. (default: false)
          * @param overrideForce
          * Whether to override the current form trying to force show. (default: false)
          */
        show(player: MC.Player, forceShow?: boolean, overrideForce?: boolean): Promise<MessageFormResponse>;
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
