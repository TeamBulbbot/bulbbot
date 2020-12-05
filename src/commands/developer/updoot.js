const Infraction = require("../../models/infraction")

module.exports = {
    name: "updoot",
    category: "developer",
    description: "",
    usage: "",
    clientPermissions: [],
    userPermissions: [],
    clearanceLevel: 0,
    run: async (client, message, _args) => {
        let developers = process.env.DEVELOPERS.split(",");

        if (developers.includes(message.author.id)) {
            Infraction.find({}, function (err, doc) {
                for (let i = 0; i < doc.length; i++) {
                    Infraction.collection.update({_id: doc[i]._id}, {$set: {"infID": (i + 1)}})
                }
            })


            return message.channel.send("Successfully added 'infID' filed to all documents")
        }
    },
};
