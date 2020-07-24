import React, { useState, useEffect } from 'react'
import { Link, navigate } from '@reach/router'

import { addTeam, getAllTeams, getUser } from '../db/firebase'

import UserDetails from './components/UserDetails'
import QuestDetails from './components/QuestDetails'

import './Teams.css'

const Teams = ({ currentUser }) => {
	const [teamsState, setTeamsState] = useState([])
	const [selectedTeamState, setSelectedTeamState] = useState('')
  const [userDetailsState, setUserDetailsState] = useState()
  const [questDetailsState, setQuestDetailsState] = useState({ activeQuests: 0})
	const [newTeamNameState, setNewTeamNameState] = useState('')
	const [newTeamMemberState, setNewTeamMemberState] = useState('')
	const [allTeamMembersState, setAllTeamMembersState] = useState([])

	useEffect(() => {
		const fetchTeams = async () => {
			const user = await getUser(currentUser.uid)
			const teams = await getAllTeams(user)
			setTeamsState(teams)
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
    const selectedTeam = teamsState.find(team => team.name === id)
    const { activeQuests } = selectedTeam
    setSelectedTeamState(selectedTeam)
    setUserDetailsState(selectedTeam.members[currentUser.uid])
    setQuestDetailsState({ activeQuests: Object.values(activeQuests).length})
  }

	return (
		<div className='teams__landing'>
			<div className='teams__details'>
      {selectedTeamState ?
        <>
          <h1 className='teams__header'>{selectedTeamState.name}</h1>
          <UserDetails user={selectedTeamState.members[currentUser.uid]} />
          <QuestDetails team={selectedTeamState} />
        </>
      : null}
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
										selectedTeamState.name && 'selected'}`}
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
