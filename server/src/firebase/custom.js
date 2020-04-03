const firebase = require('./firebase');
let db = firebase.firestore().collection("games");

/*
Get the custom game settings from firestore
*/
async function get_setting(type, game, name) {
    return db.doc(type).collection(game).doc(name).get().then(doc => {
        if (doc.exists) {
            return doc.data();
        } else {
            console.log("Failed to get settings");
            return false;
        }
    }).catch((err) => {
        console.log('Error getting documents', err);
    });
}

/*
delete the setting in the firebase
 */
async function delete_setting(type, game, name) {
    return db.doc(type).collection(game).doc(name).delete();
}

/*
Check if the custom settings exceeds the max limits
and also check the percentage is summing up more than 1
if check finish, upload to firebase
else return false
*/
async function new_werewolf(name, data) {
    let sum = 0;

    if (data.nplayers > default_werewolf.max_number_of_players) {
        console.log("Cannot hold more than " + default_werewolf.max_number_of_players + " players in the room");
        data.nplayers = default_werewolf.max_number_of_players;
    }

    for (let element in data) {
        if (typeof (data[element]) == "object") {
            for (let k in data[element]) {
                if (k === "nplayers") {
                    if (data[element]["nplayers"] > default_werewolf.max_number_of_players) {
                        console.log("Cannot have so many players for this charactor");
                        return false;
                    }
                    sum += data[element]["nplayers"];
                }
            }
        }
    }

    if (sum > data.nplayers) {
        console.log("Sum of roles larger than the total number of players");
        return false;
    } else if (sum < data.nplayers) {
        data.nplayers = sum;
    }

    let role_names = new Set();
    for (let element in data) {
        if (typeof (data[element]) == "object") {
            role_names.add(element);
        }
    }
    for (let role of role_names){
        let checkedaction = new Set();
        for (let a of data[role]["actions"]) {
            if ((a === 'DOCTOR_SAVE' || a === 'SEER_REVEAL' || a === 'WEREWOLF_KILL_VOTE') && !checkedaction.has(a)) {
                checkedaction.add(a);
            } else {
                // console.log("Repeat action or action does not defined");
            }
        }
        data[role]["actions"] = Array.from(checkedaction);

        let checkedplayers = new Set();
        for (let i of data[role]["selectablePlayers"]){
            if ((role_names.has(i) || i === "ALL") && !(checkedplayers.has(i))){
                checkedplayers.add(i);
            } else {
                // console.log("Repeat role or role does not defined");
            }
        }
        data[role]["selectablePlayers"] = Array.from(checkedplayers);
        // console.log(data[role]["actions"]);
        // console.log(data[role]["selectablePlayers"]);
    }
    console.log("Checking finish uploading to the database");
    db.doc("role_game").collection("WEREWOLF").doc(name).set(data).catch((err) => {
        console.log('Error uploading', err);
    });
    return true;
}

/*
Set up the default game rules, including the limits
*/
async function set_default(type, game, data) {
    db.doc(type).collection(game).doc("default").set(data);
}

/*
add a new charactor in the setting profile, if exist, change the setting
 */
async function add_charactor(data, charactor, action, num, targets) {
    if (!(charactor in data)) {
        data[charactor] = {
            actions: action,
            nplayers: num,
            selectablePlayers: targets,
        };
        data.nplayers += num;
        return data;
    }
    return false;
}

/*
remove a charactor in the setting profile, if not exist return false
 */
async function remove_charactor(data, charactor) {
    if (charactor in data) {
        data.nplayers -= data[charactor].nplayers;
        delete data[charactor];
        return data;
    } else {
        return false;
    }
}

/*
change the setting of a charactor, if not exist then return false
 */
async function change_charactor(data, charactor, property, value) {
    if (charactor in data) {
        if (property === "nplayers") {
            let origin = data[charactor]["nplayers"];
            data.nplayers += (value - origin);
            console.log("original value:" + origin);
            data[charactor][property] += value;
        }
        data[charactor][property] = value;
        return data;
    } else {
        return false;
    }
}

/*
Default game rules settings and limits
*/
const default_werewolf = {
    max_number_of_players: 50,
    nplayers: 10,
    DOCTOR: {
        actions: ['DOCTOR_SAVE'],
        nplayers: 1,
        selectablePlayers: ["ALL"],
    },
    SEER: {
        actions: ['SEER_REVEAL'],
        nplayers: 1,
        selectablePlayers: ["DOCTOR", "WEREWOLF", "VILLAGER"],
    },
    WEREWOLF: {
        actions: ['WEREWOLF_KILL_VOTE'],
        nplayers: 3,
        selectablePlayers: ["DOCTOR", "SEER", "VILLAGER"],
    },
    VILLAGER: {
        actions: [],
        nplayers: 5,
        selectablePlayers: ["ALL"],
    }
};

module.exports = {
    get_setting,
    delete_setting,
    set_default,
    new_werewolf,
    add_charactor,
    remove_charactor,
    change_charactor,
    default_werewolf
};
