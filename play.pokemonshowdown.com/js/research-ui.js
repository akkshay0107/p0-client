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
return(
preact.h("div",{"class":"research-landing"},
preact.h("div",{"class":"research-info-card"},
preact.h("div",{"class":"p0-logo"},
preact.h("span",null,"P0")," PROJECT"
),
preact.h("div",{"class":"research-header"},
preact.h("h1",null,"Welcome to P0"),
preact.h("p",null,"An RL-trained VGC battle bot experiment. Please read the instructions below carefully.")
),

preact.h("div",{"class":"info-steps"},
preact.h("div",{"class":"step"},
preact.h("div",{"class":"step-number"},"1"),
preact.h("div",{"class":"step-text"},
preact.h("h3",null,"Pick a Team"),
preact.h("p",null,"Choose from 6 pre-built VGC teams. The bot will also select from its own pool of trained teams.")
)
),
preact.h("div",{"class":"step"},
preact.h("div",{"class":"step-number"},"2"),
preact.h("div",{"class":"step-text"},
preact.h("h3",null,"Start Battle"),
preact.h("p",null,"Click \"Challenge Bot\" to begin. Ensure you're ready before starting the match.")
)
),
preact.h("div",{"class":"step"},
preact.h("div",{"class":"step-number"},"3"),
preact.h("div",{"class":"step-text"},
preact.h("h3",null,"Team Preview"),
preact.h("p",null,"You MUST click \"Open Team Sheet\" during Team Preview to trigger the bot's selection logic.")
)
),
preact.h("div",{"class":"step"},
preact.h("div",{"class":"step-number"},"4"),
preact.h("div",{"class":"step-text"},
preact.h("h3",null,"Play to End"),
preact.h("p",null,"Forfeiting is disabled for research integrity. Please play every match through to completion.")
)
)
),

preact.h("div",{"class":"research-footer"},
preact.h("button",{"class":"button big",onClick:this.props.onContinue},"Continue to Team Selection \u2192"

)
)
)
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

return(
preact.h("div",{"class":"research-landing"},
preact.h("div",{"class":"research-header"},
preact.h("h1",null,"P0"),
preact.h("p",null,"Please log in with your participant credentials to continue.")
),
preact.h("form",{"class":"research-login-form",onSubmit:this.handleLogin},
preact.h("div",{"class":"input-group"},
preact.h("label",null,"Username"),
preact.h("input",{
type:"text",
value:username,
onInput:function(e){return _this7.setState({username:e.target.value});},
disabled:loading,
autoFocus:true}
)
),
preact.h("div",{"class":"input-group"},
preact.h("label",null,"Password"),
preact.h("input",{
type:"password",
value:password,
onInput:function(e){return _this7.setState({password:e.target.value});},
disabled:loading}
)
),
error&&preact.h("div",{"class":"login-error"},error),
preact.h("div",{"class":"research-footer"},
preact.h("button",{
type:"submit",
"class":"button big "+(!username||!password||loading?'disabled':''),
disabled:!username||!password||loading},

preact.h("strong",null,loading?'Logging in...':'Login')
)
)
)
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