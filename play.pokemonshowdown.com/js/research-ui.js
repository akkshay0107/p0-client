"use strict";function _inheritsLoose(t,o){t.prototype=Object.create(o.prototype),t.prototype.constructor=t,_setPrototypeOf(t,o);}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t;},_setPrototypeOf(t,e);}var


















ResearchLandingPage=function(_preact$Component){function ResearchLandingPage(){var _this;for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}_this=_preact$Component.call.apply(_preact$Component,[this].concat(args))||this;_this.
state={
currentPage:'login',
selectedTeamIndex:-1,
isWaiting:false,
showSettings:false
};_this.
psSubscription=null;_this.
userSubscription=null;_this.


























































handleSelect=function(index){
_this.setState({selectedTeamIndex:index});
};_this.

handleDoubleClick=function(url){
if(url){
window.open(url,'_blank');
}else{
PS.alert("No PokéPaste link available for this team yet.");
}
};_this.

handleBattle=function(){
var selectedTeamIndex=_this.state.selectedTeamIndex;
if(selectedTeamIndex===-1)return;

var team=Config.researchTeams[selectedTeamIndex];

_this.setState({isWaiting:true});

PS.send("/utm "+team.packedTeam);
PS.send("/challenge Bot, gen9vgc2025regh");
};_this.

openSettings=function(){
_this.setState({showSettings:true});
};_this.

continueToTeams=function(){
localStorage.setItem('p0_info_seen','true');
_this.setState({currentPage:'teamselect'});
};return _this;}_inheritsLoose(ResearchLandingPage,_preact$Component);var _proto=ResearchLandingPage.prototype;_proto.componentDidMount=function componentDidMount(){var _this2=this;document.body.classList.add('research-mode');for(var roomid in PS.rooms){if(roomid&&!roomid.startsWith('battle-')){var room=PS.rooms[roomid];if(room){room.minimized=true;if(roomid==='rooms'||roomid==='lobby'){PS.hideRightRoom();}}}}this.psSubscription=PS.subscribe(function(){var hasBattle=Object.keys(PS.rooms).some(function(id){return id.startsWith('battle-');});if(hasBattle){document.body.classList.add('battle-active');}else{document.body.classList.remove('battle-active');}if(_this2.state.isWaiting&&hasBattle){_this2.setState({isWaiting:false});}});this.userSubscription=PS.user.subscribe(function(){if(PS.user.registered&&_this2.state.currentPage==='login'){var infoSeen=localStorage.getItem('p0_info_seen');_this2.setState({currentPage:infoSeen?'teamselect':'info'});}_this2.forceUpdate();});if(PS.user.registered){var infoSeen=localStorage.getItem('p0_info_seen');this.setState({currentPage:infoSeen?'teamselect':'info'});}PS.update();};_proto.componentWillUnmount=function componentWillUnmount(){document.body.classList.remove('research-mode');document.body.classList.remove('battle-active');if(this.psSubscription){this.psSubscription.unsubscribe();this.psSubscription=null;}if(this.userSubscription){this.userSubscription.unsubscribe();this.userSubscription=null;}};_proto.

render=function render(){var _this3=this;
var _this$state=this.state,currentPage=_this$state.currentPage,isWaiting=_this$state.isWaiting,showSettings=_this$state.showSettings;

if(!PS.user.registered||currentPage==='login'){
return preact.h(ResearchLoginPage,null);
}

if(currentPage==='info'){
return preact.h(ResearchInfoPage,{onContinue:this.continueToTeams});
}

return(
preact.h("div",{"class":"research-landing dark bg-[#11131b] min-h-screen w-full relative overflow-hidden text-[#e2e1ee] font-['Manrope']"},
preact.h("button",{
"class":"fixed top-6 left-6 w-12 h-12 rounded-lg bg-[#1d1f28] border border-[#4e4632] text-[#d2c5ab] flex items-center justify-center hover:text-[#ffcb05] hover:border-[#ffcb05] transition-all z-[100] shadow-lg",
onClick:function(){return _this3.setState({currentPage:'info'});},
title:"Information"},

preact.h("span",{"class":"material-symbols-outlined"},"info")
),
preact.h("button",{
"class":"fixed top-6 right-6 w-12 h-12 rounded-lg bg-[#1d1f28] border border-[#4e4632] text-[#d2c5ab] flex items-center justify-center hover:text-[#ffcb05] hover:border-[#ffcb05] transition-all z-[100] shadow-lg",
onClick:this.openSettings,
title:"Settings"},

preact.h("span",{"class":"material-symbols-outlined"},"settings")
),
showSettings&&
preact.h(ResearchSettingsModal,{onClose:function(){return _this3.setState({showSettings:false});}}),

isWaiting?
preact.h("div",{"class":"flex flex-col items-center justify-center h-screen w-full bg-[#11131b] text-[#e2e1ee]"},
preact.h("div",{"class":"w-16 h-16 border-4 border-[#ffcb05]/20 border-t-[#ffcb05] rounded-full animate-spin mb-8"}),
preact.h("h1",{"class":"text-3xl font-bold text-[#ffcb05] mb-2 font-['Spline_Sans']"},"Preparing Match..."),
preact.h("p",{"class":"text-[#d2c5ab]"},"Challenging ",preact.h("strong",null,"Bot")," with your selected team."),
preact.h("button",{
"class":"mt-8 px-6 py-2 rounded-lg border border-[#4e4632] text-[#d2c5ab] hover:bg-[#1d1f28] transition-all",
onClick:function(){return _this3.setState({isWaiting:false});}},
"Cancel"

)
):

preact.h(ResearchTeamSelectPage,{
selectedTeamIndex:this.state.selectedTeamIndex,
onSelect:this.handleSelect,
onDblClick:this.handleDoubleClick,
onBattle:this.handleBattle}
),



preact.h("div",{"class":"fixed -bottom-20 -right-20 w-80 h-80 bg-[#ffcb05]/5 rounded-full blur-[100px] pointer-events-none -z-10"}),
preact.h("div",{"class":"fixed -top-20 -left-20 w-80 h-80 bg-[#3B4CCA]/5 rounded-full blur-[100px] pointer-events-none -z-10"})
));

};return ResearchLandingPage;}(preact.Component);var


ResearchInfoPage=function(_preact$Component2){function ResearchInfoPage(){return _preact$Component2.apply(this,arguments)||this;}_inheritsLoose(ResearchInfoPage,_preact$Component2);var _proto2=ResearchInfoPage.prototype;_proto2.
render=function render(){
var logoUrl="p0-logo.png";

return(
preact.h("div",{"class":"dark bg-[#11131b] text-[#e2e1ee] font-['Manrope'] h-screen w-full flex flex-col items-center p-md relative overflow-hidden"},
preact.h("div",{"class":"w-full max-w-4xl z-10 flex flex-col h-full justify-center"},

preact.h("div",{"class":"text-center mb-8"},
preact.h("div",{"class":"flex justify-center items-center w-full mb-6"},
preact.h("img",{src:logoUrl,alt:"P0 Logo","class":"h-28 object-contain"})
),
preact.h("p",{"class":"max-w-2xl mx-auto font-['Manrope'] text-lg text-[#d2c5ab] opacity-80"},"An RL-trained VGC battle bot experiment. Please read carefully."

)
),


preact.h("div",{"class":"flex flex-col gap-4 mb-10 max-w-2xl mx-auto w-full"},
[
{id:'01',title:'Pick a Team',desc:'Choose from 6 pre-built teams. The bot will pick from its own pool.'},
{id:'02',title:'Start Battle',desc:'Click "Challenge Bot" to begin. Ensure you\'re ready.'},
{id:'03',title:'Team Preview',desc:'You MUST click "Open Team Sheet" during Team Preview.'},
{id:'04',title:'Play to End',desc:'Forfeiting is disabled. Please play every match to completion.'}].
map(function(step){return(
preact.h("div",{"class":"bg-[#161B26] border border-[#222938] p-5 rounded-lg transition-all hover:border-[#ffcb05]/30"},
preact.h("div",{"class":"flex items-center gap-4"},
preact.h("div",{"class":"flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[#1d1f28] border border-[#222938] rounded-lg"},
preact.h("span",{"class":"font-bold text-[#ffcb05] text-base"},step.id)
),
preact.h("div",{"class":"flex flex-col"},
preact.h("h3",{"class":"font-bold text-lg "+(step.id==='03'?'text-[#ffcb05]':'text-[#e2e1ee]')},step.title),
preact.h("p",{"class":"text-sm text-[#d2c5ab]"},step.desc)
)
)
));}
)
),


preact.h("div",{"class":"flex flex-col items-center"},
preact.h("button",{
"class":"bg-[#ffcb05] text-[#3d2f00] font-bold px-8 py-3 rounded-lg shadow-[0_8px_24px_rgba(255,203,5,0.2)] active:scale-95 transition-all hover:brightness-110 flex items-center gap-2 text-md",
onClick:this.props.onContinue},
"CONTINUE TO TEAM SELECTION",

preact.h("span",{"class":"material-symbols-outlined"},"arrow_forward")
)
)
),


preact.h("div",{"class":"fixed -bottom-20 -right-20 w-80 h-80 bg-[#ffcb05]/5 rounded-full blur-[100px] pointer-events-none -z-10"}),
preact.h("div",{"class":"fixed -top-20 -left-20 w-80 h-80 bg-[#3B4CCA]/5 rounded-full blur-[100px] pointer-events-none -z-10"})
));

};return ResearchInfoPage;}(preact.Component);var


ResearchTeamSelectPage=function(_preact$Component3){function ResearchTeamSelectPage(){return _preact$Component3.apply(this,arguments)||this;}_inheritsLoose(ResearchTeamSelectPage,_preact$Component3);var _proto3=ResearchTeamSelectPage.prototype;_proto3.





render=function render(){
var teams=Config.researchTeams||[];
var _this$props=this.props,selectedTeamIndex=_this$props.selectedTeamIndex,onSelect=_this$props.onSelect,onDblClick=_this$props.onDblClick,onBattle=_this$props.onBattle;
var logoUrl="p0-logo.png";

return(
preact.h("div",{"class":"w-full max-w-4xl mx-auto flex flex-col h-screen p-md relative z-10 font-['Manrope'] text-[#e2e1ee]"},

preact.h("header",{"class":"flex justify-center items-center w-full mb-12 mt-10"},
preact.h("img",{src:logoUrl,alt:"P0 Logo","class":"h-28 object-contain"})
),

preact.h("div",{"class":"text-center mb-10"},
preact.h("h1",{"class":"font-['Spline_Sans'] font-bold text-3xl mb-xs"},"Select Your Team"),
preact.h("p",{"class":"text-base text-[#d2c5ab]"},"Pick a team to challenge the bot."

)
),

preact.h("div",{"class":"flex flex-col gap-3 mb-6 overflow-y-auto pr-2 custom-scrollbar max-w-3xl mx-auto w-full"},
teams.map(function(team,index){return(
preact.h(ResearchTeamCard,{
key:index,
team:team,
isSelected:selectedTeamIndex===index,
onClick:function(){return onSelect(index);},
onDblClick:function(){return onDblClick(team.pokePasteUrl);}}
));}
)
),

preact.h("div",{"class":"flex flex-col items-center mt-auto pb-8"},
preact.h("button",{
"class":"bg-[#ffcb05] text-[#3d2f00] font-bold px-12 py-3.5 rounded-lg shadow-[0_8px_24px_rgba(255,203,5,0.2)] active:scale-95 transition-all hover:brightness-110 flex items-center gap-2 text-md "+(selectedTeamIndex===-1?'opacity-50 cursor-not-allowed grayscale':''),
disabled:selectedTeamIndex===-1,
onClick:onBattle},
"CHALLENGE BOT",

preact.h("span",{"class":"material-symbols-outlined"},"bolt")
),
preact.h("p",{"class":"mt-3 text-[10px] text-[#d2c5ab] opacity-60 uppercase tracking-[0.2em] font-bold"},"Double-click a team to view Pok\xE9paste")
)
));

};return ResearchTeamSelectPage;}(preact.Component);var



ResearchSettingsModal=function(_preact$Component4){function ResearchSettingsModal(){var _this4;for(var _len2=arguments.length,args=new Array(_len2),_key2=0;_key2<_len2;_key2++){args[_key2]=arguments[_key2];}_this4=_preact$Component4.call.apply(_preact$Component4,[this].concat(args))||this;_this4.
state={
newUsername:PS.user.name||'',
currentPasswordForUsername:'',
currentPasswordForPassword:'',
newPassword:'',
confirmPassword:'',
loading:false,
error:'',
success:''
};_this4.

handleChangeUsername=function(e){
e.preventDefault();
var _this4$state=_this4.state,newUsername=_this4$state.newUsername,currentPasswordForUsername=_this4$state.currentPasswordForUsername;
if(!newUsername||!currentPasswordForUsername)return;

_this4.setState({loading:true,error:'',success:''});

PSLoginServer.query('changeusername',{
name:PS.user.name,
pass:currentPasswordForUsername,
newname:newUsername
}).then(function(res){
_this4.setState({loading:false});
if(res!=null&&res.actionsuccess){
PS.alert("Username updated successfully! You will be logged out to complete the change.");
PS.user.logOut();
window.location.reload();
}else{
_this4.setState({error:(res==null?void 0:res.actionerror)||'Failed to update username'});
}
});
};_this4.

handleChangePassword=function(e){
e.preventDefault();
var _this4$state2=_this4.state,currentPasswordForPassword=_this4$state2.currentPasswordForPassword,newPassword=_this4$state2.newPassword,confirmPassword=_this4$state2.confirmPassword;
if(!currentPasswordForPassword||!newPassword||!confirmPassword)return;

if(newPassword!==confirmPassword){
_this4.setState({error:'New passwords do not match'});
return;
}

_this4.setState({loading:true,error:'',success:''});

PSLoginServer.query('changepassword',{
name:PS.user.name,
pass:currentPasswordForPassword,
newpass:newPassword
}).then(function(res){
_this4.setState({loading:false});
if(res!=null&&res.actionsuccess){
_this4.setState({
success:'Password updated successfully!',
currentPasswordForPassword:'',
newPassword:'',
confirmPassword:''
});
}else{
_this4.setState({error:(res==null?void 0:res.actionerror)||'Failed to update password'});
}
});
};return _this4;}_inheritsLoose(ResearchSettingsModal,_preact$Component4);var _proto4=ResearchSettingsModal.prototype;_proto4.

render=function render(){var _this5=this;
var _this$state2=this.state,newUsername=_this$state2.newUsername,newPassword=_this$state2.newPassword,confirmPassword=_this$state2.confirmPassword,loading=_this$state2.loading,error=_this$state2.error,success=_this$state2.success;

return(
preact.h("div",{"class":"fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10000] font-['Manrope']",onClick:function(e){return e.target===e.currentTarget&&_this5.props.onClose();}},
preact.h("div",{"class":"bg-[#11131b] border border-[#4e4632] p-8 rounded-2xl shadow-2xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto custom-scrollbar text-[#e2e1ee]",onClick:function(e){return e.stopPropagation();}},
preact.h("div",{"class":"flex justify-between items-start mb-8"},
preact.h("div",null,
preact.h("h2",{"class":"text-2xl font-bold font-['Spline_Sans']"},"Account Settings"),
preact.h("p",{"class":"text-sm text-[#d2c5ab]"},"Manage your participant profile")
),
preact.h("button",{onClick:this.props.onClose,"class":"text-[#d2c5ab] hover:text-[#ffcb05] transition-colors"},
preact.h("span",{"class":"material-symbols-outlined text-2xl"},"close")
)
),

error&&preact.h("div",{"class":"bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6 text-sm text-center"},error),
success&&preact.h("div",{"class":"bg-[#ffcb05]/10 border border-[#ffcb05]/20 text-[#ffcb05] p-4 rounded-lg mb-6 text-sm text-center"},success),

preact.h("div",{"class":"space-y-8"},

preact.h("section",null,
preact.h("h3",{"class":"text-xs font-bold text-[#d2c5ab] uppercase tracking-widest mb-4"},"Change Username"),
preact.h("form",{onSubmit:this.handleChangeUsername,"class":"space-y-4"},
preact.h("div",{"class":"space-y-1"},
preact.h("label",{"class":"text-[10px] font-bold text-[#d2c5ab]/60 uppercase tracking-widest"},"New Username"),
preact.h("input",{
"class":"w-full bg-[#191b24] border border-[#4e4632] rounded-lg p-3 text-[#e2e1ee] focus:outline-none focus:border-[#ffcb05] transition-all",
type:"text",
value:newUsername,
onInput:function(e){return _this5.setState({newUsername:e.target.value});},
disabled:loading}
)
),
preact.h("div",{"class":"space-y-1"},
preact.h("label",{"class":"text-[10px] font-bold text-[#d2c5ab]/60 uppercase tracking-widest"},"Current Password"),
preact.h("input",{
"class":"w-full bg-[#191b24] border border-[#4e4632] rounded-lg p-3 text-[#e2e1ee] focus:outline-none focus:border-[#ffcb05] transition-all",
type:"password",
value:this.state.currentPasswordForUsername,
onInput:function(e){return _this5.setState({currentPasswordForUsername:e.target.value});},
disabled:loading}
)
),
preact.h("button",{
type:"submit",
"class":"w-full bg-[#ffcb05] text-[#3d2f00] font-bold py-3 rounded-lg hover:brightness-110 active:scale-95 transition-all "+(loading||!newUsername||!this.state.currentPasswordForUsername?'opacity-50 cursor-not-allowed grayscale':''),
disabled:loading||!newUsername||!this.state.currentPasswordForUsername},

loading?'Updating...':'Update Username'
),
preact.h("p",{"class":"text-[10px] text-[#d2c5ab]/40 text-center"},"Note: This will log you out and require re-login.")
)
),


preact.h("section",null,
preact.h("h3",{"class":"text-xs font-bold text-[#d2c5ab] uppercase tracking-widest mb-4"},"Change Password"),
preact.h("form",{onSubmit:this.handleChangePassword,"class":"space-y-4"},
preact.h("div",{"class":"space-y-1"},
preact.h("label",{"class":"text-[10px] font-bold text-[#d2c5ab]/60 uppercase tracking-widest"},"Current Password"),
preact.h("input",{
"class":"w-full bg-[#191b24] border border-[#4e4632] rounded-lg p-3 text-[#e2e1ee] focus:outline-none focus:border-[#ffcb05] transition-all",
type:"password",
value:this.state.currentPasswordForPassword,
onInput:function(e){return _this5.setState({currentPasswordForPassword:e.target.value});},
disabled:loading}
)
),
preact.h("div",{"class":"space-y-1"},
preact.h("label",{"class":"text-[10px] font-bold text-[#d2c5ab]/60 uppercase tracking-widest"},"New Password"),
preact.h("input",{
"class":"w-full bg-[#191b24] border border-[#4e4632] rounded-lg p-3 text-[#e2e1ee] focus:outline-none focus:border-[#ffcb05] transition-all",
type:"password",
value:newPassword,
onInput:function(e){return _this5.setState({newPassword:e.target.value});},
disabled:loading}
)
),
preact.h("div",{"class":"space-y-1"},
preact.h("label",{"class":"text-[10px] font-bold text-[#d2c5ab]/60 uppercase tracking-widest"},"Confirm New Password"),
preact.h("input",{
"class":"w-full bg-[#191b24] border border-[#4e4632] rounded-lg p-3 text-[#e2e1ee] focus:outline-none focus:border-[#ffcb05] transition-all",
type:"password",
value:confirmPassword,
onInput:function(e){return _this5.setState({confirmPassword:e.target.value});},
disabled:loading}
)
),
preact.h("button",{
type:"submit",
"class":"w-full bg-[#ffcb05] text-[#3d2f00] font-bold py-3 rounded-lg hover:brightness-110 active:scale-95 transition-all "+(loading||!this.state.currentPasswordForPassword||!newPassword||!confirmPassword?'opacity-50 cursor-not-allowed grayscale':''),
disabled:loading||!this.state.currentPasswordForPassword||!newPassword||!confirmPassword},

loading?'Updating...':'Update Password'
)
)
)
)
)
));

};return ResearchSettingsModal;}(preact.Component);var



ResearchLoginPage=function(_preact$Component5){function ResearchLoginPage(){var _this6;for(var _len3=arguments.length,args=new Array(_len3),_key3=0;_key3<_len3;_key3++){args[_key3]=arguments[_key3];}_this6=_preact$Component5.call.apply(_preact$Component5,[this].concat(args))||this;_this6.
state={
username:'',
password:'',
loading:false
};_this6.

handleLogin=function(e){
e.preventDefault();
var _this6$state=_this6.state,username=_this6$state.username,password=_this6$state.password;
if(!username||!password)return;

_this6.setState({loading:true});
PS.user.changeNameWithPassword(username,password);
};return _this6;}_inheritsLoose(ResearchLoginPage,_preact$Component5);var _proto5=ResearchLoginPage.prototype;_proto5.

render=function render(){var _PS$user$state,_this7=this;
var _this$state3=this.state,username=_this$state3.username,password=_this$state3.password,loading=_this$state3.loading;
var error=(_PS$user$state=PS.user.state)==null?void 0:_PS$user$state.error;
var logoUrl="p0-logo.png";

return(
preact.h("div",{"class":"dark bg-[#11131b] text-[#e2e1ee] font-['Manrope'] min-h-screen flex flex-col items-center justify-center p-md overflow-hidden relative"},

preact.h("header",{"class":"flex justify-center items-center w-full mb-12"},
preact.h("img",{src:logoUrl,alt:"P0 Logo","class":"h-28 object-contain"})
),

preact.h("section",{"class":"relative w-full max-w-[440px] bg-[#1d1f28] border border-[#4e4632] p-10 rounded-2xl shadow-2xl z-10"},
preact.h("div",{"class":"absolute top-4 right-4"},
preact.h("span",{"class":"px-2 py-0.5 rounded text-[10px] font-bold bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 text-[#ffb4ab] uppercase tracking-widest"},"Alpha"

)
),

preact.h("div",{"class":"mb-10 text-center"},
preact.h("h2",{"class":"font-['Spline_Sans'] font-bold text-2xl mb-xs"},"Play against P0"),
preact.h("p",{"class":"text-sm text-[#d2c5ab]"},"Enter participant details to continue")
),

preact.h("form",{"class":"space-y-6",onSubmit:this.handleLogin},
error&&preact.h("p",{"class":"text-[#ffb4ab] text-center mb-4 text-sm"},error),

preact.h("div",{"class":"space-y-1"},
preact.h("label",{"class":"text-[10px] font-bold text-[#d2c5ab] uppercase tracking-widest"},"Username"),
preact.h("div",{"class":"relative"},
preact.h("span",{"class":"material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#d2c5ab] text-[20px]"},"person"),
preact.h("input",{
"class":"w-full bg-[#191b24] border border-[#4e4632] rounded-lg py-3 pl-12 pr-4 text-[#e2e1ee] focus:outline-none focus:border-[#ffcb05] transition-all placeholder:text-[#d2c5ab]/30",
placeholder:"Enter your username",
type:"text",
value:username,
onInput:function(e){return _this7.setState({username:e.target.value});},
disabled:loading,
autoFocus:true}
)
)
),


preact.h("div",{"class":"space-y-1"},
preact.h("label",{"class":"text-[10px] font-bold text-[#d2c5ab] uppercase tracking-widest"},"Password"),
preact.h("div",{"class":"relative"},
preact.h("span",{"class":"material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#d2c5ab] text-[20px]"},"lock"),
preact.h("input",{
"class":"w-full bg-[#191b24] border border-[#4e4632] rounded-lg py-3 pl-12 pr-4 text-[#e2e1ee] focus:outline-none focus:border-[#ffcb05] transition-all placeholder:text-[#d2c5ab]/30",
placeholder:"\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
type:"password",
value:password,
onInput:function(e){return _this7.setState({password:e.target.value});},
disabled:loading}
)
)
),


preact.h("button",{
"class":"w-full bg-[#ffcb05] text-[#3d2f00] font-bold py-4 rounded-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 "+(!username||!password||loading?'opacity-50 cursor-not-allowed grayscale':''),
type:"submit",
disabled:!username||!password||loading},

loading?'Logging in...':'Login',
!loading&&preact.h("span",{"class":"material-symbols-outlined text-[20px]"},"arrow_forward")
)
),


preact.h("div",{"class":"mt-10 pt-6 border-t border-[#4e4632]/30"},
preact.h("div",{"class":"flex items-start gap-3 p-3 bg-[#3B4CCA]/5 border border-[#3B4CCA]/10 rounded-lg"},
preact.h("span",{"class":"material-symbols-outlined text-[#3B4CCA] text-[18px]"},"info"),
preact.h("p",{"class":"text-xs text-[#aab3ff] leading-relaxed"},"Contact ",
preact.h("a",{"class":"text-[#bcc2ff] font-bold hover:underline",href:"mailto:akkshaysr0107@gmail.com"},"akkshaysr0107@gmail.com")," for an ID"
)
)
)
),


preact.h("div",{"class":"fixed -bottom-20 -right-20 w-80 h-80 bg-[#ffcb05]/5 rounded-full blur-[100px] pointer-events-none -z-10"}),
preact.h("div",{"class":"fixed -top-20 -left-20 w-80 h-80 bg-[#3B4CCA]/5 rounded-full blur-[100px] pointer-events-none -z-10"})
));

};return ResearchLoginPage;}(preact.Component);var


ResearchTeamCard=function(_preact$Component6){function ResearchTeamCard(){var _this8;for(var _len4=arguments.length,args=new Array(_len4),_key4=0;_key4<_len4;_key4++){args[_key4]=arguments[_key4];}_this8=_preact$Component6.call.apply(_preact$Component6,[this].concat(args))||this;_this8.





packedTeam='';_this8.
icons=null;return _this8;}_inheritsLoose(ResearchTeamCard,_preact$Component6);var _proto6=ResearchTeamCard.prototype;_proto6.

componentWillMount=function componentWillMount(){
var team=this.props.team;
var sets=Teams["import"](team.teamExport);
this.packedTeam=Teams.pack(sets);
team.packedTeam=this.packedTeam;

this.icons=Teams.unpackSpeciesOnly(this.packedTeam).map(function(pokemon){return(
preact.h(PSIcon,{pokemon:pokemon}));}
);
};_proto6.

render=function render(){
var _this$props2=this.props,team=_this$props2.team,isSelected=_this$props2.isSelected,onClick=_this$props2.onClick,onDblClick=_this$props2.onDblClick;

return(
preact.h("div",{
"class":"flex items-center justify-between px-6 py-4 rounded-xl cursor-pointer transition-all border "+(
isSelected?
'bg-[#ffcb05]/10 border-[#ffcb05] shadow-[0_0_20px_rgba(255,203,5,0.1)]':
'bg-[#161B26] border-[#222938] hover:border-[#4e4632] hover:bg-[#1d2433]'),

onClick:onClick,
onDblClick:onDblClick},

preact.h("span",{"class":"font-bold text-xl transition-colors whitespace-nowrap mr-8 "+(isSelected?'text-[#ffcb05]':'text-[#e2e1ee]')},
team.name
),

preact.h("div",{"class":"flex items-center gap-8"},
preact.h("div",{"class":"flex gap-1.5 opacity-90 scale-90 origin-right"},
this.icons
),

preact.h("div",{"class":"flex items-center justify-center w-8 h-8 rounded-full border border-[#4e4632] transition-all"},
isSelected?
preact.h("span",{"class":"material-symbols-outlined text-[#ffcb05] text-2xl font-bold"},"check_circle"):

preact.h("div",{"class":"w-2 h-2 rounded-full bg-[#4e4632]/30"})

)
)
));

};return ResearchTeamCard;}(preact.Component);


PS.addRoomType(ResearchLandingPage);
//# sourceMappingURL=research-ui.js.map