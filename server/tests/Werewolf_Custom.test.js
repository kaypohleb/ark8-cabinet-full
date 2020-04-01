const custom = require("../src/firebase/custom");

test("Test deletee default setting", async () => {
    await custom.delete_setting("role_game", "WEREWOLF", "default");
});

test("Test delete the setting that does not exist", async () => {
    await custom.delete_setting("role_game", "WEREWOLF", "asdfasdfasdfa");
});

test("Test get default setting", async () => {
    await custom.get_setting("role_game", "WEREWOLF", "default").then(setting => {
        expect(setting).toEqual(custom.default_werewolf);
    });
});

test("Test get setting that does not exist", async () => {
    await custom.get_setting("role_game", "WEREWOLF", "asdfasdfasdfa").then(setting => {
        expect(setting).toBe(false);
    });
});

test("Add charactor test", async () => {
    var werewolf1 =
        {
            nplayers: 12,
            SEER: {
                actions: ['SEER_REVEAL'],
                nplayers: 1,
                selectablePlayers: ["DOCTOR", "WEREWOLF", "VILLAGER"],
            },
        };
    var werewolf2 =
        {
            nplayers: 14,
            SEER: {
                actions: ['SEER_REVEAL'],
                nplayers: 1,
                selectablePlayers: ["DOCTOR", "WEREWOLF", "VILLAGER"],
            },
            test: {
                actions: ["SEER_REVEAL"],
                nplayers: 2,
                selectablePlayers: ["DOCTOR"],
            }
        };
    await custom.add_charactor(werewolf1, "test", ["SEER_REVEAL"], 2, ["DOCTOR"]).then(s => {
        expect(s).toEqual(werewolf2);
    });
});

test("Add charactor that is already exist", async () => {
    var werewolf3 =
        {
            nplayers: 12,
            SEER: {
                actions: ['SEER_REVEAL'],
                nplayers: 1,
                selectablePlayers: ["DOCTOR", "WEREWOLF", "VILLAGER"],
            },
        };
    await custom.add_charactor(werewolf3, "SEER", ["SEER_REVEAL"], 1, ["SEER"]).then(s => {
        expect(s).toBe(false);
    });
});

test("Remove charactor test", async () => {
    var werewolf5 =
        {
            nplayers: 12,
            SEER: {
                actions: ['SEER_REVEAL'],
                nplayers: 1,
                selectablePlayers: ["DOCTOR", "WEREWOLF", "VILLAGER"],
            },
        };
    var werewolf6 =
        {
            nplayers: 11,
        };
    await custom.remove_charactor(werewolf5, "SEER").then(x => {
        expect(x).toEqual(werewolf6);
    });
});

test("Remove charactor that is not exist", async () => {
    var werewolf7 =
        {
            nplayers: 12,
            SEER: {
                actions: ['SEER_REVEAL'],
                nplayers: 1,
                selectablePlayers: ["DOCTOR", "WEREWOLF", "VILLAGER"],
            },
        };
    await custom.remove_charactor(werewolf7, "asdfadsfasd").then(x => {
        expect(x).toBe(false);
    });
});

test("Change charactor that is not exist", async () => {
    var werewolf8 =
        {
            nplayers: 12,
            SEER: {
                actions: ['SEER_REVEAL'],
                nplayers: 1,
                selectablePlayers: ["DOCTOR", "WEREWOLF", "VILLAGER"],
            },
        };
    await custom.change_charactor(werewolf8, "asdfadsfasdf", "nplayers", 30).then(s => {
        expect(s).toBe(false);
    });
});

test("Change charactor test", async () => {
    var werewolf9 =
        {
            nplayers: 10,
            SEER: {
                actions: ['SEER_REVEAL'],
                nplayers: 1,
                selectablePlayers: ["DOCTOR", "WEREWOLF", "VILLAGER"],
            },
        };

    var werewolf10 =
        {
            nplayers: 39,
            SEER: {
                actions: ['SEER_REVEAL'],
                nplayers: 30,
                selectablePlayers: ["DOCTOR", "WEREWOLF", "VILLAGER"],
            },
        };
    await custom.change_charactor(werewolf9, "SEER", "nplayers", 30).then(s => {
        expect(s).toEqual(werewolf10);
    });
});

test("Change charactor test 2", async () => {
    var werewolf11 =
        {
            nplayers: 12,
            SEER: {
                actions: ['SEER_REVEAL'],
                nplayers: 1,
                selectablePlayers: ["DOCTOR", "WEREWOLF", "VILLAGER"],
            },
        };

    var werewolf12 =
        {
            nplayers: 12,
            SEER: {
                actions: ['SEER_REVEAL'],
                nplayers: 1,
                selectablePlayers: ["DOCTOR", "WEREWOLF"],
            },
        };
    await custom.change_charactor(werewolf11, "SEER", "selectablePlayers", ["DOCTOR", "WEREWOLF"]).then(s => {
        expect(s).toEqual(werewolf12);
    });
});

test("New werewolf game setting upload and get test", async () => {
    let data = await custom.add_charactor(custom.default_werewolf, "test", ['SEER_REVEAL'], 3, ["DOCTOR", "WEREWOLF"]);
    let success = await custom.new_werewolf("test", data);
    expect(success).toBe(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await custom.get_setting("role_game", "WEREWOLF", "test").then(x => {
        expect(x).toEqual(data);
    });
});

test("New werewolf game sum up all nplayers > total pleyers", async () => {
    var werewolf14 =
        {
            nplayers: 12,
            SEER: {
                actions: ['SEER_REVEAL'],
                nplayers: 1,
                selectablePlayers: ["SEER"],
            },
        };
    let data = await custom.add_charactor(werewolf14, "test", ['SEER_REVEAL'], 60, ["SEER"]);
    let success = await custom.new_werewolf("test", data).then(s => {
        expect(s).toBe(false);
    });
});

test("New werewolf with more than max and less than min and it is able to correct some of the unsuitable values", async () => {
    let werewolf13 =
        {
            max_number_of_players: 50,
            nplayers: 10,
            DOCTOR: {
                actions: ['DOCTOR_SAVE','DOCTOR_SAVE','DOCTOR_SAVE','DOCTOR_SAVE'],
                nplayers: 1,
                selectablePlayers: ["ALL", "ALL","ALL"]
            },
            SEER: {
                actions: ['SEER_REVEAL'],
                nplayers: 1,
                selectablePlayers: ["DOCTOR", "WEREWOLF", "VILLAGER"],
            },
            WEREWOLF: {
                actions: ['WEREWOLF_KILL_VOTE'],
                nplayers: 3,
                selectablePlayers: ["DOCTOR", "SEER", "VILLAGER"]
            },
            VILLAGER: {
                actions: [],
                nplayers: 5,
                selectablePlayers: ["ALL"]
            }
        };
    werewolf13.nplayers = 60;
    werewolf13.DOCTOR.actions = ['DOCTOR_SAVE','DOCTOR_SAVE','DOCTOR_SAVE','DOCTOR_SAVE'];
    werewolf13.DOCTOR.selectablePlayers = ["ALL","ALL","ALL","ALL"];
    werewolf13.SEER.actions = ['SEER_REVEAL',"test","test","test"];
    werewolf13.SEER.selectablePlayers = ["DOCTOR", "WEREWOLF", "VILLAGER", "test","test","test","test"];
    await custom.new_werewolf("test", werewolf13).then(s => {
        expect(s).toBe(true);
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await custom.get_setting("role_game", "WEREWOLF", "test").then(s => {
        expect(s.max_number_of_players).toEqual(custom.default_werewolf.max_number_of_players);
        expect(s.DOCTOR.actions).toEqual(custom.default_werewolf.DOCTOR.actions);
        expect(s.DOCTOR.selectablePlayers).toEqual(custom.default_werewolf.DOCTOR.selectablePlayers);
        expect(s.SEER.actions).toEqual(custom.default_werewolf.SEER.actions);
        expect(s.SEER.selectablePlayers).toEqual(custom.default_werewolf.SEER.selectablePlayers);
    })
});

beforeEach(async (done) => {
    await custom.delete_setting("role_game", "WEREWOLF", "default");
    await custom.delete_setting("role_game", "WEREWOLF", "test");
    await custom.set_default("role_game", "WEREWOLF", custom.default_werewolf);
    await new Promise(resolve => setTimeout(resolve, 1000));
    done();
});