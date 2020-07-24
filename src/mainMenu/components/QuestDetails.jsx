import React from 'react'

const QuestDetails = ({ team }) => {

  const activeQuests = team && Object.keys(team.activeQuests).length
  console.log('team', team)

  return (
    <ul>
      <li>Active Quests: {activeQuests}</li>
    </ul>
  )
}

export default QuestDetails