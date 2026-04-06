export default function Footer() {
  return (
    <footer className="footer mt-auto bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <p className="mb-0 text-muted">© {new Date().getFullYear()} 한국건설트레이딩 (KCT). All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
