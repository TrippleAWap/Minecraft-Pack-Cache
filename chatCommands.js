import { world } from "@minecraft/server";


export class ChatCommand {
    static commands = [];
    static prefix = "."
    constructor(name, description, args, callback, permission = () => true, aliasses = []) {
        this.name = name;
        this.description = description;
        this.args = args;
        this.callback = callback;
        this.permission = permission;
        this.aliasses = aliasses;
        ChatCommand.commands.push({ name, description, args, callback, permission });
    }
}

world.beforeEvents.chatSend.subscribe((data) => {
    if (data.message[0] !== ChatCommand.prefix) return;
    data.cancel = true;
    const { sender: player } = data;
    const messageData = data.message.slice(1).match(/(?:[^\s"]+|"[^"]*")+/g)?.map(arg => arg.replace(/"/g, ""));
    if (!messageData) return player.sendMessage(`§cSyntax error: Unexpected end of input`);
    const [command, ...args] = messageData;
    /** @type {ChatCommand} */
    const cmd = ChatCommand.commands.find(cmd => cmd.name.toLowerCase() === command.toLowerCase()  || cmd.aliasses.find(alias => alias.toLowerCase() === command.toLowerCase())?.length > 0);
    if (!cmd) return player.sendMessage(`§cUnknown command: ${command}\n   Closest matches: ${ChatCommand.commands.filter(cmd => cmd.name.toLowerCase().includes(command.toLowerCase())).map(cmd => cmd.name).join(", ")}`);
    if (!cmd.permission(player)) return player.sendMessage(`§cYou do not have permission to use this command`);
    const keys = Object.keys(cmd.args);
    const entries = Object.entries(cmd.args);
    if (keys.length !== args.length) return player.sendMessage(`§cCorrect usage: .${cmd.name} ${entries.map(([arg, type]) => `<${arg}: ${type.toString()}>`).join(" ")}`);

    const parsedArgs = {};
    const incorrectTypes = entries.filter(([arg, type], index) => {
        try {
            switch (type) {
                case "boolean":
                    const bool = args[index].toLowerCase() === ("true" || "false" || "1" || "0" || "t" || "f" || "y" || "n" || "yes" || "no" || "on" || "off" || "enable" || "disable" || "enabled" || "disabled");
                    if (!bool) throw new Error("Not a boolean");
                    parsedArgs[arg] = bool;
                    break;
                case "number":
                    if (isNaN(args[index])) throw new Error("NaN");
                    parsedArgs[arg] = parseFloat(args[index]);
                    break;
                case "any":
                    const number = !isNaN(args[index]) ? parseFloat(args[index]) : null;
                    const boolean = args[index].toLowerCase() === ("true" || "false" || "1" || "0" || "t" || "f" || "y" || "n" || "yes" || "no" || "on" || "off" || "enable" || "disable" || "enabled" || "disabled");
                    if (number) {
                        parsedArgs[arg] = number;
                        break;
                    }
                    if (boolean) {
                        parsedArgs[arg] = args[index].toLowerCase() === ("true" || "1");
                        break;
                    }
                    parsedArgs[arg] = args[index];
                    break;
                default:
                    parsedArgs[arg] = args[index];
                    break;
            }
            return false;
        } catch (error) {
            return true;
        }
    });

    if (incorrectTypes?.length > 0)  {
        const errorWord = args[incorrectTypes.length];
        const textInFront = args.slice(0, incorrectTypes.length).join(" ");
        const textBehind = args.slice(incorrectTypes.length + 1).join(" ");
        return player.sendError(`§cSyntax error: Unexpected "${errorWord}": at "${textInFront.slice(textInFront.length - 9, textInFront.length)} >>${errorWord}<<${textBehind.slice(0, 9).length > 0 ? " " + textBehind.slice(0, 9) : ""}"\nCorrect usage: .${cmd.name} ${entries.map(([arg, type]) => `<${arg}: ${type.toString()}>`).join(" ")}`);  
    }
    const argCount = keys.length;



    // verify all argument types
    if (args.length > argCount) {
        const errorWord = args[argCount];
        const textInFront = args.slice(0, argCount).join(" ");
        const textBehind = args.slice(argCount + 1).join(" ");
        return player.sendError(`§cSyntax error: Unexpected "${errorWord}": at "${textInFront.slice(textInFront.length - 9, textInFront.length)} >>${errorWord}<<${textBehind.slice(0, 9).length > 0 ? " " + textBehind.slice(0, 9) : ""}"`);
    }

    for (let i = 0; i < args.length; i++) {
        parsedArgs[keys[i]] = args[i];
    }
    cmd.callback(player, parsedArgs);
});

new ChatCommand("help", "Lists all commands", {}, (player) => {
    const commands = ChatCommand.commands.map(cmd => `§e${cmd.name}§r - ${cmd.description}`).join("\n");
    player.sendMessage(`§aList of Commands:\n${commands}`);
});
