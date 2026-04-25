import preact from "../js/lib/preact";
import { Config, PS, PSRoom, type RoomID } from "./client-main";
import { PSIcon, PSPanelWrapper, PSRoomPanel } from "./panels";
import { Teams } from "./battle-teams";
import { PSLoginServer } from "./client-connection";

export class ResearchLandingPage extends preact.Component {
	state = {
		selectedTeamIndex: -1,
		isWaiting: false,
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
			// Clear waiting state if any battle room is open
			if (this.state.isWaiting && Object.keys(PS.rooms).some(id => id.startsWith('battle-'))) {
				this.setState({ isWaiting: false });
			}
		});

		this.userSubscription = PS.user.subscribe(() => {
			this.forceUpdate();
		});

		PS.update();
	}

	override componentWillUnmount() {
		document.body.classList.remove('research-mode');
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
		PS.join('research-settings' as RoomID);
	};

	override render() {
		const teams = Config.researchTeams || [];
		const { isWaiting, selectedTeamIndex } = this.state;

		if (!PS.user.registered) {
			return <ResearchLoginPage />;
		}

		return (
			<div class="research-landing">
				<button 
					class="button settings-button" 
					onClick={this.openSettings}
					title="Settings"
				>
					<i class="fa fa-cog"></i>
				</button>
				{isWaiting ? (
					<div class="research-waiting">
						<div class="spinner"></div>
						<h1>Preparing Match...</h1>
						<p>Challenging <strong>Bot</strong> with your selected team.</p>
						<button class="button" style="margin-top: 20px" onClick={() => this.setState({ isWaiting: false })}>Cancel</button>
					</div>
				) : (
					<>
						<div class="research-header">
							<h1>VGC Research Project</h1>
							<p>Welcome, <strong>{PS.user.name}</strong>. Please select a team to challenge the RL bot.</p>
						</div>
						<div class="research-team-list">
							{teams.map((team, index) => (
								<ResearchTeamCard
									key={index}
									team={team}
									isSelected={selectedTeamIndex === index}
									onClick={() => this.handleSelect(index)}
									onDblClick={() => this.handleDoubleClick(team.pokePasteUrl)}
								/>
							))}
						</div>
						<div class="research-footer">
							<button 
								class={`button big ${selectedTeamIndex === -1 ? 'disabled' : ''}`}
								disabled={selectedTeamIndex === -1}
								onClick={this.handleBattle}
							>
								<strong>Challenge Bot!</strong>
							</button>
						</div>
					</>
				)}
			</div>
		);
	}
}

export class ResearchSettingsPanel extends PSRoomPanel {
	static readonly id = 'research-settings';
	static readonly routes = ['research-settings'];

	state = {
		newUsername: PS.user.name || '',
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
		loading: false,
		error: '',
		success: '',
	};

	handleChangeUsername = (e: Event) => {
		e.preventDefault();
		const { newUsername, currentPassword } = this.state;
		if (!newUsername || !currentPassword) return;

		this.setState({ loading: true, error: '', success: '' });

		PSLoginServer.query('changeusername', {
			name: PS.user.name,
			pass: currentPassword,
			newname: newUsername
		}).then(res => {
			this.setState({ loading: false });
			if (res?.actionsuccess) {
				this.setState({ success: 'Username updated successfully!', currentPassword: '' });
				PS.user.updateLogin({ name: res.newusername });
			} else {
				this.setState({ error: res?.actionerror || 'Failed to update username' });
			}
		});
	};

	handleChangePassword = (e: Event) => {
		e.preventDefault();
		const { currentPassword, newPassword, confirmPassword } = this.state;
		if (!currentPassword || !newPassword || !confirmPassword) return;

		if (newPassword !== confirmPassword) {
			this.setState({ error: 'New passwords do not match' });
			return;
		}

		this.setState({ loading: true, error: '', success: '' });

		PSLoginServer.query('changepassword', {
			name: PS.user.name,
			pass: currentPassword,
			newpass: newPassword
		}).then(res => {
			this.setState({ loading: false });
			if (res?.actionsuccess) {
				this.setState({ 
					success: 'Password updated successfully!', 
					currentPassword: '', 
					newPassword: '', 
					confirmPassword: '' 
				});
			} else {
				this.setState({ error: res?.actionerror || 'Failed to update password' });
			}
		});
	};

	override render() {
		const { newUsername, currentPassword, newPassword, confirmPassword, loading, error, success } = this.state;

		return (
			<PSPanelWrapper room={this.props.room} width={400} scrollable={true}>
				<div class="research-settings-panel" style="padding: 20px">
					<div class="research-header" style="margin-bottom: 20px">
						<h2 style="margin: 0">Account Settings</h2>
						<p style="font-size: 11pt">Modify your participant profile</p>
					</div>

					{error && <div class="login-error" style="margin-bottom: 15px">{error}</div>}
					{success && <div class="login-success" style="margin-bottom: 15px; color: green; text-align: center; background: #e6ffed; padding: 10px; border-radius: 8px; border: 1px solid #b7eb8f;">{success}</div>}

					<div class="settings-section">
						<h3>Change Username</h3>
						<form class="research-login-form" onSubmit={this.handleChangeUsername}>
							<div class="input-group">
								<label>New Username</label>
								<input 
									type="text" 
									value={newUsername}
									onInput={e => this.setState({ newUsername: (e.target as HTMLInputElement).value })}
									disabled={loading}
								/>
							</div>
							<div class="input-group">
								<label>Current Password</label>
								<input 
									type="password" 
									value={currentPassword}
									onInput={e => this.setState({ currentPassword: (e.target as HTMLInputElement).value })}
									disabled={loading}
								/>
							</div>
							<div class="research-footer" style="margin-top: 10px">
								<button 
									type="submit" 
									class={`button ${loading ? 'disabled' : ''}`}
									style="width: 100%; padding: 10px; background: #000; color: #fff; border-radius: 5px;"
									disabled={loading || !newUsername || !currentPassword}
								>
									Update Username
								</button>
							</div>
						</form>
					</div>

					<hr style="margin: 25px 0; border: 0; border-top: 1px solid #eee" />

					<div class="settings-section">
						<h3>Change Password</h3>
						<form class="research-login-form" onSubmit={this.handleChangePassword}>
							<div class="input-group">
								<label>Current Password</label>
								<input 
									type="password" 
									value={currentPassword}
									onInput={e => this.setState({ currentPassword: (e.target as HTMLInputElement).value })}
									disabled={loading}
								/>
							</div>
							<div class="input-group">
								<label>New Password</label>
								<input 
									type="password" 
									value={newPassword}
									onInput={e => this.setState({ newPassword: (e.target as HTMLInputElement).value })}
									disabled={loading}
								/>
							</div>
							<div class="input-group">
								<label>Confirm New Password</label>
								<input 
									type="password" 
									value={confirmPassword}
									onInput={e => this.setState({ confirmPassword: (e.target as HTMLInputElement).value })}
									disabled={loading}
								/>
							</div>
							<div class="research-footer" style="margin-top: 10px">
								<button 
									type="submit" 
									class={`button ${loading ? 'disabled' : ''}`}
									style="width: 100%; padding: 10px; background: #000; color: #fff; border-radius: 5px;"
									disabled={loading || !currentPassword || !newPassword || !confirmPassword}
								>
									Update Password
								</button>
							</div>
						</form>
					</div>

					<div style="margin-top: 30px; text-align: center">
						<button class="button" style="padding: 10px 20px" onClick={() => this.close()}>Close</button>
					</div>
				</div>
			</PSPanelWrapper>
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
					<h1>VGC Research Project</h1>
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

PS.addRoomType(ResearchSettingsPanel);
