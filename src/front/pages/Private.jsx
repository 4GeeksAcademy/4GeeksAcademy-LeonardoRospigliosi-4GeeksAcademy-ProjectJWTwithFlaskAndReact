import React, { useEffect, useState } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link, useNavigate } from "react-router-dom";

const Private = () => {

    const [email, setEmail] = useState('');
    const [id, setId] = useState('');
    const [activeFlag, setActiveFlag] = useState();
    const { store, dispatch } = useGlobalReducer();
    const [infodata, setInfoData] = useState();
    const [infoMe, setInfoMe] = useState();
    const navigate = useNavigate();



    const getUserInfo = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/private`,
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
            setEmail(dataResponse.email)
            setId(dataResponse.id)
            setActiveFlag(dataResponse.is_active)

            console.log(dataResponse)

        } catch (error) {
            console.error(error);
        }
    };

    const updateUserInfo = async () => {
        const dataBody = {
            "correo": email,
            "activo": activeFlag
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/private`,
                {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("access_token")}`
                    },
                    body: JSON.stringify(dataBody)
                }
            );

            if (!response.ok) { throw new Error("Ocurrio un error al llamar al updateUserInfo") }

            const dataResponse = await response.json();
            console.log(dataResponse)
            getUserInfo();

        } catch (error) {
            console.error(error);
        }
    };

    const handleLogOff = () => {
        sessionStorage.removeItem("access_token");
        navigate("/"); // Redirige a la página Home
    };

    const deleteUserInfo = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/private`,
                {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("access_token")}`
                    },
                }
            );

            if (!response.ok) { throw new Error("Ocurrio un error al llamar al endpoint login") }

            const dataResponse = await response.json();
            console.log(dataResponse)

            handleLogOff();

        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        const token = sessionStorage.getItem("access_token");
        if (!token) {
            navigate("/"); // redirige si no hay token
            return;
        }
        getUserInfo();
    }, [])


    return (
        <div className="container text-start mt-5">

            <h2 className="text-center"> Formulario Privado</h2>

            <div className="mb-3 mt-2 w-25">
                <label htmlFor="exampleInputEmail1" className="form-label">
                    id
                </label>
                <input
                    type="text"
                    className="form-control bg-light"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    value={id}
                    readOnly
                />

            </div>
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
                    is_active
                </label>
                <input
                    type="checkbox"
                    className="form-check-input ms-2"
                    id="isActiveCheckbox"
                    checked={activeFlag}
                    onChange={(e) => setActiveFlag(e.target.checked)}
                />
            </div>

            <button type="button" onClick={updateUserInfo} className="btn btn-primary m-2">
                Guardar
            </button>

            <button type="button" onClick={deleteUserInfo} className="btn btn-primary m-2">
                Eliminar
            </button>

            <Link to={'/'} >
                <button type="button" className="btn btn-primary m-2" >
                    Regresar
                </button>
            </Link>

        </div>
    )

}

export default Private;