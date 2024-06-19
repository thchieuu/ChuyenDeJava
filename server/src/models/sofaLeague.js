const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa schema cho League
const leagueSchema = new Schema({
  name: { type: String, required: true, unique: true },
  country: { type: String, required: true },
  sofascoreId: { type: Number, required: true, unique: true },
});

// Định nghĩa schema cho Season
const seasonSchema = new Schema({
  leagueId: { type: mongoose.Schema.Types.ObjectId, ref: 'League', required: true },
  name: { type: String, required: true },
  year: { type: String, required: true },
  sofascoreId: { type: Number, required: true, unique: true },
});

// Định nghĩa schema cho Team
const teamSchema = new Schema({
  name: { type: String, required: true, unique: true },
  leagueId: { type: mongoose.Schema.Types.ObjectId, ref: 'League', required: true},
  logo: String,
  type: { type: String, enum: ['club', 'national', 'other'] },
  sofascoreId: { type: Number, required: true, unique: true }
});

// Định nghĩa schema cho Standings
const standingsSchema = new Schema({
  leagueId: { type: mongoose.Schema.Types.ObjectId, ref: 'League', required: true },
  seasonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Season' , required: true},
  standings: [{
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    position: Number,
    played: { type: Number, default: 0 },
    won: { type: Number, default: 0 },
    drawn: { type: Number, default: 0 },
    lost: { type: Number, default: 0 },
    goalFors: { type: Number, default: 0 },
    goalsAgainst: { type: Number, default: 0 },
    goalDifference: { type: Number, default: 0 },
    points: { type: Number, default: 0 }
  }]
});

const eventSchema = new mongoose.Schema({
  leagueId: { type: mongoose.Schema.Types.ObjectId, ref: 'League' },
  seasonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Season' },
  round: Number,
  homeTeamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  awayTeamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  startTimestamp: Number,
  status: String,
  homeScore: Number,
  awayScore: Number,
  sofascoreId: Number
});

const Event = mongoose.model('Event', eventSchema);
const League = mongoose.model('League', leagueSchema);
const Season = mongoose.model('Season', seasonSchema);
const Team = mongoose.model('Team', teamSchema);
const Standings = mongoose.model('Standings', standingsSchema);

module.exports = { League, Season, Team, Standings, Event };
