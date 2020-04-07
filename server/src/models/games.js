const games = {
    'ROCK_PAPER_SCISSORS' : require('./games/RockPaperScissorsGame'),
    'DRAWFUL' : require('./games/DrawfulGame'),
    'RUDE_CARDS' : require('./games/RudeCardsGame')
};

module.exports = games;