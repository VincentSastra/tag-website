import { useState } from "react";
import { Field, Form, Formik } from "formik";
import Auth from "@aws-amplify/auth";

interface AddPetFormValues {
	petName: string;
}

export const AddPetForm = (): JSX.Element => {
	const initialValues: AddPetFormValues = {
		petName: "",
	};

	const [errMessage, setErrMessage] = useState("");

	// Maybe use .env file for API url
	const handleSubmit = async (values: AddPetFormValues) => {
		try {
			console.log("Submitting....");
			console.log(values.petName);
			const { username } = await Auth.currentUserInfo();
			const response = await fetch(
				`https://k7t0ap6b0i.execute-api.us-west-2.amazonaws.com/dev/users/${username}/tags/`,
				{
					method: "POST",
					headers: {
						"content-type": "application/json",
					},
					body: JSON.stringify({
						petName: values.petName,
						TagId: "123",
					}),
				}
			);
			if (!response.ok) {
				throw new Error("Failed submitting form");
			}
			console.log("Success!");
		} catch (error) {
			setErrMessage(error.message);
		}
	};

	return (
		<div>
			{!errMessage.length && (
				<Formik initialValues={initialValues} onSubmit={handleSubmit}>
					<Form>
						<label htmlFor="petName">Pet Name</label>
						<Field id="petName" name="petName" type="text" />
						<button type="submit">Submit</button>
					</Form>
				</Formik>
			)}

			{/* If catch err in submit */}
			{errMessage === "" && (
				<ErrorComponent message={errMessage}></ErrorComponent>
			)}
		</div>
	);
};

const ErrorComponent = ({ message }: { message: string }) => {
	return <h1>{message}</h1>;
};
