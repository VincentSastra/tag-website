import { useState } from "react";
import { Field, Form, Formik } from "formik";
import ImageUploader from "react-images-upload";
import Auth from "@aws-amplify/auth";

interface AddPetFormValues {
	petName: string;
	tagId: string;
	img: string | null;
}

export const AddPetForm = (): JSX.Element => {
	const initialValues: AddPetFormValues = {
		petName: "",
		tagId: "",
		img: null,
	};

	// IDK if this is necessary or even working, feel free to remove
	const [errMessage, setErrMessage] = useState("");

	// Maybe use .env file for API url
	const handleSubmit = async (values: AddPetFormValues) => {
		try {
			console.log("Submitting....");
			const { username } = await Auth.currentUserInfo();

			// If there is img, will upload to S3
			if (values.img) {
				console.log("Image detected, uploading to S3");
				const parts = values.img.split(";");
				const data = parts[2];
				let response = await fetch(
					`https://k7t0ap6b0i.execute-api.us-west-2.amazonaws.com/dev/pet-img`,
					{
						method: "POST",
						headers: {
							"content-type": "application/json",
						},
						body: JSON.stringify({
							username,
							image: data,
							petName: values.petName,
						}),
					}
				).then((res) => res.json());
				console.log("S3 response", response);
				values.img = response.imageUrl;
			}

			// Invoke createTag lambda function
			const response = await fetch(
				`https://k7t0ap6b0i.execute-api.us-west-2.amazonaws.com/dev/users/${username}/tags/`,
				{
					method: "POST",
					headers: {
						"content-type": "application/json",
					},
					body: JSON.stringify(values),
				}
			);
			if (!response.ok) {
				throw new Error("Failed submitting form");
			}
			console.log("Success!");
		} catch (error) {
			console.error(error);
			setErrMessage(error.message);
		}
	};

	return (
		<div>
			{!errMessage.length && (
				<Formik initialValues={initialValues} onSubmit={handleSubmit}>
					{(formProps) => (
						<Form>
							{/* 
									To create another input just add the value into initialValues, label(optional) and Field
									Field id and name needs to be the same with the corresponding initialValue key
							 */}
							<label htmlFor="petName">Pet Name</label>
							<Field id="petName" name="petName" type="text" />
							<label htmlFor="tagId">Tag ID</label>
							<Field id="tagId" name="tagId" type="text" />
							<button type="submit">Submit</button>
							{/* ImageUploader highly customizable you can google for more info, just leave onChange as is */}
							<ImageUploader
								withIcon={true}
								singleImage={true}
								withPreview={true}
								buttonText="Choose an image"
								onChange={(pictures, pictureUrl) => {
									formProps.setFieldValue("img", pictureUrl[0]);
								}}
							/>
						</Form>
					)}
				</Formik>
			)}

			{/* If catch err in submit, idk if necessary or working */}
			{errMessage === "" && (
				<ErrorComponent message={errMessage}></ErrorComponent>
			)}
		</div>
	);
};

const ErrorComponent = ({ message }: { message: string }) => {
	return <h1>{message}</h1>;
};
