import React, { useEffect, useState } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link, useNavigate } from "react-router-dom";

const API_URL_BASE = "https://verbose-broccoli-vw5xr6rjq57cw5g7-3001.app.github.dev";


const LoginDemo = () => {
    const { store, dispatch } = useGlobalReducer();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [infodata, setInfoData] = useState();
    const [infoMe, setInfoMe] = useState();


    const handleLogin = async () => {
        const dataBody = {
            "correo": email,
            "contrasena": password
        };

        try {
            const response = await fetch(API_URL_BASE + "/loginDemo",
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



    const handleLoginDemo = async () => {
        const dataBody = {
            "email": email,
            "password": password
        };

        try {
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
        handleLoginDemo();
    }, [])


    return (
        <div className="text-center mt-5">
            <div className="container text-start">
                <form>
                    <h2 className="text-center">Loguin JWT</h2>
                    <div className="mb-3 mt-2">
                        <label htmlFor="exampleInputEmail1" className="form-label">
                            Email address
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            onChange={(e) => { setEmail(e.target.value) }}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="exampleInputPassword1"
                            onChange={(e) => { setPassword(e.target.value) }}
                        />
                    </div>

                    {/* <button type="button" onClick={handleLoginDemo} className="btn btn-primary">
                        Ingresar
                    </button> */}

                    <Link to={`/private`} >
                        <button type="button" className="btn btn-primary m-2" >
                            Ingresar
                        </button>
                    </Link>

                    <Link to={`/signup`} >
                        <button type="button" className="btn btn-primary m-2" >
                            Registrarse
                        </button>
                    </Link>


                    {/* <button type="button" onClick={handleMe} className="btn btn-primary m-2">
                        Info...
                    </button> */}
                </form>
            </div>



        </div>
    );


}
export default LoginDemo;
