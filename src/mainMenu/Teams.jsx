import React, { useState, useEffect } from 'react'
import { Link, navigate } from '@reach/router'

import { addTeam, getAllTeams, getUser } from '../db/firebase'

import './Teams.css'

const Teams = ({ currentUser }) => {
	const [teamsState, setTeamsState] = useState([])
	const [selectedTeamState, setSelectedTeamState] = useState('')
	const [userDetailsState, setUserDetailsState] = useState()
	const [newTeamNameState, setNewTeamNameState] = useState('')
	const [newTeamMemberState, setNewTeamMemberState] = useState('')
	const [allTeamMembersState, setAllTeamMembersState] = useState([])

	useEffect(() => {
		const fetchTeams = async () => {
			const user = await getUser(currentUser.uid)
			console.log(user)
			const teams = await getAllTeams(user)
			setTeamsState(teams)
			console.log('teams', teams)
		}
		fetchTeams()
	}, [currentUser.email])

	const handleNewTeamMember = event => {
		event.preventDefault()
		const teamMembers = allTeamMembersState.concat(newTeamMemberState)
		setAllTeamMembersState(teamMembers)
	}

	const handleSubmit = event => {
		event.preventDefault()
		const newTeam = {
			name: newTeamNameState,
			members: allTeamMembersState.concat(currentUser.email)
		}
		const teamAdded = addTeam(newTeam)
		teamAdded && setTeamsState(teamsState.concat(newTeam))
	}

	const handleSelectTeam = event => {
		const { id } = event.target
		const { uid } = currentUser
		setSelectedTeamState(event.target.id)
		const selectedTeam = teamsState.find(team => team.name === id)
		const userDetails = selectedTeam.members[uid]
		setUserDetailsState(userDetails)
	}

	return (
		<div className='teams__landing'>
			<div className='teams__details'>
				<h1>{selectedTeamState}</h1>
				<div>
					{userDetailsState && (
						<ul>
							<li>Name: {userDetailsState.userName}</li>
							<li>Experience: {userDetailsState.experience}</li>
							<li>Currency: {userDetailsState.currency}</li>
							<li>Level: {userDetailsState.level}</li>
						</ul>
					)}
				</div>
			</div>
			<div className='teams__list'>
				<ul>
					{teamsState.length ? (
						teamsState.map(team => {
							return (
								<li
									id={team.name}
									onClick={handleSelectTeam}
									className={`app__list__item ${team.name ===
										selectedTeamState && 'selected'}`}
								>
									{team.name}
								</li>
							)
						})
					) : (
						<p>No Teams</p>
					)}
				</ul>
				{selectedTeamState && (
					<button onClick={() => navigate(`/dashboard/${selectedTeamState}`)}>
						Enter World
					</button>
				)}
				<form onSubmit={handleSubmit}>
					<input
						placeholder='Team Name'
						onChange={event => setNewTeamNameState(event.target.value)}
					></input>
					<input
						placeholder='Add Member'
						onChange={event => setNewTeamMemberState(event.target.value)}
					></input>
					<button onClick={handleNewTeamMember}>Add Member</button>
					{allTeamMembersState.length && (
						<ul>
							{allTeamMembersState.map(member => (
								<li key={member}>{member}</li>
							))}
						</ul>
					)}
					<button type='submit'>Add Team</button>
				</form>
			</div>
		</div>
	)
}

export default Teams
