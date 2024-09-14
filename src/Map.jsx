import { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import skilldata from '/public/data/data.json';
import './map.css';

function Map() {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const itemName = query.get('name');
    const [maps, setMaps] = useState([]);
    const [brim, setBrim] = useState(null);
    const [a, setA] = useState(false);
    const navigate = useNavigate(); // useNavigate を追加

    useEffect(() => {
        const fetchMaps = async () => {
            try {
                const response = await fetch('https://valorant-api.com/v1/maps');
                const data = await response.json();
                setMaps(data.data);
            } catch (error) {
                console.error('Error fetching the maps data', error);
            }
        };
        
        const fetchBrim = async () => {
            try {
                const response = await fetch("https://valorant-api.com/v1/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417");
                const data = await response.json();
                setBrim(data.data);
            } catch (error) {
                console.error('Error fetching brim data', error);
            }
        };

        fetchBrim();
        fetchMaps();
        setA(true);
    }, []);

    const handleMapClick = (mapName, anotherParameter) => {
        navigate(`/map/skill?name=${encodeURIComponent(mapName)}&param=${encodeURIComponent(anotherParameter)}`);
    };

    const Gai = () => (
        <div className="img-container">
            <img src="https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/killfeedportrait.png" alt="Brimstone" className="maps" />
            <div className="img-name">Brimstone</div>
        </div>
    );

    return (
        <div>
            <img src={brim?.abilities?.find((item) => item.displayName === itemName)?.displayIcon} alt={itemName} className="Incendiary"/>
            <h2>{itemName}</h2>
            <div>
                {a ? (
                    maps.map((item, index) => {
                        if (item.displayName !== "The Range" && item.displayName !== "Basic Training" &&item.displayName !== "Fracture" &&item.displayName !== "Breeze" &&item.displayName !== "Split" &&item.displayName !== "District" &&item.displayName !== "Kasbah" &&item.displayName !== "Piazza"&&item.displayName !== "Pearl"&&item.displayName !== "Drift") {
                            console.log(skilldata)
                            return (
                                <div className="img-container" key={index} onClick={() => handleMapClick(item.displayName, itemName)}>
                                    <img src={item.splash} className="maps" alt={`Map ${index}`} style={skilldata["map"]!=undefined?{"opacity":"0"}:{"opacity": "1"}}/>
                                    <div className="img-name">{item.displayName}</div>
                                </div>
                            );
                        }
                        return null;
                    })
                ) : (
                    <Gai />
                )}
            </div>
            <div>
            </div>
        </div>
    );
}

export default Map;
