const custom = require("../src/firebase/custom");

test("Test get with no such doc", async () => {
    custom.delete_setting("role_game", "werewolf", "default").then(() => {
        expect(custom.get_setting("role_game", "werewolf", "default")).toBe(false);
    })
})

test("Test get setting funtion", async () => {
        expect(custom.get_setting("role_game", "werewolf", "none")).toBe(false);
})

test("Test set default and get default", async () => {
    custom.delete_setting("role_game", "werewolf", "default").then(() => {
        custom.set_default("role_game", "werewolf", custom.default_werewolf).then(() => {
            expect(custom.get_setting("role_game", "werewolf", "default")).toBe(custom.default_werewolf);
        })
    })
})

test("Add charactor test", async () => {
    custom.add_charactor(custom.default_werewolf, "test", 4, 10, ["test1", "test2"], 0.1).then(s => {
        werewolf["test"] = {
            min: 4,
            max: 10,
            actions: ["test1", "test2"],
            percent: 0.1
        };
        expect(s).toStrictEqual(werewolf);
    })
});

test("Remove charactor test", async () => {
    custom.add_charactor(custom.default_werewolf, "test", 4, 10, ["test1", "test2"], 0.1).then(s => {
        custom.remove_charactor(s, "test").then(x => {
            expect(x).toStrictEqual(werewolf);
        })
    })
});

test("Change charactor test", async () => {
    custom.change_charactor(custom.default_werewolf, "seer", "max", 30).then(s => {
        werewolf["seer"]["max"] = 30;
        expect(s).toStrictEqual(werewolf);
    })
});

test("New werewolf game setting upload and get test", async () => {
    custom.add_charactor(custom.default_werewolf, "test", 4, 10, ["test1", "test2"], 0.1).then(s => {
        custom.new_werewolf("test", s).then(t => {
            if (t) {
                custom.get_setting("role_game", "werewolf", "test").then(x => {
                    expect(x).toBe(s);
                })
            } else {
                throw new Error("Failed to get settings");
            }
        })
    })
});


werewolf =
{
    max_number_of_players: 50,
    min_number_of_players: 5,
    doctor: {
        actions: ['vote', 'cure'],
        max: 5,
        min: 1,
        percent: 0.2
    },
    seer: {
        actions: ['vote', 'kill'],
        max: 5,
        min: 1,
        percent: 0.2
    },
    walf: {
        actions: ['vote', 'kill'],
        max: 10,
        min: 2,
        percent: 0.2
    },
    villeger:
    {
        actions: ['vote'],
        max: 47,
        min: 2,
        percent: 0.4
    }
}