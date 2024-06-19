const {
  League,
  Season,
  Team,
  Standings,
  Event,
} = require("../models/sofaLeague");

// Lấy danh sách các giải đấu
exports.getLeagues = async (req, res) => {
  try {
    const leagues = await League.find();
    res.json(leagues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getLeagueById = async (req, res) => {
  try {
    const leagueId = req.params.leagueId;
    const league = await League.findById(leagueId)

    if (!league) {
      return res.status(404).json({ message: "Giải đấu không tồn tại" });
    }

    res.json(league);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getSeasons = async (req, res) => {
  try {
    const seasons = await Season.find();
    res.json(seasons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getSeasonById = async (req, res) => {
  try {
    const seasonId = req.params.seasonId;
    const seasons = await Season.findById(seasonId).populate("leagueId");
    res.json(seasons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy bảng xếp hạng của một mùa giải
exports.getStandingsBySeason = async (req, res) => {
  try {
    const leagueId = req.params.leagueId;
    const seasonId = req.params.seasonId;

    const league = await League.findById(leagueId);
    if (!league) {
      return res.status(404).json({ message: "Giải đấu không tồn tại" });
    }

    const season = await Season.findOne({ leagueId, _id: seasonId });
    if (!season) {
      return res.status(404).json({ message: "Mùa giải không tồn tại" });
    }

    const standings = await Standings.findOne({ leagueId, seasonId })
      .populate("standings.teamId")
      .populate("seasonId");

    if (!standings) {
      return res.status(404).json({ message: "Bảng xếp hạng không tồn tại" });
    }

    res.json(standings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy thông tin chi tiết của một giải đấu
exports.getLeagueDetails = async (req, res) => {
  try {
    const leagueId = req.params.leagueId;
    const league = await League.findById(leagueId)
      .populate("leagueId")
      .populate("seasonId");

    if (!league) {
      return res.status(404).json({ message: "Giải đấu không tồn tại" });
    }

    res.json(league);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy lịch thi đấu của một mùa giải
exports.getMatches = async (req, res) => {
  try {
    const leagueId = req.params.leagueId;
    const seasonId = req.params.seasonId;

    const league = await League.findById(leagueId);
    if (!league) {
      return res.status(404).json({ message: "Giải đấu không tồn tại" });
    }

    const season = await Season.findOne({ leagueId, _id: seasonId });
    if (!season) {
      return res.status(404).json({ message: "Mùa giải không tồn tại" });
    }

    const events = await Event.find({ leagueId, seasonId })
      .populate("homeTeamId")
      .populate("awayTeamId");
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getMatchesByRound = async (req, res) => {
  try {
    const leagueId = req.params.leagueId;
    const seasonId = req.params.seasonId;
    const round = req.params.round;

    const events = await Event.find({ leagueId, seasonId, round })
      .populate("homeTeamId")
      .populate("awayTeamId");
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy thông tin chi tiết của một trận đấu
exports.getMatchDetails = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = await Event.findById(eventId)
      .populate("homeTeamId")
      .populate("awayTeamId");
    if (!event) {
      return res.status(404).json({ message: "Trận đấu không tồn tại" });
    }
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy lịch thi đấu của một đội bóng
exports.getMatchesByTeam = async (req, res) => {
  try {
    const teamId = req.params.teamId;
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Đội bóng không tồn tại" });
    }

    const events = await Event.find({
      $or: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
    })
      .populate("homeTeamId")
      .populate("awayTeamId");
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Cập nhật tỷ số và trạng thái của trận đấu
exports.updateMatch = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { homeScore, awayScore, status } = req.body;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Trận đấu không tồn tại" });
    }
    event.homeScore = homeScore;
    event.awayScore = awayScore;
    event.status = status;
    await event.save();
    res.json({ message: "Cập nhật tỷ số và trạng thái thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
