import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import social from './social.png';
import settings from './settings.png';

firebase.initializeApp({
	apiKey: 'AIzaSyAibpnledCmgK3QehVSi6YF6Z0Qi3qpLd4',
	authDomain: 'partyplanner-53efd.firebaseapp.com',
	projectId: 'partyplanner-53efd',
	storageBucket: 'partyplanner-53efd.appspot.com',
	messagingSenderId: '347853882981',
	appId: '1:347853882981:web:7ffcc4e508abd439b2e88c',
	measurementId: 'G-Z3R0P5LF3H'
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
	const messagesRef = firestore.collection('messages');
	const query = messagesRef.orderBy('createdAt').limit(999);
	const [ messages ] = useCollectionData(query, { idField: 'id' });
	const [ user ] = useAuthState(auth);

	function Main() {
		return (
			<Router>
				<div>
					<Routes>
						<Route
							path="/"
							element={
								<div>
									<Header />
									<Navdot profileURL={auth.currentUser.photoURL} /> <ChatRoom />{' '}
								</div>
							}
						/>
						<Route
							path="/create-event"
							element={
								<div>
									<Header />
									<Navdot profileURL={auth.currentUser.photoURL} /> <EventForm />
								</div>
							}
						/>
						<Route
							path="/profile"
							element={
								<div>
									<Header />
									<Navdot profileURL={auth.currentUser.photoURL} />{' '}
									<Profile messagesRef={messagesRef} query={query} />
								</div>
							}
						/>
						<Route
							path="/settings"
							element={
								<div>
									<Header />
									<Navdot profileURL={auth.currentUser.photoURL} />
									<SignOut />
								</div>
							}
						/>
					</Routes>
				</div>
			</Router>
		);
	}

	function Header() {
		const navigation = useNavigate();

		return (
			<header>
				<img
					onClick={() => {
						navigation('/');
					}}
					src={
						'https://media.discordapp.net/attachments/884793422010011648/894487116069875732/unknown.png'
					}
					alt="PartyPlanner"
					id="partyPlannerIcon"
				/>
				<img
					className="profileImg"
					onClick={() => {
						navigation('/profile');
					}}
					src={
						auth.currentUser.photoURL ||
						'https://api.adorable.io/avatars/23/abott@adorable.png'
					}
					alt={auth.currentUser.displayName}
				/>
			</header>
		);
	}

	function SignIn() {
		const signInWithGoogle = () => {
			const provider = new firebase.auth.GoogleAuthProvider();
			auth.signInWithPopup(provider);
		};

		return (
			<div>
				<img
					src={
						'https://media.discordapp.net/attachments/884793422010011648/894487116069875732/unknown.png'
					}
					alt="PartyPlanner"
					style={{ display: 'block', margin: 'auto', height: '200px' }}
				/>
				<div className="loginDiv">
					<button className="sign-in" onClick={signInWithGoogle}>
						Continue with Google
					</button>
					<p>Do not violate the community guidelines or you will be banned for life!</p>
				</div>
			</div>
		);
	}

	function SignOut() {
		return auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>;
	}

	function ChatRoom() {
		const dummy = useRef();

		return (
			<div>
				<main>
					{messages && messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

					<span ref={dummy} />
				</main>
			</div>
		);
	}

	function ChatMessage(props) {
		// Create a state of the messages, displayed or not.
		const [ switchToggled, setSwitchToggled ] = useState(false);

		const ToggleSwitch = () => {
			switchToggled ? setSwitchToggled(false) : setSwitchToggled(true);
		};

		const { text, title, facebooklink, organisation, date, uid, photoURL } = props.message;

		const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

		return (
			<div>
				<div className={`message ${messageClass}`}>
					<div className="messageDiv soft-shadow" onClick={ToggleSwitch}>
						<div>
							<p className="title">{title}</p>
							{organisation}
							<br />
							<span className="messageDate">{date}</span>
							<div className={switchToggled ? 'show' : 'hide'}>
								{text}
								<br />
								<div className="signup">
									<a href={facebooklink}>Anmäl</a>
								</div>
							</div>
						</div>

						<img
							className="profileImg"
							src={
								photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'
							}
							alt="Profile Img"
						/>
					</div>
				</div>
			</div>
		);
	}
	function ChatMessage2(props) {
		// Create a state of the messages, displayed or not.
		const [ switchToggled, setSwitchToggled ] = useState(false);

		const ToggleSwitch = () => {
			switchToggled ? setSwitchToggled(false) : setSwitchToggled(true);
		};

		const { uid } = props.message;

		const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

		const userMessages = messages.filter((mess) => mess.uid === auth.currentUser.uid);
		console.log(userMessages);

		return (
			<div id="msgContainer">
				{userMessages.map((mess) => {
					return (
						<div className={`message ${messageClass}`}>
							<div className="messageDiv soft-shadow" onClick={ToggleSwitch}>
								<div>
									<span className="title">{mess.title}</span>
									<br />
									{mess.organisation}
									<br />
									<span className="messageDate">{mess.date}</span>
									<div className={switchToggled ? 'show' : 'hide'}>
										{mess.text}
										<br />
										<div>
											<a href={mess.facebooklink}>Anmäl</a>
										</div>
									</div>
								</div>
								<img
									className="profileImg"
									src={
										mess.photoURL ||
										'https://api.adorable.io/avatars/23/abott@adorable.png'
									}
									alt="Profile Img"
								/>
							</div>
						</div>
					);
				})}
			</div>
		);
	}

	function EventForm() {
		const navigate = useNavigate();
		const messagesRef = firestore.collection('messages');

		const [ formValue, setFormValue ] = useState('');
		const [ eventTitle, setTitle ] = useState('');
		const [ eventDate, setDate ] = useState('');
		const [ eventOrg, setOrg ] = useState('');
		const [ facebookValue, setFaceValue ] = useState('');

		const sendMessage = async (e) => {
			e.preventDefault();

			const { uid, photoURL } = auth.currentUser;

			await messagesRef.add({
				title: eventTitle,
				organisation: eventOrg,
				date: eventDate,
				text: formValue,
				facebooklink: facebookValue,
				createdAt: firebase.firestore.FieldValue.serverTimestamp(),
				uid,
				photoURL
			});

			setFormValue('');
			setTitle('');
			setDate('');
			setOrg('');
			setFaceValue('');

			navigate('/');
		};

		return (
			<div>
				<main>
					<form onSubmit={sendMessage}>
						<input
							name="title"
							value={eventTitle}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Title"
						/>
						<input
							name="org"
							value={eventOrg}
							onChange={(e) => setOrg(e.target.value)}
							placeholder="Organisation"
						/>
						<input
							type="date"
							name="date"
							value={eventDate}
							onChange={(e) => setDate(e.target.value)}
							placeholder="Date"
						/>
						<input
							value={formValue}
							onChange={(e) => setFormValue(e.target.value)}
							placeholder="New Post"
						/>
						<input
							name="facebooklink"
							value={facebookValue}
							onChange={(e) => setFaceValue(e.target.value)}
							placeholder="Facebook link:"
						/>
						<div>
							<button id="submitBtn" type="submit">
								Skapa ett event!
							</button>
						</div>
					</form>
				</main>
			</div>
		);
	}
	function Profile({ messagesRef, query }) {
		const dummy = useRef();
		const [ messages ] = useCollectionData(query, { idField: 'id' });

		return (
			<div>
				<main>
					<p className="myEvents">Mina Evenemang</p>
					{messages && messages.map((msg) => <ChatMessage2 key={msg.id} message={msg} />)}

					<span ref={dummy} />
				</main>
				<SignOut />
			</div>
		);
	}

	function Navdot({ profileURL }) {
		const [ isExtended, toggleExtended ] = useToggle();
		const navigation = useNavigate();
		let nav_width = isExtended ? '80%' : '10%';
		let displayBtns = isExtended ? 'flex' : 'none';
		let flexActive = isExtended ? 'flex' : 'block';

		return (
			<div
				id="navContainer"
				className="soft-shadow"
				style={{ width: nav_width, display: flexActive }}>
				<div>
					<div id="mainCircle" className="circle soft-shadow" onClick={toggleExtended}>
						<div className="circle" />
						<div className="circle" />
						<div className="circle" />
					</div>
				</div>

				<div className="iconDiv" style={{ display: displayBtns }}>
					<img
						onClick={() => {
							navigation('/profile');
							toggleExtended();
						}}
						className="profileImg"
						src={profileURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'}
						alt="Profile img"
					/>
				</div>
				<div className="iconDiv" style={{ display: displayBtns }}>
					<img
						onClick={() => {
							navigation('/create-event');
							toggleExtended();
						}}
						className="profileImg"
						src={social || 'https://api.adorable.io/avatars/23/abott@adorable.png'}
						alt="Social img"
					/>
				</div>
				<div className="iconDiv" style={{ display: displayBtns }}>
					<img
						onClick={() => {
							navigation('/settings');
							toggleExtended();
						}}
						className="profileImg"
						src={settings || 'https://api.adorable.io/avatars/23/abott@adorable.png'}
						alt="Settings img"
					/>
				</div>
			</div>
		);
	}

	function useToggle(initialValue = false) {
		const [ value, setValue ] = React.useState(initialValue);
		const toggle = React.useCallback(() => {
			setValue((v) => !v);
		}, []);
		return [ value, toggle ];
	}

	return <div id="container">{user ? <Main /> : <SignIn />}</div>;
}
export default App;
