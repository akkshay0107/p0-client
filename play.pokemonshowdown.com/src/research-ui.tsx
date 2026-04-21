import preact from "../js/lib/preact";
import { Config, PS, PSRoom, type RoomID } from "./client-main";
import { PSIcon, PSPanelWrapper, PSRoomPanel } from "./panels";
import { Teams } from "./battle-teams";

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

	override render() {
		const teams = Config.researchTeams || [];
		const { isWaiting, selectedTeamIndex } = this.state;

		if (!PS.user.registered) {
			return <ResearchLoginPage />;
		}

		return (
			<div class="research-landing">
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
