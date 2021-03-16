import { useState } from "react";
import { Field, Form, Formik } from "formik";

interface AddPetFormValues {
	petName: string;
	username: string;
}

interface AddPetFormProps {
	username: string;
}

export const AddPetForm = ({ username }: AddPetFormProps): JSX.Element => {
	const initialValues: AddPetFormValues = {
		petName: "",
		username: username,
	};

	const [errMessage, setErrMessage] = useState("");

	// Maybe use .env file for API url
	const handleSubmit = async (values: AddPetFormValues) => {
		try {
			const response = await fetch(
				`https://k7t0ap6b0i.execute-api.us-west-2.amazonaws.com/dev/users/${values.username}/tags/`,
				{
					method: "POST",
					headers: {
						"content-type": "application/json",
					},
					body: JSON.stringify({
						PetName: values.petName,
					}),
				}
			);
			if (!response.ok) {
				throw new Error("Failed submitting form");
			}
		} catch (error) {
			setErrMessage(error.message);
		}
	};

	return (
		<div>
			{errMessage.length && (
				<Formik initialValues={initialValues} onSubmit={handleSubmit}>
					<Form>
						<label htmlFor="petName">Pet Name</label>
						<Field name="petName" type="text" />
					</Form>
				</Formik>
			)}

			{/* If catch err in submit */}
			{!errMessage.length && (
				<ErrorComponent message={errMessage}></ErrorComponent>
			)}
		</div>
	);
};

const ErrorComponent = ({ message }: { message: string }) => {
	return <h1>{message}</h1>;
};
