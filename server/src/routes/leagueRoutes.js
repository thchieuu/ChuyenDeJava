const express = require("express");
const router = express.Router();
const leagueController = require("../controllers/leagueController");

router.get("/leagues", leagueController.getLeagues);
router.get("/leagues/:leagueId", leagueController.getLeagueById);

router.get("/seasons", leagueController.getSeasons);
router.get("/seasons/:seasonId", leagueController.getSeasonById);

router.get("/leagues/:leagueId/seasons/:seasonId/standings", leagueController.getStandingsBySeason);

router.get("/leagues/:leagueId/seasons/:seasonId/matches", leagueController.getMatches);
router.get("/leagues/:leagueId/seasons/:seasonId/round/:round", leagueController.getMatchesByRound);
router.get("/teams/:teamId/matches", leagueController.getMatchesByTeam);
router.get("/events/:eventId", leagueController.getMatchDetails);
router.put("/events/:eventId", leagueController.updateMatch);

module.exports = router;