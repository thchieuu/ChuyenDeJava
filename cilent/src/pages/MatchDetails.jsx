import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from "../components/Footer";

function MatchDetails() {
    const premierLeagueId = '6676668594c0e3aa215f4c47';
    const season2425Id = '6676668694c0e3aa215f4c4e';

    const [leagues, setLeagues] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [matches, setMatches] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState(premierLeagueId);
    const [selectedSeason, setSelectedSeason] = useState(season2425Id);
    const [selectedRound, setSelectedRound] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeagues = async () => {
            try {
                const response = await axios.get('http://localhost:7000/api/leagues');
                setLeagues(response.data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchLeagues();
    }, []);

    useEffect(() => {
        if (selectedLeague) {
            const fetchSeasons = async () => {
                try {
                    const response = await axios.get(`http://localhost:7000/api/seasons?leagueId=${selectedLeague}`);
                    setSeasons(response.data);
                } catch (err) {
                    setError(err.message);
                }
            };

            fetchSeasons();
        }
    }, [selectedLeague]);

    useEffect(() => {
        if (selectedSeason) {
            const fetchMatches = async () => {
                setLoading(true);
                try {
                    const response = await axios.get(`http://localhost:7000/api/leagues/${selectedLeague}/seasons/${selectedSeason}/matches`);
                    setMatches(response.data);
                    setLoading(false);
                } catch (err) {
                    setError(err.message);
                    setLoading(false);
                }
            };

            fetchMatches();
        }
    }, [selectedLeague, selectedSeason]);

    useEffect(() => {
        if (selectedRound) {
            const fetchMatchesByRound = async () => {
                setLoading(true);
                try {
                    const response = await axios.get(`http://localhost:7000/api/leagues/${selectedLeague}/seasons/${selectedSeason}/round/${selectedRound}`);
                    setMatches(response.data);
                    setLoading(false);
                } catch (err) {
                    setError(err.message);
                    setLoading(false);
                }
            };

            fetchMatchesByRound();
        }
    }, [selectedLeague, selectedSeason, selectedRound]);

    return (
        <div>
            <Header />
            <div className="container mt-5" style={{ paddingLeft: "150px", paddingRight: "150px" }}>
                <h1>Kết Quả Trận Đấu</h1>
                {error && <p className="text-danger">{error}</p>}

                <div className="d-flex align-items-center">
                    <div className="form-group mr-3">
                        <label htmlFor="leagueSelect">Chọn Giải Đấu</label>
                        <select
                            id="leagueSelect"
                            className="form-control"
                            value={selectedLeague}
                            onChange={(e) => {
                                setSelectedLeague(e.target.value);
                                setSelectedSeason('');
                                setSelectedRound('');
                                setMatches([]);
                            }}
                        >
                            <option value="">Chọn Giải Đấu</option>
                            {leagues.map((league) => (
                                <option key={league._id} value={league._id}>
                                    {league.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedLeague && (
                        <div className="form-group mr-3">
                            <label htmlFor="seasonSelect">Chọn Mùa Giải</label>
                            <select
                                id="seasonSelect"
                                className="form-control"
                                value={selectedSeason}
                                onChange={(e) => setSelectedSeason(e.target.value)}
                            >
                                <option value="">Chọn Mùa Giải</option>
                                {seasons
                                    .filter((season) => season.leagueId === selectedLeague)
                                    .map((season) => (
                                        <option key={season._id} value={season._id}>
                                            {season.year}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    )}

                    {selectedSeason && (
                        <div className="form-group mr-3">
                            <label htmlFor="roundSelect">Chọn Vòng Đấu</label>
                            <select
                                id="roundSelect"
                                className="form-control"
                                value={selectedRound}
                                onChange={(e) => setSelectedRound(e.target.value)}
                            >
                                <option value="">Chọn Vòng Đấu</option>
                                {Array.from({ length: 38 }, (_, i) => i + 1).map((round) => (
                                    <option key={round} value={round}>
                                        Vòng {round}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {loading && <p>Loading...</p>}

                {matches.length > 0 && !loading && (
                    <div className="mt-4" style={{paddingBottom: 50}}>
                        <h2>Kết Quả Trận Đấu</h2>
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                <tr>
                                    <th scope="col"></th>
                                    <th scope="col">Đội Nhà</th>
                                    <th scope="col">Tỉ Số</th>
                                    <th scope="col"></th>
                                    <th scope="col">Đội Khách</th>
                                    <th scope="col">Thời Gian</th>
                                </tr>
                                </thead>
                                <tbody>
                                {matches.map((match) => (
                                    <tr key={match._id}>
                                        <td>
                                            <img src={match.homeTeamId.logo} alt={`${match.homeTeamId.name} logo`} width="20" height="20" />
                                        </td>
                                        <td>{match.homeTeamId.name}</td>
                                        <td>
                                            {match.status === 'notstarted'
                                                ? 'Chưa bắt đầu'
                                                : `${match.homeScore} - ${match.awayScore}`}
                                        </td>
                                        <td>
                                            <img src={match.awayTeamId.logo} alt={`${match.awayTeamId.name} logo`} width="20" height="20" />
                                        </td>
                                        <td>{match.awayTeamId.name}</td>
                                        <td>{new Date(match.startTimestamp * 1000).toLocaleString()}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {!loading && matches.length === 0 && (
                    <p>Không có trận đấu nào được tìm thấy cho vòng đấu này.</p>
                )}
            </div>
            <Footer></Footer>
        </div>
    );
}

export default MatchDetails;
