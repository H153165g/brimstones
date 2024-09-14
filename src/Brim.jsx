import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './brim.css';


function Brim() {
    const [brim, setBrim] = useState(null);
    const [a, setA] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
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
        setA(true);
    }, []);

    const Gai = () => (
        <div className="img-container">
            <img src="https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data/28db4af…d78ddba…-5120x1772.png?auto=format&fit=fill&q=80&w=2167" alt="Brimstone" />
            <div className="img-name">Brimstone</div>
        </div>
    );

    const handleIconClick = (id) => {
        if (id !== "Stim Beacon") {
            navigate(`/map?name=${encodeURIComponent(id)}`);
        }
    };

    return (
        <div className="app-container" style={{ backgroundImage: `url(${brim ? brim.fullPortrait : ''})` }}>
            <div className="content">
                <h3>Brimstone Skill:</h3>
                {a && brim ? (
                    brim.abilities.map((item, index) => {
                        return(
                        <div key={index} className="img-container" onClick={() => handleIconClick(item.displayName)}>
                            <img src={item.displayIcon} alt={item.displayName} className="ability-icon" style={item.displayName=="Incendiary"?{opacity:"1",cursor:"pointer"}:{opacity:"0.5"}}/>
                            <div className="img-name">{item.displayName}</div>
                        </div>
                    )})
                ) : (
                    <Gai />
                )}
            </div>
        </div>
    );
}

export default Brim;
