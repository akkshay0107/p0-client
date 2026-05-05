import preact from "../js/lib/preact";
import { Config, PS, PSRoom, type RoomID } from "./client-main";
import { PSIcon, PSPanelWrapper, PSRoomPanel } from "./panels";
import { Teams } from "./battle-teams";
import { PSLoginServer } from "./client-connection";

/**
 * Modern Electric Design System Tokens
 * Colors:
 * - Primary (Yellow): #ffcb05
 * - Secondary (Blue): #3B4CCA
 * - Background (Dark): #11131b
 * - Surface (Navy): #1d1f28
 * - Surface Muted: #161B26
 * - Border: #4e4632
 * - Text Primary: #e2e1ee
 * - Text Secondary: #d2c5ab
 */

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
			<div class="research-landing dark bg-[#11131b] min-h-screen w-full relative overflow-hidden text-[#e2e1ee] font-['Manrope']">
				<button 
					class="fixed top-6 left-6 w-12 h-12 rounded-lg bg-[#1d1f28] border border-[#4e4632] text-[#d2c5ab] flex items-center justify-center hover:text-[#ffcb05] hover:border-[#ffcb05] transition-all z-[100] shadow-lg"
					onClick={() => this.setState({ currentPage: 'info' })}
					title="Information"
				>
					<span class="material-symbols-outlined">info</span>
				</button>
				<button 
					class="fixed top-6 right-6 w-12 h-12 rounded-lg bg-[#1d1f28] border border-[#4e4632] text-[#d2c5ab] flex items-center justify-center hover:text-[#ffcb05] hover:border-[#ffcb05] transition-all z-[100] shadow-lg"
					onClick={this.openSettings}
					title="Settings"
				>
					<span class="material-symbols-outlined">settings</span>
				</button>
				{showSettings && (
					<ResearchSettingsModal onClose={() => this.setState({ showSettings: false })} />
				)}
				{isWaiting ? (
					<div class="flex flex-col items-center justify-center h-screen w-full bg-[#11131b] text-[#e2e1ee]">
						<div class="w-16 h-16 border-4 border-[#ffcb05]/20 border-t-[#ffcb05] rounded-full animate-spin mb-8"></div>
						<h1 class="text-3xl font-bold text-[#ffcb05] mb-2 font-['Spline_Sans']">Preparing Match...</h1>
						<p class="text-[#d2c5ab]">Challenging <strong>Bot</strong> with your selected team.</p>
						<button 
							class="mt-8 px-6 py-2 rounded-lg border border-[#4e4632] text-[#d2c5ab] hover:bg-[#1d1f28] transition-all"
							onClick={() => this.setState({ isWaiting: false })}
						>
							Cancel
						</button>
					</div>
				) : (
					<ResearchTeamSelectPage 
						selectedTeamIndex={this.state.selectedTeamIndex}
						onSelect={this.handleSelect}
						onDblClick={this.handleDoubleClick}
						onBattle={this.handleBattle}
					/>
				)}

				{/* Background Decoration */}
				<div class="fixed -bottom-20 -right-20 w-80 h-80 bg-[#ffcb05]/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
				<div class="fixed -top-20 -left-20 w-80 h-80 bg-[#3B4CCA]/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
			</div>
		);
	}
}

class ResearchInfoPage extends preact.Component<{ onContinue: () => void }> {
	override render() {
		const logoUrl = "p0-logo.png";

		return (
			<div class="dark bg-[#11131b] text-[#e2e1ee] font-['Manrope'] h-screen w-full flex flex-col items-center p-md relative overflow-hidden">
				<div class="w-full max-w-4xl z-10 flex flex-col h-full justify-center">
					{/* Hero Branding Section */}
					<div class="text-center mb-8">
						<div class="flex justify-center items-center w-full mb-6">
							<img src={logoUrl} alt="P0 Logo" class="h-28 object-contain" />
						</div>
						<p class="max-w-2xl mx-auto font-['Manrope'] text-lg text-[#d2c5ab] opacity-80">
							An RL-trained VGC battle bot experiment. Please read carefully.
						</p>
					</div>

					{/* Instructions - Vertical stack */}
					<div class="flex flex-col gap-4 mb-10 max-w-2xl mx-auto w-full">
						{[
							{ id: '01', title: 'Pick a Team', desc: 'Choose from 6 pre-built teams. The bot will pick from its own pool.' },
							{ id: '02', title: 'Start Battle', desc: 'Click "Challenge Bot" to begin. Ensure you\'re ready.' },
							{ id: '03', title: 'Team Preview', desc: 'You MUST click "Open Team Sheet" during Team Preview.' },
							{ id: '04', title: 'Play to End', desc: 'Forfeiting is disabled. Please play every match to completion.' }
						].map(step => (
							<div class="bg-[#161B26] border border-[#222938] p-5 rounded-lg transition-all hover:border-[#ffcb05]/30">
								<div class="flex items-center gap-4">
									<div class="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[#1d1f28] border border-[#222938] rounded-lg">
										<span class="font-bold text-[#ffcb05] text-base">{step.id}</span>
									</div>
									<div class="flex flex-col">
										<h3 class={`font-bold text-lg ${step.id === '03' ? 'text-[#ffcb05]' : 'text-[#e2e1ee]'}`}>{step.title}</h3>
										<p class="text-sm text-[#d2c5ab]">{step.desc}</p>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Action Footer */}
					<div class="flex flex-col items-center">
						<button 
							class="bg-[#ffcb05] text-[#3d2f00] font-bold px-8 py-3 rounded-lg shadow-[0_8px_24px_rgba(255,203,5,0.2)] active:scale-95 transition-all hover:brightness-110 flex items-center gap-2 text-md"
							onClick={this.props.onContinue}
						>
							CONTINUE TO TEAM SELECTION 
							<span class="material-symbols-outlined">arrow_forward</span>
						</button>
					</div>
				</div>

				{/* Background Decoration */}
				<div class="fixed -bottom-20 -right-20 w-80 h-80 bg-[#ffcb05]/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
				<div class="fixed -top-20 -left-20 w-80 h-80 bg-[#3B4CCA]/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
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
		const logoUrl = "p0-logo.png";

		return (
			<div class="w-full max-w-4xl mx-auto flex flex-col h-screen p-md relative z-10 font-['Manrope'] text-[#e2e1ee]">
				{/* Top Logo */}
				<header class="flex justify-center items-center w-full mb-12 mt-10">
					<img src={logoUrl} alt="P0 Logo" class="h-28 object-contain" />
				</header>

				<div class="text-center mb-10">
					<h1 class="font-['Spline_Sans'] font-bold text-3xl mb-xs">Select Your Team</h1>
					<p class="text-base text-[#d2c5ab]">
						Pick a team to challenge the bot.
					</p>
				</div>

				<div class="flex flex-col gap-3 mb-6 overflow-y-auto pr-2 custom-scrollbar max-w-3xl mx-auto w-full">
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

				<div class="flex flex-col items-center mt-auto pb-8">
					<button 
						class={`bg-[#ffcb05] text-[#3d2f00] font-bold px-12 py-3.5 rounded-lg shadow-[0_8px_24px_rgba(255,203,5,0.2)] active:scale-95 transition-all hover:brightness-110 flex items-center gap-2 text-md ${selectedTeamIndex === -1 ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
						disabled={selectedTeamIndex === -1}
						onClick={onBattle}
					>
						CHALLENGE BOT
						<span class="material-symbols-outlined">bolt</span>
					</button>
					<p class="mt-3 text-[10px] text-[#d2c5ab] opacity-60 uppercase tracking-[0.2em] font-bold">Double-click a team to view Poképaste</p>
				</div>
			</div>
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
			<div class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10000] font-['Manrope']" onClick={(e) => e.target === e.currentTarget && this.props.onClose()}>
				<div class="bg-[#11131b] border border-[#4e4632] p-8 rounded-2xl shadow-2xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto custom-scrollbar text-[#e2e1ee]" onClick={e => e.stopPropagation()}>
					<div class="flex justify-between items-start mb-8">
						<div>
							<h2 class="text-2xl font-bold font-['Spline_Sans']">Account Settings</h2>
							<p class="text-sm text-[#d2c5ab]">Manage your participant profile</p>
						</div>
						<button onClick={this.props.onClose} class="text-[#d2c5ab] hover:text-[#ffcb05] transition-colors">
							<span class="material-symbols-outlined text-2xl">close</span>
						</button>
					</div>

					{error && <div class="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6 text-sm text-center">{error}</div>}
					{success && <div class="bg-[#ffcb05]/10 border border-[#ffcb05]/20 text-[#ffcb05] p-4 rounded-lg mb-6 text-sm text-center">{success}</div>}

					<div class="space-y-8">
						{/* Change Username */}
						<section>
							<h3 class="text-xs font-bold text-[#d2c5ab] uppercase tracking-widest mb-4">Change Username</h3>
							<form onSubmit={this.handleChangeUsername} class="space-y-4">
								<div class="space-y-1">
									<label class="text-[10px] font-bold text-[#d2c5ab]/60 uppercase tracking-widest">New Username</label>
									<input 
										class="w-full bg-[#191b24] border border-[#4e4632] rounded-lg p-3 text-[#e2e1ee] focus:outline-none focus:border-[#ffcb05] transition-all"
										type="text" 
										value={newUsername} 
										onInput={e => this.setState({ newUsername: (e.target as HTMLInputElement).value })}
										disabled={loading}
									/>
								</div>
								<div class="space-y-1">
									<label class="text-[10px] font-bold text-[#d2c5ab]/60 uppercase tracking-widest">Current Password</label>
									<input 
										class="w-full bg-[#191b24] border border-[#4e4632] rounded-lg p-3 text-[#e2e1ee] focus:outline-none focus:border-[#ffcb05] transition-all"
										type="password" 
										value={this.state.currentPasswordForUsername}
										onInput={e => this.setState({ currentPasswordForUsername: (e.target as HTMLInputElement).value })}
										disabled={loading}
									/>
								</div>
								<button 
									type="submit" 
									class={`w-full bg-[#ffcb05] text-[#3d2f00] font-bold py-3 rounded-lg hover:brightness-110 active:scale-95 transition-all ${loading || !newUsername || !this.state.currentPasswordForUsername ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
									disabled={loading || !newUsername || !this.state.currentPasswordForUsername}
								>
									{loading ? 'Updating...' : 'Update Username'}
								</button>
								<p class="text-[10px] text-[#d2c5ab]/40 text-center">Note: This will log you out and require re-login.</p>
							</form>
						</section>

						{/* Change Password */}
						<section>
							<h3 class="text-xs font-bold text-[#d2c5ab] uppercase tracking-widest mb-4">Change Password</h3>
							<form onSubmit={this.handleChangePassword} class="space-y-4">
								<div class="space-y-1">
									<label class="text-[10px] font-bold text-[#d2c5ab]/60 uppercase tracking-widest">Current Password</label>
									<input 
										class="w-full bg-[#191b24] border border-[#4e4632] rounded-lg p-3 text-[#e2e1ee] focus:outline-none focus:border-[#ffcb05] transition-all"
										type="password" 
										value={this.state.currentPasswordForPassword}
										onInput={e => this.setState({ currentPasswordForPassword: (e.target as HTMLInputElement).value })}
										disabled={loading}
									/>
								</div>
								<div class="space-y-1">
									<label class="text-[10px] font-bold text-[#d2c5ab]/60 uppercase tracking-widest">New Password</label>
									<input 
										class="w-full bg-[#191b24] border border-[#4e4632] rounded-lg p-3 text-[#e2e1ee] focus:outline-none focus:border-[#ffcb05] transition-all"
										type="password" 
										value={newPassword} 
										onInput={e => this.setState({ newPassword: (e.target as HTMLInputElement).value })}
										disabled={loading}
									/>
								</div>
								<div class="space-y-1">
									<label class="text-[10px] font-bold text-[#d2c5ab]/60 uppercase tracking-widest">Confirm New Password</label>
									<input 
										class="w-full bg-[#191b24] border border-[#4e4632] rounded-lg p-3 text-[#e2e1ee] focus:outline-none focus:border-[#ffcb05] transition-all"
										type="password" 
										value={confirmPassword} 
										onInput={e => this.setState({ confirmPassword: (e.target as HTMLInputElement).value })}
										disabled={loading}
									/>
								</div>
								<button 
									type="submit" 
									class={`w-full bg-[#ffcb05] text-[#3d2f00] font-bold py-3 rounded-lg hover:brightness-110 active:scale-95 transition-all ${loading || !this.state.currentPasswordForPassword || !newPassword || !confirmPassword ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
									disabled={loading || !this.state.currentPasswordForPassword || !newPassword || !confirmPassword}
								>
									{loading ? 'Updating...' : 'Update Password'}
								</button>
							</form>
						</section>
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
			<div class="dark bg-[#11131b] text-[#e2e1ee] font-['Manrope'] min-h-screen flex flex-col items-center justify-center p-md overflow-hidden relative">
				{/* Top Logo */}
				<header class="flex justify-center items-center w-full mb-12">
					<img src={logoUrl} alt="P0 Logo" class="h-28 object-contain" />
				</header>

				<section class="relative w-full max-w-[440px] bg-[#1d1f28] border border-[#4e4632] p-10 rounded-2xl shadow-2xl z-10">
					<div class="absolute top-4 right-4">
						<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 text-[#ffb4ab] uppercase tracking-widest">
							Alpha
						</span>
					</div>

					<div class="mb-10 text-center">
						<h2 class="font-['Spline_Sans'] font-bold text-2xl mb-xs">Play against P0</h2>
						<p class="text-sm text-[#d2c5ab]">Enter participant details to continue</p>
					</div>

					<form class="space-y-6" onSubmit={this.handleLogin}>
						{error && <p class="text-[#ffb4ab] text-center mb-4 text-sm">{error}</p>}

						<div class="space-y-1">
							<label class="text-[10px] font-bold text-[#d2c5ab] uppercase tracking-widest">Username</label>
							<div class="relative">
								<span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#d2c5ab] text-[20px]">person</span>
								<input
									class="w-full bg-[#191b24] border border-[#4e4632] rounded-lg py-3 pl-12 pr-4 text-[#e2e1ee] focus:outline-none focus:border-[#ffcb05] transition-all placeholder:text-[#d2c5ab]/30"
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
						<div class="space-y-1">
							<label class="text-[10px] font-bold text-[#d2c5ab] uppercase tracking-widest">Password</label>
							<div class="relative">
								<span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#d2c5ab] text-[20px]">lock</span>
								<input
									class="w-full bg-[#191b24] border border-[#4e4632] rounded-lg py-3 pl-12 pr-4 text-[#e2e1ee] focus:outline-none focus:border-[#ffcb05] transition-all placeholder:text-[#d2c5ab]/30"
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
							class={`w-full bg-[#ffcb05] text-[#3d2f00] font-bold py-4 rounded-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 ${(!username || !password || loading) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
							type="submit"
							disabled={!username || !password || loading}
						>
							{loading ? 'Logging in...' : 'Login'}
							{!loading && <span class="material-symbols-outlined text-[20px]">arrow_forward</span>}
						</button>
					</form>

					{/* Support link */}
					<div class="mt-10 pt-6 border-t border-[#4e4632]/30">
						<div class="flex items-start gap-3 p-3 bg-[#3B4CCA]/5 border border-[#3B4CCA]/10 rounded-lg">
							<span class="material-symbols-outlined text-[#3B4CCA] text-[18px]">info</span>
							<p class="text-xs text-[#aab3ff] leading-relaxed">
								Contact <a class="text-[#bcc2ff] font-bold hover:underline" href="mailto:akkshaysr0107@gmail.com">akkshaysr0107@gmail.com</a> for an ID
							</p>
						</div>
					</div>
				</section>

				{/* Background Decorations */}
				<div class="fixed -bottom-20 -right-20 w-80 h-80 bg-[#ffcb05]/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
				<div class="fixed -top-20 -left-20 w-80 h-80 bg-[#3B4CCA]/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
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
				class={`flex items-center justify-between px-6 py-4 rounded-xl cursor-pointer transition-all border ${
					isSelected 
						? 'bg-[#ffcb05]/10 border-[#ffcb05] shadow-[0_0_20px_rgba(255,203,5,0.1)]' 
						: 'bg-[#161B26] border-[#222938] hover:border-[#4e4632] hover:bg-[#1d2433]'
				}`}
				onClick={onClick}
				onDblClick={onDblClick}
			>
				<span class={`font-bold text-xl transition-colors whitespace-nowrap mr-8 ${isSelected ? 'text-[#ffcb05]' : 'text-[#e2e1ee]'}`}>
					{team.name}
				</span>

				<div class="flex items-center gap-8">
					<div class="flex gap-1.5 opacity-90 scale-90 origin-right">
						{this.icons}
					</div>
					
					<div class="flex items-center justify-center w-8 h-8 rounded-full border border-[#4e4632] transition-all">
						{isSelected ? (
							<span class="material-symbols-outlined text-[#ffcb05] text-2xl font-bold">check_circle</span>
						) : (
							<div class="w-2 h-2 rounded-full bg-[#4e4632]/30"></div>
						)}
					</div>
				</div>
			</div>
		);
	}
}

PS.addRoomType(ResearchLandingPage);
