import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import './map.css';
import skilldata from '/data/data.json'; // 正しいパスを指定

function Skill() {
    const [selectMap, setSelectMap] = useState({});
    const [maps, setMaps] = useState([]);
    const [brim, setBrim] = useState(null);
    const [clickCoordinates, setClickCoordinates] = useState({ x: 0, y: 0 });
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const itemName = query.get('name');
    const itemSkill = query.get('param');

    useEffect(() => {
        const fetchMaps = async () => {
            try {
                const response = await fetch('https://valorant-api.com/v1/maps');
                const data = await response.json();
                setMaps(data.data);
            } catch (error) {
                console.error('Error fetching maps data', error);
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
    }, []);

    const handleSvgClick = (event) => {
        const svg = event.currentTarget;
        const point = svg.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;
        const transformPoint = point.matrixTransform(svg.getScreenCTM().inverse());
        setClickCoordinates({ x: transformPoint.x, y: transformPoint.y });
    };

    const handleClick = (item) => {
        setSelectMap(item);
    };

    const selectedMapData = skilldata.find((item) => item.map === itemName)?.[itemSkill] || [];

    if (!brim || !brim.abilities) {
        return (
            <div className="img-container">
                <img src="https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/killfeedportrait.png" alt="Brimstone" className="maps" />
                <div className="img-name">Brimstone</div>
            </div>
        );
    }

    return (
        <div>
            <div>
                {brim.abilities.map((item, index) => (
                    <div key={index} className="img-container">
                        <img src={item.displayIcon} alt={item.displayName} className="ability-icon" />
                        <div className="img-name">{item.displayName}</div>
                    </div>
                ))}
            </div>
            <svg width="1000" height="1000" onClick={handleSvgClick}>
                <image
                    href={maps.find((item) => item.displayName === itemName)?.displayIcon}
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    preserveAspectRatio="none"
                    className="mapdata"
                    transform={itemName !== "Lotus" && itemName !== "Bind" && itemName !== "Sunset" ? "rotate(90, 500, 500)" : "rotate(0,500,500)"}
                />
                {selectedMapData.map((item, index) => (
                    <g key={index}>
                        <image
                            x={selectMap === item ? item.x - 20 : item.x - 10}
                            y={selectMap === item ? item.y - 20 : item.y - 10}
                            width={selectMap === item ? 40 : 20}
                            height={selectMap === item ? 40 : 20}
                            href={brim?.abilities.find((ability) => ability.displayName === itemSkill)?.displayIcon}
                            style={{ cursor: 'pointer', opacity: selectMap === item ? 1 : 0.5 }}
                            onClick={() => handleClick(item)}
                        />
                        {selectMap && selectMap.loca && selectMap.loca.map((locaItem, locaIndex) => (
                            <image
                                key={locaIndex}
                                x={locaItem.x - 15}
                                y={locaItem.y - 15}
                                width="30"
                                height="30"
                                href="https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/displayiconsmall.png"
                                onClick={() => handleClick(locaItem)}
                            />
                        ))}
                    </g>
                ))}
                <image
                    x={clickCoordinates.x - 15}
                    y={clickCoordinates.y - 15}
                    width="30"
                    height="30"
                    href="https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/displayiconsmall.png"
                />
            </svg>
            <div>
                {selectMap["image"] && selectMap["image"].map((item, index) => {
                    console.log(item)
                    return (
                    <img key={index} src={`https://spiffy-cobbler-281b84.netlify.app/data/${item}`} alt="Selected" />
                )})}
            </div>
            <div>
                <h3>Clicked Coordinates:</h3>
                <p>X: {clickCoordinates.x}, Y: {clickCoordinates.y}</p>
            </div>
            <div>
                <h3>Brimstone:</h3>
            </div>
        </div>
    );
}

export default Skill;
