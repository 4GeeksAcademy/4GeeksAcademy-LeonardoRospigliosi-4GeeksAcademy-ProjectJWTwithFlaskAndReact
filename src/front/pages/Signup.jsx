import React, { useEffect, useState } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { store, dispatch } = useGlobalReducer();
    const [infodata, setInfoData] = useState();
    const [infoMe, setInfoMe] = useState();
    const navigate = useNavigate();

    const addUser = async () => {
        const dataBody = {
            "correo": email,
            "contrasena": password
        };

        try {
            const response = await fetch(`https://verbose-broccoli-vw5xr6rjq57cw5g7-3001.app.github.dev/signup`,
                {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dataBody)
                }
            );

            if (!response.ok) { throw new Error("Ocurrio un error al llamar al endpoint addUser") }
            const dataResponse = await response.json();
            setInfoData(dataResponse);
            LimpiarFormulario();
            navigate("/");

        } catch (error) {
            console.error(error);
        }
    };

    const LimpiarFormulario = () => {
        setEmail("");
        setPassword("");
    }

    return (
        <div className="container text-start mt-5">
            <form>
                <h2 className="text-center">Crear Usuario JWT</h2>
                <div className="mb-3 mt-2">
                    <label htmlFor="exampleInputEmail1" className="form-label">
                        Email address
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        placeholder="Ingrese email"
                        value={email}
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
                        placeholder="Ingrese Password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                    />
                </div>

                <button type="button" onClick={addUser} className="btn btn-primary m-2">
                    Guardar
                </button>
                <Link to={'/'} >
                    <button type="button" className="btn btn-primary m-2" >
                        Regresar
                    </button>
                </Link>
            </form>


        </div>
    )

}

export default Signup;