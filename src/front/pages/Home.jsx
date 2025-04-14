import React, { useEffect, useState } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link, useNavigate } from "react-router-dom";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [infodata, setInfoData] = useState();
	const [infoMe, setInfoMe] = useState();

	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL
			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			//Consumir Endpoint
			const response = await fetch(backendUrl + "/api/hello")
			const data = await response.json()

			if (response.ok) dispatch({ type: "set_hello", payload: data.message })

			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}
	}


	const handleLogin = async () => {
		const dataBody = {
			"email": email,
			"password": password
		};

		try {
			// const backendUrl = import.meta.env.VITE_BACKEND_URL
			// if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch("https://verbose-broccoli-vw5xr6rjq57cw5g7-3001.app.github.dev/login",
				{
					method: 'POST',
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(dataBody)
				}
			);

			if (!response.ok) { throw new Error("Ocurrio un error al llamar al endpoint login") }

			//await -> hace que el código espere hasta que el .json() termine de ejecutarse y devuelva el resultado.
			//response.json() -> parsea el JSON que viene del servidor
			const dataResponse = await response.json();

			setInfoData(dataResponse);

			if (dataResponse.ok) {
				// Guardar el token para futuras peticiones en Front: F12>Application>SessionStorage>"el valor que salga"
				sessionStorage.setItem('access_token', dataResponse.access_token);
				console.log(dataResponse.msg); // "Loguin existoso...."
				// Redirigir o cambiar estado
			} else {
				console.error('Error al iniciar sesión');
			}

		} catch (error) {
			console.error(error);
		}
	};


	const handleMe = async () => {
		try {
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/me`,
				{
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${sessionStorage.getItem("access_token")}`
					},
				}
			);

			if (!response.ok) { throw new Error("Ocurrio un error al llamar al endpoint login") }

			const dataResponse = await response.json();
			setInfoMe(dataResponse);
		} catch (error) {
			console.error(error);
		}
	}


	useEffect(() => {
		//handleLogin();
	}, [])

	return (
		<div className="text-center mt-5">

			<Login />

			{/* <Signup /> */}

		</div>
	);
}; 