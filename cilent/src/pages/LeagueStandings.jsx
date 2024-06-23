import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import Layout from "../components/Layout";

const LeagueStandings = () => {
    const [leagues, setLeagues] = useState([]);
    const [seasons, setSeasons] = useState([]);
    const [standings, setStandings] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState('');
    const [selectedSeason, setSelectedSeason] = useState('');

    useEffect(() => {
        axios.get('http://localhost:7000/api/leagues')
            .then(response => setLeagues(response.data))
            .catch(error => console.error('Error fetching leagues:', error));
    }, []);

    useEffect(() => {
        if (selectedLeague) {
            axios.get(`http://localhost:7000/api/seasons?leagueId=${selectedLeague}`)
                .then(response => {
                    const filteredSeasons = response.data.filter(season => season.leagueId === selectedLeague)
                        .map(season => ({
                            _id: season._id,
                            year: season.year
                        }));
                    setSeasons(filteredSeasons);
                })
                .catch(error => console.error('Error fetching seasons:', error));
        } else {
            setSeasons([]);
        }
        setSelectedSeason('');
    }, [selectedLeague]);

    useEffect(() => {
        if (selectedLeague && selectedSeason) {
            axios.get(`http://localhost:7000/api/leagues/${selectedLeague}/seasons/${selectedSeason}/standings`)
                .then(response => setStandings(response.data.standings))
                .catch(error => console.error('Error fetching standings:', error));
        } else {
            setStandings([]);
        }
    }, [selectedLeague, selectedSeason]);

    useEffect(() => {
        if (leagues.length > 0) {
            const premierLeague = leagues.find(league => league.name === 'Premier League' && league.country === 'England');
            if (premierLeague) {
                setSelectedLeague(premierLeague._id);
            }
        }
    }, [leagues]);

    useEffect(() => {
        if (selectedLeague && seasons.length > 0) {
            const premierLeagueSeason = seasons.find(season => season.year === '24/25');
            if (premierLeagueSeason) {
                setSelectedSeason(premierLeagueSeason._id);
            }
        }
    }, [selectedLeague, seasons]);

    return (
        <Layout>
            <Container style={{ paddingLeft: "150px", paddingRight: "150px" }}>
                <h1 style={{paddingTop: 20}}>Bảng Xếp Hạng</h1>
                <Form>
                    <Row>
                        <Col>
                            <Form.Group controlId="selectLeague">
                                <Form.Label>Chọn giải đấu</Form.Label>
                                <Form.Control as="select" value={selectedLeague} onChange={e => setSelectedLeague(e.target.value)}>
                                    <option value="">Chọn giải đấu</option>
                                    {leagues.map(league => (
                                        <option key={league._id} value={league._id}>
                                            {league.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            {selectedLeague && (
                                <Form.Group controlId="selectSeason">
                                    <Form.Label>Chọn mùa giải</Form.Label>
                                    <Form.Control as="select" value={selectedSeason} onChange={e => setSelectedSeason(e.target.value)}>
                                        <option value="">Chọn năm</option>
                                        {seasons.map(season => (
                                            <option key={season._id} value={season._id}>
                                                {season.year}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            )}
                        </Col>
                    </Row>
                </Form>

                {standings.length > 0 && (
                    <Table striped bordered hover className="mt-4">
                        <thead>
                        <tr>
                            <th>Vị trí</th>
                            <th>Đội bóng</th>
                            <th>Trận đã đấu</th>
                            <th>Thắng</th>
                            <th>Hòa</th>
                            <th>Thua</th>
                            <th>Bàn thắng</th>
                            <th>Bàn thua</th>
                            <th>Hiệu số</th>
                            <th>Điểm</th>
                        </tr>
                        </thead>
                        <tbody>
                        {standings.map(team => (
                            <tr key={team.teamId._id}>
                                <td>{team.position}</td>
                                <td>
                                    <img src={team.teamId.logo} alt={team.teamId.name} style={{ height: '20px', marginRight: '10px' }} />
                                    {team.teamId.name}
                                </td>
                                <td>{team.played}</td>
                                <td>{team.won}</td>
                                <td>{team.drawn}</td>
                                <td>{team.lost}</td>
                                <td>{team.goalFors}</td>
                                <td>{team.goalsAgainst}</td>
                                <td>{team.goalDifference}</td>
                                <td>{team.points}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                )}
            </Container>
        </Layout>
    );
};

export default LeagueStandings;
