import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./authContext";

function Signup() {
    const { currentUser, handleSignup } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        birthdate: "",
        password: "",
    });
    const [formErrors, setFormErrors] = useState([]);

    console.debug(
        "SignupForm",
        "signup=", typeof handleSignup,
        "formData=", formData,
        "formErrors", formErrors,
    );

    /** Handle form submit:
     *
     * Calls signup func prop and, if successful, redirect to /.
     */

    async function handleSubmit(evt) {
        evt.preventDefault();
        console.log("formData in handleSubmit", formData);
        let result = await handleSignup(formData);
        if (result.success) {
        console.log('success in handleSubmit Signup')
        } else {
        setFormErrors(result.errors);
        }
    };

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormData(data => ({
            ...data,
            [name]: value
        }));
    };
    return <>
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            {currentUser && (
                <Navigate to="/" replace={true} />
            )}
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="CapTap"></img>
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign up for your account</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="flex items-center justify-between">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900">First Name</label>
                            <div className="mt-2">
                                <input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900">Last Name</label>
                            <div className="mt-2">
                                <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="birthdate" className="block text-sm font-medium leading-6 text-gray-900">Birthdate</label>
                        <div className="mt-2">
                            <input id="birthdate" name="birthdate" type="date" value={formData.birthdate} onChange={handleChange} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                        <div className="mt-2">
                            <input id="email" placeholder="ex: you@captap.com" name="email" type="email" value={formData.email} onChange={handleChange} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
                        <div className="mt-2">
                            <input id="username" autoComplete="username" name="username" type="text" value={formData.username} onChange={handleChange} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input id="password" autoComplete="current-password" name="password" type="password" value={formData.password} onChange={handleChange} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign up</button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                Already registered?
                    <a href="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Log In</a>
                </p>
            </div>
        </div>
    </>
}

export default Signup;