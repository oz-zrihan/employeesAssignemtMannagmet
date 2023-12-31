import { NavLink } from "react-router-dom";
import "./PageNotFound.scss";
// Icons
import { GiCommercialAirplane } from "react-icons/gi";

function PageNotFound(): JSX.Element {
  return (
    <div className="PageNotFound">
      <div className="four-o-four">
        <span>4</span>
        <div className="animation">
          <span style={{ "--i": 1 } as React.CSSProperties}></span>
          <span style={{ "--i": 2 } as React.CSSProperties}></span>
          <span style={{ "--i": 3 } as React.CSSProperties}></span>
          <span style={{ "--i": 4 } as React.CSSProperties}></span>
          <span style={{ "--i": 5 } as React.CSSProperties}></span>
          <span style={{ "--i": 6 } as React.CSSProperties}></span>
          <span style={{ "--i": 7 } as React.CSSProperties}></span>
          <span style={{ "--i": 8 } as React.CSSProperties}></span>
          <span style={{ "--i": 9 } as React.CSSProperties}></span>
          <span style={{ "--i": 10 } as React.CSSProperties}></span>
          <span style={{ "--i": 11 } as React.CSSProperties}></span>
          <span style={{ "--i": 12 } as React.CSSProperties}></span>
          <span style={{ "--i": 13 } as React.CSSProperties}></span>
          <span style={{ "--i": 14 } as React.CSSProperties}></span>
          <span style={{ "--i": 15 } as React.CSSProperties}></span>
          <span style={{ "--i": 16 } as React.CSSProperties}></span>
          <span style={{ "--i": 17 } as React.CSSProperties}></span>
          <span style={{ "--i": 18 } as React.CSSProperties}></span>
          <span style={{ "--i": 19 } as React.CSSProperties}></span>
          <span style={{ "--i": 20 } as React.CSSProperties}></span>
          <div className="air-plane">
            <GiCommercialAirplane />
          </div>
        </div>
        <span>4</span>
      </div>
      <p> Page Not Found</p>
      <NavLink to="/">
        {" "}
        <button className="light-btn"> Go Back Home</button>
      </NavLink>
    </div>
  );
}

export default PageNotFound;
