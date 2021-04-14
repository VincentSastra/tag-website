# The Animal Guardian - Website

A website for CPEN 391 project. Main entrypoint is in ./src/App.tsx \
Contains 3 main pages:
   * **./pages/home.tsx** : The landing page where the user can see the aggregate informations & a list of all registered animal 
   * **./pages/pets.tsx** : Detailed view of a specific animal. This paged can only be accessed through clicking an icon in the home page because args are passed as props
   * **./pages/petForm.tsx** : The animal registration paged where users can register their animal along with its tag
   
## Features
* **Real-time data & Notifications**: Each page establishes a web-socket connection with the AWS serverless backend. These web-socket will send a message if there is an alert & the webpage will automatically generate a notification toast. This design can also be easily extended to run in the device's background using service worker although service worker feature has not been implemented as of this version.

* **Interactive Maps**: Using Leaflet, the maps can be dynamic & automatically pan as the website receive new data. Moreover there is a Geofence editor that lets user set & change the pet's Geofence using an intuitive UI.

* **User Account Management & Authentication**: Using Amplify, the website have secure account registration and login system. Moreover this ensures authentication is needed to access certain resources.

## Tech Stack
* React
* TypeScript
* Bootstrap
* Leaflet for maps
* Chart js for graphs

## Dev Setup
This webapp requires AWS Amplify & User Cognito Pool to be already setup. We can setup the AWS environment variables using the following commands:

> npm install -g @aws-amplify/cli

> amplify init

> amplify pull --appId {SECRET-APP-ID} --envName {SECRET-ENV-NAME}

Where Secret-App-Id is the Application ID & Secret-Env-Name is the environmnet name in AWS Amplify. This will generate a **./aws-exports.js** file, this file have sensitive information so **do not push this to the repository.**