import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { UilArrowCircleLeft, UilCheckCircle, UilTimes } from '@iconscout/react-unicons';
import swal from 'sweetalert';
import axios from 'axios';
import Loader from './loader';

const EditMateriel = () => {
    const navigate = useNavigate();
    const { id } = useParams();
  
    const [formError, setFormError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [materielInput, setMaterielInput] = useState({
        num_serie: '',
        type_materiel: '',
        etat_materiel: '',
        description_probleme: '',
        image_materiel_url: '',
        id_demandeur: '',
        nom_entreprise: '',
        nom_demandeur: '',
        error_list: {},
    });
    
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/materiels/${id}`)
            .then((res) => {
                if (res.data.status === 200) {
                    setMaterielInput({
                        num_serie: res.data.materiel.num_serie,
                        type_materiel: res.data.materiel.type_materiel,
                        etat_materiel: res.data.materiel.etat_materiel,
                        description_probleme: res.data.materiel.description_probleme,
                        image_materiel_url: res.data.materiel.image_materiel_url,
                        id_demandeur: res.data.materiel.id_demandeur,
                        nom_entreprise: res.data.materiel.nom_entreprise,
                        nom_demandeur: res.data.materiel.nom_demandeur,
                        error_list: {},
                      });
                      
                    setIsLoading(false);
                } else if (res.data.status === 404) {
                    setIsLoading(false);
                    swal('Erreur', res.data.message, 'error');
                    navigate('/admin/materiels');
                }
            });
    }, [id, navigate]);

    const handleInput = (e) => {
        e.persist();
        setMaterielInput({ ...materielInput, [e.target.name]: e.target.value });
    };

    const displayFieldError = (fieldName) => {
        return materielInput.error_list[fieldName] ? 'is-invalid' : '';
    };

    const updateMateriel = (e) => {
        e.preventDefault();

        // Réinitialisez les messages d'erreur
        setMaterielInput({ ...materielInput, error_list: {} });
        setFormError("");

        // Validation côté client
        const errors = {};
        if (materielInput.type_materiel.trim() === "") {
            errors.type_materiel = "Type de matériel est requis";
        }
        if (materielInput.etat_materiel.trim() === "") {
            errors.etat_materiel = "État du matériel est requis";
        }

        if (Object.keys(errors).length > 0) {
            // Il y a des erreurs, affichez-les dans le formulaire
            const errorFields = Object.keys(errors).join(" et ");
            const errorString = `Les champs "${errorFields}" sont requis`;

            setMaterielInput({ ...materielInput, error_list: errors });
            setFormError(errorString);
            swal("Erreurs", errorString, "error");
        } else {
            // Pas d'erreurs, procéder à la requête Axios
            const data = {
                type_materiel: materielInput.type_materiel,
                etat_materiel: materielInput.etat_materiel,
                description_probleme: materielInput.description_probleme,
                image_materiel_url: materielInput.image_materiel_url,
                id_demandeur: materielInput.id_demandeur,
            };
            axios.put(`http://127.0.0.1:8000/api/materiels/${id}`, data)
                .then((res) => {
                    if (res.data.status === 200) {
                        swal('Success', res.data.message, 'success');
                        navigate('/admin/materiels');
                    } else if (res.data.status === 400) {
                        setMaterielInput({ ...materielInput, error_list: res.data.errors });
                    } else if (res.data.status === 404) {
                        swal("Erreur", res.data.message, "error");
                        navigate('/admin/materiels');
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    return (
        <div>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <h4>Modification de la demande</h4>
                                <NavLink to="/admin/materiels" className="btn btn-primary btn-sm float-end">
                                    <UilArrowCircleLeft /> Retour à l'affichage
                                </NavLink>
                            </div>
                            <div className="container">
                                <div className="card-body">
                                    {isLoading ? (
                                        <Loader />
                                    ) : (
                                        <form onSubmit={updateMateriel}>
                                            {formError && (
                                                <div className="alert alert-danger mb-3">
                                                    {formError}
                                                </div>
                                            )}

                                            <div className="form-group mb-3">
                                                <label htmlFor="type_materiel">Type du matériel</label>
                                                <input
                                                    type="text"
                                                    name="type_materiel"
                                                    className={`form-control ${displayFieldError('type_materiel')}`}
                                                    onChange={handleInput}
                                                    value={materielInput.type_materiel}
                                                />
                                                {materielInput.error_list.type_materiel && (
                                                    <div className="text-danger">
                                                        {materielInput.error_list.type_materiel}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="form-group mb-3">
                                                <label htmlFor="etat_materiel">État du matériel</label>
                                                <input
                                                    type="text"
                                                    name="etat_materiel"
                                                    className={`form-control ${displayFieldError('etat_materiel')}`}
                                                    onChange={handleInput}
                                                    value={materielInput.etat_materiel}
                                                />
                                                {materielInput.error_list.etat_materiel && (
                                                    <div className="text-danger">
                                                        {materielInput.error_list.etat_materiel}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="form-group mb-3">
                                                <label htmlFor="description_probleme">Description du Problème</label>
                                                <textarea
                                                    name="description_probleme"
                                                    className={`form-control ${displayFieldError('description_probleme')}`}
                                                    onChange={handleInput}
                                                    value={materielInput.description_probleme}
                                                />
                                                {materielInput.error_list.description_probleme && (
                                                    <div className="text-danger">
                                                        {materielInput.error_list.description_probleme}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="form-group mb-3">
                                                <label htmlFor="image_materiel_url">URL de l'Image du Matériel</label>
                                                <input
                                                    type="text"
                                                    name="image_materiel_url"
                                                    className={`form-control ${displayFieldError('image_materiel_url')}`}
                                                    onChange={handleInput}
                                                    value={materielInput.image_materiel_url}
                                                />
                                                {materielInput.error_list.image_materiel_url && (
                                                    <div className="text-danger">
                                                        {materielInput.error_list.image_materiel_url}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="form-group mb-3">
                                                <label htmlFor="id_demandeur">ID du Demandeur</label>
                                                <input
                                                    type="text"
                                                    name="id_demandeur"
                                                    className={`form-control ${displayFieldError('id_demandeur')}`}
                                                    onChange={handleInput}
                                                    value={materielInput.id_demandeur}
                                                />
                                                {materielInput.error_list.id_demandeur && (
                                                    <div className="text-danger">
                                                        {materielInput.error_list.id_demandeur}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="row">
                                                <div className="col">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary btn-block mb-2"
                                                    >
                                                        <UilCheckCircle size="20" /> Confirmer
                                                    </button>
                                                </div>
                                                <NavLink to="/admin/materiels" className="col">
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary btn-block mb-2"
                                                    >
                                                        <UilTimes size="20" /> Annuler
                                                    </button>
                                                </NavLink>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditMateriel;
