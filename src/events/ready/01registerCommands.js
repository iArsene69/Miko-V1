const { testServer } = require('../../../config.json');
const areCommandsDifferent = require('../../utils/areCommandsDifferent');
const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client) => {
    try {
        const localCommands = getLocalCommands();
        const applicationCommands = await getApplicationCommands(client, testServer);

        for (const localCommand of localCommands) {
            const { name, description, options } = localCommand;

            const existingCommands = await applicationCommands.cache.find(
                (cmd) => cmd.name === name
            );

            if (existingCommands) {
                if (localCommand.deleted) {
                    await applicationCommands.delete(existingCommands.id);
                    console.log(`Deleted Command ${name}.`);
                    continue;
                }

                if (areCommandsDifferent(existingCommands, localCommand)) {
                    await applicationCommands.edit(existingCommands.id, {
                        description,
                        options,
                    });

                    console.log(`Edited Command ${name}.`);
                }
            } else {
                if (localCommand.deleted) {
                    console.log(`Skipping registering command ${name} as it's set to delete.`);
                    continue;
                }

                await applicationCommands.create({
                    name,
                    description,
                    options,
                });

                console.log(`Command ${name} was registered.`)
            }
        }

    } catch (error) {
        console.log(`You have an error registering command ${error}`);
    }
}