

export default function MessageBox({ type, message }) {
  if (!message) return null;

  const style = {
    marginTop: "15px",
    padding: "10px",
    borderRadius: "5px",
    textAlign: "center",
    color: type === "success" ? "green" : "red",
    background: "rgba(255, 255, 255, 0.94)",
  };

  return <div style={style}>{message}</div>;
}
