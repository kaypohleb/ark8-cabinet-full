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
    let percentage = 0;
    if (data.max_number_of_players > default_werewolf.max_number_of_players) {
        data.max_number_of_players = default_werewolf.max_number_of_players;
        console.log("Cannot hold more than " + default_werewolf.max_number_of_players + " players in the room");
    }
    if (data.min_number_of_players < default_werewolf.min_number_of_players) {
        data.min_number_of_players = default_werewolf.min_number_of_players;
        console.log("Cannot hold less than " + default_werewolf.min_number_of_players + " players in the room");
    }
    for (let element in data) {
        if (typeof (data[element]) == "object") {
            for (let k in data[element]) {
                if ("percent" == k) {
                    percentage += data[element]["percent"];
                }
            }
        }
    }
    if (percentage > 1) {
        console.log("Sum of percentages is larger than 1");
        return false;
    }

    for (let element in data) {
        if (typeof (data[element]) == "object") {
            for (let k in data[element]) {
                if ("actions" == k) {
                    let d = new Set(data[element]["actions"]);
                    data[element]["actions"] = Array.from(d);
                }
            }
        }
    }
    let nplayer = 0
    for (let element in data) {
        if (typeof (data[element]) == "object") {
            for (let k in data[element]) {
                if ("min" == k) {
                    nplayer += data[element]["min"];
                }
            }
        }
    }
    if (nplayer > default_werewolf.max_number_of_players){
        console.log("The min for each role is larger than total number of players")
        return false;
    }

    console.log("Checking finish uploading to the database");
    db.doc("role_game").collection("werewolf").doc(name).set(data).catch((err) => {
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
    } else {
        return false;
    }
}

async function change_charactor(data, charactor, property, value) {
    if (charactor in data) {
        data[charactor][property] = value;
        return data;
    } else {
        return false;
    }
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
