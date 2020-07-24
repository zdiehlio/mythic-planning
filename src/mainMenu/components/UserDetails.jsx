import React from 'react'

const UserDetails = ({ user }) => {

  const { userName, experience, currency, level } = user

	return (
		<ul className='team__details'>
			<li>User Name: {userName}</li>
      <li>Level: {level}</li>
      <li>Progress: {experience}</li>
      <li>Wallet: {currency}</li>
		</ul>
	)
}

export default UserDetails
