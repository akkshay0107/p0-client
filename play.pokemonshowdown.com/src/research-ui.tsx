import preact from "../js/lib/preact";
import { Config, PS, PSRoom, type RoomID } from "./client-main";
import { PSIcon, PSPanelWrapper, PSRoomPanel } from "./panels";
import { Teams } from "./battle-teams";
import { PSLoginServer } from "./client-connection";

export class ResearchLandingPage extends preact.Component {
	state = {
		currentPage: 'login' as 'login' | 'info' | 'teamselect',
		selectedTeamIndex: -1,
		isWaiting: false,
		showSettings: false,
	};
	psSubscription: any = null;
	userSubscription: any = null;

	override componentDidMount() {
		document.body.classList.add('research-mode');
		for (const roomid in PS.rooms) {
			if (roomid && !roomid.startsWith('battle-')) {
				const room = PS.rooms[roomid];
				if (room) {
					room.minimized = true;
					if (roomid === 'rooms' || roomid === 'lobby') {
						PS.hideRightRoom();
					}
				}
			}
		}

		this.psSubscription = PS.subscribe(() => {
			const hasBattle = Object.keys(PS.rooms).some(id => id.startsWith('battle-'));
			if (hasBattle) {
				document.body.classList.add('battle-active');
			} else {
				document.body.classList.remove('battle-active');
			}

			// Clear waiting state if any battle room is open
			if (this.state.isWaiting && hasBattle) {
				this.setState({ isWaiting: false });
			}
		});

		this.userSubscription = PS.user.subscribe(() => {
			if (PS.user.registered && this.state.currentPage === 'login') {
				const infoSeen = localStorage.getItem('p0_info_seen');
				this.setState({ currentPage: infoSeen ? 'teamselect' : 'info' });
			}
			this.forceUpdate();
		});

		if (PS.user.registered) {
			const infoSeen = localStorage.getItem('p0_info_seen');
			this.setState({ currentPage: infoSeen ? 'teamselect' : 'info' });
		}

		PS.update();
	}

	override componentWillUnmount() {
		document.body.classList.remove('research-mode');
		document.body.classList.remove('battle-active');
		if (this.psSubscription) {
			this.psSubscription.unsubscribe();
			this.psSubscription = null;
		}
		if (this.userSubscription) {
			this.userSubscription.unsubscribe();
			this.userSubscription = null;
		}
	}

	handleSelect = (index: number) => {
		this.setState({ selectedTeamIndex: index });
	};

	handleDoubleClick = (url: string) => {
		if (url) {
			window.open(url, '_blank');
		} else {
			PS.alert("No PokéPaste link available for this team yet.");
		}
	};

	handleBattle = () => {
		const { selectedTeamIndex } = this.state;
		if (selectedTeamIndex === -1) return;

		const team = Config.researchTeams![selectedTeamIndex];

		this.setState({ isWaiting: true });

		PS.send(`/utm ${team.packedTeam}`);
		PS.send(`/challenge Bot, gen9vgc2025regh`);
	};

	openSettings = () => {
		this.setState({ showSettings: true });
	};

	continueToTeams = () => {
		localStorage.setItem('p0_info_seen', 'true');
		this.setState({ currentPage: 'teamselect' });
	};

	override render() {
		const { currentPage, isWaiting, showSettings } = this.state;

		if (!PS.user.registered || currentPage === 'login') {
			return <ResearchLoginPage />;
		}

		if (currentPage === 'info') {
			return <ResearchInfoPage onContinue={this.continueToTeams} />;
		}

		return (
			<div class="research-landing">
				<button 
					class="nav-button info-button" 
					onClick={() => this.setState({ currentPage: 'info' })}
					title="Information"
				>
					<i class="fa fa-info-circle"></i>
				</button>
				<button 
					class="nav-button settings-button" 
					onClick={this.openSettings}
					title="Settings"
				>
					<i class="fa fa-cog"></i>
				</button>
				{showSettings && (
					<ResearchSettingsModal onClose={() => this.setState({ showSettings: false })} />
				)}
				{isWaiting ? (
					<div class="research-waiting">
						<div class="spinner"></div>
						<h1 style="color: var(--p0-accent-blue)">Preparing Match...</h1>
						<p>Challenging <strong>Bot</strong> with your selected team.</p>
						<button class="button" style="margin-top: 20px; background: transparent; border: 1px solid var(--p0-border); color: var(--p0-text-secondary); padding: 8px 16px; border-radius: 8px;" onClick={() => this.setState({ isWaiting: false })}>Cancel</button>
					</div>
				) : (
					<ResearchTeamSelectPage 
						selectedTeamIndex={this.state.selectedTeamIndex}
						onSelect={this.handleSelect}
						onDblClick={this.handleDoubleClick}
						onBattle={this.handleBattle}
					/>
				)}
			</div>
		);
	}
}

class ResearchInfoPage extends preact.Component<{ onContinue: () => void }> {
	override render() {
		return (
			<div class="research-landing">
				<div class="research-info-card">
					<div class="p0-logo">
						<span>P0</span> PROJECT
					</div>
					<div class="research-header">
						<h1>Welcome to P0</h1>
						<p>An RL-trained VGC battle bot experiment. Please read the instructions below carefully.</p>
					</div>
					
					<div class="info-steps">
						<div class="step">
							<div class="step-number">1</div>
							<div class="step-text">
								<h3>Pick a Team</h3>
								<p>Choose from 6 pre-built VGC teams. The bot will also select from its own pool of trained teams.</p>
							</div>
						</div>
						<div class="step">
							<div class="step-number">2</div>
							<div class="step-text">
								<h3>Start Battle</h3>
								<p>Click "Challenge Bot" to begin. Ensure you're ready before starting the match.</p>
							</div>
						</div>
						<div class="step">
							<div class="step-number">3</div>
							<div class="step-text">
								<h3>Team Preview</h3>
								<p>You MUST click "Open Team Sheet" during Team Preview to trigger the bot's selection logic.</p>
							</div>
						</div>
						<div class="step">
							<div class="step-number">4</div>
							<div class="step-text">
								<h3>Play to End</h3>
								<p>Forfeiting is disabled for research integrity. Please play every match through to completion.</p>
							</div>
						</div>
					</div>

					<div class="research-footer">
						<button class="button big" onClick={this.props.onContinue}>
							Continue to Team Selection →
						</button>
					</div>
				</div>
			</div>
		);
	}
}

class ResearchTeamSelectPage extends preact.Component<{
	selectedTeamIndex: number,
	onSelect: (index: number) => void,
	onDblClick: (url: string) => void,
	onBattle: () => void
}> {
	override render() {
		const teams = Config.researchTeams || [];
		const { selectedTeamIndex, onSelect, onDblClick, onBattle } = this.props;

		return (
			<>
				<div class="research-header">
					<h1>Select Your Team</h1>
					<p>Welcome, <strong>{PS.user.name}</strong>. Pick a team to challenge the bot.</p>
				</div>
				<div class="research-team-list">
					{teams.map((team, index) => (
						<ResearchTeamCard
							key={index}
							team={team}
							isSelected={selectedTeamIndex === index}
							onClick={() => onSelect(index)}
							onDblClick={() => onDblClick(team.pokePasteUrl)}
						/>
					))}
				</div>
				<div class="research-footer">
					<button 
						class={`button big ${selectedTeamIndex === -1 ? 'disabled' : ''}`}
						disabled={selectedTeamIndex === -1}
						onClick={onBattle}
					>
						<strong>Challenge Bot!</strong>
					</button>
				</div>
			</>
		);
	}
}


export class ResearchSettingsModal extends preact.Component<{ onClose: () => void }> {
	state = {
		newUsername: PS.user.name || '',
		currentPasswordForUsername: '',
		currentPasswordForPassword: '',
		newPassword: '',
		confirmPassword: '',
		loading: false,
		error: '',
		success: '',
	};

	handleChangeUsername = (e: Event) => {
		e.preventDefault();
		const { newUsername, currentPasswordForUsername } = this.state;
		if (!newUsername || !currentPasswordForUsername) return;

		this.setState({ loading: true, error: '', success: '' });

		PSLoginServer.query('changeusername', {
			name: PS.user.name,
			pass: currentPasswordForUsername,
			newname: newUsername
		}).then(res => {
			this.setState({ loading: false });
			if (res?.actionsuccess) {
				PS.alert("Username updated successfully! You will be logged out to complete the change.");
				PS.user.logOut();
				window.location.reload();
			} else {
				this.setState({ error: res?.actionerror || 'Failed to update username' });
			}
		});
	};

	handleChangePassword = (e: Event) => {
		e.preventDefault();
		const { currentPasswordForPassword, newPassword, confirmPassword } = this.state;
		if (!currentPasswordForPassword || !newPassword || !confirmPassword) return;

		if (newPassword !== confirmPassword) {
			this.setState({ error: 'New passwords do not match' });
			return;
		}

		this.setState({ loading: true, error: '', success: '' });

		PSLoginServer.query('changepassword', {
			name: PS.user.name,
			pass: currentPasswordForPassword,
			newpass: newPassword
		}).then(res => {
			this.setState({ loading: false });
			if (res?.actionsuccess) {
				this.setState({ 
					success: 'Password updated successfully!', 
					currentPasswordForPassword: '', 
					newPassword: '', 
					confirmPassword: '' 
				});
			} else {
				this.setState({ error: res?.actionerror || 'Failed to update password' });
			}
		});
	};

	override render() {
		const { newUsername, newPassword, confirmPassword, loading, error, success } = this.state;

		return (
			<div class="modal-backdrop" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 10000;" onClick={(e) => e.target === e.currentTarget && this.props.onClose()}>
				<div class="research-settings-panel" style="padding: 30px; border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.4); width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto;" onClick={e => e.stopPropagation()}>
					<div class="research-header" style="margin-bottom: 25px; text-align: left; display: flex; justify-content: space-between; align-items: flex-start;">
						<div>
							<h2 style="margin: 0; font-size: 20pt; font-weight: 800; color: var(--p0-accent-red);">Account Settings</h2>
							<p style="margin: 5px 0 0; color: var(--p0-text-secondary); font-size: 11pt;">Manage your participant profile</p>
						</div>
						<button onClick={this.props.onClose} style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--p0-text-secondary);">&times;</button>
					</div>

					{error && <div class="login-error" style="margin-bottom: 20px;">{error}</div>}
					{success && <div style="background: rgba(227, 53, 13, 0.1); color: var(--p0-accent-red); padding: 12px; border-radius: 8px; margin-bottom: 20px; text-align: center; border: 1px solid rgba(227, 53, 13, 0.2);">{success}</div>}

					<div class="settings-section" style="margin-bottom: 30px">
						<h3>Change Username</h3>
						<form onSubmit={this.handleChangeUsername} class="research-login-form" style="background: transparent; border: none; padding: 0; backdrop-filter: none; max-width: none;">
							<div class="input-group" style="margin-bottom: 15px">
								<label>New Username</label>
								<input 
									type="text" 
									value={newUsername} 
									onInput={e => this.setState({ newUsername: (e.target as HTMLInputElement).value })}
									disabled={loading}
								/>
							</div>
							<div class="input-group" style="margin-bottom: 15px">
								<label>Current Password</label>
								<input 
									type="password" 
									value={this.state.currentPasswordForUsername}
									onInput={e => this.setState({ currentPasswordForUsername: (e.target as HTMLInputElement).value })}
									disabled={loading}
								/>
							</div>
							<div class="research-footer" style="margin-top: 10px; max-width: none;">
								<button 
									type="submit" 
									class={`button big ${loading || !newUsername || !this.state.currentPasswordForUsername ? 'disabled' : ''}`}
									style="padding: 12px; font-size: 12pt;"
									disabled={loading || !newUsername || !this.state.currentPasswordForUsername}
								>
									{loading ? 'Updating...' : 'Update Username'}
								</button>
								<p style="font-size: 9pt; color: var(--p0-text-secondary); margin-top: 8px; text-align: center;">Note: This will log you out and require re-login.</p>
							</div>
						</form>
					</div>

					<div class="settings-section">
						<h3>Change Password</h3>
						<form onSubmit={this.handleChangePassword} class="research-login-form" style="background: transparent; border: none; padding: 0; backdrop-filter: none; max-width: none;">
							<div class="input-group" style="margin-bottom: 15px">
								<label>Current Password</label>
								<input 
									type="password" 
									value={this.state.currentPasswordForPassword}
									onInput={e => this.setState({ currentPasswordForPassword: (e.target as HTMLInputElement).value })}
									disabled={loading}
								/>
							</div>
							<div class="input-group" style="margin-bottom: 15px">
								<label>New Password</label>
								<input 
									type="password" 
									value={newPassword} 
									onInput={e => this.setState({ newPassword: (e.target as HTMLInputElement).value })}
									disabled={loading}
								/>
							</div>
							<div class="input-group" style="margin-bottom: 15px">
								<label>Confirm New Password</label>
								<input 
									type="password" 
									value={confirmPassword} 
									onInput={e => this.setState({ confirmPassword: (e.target as HTMLInputElement).value })}
									disabled={loading}
								/>
							</div>
							<div class="research-footer" style="margin-top: 10px; max-width: none;">
								<button 
									type="submit" 
									class={`button big ${loading || !this.state.currentPasswordForPassword || !newPassword || !confirmPassword ? 'disabled' : ''}`}
									style="padding: 12px; font-size: 12pt;"
									disabled={loading || !this.state.currentPasswordForPassword || !newPassword || !confirmPassword}
								>
									{loading ? 'Updating...' : 'Update Password'}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
}


class ResearchLoginPage extends preact.Component {
	state = {
		username: '',
		password: '',
		loading: false,
	};

	handleLogin = (e: Event) => {
		e.preventDefault();
		const { username, password } = this.state;
		if (!username || !password) return;

		this.setState({ loading: true });
		PS.user.changeNameWithPassword(username, password);
	};

	override render() {
		const { username, password, loading } = this.state;
		const error = PS.user.state?.error;

		return (
			<div class="research-landing">
				<div class="research-header">
					<h1>P0</h1>
					<p>Please log in with your participant credentials to continue.</p>
				</div>
				<form class="research-login-form" onSubmit={this.handleLogin}>
					<div class="input-group">
						<label>Username</label>
						<input 
							type="text" 
							value={username} 
							onInput={e => this.setState({ username: (e.target as HTMLInputElement).value })}
							disabled={loading}
							autoFocus
						/>
					</div>
					<div class="input-group">
						<label>Password</label>
						<input 
							type="password" 
							value={password} 
							onInput={e => this.setState({ password: (e.target as HTMLInputElement).value })}
							disabled={loading}
						/>
					</div>
					{error && <div class="login-error">{error}</div>}
					<div class="research-footer">
						<button 
							type="submit"
							class={`button big ${(!username || !password || loading) ? 'disabled' : ''}`}
							disabled={!username || !password || loading}
						>
							<strong>{loading ? 'Logging in...' : 'Login'}</strong>
						</button>
					</div>
				</form>
			</div>
		);
	}
}

class ResearchTeamCard extends preact.Component<{
	team: any,
	isSelected: boolean,
	onClick: () => void,
	onDblClick: () => void
}> {
	packedTeam: string = '';
	icons: preact.ComponentChildren = null;

	override componentWillMount() {
		const { team } = this.props;
		const sets = Teams.import(team.teamExport);
		this.packedTeam = Teams.pack(sets);
		team.packedTeam = this.packedTeam;
		
		this.icons = Teams.unpackSpeciesOnly(this.packedTeam).map(pokemon => (
			<PSIcon pokemon={pokemon} />
		));
	}

	override render() {
		const { team, isSelected, onClick, onDblClick } = this.props;

		return (
			<div 
				class={`research-team-card ${isSelected ? 'selected' : ''}`}
				onClick={onClick}
				onDblClick={onDblClick}
			>
				<div class="team-name">{team.name}</div>
				<div class="team-right-content">
					<div class="team-icons">
						{this.icons}
					</div>
					<div class="selection-indicator">
						{isSelected && <i class="fa fa-check-circle"></i>}
					</div>
				</div>
			</div>
		);
	}
}

PS.addRoomType(ResearchLandingPage);
