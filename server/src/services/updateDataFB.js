const axios = require("axios");
const mongoose = require("mongoose");
const { League, Season, Team, Standings, Event } = require("../models/sofaLeague");

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
  try {
    const leagues = await League.find();
    return leagues;
  } catch (error) {
    console.error("Error fetching leagues from database:", error);
    return [];
  }
}

async function updateDataFromAPI() {
  await mongoose.connect("mongodb://127.0.0.1:27017/newsDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    const leagues = await getLeaguesFromDatabase();

    await Promise.all(
      leagues.map(async (league) => {
        const lastSeason = await Season.findOne({
          leagueId: league._id,
        }).sort({ year: -1 });

        const standingsData = await getStandings(
          league.sofascoreId,
          lastSeason.sofascoreId
        );
        if (!standingsData) {
          return;
        }

        const { standings, updatedAtTimestamp } = standingsData;

        // Kiểm tra nếu updatedAtTimestamp cũ hơn 15 ngày
        const updatedAtDate = new Date(updatedAtTimestamp * 1000);
        const currentDate = new Date();
        const daysDifference = Math.floor(
          (currentDate - updatedAtDate) / (1000 * 60 * 60 * 24)
        );

        if (daysDifference > 15) {
          console.log(
            `Mùa giải ${lastSeason.name} cho giải đấu ${league.name} đã không được cập nhật trong 15 ngày qua. Bỏ qua cập nhật.`
          );
          return;
        }

        await updateTeamsAndStandings(league, lastSeason, standings.rows);
        await updateEvents(league, lastSeason, lastSeason.sofascoreId);
        console.log(
          `Cập nhật Mùa giải ${lastSeason.name} cho giải đấu ${league.name}`
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
  await mongoose.connect("mongodb://127.0.0.1:27017/newsDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const leagues = await getLeagues();
  await Promise.all(leagues.map(processLeague));
  console.log("Updated league");

  await mongoose.disconnect();
}

async function processLeague(league) {
  const dbLeague = await updateLeague(league);
  const allSeasons = await getSeasons(league.id);

  const dbSeason = await updateSeason(dbLeague, allSeasons[0]);
  await updateTeams(league.id, allSeasons[0].id, dbLeague._id);
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

// Lấy data về League, Season, Team màu giải gần nhất
// updateInitialData();

// Lấy thông tin về bảng xếp hạng và lịch thi đấu tương ứng
// updateDataFromAPI();
