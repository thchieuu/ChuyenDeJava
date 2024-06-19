const axios = require("axios");
const mongoose = require("mongoose");
const {
  League,
  Season,
  Team,
  Standings,
  Event,
} = require("../models/sofaLeague");

const instance = axios.create({
  timeout: 60000, // 60 seconds
});

async function getSeasons(leagueId) {
  try {
    const response = await instance.get(
      `https://api.sofascore.com/api/v1/unique-tournament/${leagueId}/seasons`
    );
    return response.data.seasons;
  } catch (error) {
    console.error("Error fetching seasons:", error);
    return [];
  }
}

async function getStandings(leagueId, seasonId) {
  try {
    const response = await instance.get(
      `https://api.sofascore.com/api/v1/unique-tournament/${leagueId}/season/${seasonId}/standings/total`
    );
    return {
      standings: response.data.standings[0], // Chỉ lấy phần duy nhất trong mảng standings
      updatedAtTimestamp: response.data.updatedAtTimestamp,
    };
  } catch (error) {
    console.error("Lỗi khi lấy standings:", error);
    return null;
  }
}

async function getLeagues() {
  try {
    const response = await instance.get(
      `https://api.sofascore.com/api/v1/config/unique-tournaments`
    );
    const leagues = response.data.uniqueTournaments.filter((league) => {
      return (
        league.category.sport.name === "Football" &&
        (league.name === "Premier League" ||
          league.name === "LaLiga" ||
          league.name === "Serie A" ||
          league.name === "Bundesliga")
      );
    });
    return leagues;
  } catch (error) {
    console.error("Error fetching leagues:", error);
    return [];
  }
}

async function getEventsByRound(leagueId, seasonId, round) {
  try {
    const response = await instance.get(
      `https://api.sofascore.com/api/v1/unique-tournament/${leagueId}/season/${seasonId}/events/round/${round}`
    );
    return response.data.events;
  } catch (error) {
    console.error(`Error fetching events for round ${round}:`, error);
    return [];
  }
}

async function getLeaguesFromDatabase() {
  await mongoose.connect("mongodb://127.0.0.1:27017/news", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    const leagues = await League.find();
    console.log(leagues);
    return leagues;
  } catch (error) {
    console.error("Error fetching leagues from database:", error);
    return [];
  }
}

function filterSeasons(seasons) {
  const currentYear = new Date().getFullYear();
  return seasons.filter((season) => {
    const seasonYear = parseInt(season.year.split("/")[0]) + 2000;
    return seasonYear >= 2022 && seasonYear <= currentYear + 1;
  });
}

async function updateDataFromAPI() {
  await mongoose.connect("mongodb://127.0.0.1:27017/news", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    const leagues = await getLeaguesFromDatabase();

    await Promise.all(
      leagues.map(async (league) => {
        const allSeasons = await Season.find({
          leagueId: league._id,
        });
        const filteredSeasons = filterSeasons(allSeasons);

        await Promise.all(
          filteredSeasons.map(async (season) => {
            const dbSeason = season;

            const standingsData = await getStandings(
              league.sofascoreId,
              season.sofascoreId
            );
            if (!standingsData) {
              return;
            }

            const { standings, updatedAtTimestamp } = standingsData;

            await updateTeamsAndStandings(league, dbSeason, standings.rows);
            await updateEvents(league, dbSeason, season.sofascoreId);
            console.log(
              `Cập nhật Mùa giải ${season.name} cho giải đấu ${league.name}`
            );
          })
        );
      })
    );
  } finally {
    await mongoose.disconnect();
  }
}

async function updateTeamsAndStandings(league, dbSeason, rows) {
  const bulkOps = rows.map((row) => ({
    updateOne: {
      filter: { sofascoreId: row.team.id },
      update: {
        $setOnInsert: {
          name: row.team.name,
          leagueId: league._id,
          logo: `https://api.sofascore.app/api/v1/team/${row.team.id}/image`,
          type: "club",
          sofascoreId: row.team.id,
        },
      },
      upsert: true,
    },
  }));

  await Team.bulkWrite(bulkOps);

  const dbStandings = await Standings.findOne({
    leagueId: league._id,
    seasonId: dbSeason._id,
  });

  const standingsRows = await Promise.all(
    rows.map(async (row) => {
      const dbTeam = await Team.findOne({ sofascoreId: row.team.id });
      return {
        teamId: dbTeam._id,
        position: row.position,
        played: row.matches,
        won: row.wins,
        drawn: row.draws,
        lost: row.losses,
        goalFors: row.scoresFor,
        goalsAgainst: row.scoresAgainst,
        goalDifference: row.scoresFor - row.scoresAgainst,
        points: row.points,
      };
    })
  );

  if (dbStandings) {
    dbStandings.standings = standingsRows;
    await dbStandings.save();
  } else {
    const newStandings = new Standings({
      leagueId: league._id,
      seasonId: dbSeason._id,
      standings: standingsRows,
    });
    await newStandings.save();
  }
}

async function updateEvents(league, dbSeason, seasonId) {
  const totalRounds = league.name === "Bundesliga" ? 34 : 38;
  for (let round = 1; round <= totalRounds; round++) {
    const events = await getEventsByRound(league.sofascoreId, seasonId, round);
    for (const event of events) {
      await updateEvent(league, dbSeason, event);
    }
  }
}

async function updateEvent(league, season, eventData) {
  const homeTeam = await Team.findOne({ sofascoreId: eventData.homeTeam.id });
  const awayTeam = await Team.findOne({ sofascoreId: eventData.awayTeam.id });

  if (!homeTeam || !awayTeam) {
    console.error(`Team not found for event ${eventData.id}`);
    return;
  }

  const eventUpdate = {
    leagueId: league._id,
    seasonId: season._id,
    round: eventData.roundInfo.round,
    homeTeamId: homeTeam._id,
    awayTeamId: awayTeam._id,
    startTimestamp: eventData.startTimestamp,
    status: eventData.status.type,
    homeScore: eventData.homeScore.display,
    awayScore: eventData.awayScore.display,
    sofascoreId: eventData.id,
  };

  await Event.findOneAndUpdate({ sofascoreId: eventData.id }, eventUpdate, {
    upsert: true,
    new: true,
  });
}

async function updateInitialData() {
  await mongoose.connect("mongodb://127.0.0.1:27017/news", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const leagues = await getLeagues();
  await Promise.all(leagues.map(processLeague));
  console.log("update success");

  await mongoose.disconnect();
}

async function processLeague(league) {
  const dbLeague = await updateLeague(league);
  const allSeasons = await getSeasons(league.id);
  const filteredSeasons = filterSeasons(allSeasons);

  for (const season of filteredSeasons) {
    const dbSeason = await updateSeason(dbLeague, season);
    await updateTeams(league.id, season.id, dbLeague._id);
  }
}

async function updateLeague(league) {
  return League.findOneAndUpdate(
    { sofascoreId: league.id },
    {
      name: league.name,
      country: league.category.name,
      sofascoreId: league.id,
    },
    { upsert: true, new: true }
  );
}

async function updateSeason(dbLeague, season) {
  return Season.findOneAndUpdate(
    { leagueId: dbLeague._id, sofascoreId: season.id },
    {
      leagueId: dbLeague._id,
      name: season.name,
      year: season.year,
      sofascoreId: season.id,
    },
    { upsert: true, new: true }
  );
}

async function updateTeams(leagueId, seasonId, dbLeagueId) {
  const standingsData = await getStandings(leagueId, seasonId);
  if (!standingsData) return;

  const { rows } = standingsData.standings;
  const bulkOps = rows.map((row) => ({
    updateOne: {
      filter: { sofascoreId: row.team.id },
      update: {
        $setOnInsert: {
          name: row.team.name,
          leagueId: dbLeagueId,
          logo: `https://api.sofascore.app/api/v1/team/${row.team.id}/image`,
          type: "club",
          sofascoreId: row.team.id,
        },
      },
      upsert: true,
    },
  }));

  await Team.bulkWrite(bulkOps);
}

// Lấy data về League, Season, Team từ 2022 trở lại
// updateInitialData();

// Lấy thông tin về bảng xếp hạng và lịch thi đấu tương ứng
// updateDataFromAPI();
