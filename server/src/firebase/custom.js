const firebase = require('./firebase');

// var serviceAccount = require("./serviceAccountKey.json");
// firebase.initializeApp({
//   credential: firebase.credential.cert(serviceAccount),
//   databaseURL: "https://ark8-cabinet.firebaseio.com"
// });

let db = firebase.firestore().collection("games");

/* 
Get the custom game settings from firestore 
*/
async function get_setting(type, game, name) {
    let settings = db.doc(type).collection(game).doc(name).get().then(doc => {
        if (doc.exists) {
            return doc.data();
        } else {
            console.log("Failed to get settings");
            return false;
        }
    }).catch((err) => {
        console.log('Error getting documents', err);
    });
    return settings;
}

async function delete_setting(type, game, name) {
    let deleteDoc = db.doc(type).collection(game).doc(name).delete();
    return deleteDoc;
}

/*
Check if the custom settings exceeds the max limits 
and also check the percentage is summing up more than 1
if check finish, upload to firebase
else return Promise {false}
*/
async function new_werewolf(name, data) {
    let success = get_data("role_game", "werewolf", "default").then(default_data => {
        let percent = 0;
        if (data.max_number_of_players > default_data.max_number_of_players) {
            data.max_number_of_players = default_data.max_number_of_players;
            console.log("Cannot hold more than " + default_data.max_number_of_players + " players in the room");
        }
        if (data.min_number_of_players < default_data.min_number_of_players) {
            data.min_number_of_players = default_data.min_number_of_players;
            console.log("Cannot hold less than " + default_data.min_number_of_players + " players in the room");
        }
        for (let key in data) {
            if (typeof (data[key]) == "object") {
                if ("percent" in data[key]) {
                    percent += data[key]["percent"];
                    if (percent > 1) {
                        return false;
                    }
                }
            }
            if (key in default_data) {
                if (typeof (data[key]) != typeof (default_data[key])) {
                    data[key] = default_data[key];
                } else if (typeof (data[key]) == "object") {
                    for (var key1 in data[key]) {
                        if (key1 == "max" && data[key][key1] > default_data[key][key1]) {
                            data[key][key1] = default_data[key][key1];
                        } else if (key1 == "min" && data[key][key1] < default_data[key][key1]) {
                            data[key][key1] = default_data[key][key1];
                        } else if (key1 == "actions") {
                            let d = new Set(data[key][key1]);
                            data[key][key1] = Array.from(d);
                        }
                    }
                }
            }
        }
        return true;
    }).catch((err) => {
        console.log('Error checking the new settings', err);
    }).then(s => {
        if (s) {
            console.log("Checking finish uploading to the database");
            db.doc("role_game").collection("werewolf").doc(name).set(data);
        } else {
            console.log("Sum of percentages is larger than 1");
        }
        return s;
    })
    return success;
}

/*
Set up the default game rules, including the limits
*/
async function set_default(type, game, data) {
    db.doc(type).collection(game).doc("default").set(data);
}

async function add_charactor(data, charactor, minimun, maximum, action, percentage) {
    data[charactor] = {
        min: minimun,
        max: maximum,
        actions: action,
        percent: percentage
    }
    return data;
}

async function remove_charactor(data, charactor) {
    if (charactor in data) {
        delete data[charactor];
        return data;
    }
}

async function change_charactor(data, charactor, property, value) {
    if (charactor in data) {
        data[charactor][property] = value;
    }
    return data;
}

/*
Default game rules settings and limits
*/
const default_werewolf =
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

module.exports = {
    get_setting,
    delete_setting,
    set_default,
    new_werewolf,
    add_charactor,
    remove_charactor,
    change_charactor,
    default_werewolf
}
