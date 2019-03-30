import React, { Component } from 'react';
import './App.css';
import Navbar from '../components/Navbar/Navbar.js';
import TopSectionContainer from './TopSectionContainer/TopSectionContainer.js';
import ResultContainer from './ResultContainer/ResultContainer';


class App extends Component {
  state = {
    menuOptionChosen: 'PVE',
    filter: {
      Type: 'ALL',
      Area: 'ALL'
    },
    showToday: true,
    dailyPve: [],
    dailyWvW: [],
    dailyFractals: [],
    TmrdailyPve: [],
    TmrdailyWvW: [],
    TmrdailyFractals: [],
 };


 getDailyHandler = (tomorrow) => {
   let dailyIdUrl = 'https://api.guildwars2.com/v2/achievements/daily';
   if(tomorrow){
     dailyIdUrl = dailyIdUrl + '/tomorrow';
   }


   fetch(dailyIdUrl)
   .then(result => {
     return result.json();
   }).then(data => {
     const pveIds = [];
     const wvwIds = [];
     const fractalIds = [];
     const pveDaily = [];
     const wvwDaily = [];
     const fractalDaily =[];
     data.pve.map(item => {
       return pveIds.push(item.id);
     });
     data.wvw.map(item => {
       return wvwIds.push(item.id);
     });
     data.fractals.map(item => {
       return fractalIds.push(item.id);
     });

     fetch('https://api.guildwars2.com/v2/achievements?ids=' + pveIds.join(',') + wvwIds.join(',')+ fractalIds.join(','))
     .then(result => {
       return result.json();
     }).then(data => {
       data.map((item) => {
         if(pveIds.includes(item.id)){
            return pveDaily.push(item);
         }
         if(wvwIds.includes(item.id)){
           return wvwDaily.push(item);
         }
         if(fractalIds.includes(item.id) && item.name.includes("Tier 4")){
          return fractalDaily.push(item);
         }
         return null;
       })

       if(tomorrow){
         this.setState({
           TmrdailyPve: pveDaily,
           TmrdailyWvW: wvwDaily,
           TmrdailyFractals: fractalDaily,
         })
       }
       else {
         this.setState({
           dailyPve: pveDaily,
           dailyWvW: wvwDaily,
           dailyFractals: fractalDaily,
         })
       };

     });

   });
   return null;
 }

 componentDidMount(){
   this.getDailyHandler(false);
 }

 changeDayHandler = () => {
   this.setState({
     showToday: !this.state.showToday
   });
  if(this.state.showToday && this.state.TmrdailyPve.length <= 0 && this.state.TmrdailyWvW.length <= 0 && this.state.TmrdailyFractals <= 0){
     this.getDailyHandler(true);
  }
 }
 changeMenuOptionChoosenHandler = (item) => {
   if(item === 'SEARCH'){
     this.setState({
         menuOptionChosen: item,
         filter: {
           Type: 'ALL',
           Area: 'ALL'
         }
     });
   }
   else {
     this.setState({
         menuOptionChosen: item
     });
   }
  };

 setTypeFilterHandler = (event) => {
   this.setState({
     filter: {
       Type: event.target.value,
       Area: this.state.filter.Area
     }
   });
 }
 setAreaFilterHandler = (event) => {
   this.setState({
     filter: {
       Type: this.state.filter.Type,
       Area: event.target.value
     }
   });
 }

  render() {
    return (
      <div className="App">
        <div className="navbar--container">
          <Navbar optionChosen={this.state.menuOptionChosen} clicked={this.changeMenuOptionChoosenHandler}/>
        </div>
        <div className="main-content">
          <TopSectionContainer
            state={this.state}
            showToday={this.state.showToday}
            changeDay={this.changeDayHandler}
            menuOption={this.state.menuOptionChosen}
            setTypeFilter={this.setTypeFilterHandler}
            setAreaFilter={this.setAreaFilterHandler}/>
          <ResultContainer filter={this.state.filter} menuOption={this.state.menuOptionChosen}/>
        </div>
      </div>
    );
  }
}

export default App;
