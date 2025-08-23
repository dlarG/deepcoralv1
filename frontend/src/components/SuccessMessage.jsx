function SuccessMessage() {
  return (
    <div className="successContainer">
      <div className="container">
        <div className="content">
          <h1>Success!</h1>
        </div>
      </div>
    </div>
  );
}

const styles = `
    .successContainer {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .container {
        width: 100%;
        max-width: 420px;
        background: white;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    .content {
        text-align: center;
        padding: 15px;
    }
`;

const styleElement = document.createElement("style");
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

export default SuccessMessage;
