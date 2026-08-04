import "./Footer.css";

function Footer() {
  return (
    <footer className="hms-footer">
      <p>
        © {new Date().getFullYear()} Hostel Management System • Developed by{" "}
        <strong>Gurumoorthi</strong>
      </p>
    </footer>
  );
}

export default Footer;