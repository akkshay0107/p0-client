"use strict";function _inheritsLoose(t,o){t.prototype=Object.create(o.prototype),t.prototype.constructor=t,_setPrototypeOf(t,o);}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t;},_setPrototypeOf(t,e);}var




ResearchLandingPage=function(_preact$Component){function ResearchLandingPage(){var _this;for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}_this=_preact$Component.call.apply(_preact$Component,[this].concat(args))||this;_this.
state={
selectedTeamIndex:-1,
isWaiting:false
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
};return _this;}_inheritsLoose(ResearchLandingPage,_preact$Component);var _proto=ResearchLandingPage.prototype;_proto.componentDidMount=function componentDidMount(){var _this2=this;document.body.classList.add('research-mode');for(var roomid in PS.rooms){if(roomid&&!roomid.startsWith('battle-')){var room=PS.rooms[roomid];if(room){room.minimized=true;if(roomid==='rooms'||roomid==='lobby'){PS.hideRightRoom();}}}}this.psSubscription=PS.subscribe(function(){if(_this2.state.isWaiting&&Object.keys(PS.rooms).some(function(id){return id.startsWith('battle-');})){_this2.setState({isWaiting:false});}});this.userSubscription=PS.user.subscribe(function(){_this2.forceUpdate();});PS.update();};_proto.componentWillUnmount=function componentWillUnmount(){document.body.classList.remove('research-mode');if(this.psSubscription){this.psSubscription.unsubscribe();this.psSubscription=null;}if(this.userSubscription){this.userSubscription.unsubscribe();this.userSubscription=null;}};_proto.

render=function render(){var _this3=this;
var teams=Config.researchTeams||[];
var _this$state=this.state,isWaiting=_this$state.isWaiting,selectedTeamIndex=_this$state.selectedTeamIndex;

if(!PS.user.registered){
return preact.h(ResearchLoginPage,null);
}

return(
preact.h("div",{"class":"research-landing"},
isWaiting?
preact.h("div",{"class":"research-waiting"},
preact.h("div",{"class":"spinner"}),
preact.h("h1",null,"Preparing Match..."),
preact.h("p",null,"Challenging ",preact.h("strong",null,"Bot")," with your selected team."),
preact.h("button",{"class":"button",style:"margin-top: 20px",onClick:function(){return _this3.setState({isWaiting:false});}},"Cancel")
):

preact.h(preact.Fragment,null,
preact.h("div",{"class":"research-header"},
preact.h("h1",null,"VGC Research Project"),
preact.h("p",null,"Welcome, ",preact.h("strong",null,PS.user.name),". Please select a team to challenge the RL bot.")
),
preact.h("div",{"class":"research-team-list"},
teams.map(function(team,index){return(
preact.h(ResearchTeamCard,{
key:index,
team:team,
isSelected:selectedTeamIndex===index,
onClick:function(){return _this3.handleSelect(index);},
onDblClick:function(){return _this3.handleDoubleClick(team.pokePasteUrl);}}
));}
)
),
preact.h("div",{"class":"research-footer"},
preact.h("button",{
"class":"button big "+(selectedTeamIndex===-1?'disabled':''),
disabled:selectedTeamIndex===-1,
onClick:this.handleBattle},

preact.h("strong",null,"Challenge Bot!")
)
)
)

));

};return ResearchLandingPage;}(preact.Component);var


ResearchLoginPage=function(_preact$Component2){function ResearchLoginPage(){var _this4;for(var _len2=arguments.length,args=new Array(_len2),_key2=0;_key2<_len2;_key2++){args[_key2]=arguments[_key2];}_this4=_preact$Component2.call.apply(_preact$Component2,[this].concat(args))||this;_this4.
state={
username:'',
password:'',
loading:false
};_this4.

handleLogin=function(e){
e.preventDefault();
var _this4$state=_this4.state,username=_this4$state.username,password=_this4$state.password;
if(!username||!password)return;

_this4.setState({loading:true});
PS.user.changeNameWithPassword(username,password);
};return _this4;}_inheritsLoose(ResearchLoginPage,_preact$Component2);var _proto2=ResearchLoginPage.prototype;_proto2.

render=function render(){var _PS$user$state,_this5=this;
var _this$state2=this.state,username=_this$state2.username,password=_this$state2.password,loading=_this$state2.loading;
var error=(_PS$user$state=PS.user.state)==null?void 0:_PS$user$state.error;

return(
preact.h("div",{"class":"research-landing"},
preact.h("div",{"class":"research-header"},
preact.h("h1",null,"VGC Research Project"),
preact.h("p",null,"Please log in with your participant credentials to continue.")
),
preact.h("form",{"class":"research-login-form",onSubmit:this.handleLogin},
preact.h("div",{"class":"input-group"},
preact.h("label",null,"Username"),
preact.h("input",{
type:"text",
value:username,
onInput:function(e){return _this5.setState({username:e.target.value});},
disabled:loading,
autoFocus:true}
)
),
preact.h("div",{"class":"input-group"},
preact.h("label",null,"Password"),
preact.h("input",{
type:"password",
value:password,
onInput:function(e){return _this5.setState({password:e.target.value});},
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


ResearchTeamCard=function(_preact$Component3){function ResearchTeamCard(){var _this6;for(var _len3=arguments.length,args=new Array(_len3),_key3=0;_key3<_len3;_key3++){args[_key3]=arguments[_key3];}_this6=_preact$Component3.call.apply(_preact$Component3,[this].concat(args))||this;_this6.





packedTeam='';_this6.
icons=null;return _this6;}_inheritsLoose(ResearchTeamCard,_preact$Component3);var _proto3=ResearchTeamCard.prototype;_proto3.

componentWillMount=function componentWillMount(){
var team=this.props.team;
var sets=Teams["import"](team.teamExport);
this.packedTeam=Teams.pack(sets);
team.packedTeam=this.packedTeam;

this.icons=Teams.unpackSpeciesOnly(this.packedTeam).map(function(pokemon){return(
preact.h(PSIcon,{pokemon:pokemon}));}
);
};_proto3.

render=function render(){
var _this$props=this.props,team=_this$props.team,isSelected=_this$props.isSelected,onClick=_this$props.onClick,onDblClick=_this$props.onDblClick;

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
//# sourceMappingURL=research-ui.js.map