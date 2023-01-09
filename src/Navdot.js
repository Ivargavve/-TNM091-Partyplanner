// import './App.css';
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import social from './social.png';
// import settings from './settings.png';

// function Navdot({ profileURL }) {
// 	const [ isExtended, toggleExtended ] = useToggle();
// 	//let btn_class = this.state.extended ? 'blackButton' : 'whiteButton';
// 	let nav_width = isExtended ? '80%' : '10%';
// 	let displayBtns = isExtended ? 'flex' : 'none';
// 	let flexActive = isExtended ? 'flex' : 'block';

// 	const navigate = useNavigate();

// 	return (
// 		<div
// 			id="navContainer"
// 			className="soft-shadow"
// 			style={{ width: nav_width, display: flexActive }}>
// 			<div>
// 				<div id="mainCircle" className="circle soft-shadow" onClick={toggleExtended}>
// 					<div className="circle" />
// 					<div className="circle" />
// 					<div className="circle" />
// 				</div>
// 			</div>

// 			<div className="iconDiv" style={{ display: displayBtns }}>
// 				<img
// 					className="profileImg"
// 					src={profileURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'}
// 					alt="Profile img"
// 				/>
// 			</div>
// 			<div className="iconDiv" style={{ display: displayBtns }}>
// 				<img
// 					className="profileImg"
// 					src={social || 'https://api.adorable.io/avatars/23/abott@adorable.png'}
// 					alt="Profile img"
// 				/>
// 			</div>
// 			<div
// 				className="iconDiv"
// 				style={{ display: displayBtns }}
// 				onClick={navigate('/settings')}>
// 				<img
// 					className="profileImg"
// 					src={settings || 'https://api.adorable.io/avatars/23/abott@adorable.png'}
// 					alt="Profile img"
// 				/>
// 			</div>
// 		</div>
// 	);
// }

// function useToggle(initialValue = false) {
// 	const [ value, setValue ] = React.useState(initialValue);
// 	const toggle = React.useCallback(() => {
// 		setValue((v) => !v);
// 	}, []);
// 	return [ value, toggle ];
// }

// export default Navdot;
