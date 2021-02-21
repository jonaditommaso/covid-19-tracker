import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import InfoBox from './components/InfoBox';
import Map from './components/Map';
import LineGraph from './components/LineGraph';
import Table from './components/Table';
import { sortData, prettyPrintStat } from './utils/common';
import 'leaflet/dist/leaflet.css';


const WORLDWIDE = 'worldwide'

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(WORLDWIDE);
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4786});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [typeData, setTypeData] = useState('cases');

  useEffect(()=> {
    const getCountriesData = async ()=> {
      const response = await axios.get("https://disease.sh/v3/covid-19/countries");
      const {data} = response;
      const countriesData = data.map((country) => (
        {
          name: country.country,
          value: country.countryInfo.iso2
        }
      ));

      setCountries(countriesData);

      const sortedData = sortData(data);
      setTableData(sortedData);

      setMapCountries(data);
    }
    
    const getWorldwideData = async ()=> {
      const response = await axios.get("https://disease.sh/v3/covid-19/all");
      setCountryInfo(response.data);
    }

    getCountriesData();
    getWorldwideData();
  }, [])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const URL = countryCode === WORLDWIDE 
    ? "https://disease.sh/v3/covid-19/all" 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    const response = await axios.get(URL);
    const {data} = response;
    setCountryInfo(data);

    setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
    setMapZoom(4);

  }

  

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>

          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map(country => (
              
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
              
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox 
            active={typeData === 'cases'}
            onClick={(e)=> setTypeData('cases')}
            title="Cases" 
            total={countryInfo.cases} 
            cases={prettyPrintStat(countryInfo.todayCases)}
          />
          <InfoBox 
            active={typeData === 'recovered'}
            onClick={(e)=> setTypeData('recovered')}
            title="Recoveries" 
            total={countryInfo.recovered} 
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            
          />
          <InfoBox 
            active={typeData === 'deaths'}
            onClick={(e)=> setTypeData('deaths')}
            title="Deaths" 
            total={countryInfo.deaths} 
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
          />
        </div>
      
        <div>
          <Map 
            typeData={typeData}
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>

      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new cases</h3>
          <LineGraph typeData={typeData} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
