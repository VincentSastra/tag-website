import React, { useState } from "react";
import { Formik } from "formik";
import {Button, Card, Container, Form} from "react-bootstrap";
import ImageUploader from "react-images-upload";
import Auth from "@aws-amplify/auth";

interface AddPetFormValues {
	petName: string;
	tagId: string;
	img: string | null;
}

const ErrorComponent = ({ message }: { message: string }) => {
	return (<h1>{message}</h1>);
}

export function PetForm(): JSX.Element {
	const initialValues: AddPetFormValues = {
		petName: "",
		tagId: "",
		img: null,
	};

	// IDK if this is necessary or even working, feel free to remove
	const [errMessage, setErrMessage] = useState("");

	// Maybe use .env file for API url
	const handleSubmit = async (values: AddPetFormValues) => {
		console.log("Submitting...")
		try {
			console.log("Submitting....");
			const {username} = await Auth.currentUserInfo();

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
		<Container>
			<Card style={{maxWidth: "500px", margin: "1.5rem auto"}}>
				<Card.Body>
					{!errMessage.length && (
						<Formik initialValues={initialValues} onSubmit={handleSubmit}>
							{(formProps) => (
								<Form>
									<Form.Group>
										<Form.Label>Pet Name</Form.Label>
										<Form.Control name="petName" type="text" placeholder="Enter email"/>
									</Form.Group>

									<Form.Group>
										<Form.Label>Tag ID</Form.Label>
										<Form.Control name="tagId" type="text" placeholder="Enter email"/>
									</Form.Group>
									{/*
										To create another input just add the value into initialValues, label(optional) and Field
										Field id and name needs to be the same with the corresponding initialValue key
								 */}
									<ImageUploader
										withIcon={true}
										singleImage={true}
										withPreview={true}
										buttonText="Choose an image"
										onChange={(pictures, pictureUrl) => {
											formProps.setFieldValue("img", pictureUrl[0]);
										}}
									/>
									<Button style={{float: "right"}} variant="primary" type="submit">
										Submit
									</Button>
								</Form>
							)}
						</Formik>
					)}

					{/* If catch err in submit, idk if necessary or working */}
					{errMessage === "" && (
						<ErrorComponent message={errMessage}/>
					)}
				</Card.Body>
			</Card>
		</Container>
	)
}
