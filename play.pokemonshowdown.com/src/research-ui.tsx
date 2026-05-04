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
		const logoUrl = "p0-logo.png";

		return (
			<div class="dark bg-[#11131b] text-on-surface font-body-md h-screen w-full flex flex-col items-center p-md relative overflow-hidden">
				<div class="w-full max-w-4xl z-10 flex flex-col h-full justify-center">
					{/* Hero Branding Section */}
					<div class="text-center mb-6">
						<div class="flex justify-center items-center w-full mb-3">
							<img src={logoUrl} alt="P0 Logo" class="h-16 object-contain" />
						</div>
						<p class="max-w-2xl mx-auto font-body-md text-body-md text-on-surface-variant opacity-80">
							An RL-trained VGC battle bot experiment. Please read carefully.
						</p>
					</div>

					{/* Instructions - Vertical stack to save horizontal space and keep it visible */}
					<div class="flex flex-col gap-4 mb-10 max-w-2xl mx-auto w-full">
						{/* Step 1 */}
						<div class="bg-[#161B26] border border-[#222938] p-5 rounded-lg electric-glow transition-all hover:border-primary-container/30">
							<div class="flex items-center gap-4">
								<div class="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-surface-container-low border border-[#222938] rounded-lg">
									<span class="font-bold text-primary-container text-base">01</span>
								</div>
								<div class="flex flex-col">
									<h3 class="font-bold text-on-surface text-lg">Pick a Team</h3>
									<p class="text-sm text-on-surface-variant">Choose from 6 pre-built teams. The bot will pick from its own pool.</p>
								</div>
							</div>
						</div>

						{/* Step 2 */}
						<div class="bg-[#161B26] border border-[#222938] p-5 rounded-lg electric-glow transition-all hover:border-primary-container/30">
							<div class="flex items-center gap-4">
								<div class="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-surface-container-low border border-[#222938] rounded-lg">
									<span class="font-bold text-primary-container text-base">02</span>
								</div>
								<div class="flex flex-col">
									<h3 class="font-bold text-on-surface text-lg">Start Battle</h3>
									<p class="text-sm text-on-surface-variant">Click "Challenge Bot" to begin. Ensure you're ready.</p>
								</div>
							</div>
						</div>

						{/* Step 3 */}
						<div class="bg-[#161B26] border border-[#222938] p-5 rounded-lg electric-glow transition-all hover:border-primary-container/30">
							<div class="flex items-center gap-4">
								<div class="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-surface-container-low border border-[#222938] rounded-lg">
									<span class="font-bold text-primary-container text-base">03</span>
								</div>
								<div class="flex flex-col">
									<h3 class="font-bold text-primary-container text-lg">Team Preview</h3>
									<p class="text-sm text-on-surface-variant">You <span class="text-primary-container font-bold">MUST</span> click "Open Team Sheet" during Team Preview.</p>
								</div>
							</div>
						</div>

						{/* Step 4 */}
						<div class="bg-[#161B26] border border-[#222938] p-5 rounded-lg electric-glow transition-all hover:border-primary-container/30">
							<div class="flex items-center gap-4">
								<div class="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-surface-container-low border border-[#222938] rounded-lg">
									<span class="font-bold text-primary-container text-base">04</span>
								</div>
								<div class="flex flex-col">
									<h3 class="font-bold text-on-surface text-lg">Play to End</h3>
									<p class="text-sm text-on-surface-variant">Forfeiting is disabled. Please play every match to completion.</p>
								</div>
							</div>
						</div>
					</div>

					{/* Action Footer */}
					<div class="flex flex-col items-center">
						<button 
							class="bg-primary-container text-on-primary-container font-bold px-8 py-3 rounded-lg shadow-[0_8px_24px_rgba(255,203,5,0.2)] active:scale-95 transition-all hover:brightness-110 flex items-center gap-2 text-md"
							onClick={this.props.onContinue}
						>
							CONTINUE TO TEAM SELECTION 
							<span class="material-symbols-outlined">arrow_forward</span>
						</button>
					</div>
				</div>

				{/* Background Decoration */}
				<div class="fixed -bottom-20 -right-20 w-80 h-80 bg-primary-container/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
				<div class="fixed -top-20 -left-20 w-80 h-80 bg-secondary-container/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
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
		const logoUrl = "p0-logo.png";

		return (
			<div class="dark bg-background text-on-background font-body-md min-h-full flex flex-col items-center justify-center p-md" style="background-color: #11131b; color: #e2e1ee; min-height: 100vh;">
				{/* Top Logo */}
				<header class="flex justify-center items-center w-full mb-8">
					<img src={logoUrl} alt="P0 Logo" class="h-20 object-contain" />
				</header>

				<section class="relative w-full max-w-[440px] bg-surface-container border border-outline-variant p-lg rounded-xl shadow-2xl z-10" style="background-color: #1d1f28; border-color: #4e4632; border-width: 1px; border-radius: 12px; padding: 40px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
					<div class="absolute top-4 right-4">
						<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-error-container/20 border border-error-container/30 text-error uppercase tracking-widest" style="color: #ffb4ab; background-color: rgba(147, 0, 10, 0.2); border: 1px solid rgba(147, 0, 10, 0.3);">
							Alpha
						</span>
					</div>

					<div class="mb-xl text-center" style="margin-bottom: 40px;">
						<h2 class="font-headline-md text-headline-md text-on-surface mb-xs" style="font-family: 'Spline Sans'; font-size: 24px; color: #e2e1ee;">Play against P0</h2>
						<p class="font-body-sm text-body-sm text-on-surface-variant" style="font-family: 'Manrope'; font-size: 14px; color: #d2c5ab;">Enter participant details to continue</p>
					</div>

					<form class="space-y-md" onSubmit={this.handleLogin}>
						{error && <p class="text-error text-center mb-4" style="color: #ffb4ab;">{error}</p>}

						<div class="space-y-xs" style="margin-bottom: 24px;">
							<label class="font-label-caps text-label-caps text-on-surface-variant uppercase" style="font-family: 'Manrope'; font-size: 12px; color: #d2c5ab; display: block; margin-bottom: 4px;">Username</label>
							<div class="relative">
								<span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #d2c5ab;">person</span>
								<input
									class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 pl-12 pr-4 text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all placeholder:text-on-surface-variant/40"
									style="width: 100%; background-color: #191b24; border: 1px solid #4e4632; border-radius: 8px; padding: 12px 12px 12px 48px; color: #e2e1ee;"
									placeholder="Enter your username"
									type="text"
									value={username}
									onInput={e => this.setState({ username: (e.target as HTMLInputElement).value })}
									disabled={loading}
									autoFocus
								/>
							</div>
						</div>

						{/* Password Field */}
						<div class="space-y-xs" style="margin-bottom: 24px;">
							<label class="font-label-caps text-label-caps text-on-surface-variant uppercase" style="font-family: 'Manrope'; font-size: 12px; color: #d2c5ab; display: block; margin-bottom: 4px;">Password</label>
							<div class="relative">
								<span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #d2c5ab;">lock</span>
								<input
									class="w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 pl-12 pr-4 text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all placeholder:text-on-surface-variant/40"
									style="width: 100%; background-color: #191b24; border: 1px solid #4e4632; border-radius: 8px; padding: 12px 12px 12px 48px; color: #e2e1ee;"
									placeholder="••••••••"
									type="password"
									value={password}
									onInput={e => this.setState({ password: (e.target as HTMLInputElement).value })}
									disabled={loading}
								/>
							</div>
						</div>

						{/* Login Button */}
						<button 
							class={`w-full bg-primary-container text-on-primary font-bold py-4 rounded-lg hover:brightness-110 active:scale-95 transition-all glow-hover flex items-center justify-center gap-2 mt-4 ${(!username || !password || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
							style={`width: 100%; background-color: #ffcb05; color: #3d2f00; font-weight: 700; padding: 16px; border-radius: 8px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 16px; ${(!username || !password || loading) ? 'opacity: 0.5; cursor: not-allowed;' : ''}`}
							type="submit"
							disabled={!username || !password || loading}
						>
							{loading ? 'Logging in...' : 'Login'}
							{!loading && <span class="material-symbols-outlined text-[20px]">arrow_forward</span>}
						</button>
					</form>

					{/* Support link */}
					<div class="mt-xl pt-md border-t border-outline-variant/30" style="margin-top: 40px; padding-top: 24px; border-top: 1px solid rgba(78, 70, 50, 0.3);">
						<div class="flex items-start gap-3 p-sm bg-secondary-container/10 border border-secondary-container/20 rounded-lg" style="display: flex; align-items: flex-start; gap: 12px; padding: 12px; background-color: rgba(38, 56, 184, 0.1); border: 1px solid rgba(38, 56, 184, 0.2); border-radius: 8px;">
							<span class="material-symbols-outlined text-secondary text-[18px]" style="color: #bcc2ff;">info</span>
							<p class="font-body-sm text-body-sm text-on-secondary-container" style="font-family: 'Manrope'; font-size: 14px; color: #aab3ff; margin: 0;">
								Contact <a class="text-secondary font-bold hover:underline decoration-2 underline-offset-4" style="color: #bcc2ff; font-weight: 700; text-decoration: none;" href="mailto:akkshaysr0107@gmail.com">akkshaysr0107@gmail.com</a> for an ID
							</p>
						</div>
					</div>
				</section>

				{/* Background Decorations */}
				<div class="fixed -bottom-20 -right-20 w-80 h-80 bg-primary-container/5 rounded-full blur-[100px] pointer-events-none -z-10" style="position: fixed; bottom: -80px; right: -80px; width: 320px; height: 320px; background-color: rgba(255, 203, 5, 0.05); border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: -10;"></div>
				<div class="fixed -top-20 -left-20 w-80 h-80 bg-secondary-container/5 rounded-full blur-[100px] pointer-events-none -z-10" style="position: fixed; top: -80px; left: -80px; width: 320px; height: 320px; background-color: rgba(38, 56, 184, 0.05); border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: -10;"></div>
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
