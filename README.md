Final Report: 
    ./Documentation/Final Report.pdf

Application Documentation:
    https://app.swaggerhub.com/apis-docs/pfs4/inventory/5.0#/ (Live Link, Free Trial May have Expired)
    ./Documentation/Application_Documentation_SwaggerFileExported.pdf (Exported PDF)

Application:

    Set Up Instructions

        1. In terminal or Command Prompt, Run `npm install`
        2. Confirm npm is installed on system

        3. In Postman, import Collections file
                ./Postman Collections/pfscollections.json
        4. Import ./key.pem to Certificates Tab in Settings. This is the client Certificate and must be used for TLS to authenticate

    Running Application

        1. Run `node server.js` or `nodemon server.js`
        2. Server will be running at `locahost:5000`

        3. Send Requests from Postman Tabs. Request Body should already have data.
        4. Consult Swagger File to change data which fits within the structure of the API resources. Additionally, Consult Swagger File (Live link in Report or PDF Export in Documentation Directory) for API Endpoints / URLs.


Note: Exported Database Collections is only for reference, the API does not use these files in any way.

