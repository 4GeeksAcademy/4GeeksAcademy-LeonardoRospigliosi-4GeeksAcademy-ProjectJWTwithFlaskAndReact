import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {

	const navigate = useNavigate();

	const handleLogOff = () => {
		sessionStorage.removeItem("access_token");
		navigate("/"); // Redirige a la página Home
	};

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					{/* <Link to="/demo">
						<button className="btn btn-primary">Check the Context in action</button>
					</Link> */}

					{sessionStorage.getItem("access_token") !== "" &&
						sessionStorage.getItem("access_token") !== null ? (
						<button className="btn btn-primary" onClick={handleLogOff}>
							Cerrar Sesión
						</button>
					) : (
						""
					)}
				</div>
			</div>
		</nav>
	);
};