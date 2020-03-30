const custom = require("../src/firebase/custom");

test("Test deletee default setting", async () => {
    await custom.delete_setting("role_game", "werewolf", "default");
});

test("Test delete the setting that does not exist", async () => {
    await custom.delete_setting("role_game", "werewolf", "asdfasdfasdfa");
});

test("Test get default setting", async () => {
    await custom.get_setting("role_game", "werewolf", "default").then(setting => {
        expect(setting).toEqual(custom.default_werewolf);
    });
});

test("Test get setting that does not exist", async () => {
    await custom.get_setting("role_game", "werewolf", "asdfasdfasdfa").then(setting => {
        expect(setting).toBe(false);
    });
});

test("Add charactor test", async () => {
    var werewolf1 =
    {
        seer: {
            actions: ['vote', 'kill'],
            max: 5,
            min: 1,
            percent: 0.2
        }
    }
    var werewolf2 =
    {
        seer: {
            actions: ['vote', 'kill'],
            max: 5,
            min: 1,
            percent: 0.2
        }
    }
    await custom.add_charactor(werewolf1, "test", 4, 10, ["test1", "test2"], 0.1).then(s => {
        werewolf2["test"] = {
            min: 4,
            max: 10,
            actions: ["test1", "test2"],
            percent: 0.1
        };
        expect(s).toEqual(werewolf2);
    });
});

test("Add charactor that is already exist", async () => {
    var werewolf3 =
    {
        seer: {
            actions: ['vote', 'kill'],
            max: 5,
            min: 1,
            percent: 0.2
        }
    }
    var werewolf4 =
    {
        seer: {
            actions: ['vote', 'kill'],
            max: 5,
            min: 1,
            percent: 0.2
        }
    }
    await custom.add_charactor(werewolf3, "seer", 4, 10, ["test1", "test2"], 0.1).then(s => {
        expect(s).not.toEqual(werewolf4);
    });
});

test("Remove charactor test", async () => {
    var werewolf5 =
    {
        seer: {
            actions: ['vote', 'kill'],
            max: 5,
            min: 1,
            percent: 0.2
        }
    }
    var werewolf6 =
    {
        seer: {
            actions: ['vote', 'kill'],
            max: 5,
            min: 1,
            percent: 0.2
        }
    }
    await custom.remove_charactor(werewolf5, "seer").then(x => {
        delete werewolf6["seer"];
        expect(x).toEqual(werewolf6);
    });
});

test("Remove charactor that is not exist", async () => {
    var werewolf7 =
    {
        seer: {
            actions: ['vote', 'kill'],
            max: 5,
            min: 1,
            percent: 0.2
        }
    }
    await custom.remove_charactor(werewolf7, "asdfadsfasd").then(x => {
        expect(x).toBe(false);
    });
});

test("Change charactor that is not exist", async () => {
    var werewolf8 =
    {
        seer: {
            actions: ['vote', 'kill'],
            max: 5,
            min: 1,
            percent: 0.2
        }
    }
    await custom.change_charactor(werewolf8, "asdfadsfasdf", "max", 30).then(s => {
        expect(s).toBe(false);
    });
});

test("Change charactor test", async () => {
    var werewolf9 =
    {
        seer: {
            actions: ['vote', 'kill'],
            max: 5,
            min: 1,
            percent: 0.2
        }
    }
    var werewolf10 =
    {
        seer: {
            actions: ['vote', 'kill'],
            max: 5,
            min: 1,
            percent: 0.2
        }
    }
    await custom.change_charactor(werewolf9, "seer", "max", 30).then(s => {
        werewolf10.seer.max = 30;
        expect(s).toEqual(werewolf10);
    });
});

test("New werewolf game setting upload and get test", async () => {
    let data = await custom.add_charactor(custom.default_werewolf, "test", 4, 10, ["test1", "test2"], 0);
    let success = await custom.new_werewolf("test", data);
    expect(success).toBe(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await custom.get_setting("role_game", "werewolf", "test").then(x => {
        expect(x).toEqual(data);
    });
});

test("New werewolf game percentage > 1", async () => {
    let data = await custom.add_charactor(custom.default_werewolf, "test", 4, 10, ["test1", "test2"], 0.1);
    let success = await custom.new_werewolf("test", data).then(s => {
        expect(s).toBe(false);
    });
});

test("New werewolf sum of min > max_number_of_players", async () => {
    let data = await custom.add_charactor(custom.default_werewolf, "test", 60, 10, ["test1", "test2"], 0);
    let success = await custom.new_werewolf("test", data).then(s => {
        expect(s).toBe(false);
    });
});

test("New werewolf with more than max and less than min and it is able to correct some of the unsuitable values", async () => {
    let werewolf11 =
    {
        max_number_of_players: 50,
        min_number_of_players: 5,
        doctor: {
            actions: ['vote', 'cure'],
            max: 5,
            min: 1,
            percent: 0.2
        }
    }
    werewolf11.max_number_of_players = 100;
    werewolf11.min_number_of_players = 1;
    werewolf11.doctor.actions = ["vote", 'cure', 'cure', 'cure'];
    await custom.new_werewolf("test", werewolf11).then(s => {
        expect(s).toBe(true);
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await custom.get_setting("role_game", "werewolf", "test").then(s => {
        expect(s.max_number_of_players).toEqual(custom.default_werewolf.max_number_of_players);
        expect(s.min_number_of_players).toEqual(custom.default_werewolf.min_number_of_players);
        expect(s.doctor.actions).toEqual(custom.default_werewolf.doctor.actions);
    })
});

beforeEach(async (done) => {
    await custom.delete_setting("role_game", "werewolf", "default");
    await custom.delete_setting("role_game", "werewolf", "test");
    await custom.set_default("role_game", "werewolf", custom.default_werewolf);
    await new Promise(resolve => setTimeout(resolve, 1000));
    done();
});