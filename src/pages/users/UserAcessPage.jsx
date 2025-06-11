import './Accesscbt.css';
const AccessCbt = () => {

  
  return (
    <section className="access-section">
      <div className="access-content">
        {/* Logo Container with Border */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px",
            border: "3px solid white", 
            borderRadius: "8px",
            backgroundColor: "rgba(255, 255, 255, 0.1)", 
            width: "fit-content", 
            margin: "0 auto", 
          }}
        >
          <img
            src="/logo-antigravity.webp"
            alt="Company Logo"
            style={{
              height: "auto",
              width: "200px", 
              display: "block",
              filter: "drop-shadow(2px 2px 5px rgba(0,0,0,0.5))", 
            }}
          />
        </div>

        <h1 className="access-title">Welcome to Acadaboo CBT</h1>
        <p className="access-description">
          To access Acadaboo CBT, please Login using your Acadaboo Account
        </p>

        {/* Button Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
           onClick={() => window.location.href = 'https://www.acadaboo.com/login'}
            style={{
              background: "linear-gradient(to right, #6610F2, #F21098)",
              color: "white",
              fontSize: "14px",
              padding: "16px 20px",
              border: "2px solid black",
              borderRadius: "544px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              width: "200px",
              justifyContent: "center",
              position: "relative",
            }}
            className="hoverButton"
          >
            <span
              style={{
                backgroundColor: "transparent",
                fontFamily: `var(--fontFamily)`,
              }}
            >
              Click me
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default AccessCbt;
