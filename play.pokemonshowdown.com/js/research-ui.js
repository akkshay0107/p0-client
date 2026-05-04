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
preact.h("div",{"class":"research-landing"},
preact.h("button",{
"class":"nav-button info-button",
onClick:function(){return _this3.setState({currentPage:'info'});},
title:"Information"},

preact.h("i",{"class":"fa fa-info-circle"})
),
preact.h("button",{
"class":"nav-button settings-button",
onClick:this.openSettings,
title:"Settings"},

preact.h("i",{"class":"fa fa-cog"})
),
showSettings&&
preact.h(ResearchSettingsModal,{onClose:function(){return _this3.setState({showSettings:false});}}),

isWaiting?
preact.h("div",{"class":"research-waiting"},
preact.h("div",{"class":"spinner"}),
preact.h("h1",{style:"color: var(--p0-accent-blue)"},"Preparing Match..."),
preact.h("p",null,"Challenging ",preact.h("strong",null,"Bot")," with your selected team."),
preact.h("button",{"class":"button",style:"margin-top: 20px; background: transparent; border: 1px solid var(--p0-border); color: var(--p0-text-secondary); padding: 8px 16px; border-radius: 8px;",onClick:function(){return _this3.setState({isWaiting:false});}},"Cancel")
):

preact.h(ResearchTeamSelectPage,{
selectedTeamIndex:this.state.selectedTeamIndex,
onSelect:this.handleSelect,
onDblClick:this.handleDoubleClick,
onBattle:this.handleBattle}
)

));

};return ResearchLandingPage;}(preact.Component);var


ResearchInfoPage=function(_preact$Component2){function ResearchInfoPage(){return _preact$Component2.apply(this,arguments)||this;}_inheritsLoose(ResearchInfoPage,_preact$Component2);var _proto2=ResearchInfoPage.prototype;_proto2.
render=function render(){
var logoUrl="p0-logo.png";

return(
preact.h("div",{"class":"dark bg-[#11131b] text-on-surface font-body-md h-screen w-full flex flex-col items-center p-md relative overflow-hidden"},
preact.h("div",{"class":"w-full max-w-4xl z-10 flex flex-col h-full justify-center"},

preact.h("div",{"class":"text-center mb-6"},
preact.h("div",{"class":"flex justify-center items-center w-full mb-3"},
preact.h("img",{src:logoUrl,alt:"P0 Logo","class":"h-16 object-contain"})
),
preact.h("p",{"class":"max-w-2xl mx-auto font-body-md text-body-md text-on-surface-variant opacity-80"},"An RL-trained VGC battle bot experiment. Please read carefully."

)
),


preact.h("div",{"class":"flex flex-col gap-4 mb-10 max-w-2xl mx-auto w-full"},

preact.h("div",{"class":"bg-[#161B26] border border-[#222938] p-5 rounded-lg electric-glow transition-all hover:border-primary-container/30"},
preact.h("div",{"class":"flex items-center gap-4"},
preact.h("div",{"class":"flex-shrink-0 w-12 h-12 flex items-center justify-center bg-surface-container-low border border-[#222938] rounded-lg"},
preact.h("span",{"class":"font-bold text-primary-container text-base"},"01")
),
preact.h("div",{"class":"flex flex-col"},
preact.h("h3",{"class":"font-bold text-on-surface text-lg"},"Pick a Team"),
preact.h("p",{"class":"text-sm text-on-surface-variant"},"Choose from 6 pre-built teams. The bot will pick from its own pool.")
)
)
),


preact.h("div",{"class":"bg-[#161B26] border border-[#222938] p-5 rounded-lg electric-glow transition-all hover:border-primary-container/30"},
preact.h("div",{"class":"flex items-center gap-4"},
preact.h("div",{"class":"flex-shrink-0 w-12 h-12 flex items-center justify-center bg-surface-container-low border border-[#222938] rounded-lg"},
preact.h("span",{"class":"font-bold text-primary-container text-base"},"02")
),
preact.h("div",{"class":"flex flex-col"},
preact.h("h3",{"class":"font-bold text-on-surface text-lg"},"Start Battle"),
preact.h("p",{"class":"text-sm text-on-surface-variant"},"Click \"Challenge Bot\" to begin. Ensure you're ready.")
)
)
),


preact.h("div",{"class":"bg-[#161B26] border border-[#222938] p-5 rounded-lg electric-glow transition-all hover:border-primary-container/30"},
preact.h("div",{"class":"flex items-center gap-4"},
preact.h("div",{"class":"flex-shrink-0 w-12 h-12 flex items-center justify-center bg-surface-container-low border border-[#222938] rounded-lg"},
preact.h("span",{"class":"font-bold text-primary-container text-base"},"03")
),
preact.h("div",{"class":"flex flex-col"},
preact.h("h3",{"class":"font-bold text-primary-container text-lg"},"Team Preview"),
preact.h("p",{"class":"text-sm text-on-surface-variant"},"You ",preact.h("span",{"class":"text-primary-container font-bold"},"MUST")," click \"Open Team Sheet\" during Team Preview.")
)
)
),


preact.h("div",{"class":"bg-[#161B26] border border-[#222938] p-5 rounded-lg electric-glow transition-all hover:border-primary-container/30"},
preact.h("div",{"class":"flex items-center gap-4"},
preact.h("div",{"class":"flex-shrink-0 w-12 h-12 flex items-center justify-center bg-surface-container-low border border-[#222938] rounded-lg"},
preact.h("span",{"class":"font-bold text-primary-container text-base"},"04")
),
preact.h("div",{"class":"flex flex-col"},
preact.h("h3",{"class":"font-bold text-on-surface text-lg"},"Play to End"),
preact.h("p",{"class":"text-sm text-on-surface-variant"},"Forfeiting is disabled. Please play every match to completion.")
)
)
)
),


preact.h("div",{"class":"flex flex-col items-center"},
preact.h("button",{
"class":"bg-primary-container text-on-primary-container font-bold px-8 py-3 rounded-lg shadow-[0_8px_24px_rgba(255,203,5,0.2)] active:scale-95 transition-all hover:brightness-110 flex items-center gap-2 text-md",
onClick:this.props.onContinue},
"CONTINUE TO TEAM SELECTION",

preact.h("span",{"class":"material-symbols-outlined"},"arrow_forward")
)
)
),


preact.h("div",{"class":"fixed -bottom-20 -right-20 w-80 h-80 bg-primary-container/5 rounded-full blur-[100px] pointer-events-none -z-10"}),
preact.h("div",{"class":"fixed -top-20 -left-20 w-80 h-80 bg-secondary-container/5 rounded-full blur-[100px] pointer-events-none -z-10"})
));

};return ResearchInfoPage;}(preact.Component);var


ResearchTeamSelectPage=function(_preact$Component3){function ResearchTeamSelectPage(){return _preact$Component3.apply(this,arguments)||this;}_inheritsLoose(ResearchTeamSelectPage,_preact$Component3);var _proto3=ResearchTeamSelectPage.prototype;_proto3.





render=function render(){
var teams=Config.researchTeams||[];
var _this$props=this.props,selectedTeamIndex=_this$props.selectedTeamIndex,onSelect=_this$props.onSelect,onDblClick=_this$props.onDblClick,onBattle=_this$props.onBattle;

return(
preact.h(preact.Fragment,null,
preact.h("div",{"class":"research-header"},
preact.h("h1",null,"Select Your Team"),
preact.h("p",null,"Welcome, ",preact.h("strong",null,PS.user.name),". Pick a team to challenge the bot.")
),
preact.h("div",{"class":"research-team-list"},
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
preact.h("div",{"class":"research-footer"},
preact.h("button",{
"class":"button big "+(selectedTeamIndex===-1?'disabled':''),
disabled:selectedTeamIndex===-1,
onClick:onBattle},

preact.h("strong",null,"Challenge Bot!")
)
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
preact.h("div",{"class":"modal-backdrop",style:"position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 10000;",onClick:function(e){return e.target===e.currentTarget&&_this5.props.onClose();}},
preact.h("div",{"class":"research-settings-panel",style:"padding: 30px; border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.4); width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto;",onClick:function(e){return e.stopPropagation();}},
preact.h("div",{"class":"research-header",style:"margin-bottom: 25px; text-align: left; display: flex; justify-content: space-between; align-items: flex-start;"},
preact.h("div",null,
preact.h("h2",{style:"margin: 0; font-size: 20pt; font-weight: 800; color: var(--p0-accent-red);"},"Account Settings"),
preact.h("p",{style:"margin: 5px 0 0; color: var(--p0-text-secondary); font-size: 11pt;"},"Manage your participant profile")
),
preact.h("button",{onClick:this.props.onClose,style:"background: none; border: none; font-size: 24px; cursor: pointer; color: var(--p0-text-secondary);"},"\xD7")
),

error&&preact.h("div",{"class":"login-error",style:"margin-bottom: 20px;"},error),
success&&preact.h("div",{style:"background: rgba(227, 53, 13, 0.1); color: var(--p0-accent-red); padding: 12px; border-radius: 8px; margin-bottom: 20px; text-align: center; border: 1px solid rgba(227, 53, 13, 0.2);"},success),

preact.h("div",{"class":"settings-section",style:"margin-bottom: 30px"},
preact.h("h3",null,"Change Username"),
preact.h("form",{onSubmit:this.handleChangeUsername,"class":"research-login-form",style:"background: transparent; border: none; padding: 0; backdrop-filter: none; max-width: none;"},
preact.h("div",{"class":"input-group",style:"margin-bottom: 15px"},
preact.h("label",null,"New Username"),
preact.h("input",{
type:"text",
value:newUsername,
onInput:function(e){return _this5.setState({newUsername:e.target.value});},
disabled:loading}
)
),
preact.h("div",{"class":"input-group",style:"margin-bottom: 15px"},
preact.h("label",null,"Current Password"),
preact.h("input",{
type:"password",
value:this.state.currentPasswordForUsername,
onInput:function(e){return _this5.setState({currentPasswordForUsername:e.target.value});},
disabled:loading}
)
),
preact.h("div",{"class":"research-footer",style:"margin-top: 10px; max-width: none;"},
preact.h("button",{
type:"submit",
"class":"button big "+(loading||!newUsername||!this.state.currentPasswordForUsername?'disabled':''),
style:"padding: 12px; font-size: 12pt;",
disabled:loading||!newUsername||!this.state.currentPasswordForUsername},

loading?'Updating...':'Update Username'
),
preact.h("p",{style:"font-size: 9pt; color: var(--p0-text-secondary); margin-top: 8px; text-align: center;"},"Note: This will log you out and require re-login.")
)
)
),

preact.h("div",{"class":"settings-section"},
preact.h("h3",null,"Change Password"),
preact.h("form",{onSubmit:this.handleChangePassword,"class":"research-login-form",style:"background: transparent; border: none; padding: 0; backdrop-filter: none; max-width: none;"},
preact.h("div",{"class":"input-group",style:"margin-bottom: 15px"},
preact.h("label",null,"Current Password"),
preact.h("input",{
type:"password",
value:this.state.currentPasswordForPassword,
onInput:function(e){return _this5.setState({currentPasswordForPassword:e.target.value});},
disabled:loading}
)
),
preact.h("div",{"class":"input-group",style:"margin-bottom: 15px"},
preact.h("label",null,"New Password"),
preact.h("input",{
type:"password",
value:newPassword,
onInput:function(e){return _this5.setState({newPassword:e.target.value});},
disabled:loading}
)
),
preact.h("div",{"class":"input-group",style:"margin-bottom: 15px"},
preact.h("label",null,"Confirm New Password"),
preact.h("input",{
type:"password",
value:confirmPassword,
onInput:function(e){return _this5.setState({confirmPassword:e.target.value});},
disabled:loading}
)
),
preact.h("div",{"class":"research-footer",style:"margin-top: 10px; max-width: none;"},
preact.h("button",{
type:"submit",
"class":"button big "+(loading||!this.state.currentPasswordForPassword||!newPassword||!confirmPassword?'disabled':''),
style:"padding: 12px; font-size: 12pt;",
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
preact.h("div",{"class":"dark bg-background text-on-background font-body-md min-h-full flex flex-col items-center justify-center p-md",style:"background-color: #11131b; color: #e2e1ee; min-height: 100vh;"},

preact.h("header",{"class":"flex justify-center items-center w-full mb-8"},
preact.h("img",{src:logoUrl,alt:"P0 Logo","class":"h-20 object-contain"})
),

preact.h("section",{"class":"relative w-full max-w-[440px] bg-surface-container border border-outline-variant p-lg rounded-xl shadow-2xl z-10",style:"background-color: #1d1f28; border-color: #4e4632; border-width: 1px; border-radius: 12px; padding: 40px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);"},
preact.h("div",{"class":"absolute top-4 right-4"},
preact.h("span",{"class":"px-2 py-0.5 rounded text-[10px] font-bold bg-error-container/20 border border-error-container/30 text-error uppercase tracking-widest",style:"color: #ffb4ab; background-color: rgba(147, 0, 10, 0.2); border: 1px solid rgba(147, 0, 10, 0.3);"},"Alpha"

)
),

preact.h("div",{"class":"mb-xl text-center",style:"margin-bottom: 40px;"},
preact.h("h2",{"class":"font-headline-md text-headline-md text-on-surface mb-xs",style:"font-family: 'Spline Sans'; font-size: 24px; color: #e2e1ee;"},"Play against P0"),
preact.h("p",{"class":"font-body-sm text-body-sm text-on-surface-variant",style:"font-family: 'Manrope'; font-size: 14px; color: #d2c5ab;"},"Enter participant details to continue")
),

preact.h("form",{"class":"space-y-md",onSubmit:this.handleLogin},
error&&preact.h("p",{"class":"text-error text-center mb-4",style:"color: #ffb4ab;"},error),

preact.h("div",{"class":"space-y-xs",style:"margin-bottom: 24px;"},
preact.h("label",{"class":"font-label-caps text-label-caps text-on-surface-variant uppercase",style:"font-family: 'Manrope'; font-size: 12px; color: #d2c5ab; display: block; margin-bottom: 4px;"},"Username"),
preact.h("div",{"class":"relative"},
preact.h("span",{"class":"material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]",style:"position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #d2c5ab;"},"person"),
preact.h("input",{
"class":"w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 pl-12 pr-4 text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all placeholder:text-on-surface-variant/40",
style:"width: 100%; background-color: #191b24; border: 1px solid #4e4632; border-radius: 8px; padding: 12px 12px 12px 48px; color: #e2e1ee;",
placeholder:"Enter your username",
type:"text",
value:username,
onInput:function(e){return _this7.setState({username:e.target.value});},
disabled:loading,
autoFocus:true}
)
)
),


preact.h("div",{"class":"space-y-xs",style:"margin-bottom: 24px;"},
preact.h("label",{"class":"font-label-caps text-label-caps text-on-surface-variant uppercase",style:"font-family: 'Manrope'; font-size: 12px; color: #d2c5ab; display: block; margin-bottom: 4px;"},"Password"),
preact.h("div",{"class":"relative"},
preact.h("span",{"class":"material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]",style:"position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #d2c5ab;"},"lock"),
preact.h("input",{
"class":"w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 pl-12 pr-4 text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all placeholder:text-on-surface-variant/40",
style:"width: 100%; background-color: #191b24; border: 1px solid #4e4632; border-radius: 8px; padding: 12px 12px 12px 48px; color: #e2e1ee;",
placeholder:"\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
type:"password",
value:password,
onInput:function(e){return _this7.setState({password:e.target.value});},
disabled:loading}
)
)
),


preact.h("button",{
"class":"w-full bg-primary-container text-on-primary font-bold py-4 rounded-lg hover:brightness-110 active:scale-95 transition-all glow-hover flex items-center justify-center gap-2 mt-4 "+(!username||!password||loading?'opacity-50 cursor-not-allowed':''),
style:"width: 100%; background-color: #ffcb05; color: #3d2f00; font-weight: 700; padding: 16px; border-radius: 8px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 16px; "+(!username||!password||loading?'opacity: 0.5; cursor: not-allowed;':''),
type:"submit",
disabled:!username||!password||loading},

loading?'Logging in...':'Login',
!loading&&preact.h("span",{"class":"material-symbols-outlined text-[20px]"},"arrow_forward")
)
),


preact.h("div",{"class":"mt-xl pt-md border-t border-outline-variant/30",style:"margin-top: 40px; padding-top: 24px; border-top: 1px solid rgba(78, 70, 50, 0.3);"},
preact.h("div",{"class":"flex items-start gap-3 p-sm bg-secondary-container/10 border border-secondary-container/20 rounded-lg",style:"display: flex; align-items: flex-start; gap: 12px; padding: 12px; background-color: rgba(38, 56, 184, 0.1); border: 1px solid rgba(38, 56, 184, 0.2); border-radius: 8px;"},
preact.h("span",{"class":"material-symbols-outlined text-secondary text-[18px]",style:"color: #bcc2ff;"},"info"),
preact.h("p",{"class":"font-body-sm text-body-sm text-on-secondary-container",style:"font-family: 'Manrope'; font-size: 14px; color: #aab3ff; margin: 0;"},"Contact ",
preact.h("a",{"class":"text-secondary font-bold hover:underline decoration-2 underline-offset-4",style:"color: #bcc2ff; font-weight: 700; text-decoration: none;",href:"mailto:akkshaysr0107@gmail.com"},"akkshaysr0107@gmail.com")," for an ID"
)
)
)
),


preact.h("div",{"class":"fixed -bottom-20 -right-20 w-80 h-80 bg-primary-container/5 rounded-full blur-[100px] pointer-events-none -z-10",style:"position: fixed; bottom: -80px; right: -80px; width: 320px; height: 320px; background-color: rgba(255, 203, 5, 0.05); border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: -10;"}),
preact.h("div",{"class":"fixed -top-20 -left-20 w-80 h-80 bg-secondary-container/5 rounded-full blur-[100px] pointer-events-none -z-10",style:"position: fixed; top: -80px; left: -80px; width: 320px; height: 320px; background-color: rgba(38, 56, 184, 0.05); border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: -10;"})
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
"class":"research-team-card "+(isSelected?'selected':''),
onClick:onClick,
onDblClick:onDblClick},

preact.h("div",{"class":"team-name"},team.name),
preact.h("div",{"class":"team-right-content"},
preact.h("div",{"class":"team-icons"},
this.icons
),
preact.h("div",{"class":"selection-indicator"},
isSelected&&preact.h("i",{"class":"fa fa-check-circle"})
)
)
));

};return ResearchTeamCard;}(preact.Component);


PS.addRoomType(ResearchLandingPage);
//# sourceMappingURL=research-ui.js.map